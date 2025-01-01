import { Request, Response, NextFunction, RequestHandler } from 'express';

function ErrorHandler(
    fn: (req: Request, res: Response, next: NextFunction) => void | Promise<any>
): RequestHandler {
    return (req, res, next) => {
        try {
            // Check if the function is asynchronous or synchronous
            const result = fn(req, res, next);
            if (result && result.catch) {
                // If the function returns a Promise, handle it as async
                result.catch(next);
            }
        } catch (err) {
            // Catch any synchronous errors and pass them to the next error handler
            next(err);
        }
    };
}

export default ErrorHandler;
