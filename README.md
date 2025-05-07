# Todo アプリ

Next.js, TypeScript, shadcn/ui, Supabase を使用して構築された Todo アプリケーションです。

## 主な機能

- タスクの新規登録
- タスクの一覧表示
- タスクの編集
- タスクの削除
- タスクの完了/未完了の切り替え

## 使用技術

- **フレームワーク**: Next.js 14
- **言語**: TypeScript
- **UI コンポーネント**: shadcn/ui
- **データベース**: Supabase (PostgreSQL)
- **フォーム管理**: React Hook Form
- **バリデーション**: Zod
- **日付操作**: date-fns
- **その他**: Lucide React (アイコン)

## セットアップ手順

1.  **リポジトリをクローンします:**

    ```bash
    git clone <リポジトリのURL>
    cd <プロジェクトディレクトリ>
    ```

2.  **依存関係をインストールします:**

    ```bash
    npm install
    # または
    yarn install
    ```

3.  **Supabase プロジェクトのセットアップ:**

    - Supabase で新しいプロジェクトを作成します。
    - プロジェクトの SQL エディタで以下の SQL を実行し、`todos` テーブルを作成します:
      ```sql
      CREATE TABLE todos (
        id uuid DEFAULT gen_random_uuid() PRIMARY KEY,
        task TEXT NOT NULL,
        is_completed BOOLEAN DEFAULT FALSE,
        created_at TIMESTAMPTZ DEFAULT now(),
        due_date DATE
      );
      ```

4.  **環境変数を設定します:**
    プロジェクトのルートに `.env.local` ファイルを作成し、以下の内容を記述します。
    `YOUR_SUPABASE_URL` と `YOUR_SUPABASE_ANON_KEY` は、Supabase プロジェクトの設定ページで確認できる実際の値に置き換えてください。

    ```env
    NEXT_PUBLIC_SUPABASE_URL=YOUR_SUPABASE_URL
    NEXT_PUBLIC_SUPABASE_ANON_KEY=YOUR_SUPABASE_ANON_KEY
    ```

## 開発サーバーの起動

以下のコマンドで開発サーバーを起動します。

```bash
npm run dev
# または
yarn dev
```

その後、ブラウザで `http://localhost:3000` を開いてください。

## ディレクトリ構成の概要

- `src/app/`: Next.js のページとレイアウト (App Router)
- `src/components/`: 再利用可能な React コンポーネント
  - `ui/`: shadcn/ui によって生成・カスタマイズされたコンポーネント
- `src/lib/`: ユーティリティ関数や Supabase クライアントの初期化など
- `src/hooks/`: カスタム React フック (例: `use-toast.ts`)
