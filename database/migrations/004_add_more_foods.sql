-- =================================================================================
--DELETE FROM food_ingredients WHERE food_id BETWEEN 21 AND 44;
--DELETE FROM food_flavors WHERE food_id BETWEEN 21 AND 44;
--DELETE FROM food_food_types WHERE food_id BETWEEN 21 AND 44;
--DELETE FROM food_translations WHERE food_id BETWEEN 21 AND 44;
--DELETE FROM food_images WHERE food_id BETWEEN 21 AND 44;
--DELETE FROM foods WHERE food_id BETWEEN 21 AND 44;
-- =================================================================================
-- 1. INSERT BASE FOODS
INSERT INTO foods (name, story, ingredient, taste, style, comparison, region_id, view_count, rating, number_of_rating) VALUES

('ホイアン・チキンライス', 'ホイアン旧市街の有名な名物料理です。ターメリックで炊いた黄色いご飯と、細かく裂いた鶏肉の相性が抜群です。', '鶏肉、ターメリックライス、玉ねぎ、ハーブ', 'あっさり、ハーブ', '黄色いご飯に裂いた鶏肉を添えて、特製ソースでいただきます。', '海南鶏飯に似ているが、ベトナム風の味付け。', 2, 850, 4.7, 10),
('ソイセオ', 'ハノイの人々にとってお馴染みの朝食です。もち米の黄色と緑豆の黄色が鮮やかで、揚げ玉ねぎの香ばしさが食欲をそそります。', 'もち米、緑豆、揚げ玉ねぎ、鶏油', '塩味、脂っこい、甘味', '蓮の葉やバナナの葉で包んで温かいうちに食べます。', '', 1, 720, 4.6, 15),
('コムヘン', 'フエの庶民的でありながら洗練された料理です。冷やご飯に炒めたシジミと様々なハーブ、そして特産のマムルオックを合わせます。', '冷やご飯、シジミ、マムルオック、豚皮揚げ', '辛味、塩味、ハーブ', '全ての具材をよく混ぜてから食べます。', '', 2, 600, 4.5, 8),
('チャオロン', 'ベトナム全土で愛される濃厚なお粥です。豚の骨と内臓から取った出汁で炊き上げ、様々な部位のホルモンが入っています。', '米、豚ホルモン、血のゼリー、ハーブ', '塩味、うま味、ハーブ', '熱々のうちに、揚げパン（クワイ）を浸して食べます。', '中華粥に似ていますが、具材がより豊富です。', NULL, 780, 4.4, 12),
('牛肉と高菜のチャーハン', '北部で特によく食べられるチャーハンです。高菜の酸味が牛肉の脂っこさを中和し、絶妙なバランスを生み出します。', 'ご飯、牛肉、高菜漬け、卵', '塩味、酸味、うま味', '強火でパラパラに炒め、焦げ目を少しつけます。', '揚州チャーハンに酸味を加えた感じ。', 1, 900, 4.6, 20),

('バインミーチャオ', '鉄板で提供されるユニークなバインミーです。パテ、目玉焼き、ソーセージなどが熱々の状態で運ばれてきます。', 'フランスパン、卵、パテ、ソーセージ、牛肉', '塩味、脂っこい、うま味', 'パンをちぎって、鉄板のソースにつけながら食べます。', 'ベトナム風のイングリッシュ・ブレックファスト。', NULL, 880, 4.7, 18),
('バインバオ', '朝食や軽食として人気のある蒸しパンです。ふわふわの皮の中に、味付けされた豚肉と卵が入っています。', '小麦粉、豚肉、うずらの卵、きくらげ', '甘味、塩味', '蒸し器で熱々に温めて食べます。', '中国の包子（パオズ）と同じです。', NULL, 650, 4.3, 5),
('バインミークエ', 'ハイフォンの名物で、指のように細長いパンです。中にはパテが入っており、辛いチリソースにつけて食べます。', '細長いパン、パテ、チリソース', '塩味、辛味、脂っこい', '炭火でカリカリに焼いて、おやつとして食べます。', '', 1, 540, 4.5, 9),
('ボーコー', '牛肉を柔らかくなるまで煮込んだシチューです。レモングラスと五香粉の香りが食欲をそそります。', '牛肉、人参、レモングラス、八角', '塩味、辛味、ハーブ', 'フランスパンを濃厚なスープに浸して食べます。', '日本のカレーに近いですが、スパイスが異なります。', 3, 920, 4.8, 25),

