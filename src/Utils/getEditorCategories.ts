import { DBConfig } from "./DBConfig";

export const getEditorCategories = async (editorID: number): Promise<any[]> => {
    return await DBConfig('editor_category as ec')
        .join('category as c', 'ec.CategoryID', 'c.CategoryID')
        .where('ec.EditorID', editorID)
        .select('c.CategoryID as id', 'c.Name as name');
};

export const getCategorySubcategories = (categoryID: number): Promise<any[]> => {
    return DBConfig('subcategory')
        .where('CategoryID', categoryID)
        .select('SubcategoryID as id', 'Name as name');
}