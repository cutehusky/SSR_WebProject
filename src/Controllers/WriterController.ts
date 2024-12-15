import { Response, Request } from "express";
import path from "path";
import * as fs from "fs";
import {DBConfig} from "../Utils/DBConfig";
import {GetSubCategories} from "../Utils/getSubCategories";
import {createArticle} from "../Services/articleService";

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
    if (!data) {
      res.redirect("/404");
      return;
    }
    let category = await DBConfig("ARTICLE_SUBCATEGORY")
        .join("SUBCATEGORY",'ARTICLE_SUBCATEGORY.SubCategoryID', '=', 'SUBCATEGORY.SubCategoryID')
        .join("CATEGORY", "CATEGORY.CategoryID", "=", "SUBCATEGORY.CategoryID")
        .where({'ArticleID': articleId})
        .select("ARTICLE_SUBCATEGORY.SubCategoryID as id", DBConfig.raw("CONCAT(CATEGORY.Name, \" / \", SUBCATEGORY.Name) as fullname")).first();
    category = category ? category : {id: 0, fullname: ""};
    let bgURL = await DBConfig("ARTICLE_URL")
        .where({STT: 0, ArticleID: articleId}).first();
    bgURL = bgURL ? bgURL : {URL: "null"};
    let tag = await DBConfig("TAG")
        .join('ARTICLE_TAG', 'ARTICLE_TAG.TagID','=', 'TAG.TagID')
        .where({'ArticleID': articleId})
        .select("Name as name", "TAG.TagID as id");
    tag = tag ? tag : [];
    console.log(category);
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
        BackgroundImageFileName: path.basename(bgURL.URL),
        selectedCategory: category.id,
        selectedCategoryName: category.fullname,
        tags: tag
      }
    });
  }

  // /writer/myArticles?state=
  async getMyArticleList(req: Request, res: Response) {
    const state = (req.query.state as string);
    let states:string[] = [];
    if (!state || state == "all" || (state != 'Draft' && state != 'Pending'
        && state != 'Rejected' && state != 'Approved' && state != 'Published'))
      states = ['Draft', 'Pending', 'Rejected', 'Approved', 'Published'];
    else
      states = [state];
    const articles = await DBConfig("ARTICLE")
        .join("ARTICLE_SUBCATEGORY", "ARTICLE_SUBCATEGORY.ArticleID","=","ARTICLE.ArticleID")
        .join("SUBCATEGORY",'ARTICLE_SUBCATEGORY.SubCategoryID', '=', 'SUBCATEGORY.SubCategoryID')
        .join("CATEGORY", "CATEGORY.CategoryID", "=", "SUBCATEGORY.CategoryID")
        .join("ARTICLE_URL", "ARTICLE_URL.ArticleID", "=","ARTICLE.ArticleID")
        .where({STT: 0})
        .where({'WriterID': 1})
        .whereIn("Status", states)
        .select("Title as title", "Abstract as abstract",
            "DatePosted as date", "CATEGORY.Name as category",
            "SUBCATEGORY.Name as subcategory", "URL as cover");
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

    if (req.body.category) {
      await DBConfig("ARTICLE_SUBCATEGORY").insert({
        ArticleID: id,
        SubCategoryID: req.body.category
      })
    }

    const tags = req.body.tags;
    const listOfTags = tags ? tags.split(","): [];
    if (listOfTags.length > 0) {
      const insertData = listOfTags.map((tagId: any) => ({ArticleID: id, TagID: tagId}));
      await DBConfig('ARTICLE_TAG').insert(insertData);
    }

    const imageData = req.body.backgroundImageArticle;
    if (!imageData) {
      await DBConfig("ARTICLE_URL").insert({ArticleID: id, STT: 0, URL: "null"});
    } else {
      const matches = imageData.match(/^data:(image\/[a-zA-Z]+);base64,(.+)$/);
      if (!matches || matches.length !== 3) {
        await DBConfig("ARTICLE_URL").insert({ArticleID: id, STT: 0, URL: "null"});
      } else {
        const fileType = matches[1];
        const base64Data = matches[2];
        const extension = fileType.split("/")[1];
        const savePath = path.posix.join('./Static/uploads/article', id.toString());
        fs.mkdirSync(savePath, {recursive: true});
        const filePath = path.posix.join(savePath, "BackgroundImage." + extension);
        fs.writeFile(filePath, base64Data,
            {encoding: "base64"}, async (err) => {
              if (err) {
                console.error("Error saving the file:", err);
                await DBConfig("ARTICLE_URL").insert({ArticleID: id, STT: 0, URL: "null"});
                return;
              }
              await DBConfig("ARTICLE_URL").insert({ArticleID: id, STT: 0, URL: filePath.replace("Static","")});
            });
      }
    }
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
      Status: 'Draft',
      IsPremium: req.body.isPremium === 'on' ? 1: 0,
      WriterID: 1, // for testing now
    });

    if (req.body.category) {
      await DBConfig("ARTICLE_SUBCATEGORY").where({
        ArticleID: id
      }).update({
        SubCategoryID: req.body.category
      });
    }

    const tags = req.body.tags;
    const listOfTags = tags ? tags.split(","): [];
    await DBConfig('ARTICLE_TAG').where({'ArticleID': id}).del();
    if (listOfTags.length > 0) {
      const insertData = listOfTags.map((tagId: any) => ({ArticleID: id, TagID: tagId}));
      await DBConfig('ARTICLE_TAG').insert(insertData);
    }

    const imageData = req.body.backgroundImageArticle;
    if (!imageData) {
      await DBConfig("ARTICLE_URL").where({ArticleID: id, STT: 0}).update({URL: "null"});
    } else if (imageData === "not changed") {
      console.log("image not change");
    } else {
      const matches = imageData.match(/^data:(image\/[a-zA-Z]+);base64,(.+)$/);
      if (!matches || matches.length !== 3) {
        await DBConfig("ARTICLE_URL").where({ArticleID: id, STT: 0}).update({URL: "null"});
      } else {
        const fileType = matches[1];
        const base64Data = matches[2];
        const extension = fileType.split("/")[1];
        const savePath = path.posix.join('./Static/uploads/article', id.toString());
        fs.mkdirSync(savePath, {recursive: true});
        const filePath = path.posix.join(savePath, "BackgroundImage." + extension);
        fs.writeFile(filePath, base64Data,
            {encoding: "base64"}, async (err) => {
              if (err) {
                console.error("Error saving the file:", err);
                await DBConfig("ARTICLE_URL").where({ArticleID: id, STT: 0}).update({URL: "null"});
                return;
              }
              await DBConfig("ARTICLE_URL").where({ArticleID: id, STT: 0}).update({URL: filePath.replace("Static","")});
            });
      }
    }
  }
}
