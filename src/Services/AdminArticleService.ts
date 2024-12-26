import { DBConfig, DBConfig as db } from '../Utils/DBConfig';
import { writer } from 'repl';
import { getUsernameById } from './UserPasswordService';

export const deleteArticle = async (articleID: number): Promise<void> => {
    try {
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

export const getFullCategoryNameByCatID = async (
    categoryId: string
): Promise<{
    categoryName: string;
    subcategoryInfo: { subcategoryId: string; subcategoryName: string }[];
}> => {
    const response = await db('CATEGORY')
        .where('CATEGORY.CategoryID', '=', categoryId)
        .join(
            'SUBCATEGORY',
            'SUBCATEGORY.CategoryID',
            '=',
            'CATEGORY.CategoryID'
        )
        .select(
            'CATEGORY.Name as categoryName',
            'SUBCATEGORY.Name as subcategoryName',
            'SUBCATEGORY.SubCategoryID as subcategoryId'
        );
    const categoryName = response[0].categoryName; // because all categoryName are the same
    const subcategoryInfo = response.map(item => ({
        subcategoryId: item.subcategoryId,
        subcategoryName: item.subcategoryName,
    }));

    return { categoryName, subcategoryInfo };
};

export const getArticlesByCategoryID = async (
    categoryId: string,
    limit: number,
    offset: number
): Promise<any[]> => {
    const response = await db('CATEGORY')
        .where('CATEGORY.CategoryID', '=', categoryId)
        .join(
            'SUBCATEGORY',
            'SUBCATEGORY.CategoryID',
            '=',
            'CATEGORY.CategoryID'
        )
        .join(
            'ARTICLE_SUBCATEGORY',
            'ARTICLE_SUBCATEGORY.SubCategoryID',
            '=',
            'SUBCATEGORY.SubCategoryID'
        )
        .join(
            'ARTICLE',
            'ARTICLE.ArticleID',
            '=',
            'ARTICLE_SUBCATEGORY.ArticleID'
        )
        .join('ARTICLE_URL', 'ARTICLE_URL.ArticleID', '=', 'ARTICLE.ArticleID')
        .orderBy('ARTICLE.DatePosted', 'DESC')
        .select(
            'ARTICLE.ArticleID as ArticleID',
            'ARTICLE.Title as Title',
            'ARTICLE.Abstract as Abstract',
            'ARTICLE.DatePosted as DatePosted',
            'ARTICLE_URL.URL as URL',
            'SUBCATEGORY.Name as subcategory',
            'SUBCATEGORY.SubcategoryID as subcategoryId',
            'CATEGORY.Name as category'
        )
        .limit(limit)
        .offset(offset);

    const formattedResponse = await Promise.all(
        response.map(async item => {
            const date = new Date(item.DatePosted);
            const formattedDate = date
                .toISOString()
                .slice(0, 19)
                .replace('T', ' ');
            const tags = await db('ARTICLE_TAG')
                .where('ARTICLE_TAG.ArticleID', '=', item.ArticleID)
                .join('TAG', 'TAG.TagID', '=', 'ARTICLE_TAG.TagID')
                .select('TAG.Name as name');

            return {
                ...item,
                DatePosted: formattedDate,
                tags: tags.map(tag => ({
                    name_encode: encodeURIComponent(tag.name),
                    name: tag.name,
                })),
            };
        })
    );

    return formattedResponse;
};

export const countArticlesByCatID = async (
    categoryId: string
): Promise<number> => {
    let total = await db('CATEGORY')
        .where('CATEGORY.CategoryID', '=', categoryId)
        .join(
            'SUBCATEGORY',
            'SUBCATEGORY.CategoryID',
            '=',
            'CATEGORY.CategoryID'
        )
        .join(
            'ARTICLE_SUBCATEGORY',
            'ARTICLE_SUBCATEGORY.SubCategoryID',
            '=',
            'SUBCATEGORY.SubCategoryID'
        )
        .join(
            'ARTICLE',
            'ARTICLE.ArticleID',
            '=',
            'ARTICLE_SUBCATEGORY.ArticleID'
        )
        .groupBy('CATEGORy.CategoryID')
        .count('* as total')
        .first();

    return total ? (total.total as number) : 0;
};

export const countArticlesBySubCatID = async (
    subcategoryId: string
): Promise<number> => {
    let total = await db('ARTICLE_SUBCATEGORY')
        .where('ARTICLE_SUBCATEGORY.SubCategoryID', '=', subcategoryId)
        .join(
            'ARTICLE',
            'ARTICLE.ArticleID',
            '=',
            'ARTICLE_SUBCATEGORY.ArticleID'
        )
        .groupBy('ARTICLE_SUBCATEGORY.SubCategoryID')
        .count('* as total')
        .first();

    return total ? (total.total as number) : 0;
};

export const getSubcategoryInfoBySubCatID = async (
    subcategoryId: string
): Promise<{
    categoryID: string;
    categoryName: string;
    subcategoryInfo: {
        id: string;
        link: string;
        name: string;
    }[];
}> => {
    let { categoryID, categoryName } = await db('SUBCATEGORY')
        .where('SUBCATEGORY.SubCategoryID', '=', subcategoryId)
        .join('CATEGORY', 'CATEGORY.CategoryID', '=', 'SUBCATEGORY.CategoryID')
        .select(
            'CATEGORY.CategoryID as categoryID',
            'CATEGORY.Name as categoryName'
        )
        .first();

    const response = await db('SUBCATEGORY')
        .where('SUBCATEGORY.CategoryID', '=', categoryID)
        .select(
            'SUBCATEGORY.Name as name',
            'SUBCATEGORY.SubCategoryID as subID'
        );

    const result = {
        subcategoryInfo: response.map(item => ({
            id: item.subID.toString(),
            link: `/category/subcategory/${item.subID}`,
            name: item.name,
        })),
        categoryName,
        categoryID,
    };

    return result;
};

export const getArticlesBySubCatID = async (
    subcategoryId: string,
    limit: number,
    offset: number
): Promise<any[]> => {
    const response = await db('SUBCATEGORY')
        .where('SUBCATEGORY.SubCategoryID', '=', subcategoryId)
        .join('CATEGORY', 'CATEGORY.CategoryID', '=', 'SUBCATEGORY.CategoryID')
        .join(
            'ARTICLE_SUBCATEGORY',
            'ARTICLE_SUBCATEGORY.SubCategoryID',
            '=',
            'SUBCATEGORY.SubcategoryID'
        )
        .join(
            'ARTICLE',
            'ARTICLE.ArticleID',
            '=',
            'ARTICLE_SUBCATEGORY.ArticleID'
        )
        .join('ARTICLE_URL', 'ARTICLE_URL.ArticleID', 'ARTICLE.ArticleID')
        .orderBy('ARTICLE.DatePosted', 'DESC')
        .select(
            'ARTICLE.ArticleID as ArticleID',
            'ARTICLE.Title as Title',
            'ARTICLE.Abstract as Abstract',
            'ARTICLE.DatePosted as DatePosted',
            'ARTICLE_URL.URL as URL',
            'SUBCATEGORY.Name as subcategory',
            'SUBCATEGORY.SubcategoryID as subcategoryId',
            'CATEGORY.Name as category'
        )
        .limit(limit)
        .offset(offset);

    const formattedResponse = await Promise.all(
        response.map(async item => {
            const date = new Date(item.DatePosted);
            const formattedDate = date
                .toISOString()
                .slice(0, 19)
                .replace('T', ' ');
            const tags = await db('ARTICLE_TAG')
                .where('ARTICLE_TAG.ArticleID', '=', item.ArticleID)
                .join('TAG', 'TAG.TagID', '=', 'ARTICLE_TAG.TagID')
                .select('TAG.Name as name');

            return {
                ...item,
                DatePosted: formattedDate,
                tags: tags.map(tag => ({
                    name_encode: encodeURIComponent(tag.name),
                    name: tag.name,
                })),
            };
        })
    );

    return formattedResponse;
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
            'SUBCATEGORY.SubCategoryID'
        )
        .limit(limit)
        .offset(offset);

    for (let i = 0; i < response.length; i++)
        response[i].tags = await GetTagsOfArticle(response[i].ArticleID);
    return response as Array<ArticleListItem>;
};

export const countArticlesByTagID = async (
    tagIDs: string[]
): Promise<number> => {
    let total = await DBConfig('ARTICLE_TAG')
        .whereIn('ARTICLE_TAG.TagID', tagIDs)
        .count('* as total')
        .groupBy('ARTICLE_TAG.TagID')
        .first();

    return total ? (total as { total: number }).total : 0;
};

export const CountSearchResult = async (
    searchValue: string
): Promise<number> => {
    let count = await DBConfig('ARTICLE')
        .whereRaw(
            'MATCH(Title, Content, Abstract) AGAINST(? IN NATURAL LANGUAGE MODE)',
            [searchValue]
        )
        .count('* as count')
        .first();
    return count ? (count.count as number) : 0;
};

export const SearchArticle = async (
    searchValue: string,
    offset: number,
    limit: number
) => {
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
        )
        .offset(offset)
        .limit(limit);
    for (let i = 0; i < result.length; i++)
        result[i].tags = await GetTagsOfArticle(result[i].ArticleID);
    return result as Array<ArticleListItem>;
};

