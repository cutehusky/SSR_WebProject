import session from 'express-session';
import express, { Express, Request, Response } from 'express';
import { engine } from 'express-handlebars';

import { ArticleRouter } from './Router/ArticleRouter';
import { WriterRouter } from './Router/WriterRouter';
import { UserRouter } from './Router/UserRouter';
import { AdminRouter } from './Router/AdminRouter';
import { EditorRouter } from './Router/EditorRouter';
import Handlebars from 'handlebars';
import { MiddlewareController } from './Controllers/Middleware';

import sections from 'express-handlebars-sections';
import { UserRole } from '../src/Models/UserData';
import { format, parse } from 'date-fns';

const app: Express = express();
const port: number = 3000;

app.use(express.json({ limit: '100mb' }));
app.use(express.urlencoded({ limit: '100mb', extended: true }));
app.use(express.static('Static'));

app.use(
    session({
        secret: '3pMOtRGmCc',
        saveUninitialized: true,
        cookie: {
            httpOnly: true,
            secure: false,
            maxAge: 3600000,
        },
    })
);

app.engine(
    '.hbs',
    engine({
        helpers: {
            section: sections(),
        },
        extname: '.hbs',
        layoutsDir: './Views/Layouts',
        partialsDir: './Views/Partials',
        defaultLayout: 'main',
    })
);
app.set('view engine', 'hbs');
app.set('views', './Views');

let middlewareController = new MiddlewareController();


app.use((req: Request, res: Response, next: Function) => {
    res.locals.session = req.session; // sử dụng session.authUser ở handlebars
    next();
});


app.use(
    '/',
    middlewareController.getToDay,
    middlewareController.getCategory,
    middlewareController.getTags,
    middlewareController.getProfile,
    ArticleRouter
);
app.use(
    '/writer',
    middlewareController.getToDay,
    middlewareController.getCategory,
    middlewareController.getTags,
    middlewareController.getProfile,
    WriterRouter
);
app.use(
    '/user',
    middlewareController.getToDay,
    middlewareController.getCategory,
    middlewareController.getTags,
    middlewareController.getProfile,
    UserRouter
);
app.use(
    '/admin',
    middlewareController.getToDay,
    middlewareController.getCategory,
    middlewareController.getTags,
    middlewareController.getProfile,
    AdminRouter
);
app.use(
    '/editor',
    middlewareController.getToDay,
    middlewareController.getCategory,
    middlewareController.getTags,
    middlewareController.getProfile,
    EditorRouter
);

Handlebars.registerHelper("formatDate", (date, formatStr) => {
    if (!date) return ""; // Nếu không có ngày, trả về chuỗi rỗng
    try {
        const parsedDate = parse(date, "dd/MM/yyyy", new Date()); // Parse ngày gốc
        return format(parsedDate, formatStr); // Trả về ngày đúng định dạng yyyy-MM-dd
    } catch (error) {
        console.error("Invalid date:", date, error);
        return ""; // Xử lý lỗi nếu ngày không hợp lệ
    }
});


Handlebars.registerHelper('eq', function (this: any, arg1: any, arg2: any) {
    return arg1 === arg2;
});

Handlebars.registerHelper('notnull', function (this: any, arg1: any) {
    return Boolean(arg1);
});

Handlebars.registerHelper('neq', function (this: any, arg1: any, arg2: any) {
    return arg1 !== arg2;
});

Handlebars.registerHelper('slice', function (array: any, start: any, end: any) {
    if (!Array.isArray(array)) {
        return [];
    }
    return array.slice(start, end);
});

app.get('/', (req: Request, res: Response) => {
    if (req.session.authUser && req.session.authUser.role === UserRole.Writer) {
        res.redirect('/writer');
        return;
    }
    res.redirect('/home/');
});

app.listen(port, function () {
    console.log(`running in http://localhost:${port}`);
});
