import { time } from "console";
import { Response, Request } from "express";
import { data } from "jquery";
import { title } from "process";

// Fake data
const RelatedNews = [
    {
        img: "https://th.bing.com/th/id/R.ca7911324b10651bbbf6733698ddde53?rik=1VZk4kppp9Iw%2fw&pid=ImgRaw&r=0",
        title: "Mây giống đĩa bay trên ngọn núi chứa chan",
        description: "Đồng Nai - Những đám mây bao trùm trên đỉnh núi Chứa Chan như hình đĩa bay khiến nhiều người dân thích thú.",
        date: "10/10/2024",
        tagTitle: "Khoa học",
        tagDescription: "Khoa học trong nước",
        tagList: [
            { tag: "Địa lý", link: "#" },
            { tag: "Khoa học", link: "#" },
            { tag: "Hiện tượng siêu nhiên", link: "#" }
        ]
    }, 
    {
        img: "https://th.bing.com/th/id/R.ca7911324b10651bbbf6733698ddde53?rik=1VZk4kppp9Iw%2fw&pid=ImgRaw&r=0",
        title: "Mây giống đĩa bay trên ngọn núi chứa chan",
        description: "Đồng Nai - Những đám mây bao trùm trên đỉnh núi Chứa Chan như hình đĩa bay khiến nhiều người dân thích thú.",
        date: "10/10/2024",
        tagTitle: "Khoa học",
        tagDescription: "Khoa học trong nước",
        tagList: [
            { tag: "Địa lý", link: "#" },
            { tag: "Khoa học", link: "#" },
            { tag: "Hiện tượng siêu nhiên", link: "#" },
            { tag: "Viễn tưởng", link: "#" },
            { tag: "Tâm linh", link: "#" },
        ]
    },
    {
        img: "https://th.bing.com/th/id/R.ca7911324b10651bbbf6733698ddde53?rik=1VZk4kppp9Iw%2fw&pid=ImgRaw&r=0",
        title: "Mây giống đĩa bay trên ngọn núi chứa chan",
        description: "Đồng Nai - Những đám mây bao trùm trên đỉnh núi Chứa Chan như hình đĩa bay khiến nhiều người dân thích thú.",
        date: "10/10/2024",
        tagTitle: "Khoa học",
        tagDescription: "Khoa học trong nước",
        tagList: [
            { tag: "Địa lý", link: "#" },
            { tag: "Khoa học", link: "#" },
            { tag: "Hiện tượng siêu nhiên", link: "#" },
            { tag: "Viễn tưởng", link: "#" },
            { tag: "Tâm linh", link: "#" },
        ]
    }
];

const commentList = [
    {
        avatar: "https://th.bing.com/th/id/R.ca7911324b10651bbbf6733698ddde53?rik=1VZk4kppp9Iw%2fw&pid=ImgRaw&r=0",
        name: "Nguyễn Văn A",
        date: "10/10/2024",
        content: "Cây này ăn được không mọi người? Ăn vô có hẹo không :v"
    },
    {
        avatar: "https://th.bing.com/th/id/R.ca7911324b10651bbbf6733698ddde53?rik=1VZk4kppp9Iw%2fw&pid=ImgRaw&r=0",
        name: "Nguyễn Văn B",
        date: "10/10/2024",
        content: "Hồi còn sống mình hay ăn cây này."
    },
    {
        avatar: "https://th.bing.com/th/id/R.ca7911324b10651bbbf6733698ddde53?rik=1VZk4kppp9Iw%2fw&pid=ImgRaw&r=0",
        name: "Nguyễn Văn C",
        date: "10/10/2024",
        content: "Tôi mới ra MV, ủng hộ tôi với <3"
    }
]

const News = {
    title: "Mây giống đĩa bay trên ngọn núi chứa chan",
    date: "Thứ ba, 3/12/2024, 17:30 (GMT+7)",
    dicription: "Đồng Nai - Những đám mây bao trùm trên đỉnh núi Chứa Chan như hình đĩa bay khiến nhiều người dân thích thú.",
    content: `
            <style>
                .Image {
                    font: 400 14px arial;
                    line-height: 160%;
                    color: #222;
                    padding: 10px 0 0 0;
                    margin: 0;
                    text-align: left;
                }
            </style>
            <img style="width:80%" src="https://th.bing.com/th/id/R.ca7911324b10651bbbf6733698ddde53?rik=1VZk4kppp9Iw%2fw&pid=ImgRaw&r=0" alt="Mô tả hình ảnh" />
            <figcaption style="width: 100% float: left text-align: left;">
                <p class="Image">Phiến quân HTS tại khu vực ngoại ô Aleppo, Syria ngày 29/11. Ảnh: <em>AP</em></p>
            </figcaption>
            <p>Đây là đoạn đầu tiên của bài viết.</p>
            <img style="width:80%" src="https://th.bing.com/th/id/R.ca7911324b10651bbbf6733698ddde53?rik=1VZk4kppp9Iw%2fw&pid=ImgRaw&r=0" alt="Mô tả hình ảnh" />
            <figcaption style="width: 100% float: left text-align: left;">
                <p class="Image">Phiến quân HTS tại khu vực ngoại ô Aleppo, Syria ngày 29/11. Ảnh: <em>AP</em></p>
            </figcaption>
            <p>Tiếp tục với nội dung khác. Viết tiếp nhé</p>`,
    tagList:[
        { tag: "Địa lý", link: "#" },
        { tag: "Khoa học", link: "#" },
        { tag: "Hiện tượng siêu nhiên", link: "#" }
    ],
    category: "Khoa học",
    subcategory: "Khoa học trong nước",
    writer: "Pham Thanh Đạt",
    RelatedNews: RelatedNews,
    comments: commentList
}



