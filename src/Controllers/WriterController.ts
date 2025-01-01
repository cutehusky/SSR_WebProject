import { Response, Request, NextFunction } from 'express';
import path from 'path';
import * as fs from 'fs';
import { DBConfig, TimeOptions } from '../Utils/DBConfig';
import {
    AddBackgroundImageOfArticle,
    CountArticleOfWriterByStates,
    GetArticleById,
    GetArticleOfWriterByStates,
    GetBackgroundImageOfArticle,
    GetCategoryFullNameOfArticle,
    GetCategoryOfArticle,
    GetCommentOfArticle,
    GetTagsOfArticle,
    UpdateBackgroundImageOfArticle,
} from '../Services/AdminArticleService';
import { UserRole } from '../Models/UserData';
import { clamp, getPagingNumber } from '../Utils/MathUtils';
import session from 'express-session';

const articlePerPage = 6;
export class WriterController {
    verifyUserForWriter(req: Request, res: Response, Next: NextFunction) {
        if (
            !req.session.authUser ||
            req.session.authUser.role !== UserRole.Writer
        ) {
            res.redirect('/404');
            return;
        }
        Next();
    }

    verifyUserForAdminAndWriter(
        req: Request,
        res: Response,
        Next: NextFunction
    ) {
        if (
            !req.session.authUser ||
            (req.session.authUser.role !== UserRole.Writer &&
                req.session.authUser.role !== UserRole.Admin)
        ) {
            res.redirect('/404');
            return;
        }
        Next();
    }

    // /writer/new
    createArticleEditor(req: Request, res: Response) {
        res.render('Writer/WriterPublishNews', {
            customCss: ['Writer.css'],
            customJs: ['Summernote.js'],
        });
    }

    // /writer/edit/:id
    async editArticleEditor(req: Request, res: Response) {
        const writerId = req.session.authUser?.id as number;
        const articleId = req.params.id;
        console.log(writerId);
        if (!articleId || !writerId) {
            res.redirect('/404');
            return;
        }
        const data = await GetArticleById(articleId);
        console.log(data);
        if (
            !data ||
            (data.WriterID !== writerId &&
                req.session.authUser?.role !== UserRole.Admin)
        ) {
            res.redirect('/404');
            return;
        }

        let bgURL = await GetBackgroundImageOfArticle(articleId);

        let tag = await GetTagsOfArticle(articleId);

        if (
            req.session.authUser?.role === UserRole.Admin ||
            data.Status === 'Draft' ||
            data.Status === 'Rejected'
        ) {
            let category = await GetCategoryFullNameOfArticle(articleId);
            res.render('Writer/WriterUpdateNews', {
                customCss: ['Writer.css'],
                customJs: ['Summernote.js'],
                data: {
                    ID: articleId,
                    Title: data.Title,
                    DatePosted: data.DatePosted,
                    Content: data.Content,
                    Abstract: data.Abstract,
                    Status: data.Status,
                    IsPremium: data.IsPremium,
                    BackgroundImage: bgURL.replace('Static', ''),
                    BackgroundImageFileName: path.basename(bgURL),
                    selectedCategory: category.id,
                    selectedCategoryName: category.fullname,
                    tags: tag,
                    state: data.Status,
                    reason: data.Reason,
                },
            });
        } else {
            const commentList = await GetCommentOfArticle(articleId);
            let category = await GetCategoryOfArticle(articleId);
            res.render('Writer/ViewNews', {
                customCss: ['Home.css', 'News.css', 'Component.css'],
                data: {
                    ID: articleId,
                    Title: data.Title,
                    DatePosted: data.DatePosted.toLocaleTimeString('vi-VN', TimeOptions),
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
                    comments: commentList,
                },
            });
        }
    }

