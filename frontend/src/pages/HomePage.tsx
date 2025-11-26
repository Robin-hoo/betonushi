import { Button } from "@/components/ui/button"
import { Card, CardContent, CardFooter, CardHeader, CardTitle } from "@/components/ui/card"
import { Badge } from "@/components/ui/badge"
import { useTranslation } from "react-i18next";
export default function HomePage() {
  const { t } = useTranslation();
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
        <div className="relative w-full max-w-6xl mx-auto px-4 text-center text-white">
          <h2 className="text-3xl font-bold tracking-wide">
            {t("banner1.title")}
          </h2>
          <h1 className="text-5xl font-extrabold mt-2">{t("banner2.title")}</h1>

          <div className="mt-6">
            <Button className="bg-pink-500 hover:bg-pink-600 text-white text-lg px-6 py-4 rounded-full shadow-xl">
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
          <div className="flex items-center justify-between mb-6">
            <Badge className="text-lg px-4 py-2 bg-orange-300 text-orange-900 rounded-full">
              {t("popular_menu.title")}
            </Badge>

            <button className="text-gray-500 hover:underline text-sm">
              {t("button2.title")}
            </button>
          </div>

          {/* Card Menu */}
          <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-4 gap-6">
            {[1, 2, 3, 4].map((item) => (
              <a href = "helpful">
              <Card key={item} className="shadow-md hover:shadow-lg transition rounded-xl">
                <CardHeader className="p-0">
                  <img
                    src="/food.jpg"
                    alt="food"
                    className="w-full h-40 object-cover rounded-t-xl"
                  />
                </CardHeader>

                <CardContent className="mt-3">
                  <CardTitle className="text-lg">パスタシーフード</CardTitle>
                  <p className="text-sm text-muted-foreground">
                    シーフードとクリーミーなソース…
                  </p>
                </CardContent>

                <CardFooter className="flex justify-between items-center text-sm text-muted-foreground">
                  <span>レビュー 4.8/5.0</span>
                  <span className="font-bold text-orange-600">¥1,280</span>
                </CardFooter>
              </Card>
              </a>
            ))}
          </div>
        </div>
      </div>

    </div>
  );
}
