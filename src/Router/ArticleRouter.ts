import {ArticleController} from "../Controllers/ArticleController";
import express from "express";

const router = express.Router();

const articleController = new ArticleController();

router.get('/home', articleController.getHome);
router.get('/categories/:id', articleController.getArticleListByCategory);
router.get('/subcategories/:id', articleController.getArticleListBySubCategory);
router.get('/tags', articleController.getArticleListByTag);
router.get('/article/:id', articleController.getArticle);
router.get('/search', articleController.searchArticle);
router.get('/download', articleController.downloadArticle);

export {router as ArticleRouter};