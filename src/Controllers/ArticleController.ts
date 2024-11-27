import { Response, Request } from "express";

export class ArticleController {
    // /articles/home
    getHome(req: Request, res: Response) {
        let testCategory = [];
        for (let i = 0; i < 20; i++) {
            let testSubCategory = [];
            for (let j = 0; j < 20; j++)
                testSubCategory.push({
                    id: j,
                    name: "test subcategory " + j
                });
            testCategory.push({
                id: i,
                name: "test category " + i,
                SubCategories: testSubCategory
            })
        }
        res.render('HomeView', {
            customCss: ['Home.css'],
            Top10Categories: testCategory.slice(0, 10),
            Categories: testCategory
        });
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
