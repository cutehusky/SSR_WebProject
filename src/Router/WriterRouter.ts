import express from "express";
import { WriterController } from "../Controllers/WriterController";

const router = express.Router();

const writerController = new WriterController();

router.get("/", writerController.getWriterHome);
router.get("/new", writerController.createArticleEditor);
router.get("/edit/:id", writerController.editArticleEditor);
router.get("/myArticles", writerController.getMyArticleList);

router.post("/new", writerController.newArticle);
router.post("/edit", writerController.editArticle);

export { router as WriterRouter };
