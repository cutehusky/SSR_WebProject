-- MySQL dump 10.13  Distrib 8.0.40, for Win64 (x86_64)
--
-- Host: localhost    Database: newspaper
-- ------------------------------------------------------
-- Server version	9.1.0

-- create database newspaper;
use newspaper;

/*!40101 SET @OLD_CHARACTER_SET_CLIENT=@@CHARACTER_SET_CLIENT */;
/*!40101 SET @OLD_CHARACTER_SET_RESULTS=@@CHARACTER_SET_RESULTS */;
/*!40101 SET @OLD_COLLATION_CONNECTION=@@COLLATION_CONNECTION */;
/*!50503 SET NAMES utf8 */;
/*!40103 SET @OLD_TIME_ZONE=@@TIME_ZONE */;
/*!40103 SET TIME_ZONE='+00:00' */;
/*!40014 SET @OLD_UNIQUE_CHECKS=@@UNIQUE_CHECKS, UNIQUE_CHECKS=0 */;
/*!40014 SET @OLD_FOREIGN_KEY_CHECKS=@@FOREIGN_KEY_CHECKS, FOREIGN_KEY_CHECKS=0 */;
/*!40101 SET @OLD_SQL_MODE=@@SQL_MODE, SQL_MODE='NO_AUTO_VALUE_ON_ZERO' */;
/*!40111 SET @OLD_SQL_NOTES=@@SQL_NOTES, SQL_NOTES=0 */;

--
-- Table structure for table `article`
--

DROP TABLE IF EXISTS `article`;
/*!40101 SET @saved_cs_client     = @@character_set_client */;
/*!50503 SET character_set_client = utf8mb4 */;
CREATE TABLE `article` (
  `ArticleID` int NOT NULL AUTO_INCREMENT,
  `Title` varchar(255) CHARACTER SET utf8mb3 COLLATE utf8mb3_unicode_ci DEFAULT NULL,
  `DatePublished` datetime DEFAULT NULL,
  `DatePosted` datetime DEFAULT NULL,
  `Content` longtext CHARACTER SET utf8mb3 COLLATE utf8mb3_unicode_ci,
  `Abstract` tinytext CHARACTER SET utf8mb3 COLLATE utf8mb3_unicode_ci,
  `Status` char(10) DEFAULT NULL,
  `Reason` tinytext CHARACTER SET utf8mb3 COLLATE utf8mb3_unicode_ci,
  `IsPremium` int DEFAULT '0',
  `ViewCount` int DEFAULT '0',
  `EditorID` int DEFAULT NULL,
  `WriterID` int DEFAULT NULL,
  PRIMARY KEY (`ArticleID`),
  KEY `FK_ARTICLE_EDITOR` (`EditorID`),
  KEY `FK_ARTICLE_WRITER` (`WriterID`),
  CONSTRAINT `FK_ARTICLE_EDITOR` FOREIGN KEY (`EditorID`) REFERENCES `editor` (`EditorID`) ON DELETE SET NULL,
  CONSTRAINT `FK_ARTICLE_WRITER` FOREIGN KEY (`WriterID`) REFERENCES `writer` (`WriterID`) ON DELETE SET NULL,
  CONSTRAINT `article_chk_1` CHECK ((`Status` in (_utf8mb4'Draft',_utf8mb4'Rejected',_utf8mb4'Approved',_utf8mb4'Published'))),
  CONSTRAINT `article_chk_2` CHECK ((`IsPremium` in (0,1))),
  CONSTRAINT `article_chk_3` CHECK ((`ViewCount` >= 0))
) ENGINE=InnoDB AUTO_INCREMENT=3 DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_0900_ai_ci;
/*!40101 SET character_set_client = @saved_cs_client */;

--
-- Dumping data for table `article`
--

