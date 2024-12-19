import { Request, Response } from 'express';
import { getEditorCategories } from '../Utils/getEditorCategories';
import { getArticlesCategories } from '../Utils/getArticlesCategories';
import { getArticleDetails } from '../Utils/getArticleDetails';
import { getArticleTags } from '../Utils/getArticleTags';
import { updateArticleStateEditor } from '../Utils/updateArticleStateEditor';
import { getCategorySubcategories } from '../Utils/getEditorCategories';

export class EditorController {
    // /editor/:editorID/articles
    async getArticles(req: Request, res: Response) {
        const editorID = Number(req.params.editorID);
        const categories = await getEditorCategories(editorID);
        let selectedCategory = undefined;
        if (!isNaN(Number(req.query.category)) && Number(req.query.category) !== -1)
            selectedCategory = categories.filter(
                (category) => category.id === Number(req.query.category)
            );
        let articles;
        if (selectedCategory === undefined)
            articles = await getArticlesCategories(categories);
        else 
            articles = await getArticlesCategories(selectedCategory);
        const pages = ['1', '2', '3', '4', '5'];

        res.render('Editor/EditorListPendingApproveView', {
            customCss: [
                'Editor.css',
                'Admin.css',
                'Component.css',
                'DataTable.css',
            ],
            customJs: ['AdminArticlesDataTable.js'],
            categories,
            articles,
            pages,
            editorID,
        });
    }

    // /editor/:editorID/articles/:id/approve
    async approveArticle(req: Request, res: Response) {
        const articleId = req.params.id;
        const editorId = req.params.editorID;
        const result = req.body;
        const tags = result.tags.split(',').map((tag: string) => Number(tag.trim()));
        const subcategoryId = result.subcategory;
        const date = result.date;
        const time = result.time;
        const dateTime = `${date} ${time}`;
        await updateArticleStateEditor(Number(editorId), Number(articleId), 'approved', null, tags, subcategoryId, dateTime);
        res.redirect(`/editor/${editorId}/articles`);
    }

    // /editor/:editorID/articles/:id/reject
    async rejectArticle(req: Request, res: Response) {
        const articleId = req.params.id;
        const editorId = req.params.editorID;
        await updateArticleStateEditor(Number(editorId), Number(articleId), 'rejected', req.body.reason);
        res.redirect(`/editor/${editorId}/articles`);
    }

    // /editor/:editorID/articles/:id
    async viewArticle(req: Request, res: Response) {
        const articleId = req.params.id;
        const editorId = req.params.editorID;
        const article_details = await getArticleDetails(Number(articleId));
        let article;
        let date = new Date(article_details[0].DatePosted);
        const options: Intl.DateTimeFormatOptions = {
            weekday: 'long',
            day: '2-digit',
            month: '2-digit',
            year: 'numeric',
            hour: '2-digit',
            minute: '2-digit'
        };
        const formattedDate = date.toLocaleDateString('vi-VN', options);
        const tags = await getArticleTags(Number(articleId));
        const subcategories = await getCategorySubcategories(article_details[0].CategoryID);
        article = {
            date: formattedDate,
            author: article_details[0].Alias,
            title: article_details[0].Title,
            category: article_details[0].Category,
            subcategory: article_details[0].Subcategory,
            tags: tags,
            cover: article_details[0].Cover || '/logo.jpg',
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
