import React, { useEffect, useState } from "react";
import { useParams, useNavigate } from "react-router-dom";
import { getFoodById } from "@/api/food.api";
import { generateDishScript } from "@/api/gemini.api";
import { useTranslation } from "react-i18next";

const FoodScriptPage: React.FC = () => {
  const { id } = useParams<{ id: string }>();
  const navigate = useNavigate();
  const { t } = useTranslation();

  const [loading, setLoading] = useState(true);
  const [dishName, setDishName] = useState("");
  const [script, setScript] = useState<any>(null);

  useEffect(() => {
    if (!id) return;

    const loadData = async () => {
      setLoading(true);

      try {
        const food = await getFoodById(id);
        setDishName(food.name);

        const aiData = await generateDishScript(food.name);
        setScript(aiData);  // << nhận JSON
      } catch (err) {
        console.error(err);
        setScript(null);
      } finally {
        setLoading(false);
      }
    };

    loadData();
  }, [id]);

  if (loading)
    return <div className="p-6 text-center">{t("ScriptLoading.title")}</div>;

  return (
    <div className="relative max-w-4xl mx-auto p-6">

      {/* Nút X */}
      <button
        onClick={() => navigate(-1)}
        className="absolute top-2 right-2 w-10 h-10 flex items-center justify-center 
                   border border-gray-400 rounded-full 
                   text-gray-600 hover:text-red-500 hover:border-red-500 
                   transition-all"
      >
        X
      </button>

      <h1 className="text-3xl font-bold text-red-500 text-center mb-6">
        <p className="text-red-500 text-3xl">
          {dishName} — {t("ScriptTitle.title")}
        </p>
      </h1>

      {/* SCRIPT HIỂN THỊ THEO FORMAT */}
      <div className="bg-white shadow-lg rounded-lg p-6 leading-relaxed text-gray-800 space-y-6">

        <div>
          <h2 className="text-xl font-bold text-red-500 mb-2">1. 導入</h2>
          <p>{script?.introduction}</p>
        </div>

        <div>
          <h2 className="text-xl font-bold text-red-500 mb-2">2. 歴史と背景</h2>
          <p>{script?.history_background}</p>
        </div>

        <div>
          <h2 className="text-xl font-bold text-red-500 mb-2">3. 主な構成要素と特徴</h2>
          <p>{script?.components_features}</p>
        </div>

        <div>
          <h2 className="text-xl font-bold text-red-500 mb-2">4. 日本料理との比較による理解</h2>
          <p>{script?.comparison_with_japanese}</p>
        </div>

        <div>
          <h2 className="text-xl font-bold text-red-500 mb-2">5. 食事へのお誘い</h2>
          <p>{script?.invitation}</p>
        </div>

      </div>
    </div>
  );
};

export default FoodScriptPage;
