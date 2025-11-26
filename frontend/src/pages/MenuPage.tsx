import React, { useState, useMemo } from 'react';
import { Heart } from 'lucide-react';
import { useTranslation } from 'react-i18next';

interface Food {
  id: number;
  key: string;
  image: string;
  liked?: boolean;
}

// Mock Data with keys instead of hardcoded text
const MOCK_FOOD_DATA: Food[] = [
  {
    id: 1,
    key: 'pho',
    image: "/image/food/pho.jpg",
    liked: false,
  },
  {
    id: 2,
    key: 'banhmi',
    image: '/image/food/banhmi.png',
    liked: false,
  },
  {
    id: 3,
    key: 'buncha',
    image: '/image/food/buncha.jpg',
    liked: false,
  },
  {
    id: 4,
    key: 'comtam',
    image: '/image/food/comtam.jpg',
    liked: false,
  },
  {
    id: 5,
    key: 'goicuon',
    image: '/image/food/goicuon.jpg',
    liked: false,
  },
  {
    id: 6,
    key: 'banhxeo',
    image: '/image/food/banhxeo.jpg',
    liked: true,
  },
];

export default function MenuPage() {
  const { t } = useTranslation();
  const [foods, setFoods] = useState<Food[]>(MOCK_FOOD_DATA);
  const [currentPage, setCurrentPage] = useState(1);
  const [searchQuery, setSearchQuery] = useState('');
  const itemsPerPage = 6;

  // Transform categories to use translation keys
  const CATEGORIES = useMemo(() => ({
    'menu.categories.main_ingredients': [
      { id: 1, nameKey: 'menu.categories.items.all', count: 2567, checked: true },
      { id: 2, nameKey: 'menu.categories.items.beef', count: 65, checked: false },
      { id: 3, nameKey: 'menu.categories.items.pork', count: 12, checked: false },
      { id: 4, nameKey: 'menu.categories.items.chicken', count: 12, checked: false },
      { id: 5, nameKey: 'menu.categories.items.seafood', count: 13, checked: false },
      { id: 6, nameKey: 'menu.categories.items.vegetable', count: 12, checked: false },
    ],
    'menu.categories.dish_type': [
      { id: 7, nameKey: 'menu.categories.items.all', count: 2567, checked: true },
      { id: 8, nameKey: 'menu.categories.items.noodle', count: 65, checked: false },
      { id: 9, nameKey: 'menu.categories.items.rice', count: 12, checked: false },
      { id: 10, nameKey: 'menu.categories.items.bread', count: 12, checked: false },
      { id: 11, nameKey: 'menu.categories.items.side_dish', count: 13, checked: false },
      { id: 12, nameKey: 'menu.categories.items.salad', count: 12, checked: false },
      { id: 13, nameKey: 'menu.categories.items.hotpot', count: 12, checked: false },
    ],
    'menu.categories.preference': [
      { id: 14, nameKey: 'menu.categories.items.all', count: 2567, checked: true },
      { id: 15, nameKey: 'menu.categories.items.sour', count: 65, checked: false },
      { id: 16, nameKey: 'menu.categories.items.sweet', count: 12, checked: false },
      { id: 17, nameKey: 'menu.categories.items.herb', count: 12, checked: false },
      { id: 18, nameKey: 'menu.categories.items.light', count: 13, checked: false },
      { id: 19, nameKey: 'menu.categories.items.spicy', count: 12, checked: false },
    ],
  }), []);

  const handleToggleLike = (id: number) => {
    setFoods(
      foods.map((food) =>
        food.id === id ? { ...food, liked: !food.liked } : food
      )
    );
  };

  const handleCategoryChange = (categoryKey: string, index: number) => {
    // Mock implementation
    console.log(`Category ${categoryKey} item ${index} toggled`);
  };

  const filteredFoods = foods.filter((food) => {
    const name = t(`menu.items.${food.key}.name`);
    return name.toLowerCase().includes(searchQuery.toLowerCase());
  });

  const totalPages = Math.ceil(filteredFoods.length / itemsPerPage);
  const paginatedFoods = filteredFoods.slice(
    (currentPage - 1) * itemsPerPage,
    currentPage * itemsPerPage
  );

  return (
    <div className="w-full flex flex-col min-h-screen">
      {/* =========================== */}
      {/* Search Bar */}
      {/* =========================== */}
      <div className="w-full bg-white sticky top-0 z-10">
        <div className="max-w-6xl mx-auto px-6 py-4 flex gap-4">
          <input
            type="text"
            placeholder={t('menu.search.placeholder')}
            value={searchQuery}
            onChange={(e) => {
              setSearchQuery(e.target.value);
              setCurrentPage(1);
            }}
            className="flex-1 px-4 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-purple-600"
          />
          <button className="px-8 py-2 bg-purple-600 text-white font-semibold rounded-lg hover:bg-purple-700 transition">
            {t('menu.search.button')}
          </button>
        </div>
      </div>

      {/* =========================== */}
      {/* Main Content */}
      {/* =========================== */}
      <div className="max-w-6xl mx-auto w-full px-6 py-8 flex gap-8">
        {/* Sidebar - Categories */}
        <div className="w-1/5 flex-shrink-0">
          <div className="bg-[#f7f7f7] rounded-lg p-6 shadow-sm">
            {Object.entries(CATEGORIES).map(([categoryKey, items]) => (
              <div key={categoryKey} className="mb-6">
                <h3 className="font-bold text-sm mb-3 text-gray-800">
                  {t(categoryKey)}
                </h3>
                <ul className="space-y-2">
                  {items.map((item, index) => (
                    <li key={item.id} className="flex items-center gap-2">
                      <input
                        type="checkbox"
                        id={`cat-${item.id}`}
                        checked={item.checked}
                        onChange={() =>
                          handleCategoryChange(categoryKey, index)
                        }
                        className="w-4 h-4 accent-purple-600 cursor-pointer"
                      />
                      <label
                        htmlFor={`cat-${item.id}`}
                        className="text-sm cursor-pointer flex-1"
                      >
                        {t(item.nameKey)}
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
              {t('menu.filter.button')}
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
                className="bg-white rounded-lg shadow-md hover:shadow-lg transition overflow-hidden"
              >
                {/* Image */}
                <div className="relative w-full h-48 bg-gray-200 overflow-hidden group">
                  <img
                    src={food.image}
                    alt={t(`menu.items.${food.key}.name`)}
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
                    {t(`menu.items.${food.key}.name`)}
                  </h3>
                  <p className="text-sm text-gray-600 mb-3 line-clamp-2">
                    {t(`menu.items.${food.key}.desc`)}
                  </p>


                  {/* Detail Button */}
                  <button className="w-full py-2 border-2 border-gray-300 rounded-lg text-sm font-semibold hover:border-purple-600 hover:text-purple-600 transition">
                    {t('menu.view_details')}
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
              « {t('menu.pagination.prev')}
            </button>
            {Array.from({ length: totalPages }, (_, i) => i + 1).map(
              (page) => (
                <button
                  key={page}
                  onClick={() => setCurrentPage(page)}
                  className={`px-3 py-1 text-sm font-semibold rounded transition ${page === currentPage
                    ? 'bg-purple-600 text-white'
                    : 'hover:bg-gray-200'
                    }`}
                >
                  {page}
                </button>
              )
            )}
            <button className="px-3 py-1 text-sm font-semibold text-purple-600 hover:bg-purple-100 rounded transition">
              {t('menu.pagination.next')} »
            </button>
          </div>
        </div>
      </div>
    </div>
  );
}