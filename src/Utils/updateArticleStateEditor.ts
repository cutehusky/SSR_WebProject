import { DBConfig } from "./DBConfig";

export const updateArticleStateEditor = async (
    editorID: number,
    articleID: number,
    status: string,
    reason: string | null = null,
    tags: number[] = [],
    subcategoryID: number = 0,
    dateTime: string = ''
): Promise<any> => {
    return DBConfig.transaction(async (trx) => {
        if (status === 'Approved') {
            await trx('ARTICLE')
                .where('ArticleID', articleID)
                .update({
                    Status: 'Approved',
                    EditorID: editorID,
                    Reason: null,
                    DatePublished: dateTime,
                });

            // Delete existing article subcategories
            await trx('ARTICLE_SUBCATEGORY')
                .where('ArticleID', articleID)
                .del();
            
            // Insert new article subcategory
            await trx('ARTICLE_SUBCATEGORY').insert({
                ArticleID: articleID,
                SubcategoryID: subcategoryID,
            });

            // Delete existing tags
            await trx('ARTICLE_TAG')
                .where('ArticleID', articleID)
                .del();

            // Insert new tags
            if (tags.length > 0) {
                const tagInserts = tags.map((tag) => ({
                    ArticleID: articleID,
                    TagID: tag,
                }));
                await trx('ARTICLE_TAG').insert(tagInserts);
            }
        } else {
            await trx('ARTICLE')
                .where('ArticleID', articleID)
                .update({
                    Status: status,
                    EditorID: editorID,
                    Reason: reason,
                });
        }
    });
};