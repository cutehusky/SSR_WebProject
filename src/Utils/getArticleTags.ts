import { DBConfig } from "./DBConfig";

export const getArticleTags = (articleID: number): Promise<any[]> => {
    return DBConfig('article_tag as at')
        .join('tag as t', 'at.TagID', 't.TagID')
        .where('at.ArticleID', articleID)
        .select('t.TagID as id', 't.Name as name');
};