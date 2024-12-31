import express from "express";
import {WriterController} from "../Controllers/WriterController";
import {bufferUploader} from "../Utils/MulterConfig";
import ErrorHandler from "../Utils/ErrorHandle";

const router = express.Router();

const writerController = new WriterController();

router.get("/", writerController.verifyUserForWriter, ErrorHandler(writerController.getWriterHome));
router.get("/new",  writerController.verifyUserForAdminAndWriter, ErrorHandler(writerController.createArticleEditor));
router.get("/edit/:id", writerController.verifyUserForAdminAndWriter, ErrorHandler(writerController.editArticleEditor));

router.get("/myArticles", writerController.verifyUserForWriter, ErrorHandler(writerController.getMyArticleList));

router.post("/new",bufferUploader.any(),writerController.verifyUserForAdminAndWriter, ErrorHandler(writerController.newArticle));
router.post("/edit",bufferUploader.any(),writerController.verifyUserForAdminAndWriter, ErrorHandler(writerController.editArticle));

export { router as WriterRouter };
