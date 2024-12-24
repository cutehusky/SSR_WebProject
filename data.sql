-- Thêm dữ liệu vào bảng CATEGORY
INSERT INTO CATEGORY (Name)
VALUES 
('Công nghệ'), 
('Sức khỏe'), 
('Phong cách sống'), 
('Giáo dục'), 
('Kinh doanh'), 
('Giải trí'), 
('Thể thao');

-- Thêm dữ liệu vào bảng SUBCATEGORY
INSERT INTO SUBCATEGORY (Name, CategoryID)
VALUES 
-- Công nghệ
('Trí tuệ nhân tạo', 1), 
('Thiết bị công nghệ', 1), 
('Phần mềm', 1), 
('Bảo mật thông tin', 1),
-- Sức khỏe
('Thể dục', 2), 
('Dinh dưỡng', 2), 
('Chăm sóc tinh thần', 2), 
('Bệnh lý phổ biến', 2),
-- Phong cách sống
('Du lịch', 3), 
('Thời trang', 3), 
('Ẩm thực', 3), 
('Nội thất', 3),
-- Giáo dục
('Học trực tuyến', 4), 
('Sách và tài liệu', 4), 
('Kỹ năng mềm', 4), 
('Khóa học chuyên ngành', 4),
-- Kinh doanh
('Khởi nghiệp', 5), 
('Đầu tư', 5), 
('Quản lý doanh nghiệp', 5), 
('Thương mại điện tử', 5),
-- Giải trí
('Phim ảnh', 6), 
('Âm nhạc', 6), 
('Trò chơi', 6), 
('Sách truyện', 6),
-- Thể thao
('Bóng đá', 7), 
('Bóng rổ', 7), 
('Thể thao điện tử', 7), 
('Chạy bộ', 7);
-- Thêm dữ liệu vào bảng TAG
INSERT INTO TAG (Name)
VALUES
-- Liên quan đến Công nghệ
('Trí tuệ nhân tạo'), 
('Blockchain'), 
('Điện toán đám mây'), 
('An ninh mạng'),
-- Liên quan đến Sức khỏe
('Tập thể dục'), 
('Yoga'), 
('Ăn uống lành mạnh'), 
('Sức khỏe tinh thần'),
-- Liên quan đến Phong cách sống
('Du lịch'), 
('Thời trang'), 
('Ẩm thực'), 
('Trang trí nhà cửa'),
-- Liên quan đến Giáo dục
('Học trực tuyến'), 
('Sách'), 
('Kỹ năng mềm'), 
('Khóa học chuyên ngành'),
-- Liên quan đến Kinh doanh
('Khởi nghiệp'), 
('Đầu tư'), 
('Thương mại điện tử'), 
('Quản lý kinh doanh'),
-- Liên quan đến Giải trí
('Phim ảnh'), 
('Âm nhạc'), 
('Trò chơi điện tử'), 
('Tiểu thuyết'),
-- Liên quan đến Thể thao
('Bóng đá'), 
('Bóng rổ'), 
('Thể thao điện tử'), 
('Chạy bộ'),
-- Các chủ đề khác
('Môi trường'), 
('Xu hướng công nghệ'), 
('Mẹo sức khỏe'), 
('Cải thiện bản thân'), 
('Tư vấn tài chính');
