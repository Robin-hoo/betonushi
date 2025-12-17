import instruction1 from "@/assets/image/helpfulpage/instruction1.png";
import instruction2 from "@/assets/image/helpfulpage/instruction2.png";
import instruction3 from "@/assets/image/helpfulpage/instruction3.png";
import { useTranslation } from "react-i18next";

export default function HelpfulPage() {
  const { t } = useTranslation()
  return (
    <div className="w-full flex flex-col items-center py-12 bg-white min-h-screen">
      {/* Title Section */}
      <div className="w-full max-w-4xl text-center mb-12 px-4">
        <h1 className="text-4xl font-bold mb-3 text-gray-900">
          ベトナム的料理実施ガイド
        </h1>
        <p className="text-gray-500 text-lg">
          Helpful Japanese Phrases for Food & Invitations
        </p>
      </div>

      {/* Content Sections */}
      <div className="w-full max-w-4xl space-y-6 px-4 mb-8">

        {/* Section 1 - Inviting (Green) */}
        <div className="bg-[#d4e8d4] rounded-2xl p-6 flex-col gap-6 items-start">
          <h2 className="font-bold text-xl mb-3 text-gray-800">
            {t("section1.title")}
          </h2>
          <div className="flex">
            <div className="flex-shrink-0">
              <img
                src={instruction1}
                alt="Inviting illustration"
                className="w-35 h-25 object-contain"
              />
            </div>
            <div className="flex-1 flex flex-col pl-10 justify-center">
              <p className="text-gray-700 mb-2 text-xl">
                友達、ベトナム料理食べに行かない？
              </p>
              <p className="text-gray-700 text-xl">
                美味しいフォーの店、知ってますよ！
              </p>
            </div>
          </div>
        </div>

        {/* Section 2 - Asking Questions (Orange) */}
        <div className="bg-[#f5d9c4] rounded-2xl p-6 flex-col gap-6 items-start">
          <h2 className="font-bold text-xl mb-3 text-gray-800">
            {t("section2.title")}
          </h2>
          <div className="flex">
            <div className="flex-shrink-0">
              <img
                src={instruction2}
                alt="Asking questions illustration"
                className="w-35 h-25 object-contain"
              />
            </div>
            <div className="flex-1 flex-col pl-10 justify-center">
              <p className="text-gray-700 mb-2 text-xl">牛肉の、何料理？</p>
              <p className="text-gray-700 mb-2 text-xl">パクチは好き？</p>
              <p className="text-gray-700 text-xl">好きな家庭料理なのなに？</p>
            </div>
          </div>
        </div>

        {/* Section 3 - Sample Dialogue (Gray) */}
        <div className="bg-[#5e5e5e] text-white rounded-2xl p-6 flex-col gap-6 items-start">
          <h2 className="font-bold text-xl mb-3">
            {t("section3.title")}
          </h2>
          <div className="flex">
            <div className="flex-shrink-0">
              <img
                src={instruction3}
                alt="Sample dialogue illustration"
                className="w-35 h-25 object-contain"
              />
            </div>
            <div className="flex-1 flex-col pl-10 justify-center">
              <p className="mb-2 text-xl">Aさん:「Bさん、ベトナム料理好き？」</p>
              <p className="mb-2 text-xl">Bさん:「う、好き！ 特にフォー！」</p>
              <p className="text-sm opacity-90 text-xl">
                (DI)「B-san、よトナム料理ど？」「け、後一緒行う！」
              </p>
            </div>
          </div>
        </div>
      </div>

      {/* Action Button */}
      {/* <div className="text-center mt-8">
        <button className="px-8 py-3 bg-blue-500 text-white rounded-lg shadow-md hover:bg-blue-600 transition-colors font-medium">
          食事を観察
        </button>
      </div> */}
    </div>
  );
}
