import { Response, Request, NextFunction } from 'express';

import {
    GetSubCategories,
    countCategories,
    GetCategoriesPage,
    countSubCategories,
} from '../Services/AdminCategoryService';
import { getCategories } from '../Utils/getCategories';
import { countUsers, getUsers } from '../Utils/getUsers';
import { DBConfig } from '../Utils/DBConfig';
import { getEditorSubCategories } from '../Utils/getEditorCategories';
import {
    deleteArticle,
    getArticlesCategories,
    countArticlesCategories,
} from '../Services/AdminArticleService';
import {
    createUser,
    deleteUser,
    updateUser,
    addPremium,
    getCategorySubCategories,
} from '../Services/AdminUserService';
import { UserData, UserRole } from '../Models/UserData';
import {
    createTag,
    deleteTagById,
    getTagByName,
    getTags,
    getTagsById,
    updateTagById,
} from '../Utils/getTags';
import { get } from 'jquery';
import { clamp, getPagingNumber } from '../Utils/MathUtils';
import { isValidUrl } from '../Utils/isValidURL';
import { getWriterNameById } from '../Services/UserPasswordService';
import bcrypt from 'bcryptjs';

const itemPerPage = 5;

export class AdminController {
    verifyAdmin(req: Request, res: Response, next: NextFunction) {
        if (
            !req.session.authUser ||
            req.session.authUser.role !== UserRole.Admin
        ) {
            res.redirect('/404');
            return;
        }
        next();
    }
    // /admin/categories?category=
    async getCategories(req: Request, res: Response) {
        const category =
            req.query.category && !isNaN(Number(req.query.category))
                ? Number(req.query.category)
                : -1;
        let page = parseInt(req.query.page as string) || 1;
        let subCategoryPage =
            parseInt(req.query.subCategoryPage as string) || 1;

        const categoryId = category;

        // Phân trang cho Chuyên Mục Cấp 1

        let itemPerPage = 5;
        const categoryNum = await countCategories();
        const totalPages = Math.ceil(categoryNum / itemPerPage);
        page = Math.max(1, Math.min(page, totalPages));

        let page_items = getPagingNumber(page, totalPages);
        page_items = page_items.map(item => ({
            ...item,
            link: `/admin/categories?page=${item.value}&category=${categoryId}&subCategoryPage=${subCategoryPage}`,
        }));

        const previousLink =
            page > 1
                ? `/admin/categories?page=${page - 1
                }&category=${categoryId}&subCategoryPage=${subCategoryPage}`
                : '';
        const nextLink =
            page < totalPages
                ? `/admin/categories?page=${page + 1
                }&category=${categoryId}&subCategoryPage=${subCategoryPage}`
                : '';

        // Lấy danh sách Chuyên Mục Cấp 1
        const categoryList = await GetCategoriesPage(
            (page - 1) * itemPerPage,
            itemPerPage
        );

        const allCategories = await getCategories();

        // Phân trang cho Chuyên Mục Cấp 2

        const subCategoryNum = await countSubCategories(categoryId);

        const totalSubCategoryPages = Math.ceil(
            subCategoryNum[0].count / itemPerPage
        );
        subCategoryPage = Math.max(
            1,
            Math.min(subCategoryPage, totalSubCategoryPages)
        );

        let subCategoryPageItems = getPagingNumber(
            subCategoryPage,
            totalSubCategoryPages
        );
        subCategoryPageItems = subCategoryPageItems.map(item => ({
            ...item,
            link: `/admin/categories?category=${categoryId}&subCategoryPage=${item.value}&page=${page}`,
        }));

        const subCategoryPreviousLink =
            subCategoryPage > 1
                ? `/admin/categories?category=${categoryId}&subCategoryPage=${subCategoryPage - 1
                }&page=${page}`
                : '';
        const subCategoryNextLink =
            subCategoryPage < totalSubCategoryPages
                ? `/admin/categories?category=${categoryId}&subCategoryPage=${subCategoryPage + 1
                }&page=${page}`
                : '';

        // Lấy danh sách Chuyên Mục Cấp 2
        const subCategoryList = await GetSubCategories(
            categoryId,
            (subCategoryPage - 1) * itemPerPage,
            itemPerPage
        );

        res.render('Admin/AdminCategoriesView', {
            customCss: ['Admin.css', 'Component.css'],
            customJs: ['AdminCategoryDataTable.js'],
            Categories: categoryList,
            Subcategories: subCategoryList,
            selectedCategory: categoryId,
            page_items,
            previousLink,
            nextLink,
            subCategoryPageItems,
            subCategoryPreviousLink,
            subCategoryNextLink,
            currentpage: page,
            allCategories: allCategories,
        });
    }

