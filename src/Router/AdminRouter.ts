import express from 'express';
import { AdminController } from '../Controllers/AdminController';
import {bufferUploader} from "../Utils/MulterConfig";
import ErrorHandler from "../Utils/ErrorHandle";


const router = express.Router();
router.use(express.json());

const adminController = new AdminController();

router.get('/categories',adminController.verifyAdmin, ErrorHandler(adminController.getCategories));
router.get('/tags',adminController.verifyAdmin, ErrorHandler(adminController.getTags));
router.get('/articles',adminController.verifyAdmin, ErrorHandler(adminController.getArticles));
router.get('/users',adminController.verifyAdmin, ErrorHandler(adminController.getUsers));

router.post('/tag/edit',adminController.verifyAdmin, ErrorHandler(adminController.editTag));
router.post('/category/edit',adminController.verifyAdmin, ErrorHandler(adminController.editCategory));
router.post('/subcategory/edit',adminController.verifyAdmin, ErrorHandler(adminController.editSubCategory));
router.post('/user/edit',adminController.verifyAdmin, ErrorHandler(adminController.editUser));

router.post('/tag/new',adminController.verifyAdmin, ErrorHandler(adminController.newTag));
router.post('/category/new',adminController.verifyAdmin, ErrorHandler(adminController.newCategory));
router.post('/subcategory/new',adminController.verifyAdmin, ErrorHandler(adminController.newSubCategory));
router.post('/user/new',adminController.verifyAdmin,bufferUploader.any() , ErrorHandler(adminController.newUser));

router.post('/tag/delete',adminController.verifyAdmin, ErrorHandler(adminController.deleteTag));
router.post('/category/delete',adminController.verifyAdmin, ErrorHandler(adminController.deleteCategory));
router.post('/subcategory/delete',adminController.verifyAdmin, ErrorHandler(adminController.deleteSubCategory));
router.post('/user/delete',adminController.verifyAdmin, ErrorHandler(adminController.deleteUser));
router.post('/article/delete',adminController.verifyAdmin, ErrorHandler(adminController.deleteArticle));
router.post('/article/publish/:id',adminController.verifyAdmin, ErrorHandler(adminController.publishArticle));

router.post('/add-premium',adminController.verifyAdmin, ErrorHandler(adminController.addPremium));

export { router as AdminRouter };
