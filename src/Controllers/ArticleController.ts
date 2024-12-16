import { time } from 'console';
import { Response, Request } from 'express';
import { get } from 'http';
import { data } from 'jquery';
import { title } from 'process';
import { DBConfig } from '../Utils/DBConfig';
import path from "path";


const News = {
    title: 'Mây giống đĩa bay trên ngọn núi chứa chan',
    date: 'Thứ ba, 3/12/2024, 17:30 (GMT+7)',
    dicription:
        'Đồng Nai - Những đám mây bao trùm trên đỉnh núi Chứa Chan như hình đĩa bay khiến nhiều người dân thích thú.',
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
    tagList: [
        { tag: 'Địa lý', link: '#' },
        { tag: 'Khoa học', link: '#' },
        { tag: 'Hiện tượng siêu nhiên', link: '#' },
    ],
    category: 'Khoa học',
    subcategory: 'Khoa học trong nước',
    writer: 'Pham Thanh Đạt',
};

const listCardResult = [
    {
        img: 'https://th.bing.com/th/id/R.ca7911324b10651bbbf6733698ddde53?rik=1VZk4kppp9Iw%2fw&pid=ImgRaw&r=0',
        title: 'Mây giống đĩa bay trên ngọn núi chứa chan',
        description:
            'Đồng Nai - Những đám mây bao trùm trên đỉnh núi Chứa Chan như hình đĩa bay khiến nhiều người dân thích thú.',
        date: '10/10/2024',
        tagTitle: 'Khoa học',
        tagDescription: 'Khoa học trong nước',
        tagList: [
            { tag: 'Địa lý', link: '#' },
            { tag: 'Khoa học', link: '#' },
            { tag: 'Hiện tượng siêu nhiên', link: '#' },
        ],
    },
    {
        img: 'https://th.bing.com/th/id/R.ca7911324b10651bbbf6733698ddde53?rik=1VZk4kppp9Iw%2fw&pid=ImgRaw&r=0',
        title: 'Mây giống đĩa bay trên ngọn núi chứa chan',
        description:
            'Đồng Nai - Những đám mây bao trùm trên đỉnh núi Chứa Chan như hình đĩa bay khiến nhiều người dân thích thú.',
        date: '10/10/2024',
        tagTitle: 'Khoa học',
        tagDescription: 'Khoa học trong nước',
        tagList: [
            { tag: 'Địa lý', link: '#' },
            { tag: 'Khoa học', link: '#' },
            { tag: 'Hiện tượng siêu nhiên', link: '#' },
            { tag: 'Viễn tưởng', link: '#' },
            { tag: 'Tâm linh', link: '#' },
        ],
    },
    {
        img: 'https://th.bing.com/th/id/R.ca7911324b10651bbbf6733698ddde53?rik=1VZk4kppp9Iw%2fw&pid=ImgRaw&r=0',
        title: 'Mây giống đĩa bay trên ngọn núi chứa chan',
        description:
            'Đồng Nai - Những đám mây bao trùm trên đỉnh núi Chứa Chan như hình đĩa bay khiến nhiều người dân thích thú.',
        date: '10/10/2024',
        tagTitle: 'Khoa học',
        tagDescription: 'Khoa học trong nước',
        tagList: [
            { tag: 'Địa lý', link: '#' },
            { tag: 'Khoa học', link: '#' },
            { tag: 'Hiện tượng siêu nhiên', link: '#' },
        ],
    },
    {
        img: 'https://th.bing.com/th/id/R.ca7911324b10651bbbf6733698ddde53?rik=1VZk4kppp9Iw%2fw&pid=ImgRaw&r=0',
        title: 'Mây giống đĩa bay trên ngọn núi chứa chan',
        description:
            'Đồng Nai - Những đám mây bao trùm trên đỉnh núi Chứa Chan như hình đĩa bay khiến nhiều người dân thích thú.',
        date: '10/10/2024',
        tagTitle: 'Khoa học',
        tagDescription: 'Khoa học trong nước',
        tagList: [
            { tag: 'Địa lý', link: '#' },
            { tag: 'Khoa học', link: '#' },
            { tag: 'Hiện tượng siêu nhiên', link: '#' },
            { tag: 'Viễn tưởng', link: '#' },
            { tag: 'Tâm linh', link: '#' },
        ],
    },
];

