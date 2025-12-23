import { Button } from "@/components/ui/button"
import { Card, CardTitle } from "@/components/ui/card"
import { Badge } from "@/components/ui/badge"
import { useTranslation } from "react-i18next";
import { useEffect, useState } from "react";
import type { Food } from "@/api/food.api";
import { api } from "@/api/client";
import { HeartButton } from "@/components/HeartButton";

export default function HomePage() {
  const { t } = useTranslation();
  const [foods, setFoods] = useState<Food[]>([]);
  const { i18n } = useTranslation();

  useEffect(() => {
    api.get(`/favorite_foods?lang=${encodeURIComponent(i18n.language)}`)
      .then(res => setFoods(res.data.slice(0, 4)))
      .catch(err => console.error("Fetch error:", err));
  }, [i18n.language]);
  return (
    <div className="w-full flex flex-col gap-20">

      {/* =========================== */}
      {/* Banner Full Width */}
      {/* =========================== */}
      <div
        className="w-full h-[420px] relative flex items-center justify-center overflow-hidden"
        style={{
          backgroundImage: "url('/banner.jpg')",
          backgroundSize: "cover",
          backgroundPosition: "center",
        }}
      >
        {/* lớp mờ */}
        <div className="absolute inset-0 bg-black/25" />

        {/* Nội dung banner nằm giữa, max width */}
        <div className="relative w-full max-w-6xl mx-auto px-4 text-center text-black">
          <h2 className="text-5xl tracking-wide">
            {t("banner1.title")}
          </h2>
          <h1 className="text-5xl mt-2">{t("banner2.title")}</h1>

          <div className="mt-6">
            <Button className="bg-[#ad343e] hover:bg-[#8b4513] text-white text-lg px-6 py-6 rounded-full shadow-xl">
              {t("button1.title")}
            </Button>
          </div>
        </div>
      </div>

      {/* =========================== */}
      {/* Popular Menu */}
      {/* =========================== */}
      <div className="w-full">
        <div className="max-w-6xl mx-auto px-4">

          {/* Tiêu đề */}
          <div className="flex items-center justify-center mb-8 relative">
            <Badge className="text-lg px-8 py-3 bg-[#f4d5c0] text-[#8b4513] rounded-full shadow-sm font-medium">
              {t("popular_menu.title")}
            </Badge>

            <button
              onClick={() => window.location.href = "/foods"}
              className="
                absolute right-0
                text-gray-700 hover:text-gray-900
                text-sm flex items-center gap-1
                underline-offset-4
                decoration-gray-400
                hover:font-semibold hover:underline
                decoration-1
              "
            >
              {t("button2.title")}
            </button>
          </div>

          {/* Card Menu */}
          <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-4 gap-16 justify-end">

            {foods.map((item) => (
              <a key={item.food_id} href={`/foods/${item.food_id}`}>
                <Card className="rounded-xl bg-[#F7E8E0] shadow-md hover:shadow-lg transition p-4 relative overflow-hidden">

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
                    <CardTitle className="text-lg font-semibold text-gray-800">
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



    </div>
  );
}
