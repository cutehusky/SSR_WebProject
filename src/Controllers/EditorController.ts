import { Request, Response, NextFunction } from 'express';
import { getEditorSubCategories } from '../Utils/getEditorCategories';
import { getArticlesCategories } from '../Utils/getArticlesCategories';
import { getArticleDetails } from '../Utils/getArticleDetails';
import { getArticleTags } from '../Utils/getArticleTags';
import { updateArticleStateEditor } from '../Utils/updateArticleStateEditor';
import { getCategorySubcategories } from '../Utils/getEditorCategories';
import { UserRole } from '../Models/UserData';
import { sub } from 'date-fns';
import { getArticlesCategoriesRejected } from '../Utils/getArticlesCategories';
import { getArticlesCategoriesApproved } from '../Utils/getArticlesCategories';
import { TimeOptions } from '../Utils/DBConfig';

export class EditorController {

    verifyUserForEditor(req: Request, res: Response, Next: NextFunction) {
        if (!req.session.authUser || req.session.authUser.role !== UserRole.Editor) {
            res.redirect('/404');
            return;
        }
        Next();
    }

    async getArticles(req: Request, res: Response) {
        const editorID = req.session.authUser?.id as number;
        const subCategories = await getEditorSubCategories(editorID);
        let selectedSubCategory = undefined;
        if (!isNaN(Number(req.query.category)) && Number(req.query.category) !== -1) 
            selectedSubCategory = subCategories.filter(
                (subCategory) => subCategory.id === Number(req.query.category)
            );
        let articles;
        if (selectedSubCategory === undefined) {
            articles = await getArticlesCategories(subCategories, editorID);
        } else {
            articles = await getArticlesCategories(selectedSubCategory, editorID);
        }
    
        let selectedId = -1;
        if (Number(req.query.category) !== -1) 
            selectedId = Number(req.query.category);
        res.render('Editor/EditorListPendingApproveView', {
            customCss: [
                'Editor.css',
                'Admin.css',
                'Component.css',
                'DataTable.css',
            ],
            customJs: ['EditorArticlesDataTable.js'],
            categories: subCategories,
            articles,
            editorID,
            selectedCategory: selectedId,
        });
    }

    async getRejectedArticles(req: Request, res: Response) {
        const editorID = req.session.authUser?.id as number;
        const subCategories = await getEditorSubCategories(editorID);
        let selectedSubCategory = undefined;
        if (!isNaN(Number(req.query.category)) && Number(req.query.category) !== -1) 
            selectedSubCategory = subCategories.filter(
                (subCategory) => subCategory.id === Number(req.query.category)
            );
        let articles;
        if (selectedSubCategory === undefined) {
            articles = await getArticlesCategoriesRejected(subCategories, editorID);
        } else {
            articles = await getArticlesCategoriesRejected(selectedSubCategory, editorID);
        }
    
        let selectedId = -1;
        if (Number(req.query.category) !== -1) 
            selectedId = Number(req.query.category);
        res.render('Editor/EditorListRejected', {
            customCss: [
                'Editor.css',
                'Admin.css',
                'Component.css',
                'DataTable.css',
            ],
            customJs: ['EditorArticlesDataTable.js'],
            categories: subCategories,
            articles,
            editorID,
            selectedCategory: selectedId,
        });
    }

    async getApprovedArticles(req: Request, res: Response) {
        const editorID = req.session.authUser?.id as number;
        const subCategories = await getEditorSubCategories(editorID);
        let selectedSubCategory = undefined;
        if (!isNaN(Number(req.query.category)) && Number(req.query.category) !== -1) 
            selectedSubCategory = subCategories.filter(
                (subCategory) => subCategory.id === Number(req.query.category)
            );
        let articles;
        if (selectedSubCategory === undefined)
            articles = await getArticlesCategoriesApproved(subCategories, editorID);
        else
            articles = await getArticlesCategoriesApproved(selectedSubCategory, editorID);

        let selectedId = -1;
        if (Number(req.query.category) !== -1)
            selectedId = Number(req.query.category);
        res.render('Editor/EditorListApproved', {
            customCss: [
                'Editor.css',
                'Admin.css',
                'Component.css',
                'DataTable.css',
            ],
            customJs: ['EditorArticlesDataTable.js'],
            categories: subCategories,
            articles,
            editorID,
            selectedCategory: selectedId,
        });
    }

