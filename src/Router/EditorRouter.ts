import express from 'express';
import { EditorController } from '../Controllers/EditorController';

const router = express.Router();

const editorController = new EditorController();

router.get('/:editorID/articles', editorController.getArticles);
router.get('/article/:id', editorController.viewArticle);

router.post('/approve', editorController.approveArticle);
router.post('/reject', editorController.rejectArticle);

export { router as EditorRouter };
