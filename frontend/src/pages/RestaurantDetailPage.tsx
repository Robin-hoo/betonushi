import React, { useState, useEffect } from "react";
import { useParams, useNavigate, Link } from "react-router-dom";
import { Star, MapPin, Clock, Phone, DollarSign, ArrowLeft } from "lucide-react";
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
  const [selectedImageIndex, setSelectedImageIndex] = useState(0);

  useEffect(() => {
    if (!id) return;

    const fetchRestaurant = async () => {
      setLoading(true);
      setError(null);
      try {
        const data = await getRestaurantById(id);
        setRestaurant(data);
      } catch (err) {
        console.error(err);
        setError("Không thể tải thông tin nhà hàng.");
      } finally {
        setLoading(false);
      }
    };

    fetchRestaurant();
  }, [id]);

  // Mock images for restaurant (you can add restaurant_images table later)
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
          <p className="text-gray-600">Đang tải thông tin nhà hàng...</p>
        </div>
      </div>
    );

  if (error || !restaurant)
    return (
      <div className="min-h-screen flex items-center justify-center">
        <div className="text-center">
          <p className="text-red-500 mb-4">{error || "Nhà hàng không tồn tại"}</p>
          <Button onClick={() => navigate("/restaurants")}>Quay lại danh sách</Button>
        </div>
      </div>
    );

  const formatTime = (time: string | null) => {
    if (!time) return "N/A";
    return time.substring(0, 5); // HH:MM
  };

  const formatPrice = (price: number) => {
    return new Intl.NumberFormat("vi-VN").format(price) + " đ";
  };

  return (
    <div className="min-h-screen bg-gray-50">
      {/* Header with back button */}
      <div className="bg-white shadow-sm sticky top-0 z-20">
        <div className="max-w-7xl mx-auto px-6 py-4">
          <Button
            variant="ghost"
            onClick={() => navigate("/restaurants")}
            className="flex items-center gap-2 text-gray-600 hover:text-gray-900"
          >
            <ArrowLeft className="w-4 h-4" />
            Quay lại danh sách
          </Button>
        </div>
      </div>

      <div className="max-w-7xl mx-auto px-6 py-8">
        {/* Section 1: Images and Basic Info */}
        <div className="grid grid-cols-12 gap-8 mb-12">
          {/* Left: Images */}
          <div className="col-span-5">
            {/* Main Image */}
            <div className="bg-gradient-to-br from-orange-100 to-orange-200 rounded-xl p-4 mb-4 shadow-lg">
              <div className="w-full aspect-square flex items-center justify-center overflow-hidden rounded-lg">
                <img
                  src={restaurantImages[selectedImageIndex]}
                  alt={restaurant.name}
                  className="w-full h-full object-cover rounded-lg"
                />
              </div>
            </div>

            {/* Thumbnail Images */}
            <div className="grid grid-cols-3 gap-3">
              {restaurantImages.map((img, index) => (
                <button
                  key={index}
                  onClick={() => setSelectedImageIndex(index)}
                  className={`bg-gradient-to-br from-orange-100 to-orange-200 rounded-lg aspect-square overflow-hidden transition-all ${selectedImageIndex === index
                      ? "ring-4 ring-orange-500 scale-105"
                      : "hover:scale-105"
                    }`}
                >
                  <img
                    src={img}
                    alt={`${restaurant.name} ${index + 1}`}
                    className="w-full h-full object-cover"
                  />
                </button>
              ))}
            </div>

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
                <span className="text-gray-500">
                  ({restaurant.number_of_rating} đánh giá)
                </span>
              </div>
            </div>
          </div>

          {/* Right: Details */}
          <div className="col-span-7 space-y-6">
            {/* Address */}
            <div className="bg-white rounded-xl p-6 shadow-md">
              <h2 className="text-xl font-bold text-orange-600 mb-4 flex items-center gap-2">
                <MapPin className="w-5 h-5" />
                1. Địa chỉ
              </h2>
              <p className="text-gray-700 leading-relaxed">{restaurant.address || "Chưa cập nhật địa chỉ"}</p>
            </div>

            {/* Restaurant Introduction */}
            <div className="bg-white rounded-xl p-6 shadow-md">
              <h2 className="text-xl font-bold text-orange-600 mb-4">
                2. Giới thiệu nhà hàng
              </h2>
              <p className="text-gray-700 leading-relaxed">
                {`${restaurant.name} là một nhà hàng nổi tiếng phục vụ các món ăn Việt Nam truyền thống. 
                  Với không gian ấm cúng và thực đơn đa dạng, nhà hàng mang đến trải nghiệm ẩm thực 
                  tuyệt vời cho thực khách. Chúng tôi tự hào phục vụ những món ăn đậm đà hương vị quê nhà, 
                  được chế biến từ những nguyên liệu tươi ngon nhất.`}
              </p>
            </div>

            {/* Recommended Points */}
            <div className="bg-white rounded-xl p-6 shadow-md">
              <h2 className="text-xl font-bold text-orange-600 mb-4">
                Điểm nổi bật
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
                      <p className="text-gray-700">Món ăn đa dạng, phong phú</p>
                    </div>
                    <div className="flex items-start gap-3">
                      <div className="w-2 h-2 bg-orange-500 rounded-full mt-2 flex-shrink-0"></div>
                      <p className="text-gray-700">Không gian ấm cúng, thân thiện</p>
                    </div>
                    <div className="flex items-start gap-3">
                      <div className="w-2 h-2 bg-orange-500 rounded-full mt-2 flex-shrink-0"></div>
                      <p className="text-gray-700">Phục vụ tận tình, chu đáo</p>
                    </div>
                  </>
                )}
              </div>
            </div>

            {/* Additional Info */}
            <div className="bg-white rounded-xl p-6 shadow-md">
              <h2 className="text-xl font-bold text-orange-600 mb-4">
                Thông tin liên hệ
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
                Lưu ý
              </h2>
              <p className="text-yellow-700 text-sm leading-relaxed">
                Nhà hàng có thể đông khách vào giờ cao điểm. Vui lòng đặt bàn trước hoặc đến sớm
                để tránh chờ đợi. Chúng tôi luôn cố gắng phục vụ tốt nhất có thể.
              </p>
            </div>
          </div>
        </div>

        {/* Section 3: Menu */}
        {restaurant.foods.length > 0 && (
          <div className="mb-12">
            <h2 className="text-3xl font-bold text-orange-600 mb-6 text-center">
              Thực đơn
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
                        Đề xuất
                      </div>
                    )}
                  </div>
                  <div className="p-4">
                    <h3 className="font-bold text-lg mb-2 text-gray-800">{food.name}</h3>
                    <p className="text-sm text-gray-600 mb-3 line-clamp-2">
                      {food.story || "Món ăn ngon, đậm đà hương vị Việt Nam"}
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
                          Xem chi tiết
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
              Đánh giá mới nhất
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
                          alt={review.user_name || "User"}
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
                          {review.user_name || `Người dùng ${review.user_id}`}
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
                          {new Date(review.created_at).toLocaleDateString("vi-VN")}
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
            <p className="text-gray-500">Chưa có đánh giá nào cho nhà hàng này.</p>
          </div>
        )}
      </div>
    </div>
  );
};

export default RestaurantDetailPage;

