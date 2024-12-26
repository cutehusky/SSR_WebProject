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
        res.locals.tags = await DBConfig("TAG").select("TagID as id", "Name as name");
        next();
    }

    async getProfile(req: Request, res: Response, next: NextFunction) {
        if (req.session.authUser) {
            console.log(req.session.authUser);
            res.locals.profile = req.session.authUser;
            res.locals.isLogin = true;
            res.locals.isUser = req.session.authUser.role === UserRole.User;
            res.locals.isWriter = req.session.authUser.role === UserRole.Writer;
            if (req.session.authUser.role === UserRole.User) {
                let userData = await DBConfig("SUBSCRIBER")
                    .where("SubscriberID", req.session.authUser.id).first();
                console.log(userData);
                res.locals.isPremium = new Date(Date.now()) < userData.DateExpired;
                let sec = (userData.DateExpired.getTime() - Date.now()) / 1000;
                res.locals.premiumTime = Math.floor(sec / 60) + ":" + Math.round(sec % 60);
            }
        }
        else {
            res.locals.isLogin = false;
            res.locals.profile = null;
            res.locals.isUser = true;
            res.locals.isWriter = false;
        }
        next();
    }
}
