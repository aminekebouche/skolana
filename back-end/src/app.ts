import Logging from './library/Logging';
import express, { Request, Response } from 'express';
import session from 'express-session';
import { config } from './config/config';
import mongoose from 'mongoose';
import userRouter from './routes/User';
import postRouter from './routes/Post';
import CommentRouter from './routes/Comment';
import passport from 'passport';
import cors from 'cors';
import cookieParser from 'cookie-parser';

mongoose
    .set('strictQuery', true)
    .connect(config.mongo.url, { retryWrites: true, w: 'majority' })
    .then(() => Logging.info('Connexion à MongoDB réussie !'))
    .catch((err) => Logging.info('Connexion à MongoDB échouée !' + err));

const app = express();

app.use(express.urlencoded({ extended: true }));

app.use(express.json());

app.use('/uploads', express.static('uploads'));

app.use(
    cors({
        origin: config.client.url, // Autorise uniquement l'origine 'http://localhost:3000'
        credentials: true,
        methods: 'GET,HEAD,PUT,PATCH,POST,DELETE',
        allowedHeaders: 'Content-Type, Authorization, Origin, X-Reqyested-With'
    })
);
app.use(cookieParser());

app.use(
    session({
        secret: 'secret',
        resave: false,
        saveUninitialized: false,
        cookie: { secure: false, httpOnly: true } // Définissez "secure: true" en production avec HTTPS
    })
);

app.set('port', config.server.port);

app.use((req, res, next) => {
    Logging.info(`Incomming - METHODE: [${req.method}] - Url: [${req.url}] - IP: [${req.socket.remoteAddress}]`);

    res.on('finish', () => {
        Logging.info(`Result - METHODE: [${req.method}] - Url: [${req.url}] - IP: [${req.socket.remoteAddress}] - Status: [${res.statusCode}]`);
    });
    console.log('trace req');
    next();
});

// app.use((req, res, next) => {
//     res.header('Access-Control-Allow-Origin', 'http://localhost:3000');
//     res.header('Access-Control-Allow-Credentials', 'true');
//     res.header('Access-Control-Allow-Headers', 'Origin, X-Reqyested-With, Content-Type, Accept, Authorization');

//     if (req.method == 'OPTIONS') {
//         res.header('Access-Control-Allow-Methods', 'PUT, POST, PATCH, DELETE, GET');
//         return res.status(200).json({});
//     }
//     console.log('cors');

//     next();
// });

app.get('/ping', (req, res, next) => {
    res.status(200).json({ message: 'pong' });
});
app.use('/user', userRouter);
app.use('/post', postRouter);
app.use('/comment', CommentRouter);

app.get('/auth/google/callback', passport.authenticate('google', { failureRedirect: config.client.url }), function (req: any, res: Response) {
    // Successful authentication, redirect home.
    const email = req.user?.email;
    const secret = req.user?.secret;
    res.redirect(`${config.client.url}?email=${email}&secret=${secret}`);
});

app.use(passport.initialize());
require('./middleware/google-auth')(passport);

app.use((req, res, next) => {
    console.log('Fonction verif token');
    next();
});

app.use((req, res, next) => {
    console.log('not found');

    const error = new Error('not found');
    return res.status(400).json({ message: error.message });
});

export default app;
