import { Request, Response } from "express";

export class EditorController {
  // /editor/articles
  getArticles(req: Request, res: Response) {
    const categories: string[] = [
      "Tất cả",
      "Thời sự",
      "Kinh doanh",
      "Bất động sản",
    ];
    const articles: {
      title: string;
      author: string;
      date: string;
      tag: string;
      category: string;
    }[] = [
      {
        title: "Phát hiện gần 150 bộ hài cốt trên phố trung tâm Hà Nội",
        author: "Phi Hoàng",
        date: "21/11/2024",
        tag: "Chính trị",
        category: "Thời sự",
      },
      {
        title: "Phát hiện gần 150 bộ hài cốt trên phố trung tâm Hà Nội",
        author: "Phi Hoàng",
        date: "21/11/2024",
        tag: "Chính trị",
        category: "Thời sự",
      },
      {
        title: "Phát hiện gần 150 bộ hài cốt trên phố trung tâm Hà Nội",
        author: "Phi Hoàng",
        date: "21/11/2024",
        tag: "Chính trị",
        category: "Thời sự",
      },
      {
        title: "Phát hiện gần 150 bộ hài cốt trên phố trung tâm Hà Nội",
        author: "Phi Hoàng",
        date: "21/11/2024",
        tag: "Chính trị",
        category: "Thời sự",
      },
      {
        title: "Phát hiện gần 150 bộ hài cốt trên phố trung tâm Hà Nội",
        author: "Phi Hoàng",
        date: "21/11/2024",
        tag: "Chính trị",
        category: "Thời sự",
      },
    ];
    const pages = ["1", "2", "3", "4", "5"];

    res.render("Editor/EditorListPendingApproveView", {
      customCss: ["Editor.css"],
      categories,
      articles,
      pages,
    });
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
    res.render("ArticleView", { articleId });
  }
}
