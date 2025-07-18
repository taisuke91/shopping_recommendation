//アプリケーションの一部で予期しないエラーが発生した際に、アプリ全体がクラッシュして白い画面になるのを防ぎ、
//代わりにユーザーフレンドリーなエラー画面を表示するためのものです。
//このコンポーネントを、エラーが発生する可能性のある他のコンポーネントの親として配置します。

'use client';

import { Component, ReactNode } from 'react';

interface Props {
  children: ReactNode;
}

interface State {
  hasError: boolean;
  error?: Error;
}

export default class ErrorBoundary extends Component<Props, State> {
  constructor(props: Props) {
    super(props);
    this.state = { hasError: false };
  }

  //子コンポーネントでエラーが発生した際に最初に呼び出される静的メソッド
  //stateを { hasError: true } に更新し、エラー画面を表示するための再レンダリングをトリガーします。
  static getDerivedStateFromError(error: Error): State {
    return { hasError: true, error };
  }

  //エラーが発生した場合に、エラーの詳細をコンソールに出力する
  componentDidCatch(error: Error, errorInfo: unknown) {
    console.error('Error caught by boundary:', error, errorInfo);
  }

  //そのコンポーネントが画面に何を表示するか（UI）を定義するためのメソッド
  render() {
    
    //hasErrorがtrueの場合、エラー画面（フォールバックUI）を返します。
    if (this.state.hasError) {
      return (
        <div className="min-h-screen bg-gradient-to-br from-blue-50 to-indigo-100 flex items-center justify-center p-6">
          <div className="bg-white rounded-lg shadow-lg p-8 max-w-md w-full text-center">
            <div className="text-6xl mb-4">😵</div>
            <h1 className="text-2xl font-bold text-gray-800 mb-4">
              エラーが発生しました
            </h1>
            <p className="text-gray-600 mb-6">
              申し訳ございません。予期しないエラーが発生しました。
            </p>
            <button
              onClick={() => window.location.reload()}
              className="bg-blue-600 hover:bg-blue-700 text-white font-semibold py-2 px-4 rounded-lg transition duration-200"
            >
              ページを再読み込み
            </button>
          </div>
        </div>
      );
    }

    //hasErrorがfalseの場合、通常の子コンポーネントを返します。
    return this.props.children;
  }
} 