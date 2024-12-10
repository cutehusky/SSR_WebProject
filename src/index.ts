import { dirname } from 'path';
import { fileURLToPath } from 'url';
import { title } from 'process';
import express, { Express } from 'express';
import { engine } from 'express-handlebars';
import { Response, Request } from 'express';

import { ArticleRouter } from './Router/ArticleRouter';
import { WriterRouter } from './Router/WriterRouter';
import { UserRouter } from './Router/UserRouter';
import { AdminRouter } from './Router/AdminRouter';
import { EditorRouter } from './Router/EditorRouter';
import Handlebars from 'handlebars';
import { MiddlewareController } from './Controllers/Middleware';

const app: Express = express();
const port: number = 3000;

app.use(express.urlencoded({ extended: false }));
app.use(express.static('Static'));

app.engine(
    '.hbs',
    engine({
        extname: '.hbs',
        layoutsDir: './Views/Layouts',
        partialsDir: './Views/Partials',
        defaultLayout: 'main',
    })
);
app.set('view engine', 'hbs');
app.set('views', './Views');

let middlewareController = new MiddlewareController();
app.use(
    '/',
    middlewareController.getCategory,
    middlewareController.getProfile,
    ArticleRouter
);
app.use(
    '/writer',
    middlewareController.getCategory,
    middlewareController.getProfile,
    WriterRouter
);
app.use(
    '/user',
    middlewareController.getCategory,
    middlewareController.getProfile,
    UserRouter
);
app.use(
    '/admin',
    middlewareController.getCategory,
    middlewareController.getProfile,
    AdminRouter
);
app.use(
    '/editor',
    middlewareController.getCategory,
    middlewareController.getProfile,
    EditorRouter
);

Handlebars.registerHelper(
    'eq',
    function (this: any, arg1: any, arg2: any, options) {
        // return arg1 === arg2 ? options.fn(this) : options.inverse(this);
        return arg1 === arg2;
    }
);

app.get('/', (req: Request, res: Response) => {
    res.redirect('/home/');
});

app.listen(port, function () {
    console.log(`running in http://localhost:${port}`);
});