export const GetArticleById = async (articleId: string) => {
    return DBConfig('ARTICLE').where({ ArticleID: articleId }).first();
};

export interface Tag {
    id: string;
    name: string;
    name_encode: string;
}

export const GetTagsOfArticle = async (
    articleId: string | number
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
        .update({ ViewCount: currentCnt.ViewCount + 1 });
};

export const CountArticleOfWriterByStates = async (
    writerId: number,
    states: string[]
) => {
    let count = await DBConfig('ARTICLE')
        .where({ WriterID: writerId })
        .whereIn('Status', states)
        .count('* as count')
        .first();
    return count ? (count.count as number) : 0;
};

export const GetArticleOfWriterByStates = async (
    writerId: number,
    states: string[],
    offset: number,
    limit: number
) => {
    return DBConfig('ARTICLE')
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
        .where({ STT: 0 })
        .where({ WriterID: writerId })
        .whereIn('Status', states)
        .select(
            'Title as title',
            'Abstract as abstract',
            'DatePublished as datePublished',
            'DatePosted as datePosted',
            'CATEGORY.Name as category',
            'SUBCATEGORY.Name as subcategory',
            'URL as cover',
            'Status as state',
            'ARTICLE.ArticleID as id'
        )
        .orderBy('DatePosted', 'desc')
        .offset(offset)
        .limit(limit);
};

