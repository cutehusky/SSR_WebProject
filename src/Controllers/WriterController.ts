import { Response, Request } from "express";
import path from "path";
import * as fs from "fs";
import {DBConfig} from "../Utils/DBConfig";

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
    res.render("Writer/WriterPublishNews", {
      customCss: ["Writer.css"],
      customJs: ["Summernote.js"]
    });
  }

  // /writer/edit/:id
  async editArticleEditor(req: Request, res: Response) {
    const articleId = req.params.id;
    const data = await DBConfig("ARTICLE").where({'ArticleID': articleId}).first();
    const bgURL = await DBConfig("ARTICLE_URL").where({STT: 0, ArticleID: articleId}).first();
    res.render("Writer/WriterUpdateNews", {
      customCss: ["Writer.css"],
      customJs: ["Summernote.js"],
      data: {
        ID: articleId,
        Title: data.Title,
        DatePosted: data.DatePosted,
        Content: data.Content,
        Abstract: data.Abstract,
        Status: data.Status,
        IsPremium: data.IsPremium,
        BackgroundImage: bgURL.URL.replace("Static",""),
        BackgroundImageFileName: path.basename(bgURL.URL)
      }
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

  // /writer/new
  async newArticle(req: Request, res: Response) {
    console.log(req.body);
    const [id] = await DBConfig("ARTICLE").insert({
      Title: req.body.title,
      DatePosted: new Date(Date.now()),
      Content: req.body.content,
      Abstract: req.body.abstract,
      Status:'Draft',
      IsPremium: req.body.isPremium == 'on' ? 1: 0,
      WriterID: 1, // for testing now
    });

    const imageData = req.body.backgroundImageArticle;
    const matches = imageData.match(/^data:(image\/[a-zA-Z]+);base64,(.+)$/);

    if (!matches || matches.length !== 3) {
      await DBConfig("ARTICLE_URL").insert({ArticleID: id, STT: 0, URL: "null"});
      return;
    }
    const fileType = matches[1];
    const base64Data = matches[2];
    const extension = fileType.split("/")[1];
    const savePath = path.posix.join('./Static/uploads/article', id.toString());
    fs.mkdirSync(savePath, {recursive: true});
    const filePath = path.posix.join(savePath, "BackgroundImage." + extension);
    fs.writeFile(filePath, base64Data,
        { encoding: "base64" }, async (err) => {
      if (err) {
        console.error("Error saving the file:", err);
        await DBConfig("ARTICLE_URL").insert({ArticleID: id, STT: 0, URL: "null"});
        return;
      }
      await DBConfig("ARTICLE_URL").insert({ArticleID: id, STT: 0, URL: filePath});
    });
  }

  // /writer/edit
  async editArticle(req: Request, res: Response) {
    console.log(req.body);
    const id = req.body.id;
    await DBConfig("ARTICLE").where({'ArticleID': id}).update({
      Title: req.body.title,
      DatePosted: new Date(Date.now()),
      Content: req.body.content,
      Abstract: req.body.abstract,
      Status:'Draft',
      IsPremium: req.body.isPremium == 'on' ? 1: 0,
      WriterID: 1, // for testing now
    });

    const imageData = req.body.backgroundImageArticle;
    if (imageData === "not changed") {
      console.log("image not change");
      return;
    }

    const matches = imageData.match(/^data:(image\/[a-zA-Z]+);base64,(.+)$/);
    if (!matches || matches.length !== 3) {
      await DBConfig("ARTICLE_URL").where({ArticleID: id, STT: 0}).update({URL: "null"});
      return;
    }

    const fileType = matches[1];
    const base64Data = matches[2];
    const extension = fileType.split("/")[1];
    const savePath = path.posix.join('./Static/uploads/article', id.toString());
    fs.mkdirSync(savePath, {recursive: true});
    const filePath = path.posix.join(savePath, "BackgroundImage." + extension);
    fs.writeFile(filePath, base64Data,
        { encoding: "base64" }, async (err) => {
          if (err) {
            console.error("Error saving the file:", err);
            await DBConfig("ARTICLE_URL").where({ArticleID: id, STT: 0}).update({URL: "null"});
            return;
          }
          await DBConfig("ARTICLE_URL").where({ArticleID: id, STT: 0}).update({URL: filePath});
        });
  }
}
