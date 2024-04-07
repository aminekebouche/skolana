import { NextFunction, Request, Response } from 'express';
import { InvalidDataError } from '../library/InvalidDataError';
import User, { IUser } from '../models/User';
import normalizator from '../library/DataNormalizator';
import security from '../library/PasswordSecurity';

const register = (req: Request, res: Response, next: NextFunction) => {
    const subscriber = new User({
        ...req.body
    });

    const avatar = `https://api.dicebear.com/8.x/pixel-art/svg?seed=${subscriber.firstname + subscriber.lastname}`;
    subscriber['avatar'] = avatar;

    User.findOne({ email: req.body.email })
        .then((user) => {
            if (user) throw new Error('Email address is already in use!');
            return subscriber.save({ validateBeforeSave: true }).then((subscriber) => {
                const userInfo = normalizator.dataHidder(subscriber.toObject());
                res.status(201).json({ userInfo });
            });
        })
        .catch((error) => {
            if (error instanceof InvalidDataError) {
                console.log(error.message);

                res.status(400).json({
                    error: {
                        message: error.message
                    }
                });
            } else if (error.code === 11000) {
                console.log(error);
                res.status(409).json({
                    error: {
                        message: 'Email address is already in use!'
                    }
                });
            } else {
                console.log(error.message);
                res.status(500).json({
                    error: {
                        message: error.message
                    }
                });
            }
        });
};

const login = async (req: Request, res: Response) => {
    try {
        const email = normalizator.emailNormalizator(req.body.username);
        const pwd = req.body.password;
        const user = await User.findOne({ email: email });
        const matchPassword = await security.comparePassword(pwd, user?.password || '');
        if (!user || !matchPassword) {
            res.status(403).json({
                message: 'Adress mail not exist or Invalid Password !'
            });
        } else {
            const currentUser = normalizator.dataHidder(user.toObject());
            const authToken = await user.generateAuthTokenAndSaveUser();
            res.cookie('authToken', authToken, {
                httpOnly: true
            })
                .status(200)
                .json(currentUser);
        }
    } catch (err) {
        console.log(err);
        res.status(500).json({ error: err });
    }
};

const update = async (req: Request, res: Response) => {
    try {
        const userToUpdate: any = req.user; 
        const updates = req.body; 

        console.log(updates)
        console.log(userToUpdate)

        const user: any = await User.findById(userToUpdate.id);

        
        
        if (!user) {
            res.status(403).json({
                message: 'User not found!'
            });
        } else {
            Object.keys(updates).forEach(key => {
                user[key] = updates[key];
            });

            await user.save();

        res.status(200).json({ message: 'User updated successfully.', user });
           
        }
    } catch (err) {
        console.log(err);
        res.status(500).json({ error: err });
    }
};

const getsDocsPurchased = async (req: Request, res: Response) => {
    try {
        const userToUpdate: any = req.user; 

        console.log(userToUpdate)

        const user: any = await User.findById(userToUpdate.id);

        
        
        if (!user) {
            res.status(403).json({
                message: 'User not found!'
            });
        } else {
            

            

        res.status(200).json({ message: 'User updated successfully.', user });
           
        }
    } catch (err) {
        console.log(err);
        res.status(500).json({ error: err });
    }
};

const logout = (req: Request, res: Response) => {
    res.clearCookie('authToken', {
        secure: true,
        sameSite: 'none'
    })
        .status(200)
        .json('User has been logged out.');
};

export default { register, login, logout, update, getsDocsPurchased };
