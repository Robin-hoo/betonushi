const express = require("express");
const router = express.Router();
const { GoogleGenerativeAI } = require("@google/generative-ai");

const genAI = new GoogleGenerativeAI({
  apiKey: process.env.GEMINI_API_KEY,});

// POST /api/generate
router.post("/generate", async (req, res, next) => {
  try {
    const { dish } = req.body;

    if (!dish) {
      return res.status(400).json({ message: "Thiếu tên món ăn" });
    }

    const model = genAI.getGenerativeModel({
      model: "gemini-2.5-flash-lite",
    });

    const prompt = `
あなたはベトナム料理を紹介するプロの日本語スクリプト作成者です。

料理名: ${dish}

以下の5つの構成で日本語の紹介文を作ってください：

1. 導入
2. 歴史と背景
3. 主な構成要素と特徴
4. 日本料理との比較による理解
5. 食事へのお誘い

丁寧で優しい日本語で、会話形式（SV:〜）を含めて作成してください。

出力は必ず次のJSON形式のみで返してください：

{
  "introduction": "",
  "history_background": "",
  "components_features": "",
  "comparison_with_japanese": "",
  "invitation": ""
}

他の説明や補足は一切書かないでください。
`;

    // Gọi API Gemini
const result = await model.generateContent(prompt);
const raw = result.response.text();

// Làm sạch output của Gemini (loại bỏ ```json ... ```)
let clean = raw
  .replace(/```json/gi, "")
  .replace(/```/g, "")
  .trim();

let data;

try {
  data = JSON.parse(clean);
} catch (err) {
  console.error("JSON parse error:", err);
  return res.status(500).json({
    error: "Model did not return valid JSON",
    rawOutput: raw,
    cleanedOutput: clean,
  });
}

// Trả JSON sạch về frontend
res.json({
  introduction: data.introduction,
  history_background: data.history_background,
  components_features: data.components_features,
  comparison_with_japanese: data.comparison_with_japanese,
  invitation: data.invitation,
});


  } catch (err) {
    console.error("Gemini Error:", err);
    next(err);
  }
});

module.exports = router;