const listCategories = [
    {
        id: 1,
        name: 'Khoa học',
        SubCategories: [
            { id: 1, name: 'Khoa học trong nước' },
            { id: 2, name: 'Khoa học quốc tế' },
            { id: 3, name: 'Khoa học vũ trụ' },
            { id: 4, name: 'Khoa học tự nhiên' },
            { id: 5, name: 'Khoa học xã hội' },
        ],
    },
    {
        id: 2,
        name: 'Kinh doanh',
        SubCategories: [
            { id: 1, name: 'Kinh doanh trong nước' },
            { id: 2, name: 'Kinh doanh quốc tế' },
            { id: 3, name: 'Kinh doanh vũ trụ' },
            { id: 4, name: 'Kinh doanh tự nhiên' },
            { id: 5, name: 'Kinh doanh xã hội' },
        ],
    },
    {
        id: 3,
        name: 'Giải trí',
        SubCategories: [
            { id: 1, name: 'Giải trí trong nước' },
            { id: 2, name: 'Giải trí quốc tế' },
            { id: 3, name: 'Giải trí vũ trụ' },
            { id: 4, name: 'Giải trí tự nhiên' },
            { id: 5, name: 'Giải trí xã hội' },
        ],
    },
    {
        id: 4,
        name: 'Thể thao',
        SubCategories: [
            { id: 1, name: 'Thể thao trong nước' },
            { id: 2, name: 'Thể thao quốc tế' },
            { id: 3, name: 'Thể thao vũ trụ' },
            { id: 4, name: 'Thể thao tự nhiên' },
            { id: 5, name: 'Thể thao xã hội' },
        ],
    },
];

const topNews = {
    img: 'https://i1-vnexpress.vnecdn.net/2024/11/13/bao-9731-1731466141.jpg?w=680&h=0&q=100&dpr=1&fit=crop&s=-B1swA7YvV95zbdjBJPBMA',
    title: 'Bão số 9 đổ bộ vào miền Trung',
    description:
        'Bão số 9 đổ bộ vào miền Trung vào chiều ngay 13/11, gây mưa to, gió lớn và sóng biển cao.',
    date: '15/10/2024',
    tagTitle: 'Thời sự',
    tagDescription: 'Thời sự trong nước',
    tagList: [
        { tag: 'Bão', link: '#' },
        { tag: 'Thời tiết', link: '#' },
        { tag: 'Miền Trung', link: '#' },
    ],
};

function getFirstTwoTags(data: { tagList: { tag: string; link: string }[] }[]) {
    return data.map(item => {
        item.tagList = item.tagList.slice(0, 2);
        return item;
    });
}

export class ArticleController {
    // /home
    getHome(req: Request, res: Response) {
        const top_articles = [];
        for (let i = 0; i < 7; i++) {
            top_articles.push({
                img: '../logo.jpg',
                category: 'business',
                date: '01/01/2045',
                title: 'Lorem ipsum dolor sit amet elit...',
            });
        }
        const view_articles = [];
        for (let i = 0; i < 10; i++) {
            view_articles.push({
                img: '../logo.jpg',
                category: 'business',
                date: '01/01/2045',
                title: i + 1,
            });
        }
        const category_articles = [];
        for (let i = 0; i < 10; i++) {
            category_articles.push({
                img: '../logo.jpg',
                category: 'business',
                date: '01/01/2045',
                title: 'Lorem ipsum dolor sit amet elit...',
            });
        }
        const latest_articles = [];
        for (let i = 0; i < 10; i++) {
            latest_articles.push({
                img: '../logo.jpg',
                category: 'business',
                date: '01/01/2045',
                author: 'John Doe',
                viewCount: 100,
                commentCount: 10,
                title: 'Lorem ipsum dolor sit amet elit...',
                abstract:
                    'Dolor lorem eos dolor duo et eirmod sea. Dolor sit magna rebum clita rebum dolor stet amet justo',
            });
        }
        res.render('Home/HomeView', {
            customCss: ['HomePage.css'],
            customJs: ['HomeView.js'],
            top_articles,
            view_articles,
            latest_articles,
            category_articles
        });
    }

