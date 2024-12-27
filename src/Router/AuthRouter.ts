import { Request, Response } from 'express';
import express from 'express';
import passport from 'passport';

import { UserController } from '../Controllers/UserController';

const router = express.Router();
const userController = new UserController();

router.get(
    '/google',
    passport.authenticate('google', { scope: ['email', 'profile'] })
);

router.get(
    '/google/callback',
    passport.authenticate('google', {
        successRedirect: '/auth/google/success',
        failureRedirect: '/auth/google/failure',
    })
);

router.get('/google/success', userController.googleRegister);

router.get('/google/failure', (req: Request, res: Response) => {
    res.redirect('/');
});

export { router as GoogleAuthRouter };
