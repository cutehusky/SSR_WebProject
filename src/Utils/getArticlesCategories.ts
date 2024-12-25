import { DBConfig } from "./DBConfig";

export const getArticlesCategories = (categories: any[], editorID: number | null): Promise<any[]> => {
    return DBConfig('ARTICLE as a')
        .join('ARTICLE_SUBCATEGORY as as', 'a.ArticleID', 'as.ArticleID')
        .join('SUBCATEGORY as s', 'as.SubcategoryID', 's.SubcategoryID')
        .join('CATEGORY as c', 's.CategoryID', 'c.CategoryID')
        .join('WRITER as w', 'a.WriterID', 'w.WriterID')
        .whereIn('c.CategoryID', categories.map((category) => category.id))
        .where('a.Status', 'Pending')
        .where(function () {
            this.whereNull('a.EditorID').orWhere('a.EditorID', editorID);
        })
        .select(
            'a.ArticleID as id',
            'a.Title as title',
            'w.Alias as author',
            DBConfig.raw("DATE_FORMAT(a.DatePosted, '%d/%m/%Y') as date"),
            's.Name as subcategory',
            'c.Name as category'
        );
};
