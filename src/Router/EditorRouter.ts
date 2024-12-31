import express from 'express';
import { EditorController } from '../Controllers/EditorController';
import ErrorHandler from "../Utils/ErrorHandle";

const router = express.Router();

const editorController = new EditorController();

router.get('/articles', editorController.verifyUserForEditor, ErrorHandler(editorController.getArticles));
router.get('/articles/rejected', editorController.verifyUserForEditor, ErrorHandler(editorController.getRejectedArticles));
router.get('/articles/approved', editorController.verifyUserForEditor, ErrorHandler(editorController.getApprovedArticles));
router.get('/articles/:id', editorController.verifyUserForEditor, ErrorHandler(editorController.viewArticle));

router.post('/articles/:id/approve', editorController.verifyUserForEditor, ErrorHandler(editorController.approveArticle));
router.post('/articles/:id/reject', editorController.verifyUserForEditor, ErrorHandler(editorController.rejectArticle));

export { router as EditorRouter };
