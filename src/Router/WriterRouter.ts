import express from "express";
import { WriterController } from "../Controllers/WriterController";
import {bufferUploader} from "../utils/MulterConfig";

const router = express.Router();

const writerController = new WriterController();

router.get("/", writerController.getWriterHome);
router.get("/new", writerController.createArticleEditor);
router.get("/edit/:id", writerController.editArticleEditor);
router.get("/myArticles", writerController.getMyArticleList);

router.post("/new",bufferUploader.any(), writerController.newArticle);
router.post("/edit",bufferUploader.any(), writerController.editArticle);

export { router as WriterRouter };
