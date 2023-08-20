import { ChatMessage } from './chat-message';

/**
 * Chat model
 * @class Chat
 */
export class Chat {
    /**
     * Chat model
     * @class Chat
     * @property {string} id - Chat id
     * @property {string} name - Chat name
     * @property {ChatMessage[]} messages - Chat messages
     * @property {string[]} participants - Chat participants
     * @property {Date} createdAt - Chat creation date
     * @property {string} model - OpenAI model
     */
    constructor(
        public readonly name: string | undefined,
        public readonly model: string,
        public readonly messages: ChatMessage[],
        public readonly participants: string[],
        public readonly createdAt: Date = new Date(),
        public readonly id: string | undefined = undefined
    ) {}
}
