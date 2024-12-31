import { Response, Request, NextFunction } from 'express';
import { DBConfig } from '../Utils/DBConfig';
import path from 'path';
import * as pdf from 'html-pdf';
import {
    AddComment,
    AddViewCount,
    GetArticleById,
    GetBackgroundImageOfArticle,
    GetCategoryOfArticle,
    GetCommentOfArticle,
    GetRelativeArticle,
    GetTagsOfArticle,
    SearchArticle,
    countArticlesByTagID,
    findPageByTagID,
    CountSearchResult,
    getFullCategoryNameByCatID,
    getArticlesByCategoryID,
    countArticlesByCatID,
    getSubcategoryInfoBySubCatID,
    getArticlesBySubCatID,
    countArticlesBySubCatID,
    getMostViewedArticles,
    getLatestArticles,
    getTopArticles,
    getCategoryArticles,
} from '../Services/AdminArticleService';
import { getWriterNameById } from '../Services/UserPasswordService';
import { clamp, getPagingNumber } from '../Utils/MathUtils';
import { UserRole } from '../Models/UserData';

const articlePerPage = 4;

export class ArticleController {
    verifyUser(req: Request, res: Response, Next: NextFunction) {
        if (
            req.session.authUser &&
            req.session.authUser.role !== UserRole.User
        ) {
            res.redirect('/404');
            return;
        }
        Next();
    }

    // Check if the user has premium account or not
    isPremium = async (req: Request) => {
        if (
            !req.session.authUser ||
            req.session.authUser.role !== UserRole.User
        )
            return false;
        let userData = await DBConfig('SUBSCRIBER')
            .where('SubscriberID', req.session.authUser.id)
            .first();
        return new Date(Date.now()) < userData.DateExpired;
    };

    // /home
    getHome = async (req: Request, res: Response) => {
        const isUserPremium = await this.isPremium(req);
        const top_articles = await getTopArticles(isUserPremium);
        const view_articles = await getMostViewedArticles(isUserPremium);
        const category_articles = await getCategoryArticles(isUserPremium);
        const latest_articles = await getLatestArticles(isUserPremium);

        res.render('Home/HomeView', {
            customCss: ['HomePage.css'],
            customJs: ['HomeView.js'],
            top_articles,
            view_articles,
            latest_articles,
            category_articles,
        });
    };

    // /category/:id?page=
    getArticleListByCategory = async (req: Request, res: Response) => {
        const categoryId = req.params.id as string;
        const { categoryName, subcategoryInfo } =
            await getFullCategoryNameByCatID(categoryId);

        const articleNum = await countArticlesByCatID(categoryId);
        const totalPage = Math.ceil(articleNum / articlePerPage);
        let page = (parseInt(req.query.page as string) as number) || 1;
        page = clamp(page, 1, totalPage);

        const page_items = getPagingNumber(page, totalPage);
        const categoriesStringQuery = `/category/${categoryId}`;

        for (let i = 0; i < page_items.length; i++)
            page_items[
                i
            ].link = `${categoriesStringQuery}?page=${page_items[i].value}`;

        const previousLink =
            page > 1 ? `${categoriesStringQuery}?page=${page - 1}` : '';
        const nextLink =
            page < totalPage ? `${categoriesStringQuery}?page=${page + 1}` : '';

        const articles = await getArticlesByCategoryID(
            categoryId,
            articlePerPage,
            (page - 1) * articlePerPage,
            await this.isPremium(req)
        );
        const [topNews, ...newsOfCategory] = articles;

        res.render('Home/HomeGuestCategories', {
            customCss: [
                'Category.css',
                'News.css',
                'Home.css',
                'Component.css',
            ],
            categoryName,
            subcategoryInfo,
            isCategory: true,
            newsOfCategory,
            topNews,
            previousLink,
            nextLink,
            page_items,
        });
    };