    // /category/:id?page=
    getArticleListByCategory(req: Request, res: Response) {
        const categoryId = req.params.id;
        const page = (req.query.page as string) || '0';
        // console.log(categoryId);
        // console.log(page);
        res.render('Home/HomeGuestCategories', {
            customCss: [
                'Category.css',
                'News.css',
                'Home.css',
                'Component.css',
            ],
            categories: listCategories[Number(categoryId) - 1].SubCategories,
            name: listCategories[Number(categoryId) - 1].name,

            newsOfCategory: getFirstTwoTags(listCardResult),
            topNews,
        });
    }

    // /category/subcategory/:id?page=
    getArticleListBySubCategory(req: Request, res: Response) {
        const categoryName = req.params.category;
        const subCategoryId = req.params.id;
        const page = (req.query.page as string) || '0';
        console.log(subCategoryId);
        console.log(page);

        //tìm trong datebase các category có name = categoryName
        // const idCategory = listCategories.find(category => category.name === categoryName)?.id;
        const idCategory = 1;
        res.render('Home/HomeGuestSubCategories', {
            customCss: [
                'Category.css',
                'News.css',
                'Home.css',
                'Component.css',
            ],
            categories: listCategories[Number(idCategory) - 1].SubCategories,
            nameCategory: categoryName,
            subCategoryId: Number(subCategoryId),

            newsOfCategory: getFirstTwoTags(listCardResult),
            topNews,
        });
    }

    // /tags?tag=&page=
    getArticleListByTags(req: Request, res: Response) {
        const tags = req.query.tag as string[];
        const page = (req.query.page as string) || '0';
        console.log(tags);
        console.log(page);
        res.render('Home/HomeGuestTag', {
            customCss: ['Home.css', 'News.css', 'Component.css'],
            listCardResult,
            tags,
        });
    }

    // /article/:id
    async getArticle(req: Request, res: Response) {
        const articleId = req.params.id;
        console.log(articleId);
        const data = await DBConfig("ARTICLE").where({'ArticleID': articleId}).first();
        if (!data) {
            res.redirect("/404");
            return;
        }
        let category = await DBConfig("ARTICLE_SUBCATEGORY")
            .join("SUBCATEGORY",'ARTICLE_SUBCATEGORY.SubCategoryID', '=', 'SUBCATEGORY.SubCategoryID')
            .join("CATEGORY", "CATEGORY.CategoryID", "=", "SUBCATEGORY.CategoryID")
            .where({'ArticleID': articleId})
            .select("ARTICLE_SUBCATEGORY.SubCategoryID as id",
                "CATEGORY.Name as categoryName",
                "SUBCATEGORY.Name as subcategoryName",
                "CATEGORY.CategoryID as categoryId",
                "SUBCATEGORY.SubCategoryID as subcategoryId",
                DBConfig.raw("CONCAT(CATEGORY.Name, \" / \", SUBCATEGORY.Name) as fullname")).first();
        category = category ? category : {id: 0, fullname: "", categoryName: "",
            subcategoryName: "", categoryId: "", subcategoryId: ""};
        let bgURL = await DBConfig("ARTICLE_URL")
            .where({STT: 0, ArticleID: articleId}).first();
        bgURL = bgURL ? bgURL : {URL: "null"};
        let tag = await DBConfig("TAG")
            .join('ARTICLE_TAG', 'ARTICLE_TAG.TagID','=', 'TAG.TagID')
            .where({'ArticleID': articleId})
            .select("Name as name", "TAG.TagID as id");
        tag = tag ? tag : [];

        let relativeNews = await DBConfig("ARTICLE")
            .join("ARTICLE_SUBCATEGORY",'ARTICLE_SUBCATEGORY.ArticleID', '=', 'ARTICLE.ArticleID')
            .where("ARTICLE.ArticleID", "!=", articleId)
            .where('CATEGORY.CategoryID',"=", category.categoryId)
            .join("SUBCATEGORY",'ARTICLE_SUBCATEGORY.SubCategoryID', '=', 'SUBCATEGORY.SubCategoryID')
            .join("CATEGORY", "CATEGORY.CategoryID", "=", "SUBCATEGORY.CategoryID")
            .join("ARTICLE_URL","ARTICLE_URL.ArticleID", "=","ARTICLE.ArticleID")
            .where("STT", "=", "0").orderByRaw('RAND()')
            .select("ARTICLE.ArticleID", "Title","DatePosted",
                "Abstract","IsPremium", "ViewCount",
                "CATEGORY.Name as category",
                "SUBCATEGORY.Name as subcategory",
                "CATEGORY.CategoryID as categoryId",
                "SUBCATEGORY.SubCategoryID as subcategoryId", "URL")
            .limit(5);

        for (let i = 0; i < relativeNews.length;i++) {
            relativeNews[i].tags =  await DBConfig("TAG")
                .join('ARTICLE_TAG', 'ARTICLE_TAG.TagID','=', 'TAG.TagID')
                .where({'ArticleID': relativeNews[i].ArticleID})
                .select("Name as name", "TAG.TagID as id")
        }

        const commentList = await DBConfig("COMMENT").where({
            ArticleId: articleId
        }).orderBy("DatePosted", "desc");

        res.render("Home/HomeGuestNews", {
            customCss: ["Home.css", "News.css", "Component.css"],
            data: {
                ID: articleId,
                Title: data.Title,
                DatePosted: data.DatePosted,
                Content: data.Content,
                Abstract: data.Abstract,
                IsPremium: data.IsPremium,
                BackgroundImage: bgURL.URL.replace("Static",""),
                BackgroundImageFileName: path.basename(bgURL.URL),
                category: category.categoryName,
                subcategory: category.subcategoryName,
                categoryId: category.categoryId,
                subcategoryId: category.subcategoryId,
                tags: tag,
                relativeNews: relativeNews,
                comments: commentList
            }
        });
    }

