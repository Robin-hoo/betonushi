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
  const [script, setScript] = useState("");

  useEffect(() => {
    if (!id) return;

    const loadData = async () => {
      setLoading(true);

      try {
        const food = await getFoodById(id);
        setDishName(food.name);

        const aiText = await generateDishScript(food.name);
        setScript(aiText);
      } catch (err) {
        console.error(err);
        setScript("Lỗi khi sinh kịch bản từ AI.");
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

      <div className="bg-white shadow-lg rounded-lg p-6 whitespace-pre-wrap leading-relaxed text-gray-800">
        {script}
      </div>
    </div>
  );
};

export default FoodScriptPage;
