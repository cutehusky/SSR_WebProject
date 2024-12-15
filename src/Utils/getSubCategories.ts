import {DBConfig} from "./DBConfig";

export const GetSubCategories = (): Promise<{
  id: number;
  name: string;
  parentName: string;
  parentId: number;
  fullname: string
}[]> => {
  return DBConfig("CATEGORY")
      .join("SUBCATEGORY", "CATEGORY.CategoryID", "=", "SUBCATEGORY.CategoryID")
      .select("SubCategoryID as id",
          "CATEGORY.CategoryID as parentId",
          "SUBCATEGORY.Name as name", "CATEGORY.Name as parentName",
          DBConfig.raw("CONCAT(CATEGORY.Name, \" / \", SUBCATEGORY.Name) as fullname"));;
}