('蓮の茎のサラダ', '蓮の茎を使ったシャキシャキとした食感が特徴のサラダです。エビと豚肉の甘みが酸味のあるタレとよく合います。', '蓮の茎、エビ、豚肉、人参、ハーブ', '酸味、甘味、ハーブ', '甘酸っぱいヌクマムベースのタレで和えます。', '', 3, 700, 4.6, 11),
('バナナの花のサラダ', 'バナナの花の蕾を使った素朴な料理です。独特の渋みとシャキシャキ感が、脂っこい料理の箸休めに最適です。', 'バナナの花、豚耳または鶏肉、ピーナッツ', '酸味、軽い渋み、ハーブ', 'ピーナッツをたっぷりかけて、香ばしさをプラスします。', '', NULL, 620, 4.4, 7),
('青パパイヤと干し肉のサラダ', '若者に大人気のストリートフードです。千切りにした青パパイヤの食感と、甘辛い干し牛肉が絶妙です。', '青パパイヤ、干し牛肉、レバー、ハーブ', '酸味、辛味、塩味', '酢醤油のような特製タレで和えて食べます。', '', NULL, 810, 4.7, 30),
('マンゴーとエビ・肉のサラダ', '青マンゴーの酸味を活かした刺激的なサラダです。酸っぱさと辛さが、暑い日の食欲を増進させます。', '青マンゴー、干しエビ、豚バラ肉', '酸味、辛味、塩味', '前菜として、またはお酒のおつまみとして人気です。', 'タイのソムタムに似ていますが、辛さは控えめです。', 3, 750, 4.5, 14),
('牛肉のレモン締め (ボータイチャン)', '新鮮な牛肉をレモン汁で締めた料理です。完全に火を通さず、酸味でタンパク質を変性させます。', '牛肉、ライム、揚げ玉ねぎ、ハーブ', '酸味、甘味、ハーブ', 'ライスペーパーで巻いたり、そのままおつまみとして。', '牛肉のたたきに酸味を加えたような料理。', NULL, 680, 4.6, 10),
('ベジタリアン生春巻き', '肉や魚介を使わない、ヘルシーな生春巻きです。豆腐やきのこを使い、あっさりとしていながら満足感があります。', 'ライスペーパー、豆腐、きのこ、野菜', '薄味、ハーブ', '濃厚なピーナッツソースにつけて食べます。', '', NULL, 500, 4.3, 6),

('ラウクアドン', '田蟹（沢蟹）のペーストから作った出汁がベースの鍋です。蟹の甘みとトマトの酸味が調和した優しい味です。', '田蟹、牛肉、豆腐、野菜', '酸味、塩味、うま味', 'たっぷりの野菜と牛肉を出汁にくぐらせて食べます。', '', 1, 890, 4.8, 22),
('鶏肉とラザン（葉）の鍋', '南部の酸っぱい鍋の代表格です。ラザンという葉から出る独特の酸味が、鶏肉の脂っぽさを消してくれます。', '鶏肉、ラザンの葉、レモングラス、唐辛子', '酸味、辛味、ハーブ', '酸味のあるスープで、食欲がない時でも食べられます。', '', 3, 820, 4.7, 16),
('魚の発酵鍋', 'メコンデルタ地方の特産品です。発酵させた魚のペーストをベースにしており、香りは強いですが味は絶品です。', '魚の発酵ペースト、魚介類、豚肉、ナス', '塩味、甘味、うま味', '大量の香草や野菜と一緒に食べるのがスタイルです。', '', 3, 780, 4.6, 13),
('きのこ鍋', '数種類のきのこをたっぷり使った、健康的で滋味深い鍋です。スープはあっさりしており、素材の味を楽しめます。', '各種きのこ、野菜、骨付き肉の出汁', '薄味、甘味、ハーブ', 'きのこの自然な甘みが出たスープを楽しみます。', '', NULL, 710, 4.5, 9),
('タイ風海鮮鍋', 'ベトナムでも非常に人気のある、酸っぱくて辛い鍋です。エビ、イカ、貝などの魚介類をふんだんに使います。', '魚介類、きのこ、ライムの葉、レモングラス', '酸味、辛味、塩味', '濃厚で刺激的なスープは、麺との相性が良いです。', 'トムヤムクンと同じ味わいです。', NULL, 950, 4.8, 40),

('空芯菜のニンニク炒め', 'ベトナムの食卓に欠かせない「国民的野菜料理」です。ニンニクの香ばしい香りと、シャキシャキした食感が最高です。', '空芯菜、ニンニク、ヌクマム', '塩味、うま味', '強火でさっと炒めて、翠色を保ちます。', '中華料理の青菜炒めに似ています。', NULL, 800, 4.5, 50),
('雷魚の酸味スープ', '南部の家庭料理の定番です。パイナップル、トマト、タマリンドを使い、甘酸っぱい味が暑い気候に合います。', '雷魚、パイナップル、トマト、ハスイモ', '酸味、甘味、塩味', 'ご飯にかけて食べたり、魚はヌクマムにつけて食べます。', '', 3, 860, 4.7, 28),
('鶏肉の春雨スープ', '鶏の出汁が効いた透明なスープに、春雨を入れた優しい味の麺料理です。朝食や軽食として人気があります。', '鶏肉、春雨、木耳、香草', 'あっさり、ハーブ、うま味', '透明なスープで、胃に優しい味わいです。', '日本の春雨スープに似ています。', NULL, 760, 4.5, 12),
('手羽先のヌクマム揚げ', 'カリカリに揚げた手羽先に、甘辛いヌクマムソースを絡めた料理です。ご飯のおかずにも、お酒のつまみにも最適です。', '手羽先、ヌクマム、砂糖、ニンニク', '塩味、甘味、うま味', '皮はパリパリ、中はジューシーに仕上げます。', '名古屋の手羽先に似ていますが、魚醤の風味がします。', 3, 890, 4.8, 35);


-- 2. INSERT TRANSLATIONS

