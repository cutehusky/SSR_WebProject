import { DBConfig, DBConfig as db } from '../Utils/DBConfig';
import {writer} from "repl";

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
            'Title',
            'DatePosted',
            'Abstract',
            'IsPremium',
            'ViewCount',
            'CATEGORY.Name as category',
            'SUBCATEGORY.Name as subcategory',
            'CATEGORY.CategoryID as categoryId',
            'SUBCATEGORY.SubCategoryID as subcategoryId',
            'URL'
        )
        .groupBy(
            'ARTICLE.ArticleID',
            'ARTICLE.Title',
            'ARTICLE.Abstract',
            'IsPremium',
            'ViewCount',
            'ARTICLE.DatePosted',
            'ARTICLE_URL.URL',
            'CATEGORY.Name',
            'SUBCATEGORY.Name',
            'CATEGORY.CategoryID',
            'SUBCATEGORY.SubCategoryID',
        )
        .limit(limit)
        .offset(offset);

    // Get tags for each article
    for (let i = 0; i < response.length; i++)
        response[i].tags = await GetTagsOfArticle(response[i].ArticleID);
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

export const CountSearchResult = async (searchValue: string): Promise<number> => {
    let count = await DBConfig('ARTICLE')
        .whereRaw(
            'MATCH(Title, Content, Abstract) AGAINST(? IN NATURAL LANGUAGE MODE)',
            [searchValue]
        ).count("* as count").first();
    return count ? count.count as number : 0;
};

export const SearchArticle = async (searchValue: string, offset:number, limit: number) => {
    let result = await DBConfig('ARTICLE')
        .whereRaw(
            'MATCH(Title, Content, Abstract) AGAINST(? IN NATURAL LANGUAGE MODE)',
            [searchValue]
        )
        .join(
            'ARTICLE_SUBCATEGORY',
            'ARTICLE_SUBCATEGORY.ArticleID',
            '=',
            'ARTICLE.ArticleID'
        )
        .join(
            'SUBCATEGORY',
            'ARTICLE_SUBCATEGORY.SubCategoryID',
            '=',
            'SUBCATEGORY.SubCategoryID'
        )
        .join('CATEGORY', 'CATEGORY.CategoryID', '=', 'SUBCATEGORY.CategoryID')
        .join('ARTICLE_URL', 'ARTICLE_URL.ArticleID', '=', 'ARTICLE.ArticleID')
        .where('STT', '=', '0')
        .orderBy('DatePosted', 'desc')
        .select(
            'ARTICLE.ArticleID',
            'Title',
            'DatePosted',
            'Abstract',
            'IsPremium',
            'ViewCount',
            'CATEGORY.Name as category',
            'SUBCATEGORY.Name as subcategory',
            'CATEGORY.CategoryID as categoryId',
            'SUBCATEGORY.SubCategoryID as subcategoryId',
            'URL'
        ).offset(offset).limit(limit);
    for (let i = 0; i < result.length; i++)
        result[i].tags = await GetTagsOfArticle(result[i].ArticleID);
    return result;
};

export const GetArticleById = async (articleId: string) => {
    return DBConfig('ARTICLE').where({ ArticleID: articleId }).first();
};

export interface Tag {
    id: string;
    name: string;
    name_encode: string
}

export const GetTagsOfArticle = async (
    articleId: string
): Promise<Array<Tag>> => {
    let tags = await DBConfig('TAG')
        .join('ARTICLE_TAG', 'ARTICLE_TAG.TagID', '=', 'TAG.TagID')
        .where({ ArticleID: articleId })
        .select('Name as name', 'TAG.TagID as id');
    if (tags)
        for (let i = 0; i < tags.length; i++)
            tags[i].name_encode = encodeURIComponent(tags[i].name);
    return tags ? tags : [];
};

export const AddViewCount = async (articleId: string) => {
    let currentCnt = await DBConfig('ARTICLE')
        .where({ ArticleId: articleId })
        .select('ViewCount')
        .first();
    if (!currentCnt) return;
    await DBConfig('ARTICLE')
        .where({ ArticleId: articleId })
        .update({ ViewCount: currentCnt.ViewCount+1 });
};

export const CountArticleOfWriterByStates = async (
    writerId: number,
    states: string[]) => {
    let count = await DBConfig("ARTICLE")
        .where({'WriterID':writerId })
        .whereIn("Status", states).count("* as count").first();
    return count ? count.count as number : 0;
}

export const GetArticleOfWriterByStates = async (
    writerId: number,
    states: string[],
    offset: number,
    limit: number) => {
    return DBConfig("ARTICLE")
        .join("ARTICLE_SUBCATEGORY", "ARTICLE_SUBCATEGORY.ArticleID","=","ARTICLE.ArticleID")
        .join("SUBCATEGORY",'ARTICLE_SUBCATEGORY.SubCategoryID', '=', 'SUBCATEGORY.SubCategoryID')
        .join("CATEGORY", "CATEGORY.CategoryID", "=", "SUBCATEGORY.CategoryID")
        .join("ARTICLE_URL", "ARTICLE_URL.ArticleID", "=","ARTICLE.ArticleID")
        .where({STT: 0})
        .where({'WriterID':writerId })
        .whereIn("Status", states)
        .select("Title as title", "Abstract as abstract",
            "DatePublished as datePublished",
            "DatePosted as datePosted", "CATEGORY.Name as category",
            "SUBCATEGORY.Name as subcategory", "URL as cover",
            "Status as state", "ARTICLE.ArticleID as id")
        .orderBy("DatePosted", "desc").offset(offset).limit(limit);
}

