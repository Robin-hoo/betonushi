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
          <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-4 gap-6">
            {[
              { nameKey: "menu.items.bunbohue.name", descKey: "menu.items.bunbohue.desc" },
              { nameKey: "menu.items.banhmi.name", descKey: "menu.items.banhmi.desc" },
              { nameKey: "menu.items.bunbohue.name", descKey: "menu.items.bunbohue.desc" },
              { nameKey: "menu.items.banhmi.name", descKey: "menu.items.banhmi.desc" }
            ].map((item, index) => (
              <Card key={index} className="bg-[#f5e6dc] border-none shadow-md hover:shadow-xl transition-all duration-300 rounded-2xl overflow-hidden">
                <CardHeader className="p-4 pb-3">
                  <div className="w-full aspect-square rounded-xl overflow-hidden bg-white">
                    <img
                      src="/food.jpg"
                      alt={t(item.nameKey)}
                      className="w-full h-full object-cover"
                    />
                  </div>
                </CardHeader>

                <CardContent className="px-4 pb-3 text-center">
                  <CardTitle className="text-lg font-bold text-gray-800 mb-2">
                    {t(item.nameKey)}
                  </CardTitle>
                  <p className="text-sm text-gray-600 leading-relaxed">
                    {t(item.descKey)}
                  </p>
                </CardContent>

                <CardFooter className="px-4 pb-4 flex justify-center">
                  <button className="text-[#c44536] hover:text-[#a03628] text-sm font-medium transition-colors">
                    {t("menu.view_details")}
                  </button>
                </CardFooter>
              </Card>
            ))}
          </div>
        </div>
      </div>

    </div>
  );
}
