import * as cors from 'cors';
import * as express from 'express';
import { createUser, login } from './controllers/auth-controller';

const app = express();
app.use(express.json());

app.use(cors({ origin: true }));

app.get('/', (req, res) => {
    res.send('Hello World!');
});

app.post('/auth/register', createUser);

app.post('/auth/login', login);

export default app;
