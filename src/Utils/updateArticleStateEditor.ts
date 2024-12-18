import { DBConfig } from "./DBConfig";

export const updateArticleStateEditor = (editorID: number, articleID: number, status: string, reason: string | null = null): Promise<any> => {
    if (status === 'approved') {
        return DBConfig('ARTICLE as a')
            .where('a.ArticleID', articleID)
            .update({
                Status: 'Approved',
                EditorID: editorID,
                Reason: null
            });
    }
    if (status === 'rejected') {
        return DBConfig('ARTICLE as a')
            .where('a.ArticleID', articleID)
            .update({
                Status: 'Rejected',
                EditorID: editorID,
                Reason: reason
            });
    }
    return Promise.resolve();
};