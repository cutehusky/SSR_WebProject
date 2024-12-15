import { Response, Request } from "express";

import { testSubCategory } from "../Utils/testSubCategory";
import { getParentNames } from "../Utils/getParentNames";
import { get } from "jquery";

let tagData = [
  { name: "test 1", id: 1 },
  { name: "test 2", id: 2 },
  { name: "test 3", id: 3 },
  { name: "test 4", id: 4 },
  { name: "test 5", id: 5 },
];


let subCategoryData = testSubCategory();

export class AdminController {
  // /admin/categories?category=
  getCategories(req: Request, res: Response) {
    const category = (req.query.category || "-1") as string;
    const categoryId = parseInt(category);

    let filteredSubCategoryData = subCategoryData;
    if(parseInt(category) != -1){
      filteredSubCategoryData = subCategoryData.filter((subCategory) => subCategory.parentId === categoryId);
    }

    res.render("Admin/AdminCategoriesView", {
      customCss: ["Admin.css"],
      customJs: ["AdminCategoryDataTable.js"],
      Categories: getParentNames(subCategoryData),
      Subcategories: filteredSubCategoryData,
    });
  }

  // /admin/tags
  getTags(req: Request, res: Response) {
    res.render("Admin/AdminTagsView", {
      customCss: ["Admin.css"],
      customJs: ["AdminTagsDataTable.js"],
      data: tagData,
    });
  }

  // /admin/articles?category=
  getArticles(req: Request, res: Response) {
    const category = (req.query.category || "-1") as string;
    const categoryId = parseInt(category);
    res.render("Admin/AdminArticlesView", {
      selectedCategory: categoryId,
      customJs: ["AdminArticlesDataTable.js"],
      customCss: ["Admin.css"],
    });
  }

  // /admin/users?role=
  getUsers(req: Request, res: Response) {
    const role = (req.query.role || "all") as string;
    let testData = [];
    for (let i = 0; i < 20; i++) {
      testData.push({
        id: i,
        email: "123@gmail.com",
        name: "hello",
        role: "editor",
        dateOfBirth: "2077-12-12",
      });
    }
    for (let i = 20; i < 40; i++) {
      testData.push({
        id: i,
        email: "123@gmail.com",
        name: "hello",
        role: "admin",
        dateOfBirth: "2077-1-1",
      });
    }

    res.render("Admin/AdminUsersView", {
      selectedRole: role,
      customJs: ["AdminUsersDataTable.js"],
      customCss: ["Admin.css"],
      data: testData,
    });
  }

  // /admin/tag/edit
  async editTag(req: Request, res: Response) {
    const tagId = req.body.id as string;
    const tagName = req.body.name as string;
    // let tagList = await DBConfig("tags").select("id", "name"); // có thể thêm nhiều mục khác
    let tagList = tagData;
    const tag = tagList.find((tag) => tag.id === parseInt(tagId));
    if (!tag) {
      res.status(404).send("Tag not found");
      return;
    }
    tag.name = tagName;
    res.render("Admin/AdminTagsView", {
      customCss: ["Admin.css"],
      customJs: ["AdminTagsDataTable.js"],
      data: tagList,
    });

  }

  // /admin/category/edit
  async editCategory(req: Request, res: Response) {
    // const categoryId = req.query.id as string;
    // // let categoryList = await DBConfig("categories").select("id", "name", "parentName", "parentId"); // có thể thêm nhiều mục khác
    // let categoryList = subCategoryData;
    // const category = categoryList.find((category) => category.id === parseInt(categoryId));
    // if (!category) {
    //   res.status(404).send("Category not found");
    //   return;
    // }
    // category.name = req.query.name as string;
    const { id, name } = req.body;
    console.log(id, name)
    const category = subCategoryData.find((category) => category.parentId == parseInt(id));
    if (!category) {
      res.status(404).send("Category not found");
      return;
    }

    console.log("chưa updata: ",category)

    subCategoryData.map((category) => {
      if(category.parentId == parseInt(id)){
        category.parentName = name;
      }
    })

    console.log("sau update: ",category)

    
    res.render("Admin/AdminCategoriesView", {
      customCss: ["Admin.css"],
      customJs: ["AdminCategoryDataTable.js"],
      Categories: getParentNames(subCategoryData),
      Subcategories: subCategoryData,
    });
  
  }

  // /admin/user/edit
  editUser(req: Request, res: Response) {}

  // /admin/article/edit
  editArticle(req: Request, res: Response) {}

  // /admin/tag/new
  async newTag(req: Request, res: Response) {
    const tagName = req.body.name as string;
    let tagList = tagData;
    tagList.push({ name: tagName, id: tagList.length + 1 });

    // await DBConfig("tags").insert({ name: tagName });

    res.render("Admin/AdminTagsView", {
      customCss: ["Admin.css"],
      customJs: ["AdminTagsDataTable.js"],
      data: tagList,
    });
  }

