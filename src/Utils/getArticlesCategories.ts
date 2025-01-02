import { DBConfig } from "./DBConfig";

export const getArticlesCategories = (subCategories: any[], editorID: number | null): Promise<any[]> => {
    return DBConfig('article as a')
        .join('article_subcategory as asc', 'a.ArticleID', 'asc.ArticleID')
        .join('subcategory as s', 'asc.SubcategoryID', 's.SubcategoryID')
        .join('category as c', 's.CategoryID', 'c.CategoryID')
        .join('writer as w', 'a.WriterID', 'w.WriterID')
        .whereIn('s.SubCategoryID', subCategories.map((subCategory) => subCategory.id))
        .where('a.Status', 'Draft')
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

export const getArticlesCategoriesRejected = (editorID: number | null): Promise<any[]> => {
    return DBConfig('article as a')
        .join('article_subcategory as asc', 'a.ArticleID', 'asc.ArticleID')
        .join('subcategory as s', 'asc.SubcategoryID', 's.SubcategoryID')
        .join('category as c', 's.CategoryID', 'c.CategoryID')
        .join('writer as w', 'a.WriterID', 'w.WriterID')
        .where('a.Status', 'Rejected')
        .where('a.EditorID', editorID)
        .select(
            'a.ArticleID as id',
            'a.Title as title',
            'w.Alias as author',
            DBConfig.raw("DATE_FORMAT(a.DatePosted, '%d/%m/%Y') as date"),
            's.Name as subcategory',
            'c.Name as category'
        );
};

export const getArticlesCategoriesApproved = (editorID: number | null): Promise<any[]> => {
    return DBConfig('article as a')
        .join('article_subcategory as asc', 'a.ArticleID', 'asc.ArticleID')
        .join('subcategory as s', 'asc.SubcategoryID', 's.SubcategoryID')
        .join('category as c', 's.CategoryID', 'c.CategoryID')
        .join('writer as w', 'a.WriterID', 'w.WriterID')
        .where(function () {
            this.where('a.Status', 'Approved').orWhere('a.Status', 'Published');
        })
        .where('a.EditorID', editorID)
        .select(
            'a.ArticleID as id',
            'a.Title as title',
            'w.Alias as author',
            DBConfig.raw("DATE_FORMAT(a.DatePosted, '%d/%m/%Y') as date"),
            's.Name as subcategory',
            'c.Name as category'
        );
};