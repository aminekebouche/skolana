import mongoose, { Schema, Document } from 'mongoose';
import normalizator from '../library/DataNormalizator';
import { InvalidDataError } from '../library/InvalidDataError';
import security from '../library/PasswordSecurity';
import jwt from 'jsonwebtoken';
import { config } from '../config/config';

export interface IUser extends Document {
    firstname: string;
    lastname: string;
    birthdate: Date;
    email: string;
    password: string;
    university: string;
    avatar: string;
    publicKey: string;
    docs : string[];
    generateAuthTokenAndSaveUser(): Promise<string>;
    
}

const UserSchema: Schema = new Schema({
    firstname: { type: String, required: true },
    lastname: { type: String, required: true },
    birthdate: { type: Date },
    email: { type: String, required: true, unique: true },
    password: { type: String },
    university: { type: String },
    authToken: { type: String },
    avatar: { type: String },
    publicKey: {type: String},
    docs: [
        {
            type: String
        }
    ],

});

UserSchema.methods.generateAuthTokenAndSaveUser = async function () {
    const authToken = jwt.sign({ _id: this._id }, config.jwt.secret, { expiresIn: '1h' });
    this.authToken = authToken;
    const res = await this.save({ validateBeforeSave: false });
    console.log(res);
    return authToken;
};

UserSchema.pre('save', function (next, options) {
    try {
        if (options.validateBeforeSave) {
            this.firstname = normalizator.capitalizeFirstLetter(this.firstname);
            this.lastname = normalizator.capitalizeFirstLetter(this.lastname);
            this.university = normalizator.capitalizeFirstLetter(this.university);
            this.email = normalizator.emailNormalizator(this.email);
            this.authToken = '';
            console.log('PRESAVE ' + this.email);
            if (this.password) this.password = security.hashPassword(this.password);
        }
    } catch (error) {
        if (error instanceof InvalidDataError) {
            throw error;
        } else {
            throw error;
        }
    }

    next();
});

export default mongoose.model<IUser>('User', UserSchema);
