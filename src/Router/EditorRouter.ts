import express from 'express';
import { EditorController } from '../Controllers/EditorController';

const router = express.Router();

const editorController = new EditorController();

router.get('/:editorID/articles', editorController.getArticles);
router.get('/:editorID/articles/:id', editorController.viewArticle);

router.post('/:editorID/articles/:id/approve', editorController.approveArticle);
router.post('/:editorID/articles/:id/reject', editorController.rejectArticle);

export { router as EditorRouter };
