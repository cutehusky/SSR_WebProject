import {Response, Request} from "express";

export class ArticleController {
    // /articles/home
    getHome(req: Request, res: Response) {
        res.render('HomeView');
    }

    // /articles/categories/:id?page=
    getArticleListByCategory(req: Request, res: Response) {
        const categoryId = req.params.id;
        const page = req.query.page as string || '0';
        console.log(categoryId);
        console.log(page);
        res.render('ArticleListByCategoryView');
    }

    // /articles/tags?tags=&page=
    getArticleListByTag(req: Request, res: Response) {
        const tags = req.query.tags as string[] || [];
        const page = req.query.page as string || '0';
        console.log(tags);
        console.log(page)
        res.render('ArticleListByTagView');
    }

    // /articles/:id
    getArticle(req: Request, res: Response) {
        const articleId = req.params.id;
        console.log(articleId);
        res.render('ArticleView');
    }

    // /articles/search?q=&page=
    searchArticle(req: Request, res: Response) {
        const searchValue = req.query.q as string || '';
        const page = req.query.page as string || '0';
        console.log(searchValue);
        console.log(page);
        res.render('SearchView');
    }

    // /articles/download/:id
    downloadArticle(req: Request, res: Response) {
        let articleId = req.params.id;
        console.log(articleId);
    }
}
