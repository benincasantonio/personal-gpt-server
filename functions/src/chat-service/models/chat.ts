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
     */
    constructor(
        public readonly name: string | undefined,
        public readonly model: string,
        public readonly messages: ChatMessage[]
    ) {}
}
