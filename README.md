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

## Vercel へのデプロイ

この Next.js アプリケーションは Vercel に簡単にデプロイできます。

1.  **Vercel アカウントの準備:**

    - Vercel のアカウントを持っていない場合は、[Vercel 公式サイト](https://vercel.com/)でサインアップしてください。
    - GitHub, GitLab, Bitbucket いずれかのアカウントで簡単に連携できます。

2.  **プロジェクトのインポート:**

    - Vercel にログインし、「New Project」ボタンをクリックします。
    - この Todo アプリのリポジトリを GitHub などからインポートします。（事前にリポジトリを GitHub などにプッシュしておく必要があります。）
    - Vercel がリポジトリを分析し、自動的にフレームワークプリセットとして「Next.js」を検出するはずです。

3.  **プロジェクトの設定:**

    - **Project Name**: Vercel 上でのプロジェクト名を設定します。例: `nextjs-todo-cursor`
    - **Framework Preset**: 「Next.js」が選択されていることを確認します。
    - **Root Directory**: 通常はリポジトリのルート (`./`) のままで問題ありません。
    - **Build and Output Settings**:
      - **Build Command**: `npm run build` または `next build` が自動で設定されることが多いです。もしカスタマイズが必要な場合は上書きできます。
      - **Output Directory**: Next.js のデフォルト（`.next`）が自動で設定されます。
      - **Install Command**: `yarn install`, `pnpm install`, `npm install`, `bun install` のいずれかが、リポジトリ内のロックファイルに基づいて自動選択されるか、手動で設定できます。
    - **Environment Variables（環境変数）:**
      これが最も重要な設定の一つです。Supabase に接続するために、以下の環境変数を Vercel のプロジェクト設定に追加します。
      - `NEXT_PUBLIC_SUPABASE_URL`: あなたの Supabase プロジェクトの URL（`.env.local` に設定したものと同じ）
      - `NEXT_PUBLIC_SUPABASE_ANON_KEY`: あなたの Supabase プロジェクトの Anon Key（`.env.local` に設定したものと同じ）
        Vercel のプロジェクト設定画面の「Environment Variables」セクションで、Key と Value をそれぞれ入力して追加してください。

4.  **デプロイ:**
    - 上記の設定が完了したら、「Deploy」ボタンをクリックします。
    - Vercel がビルドプロセスを開始し、完了するとデプロイされた URL が提供されます。
