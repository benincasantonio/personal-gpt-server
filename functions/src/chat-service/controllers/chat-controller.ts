import { Request, Response, NextFunction } from 'express'; /*
import { ChatMessage } from '../models/chat-message'; */
import { getFirestore, Firestore } from 'firebase-admin/firestore';
import { OpenAIApi } from 'openai'; /*
import { Chat } from '../models/chat';
 */
/**
 * ChatController
 * @description ChatController
 * @class ChatController
 * @implements {ChatController}
 * @example new ChatController()
 * @version 1.0.0
 */
export class ChatController {
    firestore: Firestore;

    public constructor(private openAI: OpenAIApi) {
        this.firestore = getFirestore();
        console.log(this.openAI);
    }

    async createChat(
        req: Request,
        res: Response,
        next: NextFunction
    ): Promise<void> {
        /* const { message } = req.body;

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

        const chat: Chat = new Chat('', '', 'gpt-3.5-turbo', messages);

        const newCompletion = await this.openAI.createChatCompletion({
            model: '',
            messages: chat.messages,
        });

        newCompletion.data.choices.forEach((choice) => {
            chat.messages.push({
                role: choice.message?.role ?? 'assistant',
                message: choice.message?.content ?? '',
                sendedAt: new Date(),
            });
        });

        await this.firestore.collection('chats').doc().set(chat); */

        res.send('Ciao');
    }
}
