import { Response, Request } from "express";

export class GuestController {

    // /search
    getArticles(req: Request, res: Response) {
        // Dữ liệu cho listCardResult
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

        // Render với Handlebars và truyền listCardResult vào view
        res.render('Home/HomeGuestSearch', { listCardResult });
    }
}
