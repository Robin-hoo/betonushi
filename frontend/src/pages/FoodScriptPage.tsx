import React, { useEffect, useState } from "react";
import { useParams, useNavigate } from "react-router-dom";
import { getFoodById } from "@/api/food.api";
import { generateDishScript } from "@/api/gemini.api";
import { useTranslation } from "react-i18next";
import { ChevronLeft } from 'lucide-react';

const FoodScriptPage: React.FC = () => {
  const { id } = useParams<{ id: string }>();
  const navigate = useNavigate();
  const { t } = useTranslation();

  const [loading, setLoading] = useState(true);
  const [dishName, setDishName] = useState("");
  const [script, setScript] = useState<any>(null);

  const [error, setError] = useState<string | null>(null);

  const loadData = async () => {
    if (!id) return;
    setLoading(true);
    setError(null);

    try {
      const food = await getFoodById(id);
      setDishName(food.name);
      const aiData = await generateDishScript(food.name);
      setScript(aiData);
    } catch (err) {
      console.error(err);
      setScript(null);
      setError(t("ScriptLoading.error") || 'Failed to load script');
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    loadData();
  }, [id]);

  if (loading)
    return <div className="p-10 text-center">{t("ScriptLoading.title")}</div>;

  if (error)
    return (
      <div className="p-10 text-center">
        <p className="text-red-600 mb-4">{error}</p>
        <button
          onClick={() => loadData()}
          className="px-4 py-2 bg-purple-600 text-white rounded hover:bg-purple-700 transition"
        >
          {t('common.retry') || 'Retry'}
        </button>
      </div>
    );

  return (
    <div className="min-h-screen max-w-5xl min-w-5xl py-12">

      <div className="max-w-4xl mx-auto relative">
        {/*Header*/}
        <div className="flex items-center gap-4 mb-6">
        {/* Back button (purple square) */}
            <button
              onClick={() => navigate(-1)}
              className="bg-purple-700 hover:bg-purple-800 text-white w-10 h-10 rounded-lg flex items-center justify-center shadow-md focus:outline-none"
              aria-label="Back"
            >
              <ChevronLeft size={20} className="text-white text-bold" />
            </button>

            <h1 className="flex-1 text-2xl sm:text-4xl font-extrabold text-center tracking-tight">
              <span className="text-gray-700 text-3xl mt-1">{dishName + " "}</span>
              <span className="text-gray-700 text-3xl mt-1">{t("ScriptTitle.title")}</span>
            </h1>
        </div>

        {/* SCRIPT HIỂN THỊ THEO FORMAT */}
        <div className="bg-[#FDE8E8] border border-[#F5CACA] rounded-xl p-8 leading-relaxed text-gray-800 space-y-8 shadow-lg">

          <section>
            <h2 className="text-lg sm:text-xl font-bold text-red-600 mb-2">1. 導入</h2>
            <p className="text-sm sm:text-base whitespace-pre-line">{script?.introduction}</p>
          </section>

          <section>
            <h2 className="text-lg sm:text-xl font-bold text-red-600 mb-2">2. フォーの歴史と背景</h2>
            <p className="text-sm sm:text-base whitespace-pre-line">{script?.history_background}</p>
          </section>

          <section>
            <h2 className="text-lg sm:text-xl font-bold text-red-600 mb-2">3. 主な構成要素と特徴</h2>
            <p className="text-sm sm:text-base whitespace-pre-line">{script?.components_features}</p>
          </section>

          <section>
            <h2 className="text-lg sm:text-xl font-bold text-red-600 mb-2">4. 日本料理との比較による理解</h2>
            <p className="text-sm sm:text-base whitespace-pre-line">{script?.comparison_with_japanese}</p>
          </section>

          <section>
            <h2 className="text-lg sm:text-xl font-bold text-red-600 mb-2">5. 食事へのお誘い</h2>
            <p className="text-sm sm:text-base whitespace-pre-line">{script?.invitation}</p>
          </section>

        </div>
      </div>
    </div>
  );
};

export default FoodScriptPage;
