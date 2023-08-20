import { Request, Response, NextFunction } from 'express';
import * as admin from 'firebase-admin';

const firestore = admin.firestore();

const auth = admin.auth();

export async function createUser(
    req: Request,
    res: Response,
    next: NextFunction
) {
    const { email, password, firstName, lastName, dateOfBirth } = req.body;

    if (!email || !password || !firstName || !lastName) {
        res.status(400).send({
            message: 'Email, password, firstName and lastName are required',
        });
        return;
    }

    const authUser = await auth.createUser({
        email,
        password,
    });

    const userInfo = {
        email,
        firstName,
        lastName,
        dateOfBirth,
        userId: authUser.uid,
    };

    await firestore.collection('users').doc(authUser.uid).set(userInfo);

    res.send(userInfo);
}

export async function login(req: Request, res: Response, next: NextFunction) {
    const { email, password } = req.body;

    if (!email || !password) {
        res.status(400).send({
            message: 'Email and password are required',
        });
        return;
    }

    const authUser = await auth.getUserByEmail(email);

    if (!authUser) {
        res.status(404).send({
            message: 'User not found',
        });
        return;
    }

    const token = await auth.createCustomToken(authUser.uid);

    res.send({
        token,
    });
}