INSERT INTO food_translations (food_id, lang, name, story, ingredient, taste, style, comparison) VALUES
-- 21. Cơm Gà Hội An
(21, 'vi', 'Cơm Gà Hội An', 'Món ăn là niềm tự hào của phố cổ Hội An. Gạo được nấu với nước luộc gà và nghệ tạo nên màu vàng óng ả, ăn kèm với gà ta xé phay trộn rau răm, hành tây.', 'Gà ta, Gạo, Nghệ, Hành tây, Rau răm', 'Nhạt, Thảo mộc, Umami', 'Cơm tơi xốp, thịt gà dai ngọt.', 'Giống cơm gà Hải Nam nhưng đậm đà gia vị Việt hơn.'),
(21, 'en', 'Hoi An Chicken Rice', 'The pride of Hoi An ancient town. Rice is cooked with chicken broth and turmeric for a golden color, served with shredded chicken mixed with Vietnamese coriander and onions.', 'Chicken, Turmeric rice, Onion, Herbs', 'Light, Herbal, Umami', 'Fluffy rice with chewy, sweet chicken meat.', 'Similar to Hainanese chicken rice but with distinct Vietnamese herbs.'),

-- 22. Xôi Xéo
(22, 'vi', 'Xôi Xéo', 'Thức quà sáng tinh tế của người Hà Nội. Xôi nếp dẻo thơm màu nghệ, phủ lên trên là đậu xanh tán nhuyễn mịn màng và hành phi giòn rụm béo ngậy.', 'Gạo nếp, Đậu xanh, Hành phi, Mỡ gà', 'Mặn, Béo, Ngọt', 'Gói trong lá sen hoặc lá chuối để giữ hương thơm.', ''),
(22, 'en', 'Xoi Xeo', 'A sophisticated breakfast of Hanoi people. Sticky turmeric rice topped with finely mashed mung bean paste and crispy fried shallots.', 'Sticky rice, Mung bean, Fried shallots, Chicken fat', 'Salty, Fatty, Sweet', 'Wrapped in lotus or banana leaves to keep warm and fragrant.', ''),

-- 23. Cơm Hến
(23, 'vi', 'Cơm Hến', 'Món ăn dân dã nhưng đậm đà bản sắc Huế. Cơm nguội được trộn với hến xào, mắm ruốc, tóp mỡ, và rất nhiều loại rau sống, tạo nên hương vị cay nồng khó quên.', 'Cơm nguội, Hến, Mắm ruốc, Tóp mỡ', 'Cay, Mặn, Thảo mộc', 'Trộn đều tất cả nguyên liệu trước khi ăn.', 'Hương vị mắm ruốc rất đặc trưng, không giống món nào khác.'),
(23, 'en', 'Com Hen', 'A rustic dish with the soul of Hue. Cold rice mixed with stir-fried baby clams, shrimp paste, pork cracklings, and many herbs, creating an unforgettable spicy taste.', 'Cold rice, Baby clams, Shrimp paste, Pork cracklings', 'Spicy, Salty, Herbal', 'Mix all ingredients thoroughly before eating.', 'Unique shrimp paste flavor, unlike any other dish.'),

-- 24. Cháo Lòng
(24, 'vi', 'Cháo Lòng', 'Món cháo sánh mịn nấu từ nước luộc lòng và huyết heo. Một bát cháo nóng hổi với dồi, gan, tim, cật là món ăn đêm hoặc ăn sáng được yêu thích.', 'Gạo, Nội tạng heo, Huyết, Rau thơm', 'Mặn, Umami, Thảo mộc', 'Ăn nóng, rắc thêm tiêu và hành, kèm quẩy giòn.', 'Giống cháo Congee nhưng đậm đà và nhiều đạm hơn.'),
(24, 'en', 'Chao Long', 'Smooth porridge cooked from pork broth and blood. A hot bowl topped with sausage, liver, and heart is a favorite for breakfast or late-night meals.', 'Rice, Pork offal, Blood jelly, Herbs', 'Salty, Umami, Herbal', 'Serve piping hot with pepper, scallions, and dough sticks.', 'Like Congee but richer and protein-heavy.'),

-- 25. Cơm Rang Dưa Bò
(25, 'vi', 'Cơm Rang Dưa Bò', 'Món cơm rang "chắc bụng" phổ biến tại miền Bắc. Vị chua giòn của dưa cải muối giúp cân bằng vị béo của thịt bò và dầu mỡ, khiến món ăn không bị ngán.', 'Cơm nguội, Thịt bò, Dưa cải chua', 'Mặn, Chua, Umami', 'Cơm rang lửa lớn để hạt cơm săn lại.', 'Giống cơm chiên Dương Châu nhưng có vị chua đặc trưng.'),
(25, 'en', 'Fried Rice with Beef & Pickles', 'A hearty fried rice dish popular in the North. The sour crunch of pickled mustard greens balances the richness of the beef and oil.', 'Rice, Beef, Pickled mustard greens', 'Salty, Sour, Umami', 'Stir-fried over high heat for crispy rice grains.', 'Like Yangchow fried rice but with a distinctive sour note.'),

-- 26. Bánh Mì Chảo
(26, 'vi', 'Bánh Mì Chảo', 'Một cách thưởng thức bánh mì thú vị. Thay vì kẹp nhân, pate, trứng ốp la, xúc xích được làm nóng sốt trên chảo gang nhỏ, chấm trực tiếp với bánh mì.', 'Bánh mì, Trứng, Pate, Xúc xích', 'Mặn, Béo, Umami', 'Ăn trực tiếp trong chảo khi còn đang sôi xèo xèo.', 'Phong cách giống bữa sáng kiểu Anh nhưng hương vị Việt.'),
(26, 'en', 'Banh Mi Chao', 'A fun way to enjoy Banh Mi. Instead of a sandwich, pate, eggs, and sausage are served sizzling in a small cast-iron skillet with bread on the side.', 'Baguette, Egg, Pate, Sausage', 'Salty, Fatty, Umami', 'Eat directly from the sizzling pan.', 'Style similar to English Breakfast but with Vietnamese flavors.'),