  // /admin/category/new
  newCategory(req: Request, res: Response) {
    const categoryName = req.body.name as string;

    const existingCategory = subCategoryData.find((category) => category.parentName === categoryName);
    if (existingCategory) {
      res.status(400).send("Category already exists");
      return;
    }

    const parentId = parseInt(getParentNames(subCategoryData).length.toString());
    const filteredSubCategoryData = subCategoryData.filter((subCategory) => subCategory.parentId === parentId);
    let name = "test subcategory " + filteredSubCategoryData.length;
    subCategoryData.push({
      name:  name,
      id: filteredSubCategoryData.length, 
      parentName: categoryName, 
      parentId: parentId,
      fullname: `${categoryName} \ ${name}`
    });
    res.render("Admin/AdminCategoriesView", {
      customCss: ["Admin.css"],
      customJs: ["AdminCategoryDataTable.js"],
      Categories: getParentNames(subCategoryData),
      Subcategories: subCategoryData,
    });
  }

  // /admin/user/new
  newUser(req: Request, res: Response) {}

  // /admin/article/new
  newArticle(req: Request, res: Response) {}

  // /admin/tag/delete
  deleteTag(req: Request, res: Response) {
    const tagId = req.body.id as string;
    let tagList = tagData;

    const tagIndex = tagList.find((tag) => tag.id === parseInt(tagId));
    if (!tagIndex) {
      res.status(404).send("Tag not found");
      return;
    }
    tagList = tagList.filter((tag) => tag.id !== parseInt(tagId));
    tagData = tagList;
    res.render("Admin/AdminTagsView", {
      customCss: ["Admin.css"],
      customJs: ["AdminTagsDataTable.js"],
      data: tagList,
    });
  }

  // /admin/category/delete
  deleteCategory(req: Request, res: Response) {
    const categoryId = req.body.id as string;
    let categoryList = subCategoryData.filter((category) => category.parentId !== parseInt(categoryId));
    subCategoryData = categoryList;
    res.render("Admin/AdminCategoriesView", {
      customCss: ["Admin.css"],
      customJs: ["AdminCategoryDataTable.js"],
      Categories: getParentNames(categoryList),
      Subcategories: categoryList,
    });
  }

  // /admin/user/delete
  deleteUser(req: Request, res: Response) {}

  // /admin/article/delete
  deleteArticle(req: Request, res: Response) {}

  // /admin/article/edit/:id
  editArticleEditor(req: Request, res: Response) {}

  // /admin/article/edit/:id
  createArticleEditor(req: Request, res: Response) {
    res.render("Writer/WriterPublishNews", {
      customCss: ["Writer.css"],
      customJs: ["Summernote.js"],
    });
  }

  // /admin/subcategory/edit
// request data{
//   id: '0', subid
//   category: '1', parentid
//   name: 'test subcategory 0' name
// }
  editSubCategory(req: Request, res: Response) {
    const { id, category, name } = req.body;
    console.log(id, category, name)
    const subCategory = subCategoryData.find((subcategory) => {
      if(subcategory.id == parseInt(id) && subcategory.parentId == parseInt(category)){
        return subcategory;
      }
    })
    if (!subCategory) {
      res.status(404).send("SubCategory not found");
      return;
    }
    subCategory.name = name;
    res.render("Admin/AdminCategoriesView", {
      customCss: ["Admin.css"],
      customJs: ["AdminCategoryDataTable.js"],
      Categories: getParentNames(subCategoryData),
      Subcategories: subCategoryData,
    });
  }

  // /admin/subcategory/new
  // request data{ 
  //  category: '1', parent id
  //  name: 'ádasd' name
  // }
  newSubCategory(req: Request, res: Response) {
    const { category, name } = req.body;
    const parentId = parseInt(category);
    const filteredSubCategoryData = subCategoryData.filter((subCategory) => subCategory.parentId === parentId);
    subCategoryData.push({ 
      name: name, 
      id: filteredSubCategoryData.length, 
      parentName: filteredSubCategoryData[0].parentName, 
      parentId: parentId,
      fullname: ""
    });
    console.log(subCategoryData)
    res.render("Admin/AdminCategoriesView", {
      customCss: ["Admin.css"],
      customJs: ["AdminCategoryDataTable.js"],
      Categories: getParentNames(subCategoryData),
      Subcategories: subCategoryData,
    });
  }

  // /admin/subcategory/delete
  // request data{ 
  //   parentName: '1', 
  //   id: '0' 
  // }
  deleteSubCategory(req: Request, res: Response) {
    const { parentName, id } = req.body;
    let categoryList = subCategoryData.filter((category) => category.parentId !== parseInt(parentName) || category.id !== parseInt(id));
    subCategoryData = categoryList;
    res.render("Admin/AdminCategoriesView", {
      customCss: ["Admin.css"],
      customJs: ["AdminCategoryDataTable.js"],
      Categories: getParentNames(subCategoryData),
      Subcategories: subCategoryData,
    });
  }
}