    // /search?q=&page=
    async searchArticle(req: Request, res: Response) {
        const searchValue = (req.query.q as string) || '';
        const page = (req.query.page as string) || '0';
        console.log(searchValue);
        console.log(page);

        let relativeNews = await DBConfig("ARTICLE")
            .whereRaw('MATCH(Title, Content, Abstract) AGAINST(? IN NATURAL LANGUAGE MODE)', [searchValue])
            .join("ARTICLE_SUBCATEGORY",'ARTICLE_SUBCATEGORY.ArticleID', '=', 'ARTICLE.ArticleID')
            .join("SUBCATEGORY",'ARTICLE_SUBCATEGORY.SubCategoryID', '=', 'SUBCATEGORY.SubCategoryID')
            .join("CATEGORY", "CATEGORY.CategoryID", "=", "SUBCATEGORY.CategoryID")
            .join("ARTICLE_URL","ARTICLE_URL.ArticleID", "=","ARTICLE.ArticleID")
            .where("STT", "=", "0").orderBy('DatePosted', "desc")
            .select("ARTICLE.ArticleID", "Title","DatePosted",
                "Abstract","IsPremium", "ViewCount",
                "CATEGORY.Name as category",
                "SUBCATEGORY.Name as subcategory",
                "CATEGORY.CategoryID as categoryId",
                "SUBCATEGORY.SubCategoryID as subcategoryId","Content", "URL");

        res.render('Home/HomeGuestSearch', {
            customCss: ['Home.css', 'News.css', 'Component.css'],
            result: relativeNews,
            searchValue: searchValue
        });
    }

    // /download/:id
    downloadArticle(req: Request, res: Response) {
        let articleId = req.params.id;
        console.log(articleId);
    }

    // /comment
    async commentArticle(req: Request, res: Response) {
        let date = new Date(Date.now());
        console.log(req.body);
        await DBConfig("COMMENT").insert({
            ArticleId: req.body.id,
            Content: req.body.content,
            DatePosted: date
        });
        /*
        res.json({
            ArticleId: req.body.id,
            Content: req.body.content,
            DatePosted: date
        });
         */
        const referer = req.get('Referer') || '/'; 
        res.redirect(referer);
    }
}
