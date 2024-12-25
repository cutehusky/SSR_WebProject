USE NEWSPAPER;

-- Thêm người dùng
INSERT INTO USER (FullName, Email, Password, DoB, isAdministator, Role) VALUES
('Admin User', 'admin@example.com', '$2a$10$jIPpVGYpq7FsIFDri1O3IunSyAz/Kod4Y9BzdiG3lzIELF1qgH8vK', '1980-01-01', 1, 'Admin'),
('John Writer', 'writer@example.com', '$2a$10$jIPpVGYpq7FsIFDri1O3IunSyAz/Kod4Y9BzdiG3lzIELF1qgH8vK', '1990-05-20', 0, 'Writer'),
('Jane Editor', 'editor@example.com', '$2a$10$jIPpVGYpq7FsIFDri1O3IunSyAz/Kod4Y9BzdiG3lzIELF1qgH8vK', '1985-08-15', 0, 'Editor'),
('Alice Subscriber', 'subscriber@example.com', '$2a$10$jIPpVGYpq7FsIFDri1O3IunSyAz/Kod4Y9BzdiG3lzIELF1qgH8vK', '1995-12-10', 0, 'Subcriber');

-- Thêm subscriber
INSERT INTO SUBSCRIBER (SubscriberID, DateExpired) VALUES
(4, '2025-12-31');

-- Thêm writer
INSERT INTO WRITER (WriterID, Alias) VALUES
(2, 'JWriter');

-- Thêm editor
INSERT INTO EDITOR (EditorID) VALUES
(3);

-- Thêm danh mục (Category)
INSERT INTO CATEGORY (Name) VALUES
('Technology'),
('Health'),
('Entertainment');

-- Thêm danh mục con (SubCategory)
INSERT INTO SUBCATEGORY (Name, CategoryID) VALUES
('Artificial Intelligence', 1),
('Nutrition', 2),
('Movies', 3);

-- Thêm bài viết (Article)
INSERT INTO ARTICLE (Title, DatePublished, DatePosted, Content, Abstract, Status, Reason, IsPremium, ViewCount, EditorID, WriterID) VALUES
('Introduction to AI', '2024-12-01 10:00:00', '2024-11-30 15:00:00', 'Content about AI...', 'Summary about AI...', 'Published', NULL, 1, 100, 3, 2),
('Healthy Eating Habits', '2024-11-25 12:00:00', '2024-11-24 18:00:00', 'Content about healthy eating...', 'Summary about eating...', 'Published', NULL, 0, 200, 3, 2),
('Top 10 Movies of 2024', '2024-12-10 08:00:00', '2024-12-09 14:00:00', 'Content about movies...', 'Summary about movies...', 'Pending', NULL, 0, 50, NULL, 2);

-- Thêm subcategory cho bài viết (Article_SubCategory)
INSERT INTO ARTICLE_SUBCATEGORY (ArticleID, SubCategoryID) VALUES
(1, 1),
(2, 2),
(3, 3);

-- Thêm tag
INSERT INTO TAG (Name) VALUES
('AI'),
('Health'),
('Entertainment');

-- Thêm tag cho bài viết (Article_Tag)
INSERT INTO ARTICLE_TAG (ArticleID, TagID) VALUES
(1, 1),
(2, 2),
(3, 3);

-- Thêm URL bài viết (Article_URL)
INSERT INTO ARTICLE_URL (ArticleID, STT, URL) VALUES
(1, 1, 'https://example.com/articles/ai'),
(2, 1, 'https://example.com/articles/health-eating'),
(3, 1, 'https://example.com/articles/movies-2024');

-- Thêm comment
INSERT INTO COMMENT (DatePosted, Content, ArticleID, SubscriberID) VALUES
('2024-12-01 11:00:00', 'Great article about AI!', 1, 4),
('2024-11-25 12:30:00', 'Helpful tips on healthy eating!', 2, 4);
