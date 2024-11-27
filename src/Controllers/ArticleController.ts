import {Response, Request} from "express";

export class ArticleController {
    // /articles/home
    getHome(req: Request, res: Response) {
        res.render('HomeView', {customCss: ['Home.css'],
            Top10Categories:[
                {name: 'test a', link: ''},
                {name: 'test a', link: ''},
                {name: 'test a', link: ''},
                {name: 'test a', link: ''},
                {name: 'test a', link: ''},
                {name: 'test a', link: ''},
                {name: 'test a', link: ''},
                {name: 'test a', link: ''},
                {name: 'test a', link: ''},
                {name: 'test a', link: ''},],
            Categories: [{
                id: "123",
                name: "test 1",
                SubCategories: [{
                    id: "456",
                    name: "test 2"
                }]
                }, {
                    id: "789",
                    name: "test 3",
                    SubCategories: [{
                        id: "987",
                        name: "test 4"
                    }]
                },{
                    id: "654",
                    name: "test 5",
                    SubCategories: [{
                        id: "321",
                        name: "test 6"
                    }]
            }]});
    }

    // /articles/categories/:id?page=
    getArticleListByCategory(req: Request, res: Response) {
        const categoryId = req.params.id;
        const page = req.query.page as string || '0';
        console.log(categoryId);
        console.log(page);
        res.render('ArticleListByCategoryView');
    }

    // /articles/subcategories/:id?page=
    getArticleListBySubCategory(req: Request, res: Response) {
        const categoryId = req.params.id;
        const page = req.query.page as string || '0';
        console.log(categoryId);
        console.log(page);
        res.render('ArticleListBySubCategoryView');
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