    // /editor/articles/:id/approve
    async approveArticle(req: Request, res: Response) {
        const articleId = req.params.id;
        const editorId = req.session.authUser?.id as number;
        const result = req.body;
        const tags = result.tags.split(',').map((tag: string) => Number(tag.trim()));
        const subcategoryId = result.subcategory;
        const date = result.date;
        const time = result.time;
        const dateTime = `${date} ${time}`;
        await updateArticleStateEditor(Number(editorId), Number(articleId), 'Approved', null, tags, subcategoryId, dateTime);
        res.redirect(`/editor/articles`);
    }

    // /editor/articles/:id/reject
    async rejectArticle(req: Request, res: Response) {
        const articleId = req.params.id;
        const editorId = req.session.authUser?.id as number;
        await updateArticleStateEditor(Number(editorId), Number(articleId), 'Rejected', req.body.reason);
        res.redirect(`/editor/articles`);
    }

    // /editor/articles/:id
    async viewArticle(req: Request, res: Response) {
        const articleId = req.params.id;
        const editorId = req.session.authUser?.id as number;
        const article_details = await getArticleDetails(Number(articleId));
        let article;
        let date = new Date(article_details[0].DatePosted);
        const formattedDate = date.toLocaleDateString('vi-VN', TimeOptions);
        const tags = await getArticleTags(Number(articleId));
        const subcategories = await getCategorySubcategories(article_details[0].CategoryID);
        let cover = article_details[0].Cover;
        if (cover === 'null')
            cover = '/logo.jpg';
        article = {
            date: formattedDate,
            author: article_details[0].Alias,
            title: article_details[0].Title,
            category: article_details[0].Category,
            subcategory: article_details[0].Subcategory,
            subcategoryId: article_details[0].SubcategoryID,
            tags: tags,
            cover: cover,
            content: article_details[0].Content ||
                'Thu hải đường hoa thưa (Begonia laxiflora) được phát hiện mọc trên các sườn dốc đá granite ven suối. Loài này được phân biệt với các loài Thu hải đường khác bởi các cụm hoa dài và quả nang không lông. Loài thực vật mới này được cho là đặc hữu của Việt Nam, bổ sung quan trọng vào đa dạng sinh học phong phú của dãy núi Trường Sơn.<br> <br> Ông Trương Quang Trung, Giám đốc Khu Bảo tồn Thiên nhiên Đakrông, tỉnh Quảng Trị chia sẻ việc phát hiện loài thực vật mới trong Khu Bảo tồn là minh chứng cho cam kết lâu dài về việc bảo tồn và phát triển đa dạng sinh học tại khu vực. Khu bảo tồn quyết tâm bảo vệ các loài thực vật quý hiếm và hệ sinh thái độc đáo của Việt Nam, đóng góp vào việc duy trì di sản thiên nhiên cho các thế hệ mai sau. <br> <br> Ông Nick Cox, Giám đốc Hợp phần Bảo tồn Đa dạng Sinh học, do tổ chức WWF thực hiện, kỳ vọng phát hiện nhiều loài thực vật và động vật mới tại dãy Trường Sơn trong những năm tới và tiếp tục tăng cường bảo vệ những khu vực rừng này. Khu bảo tồn thiên nhiên Đakrông (Quảng Trị) được thành lập từ năm 2002 với tổng diện tích tự nhiên là 37.640 ha. Tại đây có 597 loài thực vật, 45 loài động vật, trong đó có 4 loài thú, 4 loài chim đặc hữu duy nhất có ở Việt Nam. Khu vực này là nơi giao lưu của các loài thực vật Bắc Nam và khu vực Đông Dương. <br> <br> Đây cũng chính là nơi ghi nhận về sự có mặt của loài gà lôi lam mào trắng (Lophura edwardsi), có giá trị bảo tồn cao và đang đứng trước nguy cơ tuyệt chủng. Nhiều loại động thực vật ở đây có tên trong sách đỏ Việt Nam như Sao la, Mang Trường Sơn, Chà vá chân nâu, Voọc, Lim xanh... Khu bảo tồn thiên nhiên Đakrông với đặc trưng sinh thái lá rộng, thường xanh trên đất thấp và được tổ chức Bảo tồn chim thế giới xếp vào vùng chim quan trọng.',
        };
        res.render('Editor/EditorViewArticle', {
            customCss: ['Editor.css'],
            customJs: ['EditorAddTag.js'],
            articleId,
            article,
            editorId,
            subcategories
        });
    }

}
