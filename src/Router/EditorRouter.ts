import express from 'express';
import { EditorController } from '../Controllers/EditorController';

const router = express.Router();

const editorController = new EditorController();

router.get('/articles', editorController.getArticles);
router.get('/articles/:id/approve', editorController.approveArticle);
router.get('/articles/:id/reject', editorController.rejectArticle);
router.get('/articles/:id/view', editorController.viewArticle);

export { router as EditorRouter };
