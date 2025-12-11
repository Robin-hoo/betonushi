
const express = require("express");
const router = express.Router();
const { GoogleGenerativeAI } = require("@google/generative-ai");

const genAI = new GoogleGenerativeAI("AIzaSyD_25DSHePULHjd94ScIdobKaUOzYRdGiI");

// POST /api/generate
router.post("/generate", async (req, res, next) => {

  try {

    const { dish } = req.body;

    if (!dish) {
      return res.status(400).json({ message: "Thiếu tên món ăn" });
    }

    // Model đúng cho SDK mới
    const model = genAI.getGenerativeModel({
      model: "gemini-2.5-flash" 
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
    `;

    const result = await model.generateContent(prompt);
    const text = result.response.text();

    res.json({ content: text });
  } catch (err) {
    console.error("Gemini Error:", err);
    next(err);
  }
});

module.exports = router;
