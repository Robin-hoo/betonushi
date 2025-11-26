import { useState } from "react";
import { useTranslation } from "react-i18next";


export default function Helpfulpage() {
        const [edit3, setEdit3] = useState(false);
        const [text3, setText3] = useState(
        `Aさん:「Bさん、ベトナム料理好き？」
        Bさん:「う、好き！ 特にフォー！」
        (DI)「B-san、よトナム料理ど？」「け、後一緒行う！」`
    );
  const { t } = useTranslation();
  return (
    <div className="w-full flex flex-col items-center p-6 bg-gray-50 min-h-screen">

      {/* Block 1 - Title */}
      <div className="w-full max-w-3xl text-center border p-6 bg-white rounded-xl shadow-sm mb-8">
        <h1 className="text-3xl font-bold mb-2">{t("block1.title")}</h1>
        <p className="text-gray-600 text-sm">{t("block2.title")}</p>
      </div>

      {/* Block 2 - Content */}
      <div className="w-full max-w-3xl border p-6 bg-white rounded-xl shadow-md space-y-6">

        {/* Section 1 */}
        <div className="bg-green-100 p-4 rounded-lg flex gap-4 items-start">
             <img src="/invite.jpg" alt="invite" className="w-35 h-35 " />
        <div className="bg-green-100 p-4 rounded-lg">
          <h2 className="font-bold text-lg mb-2">{t("section1.title")}</h2>
          <p>友達、ベトナム的料理食べに行かない？</p>
          <p>美味しいフォーの店、知ってますよ！</p>
        </div>
        </div>
        {/* Section 2 */}
        <div className="bg-orange-100 p-4 rounded-lg flex gap-4 items-start">
             <img src="/asking.jpg" alt="invite" className="w-35 h-35 " />
        <div className="bg-orange-100 p-4 rounded-lg">
          <h2 className="font-bold text-lg mb-2">{t("section2.title")}</h2>
          <p>牛肉の、何料理？</p>
          <p>パクチは好き？</p>
          <p>好きな家庭料理なのなに？</p>
        </div>
        </div>
        {/* Section 3 */}
        {edit3 ? (
        <div className="bg-gray-300 p-4 rounded-lg">
        <h2 className="font-bold text-lg mb-2">{t("section3.title")}</h2>

        <textarea 
        className="w-full p-2 rounded" 
        rows={4}  
        value={text3}
        onChange={(e) => setText3(e.target.value)}
        />

    <button 
      onClick={() => setEdit3(false)} 
      className="mt-2 px-4 py-2 bg-blue-500 text-white rounded"
    >
      保存
    </button>
    </div>
    ) : (
    <div className="bg-gray-300 p-4 rounded-lg flex gap-4 items-start relative">

    <img src="/sample.jpg" alt="sample" className="w-35 h-35" />

    <div className="flex-1">
      <h2 className="font-bold text-lg mb-2">{t("section3.title")}</h2>

      {/* HIỂN THỊ NỘI DUNG ĐÃ EDIT */}
      <pre className="whitespace-pre-wrap">{text3}</pre>
    </div>
   </div>
    )}
   <div className="text-center">
   <button 
      onClick={() => setEdit3(true)} 
      className="px-6 py-3 bg-blue-500 text-white rounded-lg shadow hover:bg-blue-600"
    >
      食事を観察
    </button>
    </div>
    </div>
    </div>
  );
}

