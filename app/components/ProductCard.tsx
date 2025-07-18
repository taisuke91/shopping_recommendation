'use client';

import { ProductRecommendation } from '@/app/lib/recommendationParser';

interface ProductCardProps {
  product: ProductRecommendation;
  index: number;
}

export default function ProductCard({ product, index }: ProductCardProps) {
  const amazonUrl = `https://www.amazon.co.jp/s?k=${product.amazonSearchQuery}`;
  
  return (
    <div className="bg-white rounded-xl shadow-lg hover:shadow-xl transition-all duration-300 overflow-hidden border border-gray-100">
      {/* 商品画像プレースホルダー */}
      <div className="h-48 bg-gradient-to-br from-blue-50 to-indigo-100 flex items-center justify-center">
        <div className="text-6xl opacity-20">
          {/* 適当にアイコンを設定 */}
          {index === 1 ? '🛍️' : index === 2 ? '👕' : '👜'}
        </div>
      </div>
      
      <div className="p-6">
        {/* 商品名 */}
        <h3 className="text-xl font-bold text-gray-800 mb-3 line-clamp-2">
          {product.name}
        </h3>
        
        {/* 価格 */}
        <div className="mb-4">
          <span className="text-2xl font-bold text-green-600">
            {product.price}
          </span>
        </div>
        
        {/* 特徴 */}
        {product.features.length > 0 && (
          <div className="mb-4">
            <h4 className="text-sm font-semibold text-gray-600 mb-2">特徴</h4>
            <p className="text-gray-700 text-sm leading-relaxed">
              {product.features[0]}
            </p>
          </div>
        )}
        
        {/* おすすめ理由 */}
        {product.reason && (
          <div className="mb-6">
            <h4 className="text-sm font-semibold text-gray-600 mb-2">おすすめ理由</h4>
            <p className="text-gray-700 text-sm leading-relaxed">
              {product.reason}
            </p>
          </div>
        )}
        
        {/* Amazon ボタン */}
        <a
          href={amazonUrl}
          target="_blank"
          rel="noopener noreferrer"
          className="inline-flex items-center justify-center w-full bg-orange-500 hover:bg-orange-600 text-white font-semibold py-3 px-4 rounded-lg transition duration-200 text-sm"
        >
          <svg className="w-4 h-4 mr-2" viewBox="0 0 24 24" fill="currentColor">
            <path d="M12 2L2 7l10 5 10-5-10-5zM2 17l10 5 10-5M2 12l10 5 10-5"/>
          </svg>
          Amazonで探す
        </a>
      </div>
    </div>
  );
} 