import express from 'express';
import { ErrorController } from '../Controllers/ErrorController';

const router = express.Router();
const errorController = new ErrorController();

router.get('/', errorController.errorPage);

export { router as ErrorRouter };
