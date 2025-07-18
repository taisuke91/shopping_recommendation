'use client';

import { useState } from 'react';
import { useRouter } from 'next/navigation';

interface RecommendationForm {
  category: string;
  age: number;
  gender: string;
  budget: number;
}


export default function ShoppingRecommendation() {
  const router = useRouter();
  const [formData, setFormData] = useState<RecommendationForm>({
    category: '',
    age: 25,
    gender: '女性',
    budget: 10000
  });

  const [isLoading, setIsLoading] = useState(false);
  //1つ目のisLoadingは現在の状態を読むための変数、2つ目のisLoadingは状態を変更するための関数

  const [error, setError] = useState<string>('');

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault(); //フォーム送信によるページの再読み込みを防ぐ
    setIsLoading(true); //Loadingの状態をtrueにする
    setError(''); //エラーメッセージをクリア

    try {
      const response = await fetch('/api/recommendations', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json', //JSON形式でデータを送信
        },
        body: JSON.stringify(formData), //formDataをJSON形式に変換してreq.bodyとして送信
      });

      const data = await response.json(); //APIからのレスポンスをJSON形式で受け取る

      if (!response.ok) { //レスポンスが200番台でない場合はエラーを投げる
        throw new Error(data.error || '推薦の取得に失敗しました。');
      }

      // 結果ページにリダイレクト
      const params = new URLSearchParams({
        recommendation: data.recommendation,
        category: formData.category,
        age: formData.age.toString(),
        gender: formData.gender,
        budget: formData.budget.toString()
      });

      router.push(`/results?${params.toString()}`); //結果ページにリダイレクト
    } catch (err) {
      setError(err instanceof Error ? err.message : '予期しないエラーが発生しました。');
      setIsLoading(false); //Loadingの状態をfalseにする
    }
  };

  const handleInputChange = (field: keyof RecommendationForm, value: string | number) => {
    setFormData(prev => ({ //prevは前のstateを参照するための変数, prev => ({ ... }): 前の状態 (prev)を元に、新しい状態のオブジェクトを返します。
      ...prev,
      [field]: value
    }));
  };

  return (
    <div className="max-w-4xl mx-auto p-6">
      {/* このページのheader的な部分　*/}
      <div className="text-center mb-8">
        <h1 className="text-4xl font-bold text-gray-800 mb-4">
          🛍️ お買い物アドバイザー
        </h1>
        <p className="text-lg text-gray-600">
          あなたにぴったりの商品を推薦します
        </p>
      </div>


      <div className="bg-white rounded-lg shadow-lg p-8 mb-8">
        <form onSubmit={handleSubmit} className="space-y-6">
          <div>
            <label htmlFor="category" className="block text-sm font-medium text-gray-700 mb-2">
              欲しい商品の種類 *
            </label>
            <input
              type="text"
              id="category"
              value={formData.category}
              onChange={(e) => handleInputChange('category', e.target.value)}
              placeholder="例: バッグ、洋服、メガネ、靴など"
              className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
              required //必須項目
            />
          </div>

          <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
            <div>
              <label htmlFor="age" className="block text-sm font-medium text-gray-700 mb-2">
                年齢 *
              </label>
              <input
                type="number"
                id="age"
                value={formData.age}
                onChange={(e) => handleInputChange('age', parseInt(e.target.value) || 0)}
                min="1"
                max="120"
                className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                required
              />
            </div>

            <div>
              <label htmlFor="gender" className="block text-sm font-medium text-gray-700 mb-2">
                性別 *
              </label>
              <select
                id="gender"
                value={formData.gender}
                onChange={(e) => handleInputChange('gender', e.target.value)}
                className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                required
              >
                <option value="女性">女性</option>
                <option value="男性">男性</option>
                <option value="その他">その他</option>
              </select>
            </div>

            <div>
              <label htmlFor="budget" className="block text-sm font-medium text-gray-700 mb-2">
                予算 (円) *
              </label>
              <input
                type="number"
                id="budget"
                value={formData.budget}
                onChange={(e) => handleInputChange('budget', parseInt(e.target.value) || 0)}
                min="100"
                step="100"
                className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                required
              />
            </div>
          </div>

          {/* 送信ボタン */}
          <button
            type="submit"
            disabled={isLoading} //isLoadingがtrueの場合はボタンを無効化
            className="w-full bg-blue-600 hover:bg-blue-700 disabled:bg-gray-400 text-white font-semibold py-3 px-6 rounded-lg transition duration-200 flex items-center justify-center"
          >
            {isLoading ? ( //isLoadingがtrueの場合は推薦を生成中...と表示
              <>
                <div className="animate-spin rounded-full h-5 w-5 border-b-2 border-white mr-2"></div> {/* ぐるぐる回るアニメーション */}
                推薦を生成中...
              </>
            ) : (
              'おすすめ商品を探す'
            )}
          </button>
        </form>
      </div>

      {error && (
        <div className="bg-red-50 border border-red-200 rounded-lg p-4 mb-6">
          <p className="text-red-700">{error}</p>
        </div>
      )}
      
    </div>
  );
} 