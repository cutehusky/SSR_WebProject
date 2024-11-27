import express from 'express';
import { AdminController } from '../Controllers/AdminController';

const router = express.Router();

const adminController = new AdminController();

router.get('/categories', adminController.getCategories);
router.get('/category/:id/edit', adminController.editCategory);
router.get('/tags', adminController.getTags);
router.get('/tag/:id/edit', adminController.editTag);
router.get('/articles', adminController.getArticles);
router.get('/user', adminController.getUsers);

export { router as AdminRouter };
