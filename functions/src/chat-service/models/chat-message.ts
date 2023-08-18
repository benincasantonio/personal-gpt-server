import { ChatCompletionRequestMessageRoleEnum } from 'openai';

/**
 * ChatMessage model
 * @class ChatMessage
 * @property {string} role - Role
 * @property {string} message - Message
 * @property {Date} sendedAt - Sended at
 */
export class ChatMessage {
    /**
     * ChatMessage model
     * @class ChatMessage
     * @property {ChatCompletionRequestMessageRoleEnum} role - Role
     * @property {string} message - Message
     * @property {Date} sendedAt - Sended at
     */
    constructor(
        public readonly role: ChatCompletionRequestMessageRoleEnum,
        public readonly message: string,
        public readonly sendedAt: Date
    ) {}
}
