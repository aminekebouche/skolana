import { InvalidDataError } from './InvalidDataError';
import validator from 'validator';
import pwdValidator from 'password-validator';

const capitalizeFirstLetter = (input: string) => {
    if (typeof input !== 'string') return input;
    return input.charAt(0).toUpperCase() + input.slice(1).toLowerCase();
};

const emailNormalizator = (input: string) => {
    if (!validator.isEmail(input)) {
        throw new InvalidDataError('Email not valid');
    } else {
        return validator.normalizeEmail(input, { all_lowercase: true });
    }
};

const dataHidder = (input: { [key: string]: any }) => {
    const user = { ...input };
    delete user.password;
    delete user.__v;
    delete user.ownEvents;
    delete user.ownStudySos;
    delete user.ownMentorMatch;
    delete user.ownDocs;
    delete user.likedEvents;
    delete user.repliedSos;
    delete user.mentorSubsecribers;
    delete user.savedDocs;
    delete user.authToken;
    return user;
};

const dataHidder_secondLevel = (input: { [key: string]: any }) => {
    const user = input;
    delete user.password;
    //delete user._id;
    delete user.__v;
    delete user.email;
    delete user.basketLoveReceived;
    delete user.basketLoveSent;
    delete user.listOfFriends;
    return user;
};

const passwordValidator = (input: string) => {
    const schema = new pwdValidator();
    schema.is().min(8).is().max(20).has().uppercase().has().symbols().has().lowercase().has().digits(2).has().not().spaces().is().not().oneOf(['Passw0rd', 'Password123']);
    return schema.validate(input);
};

export default { capitalizeFirstLetter, emailNormalizator, dataHidder, passwordValidator, dataHidder_secondLevel };
