import * as admin from 'firebase-admin';
admin.initializeApp();

import chatService from './chat-service';
import { onRequest } from 'firebase-functions/v2/https';
import { onChatDocumentCreated } from './chat-triggers';

exports.onChatDocumentCreated = onChatDocumentCreated;

exports.chat = onRequest(chatService);