    // /admin/tags
    async getTags(req: Request, res: Response) {
        const tagData = await getTags();

        // Cấu hình phân trang
        let page = parseInt(req.query.page as string) || 1;
        const totalTags = tagData.length;
        const totalPages = Math.ceil(totalTags / itemPerPage);

        page = Math.max(1, Math.min(page, totalPages));

        let page_items = getPagingNumber(page, totalPages);
        page_items = page_items.map(item => ({
            ...item,
            link: `/admin/tags?page=${item.value}`,
        }));

        const previousLink = page > 1 ? `/admin/tags?page=${page - 1}` : '';
        const nextLink =
            page < totalPages ? `/admin/tags?page=${page + 1}` : '';

        const currentTags = tagData.slice(
            (page - 1) * itemPerPage,
            page * itemPerPage
        );

        res.render('Admin/AdminTagsView', {
            customCss: ['Admin.css', 'Component.css'],
            customJs: ['AdminTagsDataTable.js'],
            data: currentTags,
            page_items,
            previousLink,
            nextLink,
        });
    }

    // /admin/articles?category=&page=
    async getArticles(req: Request, res: Response) {
        const categoryId = parseInt((req.query.category || '-1') as string);
        let page = parseInt(req.query.page as string) || 1;
        let articleNum = await countArticlesCategories(categoryId);
        let totalPages = Math.ceil(articleNum / itemPerPage);
        page = clamp(page, 1, totalPages);
        let page_items = getPagingNumber(page, totalPages);
        for (let i = 0; i < page_items.length; i++)
            page_items[
                i
            ].link = `/admin/articles?category=${categoryId}&page=${page_items[i].value}`;

        const previousLink =
            page > 1
                ? `/admin/articles?category=${categoryId}&page=${page - 1}`
                : '';
        const nextLink =
            page < totalPages
                ? `/admin/articles?category=${categoryId}&page=${page + 1}`
                : '';

        const data = await getArticlesCategories(
            categoryId,
            (page - 1) * itemPerPage,
            itemPerPage
        );
        for (let i = 0; i < data.length; i++)
            data[i].writer = await getWriterNameById(data[i].writerID);

        console.log('Data: ', data);
        console.log(categoryId);

        req.session.retUrl = req.originalUrl;

        res.render('Admin/AdminArticlesView', {
            selectedCategory: categoryId,
            data: data,
            customJs: ['AdminArticlesDataTable.js'],
            customCss: ['Admin.css', 'Component.css'],
            page_items,
            previousLink,
            nextLink,
        });
    }

    // /admin/users?role=
    async getUsers(req: Request, res: Response) {
        const role = (req.query.role || 'all') as string;
        let page = parseInt(req.query.page as string) || 1;
        let userNum = await countUsers(role);
        let totalPages = Math.ceil(userNum / itemPerPage);
        page = clamp(page, 1, totalPages);
        let page_items = getPagingNumber(page, totalPages);
        for (let i = 0; i < page_items.length; i++)
            page_items[
                i
            ].link = `/admin/users?role=${role}&page=${page_items[i].value}`;

        const previousLink =
            page > 1 ? `/admin/users?role=${role}&page=${page - 1}` : '';
        const nextLink =
            page < totalPages
                ? `/admin/users?role=${role}&page=${page + 1}`
                : '';

        console.log('Role: ', role);
        const data = await getUsers(
            role,
            (page - 1) * itemPerPage,
            itemPerPage
        );

        // lấy các category của những editor quản lý
        for (let i = 0; i < data.length; i++) {
            if (data[i].role === 'Editor') {
                data[i].categories = await getEditorSubCategories(data[i].id);
                console.log(JSON.stringify(data[i].categories, null, 2));
            } else {
                data[i].categories = [];
            }
            if (data[i].role === 'User') {
                data[i].upPremium = await DBConfig('subscriber')
                    .where('SubscriberID', data[i].id)
                    .first()
                    .then(subscriber => {
                        const dateExpired = new Date(subscriber.DateExpired);
                        return new Date(Date.now()) > dateExpired;
                    });
            }
        }

        // lấy các penName của những writer
        for (let i = 0; i < data.length; i++) {
            if (data[i].role === 'Writer') {
                data[i].penName = await DBConfig('writer')
                    .where('WriterID', data[i].id)
                    .first()
                    .then(writer => writer.Alias);
            }
        }
        const selectedSubCategory = await getCategorySubCategories();

        req.session.retUrl = req.originalUrl;
        console.log('Data: ', data);
        res.render('Admin/AdminUsersView', {
            selectedRole: role,
            customJs: ['AdminUsersDataTable.js', 'AdminEditUsers.js', 'AdminAddUsers.js'],
            customCss: ['Admin.css', 'Component.css'],
            data: data,
            page_items,
            previousLink,
            nextLink,
            Categories: selectedSubCategory,
        });
    }

