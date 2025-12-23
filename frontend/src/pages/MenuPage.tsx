import { useState, useEffect, useCallback, useRef } from 'react';
import { Heart } from 'lucide-react';
import { useTranslation } from 'react-i18next';
import { useNavigate, useSearchParams } from 'react-router-dom';
import { favoritesApi } from "@/api/favorites.api";
import { useAuth } from "@/context/AuthContext";

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
  types: FilterOption[];
  flavors: FilterOption[];
  ingredients: FilterOption[];
}

import { api } from "@/api/client";

export default function MenuPage() {
  const { t, i18n } = useTranslation();
  const navigate = useNavigate();
  const { isLoggedIn } = useAuth();

  const [foods, setFoods] = useState<Food[]>([]);
  const [loading, setLoading] = useState(true);
  const [contentLoading, setContentLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);

  const [currentPage, setCurrentPage] = useState(1);
  const itemsPerPage = 6;

  const [searchParams, setSearchParams] = useSearchParams();

  // Initialize state from URL if present
  const [searchQuery, setSearchQuery] = useState(searchParams.get('search') || '');

  const [filterOptions, setFilterOptions] = useState<FilterData>({
    types: [],
    flavors: [],
    ingredients: []
  });

  // Helper to parse comma-separated IDs from URL
  const getIdsFromUrl = (paramInfo: string | null) => {
    return paramInfo ? paramInfo.split(',').map(Number).filter(n => !isNaN(n)) : [];
  };

  const [selectedFilters, setSelectedFilters] = useState({
    types: getIdsFromUrl(searchParams.get('types')),
    flavors: getIdsFromUrl(searchParams.get('flavors')),
    ingredients: getIdsFromUrl(searchParams.get('ingredients'))
  });

  useEffect(() => {
    // Build UI filter lists from i18n so they change with current locale
    setFilterOptions({
      types: [
        { id: 0, name: t('menu.categories.items.all') },
        { id: 1, name: t('menu.categories.items.noodle') },
        { id: 2, name: t('menu.categories.items.rice') },
        { id: 3, name: t('menu.categories.items.bread') },
        { id: 4, name: t('menu.categories.items.side_dish') },
        { id: 5, name: t('menu.categories.items.salad') },
        { id: 6, name: t('menu.categories.items.hotpot') },
      ],
      flavors: [
        { id: 0, name: t('menu.categories.items.all') },
        { id: 1, name: t('menu.categories.items.sour') },
        { id: 2, name: t('menu.categories.items.sweet') },
        { id: 3, name: t('menu.categories.items.herb') },
        { id: 4, name: t('menu.categories.items.light') },
        { id: 5, name: t('menu.categories.items.spicy') },
      ],
      ingredients: [
        { id: 0, name: t('menu.categories.items.all') },
        { id: 1, name: t('menu.categories.items.beef') },
        { id: 2, name: t('menu.categories.items.pork') },
        { id: 3, name: t('menu.categories.items.chicken') },
        { id: 4, name: t('menu.categories.items.seafood') },
        { id: 5, name: t('menu.categories.items.vegetable') },
      ],
    });

    // fetch initial foods (full page loading on first load)
    // We don't fetch here anymore, the searchParams effect will handle it
    // But we need to ensure initial load happens if params are empty.
    // Actually, searchParams effect runs on mount, so we are good.
  }, [i18n.language, t]); // Added t to dependency

  // Sync Local State with URL when URL changes (e.g. Back button)
  useEffect(() => {
    const search = searchParams.get('search') || '';
    const types = getIdsFromUrl(searchParams.get('types'));
    const flavors = getIdsFromUrl(searchParams.get('flavors'));
    const ingredients = getIdsFromUrl(searchParams.get('ingredients'));
    const page = parseInt(searchParams.get('page') || '1', 10);

    setSearchQuery(search);
    setSelectedFilters({ types, flavors, ingredients });
    setCurrentPage(page);

    fetchFoods({
      search,
      types,
      flavors,
      ingredients,
      page,
      full: loading // Use existing full loading state for first fetch
    });
  }, [searchParams, i18n.language]);

  const fetchFoods = useCallback(async (opts?: {
    full?: boolean;
    search?: string;
    types?: number[];
    flavors?: number[];
    ingredients?: number[];
    page?: number;
  }) => {
    try {
      // full=true means initial/full-page load (show full-screen spinner). Otherwise show inline spinner in content area.
      if (opts?.full) {
        setLoading(true);
      } else {
        setContentLoading(true);
      }

      setError(null);

      setError(null);

      const params = new URLSearchParams();

      // Use passed options or fallback to current state (though we aim to always pass opts via the effect)
      // Note: Inside fetchFoods, we shouldn't rely on state if we want to be pure, but for safety:
      const sQuery = opts?.search !== undefined ? opts.search : searchQuery;
      const sTypes = opts?.types !== undefined ? opts.types : selectedFilters.types;
      const sFlavors = opts?.flavors !== undefined ? opts.flavors : selectedFilters.flavors;
      const sIngredients = opts?.ingredients !== undefined ? opts.ingredients : selectedFilters.ingredients;
      // We ignore page param for API for now as the backend apparently doesn't support pagination via params yet? 
      // Or does it? The original code didn't send 'page'. It did client-side pagination.
      // We will keep client-side pagination for now as per original code logic (slice),
      // BUT we should update the 'currentPage' state if we want URL to control it.

      if (sQuery.trim()) {
        params.append('search', sQuery.trim());
      }

      if (sTypes.length > 0)
        params.append('types', sTypes.join(','));

      if (sFlavors.length > 0)
        params.append('flavors', sFlavors.join(','));

      if (sIngredients.length > 0)
        params.append('ingredients', sIngredients.join(','));

      // include language so backend returns localized labels
      params.append('lang', i18n.language);

      //call  API: /foods?search=abc&regions=1,2&lang=ja
      const response = await api.get(`/foods?${params.toString()}`);

      const data = response.data;

      let foodsData = data.map((food: Food) => ({ ...food, liked: false }));

      if (isLoggedIn) {
        try {
          const userFavorites = await favoritesApi.getFavorites('food');
          const likedIds = new Set(userFavorites.map((f: any) => f.target_id || f.food_id));
          foodsData = foodsData.map((f: Food) => ({
            ...f,
            liked: likedIds.has(f.food_id)
          }));
        } catch (e) {
          console.error("Failed to fetch favorites", e);
        }
      }

      setFoods(foodsData);

      // If page was passed in opts, use it, otherwise 1
      if (opts?.page) setCurrentPage(opts.page);

    } catch (err) {
      setError(err instanceof Error ? err.message : 'An error occurred');
    } finally {
      if (opts?.full) {
        setLoading(false);
      } else {
        setContentLoading(false);
      }
    }
  }, [i18n.language, isLoggedIn]); // Removed searchQuery and selectedFilters dependencies to break cycle

  // Debounced search: trigger a content fetch 500ms after typing stops.
  // Filters remain manual — they only run when the Filter button is clicked.
  const searchDidMountRef = useRef(false);
  // Debounced search: updates URL
  useEffect(() => {
    if (!searchDidMountRef.current) {
      searchDidMountRef.current = true;
      return;
    }

    const handler = setTimeout(() => {
      // Update URL with search query
      updateUrlParams({ search: searchQuery });
    }, 500);

    return () => clearTimeout(handler);
  }, [searchQuery]);

  const updateUrlParams = (updates: any) => {
    setSearchParams(prev => {
      const newParams = new URLSearchParams(prev);

      // Update Search
      if (updates.search !== undefined) {
        if (updates.search) newParams.set('search', updates.search);
        else newParams.delete('search');
      }

      // Update Types
      if (updates.types !== undefined) {
        if (updates.types.length > 0) newParams.set('types', updates.types.join(','));
        else newParams.delete('types');
      }

      // Update Flavors
      if (updates.flavors !== undefined) {
        if (updates.flavors.length > 0) newParams.set('flavors', updates.flavors.join(','));
        else newParams.delete('flavors');
      }

      // Update Ingredients
      if (updates.ingredients !== undefined) {
        if (updates.ingredients.length > 0) newParams.set('ingredients', updates.ingredients.join(','));
        else newParams.delete('ingredients');
      }

      // Reset page on filter/search change
      newParams.delete('page');

      return newParams;
    });
  };

  const applyFilters = () => {
    updateUrlParams({
      types: selectedFilters.types,
      flavors: selectedFilters.flavors,
      ingredients: selectedFilters.ingredients
    });
  };

  const handleCheckboxChange = (type: keyof typeof selectedFilters, id: number) => {
    setSelectedFilters(prev => {
      const list = prev[type];

      // If user clicks "全部" (id === 0), clear selections for that category
      if (id === 0) {
        // If already empty (already '全部'), do nothing
        if (list.length === 0) return prev;
        return { ...prev, [type]: [] };
      }

      // Toggle specific id; selecting any item removes the implicit '全部' state
      const newList = list.includes(id)
        ? list.filter(item => item !== id)
        : [...list, id];

      return { ...prev, [type]: newList };
    });
  };

  const handleToggleLike = async (food_id: number) => {
    if (!isLoggedIn) {
      // Prompt login or redirect
      alert("Please login to favorite items");
      return;
    }

    // Optimistic update
    setFoods(foods.map(f => f.food_id === food_id ? { ...f, liked: !f.liked } : f));

    try {
      await favoritesApi.toggleFavorite(food_id, 'food');
    } catch (error) {
      // Revert on error
      console.error("Failed to toggle favorite", error);
      setFoods(foods.map(f => f.food_id === food_id ? { ...f, liked: !f.liked } : f));
    }
  };

  const clearAllFilters = async () => {
    setSearchQuery('');
    setSelectedFilters({ types: [], flavors: [], ingredients: [] });
    setSearchParams(new URLSearchParams()); // Clear URL params
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
            onKeyDown={(e) => e.key === 'Enter' && updateUrlParams({ search: searchQuery })}
            className="flex-1 px-4 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-purple-600"
          />
          <button
            onClick={() => updateUrlParams({ search: searchQuery })}
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

                {/* 主な食材別 */}
                <div className="mb-6">
                  <h3 className="font-bold text-sm mb-3 text-gray-800">{t('menu.categories.main_ingredients')}</h3>
                  <ul className="space-y-2 max-h-60 overflow-y-auto">
                    {filterOptions.ingredients.map(opt => (
                      <li key={opt.id} className="flex items-center gap-2">
                        <input
                          type="checkbox"
                          id={`ing-${opt.id}`}
                          checked={opt.id === 0 ? selectedFilters.ingredients.length === 0 : selectedFilters.ingredients.includes(opt.id)}
                          onChange={() => handleCheckboxChange('ingredients', opt.id)}
                          className="w-4 h-4 accent-purple-600 cursor-pointer"
                        />
                        <label htmlFor={`ing-${opt.id}`} className="text-sm cursor-pointer flex-1">{opt.name}</label>
                      </li>
                    ))}
                  </ul>
                  <hr className="my-4" />
                </div>

                {/* 料理の種類別 */}
                <div className="mb-6">
                  <h3 className="font-bold text-sm mb-3 text-gray-800">{t('menu.categories.dish_type')}</h3>
                  <ul className="space-y-2">
                    {filterOptions.types.map(opt => (
                      <li key={opt.id} className="flex items-center gap-2">
                        <input
                          type="checkbox"
                          id={`type-${opt.id}`}
                          checked={opt.id === 0 ? selectedFilters.types.length === 0 : selectedFilters.types.includes(opt.id)}
                          onChange={() => handleCheckboxChange('types', opt.id)}
                          className="w-4 h-4 accent-purple-600 cursor-pointer"
                        />
                        <label htmlFor={`type-${opt.id}`} className="text-sm cursor-pointer flex-1">{opt.name}</label>
                      </li>
                    ))}
                  </ul>
                  <hr className="my-4" />
                </div>

                {/* 特徴的な味 */}
                <div className="mb-6">
                  <h3 className="font-bold text-sm mb-3 text-gray-800">{t('menu.categories.preference')}</h3>
                  <ul className="space-y-2">
                    {filterOptions.flavors.map(opt => (
                      <li key={opt.id} className="flex items-center gap-2">
                        <input
                          type="checkbox"
                          id={`flav-${opt.id}`}
                          checked={opt.id === 0 ? selectedFilters.flavors.length === 0 : selectedFilters.flavors.includes(opt.id)}
                          onChange={() => handleCheckboxChange('flavors', opt.id)}
                          className="w-4 h-4 accent-purple-600 cursor-pointer"
                        />
                        <label htmlFor={`flav-${opt.id}`} className="text-sm cursor-pointer flex-1">{opt.name}</label>
                      </li>
                    ))}
                  </ul>
                  <hr className="my-4" />
                </div>

                {/* filter button */}
                <button
                  onClick={applyFilters}
                  className="w-full py-2 bg-purple-600 text-white font-semibold rounded-lg hover:bg-purple-700 transition"
                >
                  {t('menu.filter.button') || 'Lọc kết quả'}
                </button>
              </div>
            </div>

            {/* === LIST === */}
            <div className="flex-1">
              {contentLoading ? (
                <div className="flex-1 flex items-center justify-center min-h-[200px]">
                  <div className="text-center">
                    <div className="animate-spin rounded-full h-10 w-10 border-b-2 border-purple-600 mx-auto mb-2"></div>
                    <p className="text-gray-600">{t('common.loading') || 'Loading...'}</p>
                  </div>
                </div>
              ) : foods.length > 0 ? (
                <>
                  {/* Grid Cards */}
                  <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6 mb-8">
                    {paginatedFoods.map((food) => (
                      <div
                        key={food.food_id}
                        className="bg-white rounded-lg shadow-md hover:shadow-lg transition overflow-hidden flex flex-col"
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

                        <div className="p-4 flex flex-col flex-1">
                          <h3 className="font-bold text-lg mb-1 text-gray-800 text-center">
                            {food.name}
                          </h3>

                          <p className="text-sm text-gray-600 mb-3 line-clamp-2">
                            {food.story || food.ingredient || ''}
                          </p>

                          <button
                            onClick={() => navigate(`/foods/${food.food_id}`)}
                            className="mt-auto w-full py-2 border-2 border-gray-300 rounded-lg text-sm font-semibold hover:border-purple-600 hover:text-purple-600 transition"
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
                      onClick={() => {
                        const p = Math.max(1, currentPage - 1);
                        setCurrentPage(p);
                        setSearchParams(prev => {
                          const params = new URLSearchParams(prev);
                          params.set('page', p.toString());
                          return params;
                        });
                      }}
                      disabled={currentPage === 1}
                      className="px-3 py-1 text-sm font-semibold text-purple-600 hover:bg-purple-100 rounded transition disabled:opacity-50"
                    >
                      « {t('menu.pagination.prev')}
                    </button>

                    {Array.from({ length: totalPages }, (_, i) => i + 1).map((page) => (
                      <button
                        key={page}
                        onClick={() => {
                          setCurrentPage(page);
                          setSearchParams(prev => {
                            const p = new URLSearchParams(prev);
                            p.set('page', page.toString());
                            return p;
                          });
                        }}
                        className={`px-3 py-1 text-sm font-semibold rounded transition ${page === currentPage
                          ? 'bg-purple-600 text-white'
                          : 'hover:bg-gray-200'
                          }`}
                      >
                        {page}
                      </button>
                    ))}

                    <button
                      onClick={() => {
                        const p = Math.min(totalPages, currentPage + 1);
                        setCurrentPage(p);
                        setSearchParams(prev => {
                          const params = new URLSearchParams(prev);
                          params.set('page', p.toString());
                          return params;
                        });
                      }}
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