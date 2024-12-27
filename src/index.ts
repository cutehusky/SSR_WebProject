import session from 'express-session';
import express, { Express, Request, Response } from 'express';
import { engine } from 'express-handlebars';

import { ArticleRouter } from './Router/ArticleRouter';
import { WriterRouter } from './Router/WriterRouter';
import { UserRouter } from './Router/UserRouter';
import { AdminRouter } from './Router/AdminRouter';
import { EditorRouter } from './Router/EditorRouter';
import { ErrorRouter } from './Router/ErrorRouter';
import { GoogleAuthRouter } from './Router/AuthRouter';
import Handlebars from 'handlebars';
import { MiddlewareController } from './Controllers/Middleware';

import sections from 'express-handlebars-sections';
import { UserRole } from '../src/Models/UserData';
import { format, parse } from 'date-fns';
import { DBConfig } from './Utils/DBConfig';

import passport from 'passport';
import './Utils/Auth';

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

app.use(passport.initialize());
app.use(passport.session());

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

app.use('/auth', GoogleAuthRouter);

app.use('/404', ErrorRouter);

// when user type wrong or not exist url it will return 404 page. (Temporary)
app.use('/:slug', ErrorRouter);

Handlebars.registerHelper('formatDate', (date, formatStr) => {
    if (!date) return ''; // Nếu không có ngày, trả về chuỗi rỗng
    try {
        const parsedDate = parse(date, 'dd/MM/yyyy', new Date()); // Parse ngày gốc
        return format(parsedDate, formatStr); // Trả về ngày đúng định dạng yyyy-MM-dd
    } catch (error) {
        console.error('Invalid date:', date, error);
        return ''; // Xử lý lỗi nếu ngày không hợp lệ
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
    } else if (
        req.session.authUser &&
        req.session.authUser.role === UserRole.Editor
    ) {
        res.redirect('/editor/articles');
    } else if (
        req.session.authUser &&
        req.session.authUser.role === UserRole.Admin
    ) {
        res.redirect('/admin/categories');
    } else res.redirect('/home/');
});

const updateArticlePublished = async () => {
    const curr_datetime = new Date();

    let formatted_datetime = curr_datetime.toLocaleString('vi-VN', {
        year: 'numeric',
        month: '2-digit',
        day: '2-digit',
        hour: '2-digit',
        minute: '2-digit',
        second: '2-digit',
        hour12: false,
    });

    const separator = formatted_datetime.includes(', ') ? ', ' : ' ';
    const [time, date] = formatted_datetime.split(separator);
    const [day, month, year] = date.split('/');
    const final_datetime = `${year}-${month}-${day} ${time}`;
    await DBConfig('ARTICLE')
        .where('Status', 'Approved')
        .where('DatePublished', '>', final_datetime)
        .update('Status', 'Published');
};

updateArticlePublished();

setInterval(updateArticlePublished, 60000);

app.listen(port, function () {
    console.log(`running in http://localhost:${port}`);
});
