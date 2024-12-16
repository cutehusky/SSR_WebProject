// MiddlewareController
import { NextFunction, Request, Response } from "express";
import session from "express-session";

import { DBConfig } from "../utils/DBConfig";
export class MiddlewareController {
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

    getProfile(req: Request, res: Response, next: NextFunction) {
        if (req.session.authUser) {
            res.locals.profile = req.session.authUser;
        }
        else {
            res.locals.profile = null
        }
        next();
    }
}
