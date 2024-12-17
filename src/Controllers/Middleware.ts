// MiddlewareController
import {NextFunction, Request, Response} from "express";

import {DBConfig} from "../Utils/DBConfig";
import {UserData, UserRole} from "../Services/userService";

export class MiddlewareController {
    getToDay(req:Request, res: Response, next: NextFunction) {
        res.locals.today = new Date(Date.now()).toLocaleDateString('vi-VN',{ weekday: 'long', day: '2-digit', month: '2-digit', year: 'numeric' });
        next();
    }
    async getCategory(req: Request, res: Response, next: NextFunction) {
        let categories = await DBConfig("CATEGORY").select("CategoryID as id", "Name as name");

        for (let i = 0; i < categories.length; i++) {
            categories[i].SubCategories = await DBConfig("CATEGORY")
                .where("CATEGORY.CategoryID", "=", categories[i].id)
                .join("SUBCATEGORY", "CATEGORY.CategoryID", "=", "SUBCATEGORY.CategoryID")
                .select("SubCategoryID as id",
                    "CATEGORY.CategoryID as parentId",
                    "SUBCATEGORY.Name as name", "CATEGORY.Name as parentName",
                    DBConfig.raw("CONCAT(CATEGORY.Name, \" / \", SUBCATEGORY.Name) as fullname"));
        }
        res.locals.Categories = categories;
        res.locals.Top10Categories = categories.slice(0, 10);
        next();
    }

    async getTags(req: Request, res: Response, next: NextFunction) {
        let tags = await DBConfig("TAG").select("TagID as id", "Name as name");
        res.locals.tags = tags;
        next();
    }

    async getProfile(req: Request, res: Response, next: NextFunction) {
        if (req.session.authUser) {
            res.locals.profile = req.session.authUser;
            res.locals.isLogin = true;
            res.locals.isUser = req.session.authUser.role === UserRole.User;
        }
        else {
            res.locals.isLogin = false;
            res.locals.profile = null;
            res.locals.isUser = true;
        }
        next();
    }
}
