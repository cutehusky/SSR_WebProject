import express from 'express';
import { EditorController } from '../Controllers/EditorController';

const router = express.Router();

const editorController = new EditorController();

router.get('/articles', editorController.verifyUserForEditor, editorController.getArticles);
router.get('/articles/:id', editorController.verifyUserForEditor, editorController.viewArticle);

router.post('/articles/:id/approve', editorController.verifyUserForEditor, editorController.approveArticle);
router.post('/articles/:id/reject', editorController.verifyUserForEditor, editorController.rejectArticle);

export { router as EditorRouter };