export interface ArticleListItem {
    ArticleID: number;
    Title: string;
    DatePosted: Date;
    Abstract: string;
    IsPremium: boolean;
    ViewCount: number;
    category: string;
    subcategory: string;
    categoryId: number;
    subcategoryId: number;
    URL: string;
    tags?: Array<Tag>;
}

export const GetRelativeArticle = async (
    categoryId: string | number,
    articleId: string | number,
    limit: number = 5
): Promise<Array<ArticleListItem>> => {
    let result = await DBConfig('ARTICLE')
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
    for (let i = 0; i < result.length; i++)
        result[i].tags = await GetTagsOfArticle(result[i].ArticleID);
    return result as Array<ArticleListItem>;
};

export const GetBackgroundImageOfArticle = async (
    articleId: string
): Promise<string> => {
    let bgURL = await DBConfig('ARTICLE_URL')
        .where({ STT: 0, ArticleID: articleId })
        .first();
    return bgURL && bgURL.URL ? bgURL.URL : 'null';
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

export interface CategoryFullname {
    fullname: string;
    id: number;
}

export interface Category {
    categoryName: string;
    subcategoryName: string;
    categoryId: number;
    subcategoryId: number;
}

export const GetCategoryFullNameOfArticle = async (articleId: string) => {
    let result = await DBConfig('ARTICLE_SUBCATEGORY')
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
    return result ? (result as CategoryFullname) : { fullname: '', id: 0 };
};

export const GetCategoryOfArticle = async (articleId: string) => {
    let category = await DBConfig('ARTICLE_SUBCATEGORY')
        .join(
            'SUBCATEGORY',
            'ARTICLE_SUBCATEGORY.SubCategoryID',
            '=',
            'SUBCATEGORY.SubCategoryID'
        )
        .join('CATEGORY', 'CATEGORY.CategoryID', '=', 'SUBCATEGORY.CategoryID')
        .where({ ArticleID: articleId })
        .select(
            'CATEGORY.Name as categoryName',
            'SUBCATEGORY.Name as subcategoryName',
            'CATEGORY.CategoryID as categoryId',
            'SUBCATEGORY.SubCategoryID as subcategoryId'
        )
        .first();
    return category
        ? (category as Category)
        : {
              categoryName: '',
              subcategoryName: '',
              categoryId: 0,
              subcategoryId: 0,
          };
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
    for (let i = 0; i < comment.length; i++) {
        if (comment[i].SubscriberID)
            comment[i].Name = await getUsernameById(
                comment[i].SubscriberID as number
            );
    }
    return comment ? comment : [];
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
            SubscriberID: userId,
        });
    }
};

