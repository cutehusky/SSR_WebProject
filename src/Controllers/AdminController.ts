import {Response, Request} from "express";

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

    // /admin/articles
    getArticles(req: Request, res: Response) {
        res.render('AdminArticlesView');
    }

    // /admin/user
    getUsers(req: Request, res: Response) {
        res.render('AdminUsersView');
    }
}
