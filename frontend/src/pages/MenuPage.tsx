import React, { useState } from 'react';
import { Heart } from 'lucide-react';

interface Food {
  id: number;
  name: string;
  nameJp: string;
  description: string;
  image: string;
  liked?: boolean;
}

// Mock Data
const MOCK_FOODS: Food[] = [
  {
    id: 1,
    name: 'Pho Bo',
    nameJp: 'フォー・ボー',
    description: '柔らかい牛肉と香りのよいスープが特徴の、ベトナムを代表する米麺料理。',
    image: "/food.jpg",
    liked: false,
  },
  {
    id: 2,
    name: 'Banh Mi',
    nameJp: 'バインミー',
    description: 'グリルした肉、パテ、野菜のピクルスを挟んだサクサクのベトナムサンドイッチ。',
    image: '/food.jpg',
    liked: false,
  },
  {
    id: 3,
    name: 'Bun Cha',
    nameJp: 'ブンチャー',
    description: '炭火焼豚肉とつくねを甘酸っぱいタレでいただくハノイ名物のつけ麺。',
    image: '/food.jpg',
    liked: false,
  },
  {
    id: 4,
    name: 'Com Tam',
    nameJp: 'コムタム',
    description: '焼豚、卵焼き、豚皮などと共に食べる、ベトナム南部の定番米料理。',
    image: '/food.jpg',
    liked: false,
  },
  {
    id: 5,
    name: 'Goi Cuon',
    nameJp: 'ゴイクォン',
    description: 'エビ、豚肉、ビーフン、新鮮な野菜をライスペーパーで巻いたヘルシーな前菜。',
    image: '/food.jpg',
    liked: false,
  },
  {
    id: 6,
    name: 'Banh Xeo',
    nameJp: 'バインセオ',
    description: 'エビと豚肉、もやし入りの、黄色くパリパリしたベトナム風のお好み焼き。',
    image: '/food.jpg',
    liked: true,
  },
];

const CATEGORIES = {
  主な食材: [
    { id: 1, name: '全部', count: 2567, checked: true },
    { id: 2, name: '牛肉', count: 65, checked: false },
    { id: 3, name: '豚肉', count: 12, checked: false },
    { id: 4, name: '鶏肉', count: 12, checked: false },
    { id: 5, name: '海鮮', count: 13, checked: false },
    { id: 6, name: '野菜 / ベジタリアン', count: 12, checked: false },
  ],
  料理の種類別: [
    { id: 7, name: '全部', count: 2567, checked: true },
    { id: 8, name: '麺料理', count: 65, checked: false },
    { id: 9, name: 'ご飯もの', count: 12, checked: false },
    { id: 10, name: 'パン料理', count: 12, checked: false },
    { id: 11, name: '惣菜物', count: 13, checked: false },
    { id: 12, name: 'サラダ', count: 12, checked: false },
    { id: 13, name: '鍋料理', count: 12, checked: false },
  ],
  嗜好别分類: [
    { id: 14, name: '全部', count: 2567, checked: true },
    { id: 15, name: '酸っぱい', count: 65, checked: false },
    { id: 16, name: '甘い', count: 12, checked: false },
    { id: 17, name: 'ハーブ＆香草', count: 12, checked: false },
    { id: 18, name: 'あっさり', count: 13, checked: false },
    { id: 19, name: '辛い', count: 12, checked: false },
  ],
};

