'use client';

import { useState, useEffect, Suspense } from 'react';
import { useSearchParams } from 'next/navigation';
import Link from 'next/link';
import ProductCard from '../components/ProductCard';
import { parseRecommendationResponse, ParsedRecommendation } from '../lib/recommendationParser';
import ErrorBoundary from '../components/ErrorBoundary';
import Footer from '../components/Footer';

function ResultsPageContent() {
  const searchParams = useSearchParams(); //URLのクエリパラメータ（例: /results?id=123 の id=123 の部分）を読み取るためのフック
  const [parsedData, setParsedData] = useState<ParsedRecommendation | null>(null);
  const [isLoading, setIsLoading] = useState(true); //推薦データの読み込み中かどうかを管理するstate
  const [error, setError] = useState<string>(''); //エラーメッセージを管理するstate

  useEffect(() => {
    const recommendation = searchParams.get('recommendation');

    if (!recommendation) {
      setError('推薦データが見つかりません。');
      setIsLoading(false);
      return;
    }

    try {
      const parsed = parseRecommendationResponse(recommendation);
      setParsedData(parsed);
    } catch {
      setError('推薦データの解析に失敗しました。');
    } finally {
      setIsLoading(false);
    }
  }, [searchParams]);

  if (isLoading) {
    return (
      <div className="min-h-screen bg-gradient-to-br from-blue-50 to-indigo-100 flex items-center justify-center">
        <div className="text-center">
          <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-blue-600 mx-auto mb-4"></div>
          <p className="text-gray-600">推薦を解析中...</p>
        </div>
      </div>
    );
  }

  if (error) {
    return (
      <div className="min-h-screen bg-gradient-to-br from-blue-50 to-indigo-100 flex items-center justify-center p-6">
        <div className="bg-white rounded-lg shadow-lg p-8 max-w-md w-full text-center">
          <div className="text-6xl mb-4">😵</div>
          <h1 className="text-2xl font-bold text-gray-800 mb-4">エラーが発生しました</h1>
          <p className="text-gray-600 mb-6">{error}</p>
          <Link
            href="/"
            className="bg-blue-600 hover:bg-blue-700 text-white font-semibold py-2 px-4 rounded-lg transition duration-200"
          >
            ホームに戻る
          </Link>
        </div>
      </div>
    );
  }

  if (!parsedData) {
    return null;
  }

  return (
    <ErrorBoundary>
      <div className="min-h-screen bg-gradient-to-br from-blue-50 to-indigo-100">
        <main className="max-w-7xl mx-auto p-6">
          {/* このページのheader的な部分 */}
          <div className="text-center mb-8">
            <h1 className="text-4xl font-bold text-gray-800 mb-4">
              🎯 あなたへのおすすめ商品
            </h1>
            <div className="bg-white rounded-lg shadow-lg p-4 inline-block">
              <p className="text-gray-600">
                <span className="font-semibold">カテゴリ:</span> {searchParams.get('category')} | 
                <span className="font-semibold ml-2">年齢:</span> {searchParams.get('age')}歳 | 
                <span className="font-semibold ml-2">性別:</span> {searchParams.get('gender')} | 
                <span className="font-semibold ml-2">予算:</span> {searchParams.get('budget')}円
              </p>
            </div>
          </div>

          {/* 商品推薦セクション */}
          <div className="mb-8">
            <h2 className="text-3xl font-bold text-gray-800 mb-6 flex items-center">
              <span className="mr-3">🛍️</span>
              おすすめ商品
            </h2>
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
              {parsedData.products.map((product, index) => (
                <ProductCard key={index} product={product} index={index + 1} />
                //ProductCardコンポーネントをレンダリングする。
                //keyはReactのキーで、一意の値を指定する必要がある。indexは商品のインデックスで、1から始まる。
              ))}
            </div>
          </div>



          {/* 戻るボタン */}
          <div className="text-center">
            <Link
              href="/"
              className="inline-flex items-center bg-blue-600 hover:bg-blue-700 text-white font-semibold py-3 px-6 rounded-lg transition duration-200"
            >
              <svg className="w-5 h-5 mr-2" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M10 19l-7-7m0 0l7-7m-7 7h18" />
              </svg>
              新しい推薦を求める
            </Link>
          </div>
        </main>
        <Footer />
      </div>
    </ErrorBoundary>
  );
}

export default function ResultsPage() {
  return (
    //Suspenseは、その子コンポーネントがデータの取得などでレンダリングの準備ができていない場合に、
    //一時的な待機画面（フォールバックUI）を表示するための仕組み
    <Suspense fallback={
      <div className="min-h-screen bg-gradient-to-br from-blue-50 to-indigo-100 flex items-center justify-center">
        <div className="text-center">
          <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-blue-600 mx-auto mb-4"></div>
          <p className="text-gray-600">読み込み中...</p>
        </div>
      </div>
    }>
      <ResultsPageContent />
    </Suspense>
  );
} 