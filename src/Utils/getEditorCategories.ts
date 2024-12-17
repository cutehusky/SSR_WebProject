import { DBConfig } from "./DBConfig";

export const getEditorCategories = (editorID: number): Promise<any[]> => {
    return DBConfig('EDITOR_CATEGORY as ec')
        .join('CATEGORY as c', 'ec.CategoryID', 'c.CategoryID')
        .where('ec.EditorID', editorID)
        .select('c.CategoryID as id', 'c.Name as name');
};