    // /category/subcategory/:id?page=
    getArticleListBySubCategory = async (req: Request, res: Response) => {
        const subcategoryId = req.params.id as string;
        const { categoryID, categoryName, subcategoryInfo } =
            await getSubcategoryInfoBySubCatID(subcategoryId);

        const articleNum = await countArticlesBySubCatID(subcategoryId);
        const totalPage = Math.ceil(articleNum / articlePerPage);
        let page = (parseInt(req.query.page as string) as number) || 1;
        page = clamp(page, 1, totalPage);

        const page_items = getPagingNumber(page, totalPage);
        const subCategoriesStringQuery = `/category/subcategory/${subcategoryId}`;

        for (let i = 0; i < page_items.length; i++)
            page_items[
                i
            ].link = `${subCategoriesStringQuery}?page=${page_items[i].value}`;

        const previousLink =
            page > 1 ? `${subCategoriesStringQuery}?page=${page - 1}` : '';
        const nextLink =
            page < totalPage
                ? `${subCategoriesStringQuery}?page=${page + 1}`
                : '';

        const articles = await getArticlesBySubCatID(
            subcategoryId,
            articlePerPage,
            (page - 1) * articlePerPage,
            await this.isPremium(req)
        );
        const [topNews, ...listOfNews] = articles;

        // the activating subcategory will be placed first in the array
        subcategoryInfo.sort((a, b) =>
            a.id === subcategoryId ? -1 : b.id === subcategoryId ? 1 : 0
        );

        res.render('Home/HomeGuestSubCategories', {
            customCss: [
                'Category.css',
                'News.css',
                'Home.css',
                'Component.css',
            ],
            subcategoryId,
            categoryID,
            categoryName,
            subcategoryInfo,
            listOfNews,
            topNews,
            previousLink,
            nextLink,
            page_items,
        });
    };

    // /tags?tag=&page=
    getArticleListByTags = async (req: Request, res: Response) => {
        const tags = req.query.tag as string;

        if (!tags) {
            res.render('Home/HomeGuestTag', {
                customCss: ['Home.css', 'News.css', 'Component.css'],
                articlesFindByTags: [],
                tags: [],
                page_items: [],
            });
            return;
        }

        const tagsArray = tags.split(',') as string[];

        try {
            const validTag = await DBConfig('TAG').whereIn(
                'TAG.Name',
                tagsArray
            );

            const tagIdsArray = validTag.map(item => item.TagID);

            if (validTag) {
                let page = (parseInt(req.query.page as string) as number) || 1;
                const articleNum = await countArticlesByTagID(tagIdsArray);
                const totalPage = Math.ceil(articleNum / articlePerPage);
                page = clamp(page, 1, totalPage);

                const page_items = getPagingNumber(page, totalPage);
                const tagsStringQuery = `/tags?tag=${tagsArray
                    .map(tag => encodeURIComponent(tag))
                    .join(',')}`;

                for (let i = 0; i < page_items.length; i++)
                    page_items[
                        i
                    ].link = `${tagsStringQuery}&page=${page_items[i].value}`;

                const previousLink =
                    page > 1 ? `${tagsStringQuery}&page=${page - 1}` : '';
                const nextLink =
                    page < totalPage
                        ? `${tagsStringQuery}&page=${page + 1}`
                        : '';

                res.render('Home/HomeGuestTag', {
                    customCss: ['Home.css', 'News.css', 'Component.css'],
                    articlesFindByTags: await findPageByTagID(
                        tagIdsArray,
                        articlePerPage,
                        (page - 1) * articlePerPage
                    ),
                    tags: tagsArray,
                    page_items,
                    previousLink,
                    nextLink,
                });
            } else {
                console.log('Invalid Tag');
                res.render('Home/HomeGuestTag', {
                    customCss: ['Home.css', 'News.css', 'Component.css'],
                    articlesFindByTags: [],
                    tags: tagsArray,
                    page_items: [],
                });
            }
        } catch (error) {
            console.log('Get Tags Failed');
            console.log(error);

            res.render('Home/HomeGuestTag', {
                customCss: ['Home.css', 'News.css', 'Component.css'],
                articlesFindByTags: [],
                tags: tagsArray,
                page_items: [],
            });
        }
    };

