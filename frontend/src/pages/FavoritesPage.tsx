import { useEffect, useState } from "react";
import { Card, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { useTranslation } from "react-i18next";
import { Heart } from 'lucide-react';
import { favoritesApi } from "@/api/favorites.api";
import { HeartButton } from "@/components/HeartButton";
import { useAuth } from "@/context/AuthContext";
import { useNavigate } from "react-router-dom";

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
  const { t } = useTranslation();
  const { isLoggedIn } = useAuth();
  const navigate = useNavigate();
  const [favorites, setFavorites] = useState<Food[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    if (!isLoggedIn) {
      navigate('/login');
      return;
    }

    favoritesApi.getFavorites('food')
      .then((data: any) => {
        setFavorites(data);
      })
      .catch(err => console.error("Failed to load favorites", err))
      .finally(() => setLoading(false));
  }, [isLoggedIn, navigate]);

  const [loadingIds, setLoadingIds] = useState<number[]>([]);

  const handleToggle = (id: number, added: boolean) => {
    if (!added) {
      // Remove from list if removed (called when server confirms)
      setFavorites(prev => prev.filter(f => f.food_id !== id));
    }
  };

  const handleOptimisticToggle = async (e: React.MouseEvent<HTMLButtonElement>, id: number) => {
    e.preventDefault();
    e.stopPropagation();

    if (!isLoggedIn) {
      navigate('/login');
      return;
    }

    const removedItem = favorites.find(f => f.food_id === id);
    // Optimistically remove from UI
    setFavorites(prev => prev.filter(f => f.food_id !== id));
    setLoadingIds(prev => [...prev, id]);

    try {
      const res = await favoritesApi.toggleFavorite(id, 'food');
      // If server reports it's still favorited, restore
      if (res.added && removedItem) {
        setFavorites(prev => [removedItem, ...prev]);
      }
    } catch (err) {
      console.error('Failed to toggle favorite', err);
      // Revert on error
      if (removedItem) setFavorites(prev => [removedItem, ...prev]);
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
          <Badge className="text-lg px-8 py-3 bg-red-100 text-red-600 rounded-full shadow-sm font-medium">
            Favorites List
          </Badge>
        </div>

        {favorites.length === 0 ? (
          <div className="text-center text-gray-500 py-20">
            <p className="text-xl">You have no favorite dishes yet.</p>
            <a href="/" className="text-orange-500 hover:underline mt-4 block">Explore Menu</a>
          </div>
        ) : (
          <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-4 gap-16 justify-end">
            {favorites.map((item) => (
              <div key={item.food_id} className="bg-white rounded-lg shadow-md hover:shadow-lg transition overflow-hidden flex flex-col">
                <div className="relative w-full h-48 bg-gray-200 overflow-hidden group">
                  <img
                    src={item.image_url || '/image/placeholder.jpg'}
                    alt={item.name}
                    className="w-full h-full object-cover group-hover:scale-105 transition"
                  />

                  <button
                    onClick={(e) => handleOptimisticToggle(e, item.food_id)}
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
        )}
      </div>
    </div>
  );
}
