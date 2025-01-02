import { DBConfig } from "./DBConfig";

export const getEditorSubCategories = async (editorID: number): Promise<any[]> => {
    return await DBConfig('editor_category as ec')
        .join('subcategory as sc', 'ec.CategoryID', 'sc.SubCategoryID')
        .join('category as c', 'sc.CategoryID', 'c.CategoryID')
        .where('ec.EditorID', editorID)
        .select(
            'sc.SubCategoryID as id',
            DBConfig.raw('Concat(c.Name, " - ", sc.Name) as name')
        )
};

export const getCategorySubcategories = (categoryID: number): Promise<any[]> => {
    return DBConfig('subcategory')
        .where('CategoryID', categoryID)
        .select('SubcategoryID as id', 'Name as name');
}