import express from "express";
import {WriterController} from "../Controllers/WriterController";
import {bufferUploader} from "../Utils/MulterConfig";

const router = express.Router();

const writerController = new WriterController();

router.get("/", writerController.verifyUser, writerController.getWriterHome);
router.get("/new",  writerController.verifyUser, writerController.createArticleEditor);

router.get("/edit/:id", writerController.verifyUser, writerController.editArticleEditor);
router.get("/myArticles", writerController.verifyUser, writerController.getMyArticleList);

router.post("/new",bufferUploader.any(),writerController.verifyUser, writerController.newArticle);
router.post("/edit",bufferUploader.any(),writerController.verifyUser, writerController.editArticle);

export { router as WriterRouter };