-- 27. Bánh Bao
(27, 'vi', 'Bánh Bao', 'Chiếc bánh trắng ngần, mềm xốp với nhân thịt băm, mộc nhĩ và trứng cút bên trong. Món ăn tiện lợi, ấm bụng cho bất kỳ thời điểm nào trong ngày.', 'Bột mì, Thịt heo, Trứng cút, Mộc nhĩ', 'Ngọt, Mặn', 'Hấp chín, vỏ bánh mềm và hơi ngọt.', 'Tương tự bánh bao (Baozi) của Trung Quốc.'),
(27, 'en', 'Steamed Bun', 'White, fluffy bun filled with minced pork, wood ear mushrooms, and quail eggs. A convenient, comforting snack for any time of day.', 'Flour, Pork, Quail egg, Mushroom', 'Sweet, Salty', 'Steamed, soft and slightly sweet dough.', 'Similar to Chinese Baozi.'),

-- 28. Bánh Mì Que
(28, 'vi', 'Bánh Mì Que', 'Đặc sản Hải Phòng với hình dáng nhỏ dài như chiếc que. Nhân chỉ có pate gan béo ngậy, nhưng khi nướng giòn và chấm chí chương (tương ớt) thì ngon tuyệt.', 'Bánh mì nhỏ, Pate, Tương ớt', 'Mặn, Cay, Béo', 'Nướng giòn tan, ăn vặt rất cuốn.', ''),
(28, 'en', 'Bread Stick', 'Hai Phong specialty shaped like a small stick. Filled only with rich liver pate, but incredibly tasty when toasted crispy and dipped in chili sauce.', 'Small baguette, Pate, Chili sauce', 'Salty, Spicy, Fatty', 'Toasted crispy, addictive snack.', ''),

-- 29. Bò Kho
(29, 'vi', 'Bò Kho', 'Thịt bò được tẩm ướp ngũ vị hương và sả, hầm cùng cà rốt đến khi mềm nhừ. Nước sốt sánh sệt, màu đỏ cam đẹp mắt, chấm bánh mì là "hết sảy".', 'Thịt bò, Cà rốt, Sả, Hoa hồi', 'Mặn, Cay, Thảo mộc', 'Ăn kèm bánh mì, hủ tiếu hoặc cơm.', 'Gần giống món cà ri nhưng thơm mùi ngũ vị hương hơn.'),
(29, 'en', 'Beef Stew', 'Beef marinated with five-spice and lemongrass, stewed with carrots until tender. The thick, orange-red sauce is perfect for dipping bread.', 'Beef, Carrot, Lemongrass, Star anise', 'Salty, Spicy, Herbal', 'Served with baguette, rice noodles, or rice.', 'Similar to curry but with a strong five-spice aroma.'),

-- 30. Gỏi Ngó Sen
(30, 'vi', 'Gỏi Ngó Sen', 'Món khai vị thanh tao thường thấy trong các bữa tiệc. Ngó sen giòn, trắng ngần trộn cùng tôm thịt và nước mắm chua ngọt, rắc thêm lạc rang thơm bùi.', 'Ngó sen, Tôm, Thịt heo, Cà rốt', 'Chua, Ngọt, Thảo mộc', 'Vị giòn, thanh mát, ít dầu mỡ.', ''),
(30, 'en', 'Lotus Stem Salad', 'An elegant appetizer often found at parties. Crunchy white lotus stems mixed with shrimp, pork, and sweet-sour dressing, topped with peanuts.', 'Lotus stem, Shrimp, Pork, Carrot', 'Sour, Sweet, Herbal', 'Crunchy, refreshing, and light.', ''),

-- 31. Nộm Hoa Chuối
(31, 'vi', 'Nộm Hoa Chuối', 'Món nộm dân dã tận dụng cây chuối vườn nhà. Hoa chuối thái mỏng, ngâm cho hết nhựa, trộn với tai heo giòn sần sật, vị chát nhẹ rất kích thích vị giác.', 'Hoa chuối, Tai heo, Lạc, Rau thơm', 'Chua, Chát nhẹ, Thảo mộc', 'Thanh mát, giải ngấy cực tốt.', 'Kết cấu giòn độc đáo của hoa chuối.'),
(31, 'en', 'Banana Flower Salad', 'A rustic salad using ingredients from the garden. Thinly sliced banana blossom mixed with crunchy pig ears. The slight astringency stimulates the palate.', 'Banana flower, Pig ear, Peanuts, Herbs', 'Sour, Slightly Astringent, Herbal', 'Refreshing, great for cutting through rich foods.', 'Unique crunchy texture of banana blossom.'),

-- 32. Gỏi Bò Khô
(32, 'vi', 'Gỏi Bò Khô', 'Món ăn vặt "huyền thoại" của học sinh, sinh viên. Đu đủ xanh bào sợi giòn tan, ăn cùng bò khô cay, gan cháy bùi bùi và nước trộn chua ngọt.', 'Đu đủ xanh, Bò khô, Gan cháy, Rau kinh giới', 'Chua, Cay, Mặn', 'Trộn đều khi ăn để đu đủ ngấm gia vị.', ''),
(32, 'en', 'Green Papaya Salad with Beef Jerky', 'Legendary street snack for students. Crunchy shredded green papaya served with spicy beef jerky, liver, and sweet-sour dressing.', 'Green papaya, Beef jerky, Liver, Herbs', 'Sour, Spicy, Salty', 'Mix well before eating so the papaya absorbs the sauce.', ''),

