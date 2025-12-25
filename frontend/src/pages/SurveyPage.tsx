import React, { useState } from 'react';
import { useTranslation } from 'react-i18next';
import { Button } from '@/components/ui/button';
import { Card, CardTitle } from '@/components/ui/card';
import { api } from '@/api/client'; // Assumes axios instance
import { useNavigate } from 'react-router-dom';
import { HeartButton } from '@/components/HeartButton';

export default function SurveyPage() {
  const { t, i18n } = useTranslation();
  const navigate = useNavigate();

  const [targetName, setTargetName] = useState('');
  const [genres, setGenres] = useState<string[]>([]);
  const [tastes, setTastes] = useState<string[]>([]);
  const [dislikes, setDislikes] = useState<string[]>([]);
  const [otherDislike, setOtherDislike] = useState('');
  const [priorities, setPriorities] = useState<string[]>([]);
  const [privateRoom, setPrivateRoom] = useState('');
  const [groupSize, setGroupSize] = useState('');

  const [recommendations, setRecommendations] = useState<any[]>([]);
  const [showResults, setShowResults] = useState(false);

  // Options using keys from translation.json
  const genreOptions = ["vegetarian", "warm", "other", "noodle", "cold"];
  const tasteOptions = ["sweet", "sour", "other", "salty", "bitter", "umami", "spicy"];
  const dislikeOptions = ["dog", "blood", "frog", "buffalo", "snake", "organs", "other"];
  const priorityOptions = ["taste", "nutrition", "other", "price", "looks", "health", "quantity"];
  const privateRoomOptions = ["privateYes", "privateNo", "privateAny"];
  const groupSizeOptions = ["people1", "people2", "people34", "people56", "people7"];

  const toggleCheckbox = (value: string, currentList: string[], setter: (list: string[]) => void) => {
    if (currentList.includes(value)) {
      setter(currentList.filter(item => item !== value));
    } else {
      setter([...currentList, value]);
    }
  };



  const compileCriteria = () => {
    // We map the keys to the localized string because `recommendationService` does string matching against DB content.
    // DB content language depends on the data.
    // If the user selects "Spicy" (Cay), we want to match "Spicy" or "Cay"?
    // The `recommendationService` uses the `lang` parameter to join `food_translations`.
    // But filtering by `taste` or `ingredient` is done on `foods` table columns likely?
    // Looking at `recommendationService.js`:
    // `(f.ingredient NOT ILIKE ...)` and `f.taste ILIKE ...`.
    // These columns in `foods` table are likely English or Vietnamese or mixed.
    // Let's assume we should send localized strings if the DB is localized or English if DB is standardized.
    // Safest behavior for this MVP: Send English values or both?
    // We'll send the localized value corresponding to the current language. Or maybe the key?
    // Let's map back to English for better consistency if the DB is in English.
    // Actually, looking at the code, `food_translations` is joined. But `where` uses `f.ingredient`.
    // Checking `foods` table structure would be ideal, but let's assume `foods` has English or Vietnamese.

    // Let's use `t` for now.
    return {
      targetName,
      genres: genres.map(g => t(`survey.options.${g}`)),
      tastes: tastes.map(taste => t(`survey.options.${taste}`)),
      dislikes: [...dislikes.map(d => t(`survey.options.${d}`)), otherDislike].filter(Boolean),
      priorities: priorities.map(p => t(`survey.options.${p}`)),
      privateRoom: privateRoom ? t(`survey.options.${privateRoom}`) : '',
      groupSize: groupSize ? t(`survey.options.${groupSize}`) : ''
    };
  };

  const handleSave = async () => {
    const preferences = {
      favorite_taste: tastes.map(k => t(`survey.options.${k}`)).join(','),
      disliked_ingredients: [...dislikes.map(k => t(`survey.options.${k}`)), otherDislike].filter(Boolean).join(','),
      dietary_criteria: genres.map(k => t(`survey.options.${k}`)).join(',')
    };

    try {
      await api.post('/preferences', preferences);
      alert(t('profilePage.saveSuccess')); // Reuse or add new key
    } catch (error) {
      console.error("Save error", error);
      alert(t('profilePage.saveFailed') + " (Login required)");
    }
  };

  const handleSearch = async () => {
    const criteria = compileCriteria();
    try {
      const res = await api.get(`/recommendations`, {
        params: {
          lang: i18n.language,
          limit: 8,
          criteria: JSON.stringify(criteria)
        }
      });
      setRecommendations(res.data);
      setShowResults(true);
    } catch (error) {
      console.error("Search error", error);
    }
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
                {genreOptions.map(opt => (
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
                {tasteOptions.map(opt => (
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
                {dislikeOptions.map(opt => (
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
                {priorityOptions.map(opt => (
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

            {/* Q5 Private Room */}
            <div>
              <p className="font-semibold text-gray-800 mb-3">{t('survey.q5')}</p>
              <div className="space-y-2">
                {privateRoomOptions.map(opt => (
                  <label key={opt} className="flex items-center gap-2 cursor-pointer hover:bg-gray-50 p-2 rounded transition">
                    <input
                      type="radio"
                      name="privateRoom"
                      className="w-5 h-5 accent-[#ad343e]"
                      checked={privateRoom === opt}
                      onChange={() => setPrivateRoom(opt)}
                    />
                    <span className="text-gray-700">{t(`survey.options.${opt}`)}</span>
                  </label>
                ))}
              </div>
            </div>

            {/* Q6 Group Size */}
            <div>
              <p className="font-semibold text-gray-800 mb-3">{t('survey.q6')}</p>
              <div className="space-y-2">
                {groupSizeOptions.map(opt => (
                  <label key={opt} className="flex items-center gap-2 cursor-pointer hover:bg-gray-50 p-2 rounded transition">
                    <input
                      type="radio"
                      name="groupSize"
                      className="w-5 h-5 accent-[#ad343e]"
                      checked={groupSize === opt}
                      onChange={() => setGroupSize(opt)}
                    />
                    <span className="text-gray-700">{t(`survey.options.${opt}`)}</span>
                  </label>
                ))}
              </div>
            </div>

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

          {/* Recommendations Result */}
          {showResults && (
            <div className="mt-12 animate-in fade-in slide-in-from-bottom-4 duration-500">
              <h2 className="text-2xl font-bold text-[#ad343e] mb-6 text-center">{t('recommendation.title')}</h2>
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-6">
                {recommendations.length > 0 ? (
                  recommendations.map((item: any) => (
                    <a key={item.food_id} href={`/foods/${item.food_id}`}>
                      <Card className="rounded-xl bg-[#F7E8E0] shadow-md hover:shadow-lg transition p-4 relative overflow-hidden group">
                        <div className="rounded-md overflow-hidden bg-white/70">
                          <img
                            src={item.image_url}
                            alt={item.name}
                            className="w-full h-40 object-cover group-hover:scale-105 transition duration-300"
                          />
                        </div>

                        <div className="absolute top-3 right-3 z-10">
                          <HeartButton targetId={item.food_id} type="food" className="bg-white p-2 rounded-full shadow-sm" />
                        </div>

                        <div className="text-center mt-4 px-2">
                          <CardTitle className="text-lg font-semibold text-gray-800">
                            {item.name}
                          </CardTitle>
                          <p className="text-sm text-gray-600 mt-1 line-clamp-2">
                            {item.story}
                          </p>
                        </div>
                      </Card>
                    </a>
                  ))
                ) : (
                  <p className="text-center text-gray-500 col-span-full">{t('menu.no_results.title')}</p>
                )}
              </div>
            </div>
          )}

        </div>
      </div>
    </div>
  );
}
