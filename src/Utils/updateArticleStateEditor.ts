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
            await trx('article')
                .where('ArticleID', articleID)
                .update({
                    Status: 'Approved',
                    EditorID: editorID,
                    Reason: null,
                    DatePublished: dateTime,
                });

            // Delete existing article subcategories
            await trx('article_subcategory')
                .where('ArticleID', articleID)
                .del();
            
            // Insert new article subcategory
            await trx('article_subcategory').insert({
                ArticleID: articleID,
                SubcategoryID: subcategoryID,
            });

            // Delete existing tags
            await trx('article_tag')
                .where('ArticleID', articleID)
                .del();

            // Insert new tags
            if (tags.length > 0) {
                const tagInserts = tags.map((tag) => ({
                    ArticleID: articleID,
                    TagID: tag,
                }));
                await trx('article_tag').insert(tagInserts);
            }
        } else {
            await trx('article')
                .where('ArticleID', articleID)
                .update({
                    Status: status,
                    EditorID: editorID,
                    Reason: reason,
                });
        }
    });
};