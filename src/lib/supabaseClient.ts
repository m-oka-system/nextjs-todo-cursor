import { createClient } from '@supabase/supabase-js'

// .env.local からSupabaseのURLと匿名キーを取得します。
// process.env.NEXT_PUBLIC_SUPABASE_URL や process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY は、
// Next.jsがビルド時に .env.local ファイルから読み込んでくれる環境変数です。
const supabaseUrl = process.env.NEXT_PUBLIC_SUPABASE_URL!
const supabaseAnonKey = process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY!

// Supabaseクライアントを作成します。
// これを使って、データベースの操作(データの読み書きなど)を行います。
export const supabase = createClient(supabaseUrl, supabaseAnonKey)
