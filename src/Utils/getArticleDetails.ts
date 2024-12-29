import { DBConfig } from "./DBConfig";

export const getArticleDetails = (articleID: number): Promise<any> => {
    return DBConfig('article as a')
        .join('article_subcategory as as', 'a.ArticleID', 'as.ArticleID')
        .join('subscriber as s', 'as.SubcategoryID', 's.SubcategoryID')
        .join('category as c', 's.CategoryID', 'c.CategoryID')
        .join('writer as w', 'a.WriterID', 'w.WriterID')
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