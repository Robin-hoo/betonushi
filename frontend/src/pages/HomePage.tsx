import { Button } from "@/components/ui/button"
import { Card, CardTitle } from "@/components/ui/card"
import { Badge } from "@/components/ui/badge"
import { useTranslation } from "react-i18next";
import { useEffect, useState } from "react";
import type { Food } from "@/api/food.api";
import { api } from "@/api/client";
import { HeartButton } from "@/components/HeartButton";
import { RecommendationSection } from "@/components/RecommendationSection";
import foodIcon from "../assets/icon/japanese-food.svg";
export default function HomePage() {
  const { t } = useTranslation();
  const [foods, setFoods] = useState<Food[]>([]);
  const { i18n } = useTranslation();
  const [foodImages, setFoodImages] = useState<Food[]>([]);

  useEffect(() => {
    api
      .get(`/foods?lang=${encodeURIComponent(i18n.language)}`)
      .then((res) => setFoodImages(res.data.slice(0, 4)))
      .catch((err) => console.error("Fetch food images error:", err));
  }, [i18n.language]);


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
            <Button
              onClick={() => window.location.href = '/survey'}
              className="bg-[#ad343e] hover:bg-[#8b4513] text-white text-lg px-6 py-6 rounded-full shadow-xl"
            >
              {t("button1.title")}
            </Button>
          </div>
        </div>
      </div>

      {/* =========================== */}
      {/* Recommendation Section */}
      {/* =========================== */}
      <RecommendationSection />

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
      {/* =========================== */}
      {/* Delivery Platforms */}
      {/* =========================== */}
      <div className="w-full bg-[#faf9f7] py-20">
        <div className="max-w-6xl mx-auto px-4 grid grid-cols-1 md:grid-cols-2 gap-12 items-center">

          {/* Left text */}
          <div>
            <h2 className="text-3xl font-bold leading-relaxed text-gray-800">
              {t("deliveryPlatforms.leftText1")}<br />{t("deliveryPlatforms.leftText2")}
            </h2>
          </div>

          {/* Right logos */}
          <div className="grid grid-cols-3 gap-6">
            {[
              {
                name: "Uber Eats",
                url: "https://1000logos.net/wp-content/uploads/2021/04/Uber-Eats-logo.png",
              },
              {
                name: "Grubhub",
                url: "https://cdn.sanity.io/images/b7pblshe/marketing-prod/6bd808b8c7ffaa6c51a24efe99a3f3157f6683ed-1600x400.png",
              },
              {
                name: "Postmates",
                url: "https://www.auphansoftware.com/templates/standard/images/logos/postmates.svg",
              },
              {
                name: "DoorDash",
                url: "https://capsource-bucket.s3.us-west-2.amazonaws.com/wp-content/uploads/2020/09/08180359/doordash-logo3.png",
              },
              {
                name: "Foodpanda",
                url: "https://vectorseek.com/wp-content/uploads/2020/12/FOODPANDA-logo-vector.png",
              },
              {
                name: "Deliveroo",
                url: "https://1000logos.net/wp-content/uploads/2020/10/Deliveroo-logo.png",
              },
              {
                name: "Instacart",
                url: "https://assets.weforum.org/organization/image/fG-dMRXDJHtF0pdBgC0TGi1ZrXCDXVPN9jHrzDjTV1o.jpeg",
              },
              {
                name: "Just Eat",
                url: "https://logos-world.net/wp-content/uploads/2021/02/Just-Eat-Logo.png",
              },
              {
                name: "DiDi Food",
                url: "https://encrypted-tbn0.gstatic.com/images?q=tbn:ANd9GcQPVJwt7huGIhwnj0WQe2oqidPDeUkCfim0Ig&s",
              },
            ].map((platform, i) => (
              <div
                key={i}
                className="bg-white rounded-xl shadow-sm flex items-center justify-center h-14 hover:shadow-md transition"
              >
                <img
                  src={platform.url}
                  alt={platform.name}
                  className="h-full w-full object-contain"
                  loading="lazy"
                />
              </div>
            ))}
          </div>

        </div>
      </div>
      {/* =========================== */}
      {/* Footer */}
      {/* =========================== */}
      <footer className="w-full bg-[#3f3f3f] text-gray-300 py-16">
        <div className="max-w-6xl mx-auto px-4 grid grid-cols-1 md:grid-cols-3 gap-12">

          {/* Logo & description */}
          <div>
            <div className="flex items-center gap-2 mb-4">
              <img className="h-10 w-10" src={foodIcon} alt="Japanese Food" />
              <div className="text-[#c44536] font-bold text-xl whitespace-nowrap">
                ベトめし
              </div>
            </div>
            <p className="text-sm leading-relaxed">
              {t("footer.text")}
            </p>

            {/* Social */}
            <div className="flex gap-3 mt-4">
              {["facebook", "twitter", "instagram", "pinterest"].map((icon) => (
                <div
                  key={icon}
                  className="w-8 h-8 bg-red-500 rounded-full flex items-center justify-center text-white text-sm"
                >
                  {icon[0].toUpperCase()}
                </div>
              ))}
            </div>
          </div>

          {/* Members */}
          <div>
            {/* Header */}
            <div
              style={{
                display: "grid",
                gridTemplateColumns: "1fr 2fr",
                fontWeight: 600,
                marginBottom: "16px",
              }}
            >
              <span>{t("footer.members.mssv")}</span>
              <span>{t("footer.members.name")}</span>
            </div>

            {/* List */}
            <ul style={{ listStyle: "none", padding: 0, margin: 0 }}>
              {[1, 2, 3, 4, 5, 6, 7].map((i) => (
                <li
                  key={i}
                  style={{
                    display: "grid",
                    gridTemplateColumns: "1fr 2fr",
                    marginBottom: "8px",
                    fontSize: "14px",
                  }}
                >
                  <span>{t(`footer.members.membernum${i}`)}</span>
                  <span>{t(`footer.members.membername${i}`)}</span>
                </li>
              ))}
            </ul>
          </div>


          {/* Food images */}
          <div>
            <h4 className="text-white font-semibold mb-4">
              {t("footer.foodImage.title")}
            </h4>

            <div className="grid grid-cols-2 gap-4">
              {foodImages.map((food) => (
                <a
                  key={food.food_id}
                  href={`/foods/${food.food_id}`}
                >
                  <img
                    src={food.image_url}
                    alt={food.name}
                    className="rounded-lg object-cover h-24 w-full hover:scale-105 transition"
                    loading="lazy"
                  />
                </a>
              ))}
            </div>
          </div>
        </div>
      </footer>

    </div>
  );
}
