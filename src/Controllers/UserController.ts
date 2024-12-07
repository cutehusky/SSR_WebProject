import {Response, Request} from "express";

export class UserController {
    // /user/login
    logIn(req: Request, res: Response) {
    }

    // /user/register
    register(req: Request, res: Response) {
    }

    // /user/forgot-password/
    forgotPassword(req: Request, res: Response) {
        const userId = req.params.id;
        res.render('User/ForgotPasswordView',{
            customCss: ['User.css']});
    }

    // /user/profile/:id
    getUserProfile(req: Request, res: Response) {
        const userId = req.params.id;
        res.render('User/UserProfileView', {
            customCss: ['User.css']});
    }

    // /user/reset-password
    resetPassword(req: Request, res: Response) {

    }

    // /user/reset-password-by-otp
    resetPasswordByOTP(req: Request, res: Response) {

    }

    // /user/send-otp
    sendOTP(req: Request, res: Response) {

    }
}
