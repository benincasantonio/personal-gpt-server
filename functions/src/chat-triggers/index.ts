import { onDocumentCreated } from 'firebase-functions/v2/firestore';
import { Configuration, OpenAIApi } from 'openai';

const openAIConfiguration = new Configuration({
    apiKey: process.env.OPENAI_API_KEY,
});

const openAI = new OpenAIApi(openAIConfiguration);

export const onChatDocumentCreated = onDocumentCreated(
    'chats/{chatId}',
    async (event) => {
        // Find a name for the chat with the OpenAI API
        const snapshot = event.data;

        if (!snapshot) {
            return;
        }

        const chat = snapshot.data();

        if (!chat) {
            return;
        }

        const messages = chat.messages.map((message: any) => ({
            role: message.role,
            content: message.message,
        }));

        const newCompletion = await openAI.createChatCompletion({
            model: chat.model,
            messages: [
                ...messages,
                {
                    role: 'system',
                    content:
                        // eslint-disable-next-line max-len
                        'Your goal is to find a name for this chat based on the messages on the other messages, just answer with the title',
                },
            ],
        });

        if (newCompletion.data.choices && newCompletion.data.choices.length) {
            chat.name = newCompletion.data.choices[0].message?.content;
        }

        await snapshot.ref.update(chat);
    }
);
