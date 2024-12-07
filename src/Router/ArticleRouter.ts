import {ArticleController} from "../Controllers/ArticleController";
import express from "express";

const router = express.Router();

const articleController = new ArticleController();

router.get('/home', articleController.getHome);
router.get('/category/:id', articleController.getArticleListByCategory);
router.get('/subcategory/:id', articleController.getArticleListBySubCategory);
router.get('/tags', articleController.getArticleListByTags);
router.get('/article/:id', articleController.getArticle);
router.get('/search', articleController.searchArticle);
router.get('/download', articleController.downloadArticle);

router.post('/comment/', articleController.commentArticle);

export {router as ArticleRouter};