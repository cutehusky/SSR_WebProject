import {Response, Request} from "express";

export class UserController {
    // /user/login
    logIn(req: Request, res: Response) {
        const articleId = req.params.id;
        res.render('LoginView');
    }

    // /user/register
    register(req: Request, res: Response) {
        const articleId = req.params.id;
        res.render('RegisterView');
    }

    // /user/forgot-password
    forgotPassword(req: Request, res: Response) {
        const articleId = req.params.id;
        res.render('forgotPasswordView');
    }

    // /user/profile
    getUserProfile(req: Request, res: Response) {
        const articleId = req.params.id;
        res.render('UserProfileView');
    }
}