export const GetRelativeArticle = async (
    categoryId: string,
    articleId: string,
    limit: number = 5
) => {
    return DBConfig('ARTICLE')
        .join(
            'ARTICLE_SUBCATEGORY',
            'ARTICLE_SUBCATEGORY.ArticleID',
            '=',
            'ARTICLE.ArticleID'
        )
        .where('ARTICLE.ArticleID', '!=', articleId)
        .where('CATEGORY.CategoryID', '=', categoryId)
        .join(
            'SUBCATEGORY',
            'ARTICLE_SUBCATEGORY.SubCategoryID',
            '=',
            'SUBCATEGORY.SubCategoryID'
        )
        .join('CATEGORY', 'CATEGORY.CategoryID', '=', 'SUBCATEGORY.CategoryID')
        .join('ARTICLE_URL', 'ARTICLE_URL.ArticleID', '=', 'ARTICLE.ArticleID')
        .where('STT', '=', '0')
        .orderByRaw('RAND()')
        .select(
            'ARTICLE.ArticleID',
            'Title',
            'DatePosted',
            'Abstract',
            'IsPremium',
            'ViewCount',
            'CATEGORY.Name as category',
            'SUBCATEGORY.Name as subcategory',
            'CATEGORY.CategoryID as categoryId',
            'SUBCATEGORY.SubCategoryID as subcategoryId',
            'URL'
        )
        .limit(limit);
};

export const UpdateBackgroundImageOfArticle = async (
    articleId: string,
    value: string = 'null'
) => {
    return DBConfig('ARTICLE_URL')
        .where({ ArticleID: articleId, STT: 0 })
        .update({ URL: value });
};

export const AddBackgroundImageOfArticle = async (
    articleId: number,
    value: string = 'null'
) => {
    return DBConfig('ARTICLE_URL').insert({
        ArticleID: articleId,
        STT: 0,
        URL: value,
    });
};

export const GetCategoryFullNameOfArticle = async (articleId: string) => {
    return DBConfig('ARTICLE_SUBCATEGORY')
        .join(
            'SUBCATEGORY',
            'ARTICLE_SUBCATEGORY.SubCategoryID',
            '=',
            'SUBCATEGORY.SubCategoryID'
        )
        .join('CATEGORY', 'CATEGORY.CategoryID', '=', 'SUBCATEGORY.CategoryID')
        .where({ ArticleID: articleId })
        .select(
            'ARTICLE_SUBCATEGORY.SubCategoryID as id',
            DBConfig.raw(
                'CONCAT(CATEGORY.Name, " / ", SUBCATEGORY.Name) as fullname'
            )
        )
        .first();
};

export const GetCategoryOfArticle = async (articleId: string) => {
    return DBConfig('ARTICLE_SUBCATEGORY')
        .join(
            'SUBCATEGORY',
            'ARTICLE_SUBCATEGORY.SubCategoryID',
            '=',
            'SUBCATEGORY.SubCategoryID'
        )
        .join('CATEGORY', 'CATEGORY.CategoryID', '=', 'SUBCATEGORY.CategoryID')
        .where({ ArticleID: articleId })
        .select(
            'ARTICLE_SUBCATEGORY.SubCategoryID as id',
            'CATEGORY.Name as categoryName',
            'SUBCATEGORY.Name as subcategoryName',
            'CATEGORY.CategoryID as categoryId',
            'SUBCATEGORY.SubCategoryID as subcategoryId',
            DBConfig.raw(
                'CONCAT(CATEGORY.Name, " / ", SUBCATEGORY.Name) as fullname'
            )
        )
        .first();
};

export interface Comment {
    DatePosted: Date;
    Content: string;
    ArticleID: number;
    SubscriberID?: number;
    Name?: string;
}

export const GetCommentOfArticle = async (
    articleId: string
): Promise<Array<Comment>> => {
    let comment = await DBConfig('COMMENT')
        .where({
            ArticleId: articleId,
        })
        .orderBy('DatePosted', 'desc');
    return comment ? comment : [];
};

export const GetBackgroundImageOfArticle = async (
    articleId: string
): Promise<string> => {
    let bgURL = await DBConfig('ARTICLE_URL')
        .where({ STT: 0, ArticleID: articleId })
        .first();
    return bgURL && bgURL.URL ? bgURL.URL : 'null';
};

export const AddComment = async (
    articleId: string,
    content: string,
    date: Date,
    userId: number = 0
) => {
    if (!userId) {
        await DBConfig('COMMENT').insert({
            ArticleId: articleId,
            Content: content,
            DatePosted: date,
        });
    } else {
        await DBConfig('COMMENT').insert({
            ArticleId: articleId,
            Content: content,
            DatePosted: date,
            SubscriberID: userId
        });
    }
};
