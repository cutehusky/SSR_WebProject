// MiddlewareController
import {NextFunction, Request, Response} from "express";

import {DBConfig} from "../Utils/DBConfig";
import {UserRole} from "../Models/UserData";

export class MiddlewareController {
    getToDay(req:Request, res: Response, next: NextFunction) {
        res.locals.today = new Date(Date.now()).toLocaleDateString('vi-VN',{ weekday: 'long', day: '2-digit', month: '2-digit', year: 'numeric' });
        next();
    }
    async getCategory(req: Request, res: Response, next: NextFunction) {
        try {
            let categories = await DBConfig("category").select("CategoryID as id", "Name as name");

            for (let i = 0; i < categories.length; i++) {
                categories[i].SubCategories = await DBConfig("category")
                    .where("category.CategoryID", "=", categories[i].id)
                    .join("subcategory", "category.CategoryID", "=", "subcategory.CategoryID")
                    .select("SubCategoryID as id",
                        "category.CategoryID as parentId",
                        "subcategory.Name as name", "category.Name as parentName",
                        DBConfig.raw("CONCAT(category.Name, ' / ', subcategory.Name) as fullname"));
            }
            res.locals.Categories = categories;
            res.locals.Top10Categories = categories.slice(0, 10);
            next();
        } catch (e) {
            next(e);
        }
    }

    async getTags(req: Request, res: Response, next: NextFunction) {
        try {
            res.locals.tags = await DBConfig("tag").select("TagID as id", "Name as name");
            next();
        } catch (e) {
            next(e);
        }
    }

    async getProfile(req: Request, res: Response, next: NextFunction) {
        try {
            if (req.session.authUser) {
                res.locals.profile = req.session.authUser;
                res.locals.isLogin = true;
                res.locals.isUser = req.session.authUser.role === UserRole.User;
                res.locals.isWriter = req.session.authUser.role === UserRole.Writer;
                if (req.session.authUser.role === UserRole.User) {
                    let userData = await DBConfig("subscriber")
                        .where("SubscriberID", req.session.authUser.id).first();
                    const dateExpired = new Date(userData.DateExpired);
                    res.locals.isPremium = new Date(Date.now()) < dateExpired;
                    let sec = (dateExpired.getTime() - Date.now()) / 1000;
                    res.locals.premiumTime = Math.floor(sec / 60) + ":" + Math.round(sec % 60);
                }
            } else {
                res.locals.isLogin = false;
                res.locals.profile = null;
                res.locals.isUser = true;
                res.locals.isWriter = false;
            }
            next();
        } catch (e) {
            next(e);
        }
    }
}