-- 33. Gỏi Xoài Tôm Thịt
(33, 'vi', 'Gỏi Xoài Tôm Thịt', 'Sử dụng xoài xanh có vị chua gắt để làm gỏi. Vị chua của xoài kết hợp với vị ngọt của tôm thịt và cay nồng của ớt tạo nên bùng nổ hương vị.', 'Xoài xanh, Tôm, Thịt ba chỉ, Ớt', 'Chua, Cay, Mặn', 'Ăn khai vị hoặc làm mồi nhậu.', 'Gần giống món Som Tum của Thái Lan.'),
(33, 'en', 'Mango Salad with Shrimp & Pork', 'Uses sour green mangoes as the base. The tartness of mango combined with sweet shrimp/pork and spicy chili creates a flavor explosion.', 'Green mango, Shrimp, Pork belly, Chili', 'Sour, Spicy, Salty', 'Great as an appetizer or with drinks.', 'Similar to Thai Som Tum.'),

-- 34. Bò Tái Chanh
(34, 'vi', 'Bò Tái Chanh', 'Thịt bò tươi thái mỏng, được làm chín bằng axit từ nước cốt chanh chứ không qua lửa. Thịt giữ được độ ngọt tự nhiên, mềm tan trong miệng.', 'Thịt bò, Chanh, Hành tây, Hành phi', 'Chua, Ngọt, Thảo mộc', 'Thịt bò mềm ngọt, vị chua thanh.', 'Giống món Carpaccio hoặc gỏi sống.'),
(34, 'en', 'Rare Beef with Lime', 'Thinly sliced fresh beef "cooked" by the acidity of lime juice instead of heat. The meat retains its natural sweetness and melts in the mouth.', 'Beef, Lime, Onion, Fried shallots', 'Sour, Sweet, Herbal', 'Tender sweet beef with a clean sour taste.', 'Like Carpaccio or ceviche.'),

-- 35. Gỏi Cuốn Chay
(35, 'vi', 'Gỏi Cuốn Chay', 'Lựa chọn tuyệt vời cho người ăn chay hoặc muốn thanh lọc cơ thể. Nhân gồm đậu phụ, nấm và nhiều loại rau, chấm với tương đen hoặc sốt bơ đậu phộng.', 'Bánh tráng, Đậu phụ, Nấm, Rau sống', 'Nhạt, Thảo mộc', 'Món ăn nhẹ bụng, tốt cho sức khỏe.', ''),
(35, 'en', 'Vegetarian Spring Rolls', 'Great choice for vegetarians or a detox meal. Filled with tofu, mushrooms, and herbs, dipped in hoisin or peanut sauce.', 'Rice paper, Tofu, Mushroom, Herbs', 'Light, Herbal', 'Light and healthy dish.', ''),

-- 36. Lẩu Cua Đồng
(36, 'vi', 'Lẩu Cua Đồng', 'Nồi lẩu thơm lừng mùi gạch cua đồng. Nước dùng vàng óng, ngọt thanh, ăn kèm với thịt bò, sườn sụn và các loại rau đồng quê như mồng tơi, mướp.', 'Cua đồng, Thịt bò, Đậu phụ, Rau mồng tơi', 'Chua, Mặn, Umami', 'Nhúng rau và thịt vào nước lẩu riêu cua nóng hổi.', 'Hương vị đồng quê Việt Nam.'),
(36, 'en', 'Field Crab Hotpot', 'A hotpot fragrant with field crab paste. The golden, sweet broth is served with beef, cartilage, and rustic vegetables like spinach and luffa.', 'Field crab, Beef, Tofu, Spinach', 'Sour, Salty, Umami', 'Dip vegetables and meat into the hot crab broth.', 'The taste of the Vietnamese countryside.'),

-- 37. Lẩu Gà Lá Giang
(37, 'vi', 'Lẩu Gà Lá Giang', 'Món lẩu đặc trưng của miền Nam với vị chua thanh từ lá giang. Thịt gà ta dai ngọt nấu cùng lá giang tạo nên nồi lẩu giải nhiệt, kích thích vị giác.', 'Gà ta, Lá giang, Sả, Ớt', 'Chua, Cay, Thảo mộc', 'Nước dùng chua dịu, thịt gà dai ngon.', ''),
(37, 'en', 'Chicken Hotpot with River Leaf', 'Southern specialty featuring the clean sourness of river leaves. Chewy chicken cooked with these leaves creates a refreshing, appetizing hotpot.', 'Chicken, River leaf, Lemongrass, Chili', 'Sour, Spicy, Herbal', 'Mildly sour broth with tasty chicken.', ''),

-- 38. Lẩu Mắm
(38, 'vi', 'Lẩu Mắm', 'Tinh hoa ẩm thực miền Tây sông nước. Nước lẩu nấu từ mắm cá linh hoặc cá sặc, mùi nồng nhưng vị rất ngọt và đậm đà, ăn kèm hàng chục loại rau.', 'Mắm cá, Hải sản, Thịt heo quay, Rau sống', 'Mặn, Ngọt, Umami', 'Mùi mắm đặc trưng, ai ăn được sẽ nghiện.', 'Hương vị mạnh, đậm đà bản sắc.'),
(38, 'en', 'Fermented Fish Hotpot', 'The essence of Mekong Delta cuisine. Broth made from fermented fish paste, strong-smelling but incredibly sweet and savory, served with dozens of herbs.', 'Fermented fish paste, Seafood, Roast pork, Herbs', 'Salty, Sweet, Umami', 'Distinctive fermented scent, addictive if you acquire the taste.', 'Strong, bold flavor.'),