    // /article/:id
    getArticle = async (req: Request, res: Response) => {
        const articleId = req.params.id;
        if (!articleId) return;
        console.log(articleId);
        const data = await GetArticleById(articleId);
        if (!data) {
            res.redirect('/404');
            return;
        }

        let category = await GetCategoryOfArticle(articleId);

        let bgURL = await GetBackgroundImageOfArticle(articleId);

        let tag = await GetTagsOfArticle(articleId);

        let relativeNews = await GetRelativeArticle(
            category.categoryId,
            articleId
        );

        let isPremiumUser = await this.isPremium(req);
        if (data.IsPremium && !isPremiumUser) {
            const previousUrl = req.headers['referer'];
            res.render('403', { previousUrl });
            return;
        }

        const commentList = await GetCommentOfArticle(articleId);
        console.log(commentList);

        const writer = await getWriterNameById(data.WriterID);

        await AddViewCount(articleId);

        res.render('Home/HomeGuestNews', {
            customCss: ['Home.css', 'News.css', 'Component.css'],
            isPremiumUser: isPremiumUser,
            data: {
                ID: articleId,
                Title: data.Title,
                DatePosted: data.DatePosted,
                Content: data.Content,
                Abstract: data.Abstract,
                IsPremium: data.IsPremium,
                BackgroundImage: bgURL.replace('Static', ''),
                BackgroundImageFileName: path.basename(bgURL),
                category: category.categoryName,
                subcategory: category.subcategoryName,
                categoryId: category.categoryId,
                subcategoryId: category.subcategoryId,
                tags: tag,
                relativeNews: relativeNews,
                comments: commentList,
                writer: writer,
            },
        });
    };

    // /search?q=&page=
    searchArticle = async (req: Request, res: Response) => {
        const searchValue = (req.query.q as string) || '';
        let page = parseInt(req.query.page as string) || 1;

        const articleNum = await CountSearchResult(searchValue);
        const totalPages = Math.ceil(articleNum / articlePerPage);
        page = clamp(page, 1, totalPages);

        let page_items = getPagingNumber(page, totalPages);
        for (let i = 0; i < page_items.length; i++)
            page_items[
                i
            ].link = `/search?q=${searchValue}&page=${page_items[i].value}`;

        const previousLink =
            page > 1 ? `/search?q=${searchValue}&page=${page - 1}` : '';
        const nextLink =
            page < totalPages
                ? `/search?q=${searchValue}&page=${page + 1}`
                : '';

        res.render('Home/HomeGuestSearch', {
            customCss: ['Home.css', 'News.css', 'Component.css'],
            result: await SearchArticle(
                searchValue,
                (page - 1) * articlePerPage,
                articlePerPage,
                await this.isPremium(req)
            ),
            searchValue: searchValue,
            page_items: page_items,
            previousLink,
            nextLink,
        });
    };

    // /download/:id
    downloadArticle = async (req: Request, res: Response) => {
        let articleId = req.params.id;

        if (!articleId || !(await this.isPremium(req))) return;
        console.log(articleId);
        let data = await GetArticleById(articleId);
        if (!data) {
            res.render('/404');
            return;
        }
        pdf.create(data.Content).toBuffer((err, buffer) => {
            if (err) {
                console.error('Error generating PDF:', err);
                res.redirect('/404');
                return;
            }
            res.setHeader(
                'Content-Disposition',
                `attachment; filename=${data.Title}_id-${articleId}.pdf`
            );
            res.setHeader('Content-Type', 'application/pdf');
            res.send(buffer);
        });
        /*
        res.render('DownloadTemplate', { ...data, layout: false },
            (err, html) => {
            if (err) {
                console.error('Error rendering template:', err);
                res.redirect("/404");
            } else {
                pdf.create(html).toBuffer((err, buffer) => {
                    if (err) {
                        console.error('Error generating PDF:', err);
                        res.redirect("/404");
                        return;
                    }
                    res.setHeader('Content-Disposition', `attachment; filename=${data.Title}_id-${articleId}.pdf`);
                    res.setHeader('Content-Type', 'application/pdf');
                    res.send(buffer);
                });
            }
        });
        */
    };

    // /comment
    async commentArticle(req: Request, res: Response) {
        let date = new Date(Date.now());
        // console.log(req.body);
        if (req.session.authUser)
            await AddComment(
                req.body.id,
                req.body.content,
                date,
                req.session.authUser.id as number
            );
        else await AddComment(req.body.id, req.body.content, date);
        /*res.json({
            ArticleId: req.body.id,
            Content: req.body.content,
            DatePosted: date
        });*/
        const referer = req.get('Referer') || '/';
        res.redirect(referer);
    }
}
