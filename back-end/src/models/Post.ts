import mongoose, { Schema, Document } from 'mongoose';
import { IUser } from '../models/User';
import autopopulate from 'mongoose-autopopulate';

export interface IPost extends Document {
    author: IUser;
    likes: IUser[];
    content: string;
}

const PostSchema: Schema = new Schema({
    author: {
        type: mongoose.Schema.Types.ObjectId,
        ref: 'User',
        required: true,
        autopopulate: true
    },
    type: {
        type: String,
        enum: ['Service', 'Document', 'Question'],
        require: true
    },
    likes: [
        {
            type: mongoose.Schema.Types.ObjectId,
            ref: 'User'
        }
    ],

    content: { type: String },

    comments: [
        {
            type: mongoose.Schema.Types.ObjectId,
            ref: 'Comment',
            autopopulate: true
        }
    ],

    documents: [
        {
            type: String
        }
    ],

    createdAt: { type: Date, default: Date.now }
});

PostSchema.plugin(autopopulate);
export default mongoose.model<IPost>('Post', PostSchema);
