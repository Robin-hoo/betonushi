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
    api.get(`/foods?lang=${encodeURIComponent(i18n.language)}`)
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
            <Button className="bg-orange-500 hover:bg-orange-600 text-white text-lg px-6 py-4 rounded-full shadow-xl">
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

            <button className="absolute right-0 text-gray-700 hover:text-gray-900 text-sm flex items-center gap-1">
              {t("button2.title")}
            </button>
          </div>

          {/* Card Menu */}
          <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-4 gap-16 justify-end">

            {foods.map((item) => (
              <a key={item.food_id} href={`/foods/${item.food_id}`}>
                <Card className="rounded-xl bg-[#D6EDC5] shadow-md hover:shadow-lg transition p-5 relative">

                  {/* Ảnh */}
                  <img
                    src={item.image_url}
                    alt={item.name}
                    className="w-full h-44 object-cover rounded-lg"
                  />
                  <div className="absolute top-4 right-4 z-10">
                    <HeartButton targetId={item.food_id} type="food" className="bg-white/80 p-2 rounded-full shadow-sm hover:bg-white" />
                  </div>


                  {/* Nội dung */}
                  <div className="text-center mt-4">
                    <CardTitle className="text-xl font-bold">
                      {item.name}
                    </CardTitle>

                    <p className="text-sm text-gray-700 mt-2 leading-relaxed truncate">
                      {item.story || "Món ăn này đang được cập nhật mô tả."}
                    </p>
                    <p className="text-gray-600 text-sm">
                      <strong>{item.taste}</strong>
                    </p>
                    <span className="mt-4 text-red-600 text-sm font-semibold">
                      もっと詳しく見る
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