-- 39. Lẩu Nấm
(39, 'vi', 'Lẩu Nấm', 'Món lẩu dành cho người yêu sức khỏe. Nước dùng được ninh từ xương và rau củ, kết hợp với nhiều loại nấm quý tạo nên vị ngọt tự nhiên, thanh đạm.', 'Các loại nấm, Nước dùng rau củ, Thịt/Hải sản', 'Nhạt, Ngọt, Thảo mộc', 'Vị ngọt thanh từ nấm, không nhiều gia vị.', 'Nhẹ nhàng và bổ dưỡng.'),
(39, 'en', 'Mushroom Hotpot', 'For health-conscious diners. Broth simmered from bones and vegetables, combined with various mushrooms for a natural, light sweetness.', 'Assorted mushrooms, Veggie broth, Meat/Seafood', 'Light, Sweet, Herbal', 'Clean sweetness from mushrooms, minimal spices.', 'Light and nutritious.'),

-- 40. Lẩu Thái Hải Sản
(40, 'vi', 'Lẩu Thái Hải Sản', 'Dù xuất xứ từ Thái Lan nhưng đã trở thành món lẩu phổ biến nhất tại Việt Nam. Vị chua cay của chanh, sả, ớt, lá chanh rất hợp với hải sản.', 'Hải sản (Tôm, Mực), Nấm, Lá chanh, Sả', 'Chua, Cay, Mặn', 'Hương vị chua cay đậm đà, màu sắc bắt mắt.', 'Giống Tom Yum Kung.'),
(40, 'en', 'Thai Seafood Hotpot', 'Originally Thai but extremely popular in Vietnam. The sour and spicy mix of lime, lemongrass, chili, and kaffir lime leaves pairs perfectly with seafood.', 'Seafood, Mushroom, Lime leaf, Lemongrass', 'Sour, Spicy, Salty', 'Bold sour and spicy flavor, colorful presentation.', 'Same as Tom Yum Kung.'),

-- 41. Rau Muống Xào Tỏi
(41, 'vi', 'Rau Muống Xào Tỏi', 'Món ăn giản dị có mặt trong mọi bữa cơm gia đình Việt. Rau muống xanh non xào lửa lớn với tỏi đập dập, vừa giòn vừa thơm nức mũi.', 'Rau muống, Tỏi, Nước mắm', 'Mặn, Umami', 'Rau phải xanh và giữ độ giòn.', 'Món rau phổ biến nhất Việt Nam.'),
(41, 'en', 'Stir-fried Water Spinach', 'A simple dish found in every Vietnamese family meal. Fresh water spinach stir-fried over high heat with smashed garlic, crunchy and aromatic.', 'Water spinach, Garlic, Fish sauce', 'Salty, Umami', 'Vegetables must stay green and crunchy.', 'The most popular vegetable dish in Vietnam.'),

-- 42. Canh Chua Cá Lóc
(42, 'vi', 'Canh Chua Cá Lóc', 'Món canh giải nhiệt trứ danh của miền Nam. Vị chua của me, ngọt của dứa, thơm của rau ngổ kết hợp với cá lóc đồng tạo nên sự cân bằng hoàn hảo.', 'Cá lóc, Dứa, Cà chua, Bạc hà, Me', 'Chua, Ngọt, Mặn', 'Ăn nóng với cơm trắng và nước mắm ớt.', ''),
(42, 'en', 'Sour Soup with Snakehead Fish', 'Famous cooling soup of the South. Sour tamarind, sweet pineapple, and aromatic herbs combined with snakehead fish create a perfect balance.', 'Snakehead fish, Pineapple, Tomato, Tamarind', 'Sour, Sweet, Salty', 'Serve hot with white rice and fish sauce with chili.', ''),

-- 43. Miến Gà
(43, 'vi', 'Miến Gà', 'Sợi miến dong dai trong, nước dùng gà ngọt thanh và thịt gà ta xé phay. Món ăn nhẹ nhàng, ít tinh bột, thích hợp cho bữa sáng hoặc khi ốm dậy.', 'Gà ta, Miến dong, Mộc nhĩ, Hành, Rau răm', 'Nhạt, Thảo mộc, Umami', 'Nước dùng trong veo, thanh khiết.', 'Giống súp gà mì sợi nhưng dùng miến.'),
(43, 'en', 'Chicken Glass Noodle Soup', 'Chewy translucent glass noodles in clear chicken broth with shredded chicken. A light, low-carb meal perfect for breakfast or recovery.', 'Chicken, Glass noodles, Wood ear mushroom, Herbs', 'Light, Herbal, Umami', 'Clear, pure broth.', 'Like chicken noodle soup but with glass noodles.'),

-- 44. Cánh Gà Chiên Nước Mắm
(44, 'vi', 'Cánh Gà Chiên Nước Mắm', 'Món ăn khiến bao người "mê mệt". Cánh gà được chiên giòn rụm, sau đó đảo qua sốt nước mắm đường tỏi ớt, mặn ngọt hài hòa.', 'Cánh gà, Nước mắm, Đường, Tỏi', 'Mặn, Ngọt, Umami', 'Da gà giòn, sốt keo lại bám đều quanh miếng gà.', 'Kiểu gà rán nhưng đậm vị nước mắm Việt.'),
(44, 'en', 'Fried Chicken Wings with Fish Sauce', 'An addictive dish. Chicken wings are deep-fried until crispy, then tossed in a caramelized garlic fish sauce glaze.', 'Chicken wings, Fish sauce, Sugar, Garlic', 'Salty, Sweet, Umami', 'Crispy skin coated in a sticky savory-sweet glaze.', 'Fried chicken with a Vietnamese fish sauce twist.');


