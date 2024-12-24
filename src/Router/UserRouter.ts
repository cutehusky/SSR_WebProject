import express from 'express';
import { UserController } from '../Controllers/UserController';

const router = express.Router();

const userController = new UserController();

router.get('/forgot-password', userController.forgotPassword);
router.get('/profile', userController.getUserProfile);

router.post('/login', async (req, res, next) => {
  try {
	await userController.logIn(req, res, next);
  } catch (error) {
	next(error);
  }
});
router.post('/logout',  (req, res) => {
    req.session.authUser = null;
    res.redirect("/");
});
router.post('/register', async (req, res, next) => {
  try {
    await userController.register(req, res, next);
  } catch (error) {
    next(error);
  }
});
router.post('/send-otp', async(req, res, next) =>{
  try {
    await userController.sendOTP(req, res, next);
  } catch (error) {
    next(error);
  }
});
router.post('/reset-password-by-otp', (req, res) => {
  userController.resetPasswordByOTP(req, res);
});

router.post('/reset-password', async (req, res, next)=> {
  try {
    await userController.resetPassword(req, res, next);
  } catch (error) {
    next(error);
  }
});

router.post('/update-profile', async (req, res, next) => {
  try {
    await userController.updateProfile(req, res, next);
  } catch (error) {
    next(error);
  }
});
export { router as UserRouter };
