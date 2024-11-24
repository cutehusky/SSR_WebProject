import { Request, Response } from 'express';

export class EditorController {

    // /editor/articles
    getArticles(req: Request, res: Response) {
        res.render('ArticlesListView');
    }

    // /editor/articles/:id/approve
    approveArticle(req: Request, res: Response) {
        const articleId = req.params.id;
        console.log(articleId);
        res.send(`Article ${articleId} approved`);
    }

    // /editor/articles/:id/reject
    rejectArticle(req: Request, res: Response) {
        const articleId = req.params.id;
        console.log(articleId);
        res.send(`Article ${articleId} rejected`);
    }

    // /editor/articles/:id/view
    viewArticle(req: Request, res: Response) {
        const articleId = req.params.id;
        console.log(articleId);
        res.render('ArticleView', { articleId });
    }
}