    // /writer/myArticles?state=
    async getMyArticleList(req: Request, res: Response) {
        const writerId = req.session.authUser?.id as number;
        if (!writerId) {
            res.redirect('/404');
            return;
        }
        let page = parseInt(req.query.page as string) || 1;
        let state = req.query.state as string;
        let states: string[] = [];
        if (
            !state ||
            state === 'all' ||
            (state !== 'Draft' &&
                state !== 'Rejected' &&
                state !== 'Approved' &&
                state !== 'Published')
        ) {
            states = ['Draft', 'Rejected', 'Approved', 'Published'];
            state = 'all';
        } else states = [state];
        let articleNum = await CountArticleOfWriterByStates(writerId, states);
        let totalPages = Math.ceil(articleNum / articlePerPage);
        page = clamp(page, 1, totalPages);

        let page_items = getPagingNumber(page, totalPages);
        for (let i = 0; i < page_items.length; i++)
            page_items[
                i
            ].link = `/writer/myArticles?state=${state}&page=${page_items[i].value}`;

        const previousLink =
            page > 1
                ? `/writer/myArticles?state=${state}&page=${page - 1}`
                : '';
        const nextLink =
            page < totalPages
                ? `/writer/myArticles?state=${state}&page=${page + 1}`
                : '';

        let articles = await GetArticleOfWriterByStates(
            writerId,
            states,
            (page - 1) * articlePerPage,
            articlePerPage
        );

        for (let i = 0; i < articles.length; i++) {
            if (articles[i].datePosted) {
                const time = articles[i].datePosted.toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' });
                const date = articles[i].datePosted.toLocaleDateString([], {
                    day: '2-digit',
                    month: '2-digit',
                    year: 'numeric'
                });
                articles[i].datePosted = `${time} ${date}`;
            } else {
                articles[i].datePosted = `xx:xx xx/xx/xxxx`;
            }

            if (articles[i].datePublished) {
                const time = articles[i].datePublished.toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' });
                const date = articles[i].datePublished.toLocaleDateString([], {
                    day: '2-digit',
                    month: '2-digit',
                    year: 'numeric'
                });
                articles[i].datePublished = `${time} ${date}`;
            } else {
                articles[i].datePublished = `xx:xx xx/xx/xxxx`;
            }
        }

        res.render('Writer/WriterViewArticles', {
            customCss: ['Writer.css'],
            state,
            articles,
            page_items,
            previousLink,
            nextLink,
        });
    }

    countArticleInState = async (writerId: number, states: string[]) => {
        let res = await DBConfig('article')
            .where({ WriterID: writerId })
            .whereIn('Status', states)
            .count('* as count')
            .first();
        return res?.count || 0;
    };

    getWriterHome = async (req: Request, res: Response) => {
        const writerId = req.session.authUser?.id as number;
        if (!writerId) {
            res.redirect('/404');
            return;
        }
        const states = [
            {
                id: 'Published',
                label: 'Số lượng bài viết đã xuất bảng',
                states: ['Published'],
            },
            {
                id: 'Approved',
                label: 'Số lượng bài viết chờ xuất bảng',
                states: ['Approved'],
            },
            {
                id: 'Draft',
                label: 'Số lượng bài viết chưa phê duyệt',
                states: ['Draft'],
            },
            {
                id: 'Rejected',
                label: 'Số lượng bài viết bị từ chối',
                states: ['Rejected'],
            },
            {
                id: 'All',
                label: 'Tổng số bài viết đã đăng',
                states: ['Draft', 'Rejected', 'Approved', 'Published'],
            },
        ];

        // Use Promise.all to resolve all promises concurrently
        const statistics = await Promise.all(
            states.map(async state => ({
                id: state.id,
                label: state.label,
                value: await this.countArticleInState(writerId, state.states),
            }))
        );

        res.render('Writer/WriterHome', {
            statistics,
            customCss: ['Writer.css', 'User.css'],
        });
    };

    // /writer/new
    async newArticle(req: Request, res: Response) {
        console.log(req.body);
        const writerId = req.session.authUser?.id as number;
        if (!writerId) {
            res.redirect('/404');
            return;
        }

        if (
            !req.body.category ||
            !req.body.title ||
            !req.body.content ||
            !req.body.abstract ||
            !req.body.tags
        ) {
            res.redirect('/404');
            return;
        }

        const [id] = await DBConfig('article').insert({
            Title: req.body.title,
            DatePosted: new Date(Date.now()),
            Content: req.body.content,
            Abstract: req.body.abstract,
            Status: 'Draft',
            IsPremium: req.body.isPremium === 'on' ? 1 : 0,
            WriterID:
                req.session.authUser?.role === UserRole.Admin ? null : writerId,
        });

        await DBConfig('article_subcategory').insert({
            ArticleID: id,
            SubCategoryID: req.body.category,
        });

        const tags = req.body.tags;
        const listOfTags = tags ? tags.split(',') : [];
        if (listOfTags.length > 0) {
            const insertData = listOfTags.map((tagId: any) => ({
                ArticleID: id,
                TagID: tagId,
            }));
            await DBConfig('article_tag').insert(insertData);
        }

        const imageData = req.body.backgroundImageArticle;
        if (!imageData) {
            await AddBackgroundImageOfArticle(id);
        } else {
            const matches = imageData.match(
                /^data:(image\/[a-zA-Z]+);base64,(.+)$/
            );
            if (!matches || matches.length !== 3) {
                await AddBackgroundImageOfArticle(id);
            } else {
                const fileType = matches[1];
                const base64Data = matches[2];
                const extension = fileType.split('/')[1];
                const savePath = path.posix.join(
                    './Static/uploads/article',
                    id.toString()
                );
                fs.mkdirSync(savePath, { recursive: true });
                const filePath = path.posix.join(
                    savePath,
                    'BackgroundImage.' + extension
                );
                fs.writeFile(
                    filePath,
                    base64Data,
                    { encoding: 'base64' },
                    async err => {
                        if (err) {
                            console.error('Error saving the file:', err);
                            await AddBackgroundImageOfArticle(id);
                            return;
                        }
                        await AddBackgroundImageOfArticle(
                            id,
                            filePath.replace('Static', '')
                        );
                    }
                );
            }
        }
        if (req.session.authUser?.role === UserRole.Admin) {
            const redirectUrl = req.session.retUrl || '/admin/articles';
            res.redirect(redirectUrl);
            return;
        }
        res.redirect('/writer/myArticles?state=Draft');
    }