export default function MenuPage() {
  const [foods, setFoods] = useState<Food[]>(MOCK_FOODS);
  const [currentPage, setCurrentPage] = useState(1);
  const [searchQuery, setSearchQuery] = useState('');
  const itemsPerPage = 6;

  const handleToggleLike = (id: number) => {
    setFoods(
      foods.map((food) =>
        food.id === id ? { ...food, liked: !food.liked } : food
      )
    );
  };

  const handleCategoryChange = (categoryName: string, index: number) => {
    // Mock implementation - thực tế sẽ filter foods
    console.log(`Category ${categoryName} item ${index} toggled`);
  };

  const filteredFoods = foods.filter((food) =>
    food.nameJp.toLowerCase().includes(searchQuery.toLowerCase())
  );

  const totalPages = Math.ceil(filteredFoods.length / itemsPerPage);
  const paginatedFoods = filteredFoods.slice(
    (currentPage - 1) * itemsPerPage,
    currentPage * itemsPerPage
  );

  return (
    <div className="w-full flex flex-col min-h-screen bg-gray-50">
      {/* =========================== */}
      {/* Search Bar */}
      {/* =========================== */}
      <div className="w-full bg-white border-b sticky top-0 z-10">
        <div className="max-w-6xl mx-auto px-6 py-4 flex gap-4">
          <input
            type="text"
            placeholder="料理名"
            value={searchQuery}
            onChange={(e) => {
              setSearchQuery(e.target.value);
              setCurrentPage(1);
            }}
            className="flex-1 px-4 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-purple-600"
          />
          <button className="px-8 py-2 bg-purple-600 text-white font-semibold rounded-lg hover:bg-purple-700 transition">
            検索
          </button>
        </div>
      </div>

      {/* =========================== */}
      {/* Main Content */}
      {/* =========================== */}
      <div className="max-w-6xl mx-auto w-full px-6 py-8 flex gap-8">
        {/* Sidebar - Categories */}
        <div className="w-1/5 flex-shrink-0">
          <div className="bg-white rounded-lg p-6 shadow-sm border">
            {Object.entries(CATEGORIES).map(([categoryName, items]) => (
              <div key={categoryName} className="mb-6">
                <h3 className="font-bold text-sm mb-3 text-gray-800">
                  {categoryName}
                </h3>
                <ul className="space-y-2">
                  {items.map((item, index) => (
                    <li key={item.id} className="flex items-center gap-2">
                      <input
                        type="checkbox"
                        id={`cat-${item.id}`}
                        checked={item.checked}
                        onChange={() =>
                          handleCategoryChange(categoryName, index)
                        }
                        className="w-4 h-4 accent-purple-600 cursor-pointer"
                      />
                      <label
                        htmlFor={`cat-${item.id}`}
                        className="text-sm cursor-pointer flex-1"
                      >
                        {item.name}
                      </label>
                      <span className="text-xs text-gray-500">
                        ({item.count})
                      </span>
                    </li>
                  ))}
                </ul>
                <hr className="my-4" />
              </div>
            ))}
            <button className="w-full py-2 bg-purple-600 text-white font-semibold rounded-lg hover:bg-purple-700 transition">
              絞り込み
            </button>
          </div>
        </div>

        {/* Main Content - Food Grid */}
        <div className="flex-1">
          {/* Grid Cards */}
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6 mb-8">
            {paginatedFoods.map((food) => (
              <div
                key={food.id}
                className="bg-white rounded-lg shadow-md hover:shadow-lg transition overflow-hidden border"
              >
                {/* Image */}
                <div className="relative w-full h-48 bg-gray-200 overflow-hidden group">
                  <img
                    src={food.image}
                    alt={food.nameJp}
                    className="w-full h-full object-cover group-hover:scale-105 transition"
                  />
                  {/* Like Button */}
                  <button
                    onClick={() => handleToggleLike(food.id)}
                    aria-label="like"
                    className="absolute top-2 right-2 z-0 bg-white rounded-full p-2 shadow-md hover:bg-gray-100 transition"
                  >
                    <Heart
                      size={20}
                      className={food.liked ? 'fill-red-500 text-red-500' : 'text-gray-400'}
                    />
                  </button>
                </div>

                {/* Content */}
                <div className="p-4">
                  <h3 className="font-bold text-lg mb-1 text-gray-800 text-center">
                    {food.nameJp}
                  </h3>
                  <p className="text-sm text-gray-600 mb-3 line-clamp-2">
                    {food.description}
                  </p>


                  {/* Detail Button */}
                  <button className="w-full py-2 border-2 border-gray-300 rounded-lg text-sm font-semibold hover:border-purple-600 hover:text-purple-600 transition">
                    詳細
                  </button>
                </div>
              </div>
            ))}
          </div>

          {/* =========================== */}
          {/* Pagination */}
          {/* =========================== */}
          <div className="flex items-center justify-center gap-2 mb-8">
            <button className="px-3 py-1 text-sm font-semibold text-purple-600 hover:bg-purple-100 rounded transition">
              « 前へ
            </button>
            {Array.from({ length: totalPages }, (_, i) => i + 1).map(
              (page) => (
                <button
                  key={page}
                  onClick={() => setCurrentPage(page)}
                  className={`px-3 py-1 text-sm font-semibold rounded transition ${
                    page === currentPage
                      ? 'bg-purple-600 text-white'
                      : 'hover:bg-gray-200'
                  }`}
                >
                  {page}
                </button>
              )
            )}
            <button className="px-3 py-1 text-sm font-semibold text-purple-600 hover:bg-purple-100 rounded transition">
              次へ »
            </button>
          </div>
        </div>
      </div>
    </div>
  );
}