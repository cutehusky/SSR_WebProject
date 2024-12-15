import {NextFunction, Request, Response} from "express";


export class MiddlewareController {
    getCategory(req: Request, res: Response, next: NextFunction) {
        let testCategory = [];
        let k = 0;
        for (let i = 0; i < 20; i++) {
            let testSubCategory = [];
            for (let j = 0; j < 20; j++){
                let parentName = "test category " + i;
                let name = "test subcategory " + k;
                testSubCategory.push({
                    id: k,
                    name: name,
                    parentName: parentName,
                    parentId: i,
                    fullname: `${parentName} \\ ${name}`
                });
                k++;
            }
            testCategory.push({
                id: i,
                name: "test category " + i,
                SubCategories: testSubCategory
            });
        }
        res.locals.Categories = testCategory;
        res.locals.Top10Categories = testCategory.slice(0, 10);
        next();
    }

    getProfile(req: Request, res: Response, next: NextFunction) {
        res.locals.profile = {
            name: 'hello',
            dateOfBirth: "2088-11-11",
            email: "abc@gmail.com",
            id: 1,
            penName: "xyz",
            role: "writer",
            time: 20
        }
        next();
    }
}