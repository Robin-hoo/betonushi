import { useEffect, useState } from "react";
import { useTranslation } from "react-i18next";
import { Heart } from 'lucide-react';
import { favoritesApi } from "@/api/favorites.api";
import { useAuth } from "@/context/AuthContext";
import { useNavigate } from "react-router-dom";
import { useFavorites } from "@/context/FavoritesContext";

// Definition of Food interface based on usage in HomePage/favoritesModel
// Should ideally be shared
interface Food {
  food_id: number;
  name: string;
  story: string;
  taste: string;
  image_url: string;
  rating: number;
}

export default function FavoritesPage() {
  const { t, i18n } = useTranslation();
  const { isLoggedIn } = useAuth();
  const navigate = useNavigate();
  const { favoriteFoodIds, toggleFavorite, refreshFavorites } = useFavorites();

  // We still need to store Food objects (details)
  const [foodsMap, setFoodsMap] = useState<Map<number, Food>>(new Map());
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    if (!isLoggedIn) {
      navigate('/login');
      return;
    }

    const loadFavorites = async () => {
      setLoading(true);
      try {
        // Fetch full details of favorites
        const data: Food[] = await favoritesApi.getFavorites('food', i18n.language);

        // Update our local map of food details
        const newMap = new Map<number, Food>();
        data.forEach(f => newMap.set(f.food_id, f));
        setFoodsMap(newMap);

        // Also ensure context is up to date (though App global refresh might handle it, safety first)
        await refreshFavorites();
      } catch (err) {
        console.error("Failed to load favorites", err);
      } finally {
        setLoading(false);
      }
    };

    loadFavorites();
  }, [isLoggedIn, navigate, i18n.language, refreshFavorites]);

  // Derived favorites list: Intersection of fetched Details + Context IDs
  // This ensures if context updates (unliked), it disappears from here.
  const favorites = Array.from(foodsMap.values()).filter(f => favoriteFoodIds.has(f.food_id));

  const [loadingIds, setLoadingIds] = useState<number[]>([]);
  const [currentPage, setCurrentPage] = useState(1);
  const itemsPerPage = 8;

  // When favorites change, ensure current page is valid
  useEffect(() => {
    const totalPages = Math.max(1, Math.ceil(favorites.length / itemsPerPage));
    if (currentPage > totalPages) setCurrentPage(totalPages);
  }, [favorites.length]);

  const handleToggle = async (e: React.MouseEvent<HTMLButtonElement>, id: number) => {
    e.preventDefault();
    e.stopPropagation();

    if (!isLoggedIn) return;

    setLoadingIds(prev => [...prev, id]);
    try {
      await toggleFavorite(id, 'food');
    } finally {
      setLoadingIds(prev => prev.filter(i => i !== id));
    }
  };

  if (loading) {
    return <div className="flex justify-center p-10">Loading...</div>;
  }

  return (
    <div className="w-full flex flex-col gap-10 py-10">
      <div className="max-w-6xl mx-auto px-4 w-full">
        <div className="flex items-center justify-center mb-8 relative">
          <span className="text-6xl font-bold">
            {t("FavoritesPage.title") /* e.g. "Favorites" */}
          </span>
        </div>

        {favorites.length === 0 ? (
          <div className="text-center text-gray-500 py-20">
            <p className="text-xl">{t("FavoritesPage.no_favorites")}</p>
            <a href="/" className="text-orange-500 hover:underline mt-4 block">{t("FavoritesPage.browse_menu")}</a>
          </div>
        ) : (
          <>
            <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-4 gap-16 justify-end">
              {(favorites.slice((currentPage - 1) * itemsPerPage, currentPage * itemsPerPage)).map((item) => (
                <div key={item.food_id} className="bg-white rounded-lg shadow-md hover:shadow-lg transition overflow-hidden flex flex-col">
                  <div className="relative w-full h-48 bg-gray-200 overflow-hidden group">
                    <img
                      src={item.image_url || '/image/placeholder.jpg'}
                      alt={item.name}
                      className="w-full h-full object-cover group-hover:scale-105 transition"
                    />

                    <button
                      onClick={(e) => handleToggle(e, item.food_id)}
                      disabled={loadingIds.includes(item.food_id)}
                      className="absolute top-2 right-2 z-10 bg-white rounded-full p-2 shadow-md hover:bg-gray-100 transition"
                    >
                      <Heart
                        size={20}
                        className="fill-red-500 text-red-500"
                      />
                    </button>
                  </div>

                  <div className="p-4 flex flex-col flex-1">
                    <h3 className="font-bold text-lg mb-1 text-gray-800 text-center">
                      {item.name}
                    </h3>

                    <p className="text-sm text-gray-600 mb-3 line-clamp-2">
                      {item.story || ''}
                    </p>

                    <button
                      onClick={() => navigate(`/foods/${item.food_id}`)}
                      className="mt-auto w-full py-2 border-2 border-gray-300 rounded-lg text-sm font-semibold hover:border-purple-600 hover:text-purple-600 transition"
                    >
                      {t('menu.view_details')}
                    </button>
                  </div>
                </div>
              ))}
            </div>

            {/* Pagination (only show if more than 1 page) */}
            {Math.ceil(favorites.length / itemsPerPage) > 1 && (
              <div className="flex items-center justify-center gap-2 mt-8">
                <button
                  onClick={() => setCurrentPage(p => Math.max(1, p - 1))}
                  disabled={currentPage === 1}
                  className="px-3 py-1 text-sm font-semibold text-purple-600 hover:bg-purple-100 rounded transition disabled:opacity-50"
                >
                  « {t('menu.pagination.prev')}
                </button>

                {Array.from({ length: Math.ceil(favorites.length / itemsPerPage) }, (_, i) => i + 1).map((page) => (
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
                  onClick={() => setCurrentPage(p => Math.min(Math.ceil(favorites.length / itemsPerPage), p + 1))}
                  disabled={currentPage === Math.ceil(favorites.length / itemsPerPage)}
                  className="px-3 py-1 text-sm font-semibold text-purple-600 hover:bg-purple-100 rounded transition disabled:opacity-50"
                >
                  {t('menu.pagination.next')} »
                </button>
              </div>
            )}
          </>
        )}
      </div>
    </div>
  );
}
