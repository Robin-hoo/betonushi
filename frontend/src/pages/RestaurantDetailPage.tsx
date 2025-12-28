import React, { useState, useEffect } from "react";
import { useTranslation } from "react-i18next";
import { useParams, useNavigate, Link } from "react-router-dom";
import { Star, Clock, Phone, DollarSign, ArrowLeft } from "lucide-react";
import { getRestaurantById, type Restaurant } from "@/api/restaurant.api";
import { Button } from "@/components/ui/button";
import defaultRestaurantImage from "@/assets/default.jpg";
import defaultFoodImage from "@/assets/default.jpg";

const RestaurantDetailPage: React.FC = () => {
  const { id } = useParams<{ id: string }>();
  const navigate = useNavigate();
  const [restaurant, setRestaurant] = useState<Restaurant | null>(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [selectedImage, setSelectedImage] = useState<string | null>(null);

  const { t, i18n } = useTranslation();

  useEffect(() => {
    if (!id) return;

    const fetchRestaurant = async () => {
      setLoading(true);
      setError(null);
      try {
        const data = await getRestaurantById(id, i18n.language);
        setRestaurant(data);
        // Tự động chọn ảnh đầu tiên nếu có (logic giống FoodDetail)
        // Ở đây dùng mock images nên sẽ xử lý ở dưới render
      } catch (err) {
        console.error(err);
        setError(t('restaurant.detail.fetch_error'));
      } finally {
        setLoading(false);
      }
    };

    fetchRestaurant();
  }, [id, i18n.language]);

  // Mock images for restaurant
  const restaurantImages = [
    defaultRestaurantImage,
    defaultRestaurantImage,
    defaultRestaurantImage,
    defaultRestaurantImage,
  ];

  if (loading)
    return (
      <div className="min-h-screen flex items-center justify-center">
        <div className="text-center">
          <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-orange-500 mx-auto mb-4"></div>
          <p className="text-gray-600">{t("common.loading")}</p>
        </div>
      </div>
    );

  if (error || !restaurant)
    return (
      <div className="min-h-screen flex items-center justify-center">
        <div className="text-center">
          <p className="text-red-500 mb-4">{error || t('restaurant.detail.not_found')}</p>
          <Button onClick={() => navigate("/restaurants")}>{t("restaurant.back_to_list")}</Button>
        </div>
      </div>
    );

  const formatTime = (time: string | null) => {
    if (!time) return t('restaurant.detail.n_a');
    return time.substring(0, 5); // HH:MM
  };

  const formatPrice = (price: number) => {
    try {
      return new Intl.NumberFormat(i18n.language || 'vi-VN').format(price) + ' đ';
    } catch (e) {
      return price + ' đ';
    }
  };

  return (
    <div className="min-h-screen bg-gray-50">
      
      {/* Nút Back giống FoodDetailPage */}
      <div className="p-6 pb-0">
        <Link
          to="/restaurants"
          className="
            inline-flex items-center justify-center
            w-10 h-10
            bg-purple-600 text-white
            rounded-md
            hover:bg-purple-700
            transition
            shadow-sm
          "
          aria-label={t('restaurant.back_to_list')}
        >
          <ArrowLeft size={20} />
        </Link>
      </div>

      <div className="max-w-7xl mx-auto px-6 py-8">
        {/* Section 1: Images and Basic Info */}
        <div className="grid grid-cols-12 gap-8 mb-12">
          {/* Left: Images */}
          <div className="col-span-5">
            
            {/* --- CẬP NHẬT PHẦN ẢNH GIỐNG FOOD DETAIL --- */}
            
            {/* 1. Main Image (Style mới) */}
            <div className="relative w-full aspect-[4/3] flex items-center justify-center overflow-hidden rounded-xl bg-white group pb-5">
              <img
                src={selectedImage || restaurantImages[0]}
                alt={restaurant.name}
                className="w-full h-full object-cover rounded-xl transition-all duration-500 group-hover:scale-105"
              />
            </div>

            {/* 2. Thumbnail Images Slider (Style mới) */}
            <div className="relative mb-4">
              <div className="flex gap-3 overflow-x-auto pb-2 snap-x scrollbar-thin scrollbar-thumb-orange-200 scrollbar-track-transparent">
                {restaurantImages.map((img, index) => (
                  <button
                    key={index}
                    onClick={() => setSelectedImage(img)}
                    className={`
                      relative flex-shrink-0 w-[calc(33.333%-0.5rem)] aspect-square rounded-lg overflow-hidden snap-start 
                      border-2 transition-all duration-300
                      ${selectedImage === img || (!selectedImage && index === 0)
                        ? "border-orange-600 ring-2 ring-orange-100 scale-95" // Giữ tông màu cam của nhà hàng
                        : "border-transparent opacity-70 hover:opacity-100 hover:scale-95"
                      }
                    `}
                  >
                    <img
                      src={img}
                      alt={`${restaurant.name} thumbnail ${index + 1}`}
                      className="w-full h-full object-cover"
                    />
                  </button>
                ))}
              </div>
            </div>
            
            {/* --- KẾT THÚC CẬP NHẬT --- */}


            {/* Restaurant Name and Rating */}
            <div className="mt-6 text-center">
              <h1 className="text-3xl font-bold text-gray-800 mb-3">{restaurant.name}</h1>
              <div className="flex items-center justify-center gap-2">
                <div className="flex items-center gap-1">
                  <Star className="w-6 h-6 fill-yellow-400 text-yellow-400" />
                  <span className="text-xl font-bold text-gray-800">
                    {restaurant.rating.toFixed(1)}
                  </span>
                </div>
                <span className="text-gray-500">{t('restaurant.detail.reviews', { count: restaurant.number_of_rating })}</span>
              </div>
            </div>
          </div>

          {/* Right: Details */}
          <div className="col-span-7 space-y-6">
            {/* Address */}
            <div className="bg-white rounded-xl p-6 shadow-md">
              <h2 className="text-xl font-bold text-orange-600 mb-4">
                  {t('restaurant.detail.address_title')}
                </h2>
              <p className="text-gray-700 leading-relaxed">{restaurant.address || t('restaurant.detail.address_missing')}</p>
            </div>

            {/* Restaurant Introduction */}
            <div className="bg-white rounded-xl p-6 shadow-md">
              <h2 className="text-xl font-bold text-orange-600 mb-4">
                {t('restaurant.detail.intro_title')}
              </h2>
              <p className="text-gray-700 leading-relaxed">
                {restaurant.description || t('restaurant.detail.intro_text', { name: restaurant.name })}
              </p>
            </div>

            {/* Recommended Points */}
            <div className="bg-white rounded-xl p-6 shadow-md">
              <h2 className="text-xl font-bold text-orange-600 mb-4">
                {t('restaurant.detail.highlights_title')}
              </h2>
              <div className="space-y-3">
                {restaurant.facilities.length > 0 ? (
                  restaurant.facilities.map((facility, index) => (
                    <div key={index} className="flex items-start gap-3">
                      <div className="w-2 h-2 bg-orange-500 rounded-full mt-2 flex-shrink-0"></div>
                      <p className="text-gray-700">{facility}</p>
                    </div>
                  ))
                ) : (
                  <>
                    <div className="flex items-start gap-3">
                      <div className="w-2 h-2 bg-orange-500 rounded-full mt-2 flex-shrink-0"></div>
                      <p className="text-gray-700">{t('restaurant.detail.default_highlight1')}</p>
                    </div>
                    <div className="flex items-start gap-3">
                      <div className="w-2 h-2 bg-orange-500 rounded-full mt-2 flex-shrink-0"></div>
                      <p className="text-gray-700">{t('restaurant.detail.default_highlight2')}</p>
                    </div>
                    <div className="flex items-start gap-3">
                      <div className="w-2 h-2 bg-orange-500 rounded-full mt-2 flex-shrink-0"></div>
                      <p className="text-gray-700">{t('restaurant.detail.default_highlight3')}</p>
                    </div>
                  </>
                )}
              </div>
            </div>

            {/* Additional Info */}
            <div className="bg-white rounded-xl p-6 shadow-md">
              <h2 className="text-xl font-bold text-orange-600 mb-4">
                {t('restaurant.detail.contact_title')}
              </h2>
              <div className="space-y-3">
                {restaurant.phone_number && (
                  <div className="flex items-center gap-3">
                    <Phone className="w-5 h-5 text-orange-600" />
                    <span className="text-gray-700">{restaurant.phone_number}</span>
                  </div>
                )}
                <div className="flex items-center gap-3">
                  <Clock className="w-5 h-5 text-orange-600" />
                  <span className="text-gray-700">
                    {formatTime(restaurant.open_time)} - {formatTime(restaurant.close_time)}
                  </span>
                </div>
                {restaurant.price_range && (
                  <div className="flex items-center gap-3">
                    <DollarSign className="w-5 h-5 text-orange-600" />
                    <span className="text-gray-700">{restaurant.price_range}</span>
                  </div>
                )}
              </div>
            </div>

            {/* Notes */}
            <div className="bg-yellow-50 border border-yellow-200 rounded-xl p-6">
              <h2 className="text-lg font-bold text-yellow-800 mb-3">
                {t('restaurant.detail.note_title')}
              </h2>
              <p className="text-yellow-700 text-sm leading-relaxed">
                {t('restaurant.detail.note_text')}
              </p>
            </div>
          </div>
        </div>

        {/* Section 3: Menu */}
        {restaurant.foods.length > 0 && (
          <div className="mb-12">
            <h2 className="text-3xl font-bold text-orange-600 mb-6 text-center">
              {t('restaurant.detail.menu_title')}
            </h2>
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
              {restaurant.foods.map((food) => (
                <div
                  key={food.food_id}
                  className="bg-white rounded-xl shadow-md hover:shadow-lg transition overflow-hidden"
                >
                  <div className="relative w-full h-48 bg-gray-200 overflow-hidden">
                    <img
                      src={food.image_url || defaultFoodImage}
                      alt={food.name}
                      className="w-full h-full object-cover hover:scale-105 transition"
                    />
                    {food.is_recommended && (
                      <div className="absolute top-2 left-2 bg-orange-500 text-white px-3 py-1 rounded-full text-xs font-bold">
                        {t('restaurant.detail.recommended')}
                      </div>
                    )}
                  </div>
                  <div className="p-4">
                    <h3 className="font-bold text-lg mb-2 text-gray-800">{food.name}</h3>
                    <p className="text-sm text-gray-600 mb-3 line-clamp-2">
                      {food.story || t('restaurant.detail.default_food_story')}
                    </p>
                    <div className="flex items-center justify-between">
                      <span className="text-lg font-bold text-orange-600">
                        {formatPrice(food.price)}
                      </span>
                      <Link to={`/foods/${food.food_id}`}>
                        <Button
                          variant="outline"
                          size="sm"
                          className="border-orange-500 text-orange-600 hover:bg-orange-50"
                        >
                          {t('restaurant.detail.view_food')}
                        </Button>
                      </Link>
                    </div>
                  </div>
                </div>
              ))}
            </div>
          </div>
        )}

        {/* Section 4: Latest Reviews */}
        {restaurant.reviews.length > 0 && (
          <div className="bg-white rounded-xl shadow-md p-8">
            <h2 className="text-3xl font-bold text-orange-600 mb-6 text-center">
              {t('restaurant.detail.latest_reviews')}
            </h2>
            <div className="space-y-6">
              {restaurant.reviews.map((review) => (
                <div
                  key={review.review_id}
                  className="border-b border-gray-200 pb-6 last:border-0 last:pb-0"
                >
                  <div className="flex items-start gap-4">
                    <div className="w-12 h-12 bg-gradient-to-br from-orange-400 to-orange-600 rounded-full flex items-center justify-center flex-shrink-0 shadow-md">
                      {review.avatar_url ? (
                        <img
                          src={review.avatar_url}
                          alt={review.user_name || t('common.user')}
                          className="w-full h-full rounded-full object-cover"
                        />
                      ) : (
                        <span className="text-white text-xl font-bold">
                          {(review.user_name || "U")[0].toUpperCase()}
                        </span>
                      )}
                    </div>
                    <div className="flex-1">
                      <div className="flex items-center gap-3 mb-2">
                        <span className="font-bold text-gray-800">
                          {review.user_name || `${t('common.user')} ${review.user_id}`}
                        </span>
                        <div className="flex items-center gap-1">
                          {Array.from({ length: 5 }).map((_, i) => (
                            <Star
                              key={i}
                              className={`w-4 h-4 ${i < review.rating
                                  ? "fill-yellow-400 text-yellow-400"
                                  : "fill-gray-200 text-gray-200"
                                }`}
                            />
                          ))}
                        </div>
                        <span className="text-sm text-gray-500">
                          {new Date(review.created_at).toLocaleDateString(i18n.language || 'vi-VN')}
                        </span>
                      </div>
                      <p className="text-gray-700 leading-relaxed">{review.comment}</p>
                    </div>
                  </div>
                </div>
              ))}
            </div>
          </div>
        )}

        {restaurant.reviews.length === 0 && (
          <div className="bg-white rounded-xl shadow-md p-8 text-center">
            <p className="text-gray-500">{t('restaurant.detail.no_reviews')}</p>
          </div>
        )}
      </div>
    </div>
  );
};

export default RestaurantDetailPage;