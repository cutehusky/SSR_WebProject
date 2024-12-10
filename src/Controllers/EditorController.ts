import { Request, Response } from 'express';

export class EditorController {
    // /editor/articles
    getArticles(req: Request, res: Response) {
        const categories: string[] = ['Thời sự', 'Kinh doanh', 'Bất động sản'];
        const articles: {
            title: string;
            author: string;
            date: string;
            tag: string;
            category: string;
        }[] = [
            {
                title: 'Phát hiện gần 150 bộ hài cốt trên phố trung tâm Hà Nội',
                author: 'Phi Hoàng',
                date: '21/11/2024',
                tag: 'Chính trị',
                category: 'Thời sự',
            },
            {
                title: 'Phát hiện gần 150 bộ hài cốt trên phố trung tâm Hà Nội',
                author: 'Phi Hoàng',
                date: '21/11/2024',
                tag: 'Chính trị',
                category: 'Thời sự',
            },
            {
                title: 'Phát hiện gần 150 bộ hài cốt trên phố trung tâm Hà Nội',
                author: 'Phi Hoàng',
                date: '21/11/2024',
                tag: 'Chính trị',
                category: 'Thời sự',
            },
            {
                title: 'Phát hiện gần 150 bộ hài cốt trên phố trung tâm Hà Nội',
                author: 'Phi Hoàng',
                date: '21/11/2024',
                tag: 'Chính trị',
                category: 'Thời sự',
            },
            {
                title: 'Phát hiện gần 150 bộ hài cốt trên phố trung tâm Hà Nội',
                author: 'Phi Hoàng',
                date: '21/11/2024',
                tag: 'Chính trị',
                category: 'Thời sự',
            },
        ];
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
        });
    }

    // /editor/approve
    approveArticle(req: Request, res: Response) {
        const articleId = req.params.id;
        console.log(articleId);
        res.send(`Article ${articleId} approved`);
    }

    // /editor/reject
    rejectArticle(req: Request, res: Response) {
        const articleId = req.params.id;
        console.log(articleId);
        res.send(`Article ${articleId} rejected`);
    }

    // /editor/article/:id/
    viewArticle(req: Request, res: Response) {
        const articleId = req.params.id;
        const article = {
            date: 'Thứ 2, 10/10/2024 12:00',
            author: 'Chris Bumstead',
            title: 'Phát hiện thực vật họ Thu hải đường ở Quảng Trị',
            category: 'Khoa học',
            subcategory: 'Khoa học trong nước',
            tags: ['Thực vật', 'Việt Nam', 'Địa lý'],
            cover: '/logo.jpg',
            content:
                'Thu hải đường hoa thưa (Begonia laxiflora) được phát hiện mọc trên các sườn dốc đá granite ven suối. Loài này được phân biệt với các loài Thu hải đường khác bởi các cụm hoa dài và quả nang không lông. Loài thực vật mới này được cho là đặc hữu của Việt Nam, bổ sung quan trọng vào đa dạng sinh học phong phú của dãy núi Trường Sơn.<br> <br> Ông Trương Quang Trung, Giám đốc Khu Bảo tồn Thiên nhiên Đakrông, tỉnh Quảng Trị chia sẻ việc phát hiện loài thực vật mới trong Khu Bảo tồn là minh chứng cho cam kết lâu dài về việc bảo tồn và phát triển đa dạng sinh học tại khu vực. Khu bảo tồn quyết tâm bảo vệ các loài thực vật quý hiếm và hệ sinh thái độc đáo của Việt Nam, đóng góp vào việc duy trì di sản thiên nhiên cho các thế hệ mai sau. <br> <br> Ông Nick Cox, Giám đốc Hợp phần Bảo tồn Đa dạng Sinh học, do tổ chức WWF thực hiện, kỳ vọng phát hiện nhiều loài thực vật và động vật mới tại dãy Trường Sơn trong những năm tới và tiếp tục tăng cường bảo vệ những khu vực rừng này. Khu bảo tồn thiên nhiên Đakrông (Quảng Trị) được thành lập từ năm 2002 với tổng diện tích tự nhiên là 37.640 ha. Tại đây có 597 loài thực vật, 45 loài động vật, trong đó có 4 loài thú, 4 loài chim đặc hữu duy nhất có ở Việt Nam. Khu vực này là nơi giao lưu của các loài thực vật Bắc Nam và khu vực Đông Dương. <br> <br> Đây cũng chính là nơi ghi nhận về sự có mặt của loài gà lôi lam mào trắng (Lophura edwardsi), có giá trị bảo tồn cao và đang đứng trước nguy cơ tuyệt chủng. Nhiều loại động thực vật ở đây có tên trong sách đỏ Việt Nam như Sao la, Mang Trường Sơn, Chà vá chân nâu, Voọc, Lim xanh... Khu bảo tồn thiên nhiên Đakrông với đặc trưng sinh thái lá rộng, thường xanh trên đất thấp và được tổ chức Bảo tồn chim thế giới xếp vào vùng chim quan trọng.',
        };

        res.render('Editor/EditorViewArticle', {
            customCss: ['Editor.css'],
            customJs: ['EditorAddTag.js'],
            articleId,
            article,
        });
    }
}
