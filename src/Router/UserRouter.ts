import express from 'express';
import { UserController } from '../Controllers/UserController';
import ErrorHandler from "../Utils/ErrorHandle";

const router = express.Router();

const userController = new UserController();

router.get('/forgot-password', ErrorHandler(userController.forgotPassword));
router.post('/forgot-password', ErrorHandler(userController.forgotPasswordPost));

router.get('/forgot-password-email', ErrorHandler(userController.forgotPasswordEmail));
router.post('/forgot-password-email', ErrorHandler(userController.forgotPasswordEmailPost));
router.post('/resent-otp', ErrorHandler(userController.resentOTP));

router.get('/profile',userController.isLoggedIn, ErrorHandler(userController.getUserProfile));

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
router.post('/reset-password-by-otp', async (req, res) => {
  await userController.resetPasswordByOTP(req, res);
});

router.post('/reset-password', async (req, res, next)=> {
  try {
    await userController.resetPassword(req, res, next);
  } catch (error) {
    next(error);
  }
});

router.post('/update-profile', userController.isLoggedIn, async (req, res, next) => {
  try {
    await userController.updateProfile(req, res, next);
  } catch (error) {
    next(error);
  }
});

router.post('/add-premium', ErrorHandler(userController.addPremium));

export { router as UserRouter };
