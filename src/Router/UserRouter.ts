import express from 'express';
import { UserController } from '../Controllers/UserController';
import { recaptcha } from '../Utils/recaptcha';

const router = express.Router();

const userController = new UserController();

router.get('/forgot-password', userController.forgotPassword);
router.post('/forgot-password', userController.forgotPasswordPost);

router.get('/forgot-password-email', userController.forgotPasswordEmail);
router.post('/forgot-password-email', userController.forgotPasswordEmailPost);
router.post('/resent-otp', userController.resentOTP);

router.get('/profile',userController.isLoggedIn, userController.getUserProfile);

router.post('/login', async (req, res, next) => {
  try {
	await userController.logIn(req, res, next);
  } catch (error) {
	next(error);
  }
});
router.post('/logout',  (req, res, next) => {
    req.session.authUser = null;
    res.redirect("/");
});
router.post(
  '/register',
  recaptcha,
  async (req, res, next) => {
    try {
      await userController.register(req, res, next);
    } catch (error) {
      next(error);
    }
  }
);
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

router.post('/update-profile', userController.isLoggedIn, async (req, res, next) => {
  try {
    await userController.updateProfile(req, res, next);
  } catch (error) {
    next(error);
  }
});

router.post('/add-premium', userController.addPremium);

export { router as UserRouter };