// HOME

export const getMostViewedArticles = async (
    isUserPremium: boolean = false,
    limit: number = 10
): Promise<
    {
        articleID: string;
        title: string;
        img: string;
        date: string;
        category: string;
        categoryID: string;
    }[]
> => {
    let response = [];

    if (isUserPremium) {
        response = await db('ARTICLE')
            .join(
                'ARTICLE_URL',
                'ARTICLE_URL.ArticleID',
                '=',
                'ARTICLE.ArticleID'
            )
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
            .orderBy('ARTICLE.IsPremium', 'desc')
            .orderBy('ARTICLE.ViewCount', 'desc')
            .limit(limit)
            .select(
                'ARTICLE.ArticleID as articleID',
                'ARTICLE.Title as title',
                'ARTICLE.IsPremium as isPremium',
                'ARTICLE_URL.URL as img',
                DBConfig.raw(
                    "DATE_FORMAT(ARTICLE.DatePosted, '%d/%m/%Y') as date"
                ),
                'SUBCATEGORY.Name as category',
                'SUBCATEGORY.SubCategoryID as categoryID'
            );
    } else {
        response = await db('ARTICLE')
            .join(
                'ARTICLE_URL',
                'ARTICLE_URL.ArticleID',
                '=',
                'ARTICLE.ArticleID'
            )
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
            .orderBy('ARTICLE.ViewCount', 'desc')
            .limit(limit)
            .select(
                'ARTICLE.ArticleID as articleID',
                'ARTICLE.Title as title',
                'ARTICLE.IsPremium as isPremium',
                'ARTICLE_URL.URL as img',
                DBConfig.raw(
                    "DATE_FORMAT(ARTICLE.DatePosted, '%d/%m/%Y') as date"
                ),
                'SUBCATEGORY.Name as category',
                'SUBCATEGORY.SubCategoryID as categoryID'
            );
    }

    return response;
};

export const getLatestArticles = async (
    isUserPremium: boolean = false,
    limit: number = 10
): Promise<
    {
        articleID: string;
        img: string;
        category: string;
        categoryID: string;
        date: string;
        author: string;
        viewCount: number;
        commentCount: number;
        title: string;
        abstract: string;
    }[]
> => {
    let response = [];

    if (isUserPremium) {
        response = await db('ARTICLE')
            .join(
                'ARTICLE_URL',
                'ARTICLE_URL.ArticleID',
                '=',
                'ARTICLE.ArticleID'
            )
            .join('WRITER', 'WRITER.WriterID', '=', 'ARTICLE.WriterID')
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
            .orderBy('ARTICLE.IsPremium', 'desc')
            .orderBy('ARTICLE.DatePosted', 'desc')
            .limit(limit)
            .select(
                'ARTICLE.ArticleID as articleID',
                'ARTICLE.Title as title',
                'ARTICLE.Abstract as abstract',
                'ARTICLE.ViewCount as viewCount',
                'ARTICLE.IsPremium as isPremium',
                'ARTICLE_URL.URL as img',
                DBConfig.raw(
                    "DATE_FORMAT(ARTICLE.DatePosted, '%d/%m/%Y') as date"
                ),
                'SUBCATEGORY.Name as category',
                'SUBCATEGORY.SubCategoryID as categoryID',
                'WRITER.Alias as author'
            );
    } else {
        response = await db('ARTICLE')
            .join(
                'ARTICLE_URL',
                'ARTICLE_URL.ArticleID',
                '=',
                'ARTICLE.ArticleID'
            )
            .join('WRITER', 'WRITER.WriterID', '=', 'ARTICLE.WriterID')
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
            .orderBy('ARTICLE.DatePosted', 'desc')
            .limit(limit)
            .select(
                'ARTICLE.ArticleID as articleID',
                'ARTICLE.Title as title',
                'ARTICLE.Abstract as abstract',
                'ARTICLE.ViewCount as viewCount',
                'ARTICLE.IsPremium as isPremium',
                'ARTICLE_URL.URL as img',
                DBConfig.raw(
                    "DATE_FORMAT(ARTICLE.DatePosted, '%d/%m/%Y') as date"
                ),
                'SUBCATEGORY.Name as category',
                'SUBCATEGORY.SubCategoryID as categoryID',
                'WRITER.Alias as author'
            );
    }

    const result = await Promise.all(
        response.map(async item => {
            const comments = await db('COMMENT')
                .where('COMMENT.ArticleID', '=', item.articleID)
                .count('* as count')
                .first();

            return {
                ...item,
                commentCount: comments ? comments.count : 0,
            };
        })
    );

    return result;
};

