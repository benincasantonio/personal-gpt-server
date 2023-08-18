import cors from 'cors';
import express from 'express';
import { Configuration, OpenAIApi } from 'openai';
import { ChatController } from './controllers/chat-controller';

const app = express();
app.use(express.json());

app.use(cors({ origin: true }));

const configuration = new Configuration({
    apiKey: process.env.OPENAI_API_KEY,
});

const openai = new OpenAIApi(configuration);

const chatController = new ChatController(openai);

app.get('/', (req, res) => {
    res.send('Hello World!');
});

app.post('/chat', chatController.createChat);

export default app;
