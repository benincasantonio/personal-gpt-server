import chatService from './chat-service';
import { onRequest } from 'firebase-functions/v2/https';
import * as admin from 'firebase-admin';

admin.initializeApp();

exports.chat = onRequest(chatService);
