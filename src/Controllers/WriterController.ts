import { Response, Request } from "express";

export class WriterController {
  // /writer/new
  createArticleEditor(req: Request, res: Response) {
    // res.render('ArticleEditorView');
    res.render("Writer/WriterPublishNews", {
      customCss: ["Writer.css"],
      customJs: ["Summernote.js"],
    });
  }

  // /writer/edit/:id
  editArticleEditor(req: Request, res: Response) {
    const articleId = req.params.id;
    // res.render("ArticleEditorView");
    res.render("Writer/WriterUpdateNews", {
      customCss: ["Writer.css"],
      customJs: ["Summernote.js"],
    });
  }

  // /writer/myArticles?state=
  getMyArticleList(req: Request, res: Response) {
    const state = (req.query.state as string) || "all";
    res.render("MyArticleView");
  }
}
