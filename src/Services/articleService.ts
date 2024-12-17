import { DBConfig as db, DBConfig } from '../Utils/DBConfig';

export interface ArticleData {
    id: number;
    title: string;
    datePosted?: string; // Ngày đăng bài, có thể null
    content: string;
    abstract?: string; // Tóm tắt, có thể null
    status?: 'Draft' | 'Pending' | 'Rejected' | 'Approved' | 'Published'; // Trạng thái bài viết
    isPremium?: number; // 0: Miễn phí, 1: Premium
    writerID: number;
    editorID?: number | null; // Editor có thể null
}
export const createArticle = async (
    articleData: ArticleData
): Promise<void> => {
    const {
        id,
        title,
        datePosted,
        content,
        abstract,
        status = 'Draft',
        isPremium = 0,
        writerID,
        editorID = null,
    } = articleData;

    // Kiểm tra các trường bắt buộc
    if (id == null || isNaN(id)) {
        throw new Error('ID are required.');
    }

    // Kiểm tra xem bài viết đã tồn tại chưa
    const articleExists = await db('ARTICLE').where('Id', id).first();
    if (articleExists) {
        throw new Error(`Article with ID ${id} already exists.`);
    }
    // Kiểm tra nếu writerID và editorID tồn tại trong các bảng tương ứng
    const writerExists = await db('writer').where('WriterID', writerID).first();
    if (!writerExists) {
        throw new Error(`Writer with ID ${writerID} does not exist.`);
    }
    const editorExists = await db('editor').where('EditorID', editorID).first();
    if (!editorExists) {
        throw new Error(`Editor with ID ${editorID} does not exist.`);
    }

    try {
        // Insert bài viết vào database
        await db('ARTICLE').insert({
            Id: id,
            Title: title,
            DatePosted: datePosted,
            Content: content,
            Abstract: abstract,
            Status: status,
            IsPremium: isPremium,
            WriterID: writerID,
            EditorID: editorID,
        });
    } catch (error: any) {
        // Xử lý lỗi nếu có
        throw new Error('Error inserting article: ' + error.message);
    }
};

export const deleteArticle = async (articleID: number): Promise<void> => {
    try {
        // Kiểm tra nếu articleID không hợp lệ
        if (articleID == null || isNaN(articleID)) {
            throw new Error(
                'ArticleID is required and must be a valid number.'
            );
        }

        // Kiểm tra xem bài viết có tồn tại không
        const articleExists = await db('Article')
            .where('ArticleID', articleID)
            .first();
        if (!articleExists) {
            // Trả về lỗi 404 nếu bài viết không tồn tại
            console.log(`Article with ID ${articleID} does not exist.`);
            return; // Thoát khỏi hàm mà không ném lỗi
        }

        // Xóa bài viết khỏi database
        await db('ARTICLE').where('ArticleID', articleID).delete();
        console.log('Deleted article with ID ' + articleID);
    } catch (error) {
        const errorMessage =
            error instanceof Error ? error.message : 'Unknown error';
        console.error('Error deleting article:', errorMessage);
        throw new Error('Error deleting article: ' + errorMessage);
    }
};

export const updateArticle = async (
    articleData: ArticleData
): Promise<void> => {
    const {
        id,
        title,
        datePosted,
        content,
        abstract,
        status = 'Draft',
        isPremium = 0,
        writerID,
        editorID = null,
    } = articleData;

    // Kiểm tra các trường bắt buộc
    if (id == null || isNaN(id)) {
        throw new Error('ID are required.');
    }

    // Kiểm tra xem bài viết đã tồn tại chưa
    const articleExists = await db('ARTICLE').where('Id', id).first();
    if (!articleExists) {
        throw new Error(`Article with ID ${id} already exists.`);
    }
    // Kiểm tra nếu writerID và editorID tồn tại trong các bảng tương ứng
    const writerExists = await db('writer').where('WriterID', writerID).first();
    if (!writerExists) {
        throw new Error(`Writer with ID ${writerID} does not exist.`);
    }
    const editorExists = await db('editor').where('EditorID', editorID).first();
    if (!editorExists) {
        throw new Error(`Editor with ID ${editorID} does not exist.`);
    }

    try {
        // Update bài viết vào database
        await db('ARTICLE').where('ArticleID', id).update({
            Id: id,
            Title: title,
            DatePosted: datePosted,
            Content: content,
            Abstract: abstract,
            Status: status,
            IsPremium: isPremium,
            WriterID: writerID,
            EditorID: editorID,
        });
    } catch (error: any) {
        // Xử lý lỗi nếu có
        throw new Error('Error inserting article: ' + error.message);
    }
};

export const findPageByTagID = async (
    tagIDs: string[],
    limit: number,
    offset: number
): Promise<any[]> => {
    const response = await DBConfig('ARTICLE_TAG')
        .join('TAG', 'TAG.TagID', '=', 'ARTICLE_TAG.TagID')
        .join('ARTICLE', 'ARTICLE.ArticleID', '=', 'ARTICLE_TAG.ArticleID')
        .join('ARTICLE_URL', 'ARTICLE_URL.ArticleID', '=', 'ARTICLE.ArticleID')
        .join(
            'ARTICLE_SUBCATEGORY',
            'ARTICLE_SUBCATEGORY.ArticleID',
            '=',
            'ARTICLE.ArticleID'
        )
        .join(
            'SUBCATEGORY',
            'SUBCATEGORY.SubCategoryID',
            '=',
            'ARTICLE_SUBCATEGORY.SubCategoryID'
        )
        .join('CATEGORY', 'CATEGORY.CategoryID', '=', 'SUBCATEGORY.CategoryID')
        .whereIn('ARTICLE_TAG.TagID', tagIDs)
        .select(
            'ARTICLE.ArticleID',
            'ARTICLE.Title as title',
            'ARTICLE.Abstract as description',
            'ARTICLE.DatePosted as date',
            'ARTICLE_URL.URL as img',
            'CATEGORY.Name as category',
            'SUBCATEGORY.Name as subcategory'
        )
        .groupBy(
            'ARTICLE.ArticleID',
            'ARTICLE.Title',
            'ARTICLE.Abstract',
            'ARTICLE.DatePosted',
            'ARTICLE_URL.URL',
            'CATEGORY.Name',
            'SUBCATEGORY.Name'
        )
        .limit(limit)
        .offset(offset);

    // Get tags for each article
    for (let article of response) {
        const articleTags = await DBConfig('ARTICLE_TAG')
            .join('TAG', 'TAG.TagID', '=', 'ARTICLE_TAG.TagID')
            .where('ARTICLE_TAG.ArticleID', article.ArticleID)
            .select('TAG.Name as tag');

        article.tagList = articleTags.map(tag => ({
            tag: tag.tag,
            link: `/tags?tag=${encodeURIComponent(tag.tag)}`,
        }));
    }

    return response;
};

export const countArticlesByTagID = async (
    tagIDs: string[]
): Promise<number> => {
    let total = await DBConfig('ARTICLE_TAG')
        .whereIn('ARTICLE_TAG.TagID', tagIDs)
        .count('* as total')
        .groupBy('ARTICLE_TAG.TagID')
        .first();
    console.log('TT: ', total);

    return total ? (total as { total: number }).total : 0;
};
