import * as cors from 'cors';
import * as express from 'express';
import { createChat, getChats } from './controllers/chat-controller';

const app = express();
app.use(express.json());

app.use(cors({ origin: true }));

app.get('/', (req, res) => {
    res.send('Hello World!');
});

app.post('/chat', createChat);

app.get('/chat', getChats);

export default app;
