import { dirname } from 'path'
import { fileURLToPath } from 'url';
import { title } from 'process';
import express, { Express } from 'express'
import { engine } from 'express-handlebars';

const app: Express = express();

app.use(express.urlencoded({ extended: false }));

app.engine('handlebars', engine());
app.set('view engine', 'handlebars');
app.set('views', './Views');
app.get('/', (req, res) => {
    res.render('test', { title: 'test', content: 'Hello world' });
});

const port: number = 3000;
app.listen(port, function () {
    console.log(`running in http://localhost:${port}`);
});