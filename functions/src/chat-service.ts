import cors from 'cors';
import express from 'express';
import * as functions from 'firebase-functions';

const app = express();
app.use(express.json());

app.use(cors({ origin: true }));

app.get('/', (req, res) => {
    res.send('Hello World!');
});

export default functions.https.onRequest(app);
