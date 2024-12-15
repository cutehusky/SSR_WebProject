import { Response, Request } from "express";

import { GetSubCategories } from "../Utils/getSubCategories";
import { getParentNames } from "../Utils/getParentNames";
import { get } from "jquery";

import { ArticleData, createArticle, deleteArticle, updateArticle } from "../Services/articleService";
import { UserData, createUser, deleteUser, updateUser } from "../Services/userService";
let tagData = [
  { name: "test 1", id: 1 },
  { name: "test 2", id: 2 },
  { name: "test 3", id: 3 },
  { name: "test 4", id: 4 },
  { name: "test 5", id: 5 },
];


//let subCategoryData = await GetSubCategories();
let subCategoryData: {
  id: number;
  name: string;
  parentName: string;
  parentId: number;
  fullname: string
}[]  = [];

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
  // request datatest{
  //         "id": 4,
  // "username": "johnupdated",
  // "fullname": "John Doe Updated",
  // "email": "johnupdated@example.com",
  // "password": "newpassword123",
  // "dob": "1990-01-01",
  // "role": 1
  // }
  editUser(req: Request, res: Response) {
    try {
      const userData : UserData = req.body;
      console.log('Request body:', req.body);
      // Validation cơ bản
      if (userData.id == null || isNaN(userData.id)) {
        res.status(400).json({
          error: 'ID is required and must be a valid number.',
        });
        return;
      }
  
      // Gọi Service để tạo user
      updateUser(userData);
      // Thông báo đã tạo user thành công
      res.status(201).json({
        message: 'User updated successfully!',
      });
    } catch (error) {
      // Bắt lỗi nếu có
      console.error('Error updating user:', error);
      res.status(500).json({
        error: 'Internal Server Error.',
      });
    }
  }

  // /admin/article/edit
  // request datatest ={
  //   "articleID": 5,
  //   "title": "Updated Title",
  //   "content": "Updated content of the article.",
  //   "abstract": "Updated abstract of the article.",
  //   "status": "published", 
  //   "isPremium": true,
  //   "writerID": 1,
  //   "editorID": 2
  // }

  editArticle(req: Request, res: Response) {
    try {
      const {id, title, datePosted, content, abstract, status, isPremium, writerID, editorID } = req.body;
  
       // Log dữ liệu để kiểm tra
      console.log('Request body:', req.body);
      // Validation cơ bản
      
  
      // Gọi Service để tạo bài viết
      const articleID = updateArticle({
        id,
        title,
        datePosted,
        content,
        abstract,
        status,
        isPremium,
        writerID,
        editorID,
      });
      // Thông báo đã tạo bài viết thành công
      res.status(201).json({
        message: 'Article created successfully!',
        articleID,
      });
    } catch (error) {
      // Bắt lỗi nếu có
      console.error('Error creating article:', error);
      res.status(500).json({
        error: 'Internal Server Error.',
      });
    }
  }

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
  // request datatest{
  //     "id": 4,
  //     "username": "johndoe",
  //     "fullname": "John Doe",
  //     "email": "johndoe@example.com",
  //     "password": "password123",
  //     "dob": "1990-01-01",
  //     "role": 0
  // }
  newUser(req: Request, res: Response) {
    try {
      const userData : UserData = req.body;
      console.log('Request body:', req.body);
      // Validation cơ bản
      if (userData.id == null || isNaN(userData.id)) {
        res.status(400).json({
          error: 'ID is required and must be a valid number.',
        });
        return;
      }
  
      // Gọi Service để tạo user
      createUser(userData);
      // Thông báo đã tạo user thành công
      res.status(201).json({
        message: 'User created successfully!',
      });
    } catch (error) {
      // Bắt lỗi nếu có
      console.error('Error creating user:', error);
      res.status(500).json({
        error: 'Internal Server Error.',
      });
    }
  }

  // /admin/article/new
  // request datatest{
  //   "title": "New Article Title",
  //   "datePosted": "2024-12-14",
  //   "content": "This is the content of the new article.",
  //   "abstract": "A brief summary of the article.",
  //   "status": "draft",
  //   "isPremium": true,
  //   "writerID": "1",
  //   "editorID": "2"
  // }
  async newArticle(req: Request, res: Response) {
    try {
      const article : ArticleData = req.body;
  
       // Log dữ liệu để kiểm tra
      console.log('Request body:', req.body);
  
      // Gọi Service để tạo bài viết
      await createArticle(article);
  
      res.status(201).json({
        message: 'Article created successfully!',
      });
    } catch (error) {
      console.error('Error creating article:', error);
      res.status(500).json({
        error: 'Internal Server Error.',
      });
    }
  }

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
  // request datatest{
  //     "id": 4
  // }
  deleteUser(req: Request, res: Response) {
    try {
      const id = req.body.id;
      console.log('Request body:', req.body);
      // Validation cơ bản
      if (id == null || isNaN(id)) {
        res.status(400).json({
          error: 'ID is required and must be a valid number.',
        });
        return;
      }
  
      // Gọi Service để xóa user
      deleteUser(id);
      // Thông báo đã xóa user thành công
      res.status(204).json({
        message: 'User deleted successfully!',
      });
    } catch (error) {
      // Bắt lỗi nếu có
      console.error('Error deleting user:', error);
      res.status(500).json({
        error: 'Internal Server Error.',
      });
    }
  }

  // /admin/article/delete
  // request datatest = {
  // "id" : 5  
  // }
  deleteArticle(req: Request, res: Response) {
    const articleId = Number(req.body.id);
    console.log("articleId: ", articleId);
    deleteArticle(articleId);
    res.status(204).send("Article deleted");
  }

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
