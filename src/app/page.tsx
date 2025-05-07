'use client'

// import Image from "next/image"; // 未使用なのでコメントアウトまたは削除
import { TodoList, Todo } from '@/components/TodoList'
import { useState, useEffect } from 'react'
import { supabase } from '@/lib/supabaseClient'
// import { useToast } from '@/hooks/use-toast' // toast関連を削除
import Link from 'next/link' // Linkをインポート
import { Button } from '@/components/ui/button' // Buttonをインポート
import { PlusCircle } from 'lucide-react' // アイコンをインポート

export default function Home() {
  const [todos, setTodos] = useState<Todo[]>([])
  const [isLoading, setIsLoading] = useState(true)
  const [error, setError] = useState<string | null>(null)
  // const { toast } = useToast() // toast関連を削除

  const fetchTodos = async () => {
    setIsLoading(true)
    setError(null)
    try {
      const { data, error: supabaseError } = await supabase
        .from('todos')
        .select('*')
        .order('created_at', { ascending: false })

      if (supabaseError) {
        throw supabaseError
      }
      setTodos(data || [])
    } catch (err) {
      console.error('Error fetching todos:', err)
      let errorMessage = 'タスクの読み込みに失敗しました。'
      if (err instanceof Error) {
        errorMessage = `${errorMessage} (${err.message})`
      }
      setError(errorMessage)
      // ここでのtoast表示はTodoList側に任せても良いし、共通のローディングエラーとして表示しても良い
      // toast({ title: "データ読み込みエラー", description: errorMessage, variant: "destructive" })
    } finally {
      setIsLoading(false)
    }
  }

  useEffect(() => {
    fetchTodos()
  }, [])

  // handleTaskAdded は削除 (新しいUIフローでタスク追加を処理するため)

  return (
    // <main>タグはlayout.tsxに移動したのでここでは不要
    <>
      <div className="mb-8 text-center">
        <h1 className="text-3xl font-bold">Todoリスト</h1>
      </div>

      {/* TodoListとその右上に新規登録ボタンを配置するコンテナ */}
      <div className="max-w-2xl mx-auto">
        <div className="flex justify-end mb-4"> {/* 新規登録ボタンを右寄せ */}
          <Button asChild variant="default" size="default">
            <Link href="/new">
              <PlusCircle className="mr-2 h-5 w-5" /> 新規登録
            </Link>
          </Button>
        </div>
        <TodoList
          todos={todos}
          isLoading={isLoading}
          error={error}
          onRefresh={fetchTodos}
        />
      </div>
    </>
  )
}
