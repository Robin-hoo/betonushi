import { useState, useEffect } from 'react';
import { Heart } from 'lucide-react';
import { useTranslation } from 'react-i18next';
import { useNavigate } from 'react-router-dom';

interface Food {
  food_id: number;
  name: string;
  story: string;
  ingredient: string;
  taste: string;
  style: string;
  comparison: string;
  region_id: number;
  view_count: number;
  rating: number;
  number_of_rating: number;
  created_at: string;
  image_url: string | null;
  liked?: boolean;
}

interface FilterOption {
  id: number;
  name: string;
}

interface FilterData {
  regions: FilterOption[];
  flavors: FilterOption[];
  ingredients: FilterOption[];
}

const API_BASE_URL = import.meta.env.VITE_API_URL || 'http://localhost:3000/api';

export default function MenuPage() {
  const { t } = useTranslation();
  const navigate = useNavigate();

  const [foods, setFoods] = useState<Food[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  
  const [currentPage, setCurrentPage] = useState(1);
  const itemsPerPage = 6;

  const [searchQuery, setSearchQuery] = useState('');

  const [filterOptions, setFilterOptions] = useState<FilterData>({
    regions: [],
    flavors: [],
    ingredients: []
  });

  const [selectedFilters, setSelectedFilters] = useState({
    regions: [] as number[],
    flavors: [] as number[],
    ingredients: [] as number[]
  });

  useEffect(() => {
    const initPage = async () => {
      try {
        const filterRes = await fetch(`${API_BASE_URL}/filters`);
        if (filterRes.ok) {
          setFilterOptions(await filterRes.json());
        }
      
        await fetchFoods(); 
      } catch (err) {
        console.error("Initialization error:", err);
      }
    };
    initPage();
  }, []);

  const fetchFoods = async () => {
    try {
      setLoading(true);
      setError(null);
      
      const params = new URLSearchParams();
      
      if (searchQuery.trim()) {
        params.append('search', searchQuery.trim());
      }
      
      if (selectedFilters.regions.length > 0) 
        params.append('regions', selectedFilters.regions.join(','));
      
      if (selectedFilters.flavors.length > 0) 
        params.append('flavors', selectedFilters.flavors.join(','));
        
      if (selectedFilters.ingredients.length > 0) 
        params.append('ingredients', selectedFilters.ingredients.join(','));

      //call  API: /foods?search=abc&regions=1,2
      const response = await fetch(`${API_BASE_URL}/foods?${params.toString()}`);
      
      if (!response.ok) throw new Error('Failed to fetch foods');
      
      const data = await response.json();
      setFoods(data.map((food: Food) => ({ ...food, liked: false })));
      setCurrentPage(1);
    } catch (err) {
      setError(err instanceof Error ? err.message : 'An error occurred');
    } finally {
      setLoading(false);
    }
  };

  const handleCheckboxChange = (type: keyof typeof selectedFilters, id: number) => {
    setSelectedFilters(prev => {
      const list = prev[type];
      const newList = list.includes(id) 
        ? list.filter(item => item !== id) 
        : [...list, id];
      return { ...prev, [type]: newList };
    });
  };

  const handleToggleLike = (food_id: number) => {
    setFoods(foods.map(f => f.food_id === food_id ? { ...f, liked: !f.liked } : f));
  };

  const clearAllFilters = () => {
    setSearchQuery('');
    setSelectedFilters({ regions: [], flavors: [], ingredients: [] });
    window.location.reload();
  };

  const totalPages = Math.ceil(foods.length / itemsPerPage);
  const paginatedFoods = foods.slice(
    (currentPage - 1) * itemsPerPage,
    currentPage * itemsPerPage
  );

  return (
    <div className="w-full flex flex-col min-h-screen">
      
      {/* =========================== */}
      {/* Search Bar */}
      {/* =========================== */}
      <div className="w-full bg-white sticky top-0 z-10 shadow-sm">
        <div className="max-w-6xl mx-auto px-6 py-4 flex gap-4">
          <input
            type="text"
            placeholder={t('menu.search.placeholder') || "Tìm kiếm món ăn..."}
            value={searchQuery}
            onChange={(e) => setSearchQuery(e.target.value)}
            onKeyDown={(e) => e.key === 'Enter' && fetchFoods()}
            className="flex-1 px-4 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-purple-600"
          />
          <button 
            onClick={fetchFoods} 
            className="px-8 py-2 bg-purple-600 text-white font-semibold rounded-lg hover:bg-purple-700 transition"
          >
            {t('menu.search.button')}
          </button>
        </div>
      </div>

      {/* =========================== */}
      {/* Main Content */}
      {/* =========================== */}
      <div className="max-w-6xl mx-auto w-full px-6 py-8 flex gap-8">
        
        {/* Loading State */}
        {loading && (
          <div className="flex-1 flex items-center justify-center min-h-[400px]">
            <div className="text-center">
              <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-purple-600 mx-auto mb-4"></div>
              <p className="text-gray-600">{t('common.loading') || 'Loading...'}</p>
            </div>
          </div>
        )}

        {/* Error State */}
        {error && !loading && (
          <div className="flex-1 flex items-center justify-center min-h-[400px]">
            <div className="text-center">
              <p className="text-red-600 mb-4">{t('common.error')}: {error}</p>
              <button
                onClick={() => window.location.reload()}
                className="px-6 py-2 bg-purple-600 text-white rounded-lg hover:bg-purple-700 transition"
              >
                {t('common.retry') || 'Thử lại'}
              </button>
            </div>
          </div>
        )}

        {/* Content Body */}
        {!loading && !error && (
          <>
            {/* === SIDEBAR === */}
            <div className="w-1/5 flex-shrink-0">
              <div className="bg-[#f7f7f7] rounded-lg p-6 shadow-sm">
                
                {/* 1. region */}
                <div className="mb-6">
                  <h3 className="font-bold text-sm mb-3 text-gray-800">{t('menu.filter.region')}</h3>
                  <ul className="space-y-2">
                    {filterOptions.regions.map(opt => (
                      <li key={opt.id} className="flex items-center gap-2">
                        <input
                          type="checkbox"
                          id={`reg-${opt.id}`}
                          checked={selectedFilters.regions.includes(opt.id)}
                          onChange={() => handleCheckboxChange('regions', opt.id)}
                          className="w-4 h-4 accent-purple-600 cursor-pointer"
                        />
                        <label htmlFor={`reg-${opt.id}`} className="text-sm cursor-pointer flex-1">{opt.name}</label>
                      </li>
                    ))}
                  </ul>
                  <hr className="my-4" />
                </div>

                {/* 2. flavor */}
                <div className="mb-6">
                  <h3 className="font-bold text-sm mb-3 text-gray-800">{t('menu.categories.preference')}</h3>
                  <ul className="space-y-2">
                    {filterOptions.flavors.map(opt => (
                      <li key={opt.id} className="flex items-center gap-2">
                        <input
                          type="checkbox"
                          id={`flav-${opt.id}`}
                          checked={selectedFilters.flavors.includes(opt.id)}
                          onChange={() => handleCheckboxChange('flavors', opt.id)}
                          className="w-4 h-4 accent-purple-600 cursor-pointer"
                        />
                        <label htmlFor={`flav-${opt.id}`} className="text-sm cursor-pointer flex-1">{opt.name}</label>
                      </li>
                    ))}
                  </ul>
                  <hr className="my-4" />
                </div>

                {/* 3. ingredient */}
                <div className="mb-6">
                  <h3 className="font-bold text-sm mb-3 text-gray-800">{t('menu.categories.main_ingredients')}</h3>
                  <ul className="space-y-2 max-h-60 overflow-y-auto">
                    {filterOptions.ingredients.map(opt => (
                      <li key={opt.id} className="flex items-center gap-2">
                        <input
                          type="checkbox"
                          id={`ing-${opt.id}`}
                          checked={selectedFilters.ingredients.includes(opt.id)}
                          onChange={() => handleCheckboxChange('ingredients', opt.id)}
                          className="w-4 h-4 accent-purple-600 cursor-pointer"
                        />
                        <label htmlFor={`ing-${opt.id}`} className="text-sm cursor-pointer flex-1">{opt.name}</label>
                      </li>
                    ))}
                  </ul>
                  <hr className="my-4" />
                </div>

                {/* filter button */}
                <button 
                  onClick={fetchFoods}
                  className="w-full py-2 bg-purple-600 text-white font-semibold rounded-lg hover:bg-purple-700 transition"
                >
                  {t('menu.filter.button') || 'Lọc kết quả'}
                </button>
              </div>
            </div>

            {/* === LIST === */}
            <div className="flex-1">
              {foods.length > 0 ? (
                <>
                  {/* Grid Cards */}
                  <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6 mb-8">
                    {paginatedFoods.map((food) => (
                      <div
                        key={food.food_id}
                        className="bg-white rounded-lg shadow-md hover:shadow-lg transition overflow-hidden"
                      >
                        <div className="relative w-full h-48 bg-gray-200 overflow-hidden group">
                          <img
                            src={food.image_url || '/image/placeholder.jpg'}
                            alt={food.name}
                            className="w-full h-full object-cover group-hover:scale-105 transition"
                          />
                          <button
                            onClick={() => handleToggleLike(food.food_id)}
                            className="absolute top-2 right-2 z-0 bg-white rounded-full p-2 shadow-md hover:bg-gray-100 transition"
                          >
                            <Heart
                              size={20}
                              className={food.liked ? 'fill-red-500 text-red-500' : 'text-gray-400'}
                            />
                          </button>
                        </div>

                        <div className="p-4">
                          <h3 className="font-bold text-lg mb-1 text-gray-800 text-center">
                            {food.name}
                          </h3>
                          <p className="text-sm text-gray-600 mb-3 line-clamp-2">
                            {food.story || food.ingredient || ''}
                          </p>
                          <button
                            onClick={() => navigate(`/foods/${food.food_id}`)}
                            className="w-full py-2 border-2 border-gray-300 rounded-lg text-sm font-semibold hover:border-purple-600 hover:text-purple-600 transition"
                          >
                            {t('menu.view_details')}
                          </button>
                        </div>
                      </div>
                    ))}
                  </div>

                  {/* Pagination */}
                  <div className="flex items-center justify-center gap-2 mb-8">
                    <button 
                      onClick={() => setCurrentPage(p => Math.max(1, p - 1))}
                      disabled={currentPage === 1}
                      className="px-3 py-1 text-sm font-semibold text-purple-600 hover:bg-purple-100 rounded transition disabled:opacity-50"
                    >
                      « {t('menu.pagination.prev')}
                    </button>
                    
                    {Array.from({ length: totalPages }, (_, i) => i + 1).map((page) => (
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
                    ))}
                    
                    <button 
                      onClick={() => setCurrentPage(p => Math.min(totalPages, p + 1))}
                      disabled={currentPage === totalPages}
                      className="px-3 py-1 text-sm font-semibold text-purple-600 hover:bg-purple-100 rounded transition disabled:opacity-50"
                    >
                      {t('menu.pagination.next')} »
                    </button>
                  </div>
                </>
              ) : (
                /* === No Results State === */
                <div className="flex flex-col items-center justify-center py-12 text-center bg-white rounded-lg shadow-sm border border-gray-100 h-96 col-span-full">
                  <div className="bg-gray-100 p-4 rounded-full mb-4">
                    <svg xmlns="http://www.w3.org/2000/svg" className="h-12 w-12 text-gray-400" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M21 21l-6-6m2-5a7 7 0 11-14 0 7 7 0 0114 0z" />
                    </svg>
                  </div>
                  
                  <h3 className="text-xl font-medium text-gray-800 mb-2">
                    {t('menu.no_results.title')}
                  </h3>
                  
                  <p className="text-gray-500 max-w-md">
                    {t('menu.no_results.message', { keyword: searchQuery })}
                  </p>
                  
                  {/* clear button */}
                  <button 
                    onClick={clearAllFilters}
                    className="mt-6 px-6 py-2 bg-purple-100 text-purple-700 font-medium rounded-full hover:bg-purple-200 transition"
                  >
                    {t('menu.no_results.clear_search')}
                  </button>
                </div>
              )}
            </div>
          </>
        )}
      </div>
    </div>
  );
}