import { ArticleController } from '../Controllers/ArticleController';
import express from 'express';
import ErrorHandler from "../Utils/ErrorHandle";

const router = express.Router();

const articleController = new ArticleController();

router.get('/home', articleController.verifyUser, ErrorHandler(articleController.getHome));
router.get(
    '/category/:id',
    articleController.verifyUser,
    ErrorHandler(articleController.getArticleListByCategory)
);
router.get(
    '/category/subcategory/:id',
    articleController.verifyUser,
    ErrorHandler(articleController.getArticleListBySubCategory)
);
router.get(
    '/tags',
    articleController.verifyUser,
    ErrorHandler(articleController.getArticleListByTags)
);
router.get(
    '/article/:id',
    articleController.verifyUser,
    ErrorHandler(articleController.getArticle)
);
router.get(
    '/search',
    articleController.verifyUser,
    ErrorHandler(articleController.searchArticle)
);
router.get(
    '/download/:id',
    articleController.verifyUser,
    ErrorHandler(articleController.downloadArticle)
);

router.post(
    '/comment/',
    articleController.verifyUser,
    ErrorHandler(articleController.commentArticle)
);

export { router as ArticleRouter };