    // /writer/edit
    async editArticle(req: Request, res: Response) {
        console.log(req.body);
        const writerId = req.session.authUser?.id as number;
        const id = req.body.id;
        if (!id) {
            res.redirect('/404');
            return;
        }

        const data = await GetArticleById(id);
        if (
            (data.WriterID !== writerId &&
                req.session.authUser?.role !== UserRole.Admin) ||
            (data.Status !== 'Draft' && data.Status !== 'Rejected')
        ) {
            res.redirect('/404');
            return;
        }

        if (
            !req.body.category ||
            !req.body.title ||
            !req.body.content ||
            !req.body.abstract ||
            !req.body.tags
        ) {
            res.redirect('/404');
            return;
        }

        if (
            data.WriterID !== writerId &&
            req.session.authUser?.role === UserRole.Admin
        ) {
            await DBConfig('article')
                .where({ ArticleID: id })
                .update({
                    Title: req.body.title,
                    DatePosted: new Date(Date.now()),
                    Content: req.body.content,
                    Abstract: req.body.abstract,
                    Status: 'Draft',
                    IsPremium: req.body.isPremium === 'on' ? 1 : 0,
                });
        } else {
            await DBConfig('article')
                .where({ ArticleID: id })
                .update({
                    Title: req.body.title,
                    DatePosted: new Date(Date.now()),
                    Content: req.body.content,
                    Abstract: req.body.abstract,
                    Status: 'Draft',
                    IsPremium: req.body.isPremium === 'on' ? 1 : 0,
                    WriterID: writerId,
                });
        }

        const affectedRows = await DBConfig('article_subcategory')
            .where({
                ArticleID: id,
            })
            .update({
                SubCategoryID: req.body.category,
            });
        if (affectedRows === 0)
            await DBConfig('article_subcategory').insert({
                SubCategoryID: req.body.category,
                ArticleID: id,
            });

        const tags = req.body.tags;
        const listOfTags = tags ? tags.split(',') : [];
        await DBConfig('article_tag').where({ ArticleID: id }).del();
        if (listOfTags.length > 0) {
            const insertData = listOfTags.map((tagId: any) => ({
                ArticleID: id,
                TagID: tagId,
            }));
            await DBConfig('article_tag').insert(insertData);
        }

        const imageData = req.body.backgroundImageArticle;
        if (!imageData) {
            await UpdateBackgroundImageOfArticle(id);
        } else if (imageData === 'not changed') {
            console.log('image not change');
        } else {
            const matches = imageData.match(
                /^data:(image\/[a-zA-Z]+);base64,(.+)$/
            );
            if (!matches || matches.length !== 3) {
                await UpdateBackgroundImageOfArticle(id);
            } else {
                const fileType = matches[1];
                const base64Data = matches[2];
                const extension = fileType.split('/')[1];
                const savePath = path.posix.join(
                    './Static/uploads/article',
                    id.toString()
                );
                fs.mkdirSync(savePath, { recursive: true });
                const filePath = path.posix.join(
                    savePath,
                    'BackgroundImage.' + extension
                );
                fs.writeFile(
                    filePath,
                    base64Data,
                    { encoding: 'base64' },
                    async err => {
                        if (err) {
                            console.error('Error saving the file:', err);
                            await UpdateBackgroundImageOfArticle(id);
                            return;
                        }
                        await UpdateBackgroundImageOfArticle(
                            id,
                            filePath.replace('Static', '')
                        );
                    }
                );
            }
        }
        if (
            data.WriterID !== writerId &&
            req.session.authUser?.role === UserRole.Admin
        ) {
            const redirectUrl = req.session.retUrl || '/admin/articles';
            res.redirect(redirectUrl);
            return;
        }
        res.redirect('/writer/myArticles?state=Draft');
    }
}
