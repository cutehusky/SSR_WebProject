import { DBConfig } from "./DBConfig";

export const getArticleDetails = (articleID: number): Promise<any> => {
    return DBConfig('ARTICLE as a')
        .join('ARTICLE_SUBCATEGORY as as', 'a.ArticleID', 'as.ArticleID')
        .join('SUBCATEGORY as s', 'as.SubcategoryID', 's.SubcategoryID')
        .join('CATEGORY as c', 's.CategoryID', 'c.CategoryID')
        .join('WRITER as w', 'a.WriterID', 'w.WriterID')
        .where('a.ArticleID', articleID)
        .select(
            'a.*',
            'w.Alias',
            's.Name as Subcategory',
            's.SubcategoryID',
            'c.Name as Category',
            'c.CategoryID'
        );
};