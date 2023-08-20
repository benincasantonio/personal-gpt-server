import * as admin from 'firebase-admin';
import { type NextFunction, type Request, type Response } from 'express';

export function validateIdToken(
    req: Request,
    res: Response,
    next: NextFunction
) {
    const auth = admin.auth();

    const idToken = req.header('Authorization');

    const tokenPrefix = 'Bearer ';
    if (!idToken || !idToken.startsWith(tokenPrefix)) {
        res.status(401).send({
            message: 'Unauthorized',
        });
        return;
    }

    const token = idToken.split(tokenPrefix)[1];

    auth.verifyIdToken(token)
        .then((decodedToken) => {
            req.user = decodedToken.uid;
            next();
        })
        .catch((error) => {
            console.error(error);
            res.status(401).send({
                message: 'Unauthorized',
            });
        });
}
