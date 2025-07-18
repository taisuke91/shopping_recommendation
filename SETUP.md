# お買い物アドバイザー セットアップガイド

## 必要な環境変数

このアプリケーションを動作させるには、Google AI API キーが必要です。

### 1. Google AI API キーの取得

1. [Google AI Studio](https://makersuite.google.com/app/apikey) にアクセス
2. Google アカウントでログイン
3. 「Create API Key」をクリック
4. API キーをコピー

### 2. 環境変数の設定

プロジェクトのルートディレクトリに `.env.local` ファイルを作成し、以下の内容を追加してください：

```
GOOGLE_AI_API_KEY=your_api_key_here
```

`your_api_key_here` の部分を、先ほど取得した API キーに置き換えてください。

## アプリケーションの起動

```bash
npm run dev
```

ブラウザで `http://localhost:3000` にアクセスすると、アプリケーションが表示されます。

## 機能

- 商品カテゴリの入力（バッグ、洋服、メガネなど）
- 年齢、性別、予算の設定
- Gemini 2.5 Flash を使用した AI 推薦
- 日本語 UI
- レスポンシブデザイン

## プロンプトのカスタマイズ

`app/lib/prompts.ts` ファイルを編集することで、AI への指示をカスタマイズできます。 