    // /admin/tag/edit
    async editTag(req: Request, res: Response) {
        const { id, name } = req.body;

        let tag = await getTagsById(id);

        if (tag.length === 0) {
            res.status(404).send('Tag not found');
            return;
        }

        await updateTagById(id, name);

        res.redirect('/admin/tags');
    }

    // /admin/category/edit
    async editCategory(req: Request, res: Response) {
        const { id, name } = req.body;
        let Categories = res.locals.Categories;
        const existCategory = Categories.find(
            (category: { id: number }) => category.id === parseInt(id)
        );

        if (!existCategory) {
            res.status(404).send('Category not found');
            return;
        }

        await DBConfig('category')
            .where('CategoryID', '=', id)
            .update({ Name: name });

        res.redirect('/admin/categories');
    }

    // /admin/user/edit
    // request datatest{
    //         "id": 4,
    // "username": "johnupdated",
    // "fullname": "John Doe Updated",
    // "email": "johnupdated@example.com",
    // "password": "newpassword123",
    // "dob": "1990-01-01",
    // "role": 1
    // }
    async editUser(req: Request, res: Response) {
        try {
            const userData: UserData = req.body;
            let category_add: number[] = req.body.category_add;
            let category_remove: number[] = req.body.category_remove;
            const penName = req.body.penName as string;
            console.log('Request body:', req.body);

            // Đảm bảo `category_add` và `category_remove` luôn là mảng
            if (!Array.isArray(category_add)) {
                category_add = category_add ? [Number(category_add)] : [];
            }
            if (!Array.isArray(category_remove)) {
                category_remove = category_remove
                    ? [Number(category_remove)]
                    : [];
            }
            // Validation cơ bản
            if (userData.id == null || isNaN(userData.id)) {
                res.status(400).json({
                    error: 'ID is required and must be a valid number.',
                });
                return;
            }

            // Gọi Service để tạo user
            await updateUser(userData, category_add, category_remove, penName);
            const redirectUrl = req.session.retUrl || '/admin/users';
            res.redirect(redirectUrl);
        } catch (error) {
            // Bắt lỗi nếu có
            console.error('Error updating user:', error);
            res.status(500).json({
                error: `Internal Server Error: ${(error as Error).message}`,
            });
        }
    }

    // /admin/article/edit
    // request datatest ={
    //   "articleID": 5,
    //   "title": "Updated Title",
    //   "content": "Updated content of the article.",
    //   "abstract": "Updated abstract of the article.",
    //   "status": "published",
    //   "isPremium": true,
    //   "writerID": 1,
    //   "editorID": 2
    // }

    // /admin/tag/new
    async newTag(req: Request, res: Response) {
        const { name } = req.body;
        const existtag = await getTagByName(name);
        console.log('exist tag: ', existtag);
        if (existtag.length > 0) {
            res.status(400).json({
                error: 'Tag already exists.',
            });
            return;
        }

        await createTag(name);
        res.redirect('/admin/tags');
    }

    // /admin/category/new
    async newCategory(req: Request, res: Response) {
        const categoryName = req.body.name as string;

        try {
            await DBConfig('category').insert({ name: categoryName });
            res.redirect('/admin/categories');
        } catch (error) {
            console.error('Error creating category:', error);
            res.status(500).json({
                error: 'Internal Server Error: ' + (error as Error).message,
            });
        }
    }

    // /admin/user/new
    // request datatest{
    //     "id": 4,
    //     "username": "johndoe",
    //     "fullname": "John Doe",
    //     "email": "johndoe@example.com",
    //     "password": "password123",
    //     "dob": "1990-01-01",
    //     "role": 0
    // }
    async newUser(req: Request, res: Response) {
        try {
            const userData: UserData = req.body;
            const penName = req.body.penName as string;
            console.log('Request body:', req.body);
            // Gọi Service để tạo user
            userData.password = await bcrypt.hash(userData.password, 10);

            await createUser(userData, penName);

            const redirectUrl = req.session.retUrl || '/admin/users';
            res.redirect(redirectUrl);
        } catch (error) {
            // Bắt lỗi nếu có
            console.error('Error creating user:', error);
            res.status(500).json({
                error: 'Internal Server Error: ' + (error as Error).message,
            });
        }
    }