export const getTopArticles = async (
    isUserPremium: boolean = false,
    limit: number = 7
): Promise<
    {
        articleID: string;
        img: string;
        category: string;
        categoryID: string;
        date: string;
        title: string;
    }[]
> => {
    const startWeek = new Date();
    startWeek.setDate(
        startWeek.getDate() -
            startWeek.getDay() +
            (startWeek.getDay() === 0 ? -6 : 1)
    );
    startWeek.setHours(0, 0, 0, 0);
    const endWeek = new Date(startWeek);
    endWeek.setDate(startWeek.getDate() + 6);
    endWeek.setHours(23, 59, 59, 999);

    let response = [];

    if (isUserPremium) {
        response = await db('ARTICLE')
            .whereBetween('ARTICLE.DatePosted', [startWeek, endWeek])
            .join(
                'ARTICLE_URL',
                'ARTICLE_URL.ArticleID',
                '=',
                'ARTICLE.ArticleID'
            )
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
            .orderBy('ARTICLE.IsPremium', 'desc')
            .orderBy('ARTICLE.ViewCount', 'desc')
            .limit(limit)
            .select(
                'ARTICLE.ArticleID as articleID',
                'ARTICLE_URL.URL as img',
                'SUBCATEGORY.Name as category',
                'SUBCATEGORY.SubCategoryID as categoryID',
                DBConfig.raw(
                    "DATE_FORMAT(ARTICLE.DatePosted, '%d/%m/%Y') as date"
                ),
                'ARTICLE.Title as title',
                'ARTICLE.IsPremium as isPremium'
            );
    } else {
        response = await db('ARTICLE')
            .whereBetween('ARTICLE.DatePosted', [startWeek, endWeek])
            .join(
                'ARTICLE_URL',
                'ARTICLE_URL.ArticleID',
                '=',
                'ARTICLE.ArticleID'
            )
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
            .orderBy('ARTICLE.ViewCount', 'desc')
            .limit(limit)
            .select(
                'ARTICLE.ArticleID as articleID',
                'ARTICLE_URL.URL as img',
                'SUBCATEGORY.Name as category',
                'SUBCATEGORY.SubCategoryID as categoryID',
                DBConfig.raw(
                    "DATE_FORMAT(ARTICLE.DatePosted, '%d/%m/%Y') as date"
                ),
                'ARTICLE.Title as title',
                'ARTICLE.IsPremium as isPremium'
            );
    }

    return response;
};

export const getCategoryArticles = async (
    isUserPremium: boolean = false,
    limit: number = 10
): Promise<
    {
        articleID: string;
        title: string;
        img: string;
        date: string;
        category: string;
        categoryID: string;
    }[]
