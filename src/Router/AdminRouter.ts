import express from 'express';
import { AdminController } from '../Controllers/AdminController';
import {bufferUploader} from "../Utils/MulterConfig";


const router = express.Router();
router.use(express.json());

const adminController = new AdminController();

router.get('/categories',adminController.verifyAdmin, adminController.getCategories);
router.get('/tags',adminController.verifyAdmin, adminController.getTags);
router.get('/articles',adminController.verifyAdmin, adminController.getArticles);
router.get('/users',adminController.verifyAdmin, adminController.getUsers);

router.post('/tag/edit',adminController.verifyAdmin, adminController.editTag);
router.post('/category/edit',adminController.verifyAdmin, adminController.editCategory);
router.post('/subcategory/edit',adminController.verifyAdmin, adminController.editSubCategory);
router.post('/user/edit',adminController.verifyAdmin, adminController.editUser);

router.post('/tag/new',adminController.verifyAdmin, adminController.newTag);
router.post('/category/new',adminController.verifyAdmin, adminController.newCategory);
router.post('/subcategory/new',adminController.verifyAdmin, adminController.newSubCategory);
router.post('/user/new',adminController.verifyAdmin,bufferUploader.any() , adminController.newUser);

router.post('/tag/delete',adminController.verifyAdmin, adminController.deleteTag);
router.post('/category/delete',adminController.verifyAdmin, adminController.deleteCategory);
router.post('/subcategory/delete',adminController.verifyAdmin, adminController.deleteSubCategory);
router.post('/user/delete',adminController.verifyAdmin, adminController.deleteUser);
router.post('/article/delete',adminController.verifyAdmin, adminController.deleteArticle);
router.post('/article/publish/:id',adminController.verifyAdmin, adminController.publishArticle);

router.post('/add-premium',adminController.verifyAdmin, adminController.addPremium);

export { router as AdminRouter };
