import { NextFunction, Request, Response } from 'express';
import jwt from 'jsonwebtoken';
import { config } from '../config/config';
import User from '../models/User';

const authentification = async (req: Request, res: Response, next: NextFunction) => {
    try {
        const authToken = req.header('authToken')?.replace('Bearer ', '') || req.cookies.authToken;
        console.log('Hey ', req.cookies.authToken);
        if (!authToken) {
            throw new Error();
        }

        const decodedToken = jwt.verify(authToken, config.jwt.secret) as jwt.JwtPayload;

        const user = await User.findOne({ _id: decodedToken._id, authToken: authToken });

        if (!user) {
            throw new Error();
        }

        req.user = user;
        next();
    } catch (err) {
        res.status(401).json({ message: "You're not authenticated !" });
    }
};

export default authentification;
