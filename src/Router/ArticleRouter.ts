import { ArticleController } from "../Controllers/ArticleController";
import express from "express";

const router = express.Router();

const articleController = new ArticleController();

router.get("/home",articleController.verifyUser, articleController.getHome);
router.get("/category/:id",articleController.verifyUser, articleController.getArticleListByCategory);
router.get(
  "/category/subcategory/:id", articleController.verifyUser,
  articleController.getArticleListBySubCategory
);
router.get("/tags",articleController.verifyUser, articleController.getArticleListByTags);
router.get("/article/:id",articleController.verifyUser, articleController.getArticle);
router.get("/search",articleController.verifyUser, articleController.searchArticle);
router.get("/download/:id",articleController.verifyUser, articleController.downloadArticle);

router.post("/comment/",articleController.verifyUser, articleController.commentArticle);

export { router as ArticleRouter };
