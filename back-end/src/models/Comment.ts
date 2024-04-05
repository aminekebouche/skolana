import mongoose, { Schema, Document } from 'mongoose';
import { config } from '../config/config';
import { IUser } from '../models/User';
import { IPost } from '../models/Post';

export interface IComment extends Document {
    author: IUser;
    likes: IUser[];
    content: string;
}

const CommentSchema: Schema = new Schema({
    author: {
        type: mongoose.Schema.Types.ObjectId,
        ref: 'User',
        required: true,
        autopopulate: true
    },
    likes: [
        {
            type: mongoose.Schema.Types.ObjectId,
            ref: 'User'
        }
    ],
    content: { type: String },
    responses: [
        {
            type: String
        }
    ]
});

export default mongoose.model<IComment>('Comment', CommentSchema);
