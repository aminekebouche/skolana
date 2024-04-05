import { NextFunction, Request, Response } from 'express';
import Comment, { IComment } from '../models/Comment';
import { IUser } from '../models/User';

const createComment = async (req: Request, res: Response, next: NextFunction) => {
    const { content } = req.body;
    const author = req.user;
    try {
        const post = await Comment.create({ content, author });
        console.log(post);
        res.status(201).json({
            post
        });
    } catch (error) {
        res.status(501).json({
            error
        });
    }
};

export default { createComment };
