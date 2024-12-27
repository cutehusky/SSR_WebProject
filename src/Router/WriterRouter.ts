import express from "express";
import {WriterController} from "../Controllers/WriterController";
import {bufferUploader} from "../Utils/MulterConfig";

const router = express.Router();

const writerController = new WriterController();

router.get("/", writerController.verifyUserForWriter, writerController.getWriterHome);
router.get("/new",  writerController.verifyUserForAdminAndWriter, writerController.createArticleEditor);
router.get("/edit/:id", writerController.verifyUserForAdminAndWriter, writerController.editArticleEditor);

router.get("/myArticles", writerController.verifyUserForWriter, writerController.getMyArticleList);

router.post("/new",bufferUploader.any(),writerController.verifyUserForAdminAndWriter, writerController.newArticle);
router.post("/edit",bufferUploader.any(),writerController.verifyUserForAdminAndWriter, writerController.editArticle);

export { router as WriterRouter };
