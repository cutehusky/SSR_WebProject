import express from 'express';
import { UserController } from '../Controllers/UserController';

const router = express.Router();

const userController = new UserController();

router.get('/forgot-password', userController.forgotPassword);
router.get('/profile/:id', userController.getUserProfile);

router.post('/login', userController.logIn);
router.post('/register', userController.register);
router.post('/send-otp', userController.sendOTP);
router.post('/reset-password-by-otp', userController.resetPasswordByOTP);
router.post('/reset-password', userController.resetPassword);

export { router as UserRouter };
