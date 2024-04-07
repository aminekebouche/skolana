import express from 'express';
import { NextFunction, Request, Response } from 'express';
import ctrlUser from '../controllers/User';
import passport from 'passport';
import authentification from '../middleware/Authentication';


import { PDFDocument } from 'pdf-lib';

var fs = require('fs');

const router = express.Router();

router.post('/register', ctrlUser.register);
router.post('/login', ctrlUser.login);
router.post('/update',authentification,  ctrlUser.update);
router.get('/docs',authentification,  ctrlUser.getsDocsPurchased);
router.post('/logout', ctrlUser.logout);

router.get('/auth/google', passport.authenticate('google', { scope: ['profile', 'email'] }));

export default router;
