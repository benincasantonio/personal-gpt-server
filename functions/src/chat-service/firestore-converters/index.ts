import {
    type QueryDocumentSnapshot,
    type DocumentData,
} from 'firebase-admin/firestore';
import { Chat } from '../../common/models/chat';

export const chatNameListConverter = {
    toFirestore(chat: Chat): DocumentData {
        return {
            name: chat.name,
            createdAt: chat.createdAt,
            messages: chat.messages,
            participants: chat.participants,
        };
    },
    fromFirestore(snapshot: QueryDocumentSnapshot): Chat {
        const data = snapshot.data();
        const createdAt = data.createdAt ? new Date(data.createdAt) : undefined;
        return new Chat(
            data.name || null,
            '',
            [],
            data.participants,
            createdAt,
            snapshot.id
        );
    },
};
