import { DBConfig, DBConfig as db } from '../Utils/DBConfig';
import { writer } from 'repl';
import { getUsernameById, getWriterNameById } from './UserPasswordService';

export const deleteArticle = async (articleID: number): Promise<void> => {
    try {
        // Kiểm tra xem bài viết có tồn tại không
        const articleExists = await db('article')
            .where('ArticleID', articleID)
            .first();
        if (!articleExists) {
            // Trả về lỗi 404 nếu bài viết không tồn tại
            console.log(`Article with ID ${articleID} does not exist.`);
            return; // Thoát khỏi hàm mà không ném lỗi
        }

        // Xóa bài viết khỏi database
        await db('article').where('ArticleID', articleID).delete();
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
    const response = await db('category')
        .where('category.CategoryID', '=', categoryId)
        .join(
            'subcategory',
            'subcategory.CategoryID',
            '=',
            'category.CategoryID'
        )
        .select(
            'category.Name as categoryName',
            'subcategory.Name as subcategoryName',
            'subcategory.SubCategoryID as subcategoryId'
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
    offset: number,
    isPremium: boolean
): Promise<any[]> => {
    let response = [];
    if (isPremium) {
        response = await db('category')
            .where('category.CategoryID', '=', categoryId)
            .join(
                'subcategory',
                'subcategory.CategoryID',
                '=',
                'category.CategoryID'
            )
            .join(
                'article_subcategory',
                'article_subcategory.SubCategoryID',
                '=',
                'subcategory.SubCategoryID'
            )
            .join(
                'article',
                'article.ArticleID',
                '=',
                'article_subcategory.ArticleID'
            )
            .join(
                'article_url',
                'article_url.ArticleID',
                '=',
                'article.ArticleID'
            )
            .orderBy('article.IsPremium', 'desc')
            .orderBy('article.DatePosted', 'DESC')
            .select(
                'article.ArticleID as ArticleID',
                'article.Title as Title',
                'article.Abstract as Abstract',
                'article.DatePosted as DatePosted',
                'article_url.url as URL',
                'subcategory.Name as subcategory',
                'subcategory.SubcategoryID as subcategoryId',
                'category.Name as category'
            )
            .limit(limit)
            .offset(offset);
    } else {
        response = await db('category')
            .where('category.CategoryID', '=', categoryId)
            .join(
                'subcategory',
                'subcategory.CategoryID',
                '=',
                'category.CategoryID'
            )
            .join(
                'article_subcategory',
                'article_subcategory.SubCategoryID',
                '=',
                'subcategory.SubCategoryID'
            )
            .join(
                'article',
                'article.ArticleID',
                '=',
                'article_subcategory.ArticleID'
            )
            .join(
                'article_url',
                'article_url.ArticleID',
                '=',
                'article.ArticleID'
            )
            .orderBy('article.DatePosted', 'DESC')
            .select(
                'article.ArticleID as ArticleID',
                'article.Title as Title',
                'article.Abstract as Abstract',
                'article.DatePosted as DatePosted',
                'article_url.url as URL',
                'subcategory.Name as subcategory',
                'subcategory.SubcategoryID as subcategoryId',
                'category.Name as category'
            )
            .limit(limit)
            .offset(offset);
    }

    const formattedResponse = await Promise.all(
        response.map(async item => {
            const date = new Date(item.DatePosted);
            const formattedDate = date
                .toISOString()
                .slice(0, 19)
                .replace('T', ' ');
            const tags = await db('article_tag')
                .where('article_tag.ArticleID', '=', item.ArticleID)
                .join('tag', 'tag.TagID', '=', 'article_tag.TagID')
                .select('tag.Name as name');

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
    let total = await db('category')
        .where('category.CategoryID', '=', categoryId)
        .join(
            'subcategory',
            'subcategory.CategoryID',
            '=',
            'category.CategoryID'
        )
        .join(
            'article_subcategory',
            'article_subcategory.SubCategoryID',
            '=',
            'subcategory.SubCategoryID'
        )
        .join(
            'article',
            'article.ArticleID',
            '=',
            'article_subcategory.ArticleID'
        )
        .groupBy('category.CategoryID')
        .count('* as total')
        .first();

    return total ? (total.total as number) : 0;
};

export const countArticlesBySubCatID = async (
    subcategoryId: string
): Promise<number> => {
    let total = await db('article_subcategory')
        .where('article_subcategory.SubCategoryID', '=', subcategoryId)
        .join(
            'article',
            'article.ArticleID',
            '=',
            'article_subcategory.ArticleID'
        )
        .groupBy('article_subcategory.SubCategoryID')
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
    let { categoryID, categoryName } = await db('subcategory')
        .where('subcategory.SubCategoryID', '=', subcategoryId)
        .join('category', 'category.CategoryID', '=', 'subcategory.CategoryID')
        .select(
            'category.CategoryID as categoryID',
            'category.Name as categoryName'
        )
        .first();

    const response = await db('subcategory')
        .where('subcategory.CategoryID', '=', categoryID)
        .select(
            'subcategory.Name as name',
            'subcategory.SubCategoryID as subID'
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
    offset: number,
    isPremium: boolean
): Promise<any[]> => {
    let response = [];
    if (isPremium) {
        response = await db('subcategory')
            .where('subcategory.SubCategoryID', '=', subcategoryId)
            .join(
                'category',
                'category.CategoryID',
                '=',
                'subcategory.CategoryID'
            )
            .join(
                'article_subcategory',
                'article_subcategory.SubCategoryID',
                '=',
                'subcategory.SubcategoryID'
            )
            .join(
                'article',
                'article.ArticleID',
                '=',
                'article_subcategory.ArticleID'
            )
            .join('article_url', 'article_url.ArticleID', 'article.ArticleID')
            .orderBy('article.IsPremium', 'desc')
            .orderBy('article.DatePosted', 'DESC')
            .select(
                'article.ArticleID as ArticleID',
                'article.Title as Title',
                'article.Abstract as Abstract',
                'article.DatePosted as DatePosted',
                'article_url.url as URL',
                'subcategory.Name as subcategory',
                'subcategory.SubcategoryID as subcategoryId',
                'category.Name as category'
            )
            .limit(limit)
            .offset(offset);
    } else {
        response = await db('subcategory')
            .where('subcategory.SubCategoryID', '=', subcategoryId)
            .join(
                'category',
                'category.CategoryID',
                '=',
                'subcategory.CategoryID'
            )
            .join(
                'article_subcategory',
                'article_subcategory.SubCategoryID',
                '=',
                'subcategory.SubcategoryID'
            )
            .join(
                'article',
                'article.ArticleID',
                '=',
                'article_subcategory.ArticleID'
            )
            .join('article_url', 'article_url.ArticleID', 'article.ArticleID')
            .orderBy('article.DatePosted', 'DESC')
            .select(
                'article.ArticleID as ArticleID',
                'article.Title as Title',
                'article.Abstract as Abstract',
                'article.DatePosted as DatePosted',
                'article_url.url as URL',
                'subcategory.Name as subcategory',
                'subcategory.SubcategoryID as subcategoryId',
                'category.Name as category'
            )
            .limit(limit)
            .offset(offset);
    }

    const formattedResponse = await Promise.all(
        response.map(async item => {
            const date = new Date(item.DatePosted);
            const formattedDate = date
                .toISOString()
                .slice(0, 19)
                .replace('T', ' ');
            const tags = await db('article_tag')
                .where('article_tag.ArticleID', '=', item.ArticleID)
                .join('tag', 'tag.TagID', '=', 'article_tag.TagID')
                .select('tag.Name as name');

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
    const response = await DBConfig('article_tag')
        .join('tag', 'tag.TagID', '=', 'article_tag.TagID')
        .join('article', 'article.ArticleID', '=', 'article_tag.ArticleID')
        .join('article_url', 'article_url.ArticleID', '=', 'article.ArticleID')
        .join(
            'article_subcategory',
            'article_subcategory.ArticleID',
            '=',
            'article.ArticleID'
        )
        .join(
            'subcategory',
            'subcategory.SubCategoryID',
            '=',
            'article_subcategory.SubCategoryID'
        )
        .join('category', 'category.CategoryID', '=', 'subcategory.CategoryID')
        .whereIn('article_tag.TagID', tagIDs)
        .select(
            'article.ArticleID',
            'Title',
            'DatePosted',
            'Abstract',
            'IsPremium',
            'ViewCount',
            'category.Name as category',
            'subcategory.Name as subcategory',
            'category.CategoryID as categoryId',
            'subcategory.SubCategoryID as subcategoryId',
            'url as URL'
        )
        .groupBy(
            'article.ArticleID',
            'article.Title',
            'article.Abstract',
            'IsPremium',
            'ViewCount',
            'article.DatePosted',
            'article_url.URL',
            'category.Name',
            'subcategory.Name',
            'category.CategoryID',
            'subcategory.SubCategoryID'
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
    let total = await DBConfig('article_tag')
        .whereIn('article_tag.TagID', tagIDs)
        .count('* as total')
        .groupBy('article_tag.TagID')
        .first();

    return total ? (total as { total: number }).total : 0;
};

export const CountSearchResult = async (
    searchValue: string
): Promise<number> => {
    let count = await DBConfig('article')
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
    limit: number,
    isPremium: boolean
) => {
    let result = [];
    console.log(isPremium);
    if (isPremium) {
        result = await DBConfig('article')
            .whereRaw(
                'MATCH(Title, Content, Abstract) AGAINST(? IN NATURAL LANGUAGE MODE)',
                [searchValue]
            )
            .join(
                'article_subcategory',
                'article_subcategory.ArticleID',
                '=',
                'article.ArticleID'
            )
            .join(
                'subcategory',
                'article_subcategory.SubCategoryID',
                '=',
                'subcategory.SubCategoryID'
            )
            .join(
                'category',
                'category.CategoryID',
                '=',
                'subcategory.CategoryID'
            )
            .join(
                'article_url',
                'article_url.ArticleID',
                '=',
                'article.ArticleID'
            )
            .where('STT', '=', '0')
            .orderBy('article.IsPremium', 'desc')
            .orderBy('DatePosted', 'desc')
            .select(
                'article.ArticleID',
                'Title',
                'DatePosted',
                'Abstract',
                'IsPremium',
                'ViewCount',
                'category.Name as category',
                'subcategory.Name as subcategory',
                'category.CategoryID as categoryId',
                'subcategory.SubCategoryID as subcategoryId',
                'url'
            )
            .offset(offset)
            .limit(limit);
    } else {
        result = await DBConfig('article')
            .whereRaw(
                'MATCH(Title, Content, Abstract) AGAINST(? IN NATURAL LANGUAGE MODE)',
                [searchValue]
            )
            .join(
                'article_subcategory',
                'article_subcategory.ArticleID',
                '=',
                'article.ArticleID'
            )
            .join(
                'subcategory',
                'article_subcategory.SubCategoryID',
                '=',
                'subcategory.SubCategoryID'
            )
            .join(
                'category',
                'category.CategoryID',
                '=',
                'subcategory.CategoryID'
            )
            .join(
                'article_url',
                'article_url.ArticleID',
                '=',
                'article.ArticleID'
            )
            .where('STT', '=', '0')
            .orderBy('DatePosted', 'desc')
            .select(
                'article.ArticleID',
                'Title',
                'DatePosted',
                'Abstract',
                'IsPremium',
                'ViewCount',
                'category.Name as category',
                'subcategory.Name as subcategory',
                'category.CategoryID as categoryId',
                'subcategory.SubCategoryID as subcategoryId',
                'url as URL'
            )
            .offset(offset)
            .limit(limit);
    }
    for (let i = 0; i < result.length; i++)
        result[i].tags = await GetTagsOfArticle(result[i].ArticleID);
    return result as Array<ArticleListItem>;
};

export const GetArticleById = async (articleId: string) => {
    return DBConfig('article').where({ ArticleID: articleId }).first();
};

export interface Tag {
    id: string;
    name: string;
    name_encode: string;
}

export const GetTagsOfArticle = async (
    articleId: string | number
): Promise<Array<Tag>> => {
    let tags = await DBConfig('tag')
        .join('article_tag', 'article_tag.TagID', '=', 'tag.TagID')
        .where({ ArticleID: articleId })
        .select('Name as name', 'tag.TagID as id');
    if (tags)
        for (let i = 0; i < tags.length; i++)
            tags[i].name_encode = encodeURIComponent(tags[i].name);
    return tags ? tags : [];
};

export const AddViewCount = async (articleId: string) => {
    let currentCnt = await DBConfig('article')
        .where({ ArticleId: articleId })
        .select('ViewCount')
        .first();
    if (!currentCnt) return;
    await DBConfig('article')
        .where({ ArticleId: articleId })
        .update({ ViewCount: currentCnt.ViewCount + 1 });
};

export const CountArticleOfWriterByStates = async (
    writerId: number,
    states: string[]
) => {
    let count = await DBConfig('article')
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
    return DBConfig('article')
        .join(
            'article_subcategory',
            'article_subcategory.ArticleID',
            '=',
            'article.ArticleID'
        )
        .join(
            'subcategory',
            'article_subcategory.SubCategoryID',
            '=',
            'subcategory.SubCategoryID'
        )
        .join('category', 'category.CategoryID', '=', 'subcategory.CategoryID')
        .join('article_url', 'article_url.ArticleID', '=', 'article.ArticleID')
        .where({ STT: 0 })
        .where({ WriterID: writerId })
        .whereIn('Status', states)
        .select(
            'Title as title',
            'Abstract as abstract',
            'DatePublished as datePublished',
            'DatePosted as datePosted',
            'category.Name as category',
            'subcategory.Name as subcategory',
            'url as cover',
            'Status as state',
            'article.ArticleID as id',
            'Reason as reason'
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
    url: string;
    tags?: Array<Tag>;
}

export const GetRelativeArticle = async (
    categoryId: string | number,
    articleId: string | number,
    limit: number = 5
): Promise<Array<ArticleListItem>> => {
    let result = await DBConfig('article')
        .join(
            'article_subcategory',
            'article_subcategory.ArticleID',
            '=',
            'article.ArticleID'
        )
        .where('article.ArticleID', '!=', articleId)
        .where('category.CategoryID', '=', categoryId)
        .join(
            'subcategory',
            'article_subcategory.SubCategoryID',
            '=',
            'subcategory.SubCategoryID'
        )
        .join('category', 'category.CategoryID', '=', 'subcategory.CategoryID')
        .join('article_url', 'article_url.ArticleID', '=', 'article.ArticleID')
        .where('STT', '=', '0')
        .orderByRaw('RAND()')
        .select(
            'article.ArticleID',
            'Title',
            'DatePosted',
            'Abstract',
            'IsPremium',
            'ViewCount',
            'category.Name as category',
            'subcategory.Name as subcategory',
            'category.CategoryID as categoryId',
            'subcategory.SubCategoryID as subcategoryId',
            'url as URL'
        )
        .limit(limit);
    for (let i = 0; i < result.length; i++)
        result[i].tags = await GetTagsOfArticle(result[i].ArticleID);
    return result as Array<ArticleListItem>;
};

export const GetBackgroundImageOfArticle = async (
    articleId: string
): Promise<string> => {
    let bgurl = await DBConfig('article_url')
        .where({ STT: 0, ArticleID: articleId })
        .first();
    return bgurl && bgurl.URL ? bgurl.URL : 'null';
};

export const UpdateBackgroundImageOfArticle = async (
    articleId: string,
    value: string = 'null'
) => {
    return DBConfig('article_url')
        .where({ ArticleID: articleId, STT: 0 })
        .update({ url: value });
};

export const AddBackgroundImageOfArticle = async (
    articleId: number,
    value: string = 'null'
) => {
    return DBConfig('article_url').insert({
        ArticleID: articleId,
        STT: 0,
        url: value,
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
    let result = await DBConfig('article_subcategory')
        .join(
            'subcategory',
            'article_subcategory.SubCategoryID',
            '=',
            'subcategory.SubCategoryID'
        )
        .join('category', 'category.CategoryID', '=', 'subcategory.CategoryID')
        .where({ ArticleID: articleId })
        .select(
            'article_subcategory.SubCategoryID as id',
            DBConfig.raw(
                "CONCAT(category.Name, ' / ', subcategory.Name) as fullname"
            )
        )
        .first();
    return result ? (result as CategoryFullname) : { fullname: '', id: 0 };
};

export const GetCategoryOfArticle = async (articleId: string) => {
    let category = await DBConfig('article_subcategory')
        .join(
            'subcategory',
            'article_subcategory.SubCategoryID',
            '=',
            'subcategory.SubCategoryID'
        )
        .join('category', 'category.CategoryID', '=', 'subcategory.CategoryID')
        .where({ ArticleID: articleId })
        .select(
            'category.Name as categoryName',
            'subcategory.Name as subcategoryName',
            'category.CategoryID as categoryId',
            'subcategory.SubCategoryID as subcategoryId'
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
    let comment = await DBConfig('comment')
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
        await DBConfig('comment').insert({
            ArticleId: articleId,
            Content: content,
            DatePosted: date,
        });
    } else {
        await DBConfig('comment').insert({
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
        response = await db('article')
            .join(
                'article_url',
                'article_url.ArticleID',
                '=',
                'article.ArticleID'
            )
            .join(
                'article_subcategory',
                'article_subcategory.ArticleID',
                '=',
                'article.ArticleID'
            )
            .join(
                'subcategory',
                'subcategory.SubCategoryID',
                '=',
                'article_subcategory.SubCategoryID'
            )
            .orderBy('article.IsPremium', 'desc')
            .orderBy('article.ViewCount', 'desc')
            .limit(limit)
            .select(
                'article.ArticleID as articleID',
                'article.Title as title',
                'article.IsPremium as isPremium',
                'article_url.url as img',
                DBConfig.raw(
                    "DATE_FORMAT(article.DatePosted, '%d/%m/%Y') as date"
                ),
                'subcategory.Name as category',
                'subcategory.SubCategoryID as categoryID'
            );
    } else {
        response = await db('article')
            .join(
                'article_url',
                'article_url.ArticleID',
                '=',
                'article.ArticleID'
            )
            .join(
                'article_subcategory',
                'article_subcategory.ArticleID',
                '=',
                'article.ArticleID'
            )
            .join(
                'subcategory',
                'subcategory.SubCategoryID',
                '=',
                'article_subcategory.SubCategoryID'
            )
            .orderBy('article.ViewCount', 'desc')
            .limit(limit)
            .select(
                'article.ArticleID as articleID',
                'article.Title as title',
                'article.IsPremium as isPremium',
                'article_url.url as img',
                DBConfig.raw(
                    "DATE_FORMAT(article.DatePosted, '%d/%m/%Y') as date"
                ),
                'subcategory.Name as category',
                'subcategory.SubCategoryID as categoryID'
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
        response = await db('article')
            .join(
                'article_url',
                'article_url.ArticleID',
                '=',
                'article.ArticleID'
            )
            .join(
                'article_subcategory',
                'article_subcategory.ArticleID',
                '=',
                'article.ArticleID'
            )
            .join(
                'subcategory',
                'subcategory.SubCategoryID',
                '=',
                'article_subcategory.SubCategoryID'
            )
            .orderBy('article.IsPremium', 'desc')
            .orderBy('article.DatePosted', 'desc')
            .limit(limit)
            .select(
                'article.ArticleID as articleID',
                'article.Title as title',
                'article.Abstract as abstract',
                'article.ViewCount as viewCount',
                'article.IsPremium as isPremium',
                'article_url.url as img',
                DBConfig.raw(
                    "DATE_FORMAT(article.DatePosted, '%d/%m/%Y') as date"
                ),
                'subcategory.Name as category',
                'subcategory.SubCategoryID as categoryID',
                'article.WriterID as writerID'
            );
    } else {
        response = await db('article')
            .join(
                'article_url',
                'article_url.ArticleID',
                '=',
                'article.ArticleID'
            )
            .join(
                'article_subcategory',
                'article_subcategory.ArticleID',
                '=',
                'article.ArticleID'
            )
            .join(
                'subcategory',
                'subcategory.SubCategoryID',
                '=',
                'article_subcategory.SubCategoryID'
            )
            .orderBy('article.DatePosted', 'desc')
            .limit(limit)
            .select(
                'article.ArticleID as articleID',
                'article.Title as title',
                'article.Abstract as abstract',
                'article.ViewCount as viewCount',
                'article.IsPremium as isPremium',
                'article_url.url as img',
                DBConfig.raw(
                    "DATE_FORMAT(article.DatePosted, '%d/%m/%Y') as date"
                ),
                'subcategory.Name as category',
                'subcategory.SubCategoryID as categoryID',
                'article.WriterID as writerID'
            );
    }

    const result = await Promise.all(
        response.map(async item => {
            const comments = await db('comment')
                .where('comment.ArticleID', '=', item.articleID)
                .count('* as count')
                .first();

            return {
                ...item,
                commentCount: comments ? comments.count : 0,
                author: await getWriterNameById(item.writerID),
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
        response = await db('article')
            .whereBetween('article.DatePosted', [startWeek, endWeek])
            .join(
                'article_url',
                'article_url.ArticleID',
                '=',
                'article.ArticleID'
            )
            .join(
                'article_subcategory',
                'article_subcategory.ArticleID',
                '=',
                'article.ArticleID'
            )
            .join(
                'subcategory',
                'subcategory.SubCategoryID',
                '=',
                'article_subcategory.SubCategoryID'
            )
            .orderBy('article.IsPremium', 'desc')
            .orderBy('article.ViewCount', 'desc')
            .limit(limit)
            .select(
                'article.ArticleID as articleID',
                'article_url.url as img',
                'subcategory.Name as category',
                'subcategory.SubCategoryID as categoryID',
                DBConfig.raw(
                    "DATE_FORMAT(article.DatePosted, '%d/%m/%Y') as date"
                ),
                'article.Title as title',
                'article.IsPremium as isPremium'
            );
    } else {
        response = await db('article')
            .whereBetween('article.DatePosted', [startWeek, endWeek])
            .join(
                'article_url',
                'article_url.ArticleID',
                '=',
                'article.ArticleID'
            )
            .join(
                'article_subcategory',
                'article_subcategory.ArticleID',
                '=',
                'article.ArticleID'
            )
            .join(
                'subcategory',
                'subcategory.SubCategoryID',
                '=',
                'article_subcategory.SubCategoryID'
            )
            .orderBy('article.ViewCount', 'desc')
            .limit(limit)
            .select(
                'article.ArticleID as articleID',
                'article_url.url as img',
                'subcategory.Name as category',
                'subcategory.SubCategoryID as categoryID',
                DBConfig.raw(
                    "DATE_FORMAT(article.DatePosted, '%d/%m/%Y') as date"
                ),
                'article.Title as title',
                'article.IsPremium as isPremium'
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
        mostViewedCatIDs = await db('category')
            .join(
                'subcategory',
                'subcategory.CategoryID',
                'category.CategoryID'
            )
            .join(
                'article_subcategory',
                'article_subcategory.SubCategoryID',
                'subcategory.SubCategoryID'
            )
            .join(
                'article',
                'article.ArticleID',
                '=',
                'article_subcategory.ArticleID'
            )
            .orderBy('article.IsPremium', 'desc')
            .orderBy('article.ViewCount', 'desc')
            .limit(limit)
            .select('category.CategoryID as CatID');
    } else {
        mostViewedCatIDs = await db('category')
            .join(
                'subcategory',
                'subcategory.CategoryID',
                'category.CategoryID'
            )
            .join(
                'article_subcategory',
                'article_subcategory.SubCategoryID',
                'subcategory.SubCategoryID'
            )
            .join(
                'article',
                'article.ArticleID',
                '=',
                'article_subcategory.ArticleID'
            )
            .orderBy('article.ViewCount', 'desc')
            .limit(limit)
            .select('category.CategoryID as CatID');
    }

    const CatIDs = [...new Set(mostViewedCatIDs.map(item => item.CatID))];

    // Each subcategory, pick the latest one
    const response = await Promise.all(
        CatIDs.map(async catID => {
            return await db('category')
                .where('category.CategoryID', '=', catID)
                .join(
                    'subcategory',
                    'subcategory.CategoryID',
                    'category.CategoryID'
                )
                .join(
                    'article_subcategory',
                    'article_subcategory.SubCategoryID',
                    'subcategory.SubCategoryID'
                )
                .join(
                    'article',
                    'article.ArticleID',
                    '=',
                    'article_subcategory.ArticleID'
                )
                .join(
                    'article_url',
                    'article_url.ArticleID',
                    '=',
                    'article.ArticleID'
                )
                .orderBy('article.DatePosted', 'desc')
                .limit(1)
                .first()
                .select(
                    'article.ArticleID as articleID',
                    'article.Title as title',
                    'article_url.url as img',
                    'article.IsPremium as isPremium',
                    DBConfig.raw(
                        "DATE_FORMAT(article.DatePosted, '%d/%m/%Y') as date"
                    ),
                    'subcategory.Name as category',
                    'subcategory.SubCategoryID as categoryID'
                );
        })
    );

    return response;
};

export const countArticlesCategories = async (
    categories: number
): Promise<number> => {
    const query = db('article as a')
        .join('article_subcategory as as', 'a.ArticleID', 'as.ArticleID')
        .join('subcategory as s', 'as.SubcategoryID', 's.SubcategoryID')
        .join('category as c', 's.CategoryID', 'c.CategoryID')
        .orderBy('a.DatePosted', 'desc');

    if (categories === -1) {
        let count = await query.count('* as countTotal').first();
        return (count?.countTotal as number) || 0;
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
    const query = db('article as a')
        .join('article_subcategory as as', 'a.ArticleID', 'as.ArticleID')
        .join('subcategory as s', 'as.SubcategoryID', 's.SubcategoryID')
        .join('category as c', 's.CategoryID', 'c.CategoryID')
        .orderBy('a.DatePosted', 'desc')
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
