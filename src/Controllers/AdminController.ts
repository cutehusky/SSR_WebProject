import { Response, Request } from "express";

export class AdminController {

    // /admin/categories
    getCategories(req: Request, res: Response) {
        res.render('AdminCategoriesView');
    }

    // /admin/category/:id/edit
    editCategory(req: Request, res: Response) {
        const categoryId = req.params.id;
        res.render('AdminEditCategoryView', { categoryId });
    }

    // /admin/tags
    getTags(req: Request, res: Response) {
        res.render('AdminTagsView');
    }

    // /admin/tag/:id/edit
    editTag(req: Request, res: Response) {
        const tagId = req.params.id;
        res.render('AdminEditTagView', { tagId });
    }

    // /admin/articles?category=
    getArticles(req: Request, res: Response) {
        const category = (req.query.category || "-1") as string;
        const categoryId = parseInt(category);
        let testCategory = [];
        for (let i = 0; i < 20; i++) {
            let testSubCategory = [];
            for (let j = 0; j < 20; j++)
                testSubCategory.push({
                    id: j,
                    name: "test subcategory " + j
                });
            testCategory.push({
                id: i,
                name: "test category " + i,
                SubCategories: testSubCategory
            })
        }
        res.render('Admin/AdminArticlesView', {
            selectedCategory: categoryId,
            customJs: ['DataTable.js'],
            customCss: ['Admin.css'],
            Top10Categories: testCategory.slice(0, 10),
            Categories: testCategory
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
                role: "abc",
                dateOfBirth: "1/1/2077"
            })
        }
        let testCategory = [];
        for (let i = 0; i < 20; i++) {
            let testSubCategory = [];
            for (let j = 0; j < 20; j++)
                testSubCategory.push({
                    id: j,
                    name: "test subcategory " + j
                });
            testCategory.push({
                id: i,
                name: "test category " + i,
                SubCategories: testSubCategory
            })
        }
        res.render('Admin/AdminUsersView', {
            selectedRole: role,
            Top10Categories: testCategory.slice(0, 10),
            Categories: testCategory,
            customJs: ['DataTable.js'],
            customCss: ['Admin.css'],
            data: testData
        });
    }
}
