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
    const articles = [
      {
        title: "Lorem ipsum",
        abstract: "Lorem ipsum dolor sit amet consectetur adipisicing elit. Voluptatum aperiam illo omnis quas, aut facilis error. Enim numquam explicabo sed distinctio natus hic illum molestias assumenda, ducimus excepturi architecto beatae?",
        date: "01/01/2024",
        category: "Lorem, ipsum",
        subcategory: "Lorem, ipsum",
        cover: '/logo.jpg'
      },
      {
        title: "Lorem ipsum",
        abstract: "Lorem ipsum dolor sit amet consectetur adipisicing elit. Voluptatum aperiam illo omnis quas, aut facilis error. Enim numquam explicabo sed distinctio natus hic illum molestias assumenda, ducimus excepturi architecto beatae?",
        date: "01/01/2024",
        category: "Lorem, ipsum",
        subcategory: "Lorem, ipsum",
        cover: '/logo.jpg'
      },
      {
        title: "Lorem ipsum",
        abstract: "Lorem ipsum dolor sit amet consectetur adipisicing elit. Voluptatum aperiam illo omnis quas, aut facilis error. Enim numquam explicabo sed distinctio natus hic illum molestias assumenda, ducimus excepturi architecto beatae?",
        date: "01/01/2024",
        category: "Lorem, ipsum",
        subcategory: "Lorem, ipsum",
        cover: '/logo.jpg'
      }
    ] 
    res.render("Writer/WriterViewArticles", {
      customCss: ["Writer.css"],
      state,
      articles
    });
  }


  getWriterHome(req: Request, res: Response) {
    res.render("Writer/WriterHome", { 
      statistics,
      customCss: ["Writer.css", "User.css"],
     });
  }

}