    // /admin/tag/delete
    async deleteTag(req: Request, res: Response) {
        const id = req.body.id as string;
        try {
            await deleteTagById(parseInt(id));
            res.redirect('/admin/tags');
        } catch (error) {
            res.status(500).json({
                error: "Internal Server Error: " + (error as Error).message,
            });
        }
    }

    // /admin/category/delete
    async deleteCategory(req: Request, res: Response) {
        const categoryId = req.body.id as string;
        let categoryList = res.locals.Categories;

        const categoryIndex = categoryList.find(
            (category: { id: number }) => category.id === parseInt(categoryId)
        );

        if (!categoryIndex) {
            res.status(404).send('Category not found');
            return;
        }
        await DBConfig('category').where('CategoryID', '=', categoryId).del();
        await DBConfig('subcategory')
            .where('CategoryID', '=', categoryId)
            .del();
        res.redirect('/admin/categories');
    }

    // /admin/user/delete
    // request datatest{
    //     "id": 4
    // }
    async deleteUser(req: Request, res: Response) {
        try {
            const id = req.body.id;
            console.log('Request body:', req.body);
            // Validation cơ bản
            if (id == null || isNaN(id)) {
                res.status(400).json({
                    error: 'ID is required and must be a valid number.',
                });
                return;
            }

            // Gọi Service để xóa user
            await deleteUser(id);
            let redirectUrl = req.session.retUrl || '/admin/users';
            if (!isValidUrl(redirectUrl)) {
                redirectUrl = '/admin/users';
            }
            res.redirect(redirectUrl);
        } catch (error) {
            // Bắt lỗi nếu có
            console.error('Error deleting user:', error);
            res.status(500).json({
                error: 'Internal Server Error: ' + (error as Error).message,
            });
        }
    }

    // /admin/article/delete
    // request datatest = {
    // "id" : 5
    // }
    async deleteArticle(req: Request, res: Response) {
        const articleId = Number(req.body.id);
        if (articleId == null || isNaN(articleId)) {
            res.status(400).json({
                error: 'ID is required and must be a valid number.',
            });
            return;
        }
        // console.log("articleId: ", articleId);
        await deleteArticle(articleId);
        res.redirect('/admin/articles');
    }

    // /admin/subcategory/edit
    // request data{
    //   id: '0', subid
    //   category: '1', parentid
    //   name: 'test subcategory 0' name
    // }
    async editSubCategory(req: Request, res: Response) {
        const { id, category, name } = req.body;
        await DBConfig('subcategory')
            .where('SubCategoryID', id) // Điều kiện SubCategoryID = id
            .update({ Name: name, CategoryID: category }); // Cập nhật tên và CategoryID

        res.redirect('/admin/categories/?category=' + category);
    }

    // /admin/subcategory/new
    // request data{
    //  category: '1', parent id
    //  name: 'ádasd' name
    // }
    async newSubCategory(req: Request, res: Response) {
        const { category, name } = req.body;
        const parentId = parseInt(category);

        await DBConfig('subcategory').insert({
            name: name,
            CategoryID: parentId,
        });
        res.redirect('/admin/categories/?category=' + category);
    }

    // /admin/subcategory/delete
    // request data{
    //   parentName: '1', categoryId
    //   id: '0' subCateforyId
    // }
    async deleteSubCategory(req: Request, res: Response) {
        const { parentName, id } = req.body;
        console.log(req.query);

        await DBConfig('subcategory')
            .where('SubCategoryID', id)
            .andWhere('CategoryID', parentName)
            .del();

        res.redirect('/admin/categories/?category=');
    }

    // /admin/article/publish/:id
    async publishArticle(req: Request, res: Response) {
        const articleId = parseInt(req.params.id);
        if (articleId == null || isNaN(articleId)) {
            res.status(400).json({
                error: 'ID is required and must be a valid number.',
            });
            return;
        }
        await DBConfig('article')
            .where('ArticleID', articleId)
            .update({ Status: 'Published', DatePublished: new Date() });
        res.redirect('/admin/articles');
    }

    async addPremium(req: Request, res: Response) {
        if (
            req.session.authUser &&
            req.session.authUser.role === UserRole.Admin
        ) {
            await addPremium(req.body.id);
            const retUrl = req.session.retUrl || '/';
            res.redirect(retUrl);
        } else {
            res.redirect('/404');
        }
    }
}