const listCardResult = [
    {
        img: "https://th.bing.com/th/id/R.ca7911324b10651bbbf6733698ddde53?rik=1VZk4kppp9Iw%2fw&pid=ImgRaw&r=0",
        title: "Mây giống đĩa bay trên ngọn núi chứa chan",
        description: "Đồng Nai - Những đám mây bao trùm trên đỉnh núi Chứa Chan như hình đĩa bay khiến nhiều người dân thích thú.",
        date: "10/10/2024",
        tagTitle: "Khoa học",
        tagDescription: "Khoa học trong nước",
        tagList: [
            { tag: "Địa lý", link: "#" },
            { tag: "Khoa học", link: "#" },
            { tag: "Hiện tượng siêu nhiên", link: "#" }
        ]
    },
    {
        img: "https://th.bing.com/th/id/R.ca7911324b10651bbbf6733698ddde53?rik=1VZk4kppp9Iw%2fw&pid=ImgRaw&r=0",
        title: "Mây giống đĩa bay trên ngọn núi chứa chan",
        description: "Đồng Nai - Những đám mây bao trùm trên đỉnh núi Chứa Chan như hình đĩa bay khiến nhiều người dân thích thú.",
        date: "10/10/2024",
        tagTitle: "Khoa học",
        tagDescription: "Khoa học trong nước",
        tagList: [
            { tag: "Địa lý", link: "#" },
            { tag: "Khoa học", link: "#" },
            { tag: "Hiện tượng siêu nhiên", link: "#" },
            { tag: "Viễn tưởng", link: "#" },
            { tag: "Tâm linh", link: "#" },
        ]
    },
    {
        img: "https://th.bing.com/th/id/R.ca7911324b10651bbbf6733698ddde53?rik=1VZk4kppp9Iw%2fw&pid=ImgRaw&r=0",
        title: "Mây giống đĩa bay trên ngọn núi chứa chan",
        description: "Đồng Nai - Những đám mây bao trùm trên đỉnh núi Chứa Chan như hình đĩa bay khiến nhiều người dân thích thú.",
        date: "10/10/2024",
        tagTitle: "Khoa học",
        tagDescription: "Khoa học trong nước",
        tagList: [
            { tag: "Địa lý", link: "#" },
            { tag: "Khoa học", link: "#" },
            { tag: "Hiện tượng siêu nhiên", link: "#" }
        ]
    },
    {
        img: "https://th.bing.com/th/id/R.ca7911324b10651bbbf6733698ddde53?rik=1VZk4kppp9Iw%2fw&pid=ImgRaw&r=0",
        title: "Mây giống đĩa bay trên ngọn núi chứa chan",
        description: "Đồng Nai - Những đám mây bao trùm trên đỉnh núi Chứa Chan như hình đĩa bay khiến nhiều người dân thích thú.",
        date: "10/10/2024",
        tagTitle: "Khoa học",
        tagDescription: "Khoa học trong nước",
        tagList: [
            { tag: "Địa lý", link: "#" },
            { tag: "Khoa học", link: "#" },
            { tag: "Hiện tượng siêu nhiên", link: "#" },
            { tag: "Viễn tưởng", link: "#" },
            { tag: "Tâm linh", link: "#" },

        ]
    }
];
export class ArticleController {
    // /articles/home
    getHome(req: Request, res: Response) {
        let testCategory = [];
        for (let i = 0; i < 20; i++) {
            let testSubCategory = [];
            for (let j = 0; j < 20; j++)
                testSubCategory.push({
                    id: j,
                    name: "test subcategory " + j
                });
            testCategory.push({
                id: i,
                name: "test category " + i,
                SubCategories: testSubCategory
            })
        }
        res.render('HomeView', {
            customCss: ['Home.css'],
            Top10Categories: testCategory.slice(0, 10),
            Categories: testCategory
        });
    }

    // /articles/categories/:id?page=
    getArticleListByCategory(req: Request, res: Response) {
        const categoryId = req.params.id;
        const page = req.query.page as string || '0';
        console.log(categoryId);
        console.log(page);
        res.render('HomeGuestCategories', {
            
        }
        );
    }

    // /articles/subcategories/:id?page=
    getArticleListBySubCategory(req: Request, res: Response) {
        const categoryId = req.params.id;
        const page = req.query.page as string || '0';
        console.log(categoryId);
        console.log(page);
        res.render('ArticleListBySubCategoryView');
    }

    // /articles/tags?tags=&page=
    getArticleListByTag(req: Request, res: Response) {
        const tags = req.query.tags as string;
        const page = req.query.page as string || '0';
        console.log(tags);
        console.log(page)
        res.render('Home/HomeGuestTag', {
            listCardResult, 
            tags
        });
    }

    // /articles/:id
    getArticle(req: Request, res: Response) {
        const articleId = req.params.id;
        console.log(articleId);
        // Tìm article theo id

        //Tạo ra một News 
        
        res.render('Home/HomeGuestNews', {
            customCss: ['News.css'],
            News
        });
    }

    // /articles/search?q=&page=
    searchArticle(req: Request, res: Response) {
        const searchValue = req.query.q as string || '';
        const page = req.query.page as string || '0';
        console.log(searchValue);
        console.log(page);
        res.render('Home/HomeGuestSearch', { listCardResult });
    }

    // /articles/download/:id
    downloadArticle(req: Request, res: Response) {
        let articleId = req.params.id;
        console.log(articleId);
    }
}
