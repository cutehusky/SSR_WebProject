import { DBConfig } from "./DBConfig";

export const getEditorCategories = (editorID: number): Promise<any[]> => {
    return DBConfig('EDITOR_CATEGORY as ec')
        .join('CATEGORY as c', 'ec.CategoryID', 'c.CategoryID')
        .where('ec.EditorID', editorID)
        .select('c.CategoryID as id', 'c.Name as name');
};

export const getCategorySubcategories = (categoryID: number): Promise<any[]> => {
    return DBConfig('SUBCATEGORY')
        .where('CategoryID', categoryID)
        .select('SubcategoryID as id', 'Name as name');
}