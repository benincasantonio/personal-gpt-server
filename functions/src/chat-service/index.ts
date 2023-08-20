import * as cors from 'cors';
import * as express from 'express';
import {
    addMessage,
    createChat,
    getChats,
} from './controllers/chat-controller';
// eslint-disable-next-line max-len
import { validateCustomToken } from '../common/middlewares/validate-custom-token';

const app = express();
app.use(express.json());

app.use(cors({ origin: true }));

app.get('/', (req, res) => {
    res.send('Hello World!');
});

app.post('/chat', validateCustomToken, createChat);

app.get('/chat', validateCustomToken, getChats);

app.post('/chat/:chatId/message', addMessage);

export default app;
