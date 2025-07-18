import { NextRequest, NextResponse } from 'next/server';
import { getGeminiRecommendation } from '@/app/lib/gemini';
import { getFormattedPrompt } from '@/app/lib/prompts';

export async function POST(request: NextRequest) {
  try {
    const { category, age, gender, budget } = await request.json();

    // 入力値の検証
    if (!category || !age || !gender || !budget) {
      return NextResponse.json(
        { error: 'すべての項目を入力してください。' },
        { status: 400 }
      );
    }

    if (age < 1 || age > 120) {
      return NextResponse.json(
        { error: '有効な年齢を入力してください。' },
        { status: 400 }
      );
    }

    if (budget < 100) {
      return NextResponse.json(
        { error: '予算は100円以上で入力してください。' },
        { status: 400 }
      );
    }

    // プロンプトを生成
    const prompt = getFormattedPrompt(category, age, gender, budget);

    // Gemini API で推薦を取得
    const recommendation = await getGeminiRecommendation(prompt);

    return NextResponse.json({ recommendation });
  } catch (error) {
    console.error('推薦API エラー:', error);
    return NextResponse.json(
      { error: '推薦の取得中にエラーが発生しました。' },
      { status: 500 }
    );
  }
} 