LOCK TABLES `article` WRITE;
/*!40000 ALTER TABLE `article` DISABLE KEYS */;
INSERT INTO `article` VALUES (1,'Việt Nam vào top 50 số công bố quốc tế ba năm liên tiếp',NULL,'2024-12-26 13:51:32','<p class=\"description\" style=\"margin-bottom: 15px; text-rendering: optimizelegibility; font-size: 18px; line-height: 28.8px;\">Theo bảng xếp hạng Journal &amp; Country Rank của SCImago, Việt Nam đứng thứ 46/233 quốc gia và vùng lãnh thổ được xếp hạng với 18.551 bài báo đã công bố.</p><article class=\"fck_detail \" style=\"text-rendering: optimizelegibility; width: 634px; float: left; position: relative; font-variant-numeric: normal; font-variant-east-asian: normal; font-variant-alternates: normal; font-size-adjust: none; font-kerning: auto; font-optical-sizing: auto; font-feature-settings: normal; font-variation-settings: normal; font-variant-position: normal; font-variant-emoji: normal; font-stretch: normal; font-size: 18px; line-height: 28.8px; font-family: arial; color: rgb(34, 34, 34);\"><p class=\"Normal\" style=\"margin-bottom: 1em; text-rendering: optimizespeed; line-height: 28.8px; font-size: 18px; background-color: rgb(252, 250, 246);\">Công bố thống kê số bài báo quốc tế năm 2022 được SCImago, tổ chức chuyên cung cấp thông tin về chất lượng nghiên cứu khoa học của các quốc gia, trụ sở tại Tây Ban Nha, đưa ra hồi đầu tháng 5. Trong khu vực, Việt Nam xếp sau Malaysia (thứ 23), Indonesia (thứ 25), Thái Lan (thứ 35) và Singapore (thứ 36). Ba quốc gia dẫn đầu gồm Trung Quốc, Mỹ và Ấn Độ. Trong đó, Trung Quốc có hơn 1 triệu công bố, gấp 1,4 lần so với Mỹ và 3,6 lần so với Ấn Độ.</p><p class=\"Normal\" style=\"margin-bottom: 1em; text-rendering: optimizespeed; line-height: 28.8px; font-size: 18px; background-color: rgb(252, 250, 246);\">Chia sẻ với<em style=\"text-rendering: optimizelegibility;\">&nbsp;VnExpress</em>, một số nhà khoa học nhìn nhận Việt Nam duy trì thứ hạng thuộc top 50 suốt ba năm liên tiếp với số công bố quốc tế ở mức hơn 18.000 không phải con số thấp.</p><p class=\"Normal\" style=\"margin-bottom: 1em; text-rendering: optimizespeed; line-height: 28.8px; font-size: 18px; background-color: rgb(252, 250, 246);\">TS Lê Duy Tân, Đại học Quốc tế, ĐHQG TP HCM, cho biết số công bố này chỉ bằng 1,84% của Trung Quốc (1.009.891 bài) và 2,63% của Mỹ (702.840 bài). \"Song thú vị ở chỗ, chỉ số trích dẫn theo từng bài nghiên cứu (Citations per document) của Việt Nam (1.22) cao hơn Trung Quốc (1.12) và Mỹ (1.05)\", TS Tân nói.</p><p class=\"Normal\" style=\"margin-bottom: 1em; text-rendering: optimizespeed; line-height: 28.8px; font-size: 18px; background-color: rgb(252, 250, 246);\">TS Phạm Hiệp, trưởng nhóm nghiên cứu Đổi mới giáo dục Reduvation, Trường ĐH Thành Đô, đồng trưởng nhóm nghiên cứu Khoa học giáo dục và Chính sách, Trường ĐH Giáo dục, ĐHQG Hà Nội, cho biết xét về số lượng công bố quốc tế ở từng giai đoạn cho thấy năng lực nghiên cứu khoa học của Việt Nam vẫn thuộc nhóm tăng trưởng nhanh.</p><p class=\"Normal\" style=\"margin-bottom: 1em; text-rendering: optimizespeed; line-height: 28.8px; font-size: 18px; background-color: rgb(252, 250, 246);\">Theo TS Hiệp, cách đây 5-10 năm số công bố quốc tế của Việt Nam chỉ khoảng 1/5 so với hiện nay, tăng trong khoảng từ năm 2012-2015 và tăng mạnh trong giai đoạn 2017-2020. Các lĩnh vực ở top cao thường là vật lý, toán học, khoa học máy tính, vật liệu hay kinh tế kinh doanh, trong một số phân ngành hẹp, Việt Nam cũng có một số ngành (tùy năm) đứng thứ 30. \"Điều này phản ánh đúng sự vận động của cộng đồng học thuật Việt Nam trong khoảng chục năm vừa qua\", anh nói.</p><div bis_skin_checked=\"1\" style=\"text-rendering: optimizelegibility; font-size: 18px; background-color: rgb(252, 250, 246); text-align: center; width: 634px;\"><div bis_skin_checked=\"1\" style=\"text-rendering: optimizelegibility; width: 634px;\"><div id=\"chart-6105\" data-component=\"true\" data-component-value=\"6105\" bis_skin_checked=\"1\" class=\"width_common mb20 fullscreen-inner\" data-highcharts-chart=\"0\" style=\"text-rendering: optimizelegibility; width: 634px; float: left; overflow: hidden; margin-bottom: 20px !important;\"><div id=\"highcharts-bcyssjl-0\" dir=\"ltr\" class=\"highcharts-container \" bis_skin_checked=\"1\" style=\"text-rendering: optimizelegibility; position: relative; overflow: hidden; width: 634px; height: 400px; text-align: left; line-height: normal; z-index: 0; -webkit-tap-highlight-color: rgba(0, 0, 0, 0); font-family: Arial; color: rgb(51, 51, 51); font-size: 12px;\"><svg version=\"1.1\" class=\"highcharts-root\" style=\"font-size: 12px; fill: rgb(51, 51, 51);\" xmlns=\"http://www.w3.org/2000/svg\" width=\"634\" height=\"400\" viewBox=\"0 0 634 400\"><defs><clipPath id=\"highcharts-bcyssjl-1-\"><rect x=\"0\" y=\"0\" width=\"592\" height=\"320\" fill=\"none\"></rect></clipPath><clipPath id=\"highcharts-bcyssjl-11-\"><rect x=\"0\" y=\"0\" width=\"592\" height=\"320\" fill=\"none\"></rect></clipPath></defs><rect fill=\"#ffffff\" class=\"highcharts-background\" x=\"0\" y=\"0\" width=\"634\" height=\"400\" rx=\"0\" ry=\"0\"></rect><rect fill=\"none\" class=\"highcharts-plot-background\" x=\"42\" y=\"45\" width=\"592\" height=\"320\"></rect><g class=\"highcharts-pane-group\" data-z-index=\"0\"></g><g class=\"highcharts-grid highcharts-xaxis-grid\" data-z-index=\"1\"><path fill=\"none\" data-z-index=\"1\" class=\"highcharts-grid-line\" d=\"M 47.5 45 L 47.5 365\" opacity=\"1\"></path><path fill=\"none\" data-z-index=\"1\" class=\"highcharts-grid-line\" d=\"M 119.5 45 L 119.5 365\" opacity=\"1\"></path><path fill=\"none\" data-z-index=\"1\" class=\"highcharts-grid-line\" d=\"M 192.5 45 L 192.5 365\" opacity=\"1\"></path><path fill=\"none\" data-z-index=\"1\" class=\"highcharts-grid-line\" d=\"M 264.5 45 L 264.5 365\" opacity=\"1\"></path><path fill=\"none\" data-z-index=\"1\" class=\"highcharts-grid-line\" d=\"M 337.5 45 L 337.5 365\" opacity=\"1\"></path><path fill=\"none\" data-z-index=\"1\" class=\"highcharts-grid-line\" d=\"M 410.5 45 L 410.5 365\" opacity=\"1\"></path><path fill=\"none\" data-z-index=\"1\" class=\"highcharts-grid-line\" d=\"M 482.5 45 L 482.5 365\" opacity=\"1\"></path><path fill=\"none\" data-z-index=\"1\" class=\"highcharts-grid-line\" d=\"M 555.5 45 L 555.5 365\" opacity=\"1\"></path><path fill=\"none\" data-z-index=\"1\" class=\"highcharts-grid-line\" d=\"M 627.5 45 L 627.5 365\" opacity=\"1\"></path></g><g class=\"highcharts-grid highcharts-yaxis-grid\" data-z-index=\"1\"><path fill=\"none\" stroke=\"#e6e6e6\" stroke-width=\"1\" data-z-index=\"1\" class=\"highcharts-grid-line\" d=\"M 42 365.5 L 634 365.5\" opacity=\"1\"></path><path fill=\"none\" stroke=\"#e6e6e6\" stroke-width=\"1\" data-z-index=\"1\" class=\"highcharts-grid-line\" d=\"M 42 319.5 L 634 319.5\" opacity=\"1\"></path><path fill=\"none\" stroke=\"#e6e6e6\" stroke-width=\"1\" data-z-index=\"1\" class=\"highcharts-grid-line\" d=\"M 42 274.5 L 634 274.5\" opacity=\"1\"></path><path fill=\"none\" stroke=\"#e6e6e6\" stroke-width=\"1\" data-z-index=\"1\" class=\"highcharts-grid-line\" d=\"M 42 228.5 L 634 228.5\" opacity=\"1\"></path><path fill=\"none\" stroke=\"#e6e6e6\" stroke-width=\"1\" data-z-index=\"1\" class=\"highcharts-grid-line\" d=\"M 42 182.5 L 634 182.5\" opacity=\"1\"></path><path fill=\"none\" stroke=\"#e6e6e6\" stroke-width=\"1\" data-z-index=\"1\" class=\"highcharts-grid-line\" d=\"M 42 136.5 L 634 136.5\" opacity=\"1\"></path><path fill=\"none\" stroke=\"#e6e6e6\" stroke-width=\"1\" data-z-index=\"1\" class=\"highcharts-grid-line\" d=\"M 42 91.5 L 634 91.5\" opacity=\"1\"></path><path fill=\"none\" stroke=\"#e6e6e6\" stroke-width=\"1\" data-z-index=\"1\" class=\"highcharts-grid-line\" d=\"M 42 44.5 L 634 44.5\" opacity=\"1\"></path></g><rect fill=\"none\" class=\"highcharts-plot-border\" data-z-index=\"1\" x=\"42\" y=\"45\" width=\"592\" height=\"320\"></rect><g class=\"highcharts-axis highcharts-xaxis\" data-z-index=\"2\"><path fill=\"none\" class=\"highcharts-tick\" stroke=\"#ccd6eb\" stroke-width=\"1\" d=\"M 47.5 365 L 47.5 375\" opacity=\"1\"></path><path fill=\"none\" class=\"highcharts-tick\" stroke=\"#ccd6eb\" stroke-width=\"1\" d=\"M 119.5 365 L 119.5 375\" opacity=\"1\"></path><path fill=\"none\" class=\"highcharts-tick\" stroke=\"#ccd6eb\" stroke-width=\"1\" d=\"M 192.5 365 L 192.5 375\" opacity=\"1\"></path><path fill=\"none\" class=\"highcharts-tick\" stroke=\"#ccd6eb\" stroke-width=\"1\" d=\"M 264.5 365 L 264.5 375\" opacity=\"1\"></path><path fill=\"none\" class=\"highcharts-tick\" stroke=\"#ccd6eb\" stroke-width=\"1\" d=\"M 337.5 365 L 337.5 375\" opacity=\"1\"></path><path fill=\"none\" class=\"highcharts-tick\" stroke=\"#ccd6eb\" stroke-width=\"1\" d=\"M 410.5 365 L 410.5 375\" opacity=\"1\"></path><path fill=\"none\" class=\"highcharts-tick\" stroke=\"#ccd6eb\" stroke-width=\"1\" d=\"M 482.5 365 L 482.5 375\" opacity=\"1\"></path><path fill=\"none\" class=\"highcharts-tick\" stroke=\"#ccd6eb\" stroke-width=\"1\" d=\"M 555.5 365 L 555.5 375\" opacity=\"1\"></path><path fill=\"none\" class=\"highcharts-tick\" stroke=\"#ccd6eb\" stroke-width=\"1\" d=\"M 627.5 365 L 627.5 375\" opacity=\"1\"></path><path fill=\"none\" class=\"highcharts-axis-line\" stroke=\"#ccd6eb\" stroke-width=\"1\" data-z-index=\"7\" d=\"M 42 365.5 L 634 365.5\"></path></g><g class=\"highcharts-axis highcharts-yaxis\" data-z-index=\"2\"><path fill=\"none\" class=\"highcharts-axis-line\" data-z-index=\"7\" d=\"M 42 45 L 42 365\"></path></g><g class=\"highcharts-series-group\" data-z-index=\"3\"><g data-z-index=\"0.1\" class=\"highcharts-series highcharts-series-0 highcharts-line-series highcharts-color-0\" transform=\"translate(42,45) scale(1 1)\" clip-path=\"url(#highcharts-bcyssjl-11-)\"><path fill=\"none\" d=\"M 5.8039215686223 282.2765714285714 L 78.352941176467 257.8468571428571 L 150.90196078431 241.82857142857142 L 223.45098039216 201.67314285714286 L 296 131.25485714285713 L 368.54901960784 31.195428571428522 L 441.09803921569 30.93942857142855 L 513.64705882353 26.49599999999998\" class=\"highcharts-graph\" data-z-index=\"1\" stroke=\"#7cb5ec\" stroke-width=\"2\" stroke-linejoin=\"round\" stroke-linecap=\"round\"></path><path fill=\"none\" d=\"M -4.1960784313777 282.2765714285714 L 5.8039215686223 282.2765714285714 L 78.352941176467 257.8468571428571 L 150.90196078431 241.82857142857142 L 223.45098039216 201.67314285714286 L 296 131.25485714285713 L 368.54901960784 31.195428571428522 L 441.09803921569 30.93942857142855 L 513.64705882353 26.49599999999998 L 523.64705882353 26.49599999999998\" visibility=\"visible\" data-z-index=\"2\" class=\"highcharts-tracker-line\" stroke-linejoin=\"round\" stroke=\"rgba(192,192,192,0.0001)\" stroke-width=\"22\"></path></g><g data-z-index=\"0.1\" class=\"highcharts-markers highcharts-series-0 highcharts-line-series highcharts-color-0 highcharts-tracker\" transform=\"translate(42,45) scale(1 1)\" clip-path=\"none\"><path fill=\"#7cb5ec\" d=\"M 5 286 A 4 4 0 1 1 5.0039999993333355 285.9999980000002 Z\" opacity=\"1\" class=\"highcharts-point highcharts-color-0\"></path><path fill=\"#7cb5ec\" d=\"M 78 262 A 4 4 0 1 1 78.00399999933333 261.9999980000002 Z\" opacity=\"1\" class=\"highcharts-point highcharts-color-0\"></path><path fill=\"#7cb5ec\" d=\"M 150 246 A 4 4 0 1 1 150.00399999933333 245.99999800000018 Z\" opacity=\"1\" class=\"highcharts-point highcharts-color-0\"></path><path fill=\"#7cb5ec\" d=\"M 223 206 A 4 4 0 1 1 223.00399999933333 205.99999800000018 Z\" opacity=\"1\" class=\"highcharts-point highcharts-color-0\"></path><path fill=\"#7cb5ec\" d=\"M 296 135 A 4 4 0 1 1 296.00399999933336 134.99999800000018 Z\" opacity=\"1\" class=\"highcharts-point highcharts-color-0\"></path><path fill=\"#7cb5ec\" d=\"M 368 35 A 4 4 0 1 1 368.00399999933336 34.99999800000017 Z\" opacity=\"1\" class=\"highcharts-point highcharts-color-0\"></path><path fill=\"#7cb5ec\" d=\"M 441 35 A 4 4 0 1 1 441.00399999933336 34.99999800000017 Z\" opacity=\"1\" class=\"highcharts-point highcharts-color-0\"></path><path fill=\"#7cb5ec\" d=\"M 513 30 A 4 4 0 1 1 513.0039999993334 29.99999800000017 Z\" opacity=\"1\" class=\"highcharts-point highcharts-color-0\"></path></g></g><text x=\"317\" text-anchor=\"middle\" class=\"highcharts-title\" data-z-index=\"4\" style=\"font-size: 18px; fill: rgb(51, 51, 51);\" y=\"24\"><tspan>Công bố quốc tế của Việt Nam giai đoạn 2015-2022</tspan></text><text x=\"317\" text-anchor=\"middle\" class=\"highcharts-subtitle\" data-z-index=\"4\" style=\"color: rgb(102, 102, 102); font-size: 12px; fill: rgb(102, 102, 102);\" y=\"44\"></text><text x=\"0\" text-anchor=\"start\" class=\"highcharts-caption\" data-z-index=\"4\" style=\"color:#666666;fill:#666666;\" y=\"397\"></text><g class=\"highcharts-axis-labels highcharts-xaxis-labels\" data-z-index=\"7\"><text x=\"47.803921568622\" style=\"color:#666666;cursor:default;font-size:11px;fill:#666666;\" text-anchor=\"middle\" transform=\"translate(0,0)\" y=\"384\" opacity=\"1\">2015</text><text x=\"120.35294117647\" style=\"color:#666666;cursor:default;font-size:11px;fill:#666666;\" text-anchor=\"middle\" transform=\"translate(0,0)\" y=\"384\" opacity=\"1\">2016</text><text x=\"192.90196078431\" style=\"color:#666666;cursor:default;font-size:11px;fill:#666666;\" text-anchor=\"middle\" transform=\"translate(0,0)\" y=\"384\" opacity=\"1\">2017</text><text x=\"265.45098039216\" style=\"color:#666666;cursor:default;font-size:11px;fill:#666666;\" text-anchor=\"middle\" transform=\"translate(0,0)\" y=\"384\" opacity=\"1\">2018</text><text x=\"338\" style=\"color:#666666;cursor:default;font-size:11px;fill:#666666;\" text-anchor=\"middle\" transform=\"translate(0,0)\" y=\"384\" opacity=\"1\">2019</text><text x=\"410.54901960784\" style=\"color:#666666;cursor:default;font-size:11px;fill:#666666;\" text-anchor=\"middle\" transform=\"translate(0,0)\" y=\"384\" opacity=\"1\">2020</text><text x=\"483.09803921569\" style=\"color:#666666;cursor:default;font-size:11px;fill:#666666;\" text-anchor=\"middle\" transform=\"translate(0,0)\" y=\"384\" opacity=\"1\">2021</text><text x=\"555.64705882353\" style=\"color:#666666;cursor:default;font-size:11px;fill:#666666;\" text-anchor=\"middle\" transform=\"translate(0,0)\" y=\"384\" opacity=\"1\">2022</text><text x=\"621.7578125\" style=\"color:#666666;cursor:default;font-size:11px;fill:#666666;\" text-anchor=\"middle\" transform=\"translate(0,0)\" y=\"384\" opacity=\"1\">2023</text></g><g class=\"highcharts-axis-labels highcharts-yaxis-labels\" data-z-index=\"7\"><text x=\"27\" style=\"color:#666666;cursor:default;font-size:11px;fill:#666666;\" text-anchor=\"end\" transform=\"translate(0,0)\" y=\"370\" opacity=\"1\">2.5k</text><text x=\"27\" style=\"color:#666666;cursor:default;font-size:11px;fill:#666666;\" text-anchor=\"end\" transform=\"translate(0,0)\" y=\"324\" opacity=\"1\">5k</text><text x=\"27\" style=\"color:#666666;cursor:default;font-size:11px;fill:#666666;\" text-anchor=\"end\" transform=\"translate(0,0)\" y=\"279\" opacity=\"1\">7.5k</text><text x=\"27\" style=\"color:#666666;cursor:default;font-size:11px;fill:#666666;\" text-anchor=\"end\" transform=\"translate(0,0)\" y=\"233\" opacity=\"1\">10k</text><text x=\"27\" style=\"color:#666666;cursor:default;font-size:11px;fill:#666666;\" text-anchor=\"end\" transform=\"translate(0,0)\" y=\"187\" opacity=\"1\">12.5k</text><text x=\"27\" style=\"color:#666666;cursor:default;font-size:11px;fill:#666666;\" text-anchor=\"end\" transform=\"translate(0,0)\" y=\"141\" opacity=\"1\">15k</text><text x=\"27\" style=\"color:#666666;cursor:default;font-size:11px;fill:#666666;\" text-anchor=\"end\" transform=\"translate(0,0)\" y=\"96\" opacity=\"1\">17.5k</text><text x=\"27\" style=\"color:#666666;cursor:default;font-size:11px;fill:#666666;\" text-anchor=\"end\" transform=\"translate(0,0)\" y=\"50\" opacity=\"1\">20k</text></g><text x=\"624\" class=\"highcharts-credits\" text-anchor=\"end\" data-z-index=\"8\" style=\"cursor:pointer;color:#999999;fill:#999999;\" y=\"395\">VnExpress</text></svg></div></div></div><p class=\"Normal\" style=\"margin-bottom: 1em; text-rendering: optimizespeed; line-height: 28.8px;\"><strong style=\"text-rendering: optimizelegibility;\">Biểu đồ dựa trên dữ liệu của SCImago về số công bố quốc tế của Việt Nam (2015-2022)</strong></p></div><p class=\"Normal\" style=\"margin-bottom: 1em; text-rendering: optimizespeed; line-height: 28.8px; font-size: 18px; background-color: rgb(252, 250, 246);\">TS Hiệp cho biết, giai đoạn từ năm 2020 đến nay, số công bố quốc tế của Việt Nam bắt đầu chững lại, lượng bài tăng qua các năm không đáng kể. Lý giải về điều này, theo anh việc Việt Nam hụt một lượng bài báo quốc tế đáng kể do hai trường Đại học Tôn Đức Thắng và Duy Tân đóng góp. Anh cho biết cách đây vài năm, hai trường này sử dụng chính sách hợp tác quốc tế tương đối mạnh, nhưng sau đó thay đổi chính sách dẫn tới việc số lượng bài báo quốc tế giảm.</p><p class=\"Normal\" style=\"margin-bottom: 1em; text-rendering: optimizespeed; line-height: 28.8px; font-size: 18px; background-color: rgb(252, 250, 246);\">Tuy nhiên xét tổng chung, số lượng công bố quốc tế của Việt Nam không giảm nhiều. \"Số công bố quốc tế được bù lại bằng nỗ lực của các cơ sở nghiên cứu, trường đại học trong cả nước, các đơn vị có đà tăng trưởng, giữ mức ổn định với mức trên 1.000 bài mỗi năm\", anh cho hay. Theo TS Hiệp, nhiều cơ sở như ĐHQG Hà Nội, ĐHQG TP HCM, Đại học Bách Khoa hay Kinh tế quốc dân, Viện Hàn Lâm khoa học và công nghệ... gần đây đều có những chính sách hỗ trợ công bố quốc tế tốt.</p><p class=\"Normal\" style=\"margin-bottom: 1em; text-rendering: optimizespeed; line-height: 28.8px; font-size: 18px; background-color: rgb(252, 250, 246);\">Anh nhận định, con số hơn 18.000 công bố vẫn cho thấy sự vươn lên mạnh của các trường về tập trung nghiên cứu khoa học và là nền móng tốt cho khoa học. \"Ba năm liền giữ vững trong top 50 cho thấy nền móng chắc chứ không phải lâu đài trên cát\", TS Hiệp nói.</p><p class=\"Normal\" style=\"margin-bottom: 1em; text-rendering: optimizespeed; line-height: 28.8px; font-size: 18px; background-color: rgb(252, 250, 246);\">Còn TS Lê Duy Tân nhìn nhận, bảng xếp hạng của Scimago hiện vẫn chủ yếu là đếm số lượng bài, chưa thể dựa vào đó để đánh giá chất lượng của các công trình nghiên cứu.</p><p class=\"Normal\" style=\"margin-bottom: 1em; text-rendering: optimizespeed; line-height: 28.8px; font-size: 18px; background-color: rgb(252, 250, 246);\">Hiện Quỹ Phát triển khoa học và công nghệ Quốc gia Nafosted, nhiều cơ sở giáo dục đại học như ĐHQG Hà Nội, ĐHQG TP HCM, ĐH Kinh tế TP HCM... gần đây đều có chính sách hỗ trợ công bố quốc tế.</p><p class=\"Normal\" style=\"margin-bottom: 1em; text-rendering: optimizespeed; line-height: 28.8px; font-size: 18px; background-color: rgb(252, 250, 246);\">TS Tân dẫn ví dụ từ ĐHQG TP HCM hàng năm đều có các đề tài cơ sở, đề tài nghiên cứu Khoa học loại A, B, và C với chỉ tiêu đặt ra là các sản phẩm khoa học, bài báo được quy định cụ thể. Chưa kể, nhiều trường đại học còn đặt nhiệm vụ nghiên cứu khoa học thành KPI chi tiết cho giảng viên, đòi hỏi họ phải dành ít nhất 40% thời gian làm việc thực hiện nghiên cứu khoa học. \"Do đó có thể hy vọng rằng nghiên cứu khoa học tại Việt Nam đang chuyển dịch từ tập trung vào số lượng sang chất lượng. Điều này thúc đẩy việc sản xuất nhiều công trình nghiên cứu thiết thực hơn, góp phần hỗ trợ cho sự phát triển của đất nước\", TS Tân nói.</p><p class=\"Normal\" style=\"margin-bottom: 1em; text-rendering: optimizespeed; line-height: 28.8px; font-size: 18px; background-color: rgb(252, 250, 246);\">TS Phạm Hiệp cũng cho rằng đã đến lúc Việt Nam cần phải nghĩ tiếp về con đường phát triển của khoa học. \"Việc chọn đi tiếp theo đuổi về số lượng hay điều chỉnh chính sách để tập trung chất lượng, cần thiết có sự tham gia của các nhà hoạch định chính sách, lãnh đạo các trường đại học\", anh nói.</p><p class=\"Normal\" style=\"margin-bottom: 1em; text-rendering: optimizespeed; line-height: 28.8px; font-size: 18px; background-color: rgb(252, 250, 246);\">SCImago đưa ra thống kê về số công bố quốc tế của các quốc gia và vùng lãnh thổ dựa trên cơ sở dữ liệu Scopus của nhà xuất bản Elsevier. Bảng xếp hạng SCImago bắt đầu từ năm 1996 và được công bố mỗi năm một lần. Hoạt động với mục tiêu cung cấp thông tin về chất lượng nghiên cứu khoa học của các quốc gia, các cơ sở nghiên cứu, mức độ uy tín của các tạp chí.</p><div><br></div></article>','Theo bảng xếp hạng Journal & Country Rank của SCImago, Việt Nam đứng thứ 46/233 quốc gia và vùng lãnh thổ được xếp hạng với 18.551 bài báo đã công bố.','Draft',NULL,0,0,NULL,2),(2,'Lịch thi đánh giá năng lực Đại học Quốc gia TP HCM năm 2025',NULL,'2024-12-26 13:55:24','<p class=\"description\" style=\"margin-bottom: 15px; text-rendering: optimizelegibility; line-height: 28.8px;\">Kỳ thi đánh giá năng lực của Đại học Quốc gia TP HCM sẽ được tổ chức hai đợt vào cuối tháng 3 và đầu tháng 6/2025.</p><p class=\"description\" style=\"margin-bottom: 15px; text-rendering: optimizelegibility; line-height: 28.8px;\"><br></p><p class=\"description\" style=\"margin-bottom: 15px; text-rendering: optimizelegibility; line-height: 28.8px;\">Thông tin được ông Nguyễn Quốc Chính, Giám đốc Trung tâm Khảo thí và Đảm bảo chất lượng, Đại học Quốc gia TP HCM, công bố sáng 26/12.</p><p class=\"description\" style=\"margin-bottom: 15px; text-rendering: optimizelegibility; line-height: 28.8px;\"><br></p><p class=\"description\" style=\"margin-bottom: 15px; text-rendering: optimizelegibility; line-height: 28.8px;\">Thời gian tổ chức kỳ thi như sau:</p><p class=\"description\" style=\"margin-bottom: 15px; text-rendering: optimizelegibility; line-height: 28.8px;\"><br></p><p class=\"description\" style=\"margin-bottom: 15px; text-rendering: optimizelegibility; line-height: 28.8px;\">Đợt 1 của kỳ thi diễn ra tại 25 địa phương: Thừa Thiên - Huế, Bình Phước, Tây Ninh, Đà Nẵng, Quảng Nam, Quảng Ngãi, Bình Định, Phú Yên, Khánh Hòa, Bình Thuận, Đắk Lắk, Lâm Đồng, TP HCM, Bình Dương, Đồng Nai, Bà Rịa - Vũng Tàu, Tiền Giang, Bến Tre, Đồng Tháp, Vĩnh Long, An Giang, Cần Thơ, Kiên Giang, Bạc Liêu, Cà Mau.</p><p class=\"description\" style=\"margin-bottom: 15px; text-rendering: optimizelegibility; line-height: 28.8px;\"><br></p><p class=\"description\" style=\"margin-bottom: 15px; text-rendering: optimizelegibility; line-height: 28.8px;\">Đợt 2 được tổ chức tại 11 địa phương: Thừa Thiên - Huế, Bình Định, Đắk Lắk, Khánh Hòa, Đồng Nai, Bình Dương, Bà Rịa - Vũng Tàu, Tiền Giang, An Giang, Lâm Đồng, TP HCM.</p><p class=\"description\" style=\"margin-bottom: 15px; text-rendering: optimizelegibility; line-height: 28.8px;\"><br></p><p class=\"description\" style=\"margin-bottom: 15px; text-rendering: optimizelegibility; line-height: 28.8px;\">Từ năm 2025, Đại học Quốc gia TP HCM điều chỉnh cấu trúc bài thi. Phần Logic - Phân tích số liệu và Giải quyết vấn đề ở các năm trước được gộp lại thành \"Tư duy khoa học\" với 30 câu trắc nghiệm. Câu hỏi được xây dựng theo hướng cung cấp thông tin, số liệu, dữ kiện, từ đó yêu cầu thí sinh vận dụng, xác định kết quả thực nghiệm, dự đoán quy luật...</p><p class=\"description\" style=\"margin-bottom: 15px; text-rendering: optimizelegibility; line-height: 28.8px;\"><br></p><p class=\"description\" style=\"margin-bottom: 15px; text-rendering: optimizelegibility; line-height: 28.8px;\">Phần Sử dụng ngôn ngữ gồm Tiếng Việt và Tiếng Anh với 60 câu hỏi thay vì 40 câu như trước. Cuối cùng là phần Toán học với 30 câu.</p><p class=\"description\" style=\"margin-bottom: 15px; text-rendering: optimizelegibility; line-height: 28.8px;\"><br></p><p class=\"description\" style=\"margin-bottom: 15px; text-rendering: optimizelegibility; line-height: 28.8px;\">Tổng cộng, đề gồm 120 câu hỏi trắc nghiệm khách quan nhiều lựa chọn. Thí sinh làm bài trên giấy trong 150 phút. Điểm của từng câu có trọng số khác nhau, tùy thuộc vào độ khó, tổng điểm là 1.200. Trong đó, Tư duy khoa học và To&nbsp;</p><p class=\"description\" style=\"margin-bottom: 15px; text-rendering: optimizelegibility; line-height: 28.8px;\"><br></p><p class=\"description\" style=\"margin-bottom: 15px; text-rendering: optimizelegibility; line-height: 28.8px;\">Giải thích về việc thay đổi cấu trúc đề, ông Chính cho biết bài thi nhằm đánh giá năng lực học đại học của thí sinh. Những năng lực được đại học này chú trọng là đọc, sử dụng ngôn ngữ tiếng Việt, tiếng Anh, Toán học, sự logic, tư duy khoa học, xử lý số liệu, giải quyết vấn đề.</p><p class=\"description\" style=\"margin-bottom: 15px; text-rendering: optimizelegibility; line-height: 28.8px;\"><br></p><p class=\"description\" style=\"margin-bottom: 15px; text-rendering: optimizelegibility; line-height: 28.8px;\">Theo ông, những điều chỉnh của đề thi đã được nhóm chuyên gia nghiên cứu kỹ, nhằm phù hợp với chương trình giáo dục phổ thông 2018 và đảm bảo công bằng với tất cả thí sinh.</p><p class=\"description\" style=\"margin-bottom: 15px; text-rendering: optimizelegibility; line-height: 28.8px;\"><br></p><p class=\"description\" style=\"margin-bottom: 15px; text-rendering: optimizelegibility; line-height: 28.8px;\">Chương trình mới quy định ngoài ba môn bắt buộc, học sinh được lựa chọn một số môn khác theo định hướng nghề nghiệp. Ông Chính cho hay dự kiến ban đầu của Đại học Quốc gia TP HCM là cho thí sinh tự chọn nhóm môn để làm bài. Trên lý thuyết, thí sinh có 126 lựa chọn tổ hợp môn, nếu đáp ứng sự chọn lựa của toàn bộ thí sinh, đề thi phải có rất nhiều nhóm môn. Như thế, việc đánh giá khó đồng nhất.</p><p class=\"description\" style=\"margin-bottom: 15px; text-rendering: optimizelegibility; line-height: 28.8px;\"><br></p><p class=\"description\" style=\"margin-bottom: 15px; text-rendering: optimizelegibility; line-height: 28.8px;\">Do đó, đại học này điều chỉnh cấu trúc đề thi như hiện nay, tạo cơ hội như nhau cho thí sinh dù các em chọn tổ hợp môn nào ở bậc THPT.</p><p class=\"description\" style=\"margin-bottom: 15px; text-rendering: optimizelegibility; line-height: 28.8px;\"><br></p><p class=\"description\" style=\"margin-bottom: 15px; text-rendering: optimizelegibility; line-height: 28.8px;\">Theo ông Chính, phần Sử dụng ngôn ngữ và Toán là những nội dung bắt buộc học ở phổ thông. Phần Tư duy khoa học có hai nhóm, gồm Logic - Phân tích dữ liệu và Suy luận khoa học. Trong đó, phần đầu đã có ở đề những năm trước. Như vậy, cấu trúc, nội dung đề được giữ ổn định đến 85%.</p><p class=\"description\" style=\"margin-bottom: 15px; text-rendering: optimizelegibility; line-height: 28.8px;\"><br></p><p class=\"description\" style=\"margin-bottom: 15px; text-rendering: optimizelegibility; line-height: 28.8px;\">18 câu thuộc nhóm Suy luận khoa học là sự khác biệt. Phần này gồm các vấn đề khoa học, xã hội, công nghệ, đời sống, chứ không thuộc về kiến thức riêng biệt từng môn Lý, Hóa, Sinh, Sử, Địa, Giáo dục kinh tế và pháp luật. Các câu hỏi đều cung cấp đầy đủ thông tin dưới dạng số liệu, dữ kiện, công thức, định nghĩa, quá trình và kết quả thí nghiệm. Thí sinh dựa vào tư duy logic, suy luận khoa học để tìm ra quy luật, lời giải.</p><p class=\"description\" style=\"margin-bottom: 15px; text-rendering: optimizelegibility; line-height: 28.8px;\"><br></p><p class=\"description\" style=\"margin-bottom: 15px; text-rendering: optimizelegibility; line-height: 28.8px;\">\"Đây là phương án có lợi và công bằng nhất cho tất cả thí sinh\", ông Chính nói.</p><p class=\"description\" style=\"margin-bottom: 15px; text-rendering: optimizelegibility; line-height: 28.8px;\"><br></p><p class=\"description\" style=\"margin-bottom: 15px; text-rendering: optimizelegibility; line-height: 28.8px;\">Ông cho hay đề thi những năm trước có nhiều nét giống với kỳ thi ACT của Mỹ. Từ năm 2025, cấu trúc và nội dung đề tương đồng với các đề thi chuẩn hóa quốc tế như SAT (Mỹ), PET (Israel) hay GAT (Thái Lan).</p><p class=\"description\" style=\"margin-bottom: 15px; text-rendering: optimizelegibility; line-height: 28.8px;\"><br></p><p class=\"description\" style=\"margin-bottom: 15px; text-rendering: optimizelegibility; line-height: 28.8px;\">Sau 7 năm tổ chức với 12 đợt, kỳ thi đánh giá năng lực của Đại học Quốc gia TP HCM đã có hơn 482.800 lượt thí sinh tham gia, được 109 trường đại học, cao đẳng dùng để xét tuyển đầu vào.</p><p class=\"description\" style=\"margin-bottom: 15px; text-rendering: optimizelegibility; font-size: 18px; line-height: 28.8px;\"><br></p>','Kỳ thi đánh giá năng lực của Đại học Quốc gia TP HCM sẽ được tổ chức hai đợt vào cuối tháng 3 và đầu tháng 6/2025. ','Draft',NULL,0,0,NULL,2);
/*!40000 ALTER TABLE `article` ENABLE KEYS */;
UNLOCK TABLES;

