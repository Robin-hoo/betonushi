import { useEffect, useState } from "react";
import { Card, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { useTranslation } from "react-i18next";
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

  const handleToggle = (id: number, added: boolean) => {
    if (!added) {
      // Remove from list if removed
      setFavorites(prev => prev.filter(f => f.food_id !== id));
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
              <div key={item.food_id} className="relative group">
                <a href={`/foods/${item.food_id}`}>
                  <Card className="rounded-xl bg-[#D6EDC5] shadow-md hover:shadow-lg transition p-3 h-full flex flex-col">
                    {/* Image */}
                    <img
                      src={item.image_url || '/placeholder.jpg'}
                      alt={item.name}
                      className="w-full h-44 object-cover rounded-lg"
                    />

                    {/* Content */}
                    <div className="text-center mt-4 flex-grow">
                      <CardTitle className="text-xl font-bold">
                        {item.name}
                      </CardTitle>

                      <p className="text-sm text-gray-700 mt-2 leading-relaxed line-clamp-2">
                        {item.story || "No description available."}
                      </p>
                      <p className="text-gray-600 text-sm mt-1">
                        <strong>{item.taste}</strong>
                      </p>
                    </div>
                  </Card>
                </a>
                {/* Heart Button Absolute */}
                <div className="absolute top-5 right-5 z-10">
                  <HeartButton
                    targetId={item.food_id}
                    type="food"
                    initialFavorited={true}
                    onToggle={(added) => handleToggle(item.food_id, added)}
                    className="bg-white/80 p-2 rounded-full shadow-sm hover:bg-white"
                  />
                </div>
              </div>
            ))}
          </div>
        )}
      </div>
    </div>
  );
}
