import {Response, Request} from "express";

export class UserController {
    // /user/login
    logIn(req: Request, res: Response) {
        res.render('LoginView');
    }

    // /user/register
    register(req: Request, res: Response) {
        res.render('RegisterView');
    }

    // /user/forgot-password/:id
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
}
