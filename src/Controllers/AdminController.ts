import { Response, Request } from "express";

import { GetSubCategories } from "../Utils/getSubCategories";
import { getCategories } from "../Utils/getCategories";
import {countUsers, getUsers} from "../Utils/getUsers";
import { DBConfig } from "../Utils/DBConfig";

import {
  ArticleData,
  createArticle,
  deleteArticle,
  updateArticle,
  getArticlesCategories,
  CountArticleOfWriterByStates, countArticlesCategories
} from "../Services/AdminArticleService";
import { createUser, deleteUser, updateUser } from "../Services/AdminUserService";
import { UserData } from "../Models/UserData";
import { getTags } from "../Utils/getTags";
import { get } from "jquery";
import {clamp, getPagingNumber} from "../Utils/MathUtils";

const itemPerPage = 5;

let tagData = [
  { name: "test 1", id: 1 },
  { name: "test 2", id: 2 },
  { name: "test 3", id: 3 },
  { name: "test 4", id: 4 },
  { name: "test 5", id: 5 },
];


export class AdminController {
  // /admin/categories?category=
  async getCategories(req: Request, res: Response) {
    const category = (req.query.category || "-1") as string;
    const categoryId = parseInt(category);
    const CategoryList = res.locals.Categories;
    const subCategoryList = await GetSubCategories(categoryId);

    res.render("Admin/AdminCategoriesView", {
      customCss: ["Admin.css"],
      customJs: ["AdminCategoryDataTable.js"],
      Categories: CategoryList,
      Subcategories: subCategoryList,
    });
  }

  // /admin/tags
  async getTags(req: Request, res: Response) {
    tagData = await getTags();
    res.render("Admin/AdminTagsView", {
      customCss: ["Admin.css"],
      customJs: ["AdminTagsDataTable.js"],
      data: tagData,
    });
  }

  // /admin/articles?category=&page=
  async getArticles(req: Request, res: Response) {
    const categoryId = parseInt((req.query.category || "-1") as string);
    let page = parseInt((req.query.page) as string) || 1;
    let articleNum = await countArticlesCategories(categoryId);
    let totalPages = Math.ceil(articleNum / itemPerPage);
    page = clamp(page, 1, totalPages);
    let page_items = getPagingNumber(page, totalPages);
    for (let i = 0; i < page_items.length;i++)
      page_items[i].link = `/admin/articles?category=${categoryId}&page=${page_items[i].value}`;

    const previousLink = page > 1
        ? `/admin/articles?category=${categoryId}&page=${page - 1}` : '';
    const nextLink = page < totalPages
        ? `/admin/articles?category=${categoryId}&page=${page + 1}` : '';

    const data = await getArticlesCategories(categoryId, (page - 1) * itemPerPage, itemPerPage);
    console.log("Data: ", data);

    res.render("Admin/AdminArticlesView", {
        selectedCategory: categoryId,
        data: data, // Dữ liệu bài viết trả về từ database
        customJs: ["AdminArticlesDataTable.js"],
        customCss: ["Admin.css"],
        page_items,
        previousLink,
        nextLink,
    });
  }

  // /admin/users?role=
  async getUsers(req: Request, res: Response) {
    const role = (req.query.role || "all") as string;
    let page = parseInt((req.query.page) as string) || 1;
    let userNum = await countUsers(role);
    let totalPages = Math.ceil(userNum / itemPerPage);
    page = clamp(page, 1, totalPages);
    let page_items = getPagingNumber(page, totalPages);
    for (let i = 0; i < page_items.length;i++)
      page_items[i].link = `/admin/users?role=${role}&page=${page_items[i].value}`;

    const previousLink = page > 1
        ? `/admin/users?role=${role}&page=${page - 1}` : '';
    const nextLink = page < totalPages
        ? `/admin/users?role=${role}&page=${page + 1}` : '';

    console.log("Role: ", role);
    const data = await getUsers(role,(page - 1) * itemPerPage, itemPerPage);
    console.log("Data: ", data);

    res.render("Admin/AdminUsersView", {
      selectedRole: role,
      customJs: ["AdminUsersDataTable.js"],
      customCss: ["Admin.css"],
      data: data,
      page_items,
      previousLink,
      nextLink,
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
    const { id, name } = req.body;
    let Categories = res.locals.Categories
    const existCategory = Categories.find((category: { id: number }) => category.id === parseInt(id));

    if (!existCategory) {
      res.status(404).send("Category not found");
      return;
    }

    await DBConfig("CATEGORY").where("CategoryID", "=", id).update({ Name: name });

    res.redirect("/admin/categories");
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
      res.redirect("/admin/users");
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
  async newCategory(req: Request, res: Response) {
    const categoryName = req.body.name as string;
    
    try{
      await DBConfig("category").insert({ name: categoryName });
      res.redirect("/admin/categories");
    } catch(error){
      console.error('Error creating category:', error);
      res.status(500).json({
        error: 'Internal Server Error with message: ' + (error as Error).message,
      });
    }
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
      // Gọi Service để tạo user
      createUser(userData);

      res.redirect("/admin/users");
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
  async deleteCategory(req: Request, res: Response) {
    const categoryId = req.body.id as string;
    let categoryList = res.locals.Categories;

    const categoryIndex = categoryList.find((category: { id: number }) => category.id === parseInt(categoryId));

    if (!categoryIndex) {
      res.status(404).send("Category not found");
      return;
    }
    await DBConfig("CATEGORY").where("CategoryID", "=", categoryId).del();
    await DBConfig("subcategory").where("CategoryID", "=", categoryId).del();
    res.redirect("/admin/categories");
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
      res.redirect("/admin/users");
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
    if(articleId == null || isNaN(articleId)){
      res.status(400).json({
        error: 'ID is required and must be a valid number.',
      });
      return;
    }
    // console.log("articleId: ", articleId);
    deleteArticle(articleId);
    res.status(204).send("Article deleted");
    res.redirect("/admin/articles");
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
  async editSubCategory(req: Request, res: Response) {
    const { id, category, name } = req.body;
    await DBConfig("subcategory")
      .where("SubCategoryID", id) // Điều kiện SubCategoryID = id
      .andWhere("CategoryID", category) // Điều kiện CategoryID = category
      .update({ Name: name}); // Cập nhật tên và CategoryID

    res.redirect("/admin/categories/?category=" + category);
  }

  // /admin/subcategory/new
  // request data{ 
  //  category: '1', parent id
  //  name: 'ádasd' name
  // }
  async newSubCategory(req: Request, res: Response) {
    const { category, name } = req.body;
    const parentId = parseInt(category);

    await DBConfig("subcategory").insert({ name: name, CategoryID: parentId });
    res.redirect("/admin/categories/?category=" + category);
  }

  // /admin/subcategory/delete
  // request data{ 
  //   parentName: '1', categoryId
  //   id: '0' subCateforyId
  // }
  async deleteSubCategory(req: Request, res: Response) {
    const { parentName, id } = req.body;

    await DBConfig("subcategory")
      .where("SubCategoryID", id)
      .andWhere("CategoryID", parentName)
      .del();
    
    // res.redirect("/admin/categories/?category=" + parentName);
  }
}
