import { Strategy as GoogleStrategy } from 'passport-google-oauth20';
import { config } from '../config/config';
import User, { IUser } from '../models/User';

module.exports = (passport: any) => {
    passport.serializeUser(function (user: IUser, done: any) {
        done(null, user.id);
    });
    passport.deserializeUser(function (id: any, done: any) {
        User.findById(id, function (err: any, user: IUser) {
            done(err, user);
        });
    });
    passport.use(
        new GoogleStrategy(
            {
                clientID: config.google.client_id,
                clientSecret: config.google.client_secret,
                callbackURL: '/auth/google/callback'
            },
            function (accessToken, refreshToken, profile, cb) {
                User.findOne({ googleId: profile.id }, (err: any, user: IUser) => {
                    const updatedUser = {
                        firstname: profile.name?.givenName || profile._json.given_name,
                        lastname: profile.name?.familyName || profile._json.family_name,
                        email: profile._json.email,
                        googleId: profile.id,
                        profilePicture: profile._json.picture,
                        secret: accessToken
                    };
                    if (user) {
                        User.findOneAndUpdate({ _id: user.id }, { $set: updatedUser }, { new: true }).then((result) => {
                            if (result) {
                                return cb(err, result);
                            }
                        });
                    } else {
                        const newUser = new User(updatedUser);
                        newUser.save().then((result) => {
                            return cb(err, result);
                        });
                    }
                });
            }
        )
    );
};
