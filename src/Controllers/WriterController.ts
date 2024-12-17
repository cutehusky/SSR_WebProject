import {Response, Request, NextFunction} from "express";
import path from "path";
import * as fs from "fs";
import {DBConfig} from "../Utils/DBConfig";
import {GetSubCategories} from "../Utils/getSubCategories";
import {
  AddBackgroundImageOfArticle,
  createArticle,
  GetArticleById,
  GetBackgroundImageOfArticle,
  GetCategoryFullNameOfArticle, GetTagsOfArticle, UpdateBackgroundImageOfArticle
} from "../Services/articleService";
import {UserRole} from "../Services/userService";


export class WriterController {

  verifyUser(req: Request, res: Response, Next: NextFunction) {
    if (!req.session.authUser || req.session.authUser.role !== UserRole.Writer) {
      res.redirect("/404");
      return;
    }
    Next();
  }

  // /writer/new
  createArticleEditor(req: Request, res: Response) {
    res.render("Writer/WriterPublishNews", {
      customCss: ["Writer.css"],
      customJs: ["Summernote.js"]
    });
  }

  // /writer/edit/:id
  async editArticleEditor(req: Request, res: Response) {
    const writerId = req.session.authUser?.id as number;
    const articleId = req.params.id;
    const data = await GetArticleById(articleId);
    if (!data || data.WriterID !== writerId) {
      res.redirect("/404");
      return;
    }

    let category = await GetCategoryFullNameOfArticle(articleId);
    category = category ? category : {id: 0, fullname: ""};

    let bgURL = await GetBackgroundImageOfArticle(articleId);

    let tag = await GetTagsOfArticle(articleId);

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
        BackgroundImage: bgURL.replace("Static",""),
        BackgroundImageFileName: path.basename(bgURL),
        selectedCategory: category.id,
        selectedCategoryName: category.fullname,
        tags: tag
      }
    });
  }

  // /writer/myArticles?state=
  async getMyArticleList(req: Request, res: Response) {
    const writerId = req.session.authUser?.id as number;
    let state = (req.query.state as string);
    let states:string[] = [];
    if (!state || state == "all" || (state != 'Draft'
        && state != 'Rejected' && state != 'Approved' && state != 'Published')) {
      states = ['Draft', 'Rejected', 'Approved', 'Published'];
      state = "all";
    }else
      states = [state];
    const articles = await DBConfig("ARTICLE")
        .join("ARTICLE_SUBCATEGORY", "ARTICLE_SUBCATEGORY.ArticleID","=","ARTICLE.ArticleID")
        .join("SUBCATEGORY",'ARTICLE_SUBCATEGORY.SubCategoryID', '=', 'SUBCATEGORY.SubCategoryID')
        .join("CATEGORY", "CATEGORY.CategoryID", "=", "SUBCATEGORY.CategoryID")
        .join("ARTICLE_URL", "ARTICLE_URL.ArticleID", "=","ARTICLE.ArticleID")
        .where({STT: 0})
        .where({'WriterID':writerId })
        .whereIn("Status", states)
        .select("Title as title", "Abstract as abstract",
            "DatePublished as datePublished",
            "DatePosted as datePosted", "CATEGORY.Name as category",
            "SUBCATEGORY.Name as subcategory", "URL as cover",
            "Status as state", "ARTICLE.ArticleID as id").orderBy("DatePosted", "desc");
    res.render("Writer/WriterViewArticles", {
      customCss: ["Writer.css"],
      state,
      articles
    });
  }

  countArticleInState = async (writerId: number, states: string[]) =>  {
     let res = await DBConfig("ARTICLE")
        .where({'WriterID': writerId})
        .whereIn("Status", states).count("* as count").first();
     return res?.count || 0;
  }

  getWriterHome = async (req: Request, res: Response) =>  {
    const writerId = req.session.authUser?.id as number;
    const states = [
      { id: "Published", label: "Số lượng bài viết đã xuất bảng", states: ["Published"] },
      { id: "Approved", label: "Số lượng bài viết chờ xuất bảng", states: ["Approved"] },
      { id: "Draft", label: "Số lượng bài viết chưa phê duyệt", states: ["Draft"] },
      { id: "Rejected", label: "Số lượng bài viết bị từ chối", states: ["Rejected"] },
      { id: "All", label: "Tổng số bài viết đã đăng", states: ["Draft", "Rejected", "Approved", "Published"] },
    ];

    // Use Promise.all to resolve all promises concurrently
    const statistics = await Promise.all(
        states.map(async (state) => ({
          id: state.id,
          label: state.label,
          value: await this.countArticleInState(writerId, state.states),
        }))
    );

    res.render("Writer/WriterHome", {
      statistics,
      customCss: ["Writer.css", "User.css"],
     });
  }

  // /writer/new
  async newArticle(req: Request, res: Response) {
    const writerId = req.session.authUser?.id as number;
    console.log(req.body);
    const [id] = await DBConfig("ARTICLE").insert({
      Title: req.body.title,
      DatePosted: new Date(Date.now()),
      Content: req.body.content,
      Abstract: req.body.abstract,
      Status:'Draft',
      IsPremium: req.body.isPremium == 'on' ? 1: 0,
      WriterID: writerId,
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
      await AddBackgroundImageOfArticle(id);
    } else {
      const matches = imageData.match(/^data:(image\/[a-zA-Z]+);base64,(.+)$/);
      if (!matches || matches.length !== 3) {
        await AddBackgroundImageOfArticle(id);
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
                await AddBackgroundImageOfArticle(id);
                return;
              }
              await AddBackgroundImageOfArticle(id, filePath.replace("Static", ""));
        });
      }
    }
    res.redirect("/writer/myArticles?state=Draft");
  }

  // /writer/edit
  async editArticle(req: Request, res: Response) {
    console.log(req.body);
    const writerId = req.session.authUser?.id as number;
    const id = req.body.id;
    const data = await GetArticleById(id);
    if (data.WriterID !== writerId) {
      res.redirect("/404");
      return;
    }
    await DBConfig("ARTICLE").where({'ArticleID': id}).update({
      Title: req.body.title,
      DatePosted: new Date(Date.now()),
      Content: req.body.content,
      Abstract: req.body.abstract,
      Status: 'Draft',
      IsPremium: req.body.isPremium === 'on' ? 1: 0,
      WriterID: writerId,
    });

    if (req.body.category) {
      const affectedRows  = await DBConfig("ARTICLE_SUBCATEGORY").where({
        ArticleID: id
      }).update({
        SubCategoryID: req.body.category
      });
      if (affectedRows === 0)
        await DBConfig("ARTICLE_SUBCATEGORY").insert({
          SubCategoryID: req.body.category,
          ArticleID: id
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
       await UpdateBackgroundImageOfArticle(id);
    } else if (imageData === "not changed") {
      console.log("image not change");
    } else {
      const matches = imageData.match(/^data:(image\/[a-zA-Z]+);base64,(.+)$/);
      if (!matches || matches.length !== 3) {
        await UpdateBackgroundImageOfArticle(id);
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
                await UpdateBackgroundImageOfArticle(id);
                return;
              }
              await UpdateBackgroundImageOfArticle(id, filePath.replace("Static",""));
        });
      }
    }
    res.redirect("/writer/myArticles?state=Draft");
  }
}