--
-- Table structure for table `article_subcategory`
--

DROP TABLE IF EXISTS `article_subcategory`;
/*!40101 SET @saved_cs_client     = @@character_set_client */;
/*!50503 SET character_set_client = utf8mb4 */;
CREATE TABLE `article_subcategory` (
  `ArticleID` int NOT NULL,
  `SubCategoryID` int NOT NULL,
  PRIMARY KEY (`ArticleID`,`SubCategoryID`),
  KEY `FK_ARTICLE_SUBCATEGORY_SUBCATEGORY` (`SubCategoryID`),
  CONSTRAINT `FK_ARTICLE_SUBCATEGORY_ARTICLE` FOREIGN KEY (`ArticleID`) REFERENCES `article` (`ArticleID`) ON DELETE CASCADE,
  CONSTRAINT `FK_ARTICLE_SUBCATEGORY_SUBCATEGORY` FOREIGN KEY (`SubCategoryID`) REFERENCES `subcategory` (`SubCategoryID`) ON DELETE CASCADE
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_0900_ai_ci;
/*!40101 SET character_set_client = @saved_cs_client */;

--
-- Dumping data for table `article_subcategory`
--

LOCK TABLES `article_subcategory` WRITE;
/*!40000 ALTER TABLE `article_subcategory` DISABLE KEYS */;
INSERT INTO `article_subcategory` VALUES (1,7),(2,22);
/*!40000 ALTER TABLE `article_subcategory` ENABLE KEYS */;
UNLOCK TABLES;

--
-- Table structure for table `article_tag`
--

DROP TABLE IF EXISTS `article_tag`;
/*!40101 SET @saved_cs_client     = @@character_set_client */;
/*!50503 SET character_set_client = utf8mb4 */;
CREATE TABLE `article_tag` (
  `ArticleID` int NOT NULL,
  `TagID` int NOT NULL,
  PRIMARY KEY (`ArticleID`,`TagID`),
  KEY `FK_ARTICLE_TAG_TAG` (`TagID`),
  CONSTRAINT `FK_ARTICLE_TAG_ARTICLE` FOREIGN KEY (`ArticleID`) REFERENCES `article` (`ArticleID`) ON DELETE CASCADE,
  CONSTRAINT `FK_ARTICLE_TAG_TAG` FOREIGN KEY (`TagID`) REFERENCES `tag` (`TagID`) ON DELETE CASCADE
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_0900_ai_ci;
/*!40101 SET character_set_client = @saved_cs_client */;

--
-- Dumping data for table `article_tag`
--

LOCK TABLES `article_tag` WRITE;
/*!40000 ALTER TABLE `article_tag` DISABLE KEYS */;
/*!40000 ALTER TABLE `article_tag` ENABLE KEYS */;
UNLOCK TABLES;

--
-- Table structure for table `article_url`
--

DROP TABLE IF EXISTS `article_url`;
/*!40101 SET @saved_cs_client     = @@character_set_client */;
/*!50503 SET character_set_client = utf8mb4 */;
CREATE TABLE `article_url` (
  `ArticleID` int NOT NULL,
  `STT` int NOT NULL,
  `URL` text,
  PRIMARY KEY (`ArticleID`,`STT`),
  CONSTRAINT `FK_ARTICLE_URL_ARTICLE` FOREIGN KEY (`ArticleID`) REFERENCES `article` (`ArticleID`) ON DELETE CASCADE
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_0900_ai_ci;
/*!40101 SET character_set_client = @saved_cs_client */;

--
-- Dumping data for table `article_url`
--

LOCK TABLES `article_url` WRITE;
/*!40000 ALTER TABLE `article_url` DISABLE KEYS */;
INSERT INTO `article_url` VALUES (1,0,'/uploads/article/1/BackgroundImage.jpeg'),(2,0,'/uploads/article/2/BackgroundImage.jpeg');
/*!40000 ALTER TABLE `article_url` ENABLE KEYS */;
UNLOCK TABLES;

--
-- Table structure for table `category`
--

DROP TABLE IF EXISTS `category`;
/*!40101 SET @saved_cs_client     = @@character_set_client */;
/*!50503 SET character_set_client = utf8mb4 */;
CREATE TABLE `category` (
  `CategoryID` int NOT NULL AUTO_INCREMENT,
  `Name` varchar(50) CHARACTER SET utf8mb3 COLLATE utf8mb3_unicode_ci DEFAULT NULL,
  PRIMARY KEY (`CategoryID`)
) ENGINE=InnoDB AUTO_INCREMENT=6 DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_0900_ai_ci;
/*!40101 SET character_set_client = @saved_cs_client */;

--
-- Dumping data for table `category`
--

LOCK TABLES `category` WRITE;
/*!40000 ALTER TABLE `category` DISABLE KEYS */;
INSERT INTO `category` VALUES (1,'Công nghệ'),(2,'Sức khỏe'),(3,'Thời trang'),(4,'Ẩm thực'),(5,'Giáo dục');
/*!40000 ALTER TABLE `category` ENABLE KEYS */;
UNLOCK TABLES;

--
-- Table structure for table `comment`
--

DROP TABLE IF EXISTS `comment`;
/*!40101 SET @saved_cs_client     = @@character_set_client */;
/*!50503 SET character_set_client = utf8mb4 */;
CREATE TABLE `comment` (
  `CommentID` int NOT NULL AUTO_INCREMENT,
  `DatePosted` date DEFAULT NULL,
  `Content` text CHARACTER SET utf8mb3 COLLATE utf8mb3_unicode_ci,
  `ArticleID` int DEFAULT NULL,
  `SubscriberID` int DEFAULT NULL,
  PRIMARY KEY (`CommentID`),
  KEY `FK_COMMENT_ARTICLE` (`ArticleID`),
  KEY `FK_COMMENT_SUBSCRIBER` (`SubscriberID`),
  CONSTRAINT `FK_COMMENT_ARTICLE` FOREIGN KEY (`ArticleID`) REFERENCES `article` (`ArticleID`) ON DELETE CASCADE,
  CONSTRAINT `FK_COMMENT_SUBSCRIBER` FOREIGN KEY (`SubscriberID`) REFERENCES `subscriber` (`SubscriberID`)
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_0900_ai_ci;
/*!40101 SET character_set_client = @saved_cs_client */;

--
-- Dumping data for table `comment`
--

LOCK TABLES `comment` WRITE;
/*!40000 ALTER TABLE `comment` DISABLE KEYS */;
/*!40000 ALTER TABLE `comment` ENABLE KEYS */;
UNLOCK TABLES;

--
-- Table structure for table `editor`
--

DROP TABLE IF EXISTS `editor`;
/*!40101 SET @saved_cs_client     = @@character_set_client */;
/*!50503 SET character_set_client = utf8mb4 */;
CREATE TABLE `editor` (
  `EditorID` int NOT NULL,
  PRIMARY KEY (`EditorID`),
  CONSTRAINT `FK_EDITOR_USER` FOREIGN KEY (`EditorID`) REFERENCES `user` (`UserID`) ON DELETE CASCADE
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_0900_ai_ci;
/*!40101 SET character_set_client = @saved_cs_client */;

--
-- Dumping data for table `editor`
--

LOCK TABLES `editor` WRITE;
/*!40000 ALTER TABLE `editor` DISABLE KEYS */;
INSERT INTO `editor` VALUES (5);
/*!40000 ALTER TABLE `editor` ENABLE KEYS */;
UNLOCK TABLES;

--
-- Table structure for table `editor_category`
--

DROP TABLE IF EXISTS `editor_category`;
/*!40101 SET @saved_cs_client     = @@character_set_client */;
/*!50503 SET character_set_client = utf8mb4 */;
CREATE TABLE `editor_category` (
  `EditorID` int NOT NULL,
  `CategoryID` int NOT NULL,
  PRIMARY KEY (`EditorID`,`CategoryID`),
  KEY `FK_EDITOR_CATEGORY_CATEGORY` (`CategoryID`),
  CONSTRAINT `FK_EDITOR_CATEGORY_CATEGORY` FOREIGN KEY (`CategoryID`) REFERENCES `category` (`CategoryID`) ON DELETE CASCADE,
  CONSTRAINT `FK_EDITOR_CATEGORY_EDITOR` FOREIGN KEY (`EditorID`) REFERENCES `editor` (`EditorID`) ON DELETE CASCADE
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_0900_ai_ci;
/*!40101 SET character_set_client = @saved_cs_client */;

--
-- Dumping data for table `editor_category`
--

LOCK TABLES `editor_category` WRITE;
/*!40000 ALTER TABLE `editor_category` DISABLE KEYS */;
INSERT INTO `editor_category` VALUES (5,1),(5,2);
/*!40000 ALTER TABLE `editor_category` ENABLE KEYS */;
UNLOCK TABLES;

--
-- Table structure for table `subcategory`
--

DROP TABLE IF EXISTS `subcategory`;
/*!40101 SET @saved_cs_client     = @@character_set_client */;
/*!50503 SET character_set_client = utf8mb4 */;
CREATE TABLE `subcategory` (
  `SubCategoryID` int NOT NULL AUTO_INCREMENT,
  `Name` varchar(50) CHARACTER SET utf8mb3 COLLATE utf8mb3_unicode_ci DEFAULT NULL,
  `CategoryID` int DEFAULT NULL,
  PRIMARY KEY (`SubCategoryID`),
  KEY `FK_SUBCATEGORY_CATEGORY` (`CategoryID`),
  CONSTRAINT `FK_SUBCATEGORY_CATEGORY` FOREIGN KEY (`CategoryID`) REFERENCES `category` (`CategoryID`) ON DELETE CASCADE
) ENGINE=InnoDB AUTO_INCREMENT=26 DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_0900_ai_ci;
/*!40101 SET character_set_client = @saved_cs_client */;

--
-- Dumping data for table `subcategory`
--

LOCK TABLES `subcategory` WRITE;
/*!40000 ALTER TABLE `subcategory` DISABLE KEYS */;
INSERT INTO `subcategory` VALUES (1,'Điện thoại',1),(2,'Máy tính xách tay',1),(3,'Phụ kiện công nghệ',1),(4,'Dinh dưỡng',2),(5,'Sức khỏe tâm lý',2),(6,'Đánh giá sản phẩm',1),(7,'Tin tức công nghệ',1),(8,'Thể dục thể thao',2),(9,'Phòng bệnh',2),(10,'Chăm sóc sắc đẹp',2),(11,'Thời trang nam',3),(12,'Thời trang nữ',3),(13,'Giày dép',3),(14,'Phụ kiện thời trang',3),(15,'Xu hướng thời trang',3),(16,'Món ăn truyền thống',4),(17,'Đồ uống',4),(18,'Công thức nấu ăn',4),(19,'Nhà hàng & quán ăn',4),(20,'Review ẩm thực',4),(21,'Học ngoại ngữ',5),(22,'Hướng dẫn thi cử',5),(23,'Du học',5),(24,'Giáo dục sớm',5),(25,'Công nghệ trong giáo dục',5);
/*!40000 ALTER TABLE `subcategory` ENABLE KEYS */;
UNLOCK TABLES;

--
-- Table structure for table `subscriber`
--

DROP TABLE IF EXISTS `subscriber`;
/*!40101 SET @saved_cs_client     = @@character_set_client */;
/*!50503 SET character_set_client = utf8mb4 */;
CREATE TABLE `subscriber` (
  `SubscriberID` int NOT NULL,
  `DateRegistered` date DEFAULT NULL,
  `Duration` int DEFAULT NULL,
  PRIMARY KEY (`SubscriberID`),
  CONSTRAINT `FK_SUBSCRIBER_USER` FOREIGN KEY (`SubscriberID`) REFERENCES `user` (`UserID`) ON DELETE CASCADE
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_0900_ai_ci;
/*!40101 SET character_set_client = @saved_cs_client */;

--
-- Dumping data for table `subscriber`
--

LOCK TABLES `subscriber` WRITE;
/*!40000 ALTER TABLE `subscriber` DISABLE KEYS */;
INSERT INTO `subscriber` VALUES (6,'1970-01-01',NULL);
/*!40000 ALTER TABLE `subscriber` ENABLE KEYS */;
UNLOCK TABLES;

--
-- Table structure for table `tag`
--

DROP TABLE IF EXISTS `tag`;
/*!40101 SET @saved_cs_client     = @@character_set_client */;
/*!50503 SET character_set_client = utf8mb4 */;
CREATE TABLE `tag` (
  `TagID` int NOT NULL AUTO_INCREMENT,
  `Name` varchar(50) CHARACTER SET utf8mb3 COLLATE utf8mb3_unicode_ci DEFAULT NULL,
  PRIMARY KEY (`TagID`)
) ENGINE=InnoDB AUTO_INCREMENT=15 DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_0900_ai_ci;
/*!40101 SET character_set_client = @saved_cs_client */;

--
-- Dumping data for table `tag`
--

LOCK TABLES `tag` WRITE;
/*!40000 ALTER TABLE `tag` DISABLE KEYS */;
INSERT INTO `tag` VALUES (1,'Công nghệ mới'),(2,'Sức khỏe toàn diện'),(3,'Thời trang hiện đại'),(4,'Ẩm thực đường phố'),(5,'Giáo dục trực tuyến'),(6,'Đánh giá sản phẩm'),(7,'Xu hướng thời trang'),(8,'Công thức nấu ăn'),(9,'Phụ kiện công nghệ'),(10,'Thể dục thể thao');
/*!40000 ALTER TABLE `tag` ENABLE KEYS */;
UNLOCK TABLES;

--
-- Table structure for table `user`
--

DROP TABLE IF EXISTS `user`;
/*!40101 SET @saved_cs_client     = @@character_set_client */;
/*!50503 SET character_set_client = utf8mb4 */;
CREATE TABLE `user` (
  `UserID` int NOT NULL AUTO_INCREMENT,
  `FullName` varchar(50) CHARACTER SET utf8mb3 COLLATE utf8mb3_unicode_ci DEFAULT NULL,
  `Email` varchar(50) DEFAULT NULL,
  `Password` varchar(250) DEFAULT NULL,
  `DoB` date DEFAULT NULL,
  `isAdministator` int DEFAULT '0',
  `Role` int DEFAULT '0',
  `otp` varchar(6) DEFAULT NULL,
  `otpExpiration` datetime DEFAULT NULL,
  PRIMARY KEY (`UserID`),
  CONSTRAINT `user_chk_1` CHECK ((`isAdministator` in (0,1))),
  CONSTRAINT `user_chk_2` CHECK ((`Role` in (0,1,2,3)))
) ENGINE=InnoDB AUTO_INCREMENT=7 DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_0900_ai_ci;
/*!40101 SET character_set_client = @saved_cs_client */;

--
-- Dumping data for table `user`
--

LOCK TABLES `user` WRITE;
/*!40000 ALTER TABLE `user` DISABLE KEYS */;
INSERT INTO `user` VALUES (1,'admin','admin@example.com','$2a$10$igZBWZjMDnI1Zi1uHDwsU.YpUMWARVGO8r92KYzOJPwaqGYpVQozm','2024-12-25',1,3,NULL,NULL),(2,'jack writer','writer@example.com','$2a$10$igZBWZjMDnI1Zi1uHDwsU.YpUMWARVGO8r92KYzOJPwaqGYpVQozm','0001-01-01',0,1,NULL,NULL),(5,'henry editor','editor@example.com','123$2a$10$igZBWZjMDnI1Zi1uHDwsU.YpUMWARVGO8r92KYzOJPwaqGYpVQozm',NULL,0,2,NULL,NULL),(6,'user','user@example.com','123$2a$10$igZBWZjMDnI1Zi1uHDwsU.YpUMWARVGO8r92KYzOJPwaqGYpVQozm',NULL,0,0,NULL,NULL);
/*!40000 ALTER TABLE `user` ENABLE KEYS */;
UNLOCK TABLES;

--
-- Table structure for table `writer`
--

DROP TABLE IF EXISTS `writer`;
/*!40101 SET @saved_cs_client     = @@character_set_client */;
/*!50503 SET character_set_client = utf8mb4 */;
CREATE TABLE `writer` (
  `WriterID` int NOT NULL,
  `Alias` varchar(50) CHARACTER SET utf8mb3 COLLATE utf8mb3_unicode_ci DEFAULT NULL,
  PRIMARY KEY (`WriterID`),
  CONSTRAINT `FK_WRITER_USER` FOREIGN KEY (`WriterID`) REFERENCES `user` (`UserID`) ON DELETE CASCADE
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_0900_ai_ci;
/*!40101 SET character_set_client = @saved_cs_client */;

--
-- Dumping data for table `writer`
--

LOCK TABLES `writer` WRITE;
/*!40000 ALTER TABLE `writer` DISABLE KEYS */;
INSERT INTO `writer` VALUES (2,'Jack97');
/*!40000 ALTER TABLE `writer` ENABLE KEYS */;
UNLOCK TABLES;
/*!40103 SET TIME_ZONE=@OLD_TIME_ZONE */;

/*!40101 SET SQL_MODE=@OLD_SQL_MODE */;
/*!40014 SET FOREIGN_KEY_CHECKS=@OLD_FOREIGN_KEY_CHECKS */;
/*!40014 SET UNIQUE_CHECKS=@OLD_UNIQUE_CHECKS */;
/*!40101 SET CHARACTER_SET_CLIENT=@OLD_CHARACTER_SET_CLIENT */;
/*!40101 SET CHARACTER_SET_RESULTS=@OLD_CHARACTER_SET_RESULTS */;
/*!40101 SET COLLATION_CONNECTION=@OLD_COLLATION_CONNECTION */;
/*!40111 SET SQL_NOTES=@OLD_SQL_NOTES */;

-- Dump completed on 2024-12-26 14:17:58