-- 3. MAPPING (LIÊN KẾT DỮ LIỆU)

-- 3.1 Mapping Food Types
-- Type 1: Noodle, 2: Rice, 3: Bread, 4: Side, 5: Salad, 6: Hotpot
INSERT INTO food_food_types (food_id, food_type_id) VALUES
(21, 2), -- Cơm Gà Hội An -> Rice
(22, 2), -- Xôi Xéo -> Rice
(23, 2), -- Cơm Hến -> Rice
(24, 2), -- Cháo Lòng -> Rice
(25, 2), -- Cơm Rang -> Rice
(26, 3), -- Bánh Mì Chảo -> Bread
(27, 3), -- Bánh Bao -> Bread
(28, 3), -- Bánh Mì Que -> Bread
(29, 3), -- Bò Kho -> Bread
(30, 5), -- Gỏi Ngó Sen -> Salad
(31, 5), -- Nộm Hoa Chuối -> Salad
(32, 5), -- Gỏi Bò Khô -> Salad
(33, 5), -- Gỏi Xoài -> Salad
(34, 5), -- Bò Tái Chanh -> Salad
(35, 5), -- Gỏi Cuốn Chay -> Salad
(36, 6), -- Lẩu Cua Đồng -> Hotpot
(37, 6), -- Lẩu Gà Lá Giang -> Hotpot
(38, 6), -- Lẩu Mắm -> Hotpot
(39, 6), -- Lẩu Nấm -> Hotpot
(40, 6), -- Lẩu Thái -> Hotpot
(41, 4), -- Rau Muống Xào -> Side
(42, 4), -- Canh Chua -> Side
(43, 1), -- Miến Gà -> Noodle (Thêm món Gà)
(44, 4); -- Cánh Gà Chiên -> Side (Thêm món Gà)

-- 3.2 Mapping Ingredients
-- 1: Beef, 2: Pork, 3: Chicken, 4: Seafood, 5: Veg
INSERT INTO food_ingredients (food_id, ingredient_id) VALUES
(21, 3), (21, 5), -- Cơm Gà: Chicken
(22, 2), (22, 5), -- Xôi Xéo: Pork (mỡ/ruốc), Veg
(23, 4), (23, 5), -- Cơm Hến: Seafood
(24, 2), (24, 5), -- Cháo Lòng: Pork
(25, 1), (25, 5), -- Cơm Rang: Beef
(26, 1), (26, 2), -- Bánh Mì Chảo: Beef, Pork
(27, 2),           -- Bánh Bao: Pork
(28, 2),           -- Bánh Mì Que: Pork
(29, 1), (29, 5), -- Bò Kho: Beef
(30, 4), (30, 2), -- Gỏi Ngó Sen: Seafood, Pork
(31, 3), (31, 5), -- Nộm Hoa Chuối: Chicken (thường có gà xé), Veg
(32, 1), (32, 5), -- Gỏi Bò Khô: Beef
(33, 4), (33, 5), -- Gỏi Xoài: Seafood
(34, 1), (34, 5), -- Bò Tái Chanh: Beef
(35, 5),           -- Gỏi Cuốn Chay: Veg
(36, 4), (36, 1), -- Lẩu Cua: Seafood, Beef
(37, 3), (37, 5), -- Lẩu Gà: Chicken
(38, 4), (38, 2), -- Lẩu Mắm: Seafood, Pork
(39, 5),           -- Lẩu Nấm: Veg
(40, 4), (40, 5), -- Lẩu Thái: Seafood
(41, 5),           -- Rau Muống: Veg
(42, 4), (42, 5), -- Canh Chua: Seafood (Fish)
(43, 3), (43, 5), -- Miến Gà: Chicken
(44, 3);          -- Cánh Gà: Chicken

-- 3.3 Mapping Flavors
-- 1: Sweet, 2: Sour, 3: Herb, 4: Light, 5: Spicy
INSERT INTO food_flavors (food_id, flavor_id, intensity_level) VALUES
(21, 4, 4), (21, 3, 3), -- Cơm Gà: Light, Herb
(22, 1, 3), -- Xôi Xéo: Sweet
(23, 5, 5), (23, 3, 4), -- Cơm Hến: Spicy, Herb
(24, 3, 4), -- Cháo Lòng: Herb (Removed Light)
(25, 2, 3), -- Cơm Rang: Sour
(29, 5, 3), (29, 3, 4), -- Bò Kho: Spicy, Herb
(30, 2, 4), (30, 3, 3), -- Gỏi Ngó Sen: Sour, Herb
(31, 2, 4), (31, 3, 3), -- Nộm Hoa Chuối: Sour, Herb
(32, 2, 4), (32, 5, 3), -- Gỏi Bò Khô: Sour, Spicy
(33, 2, 5), (33, 5, 3), -- Gỏi Xoài: Sour, Spicy
(34, 2, 4), (34, 3, 3), -- Bò Tái Chanh: Sour, Herb
(35, 4, 5), (35, 3, 3), -- Gỏi Cuốn Chay: Light, Herb
(37, 2, 4), (37, 3, 3), -- Lẩu Gà: Sour, Herb
(38, 3, 4), -- Lẩu Mắm: Herb
(39, 4, 5), (39, 3, 3), -- Lẩu Nấm: Light, Herb
(40, 2, 4), (40, 5, 4), -- Lẩu Thái: Sour, Spicy
(42, 2, 5), (42, 1, 3), -- Canh Chua: Sour, Sweet
(43, 4, 4), (43, 3, 3), -- Miến Gà: Light, Herb
(44, 1, 3); -- Cánh Gà: Sweet (mắm đường)

