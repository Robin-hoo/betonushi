import React, { useState, useEffect } from "react";
import { useParams } from "react-router-dom";
import { Star, ArrowLeft } from "lucide-react";
import { Button } from "@/components/ui/button";
import { getFoodById, addReview, type Food } from "@/api/food.api";
import { Link } from "react-router-dom";
import InteractiveStarRating from "@/components/InteractiveStarRating";
import { favoritesApi } from "@/api/favorites.api";
import { useAuth } from "@/context/AuthContext";
import { useTranslation } from "react-i18next";
import toast from "react-hot-toast";

const FoodDetailPage: React.FC = () => {
  const [showShareModal, setShowShareModal] = useState(false);
  const { id } = useParams<{ id: string }>();
  const { t, i18n } = useTranslation();
  const { isLoggedIn } = useAuth();
  const [dishData, setDishData] = useState<Food | null>(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  const [isFavorite, setIsFavorite] = useState(false);
  const [userRating, setUserRating] = useState(0);

  const [selectedImage, setSelectedImage] = useState<string | null>(null);
  const [comment, setComment] = useState("");
  const [currentPage, setCurrentPage] = useState(1);
  const REVIEWS_PER_PAGE = 5;
  const [isSubmitting, setIsSubmitting] = useState(false);

  const fetchFood = async (showLoading = true) => {
    if (!id) return;
    if (showLoading) setLoading(true);
    setError(null);
    try {
      const data = await getFoodById(id, i18n.language);
      setDishData(data);
      if (showLoading && data.images && data.images.length > 0) {
        setSelectedImage(data.images[0]);
      }

      if (isLoggedIn) {
        const status = await favoritesApi.checkStatus(Number(id), 'food');
        setIsFavorite(status.isFavorited);
      }
    } catch (err) {
      console.error(err);
      setError("Failed to load food data.");
    } finally {
      if (showLoading) setLoading(false);
    }
  };

  useEffect(() => {
    fetchFood();
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [id, isLoggedIn, i18n.language]);

  const handleRatingChange = (newRating: number) => {
    setUserRating(newRating);
  };

  const handleCommentSubmit = async () => {
    if (!id || !isLoggedIn) return;
    if (userRating === 0) {
      alert(t('foodDetail.rating.required'));
      return;
    }
    if (comment.length < 10) {
      // alert(t('foodDetail.reviews.minLength')); // Optional: add translation for this
      return;
    }

    setIsSubmitting(true);
    try {
      await addReview(id, { rating: userRating, comment });
      setComment("");
      setUserRating(0);
      await fetchFood(false); // Refresh without full loading state
    } catch (error) {
      console.error("Failed to submit review", error);
      alert("Failed to submit review");
    } finally {
      toast.success(t('foodDetail.messages.submitted'));
      setIsSubmitting(false);
    }
  };



  if (loading) return <div className="p-6">{t('foodDetail.loading')}</div>;
  if (error) return <div className="p-6 text-red-500">{t('foodDetail.error')}</div>;
  if (!dishData) return <div className="p-6">{t('foodDetail.notFound')}</div>;

  return (
    <div className="min-h-screen bg-white">
      <Link
        to="/foods"
        className="
          inline-flex items-center justify-center
          w-10 h-10
          bg-purple-600 text-white
          rounded-md
          hover:bg-purple-700
          transition
        "
        aria-label="Back to foods"
      >
        <ArrowLeft size={20} />
      </Link>

      <div className="max-w-6xl mx-auto p-6 ">
        {/* Top Section - 2 Columns */}
        <div className="grid grid-cols-1 lg:grid-cols-12 gap-10">
          {/* Left Column */}
          <div className="lg:col-span-4">
            {/* Main Image */}
            <div className="relative w-full aspect-[4/3] flex items-center justify-center overflow-hidden rounded-xl bg-white group pb-5">
              <img
                src={selectedImage || dishData.images?.[0]}
                alt={dishData.name}
                className="w-full h-full object-cover rounded-xl transition-all duration-500 group-hover:scale-105"
              />
            </div>

            {/* Thumbnail Images Slider */}
            {dishData.images && dishData.images.length > 0 && (
              <div className="relative mb-4">
                <div className="flex gap-3 overflow-x-auto pb-2 snap-x scrollbar-thin scrollbar-thumb-purple-200 scrollbar-track-transparent">
                  {dishData.images.map((img, i) => (
                    <button
                      key={i}
                      onClick={() => setSelectedImage(img)}
                      className={`
                        relative flex-shrink-0 w-[calc(33.333%-0.5rem)] aspect-square rounded-lg overflow-hidden snap-start 
                        border-2 transition-all duration-300
                        ${selectedImage === img || (!selectedImage && i === 0)
                          ? "border-purple-600 ring-2 ring-purple-100 scale-95"
                          : "border-transparent opacity-70 hover:opacity-100 hover:scale-95"
                        }
                      `}
                    >
                      <img
                        src={img}
                        alt={`${dishData.name} thumbnail ${i + 1}`}
                        className="w-full h-full object-cover"
                      />
                    </button>
                  ))}
                </div>
              </div>
            )}

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

            <div className="flex gap-10 justify-center items-center w-full mb-4">
              {/* SHARE */}
              <Button
                onClick={() => setShowShareModal(true)}
                className="w-fit py-2 bg-purple-600 text-white font-semibold rounded-lg hover:bg-purple-700 transition"
              >
                {t('foodDetail.buttons.share')}
              </Button>

              {/* HELP */}
              <Link to={`/script/${id}`} >
                <Button
                  className="w-fit py-2 bg-blue-500 text-white font-semibold rounded-lg hover:bg-blue-600 transition flex items-center justify-center gap-2"
                >
                  <span className="bg-white text-blue-500 rounded-full w-5 h-5 flex items-center justify-center text-sm font-bold">
                    ?
                  </span>
                  {t('foodDetail.buttons.help')}
                </Button>
              </Link>
            </div>

            <div className="flex gap-8 mb-6 px-10 justify-center">
              <Button
                onClick={async () => {
                  if (!isLoggedIn) return; // Or show login modal
                  const prev = isFavorite;
                  setIsFavorite(!prev);
                  try {
                    await favoritesApi.toggleFavorite(Number(id), 'food');
                  } catch (e) {
                    setIsFavorite(prev);
                    toast.error(e as string);
                  }
                }}
                className={`w-fit py-2 rounded-lg font-medium mb-2 transition-colors ${isFavorite
                  ? "bg-red-200 text-red-600"
                  : "bg-red-500 hover:bg-red-200"
                  } ${!isLoggedIn ? "opacity-50 cursor-not-allowed" : ""}`}
                disabled={!isLoggedIn}
              >
                {isFavorite ? t('foodDetail.buttons.favorite') : t('foodDetail.buttons.unfavorite')}
              </Button>

            </div>
            <div className="flex justify-center">
              <InteractiveStarRating
                initialRating={userRating}
                starSize="w-8 h-8"
                onRatingChange={handleRatingChange}
              />
            </div>

            {userRating > 0 && (
              <>
                {/* Comment Section */}
                <div className="bg-gray-50 rounded-lg p-3 mb-4">
                  <textarea
                    className="w-full h-24 p-2 border border-gray-300 rounded-lg resize-none text-sm focus:outline-none focus:ring-2 focus:ring-orange-400"
                    placeholder={t('foodDetail.reviews.placeholder') || "Write your review..."}
                    value={comment}
                    onChange={(e) => setComment(e.target.value)}
                    disabled={!isLoggedIn || isSubmitting}
                  ></textarea>
                </div>

                {/* Post comment buttons */}
                <div className="flex justify-center gap-8 mb-6 ">
                  <Button
                    onClick={() => {
                      setComment("");
                      setUserRating(0);
                    }}
                    disabled={isSubmitting}
                    className="w-30 px-4 py-2 bg-orange-500 text-white rounded-lg hover:bg-orange-600 transition-colors mb-2"
                  >
                    {t('foodDetail.buttons.cancel')}
                  </Button>
                  <Button
                    onClick={handleCommentSubmit}
                    disabled={!isLoggedIn || isSubmitting || userRating === 0 || comment.length < 10}
                    className={`w-30 px-4 py-2 bg-green-500 text-white rounded-lg hover:bg-green-600 transition-colors ${(!isLoggedIn || userRating === 0 || comment.length < 10) ? 'opacity-50 cursor-not-allowed' : ''}`}
                  >
                    {isSubmitting ? t('foodDetail.buttons.submitting') : t('foodDetail.buttons.comment')}
                  </Button>
                </div>
              </>
            )}
            <div className="pt-10 flex justify-center">
              <button className="px-8 py-2 bg-purple-600 text-white font-semibold rounded-lg hover:bg-purple-700 transition">
                <Link to="/restaurants">{t('foodDetail.buttons.searchRestaurant')}</Link>
              </button>
            </div>
          </div>

          {/* Right Column - Content Sections */}
          <div className="space-y-6 lg:col-span-8">
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
            {(dishData.reviews || []).slice((currentPage - 1) * REVIEWS_PER_PAGE, currentPage * REVIEWS_PER_PAGE).map((review) => (
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
                      {review.full_name}
                    </div>
                    <p className="text-gray-700 text-sm leading-relaxed">
                      {review.comment}
                    </p>
                  </div>
                </div>
              </div>
            ))}
          </div>

          {/* Pagination Controls */}
          {dishData.reviews && dishData.reviews.length > REVIEWS_PER_PAGE && (
            <div className="flex justify-center gap-2 mt-6">
              <Button
                variant="outline"
                onClick={() => setCurrentPage((p) => Math.max(1, p - 1))}
                disabled={currentPage === 1}
              >
                {t('menu.pagination.prev')}
              </Button>
              <span className="flex items-center px-4">
                {currentPage} / {Math.ceil(dishData.reviews.length / REVIEWS_PER_PAGE)}
              </span>
              <Button
                variant="outline"
                onClick={() => setCurrentPage((p) => Math.min(Math.ceil((dishData.reviews?.length || 0) / REVIEWS_PER_PAGE), p + 1))}
                disabled={currentPage === Math.ceil(dishData.reviews.length / REVIEWS_PER_PAGE)}
              >
                {t('menu.pagination.next')}
              </Button>
            </div>
          )}
        </div>
      </div>
      {showShareModal && (
        <div className="fixed inset-0 bg-black/40 flex items-center justify-center z-50">
          <div className="bg-white rounded-lg p-6 w-[400px] max-w-[90%]">
            <h3 className="text-lg font-bold text-gray-800 mb-4">
              {t('foodDetail.shareModal.title')}
            </h3>

            {/* Link input */}
            <input
              readOnly
              value={window.location.href}
              className="w-full px-3 py-2 border border-gray-300 rounded-md text-sm mb-4"
            />

            {/* Actions */}
            <div className="grid grid-cols-2 gap-4 justify-between">
              <Button
                variant="outline"
                onClick={() => setShowShareModal(false)}
              >
                {t('foodDetail.shareModal.close')}
              </Button>

              <Button
                onClick={() => {
                  navigator.clipboard.writeText(window.location.href);
                  toast.success(t('foodDetail.shareModal.linkCopied'));
                }}
                className="bg-purple-600 text-white hover:bg-purple-700"
              >
                {t('foodDetail.shareModal.copyLink')}
              </Button>
            </div>
          </div>
        </div>
      )}

    </div>
  );
};

export default FoodDetailPage;