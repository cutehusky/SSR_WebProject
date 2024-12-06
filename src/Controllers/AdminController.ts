import { Response, Request } from "express";

export class AdminController {

    // /admin/categories?category=
    getCategories(req: Request, res: Response) {
        const category = (req.query.category || "-1") as string;
        const categoryId = parseInt(category);
        let testCategory = [];
        let testSubCategoryList = [];
        for (let i = 0; i < 20; i++) {
            let testSubCategory = [];
            for (let j = 0; j < 20; j++) {
                testSubCategory.push({
                    id: j,
                    name: "test subcategory " + j
                });
                testSubCategoryList.push({
                    id: j,
                    name: "test subcategory " + j,
                    parentName: "test category " + i,
                    parentId: i
                });
            }
            testCategory.push({
                id: i,
                name: "test category " + i,
                SubCategories: testSubCategory
            });
        }
        res.render('Admin/AdminCategoriesView', {
            customCss: ['Admin.css'],
            customJs: ['AdminCategoryDataTable.js'],
            selectedCategory: categoryId,
            Top10Categories: testCategory.slice(0, 10),
            Categories: testCategory,
            data: {
                subcategories: testSubCategoryList
            }
        });
    }

    // /admin/category/:id/edit
    editCategory(req: Request, res: Response) {
        const categoryId = req.params.id;
        res.render('AdminEditCategoryView', { categoryId });
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
            customJs: ['AdminArticlesDataTable.js'],
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
                role: "editor",
                dateOfBirth: "1/1/2077"
            })
        }
        for (let i = 0; i < 20; i++) {
            testData.push({
                id: i,
                email: "123@gmail.com",
                name: "hello",
                role: "admin",
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
            customJs: ['AdminUsersDataTable.js'],
            customCss: ['Admin.css'],
            data: testData
        });
    }
}
