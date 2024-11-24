import express from "express";
import {WriterController} from "../Controllers/WriterController";

const router = express.Router();

const writerController = new WriterController();

router.get('/new', writerController.createArticleEditor);
router.get('/edit/:id', writerController.editArticleEditor);
router.get('/myArticles', writerController.getMyArticleList);

export {router as WriterRouter}