> => {
    // Get top 10 Ids which have most views
    let mostViewedCatIDs = [];

    if (isUserPremium) {
        mostViewedCatIDs = await db('CATEGORY')
            .join(
                'SUBCATEGORY',
                'SUBCATEGORY.CategoryID',
                'CATEGORY.CategoryID'
            )
            .join(
                'ARTICLE_SUBCATEGORY',
                'ARTICLE_SUBCATEGORY.SubCategoryID',
                'SUBCATEGORY.SubCategoryID'
            )
            .join(
                'ARTICLE',
                'ARTICLE.ArticleID',
                '=',
                'ARTICLE_SUBCATEGORY.ArticleID'
            )
            .orderBy('ARTICLE.IsPremium', 'desc')
            .orderBy('ARTICLE.ViewCount', 'desc')
            .limit(limit)
            .select('CATEGORY.CategoryID as CatID');
    } else {
        mostViewedCatIDs = await db('CATEGORY')
            .join(
                'SUBCATEGORY',
                'SUBCATEGORY.CategoryID',
                'CATEGORY.CategoryID'
            )
            .join(
                'ARTICLE_SUBCATEGORY',
                'ARTICLE_SUBCATEGORY.SubCategoryID',
                'SUBCATEGORY.SubCategoryID'
            )
            .join(
                'ARTICLE',
                'ARTICLE.ArticleID',
                '=',
                'ARTICLE_SUBCATEGORY.ArticleID'
            )
            .orderBy('ARTICLE.ViewCount', 'desc')
            .limit(limit)
            .select('CATEGORY.CategoryID as CatID');
    }

    const CatIDs = [...new Set(mostViewedCatIDs.map(item => item.CatID))];

    // Each subcategory, pick the latest one
    const response = await Promise.all(
        CatIDs.map(async catID => {
            return await db('CATEGORY')
                .where('CATEGORY.CategoryID', '=', catID)
                .join(
                    'SUBCATEGORY',
                    'SUBCATEGORY.CategoryID',
                    'CATEGORY.CategoryID'
                )
                .join(
                    'ARTICLE_SUBCATEGORY',
                    'ARTICLE_SUBCATEGORY.SubCategoryID',
                    'SUBCATEGORY.SubCategoryID'
                )
                .join(
                    'ARTICLE',
                    'ARTICLE.ArticleID',
                    '=',
                    'ARTICLE_SUBCATEGORY.ArticleID'
                )
                .join(
                    'ARTICLE_URL',
                    'ARTICLE_URL.ArticleID',
                    '=',
                    'ARTICLE.ArticleID'
                )
                .orderBy('ARTICLE.DatePosted', 'desc')
                .limit(1)
                .first()
                .select(
                    'ARTICLE.ArticleID as articleID',
                    'ARTICLE.Title as title',
                    'ARTICLE_URL.URL as img',
                    'ARTICLE.IsPremium as isPremium',
                    DBConfig.raw(
                        "DATE_FORMAT(ARTICLE.DatePosted, '%d/%m/%Y') as date"
                    ),
                    'SUBCATEGORY.Name as category',
                    'SUBCATEGORY.SubCategoryID as categoryID'
                );
        })
    );

    return response;
};

export const countArticlesCategories = async (
    categories: number
): Promise<number> => {
    const query = db('ARTICLE as a')
        .join('ARTICLE_SUBCATEGORY as as', 'a.ArticleID', 'as.ArticleID')
        .join('SUBCATEGORY as s', 'as.SubcategoryID', 's.SubcategoryID')
        .join('CATEGORY as c', 's.CategoryID', 'c.CategoryID')
        .join('WRITER as w', 'a.WriterID', 'w.WriterID')
        .select(
            'a.ArticleID as id',
            'a.Title as title',
            DBConfig.raw("DATE_FORMAT(a.DatePosted, '%d/%m/%Y') as date"),
            's.Name as subcategory',
            'c.Name as category'
        );
    if (categories === -1) {
        let count = await query.count('* as count').first();
        return (count?.count as number) || 0;
    }
    let count = await query
        .where('c.CategoryID', categories)
        .count('* as count')
        .first();
    return (count?.count as number) || 0;
};

export const getArticlesCategories = (
    categories: number,
    offset: number = 0,
    limit: number = 0
): Promise<any[]> => {
    const query = db('ARTICLE as a')
        .join('ARTICLE_SUBCATEGORY as as', 'a.ArticleID', 'as.ArticleID')
        .join('SUBCATEGORY as s', 'as.SubcategoryID', 's.SubcategoryID')
        .join('CATEGORY as c', 's.CategoryID', 'c.CategoryID')
        .select(
            'a.ArticleID as id',
            'a.Title as title',
            DBConfig.raw("DATE_FORMAT(a.DatePosted, '%d/%m/%Y') as date"),
            's.Name as subcategory',
            'c.Name as category',
            'a.WriterID as writerID',
            'a.Status as status'
        );
    if (categories === -1) {
        return query.offset(offset).limit(limit);
    }
    return query.where('c.CategoryID', categories).offset(offset).limit(limit);
};
