import * as cors from 'cors';
import * as express from 'express';
import {
    addChatInstruction,
    addMessage,
    createChat,
    getChats,
} from './controllers/chat-controller';
// eslint-disable-next-line max-len
import { validateIdToken } from '../common/middlewares/validate-custom-token';

const app = express();
app.use(express.json());

app.use(cors({ origin: true }));

app.get('/', (req, res) => {
    res.send('Hello World!');
});
app.post('/chat', validateIdToken, createChat);

app.get('/chat', validateIdToken, getChats);

app.post('/chat/:chatId/instruction', validateIdToken, addChatInstruction);

app.post('/chat/instruction', validateIdToken, addChatInstruction);

app.post('/chat/:chatId/message', validateIdToken, addMessage);

export default app;
