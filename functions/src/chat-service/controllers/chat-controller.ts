import { Request, Response, NextFunction } from 'express';
import { ChatMessage } from '../models/chat-message';
import { type Firestore } from 'firebase-admin/firestore';
import * as admin from 'firebase-admin';
import { Configuration, OpenAIApi } from 'openai';
import { Chat } from '../models/chat';
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

    const chat: Chat = new Chat('', 'gpt-3.5-turbo', messages);

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
    await firestore.collection('chats').doc().set(chatRef);

    res.send(chat);
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
        .withConverter(chatNameListConverter)
        .select('name', 'createdAt')
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
