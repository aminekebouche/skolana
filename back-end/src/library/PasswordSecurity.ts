import bcrypt from 'bcrypt';
import { config } from '../config/config';
import validator from './DataNormalizator';
import { InvalidDataError } from './InvalidDataError';

const hashPassword = (input: string): string => {
    if (!validator.passwordValidator(input)) {
        throw new InvalidDataError('password is not valid !');
    } else {
        const salt = bcrypt.genSaltSync(config.salt.round);
        const hashedPassword = bcrypt.hashSync(input, salt);
        return hashedPassword;
    }
};

const comparePassword = (password: string, hash: string): Promise<boolean> => {
    console.log(hash);
    return new Promise((resolve, reject) => {
        bcrypt.compare(password, hash, (error, result) => {
            if (error) {
                reject(error);
            } else {
                resolve(result);
            }
        });
    });
};

export default { hashPassword, comparePassword };
