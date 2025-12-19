import React, { useState, useEffect } from "react";
import { useParams } from "react-router-dom";
import { Star, Globe } from "lucide-react";
import { Button } from "@/components/ui/button";
import { getFoodById, type Food } from "@/api/food.api";
import { Link } from "react-router-dom";
import InteractiveStarRating from "@/components/InteractiveStarRating";
import { favoritesApi } from "@/api/favorites.api";
import { useAuth } from "@/context/AuthContext";
import { useTranslation } from "react-i18next";

const FoodDetailPage: React.FC = () => {
  const { id } = useParams<{ id: string }>();
  const { t, i18n } = useTranslation();
  const { isLoggedIn } = useAuth();
  const [dishData, setDishData] = useState<Food | null>(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  const [isFavorite, setIsFavorite] = useState(false);
  const [userRating, setUserRating] = useState(0);

  useEffect(() => {
    if (!id) return;

    const fetchFood = async () => {
      setLoading(true);
      setError(null);
      try {
        const data = await getFoodById(id, i18n.language);
        setDishData(data);

        if (isLoggedIn) {
          const status = await favoritesApi.checkStatus(Number(id), 'food');
          setIsFavorite(status.isFavorited);
        }
      } catch (err) {
        console.error(err);
        setError("Failed to load food data.");
      } finally {
        setLoading(false);
      }
    };

    fetchFood();
  }, [id, isLoggedIn, i18n.language]);

  const handleRatingChange = (newRating: number) => {
    setUserRating(newRating);
    console.log("User selected rating:", newRating);
  };


  if (loading) return <div className="p-6">{t('foodDetail.loading')}</div>;
  if (error) return <div className="p-6 text-red-500">{t('foodDetail.error')}</div>;
  if (!dishData) return <div className="p-6">{t('foodDetail.notFound')}</div>;

  return (
    <div className="min-h-screen bg-white">
      <button className="px-8 py-2 bg-purple-600 text-white font-semibold rounded-lg hover:bg-purple-700 transition">
        <Link to="/foods">{t('foodDetail.backToFoods')}</Link>
      </button>

      <div className="max-w-7xl mx-auto p-6">
        {/* Top Section - 2 Columns */}
        <div className="grid grid-cols-12 gap-6">
          {/* Left Column */}
          <div className="col-span-5">
            {/* Main Image */}
            <div className="bg-gradient-to-br from-green-100 to-green-200 rounded-lg p-4 mb-3">
              <div className="w-full aspect-square flex items-center justify-center overflow-hidden rounded-lg">
                <img
                  src={dishData.images?.[0]}
                  alt={dishData.name}
                  className="w-full h-full object-cover rounded-lg"
                />
              </div>
            </div>

            {/* Thumbnail Images */}
            <div className="grid grid-cols-3 gap-2 mb-4">
              {dishData.images?.map((img, i) =>
                i !== 0 ? (
                  <div
                    key={i}
                    className="bg-gradient-to-br from-green-100 to-green-200 rounded-lg aspect-square flex items-center justify-center cursor-pointer hover:scale-105 transition-transform"
                  >
                    <img
                      src={img}
                      alt={dishData.name}
                      className="w-full h-full object-cover rounded-lg"
                    />
                  </div>
                ) : null
              )}
            </div>

            {/* Title with rating */}
            <div className="mb-4 flex flex-col items-center">
              <h1 className="text-2xl font-bold text-gray-800 mb-1">
                {dishData.name}
              </h1>
              <div className="flex flex-col items-center gap-1">
                <div className="flex items-center gap-1">
                  <span className="text-lg font-bold text-gray-800">
                    {dishData.rating}{t('foodDetail.rating.outOf')}
                  </span>
                  <Star className="w-5 h-5 fill-yellow-400 text-yellow-400" />
                </div>
                <span className="text-sm text-gray-500">
                  ({t('foodDetail.rating.reviews', { count: dishData.number_of_rating })})
                </span>
              </div>
            </div>

            {/* Action Buttons */}
            <div className="flex gap-8 mb-6">
              <Button
                onClick={async () => {
                  if (!isLoggedIn) return; // Or show login modal
                  const prev = isFavorite;
                  setIsFavorite(!prev);
                  try {
                    await favoritesApi.toggleFavorite(Number(id), 'food');
                  } catch (e) {
                    setIsFavorite(prev);
                    console.error(e);
                  }
                }}
                className={`w-full px-4 py-2 rounded-lg font-medium mb-2 transition-colors ${isFavorite
                  ? "bg-red-500 text-white"
                  : "bg-red-100 text-red-600 hover:bg-red-200"
                  } ${!isLoggedIn ? "opacity-50 cursor-not-allowed" : ""}`}
                disabled={!isLoggedIn}
              >
                {t('foodDetail.buttons.favorite')}
              </Button>
              <Link to={`/script/${id}`} className="block w-full">
                <Button
                  className="w-full px-4 py-2 bg-blue-500 text-white rounded-lg font-medium hover:bg-blue-600 transition-colors mb-4">
                  {t('foodDetail.buttons.help')}
                </Button>
              </Link>
            </div>
            <div className="flex justify-center">
              <InteractiveStarRating
                initialRating={userRating}
                starSize="w-6 h-6"
                onRatingChange={handleRatingChange}
              />
            </div>

            {/* Comment Section */}
            <div className="bg-gray-50 rounded-lg p-3 mb-4">
              <textarea
                className="w-full h-24 p-2 border border-gray-300 rounded-lg resize-none text-sm focus:outline-none focus:ring-2 focus:ring-orange-400"
                placeholder=""
              ></textarea>
            </div>

            <div className="flex gap-8 mb-6 ">
              <Button className="w-full px-4 py-2 bg-orange-500 text-white rounded-lg hover:bg-orange-600 transition-colors mb-2">
                {t('foodDetail.buttons.cancel')}
              </Button>
              <Button className="w-full px-4 py-2 bg-green-500 text-white rounded-lg hover:bg-green-600 transition-colors">
                {t('foodDetail.buttons.comment')}
              </Button>
            </div>
            <div className="flex justify-center">
              <button className="px-8 py-2 bg-purple-600 text-white font-semibold rounded-lg hover:bg-purple-700 transition">
                <Link to="/restaurants">{t('foodDetail.buttons.searchRestaurant')}</Link>
              </button>
            </div>
          </div>

          {/* Right Column - Content Sections */}
          <div className="space-y-6 col-span-7">
            {/** POT sections: story, ingredient, taste, style, comparison */}
            {[
              { title: t('foodDetail.sections.story'), content: dishData.story },
              { title: t('foodDetail.sections.ingredient'), content: dishData.ingredient },
              { title: t('foodDetail.sections.taste'), content: dishData.taste },
              { title: t('foodDetail.sections.style'), content: dishData.style },
              { title: t('foodDetail.sections.comparison'), content: dishData.comparison },
            ].map((section, i) => (
              <div key={i}>
                <h2 className="text-xl font-bold text-red-500 mb-3">
                  {section.title}
                </h2>
                <p className="text-gray-700 text-sm leading-relaxed">
                  {section.content}
                </p>
                {i < 4 && <hr className="my-4 border-gray-300" />}
              </div>
            ))}
          </div>
        </div>

        {/* Bottom Section - Reviews */}
        <div className="bg-white rounded-lg border border-gray-200 p-6 mt-6">
          <h2 className="text-2xl font-bold text-red-500 mb-6 text-center">
            {t('foodDetail.reviews.title')}
          </h2>
          <div className="space-y-4">
            {dishData.reviews?.map((review) => (
              <div
                key={review.review_id}
                className="border-b border-gray-200 pb-4 last:border-0"
              >
                <div className="flex items-start gap-4">
                  <div className="w-12 h-12 bg-orange-100 rounded-full flex items-center justify-center flex-shrink-0">
                    <span className="text-2xl">👨</span>
                  </div>
                  <div className="flex-1">
                    <div className="font-bold text-gray-800 text-sm mb-2">
                      {review.user_id}
                    </div>
                    <p className="text-gray-700 text-sm leading-relaxed">
                      {review.comment}
                    </p>
                  </div>
                </div>
              </div>
            ))}
          </div>
        </div>
      </div>
    </div>
  );
};

export default FoodDetailPage;