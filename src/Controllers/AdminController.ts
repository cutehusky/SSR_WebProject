import { Response, Request } from "express";

export class AdminController {

    // /admin/categories?category=
    getCategories(req: Request, res: Response) {
        const category = (req.query.category || "-1") as string;
        const categoryId = parseInt(category);
        let testSubCategory = [];
        for (let i = 0; i < 20; i++) {
            for (let j = 0; j < 20; j++) {
                testSubCategory.push({
                    id: j,
                    name: "test subcategory " + j,
                    parentName: "test category " + i,
                    parentId: i
                });
            }
        }
        res.render('Admin/AdminCategoriesView', {
            customCss: ['Admin.css'],
            customJs: ['AdminCategoryDataTable.js'],
            selectedCategory: categoryId,
            Subcategories: testSubCategory
        });
    }

    // /admin/tags
    getTags(req: Request, res: Response) {
        res.render('Admin/AdminTagsView', {
            customCss: ['Admin.css'],
            customJs: ['AdminTagsDataTable.js'],
            data: [
                { name: "test 1", id: 1 },
                { name: "test 2", id: 2 },
                { name: "test 3", id: 3 },
                { name: "test 4", id: 4 },
                { name: "test 5", id: 5 },
            ]
        });
    }

    // /admin/articles?category=
    getArticles(req: Request, res: Response) {
        const category = (req.query.category || "-1") as string;
        const categoryId = parseInt(category);
        res.render('Admin/AdminArticlesView', {
            selectedCategory: categoryId,
            customJs: ['AdminArticlesDataTable.js'],
            customCss: ['Admin.css']
        });
    }

    // /admin/user?role=
    getUsers(req: Request, res: Response) {
        const role = (req.query.role || "all") as string;
        let testData = [];
        for (let i = 0; i < 20; i++) {
            testData.push({
                id: i,
                email: "123@gmail.com",
                name: "hello",
                role: "editor",
                dateOfBirth: "2077-12-12"
            })
        }
        for (let i = 20; i < 40; i++) {
            testData.push({
                id: i,
                email: "123@gmail.com",
                name: "hello",
                role: "admin",
                dateOfBirth: "2077-1-1"
            })
        }

        res.render('Admin/AdminUsersView', {
            selectedRole: role,
            customJs: ['AdminUsersDataTable.js'],
            customCss: ['Admin.css'],
            data: testData
        });
    }

    // /admin/tag/edit
    editTag(req: Request, res: Response) {
        const tagId = req.query.id as string;
    }

    // /admin/category/edit
    editCategory(req: Request, res: Response) {
        const categoryId = req.query.id as string;
    }

    // /admin/user/edit
    editUser(req: Request, res: Response) {

    }

    // /admin/article/edit
    editArticle(req: Request, res: Response) {

    }

    // /admin/tag/new
    newTag(req: Request, res: Response) {

    }

    // /admin/category/new
    newCategory(req: Request, res: Response) {

    }

    // /admin/user/new
    newUser(req: Request, res: Response) {

    }

    // /admin/article/new
    newArticle(req: Request, res: Response) {

    }

    // /admin/tag/delete
    deleteTag(req: Request, res: Response) {

    }

    // /admin/category/delete
    deleteCategory(req: Request, res: Response) {

    }

    // /admin/user/delete
    deleteUser(req: Request, res: Response) {

    }

    // /admin/article/delete
    deleteArticle(req: Request, res: Response) {

    }

    // /admin/article/edit/:id
    editArticleEditor(req: Request, res: Response) {

    }

    // /admin/article/edit/:id
    createArticleEditor(req: Request, res: Response) {
        res.render("Writer/WriterPublishNews", {
            customCss: ["Writer.css"],
            customJs: ["Summernote.js"],
        });
    }

    // /admin/subcategory/edit
    editSubCategory(req: Request, res: Response) {
        res.render("Writer/WriterUpdateNews", {
            customCss: ["Writer.css"],
            customJs: ["Summernote.js"],
        });
    }

    // /admin/subcategory/new
    newSubCategory(req: Request, res: Response) {

    }

    // /admin/subcategory/delete
    deleteSubCategory(req: Request, res: Response) {

    }
}
