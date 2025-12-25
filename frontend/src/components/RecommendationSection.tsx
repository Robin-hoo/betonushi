import { useEffect, useState } from "react";
import { useTranslation } from "react-i18next";
import { getRecommendations } from "../api/recommendation.api";
import type { Food } from "../api/food.api";
import { Card, CardTitle } from "@/components/ui/card";
import { HeartButton } from "@/components/HeartButton";
import { Badge } from "@/components/ui/badge";

export function RecommendationSection() {
  const { t, i18n } = useTranslation();
  const [recommendations, setRecommendations] = useState<Food[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchRecommendations = async () => {
      try {
        const data = await getRecommendations({
          limit: 4,
          lang: i18n.language
        });
        setRecommendations(data);
      } catch (error) {
        console.error("Failed to fetch recommendations", error);
      } finally {
        setLoading(false);
      }
    };

    fetchRecommendations();
  }, [i18n.language]);

  if (!loading && recommendations.length === 0) {
    return null;
  }

  return (
    <div className="w-full">
      <div className="max-w-6xl mx-auto px-4">
        {/* Title */}
        <div className="flex items-center justify-center mb-8 relative">
          <Badge className="text-lg px-8 py-3 bg-[#f4d5c0] text-[#8b4513] rounded-full shadow-sm font-medium">
            {t("recommendation.title", "Recommended For You")}
          </Badge>
        </div>

        {/* List */}
        <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-4 gap-16 justify-end">
          {recommendations.map((item) => (
            <a key={item.food_id} href={`/foods/${item.food_id}`}>
              <Card className="rounded-xl bg-[#F7E8E0] shadow-md hover:shadow-lg transition p-4 relative overflow-hidden h-full">
                {/* Image frame */}
                <div className="rounded-md overflow-hidden bg-white/70">
                  <img
                    src={item.image_url}
                    alt={item.name}
                    className="w-full h-44 object-cover"
                  />
                </div>

                <div className="absolute top-3 right-3 z-10">
                  <HeartButton targetId={item.food_id} type="food" className="bg-white p-2 rounded-full shadow-sm hover:bg-white" />
                </div>

                {/* Content */}
                <div className="text-center mt-4 px-2">
                  <CardTitle className="text-lg font-semibold text-gray-800 line-clamp-1">
                    {item.name}
                  </CardTitle>

                  <p className="text-sm text-gray-600 mt-1 leading-snug line-clamp-2">
                    {item.story || "Món ăn này đang được cập nhật mô tả."}
                  </p>

                  <span className="mt-4 text-red-600 text-sm font-semibold block">
                    {t("common.see_more")}
                  </span>
                </div>
              </Card>
            </a>
          ))}
        </div>
      </div>
    </div>
  );
}
