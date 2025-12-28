import React, { useState, useEffect } from 'react';
import { useTranslation } from 'react-i18next';
import { Button } from '@/components/ui/button';
import { api } from '@/api/client';
import { useNavigate } from 'react-router-dom';
import { useAuth } from "@/context/AuthContext";
import {
  DISLIKED_INGREDIENT_OPTIONS,
  GENRE_OPTIONS,
  PRIORITY_OPTIONS,
  TASTE_OPTIONS,
  type DislikedIngredientOption,
  type GenreOption,
  type PriorityOption,
  type TasteOption,
} from '@/types/preferences';

function toggleCheckbox<T extends string>(
  value: T,
  currentList: T[],
  setter: React.Dispatch<React.SetStateAction<T[]>>
) {
  if (currentList.includes(value)) {
    setter(currentList.filter(item => item !== value));
  } else {
    setter([...currentList, value]);
  }
}

export default function SurveyPage() {
  const { t } = useTranslation();
  const navigate = useNavigate();
  const { isLoggedIn, isLoading } = useAuth(); // authentication

  const [targetName, setTargetName] = useState('');
  const [genres, setGenres] = useState<GenreOption[]>([]);
  const [tastes, setTastes] = useState<TasteOption[]>([]);
  const [dislikes, setDislikes] = useState<DislikedIngredientOption[]>([]);
  const [otherDislike, setOtherDislike] = useState('');
  const [priorities, setPriorities] = useState<PriorityOption[]>([]);

  // Removed PrivateRoom and GroupSize as per request

  useEffect(() => {
    if (!isLoading && !isLoggedIn) {
      navigate('/login');
    }
  }, [isLoggedIn, isLoading, navigate]);

  if (isLoading) {
    return <div className="min-h-screen flex items-center justify-center">Loading...</div>;
  }

  if (!isLoggedIn) {
    return null; // Will redirect via useEffect
  }

  const savePreferences = async (silent = false) => {
    const preferences = {
      favorite_taste: tastes.join(','),
      disliked_ingredients: dislikes.filter(Boolean).join(','),
      dietary_criteria: genres.join(','),
      target_name: targetName.trim(),
      priorities: priorities.join(','),
    };

    try {
      await api.post('/preferences', preferences);
      if (!silent) {
        alert(t('profilePage.saveSuccess'));
      }
      return true;
    } catch (error) {
      console.error("Save error", error);
      if (!silent) {
        alert(t('profilePage.saveFailed'));
      }
      return false;
    }
  };

  const handleSave = async () => {
    await savePreferences(false);
  };

  const handleSearch = async () => {
    // Save survey data immediately
    await savePreferences(true);

    // Map survey options to MenuPage filters (IDs)
    // MenuPage IDs:
    // Types: 1:Noodle, 2:Rice, 3:Bread, 4:Side, 5:Salad, 6:Hotpot
    // Flavors: 1:Sour, 2:Sweet, 3:Herb, 4:Light, 5:Spicy
    // Ingredients: 1:Beef, 2:Pork, 3:Chicken, 4:Seafood, 5:Vegetable

    const typeIds: number[] = [];
    const flavorIds: number[] = [];
    const ingredientIds: number[] = [];

    // Map Genres
    if (genres.includes('noodle')) typeIds.push(1);
    // 'vegetarian' -> maybe Vegetable ingredient (5)? Let's map it safely.
    if (genres.includes('vegetarian')) ingredientIds.push(5);

    // Map Tastes
    if (tastes.includes('sour')) flavorIds.push(1);
    if (tastes.includes('sweet')) flavorIds.push(2);
    if (tastes.includes('spicy')) flavorIds.push(5);
    // 'umami', 'salty', 'bitter' -> no direct mapping, ignored for now as strictly requested

    // Map Dislikes (MenuPage doesn't support exclusion filters yet via URL easily, or logic differs)

    const params = new URLSearchParams();
    if (typeIds.length > 0) params.set('types', typeIds.join(','));
    if (flavorIds.length > 0) params.set('flavors', flavorIds.join(','));
    if (ingredientIds.length > 0) params.set('ingredients', ingredientIds.join(','));

    navigate(`/foods?${params.toString()}`);
  };

  return (
    <div className="w-full min-h-screen bg-[#faf9f7] py-12 px-4">
      <div className="max-w-3xl mx-auto bg-white rounded-xl shadow-xl overflow-hidden">

        {/* Header */}
        <div className="py-6 text-center relative">
          <h1 className="text-3xl font-bold text-[#ad343e] flex items-center justify-center gap-2">
            <span role="img" aria-label="sushi">🍣</span> {t('survey.title')}
          </h1>
          <button onClick={() => navigate('/')} className="absolute top-6 right-6 text-gray-400 hover:text-gray-700">
            ✕
          </button>
        </div>

        <div className="p-8">
          {/* Target Person */}
          <div className="mb-8 p-4">
            <label className="block text-gray-700 font-semibold mb-2">{t('survey.target')}</label>
            <input
              type="text"
              placeholder={t('survey.targetPlaceholder')}
              value={targetName}
              onChange={(e) => setTargetName(e.target.value)}
              className="w-full border border-gray-200 rounded-md p-3 focus:outline-none focus:ring-2 focus:ring-[#ad343e]/50"
            />
          </div>

          <div className="space-y-8">

            {/* Q1 Genres */}
            <div>
              <p className="font-semibold text-gray-800 mb-3">{t('survey.q1')}</p>
              <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-3">
                {GENRE_OPTIONS.map(opt => (
                  <label key={opt} className="flex items-center gap-2 cursor-pointer hover:bg-gray-50 p-2 rounded transition">
                    <input
                      type="checkbox"
                      className="w-5 h-5 accent-[#ad343e] rounded"
                      checked={genres.includes(opt)}
                      onChange={() => toggleCheckbox(opt, genres, setGenres)}
                    />
                    <span className="text-gray-700">{t(`survey.options.${opt}`)}</span>
                  </label>
                ))}
              </div>
            </div>

            {/* Q2 Tastes */}
            <div>
              <p className="font-semibold text-gray-800 mb-3">{t('survey.q2')}</p>
              <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-3">
                {TASTE_OPTIONS.map(opt => (
                  <label key={opt} className="flex items-center gap-2 cursor-pointer hover:bg-gray-50 p-2 rounded transition">
                    <input
                      type="checkbox"
                      className="w-5 h-5 accent-[#ad343e] rounded"
                      checked={tastes.includes(opt)}
                      onChange={() => toggleCheckbox(opt, tastes, setTastes)}
                    />
                    <span className="text-gray-700">{t(`survey.options.${opt}`)}</span>
                  </label>
                ))}
              </div>
            </div>

            {/* Q3 Dislikes */}
            <div>
              <p className="font-semibold text-gray-800 mb-3">{t('survey.q3')}</p>
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-3 mb-3">
                {DISLIKED_INGREDIENT_OPTIONS.map(opt => (
                  <label key={opt} className="flex items-center gap-2 cursor-pointer hover:bg-gray-50 p-2 rounded transition">
                    <input
                      type="checkbox"
                      className="w-5 h-5 accent-[#ad343e] rounded"
                      checked={dislikes.includes(opt)}
                      onChange={() => toggleCheckbox(opt, dislikes, setDislikes)}
                    />
                    <span className="text-gray-700">{t(`survey.options.${opt}`)}</span>
                  </label>
                ))}
              </div>
              <input
                type="text"
                placeholder={t('survey.freeText')}
                value={otherDislike}
                onChange={(e) => setOtherDislike(e.target.value)}
                className="w-full sm:w-1/2 border border-gray-300 rounded-md p-2 focus:outline-none focus:ring-2 focus:ring-[#ad343e]/50"
              />
            </div>

            {/* Q4 Priorities */}
            <div>
              <p className="font-semibold text-gray-800 mb-3">{t('survey.q4')}</p>
              <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-3">
                {PRIORITY_OPTIONS.map(opt => (
                  <label key={opt} className="flex items-center gap-2 cursor-pointer hover:bg-gray-50 p-2 rounded transition">
                    <input
                      type="checkbox"
                      className="w-5 h-5 accent-[#ad343e] rounded"
                      checked={priorities.includes(opt)}
                      onChange={() => toggleCheckbox(opt, priorities, setPriorities)}
                    />
                    <span className="text-gray-700">{t(`survey.options.${opt}`)}</span>
                  </label>
                ))}
              </div>
              <div className="border-b border-gray-200 mt-8"></div>
            </div>

            {/* Removed Private Room and Group Size */}

          </div>

          {/* Footer Buttons */}
          <div className="mt-10 py-6 flex flex-col sm:flex-row gap-6 justify-between items-center border-t border-gray-100">
            <Button
              onClick={handleSave}
              className="w-full sm:w-auto bg-[#d65b20] hover:bg-[#ad343e] text-white text-lg px-12 py-6 rounded-md shadow-md"
            >
              {t('survey.save')}
            </Button>

            <Button
              onClick={handleSearch}
              className="w-full sm:w-auto bg-[#d65b20] hover:bg-[#ad343e] text-white text-lg px-12 py-6 rounded-md shadow-md"
            >
              {t('survey.search')}
            </Button>
          </div>

        </div>
      </div>
    </div>
  );
}
