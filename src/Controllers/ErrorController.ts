import { Request, Response } from 'express';

export class ErrorController {
    errorPage(req: Request, res: Response) {
        res.render('404');
    }
}
