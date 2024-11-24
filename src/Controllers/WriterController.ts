import {Response, Request} from "express";

export class WriterController {

    // /writer/new
    createArticleEditor(req: Request, res: Response) {
        res.render('ArticleEditorView');
    }

    // /writer/edit/:id
    editArticleEditor(req: Request, res: Response) {
        const articleId = req.params.id;
        res.render('ArticleEditorView');
    }

    // /writer/myArticles?state=
    getMyArticleList(req: Request, res: Response) {
        const state = req.query.state as string || 'all';
        res.render('MyArticleView');
    }
}
