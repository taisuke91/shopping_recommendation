import { GoogleGenerativeAI } from '@google/generative-ai';

// Gemini API の設定
const genAI = new GoogleGenerativeAI(process.env.GOOGLE_AI_API_KEY || '');

export const getGeminiRecommendation = async (prompt: string) => {
  try {
    // Gemini 2.5 Flash モデルを使用
    const model = genAI.getGenerativeModel({ 
      model: 'gemini-2.0-flash-exp',
      generationConfig: {
        temperature: 0.7,
        topK: 40,
        topP: 0.95,
        maxOutputTokens: 2048,
      },
    });

    const result = await model.generateContent(prompt);
    const response = await result.response;
    return response.text();
  } catch (error) {
    console.error('Gemini API エラー:', error);
    throw new Error('推薦の取得中にエラーが発生しました。');
  }
}; 