-- ====================================
-- IMAGE
-- ====================================
INSERT INTO food_images (food_id, image_url, display_order, is_primary) VALUES
(21, 'https://cdn.mediamart.vn/images/news/cach-nu-com-ga-hi-an-ngon-chun-dung-diu-min-trung_466f27ad.jpg', 1, TRUE),
(22, 'https://delightfulplate.com/wp-content/uploads/2019/09/Xoi-Xeo-Hanoi-Vietnamese-Sticky-Rice-with-Mung-Bean.jpg', 1, TRUE),
(23, 'https://statics.vinpearl.com/com-hen-0565_1628341291.jpg', 1, TRUE),
(24, 'https://nauankhongkho.com/wp-content/uploads/2016/06/maxresdefault-1.jpg', 1, TRUE),
(25, 'https://tse1.mm.bing.net/th/id/OIP.J6uA2efmD5pE-PmL1hySRAHaE8?pid=Api&h=220&P=0', 1, TRUE),
(26, 'https://cdn.tgdd.vn/2021/12/CookRecipe/Avatar/banh-mi-chao-thap-cam-thumbnail.jpg', 1, TRUE),
(27, 'https://images.squarespace-cdn.com/content/v1/52d3fafee4b03c7eaedee15f/ff773946-1ffb-4d0c-985a-923373d59fef/2023_01_10EOS+M505276.jpg', 1, TRUE),
(28, 'https://daylambanh.edu.vn/wp-content/uploads/2019/09/banh-mi-que-nho-xinh-600x400.jpg', 1, TRUE),
(29, 'https://i0.wp.com/scruffandsteph.com/wp-content/uploads/2021/03/Bo-Kho-2.jpg?ssl=1', 1, TRUE),
(30, 'https://cdn.netspace.edu.vn/images/2018/10/26/cach-lam-goi-ngo-sen-ngon-khong-dung-dua-1-1024.jpg', 1, TRUE),
(31, 'https://daotaobeptruong.vn/wp-content/uploads/2020/03/nom-hoa-chuoi.jpg', 1, TRUE),
(32, 'https://cdn.vntrip.vn/cam-nang/wp-content/uploads/2017/10/Capture-25.png', 1, TRUE),
(33, 'https://i.ytimg.com/vi/WIJTMsL10jc/hq720.jpg?sqp=-oaymwEhCK4FEIIDSFryq4qpAxMIARUAAAAAGAElAADIQj0AgKJD&rs=AOn4CLB9vu4tWLXBxfA9-No_0ibKCFtmpA', 1, TRUE),
(34, 'https://www.winrecipe.com/wp-content/uploads/2022/02/bo-tai-chanh-recipe-1.jpg', 1, TRUE),
(35, 'https://img-global.cpcdn.com/recipes/6aa101661b4144e7/751x532cq70/g%E1%BB%8Fi-cu%E1%BB%91n-chay-recipe-main-photo.jpg', 1, TRUE),
(36, 'https://i.ytimg.com/vi/kNKrw1hR7Kc/maxresdefault.jpg', 1, TRUE),
(37, 'https://i.ytimg.com/vi/Ji2wH-rhIys/maxresdefault.jpg', 1, TRUE),
(38, 'https://cdn.tgdd.vn/Files/2019/12/13/1226519/cach-nau-lau-mam-mien-tay-tru-danh-dam-vi-thom-ngon-202208251520259286.jpg', 1, TRUE),
(39, 'https://cdn.tgdd.vn/Files/2019/12/16/1227037/thanh-dam-bo-mat-cuoi-tuan-voi-2-mon-lau-nam-chay-thom-ngon-don-gian-va-de-lam-19.jpg', 1, TRUE),
(40, 'https://tse3.mm.bing.net/th/id/OIP.j5mq7G0_0lk7zzGAVlNrwgHaEv?pid=Api&h=220&P=0', 1, TRUE),
(41, 'https://tiki.vn/blog/wp-content/uploads/2023/08/rau-muong-xao-toi-thom-ngon-1-1.jpg', 1, TRUE),
(42, 'https://file.hstatic.net/1000394081/file/canh-chua-ca-loc-thom-ngon_bdcc7d49d9b6464d810a1cde9a3a5935.jpg', 1, TRUE),
(43, 'https://i.ytimg.com/vi/JCI-V3D1hPg/hq720.jpg?sqp=-oaymwEhCK4FEIIDSFryq4qpAxMIARUAAAAAGAElAADIQj0AgKJD&rs=AOn4CLCesDtT_PgmwYev_ky8AQrc1Fjn4g', 1, TRUE),
(44, 'https://cdn11.dienmaycholon.vn/filewebdmclnew/public/userupload/files/kien-thuc/cach-lam-canh-ga-chien-nuoc-mam/cach-lam-canh-ga-chien-nuoc-mam-4.jpg', 1, TRUE);