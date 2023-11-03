import { Request, Response, NextFunction } from 'express';
import { ChatMessage } from '../../common/models/chat-message';
import { type Firestore } from 'firebase-admin/firestore';
import * as admin from 'firebase-admin';
import { Configuration, OpenAIApi } from 'openai';
import { Chat } from '../../common/models/chat';
import { chatNameListConverter } from '../firestore-converters';

const firestore: Firestore = admin.firestore();

const configuration = new Configuration({
    apiKey: process.env.OPENAI_API_KEY,
});

const openAI = new OpenAIApi(configuration);

export async function createChat(
    req: Request,
    res: Response,
    next: NextFunction
): Promise<void> {
    const { message } = req.body;

    if (!message) {
        res.status(400).send({
            message: 'Message is required',
        });
    }

    const messages: ChatMessage[] = [
        {
            role: 'user',
            message: message,
            sendedAt: new Date(),
        },
    ];

    const chat: Chat = new Chat('', 'gpt-3.5-turbo', messages, [req.user]);

    const newCompletion = await openAI.createChatCompletion({
        model: chat.model,
        messages: chat.messages.map((message) => ({
            role: message.role,
            content: message.message,
        })),
    });
    newCompletion.data.choices.forEach((choice) => {
        chat.messages.push({
            role: choice.message?.role ?? 'assistant',
            message: choice.message?.content ?? '',
            sendedAt: new Date(),
        });
    });

    const chatRef = JSON.parse(JSON.stringify(chat));
    const result = await firestore.collection('chats').add(chatRef);

    res.send({
        id: result.id,
        ...chatRef,
    });
}

export async function getChats(
    req: Request,
    res: Response,
    next: NextFunction
): Promise<void> {
    const { page, pageSize } = req.query;

    if (!Number(page) || !Number(pageSize)) {
        res.status(400).send({
            message: 'Page and pageSize are required',
        });
        return;
    }

    const chatsRef = firestore
        .collection('chats')
        .select('name', 'createdAt', 'participants')
        .withConverter(chatNameListConverter)
        .orderBy('createdAt', 'desc')
        .limit(Number(pageSize))
        .offset((Number(page) - 1) * Number(pageSize));

    const chats = await chatsRef.get();

    const chatsList: Chat[] = [];

    chats.forEach((chat) => {
        chatsList.push({
            id: chat.id,
            createdAt: chat.data().createdAt,
            name: chat.data().name,
        } as Chat);
    });

    res.send(chatsList);
}

export async function addMessage(
    req: Request,
    res: Response,
    next: NextFunction
): Promise<void> {
    const { message } = req.body;

    if (!message) {
        res.status(400).send({
            message: 'Message is required',
        });
    }

    const chat = await firestore
        .collection('chats')
        .doc(req.params.chatId)
        .get();

    if (!chat) {
        res.status(404).send({
            message: 'Chat not found',
        });
    }

    const messages: ChatMessage[] = chat.data()?.messages ?? [];

    messages.push({
        role: 'user',
        message: message,
        sendedAt: new Date(),
    });

    const newCompletion = await openAI.createChatCompletion({
        model: chat.data()?.model,
        messages: messages.map((message) => ({
            role: message.role,
            content: message.message,
        })),
    });

    newCompletion.data.choices.forEach((choice) => {
        messages.push({
            role: choice.message?.role ?? 'assistant',
            message: choice.message?.content ?? '',
            sendedAt: new Date(),
        });
    });

    await firestore
        .collection('chats')
        .doc(req.params.chatId)
        .update({ messages: messages });

    res.send(messages);
}

export function addChatInstruction(
    req: Request,
    res: Response,
    next: NextFunction
): void {
    const { message } = req.body;
    const { chatId } = req.params;

    if (!message) {
        res.status(400).send({
            message: 'Message is required',
        });
    }
    const chatMessage: ChatMessage = {
        message: message,
        role: 'system',
        sendedAt: new Date(),
    };

    let chatRef;

    if (!chatId) {
        const chat = new Chat('', 'gpt-3.5-turbo', [], [req.user]);
        chatRef = firestore.collection('chats').doc();
        chatRef.set(chat);
    } else {
        chatRef = firestore.collection('chats').doc(chatId);
    }

    chatRef.update({
        messages: admin.firestore.FieldValue.arrayUnion(chatMessage),
    });

    res.send({
        id: chatRef.id,
        ...chatRef.get(),
    });
}
