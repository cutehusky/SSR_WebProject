import express from 'express';
import { AdminController } from '../Controllers/AdminController';

const router = express.Router();
router.use(express.json());

const adminController = new AdminController();

router.get('/categories', adminController.getCategories);
router.get('/tags', adminController.getTags);
router.get('/articles', adminController.getArticles);
router.get('/users', adminController.getUsers);

router.post('/tag/edit', adminController.editTag);
router.post('/category/edit', adminController.editCategory);
router.post('/subcategory/edit', adminController.editSubCategory);
router.post('/user/edit', adminController.editUser);

router.post('/tag/new', adminController.newTag);
router.post('/category/new', adminController.newCategory);
router.post('/subcategory/new', adminController.newSubCategory);
router.post('/user/new', adminController.newUser);

router.post('/tag/delete', adminController.deleteTag);
router.post('/category/delete', adminController.deleteCategory);
router.post('/subcategory/delete', adminController.deleteSubCategory);
router.post('/user/delete', adminController.deleteUser);
router.post('/article/delete', adminController.deleteArticle);

export { router as AdminRouter };
