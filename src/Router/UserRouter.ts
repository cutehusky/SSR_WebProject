import express from 'express';
import { UserController } from '../Controllers/UserController';

const router = express.Router();

const userController = new UserController();

router.get('/forgot-password', userController.forgotPassword);
router.post('/forgot-password', userController.forgotPasswordPost);

router.get('/forgot-password-email', userController.forgotPasswordEmail);
router.post('/forgot-password-email', userController.forgotPasswordEmailPost);

router.get('/profile/:id', userController.getUserProfile);

router.post('/login', async (req, res, next) => {
  try {
	await userController.logIn(req, res, next);
  } catch (error) {
	next(error);
  }
});
router.post('/register', async (req, res, next) => {
  try {
    await userController.register(req, res, next);
  } catch (error) {
    next(error);
  }
});
router.post('/send-otp', userController.sendOTP);
router.post('/reset-password-by-otp', userController.resetPasswordByOTP);
router.post('/reset-password', userController.resetPassword);

export { router as UserRouter };
