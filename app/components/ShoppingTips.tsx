'use client';

import type { ShoppingTips } from '@/app/lib/recommendationParser';

interface ShoppingTipsProps {
  tips: ShoppingTips;
}

export default function ShoppingTips({ tips }: ShoppingTipsProps) {
  const tipItems = [
    {
      title: 'スタイリングアドバイス',
      content: tips.stylingAdvice,
      icon: '💄',
      color: 'from-pink-50 to-rose-100'
    },
    {
      title: '予算のコツ',
      content: tips.budgetTips,
      icon: '💰',
      color: 'from-green-50 to-emerald-100'
    },
    {
      title: 'トレンド情報',
      content: tips.trendAdvice,
      icon: '🌟',
      color: 'from-purple-50 to-violet-100'
    }
  ];

  return (
    <div className="bg-white rounded-xl shadow-lg p-6">
      <h2 className="text-2xl font-bold text-gray-800 mb-6 flex items-center">
        <span className="mr-3">💡</span>
        ショッピングのコツ
      </h2>
      
      <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
        {tipItems.map((item, index) => (
          <div
            key={index}
            className={`bg-gradient-to-br ${item.color} rounded-lg p-4 border border-gray-100`}
          >
            <div className="flex items-center mb-3">
              <span className="text-2xl mr-2">{item.icon}</span>
              <h3 className="font-semibold text-gray-800 text-sm">
                {item.title}
              </h3>
            </div>
            <p className="text-gray-700 text-sm leading-relaxed">
              {item.content || 'アドバイスを生成中...'}
            </p>
          </div>
        ))}
      </div>
    </div>
  );
} 