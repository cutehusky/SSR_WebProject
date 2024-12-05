import { Response, Request } from "express";

// Fake data
const statistics = [
  {
    id: "completed",
    label: "Số lượng bài viết đã xuất bảng",
    value: 0,
  },
  {
    id: "waiting",
    label: "Số lượng bài viết chờ xuất bảng",
    value: 0,
  },
  {
    id: "pending",
    label: "Số lượng bài viết chưa phê duyệt",
    value: 0,
  },
  {
    id: "reject",
    label: "Số lượng bài viết bị từ chối",
    value: 0,
  },
]

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

  getWriterHome(req: Request, res: Response) {
    res.render("Writer/WriterHome", { 
      statistics,
      customCss: ["Writer.css"],
     });
  }

}
