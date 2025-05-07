'use client'

import { useState } from 'react'
import { zodResolver } from '@hookform/resolvers/zod'
import { useForm } from 'react-hook-form'
import * as z from 'zod'
import { format } from 'date-fns'
import { ja } from 'date-fns/locale'
import { CalendarIcon } from 'lucide-react'

import { cn } from '@/lib/utils'
import { Button } from '@/components/ui/button'
import { Calendar } from '@/components/ui/calendar'
import { Input } from '@/components/ui/input'
import { Label } from '@/components/ui/label'
import {
  Popover,
  PopoverContent,
  PopoverTrigger,
} from '@/components/ui/popover'
import { supabase } from '@/lib/supabaseClient'

// フォームの入力値の型とバリデーションルールを定義します
// z.objectでオブジェクトの形を定義し、各プロパティに対してルールを設定します
const formSchema = z.object({
  task: z.string().min(1, { message: 'タスクを入力してください。' }), // taskは文字列で、1文字以上必須
  dueDate: z.date().optional(), // dueDateは日付型で、任意入力
})

// フォームの型を推論します
type FormData = z.infer<typeof formSchema>

// TodoFormコンポーネントのプロパティ(引数)の型を定義します
interface TodoFormProps {
  onTaskAdded: () => void // タスクが追加されたときに呼び出される関数
}

export function TodoForm({ onTaskAdded }: TodoFormProps) {
  // フォームの状態管理とバリデーションを行います
  const form = useForm<FormData>({
    resolver: zodResolver(formSchema), // zodを使ってバリデーションを実行
    defaultValues: { // フォームの初期値
      task: '',
    },
  })

  // フォーム送信時の処理中フラグ
  const [isSubmitting, setIsSubmitting] = useState(false)
  const [isCalendarOpen, setIsCalendarOpen] = useState(false) // CalendarのPopoverの開閉状態

  // フォームが送信されたときの処理
  async function onSubmit(data: FormData) {
    setIsSubmitting(true) // 処理中フラグを立てる
    try {
      // Supabaseのtodosテーブルに新しいタスクを挿入します
      const { error } = await supabase.from('todos').insert([
        {
          task: data.task,
          due_date: data.dueDate ? format(data.dueDate, 'yyyy-MM-dd') : null, // 日付を 'YYYY-MM-DD' 形式に
          is_completed: false, // 最初は未完了
        },
      ])

      if (error) {
        console.error('Error adding task:', error)
        // ここでユーザーにエラーを通知する処理を追加できます (例: トースト通知)
        alert(`タスクの追加に失敗しました: ${error.message}`)
      } else {
        form.reset() // フォームの内容をリセット
        onTaskAdded() // 親コンポーネントにタスク追加を通知
      }
    } catch (error) {
      console.error('Unexpected error adding task:', error)
      alert('予期せぬエラーが発生しました。')
    } finally {
      setIsSubmitting(false) // 処理中フラグを下ろす
    }
  }

  return (
    // React Hook Formの <form> コンポーネント。onSubmitに関数を渡します
    <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-4">
      <div>
        <Label htmlFor="task">タスク名</Label>
        {/* React Hook Formの register を使ってInputコンポーネントをフォームに登録します */}
        <Input
          id="task"
          placeholder="例: 牛乳を買う"
          {...form.register('task')} // 'task' という名前でフォームデータを管理
          disabled={isSubmitting} // 送信中は無効化
        />
        {/* バリデーションエラーメッセージを表示します */}
        {form.formState.errors.task && (
          <p className="text-sm text-red-500 mt-1">
            {form.formState.errors.task.message}
          </p>
        )}
      </div>

      <div>
        <Label htmlFor="dueDate">期限日 (任意)</Label>
        {/* Popoverを使ってカレンダーを表示します */}
        <Popover open={isCalendarOpen} onOpenChange={setIsCalendarOpen}> {/* Popoverの開閉をstateで制御 */}
          <PopoverTrigger asChild>
            <Button
              variant={'outline'}
              className={cn(
                'w-full justify-start text-left font-normal',
                !form.watch('dueDate') && 'text-muted-foreground' // 日付が選択されていなければ薄い色に
              )}
              disabled={isSubmitting} // 送信中は無効化
              onClick={() => setIsCalendarOpen(true)} // ボタンクリックでPopoverを開く
            >
              <CalendarIcon className="mr-2 h-4 w-4" />
              {/* 選択された日付を表示、なければプレースホルダーを表示 */}
              {form.watch('dueDate') ? (
                format(form.watch('dueDate')!, 'PPP', { locale: ja }) // PPP形式の表示にロケール適用
              ) : (
                <span>日付を選択</span>
              )}
            </Button>
          </PopoverTrigger>
          <PopoverContent className="w-auto p-0">
            <Calendar
              mode="single" // 単一の日付を選択
              selected={form.watch('dueDate')}
              // 日付が選択されたら、フォームの状態を更新します
              onSelect={(date) => {
                form.setValue('dueDate', date, { shouldValidate: true })
                setIsCalendarOpen(false) // 日付選択時にPopoverを閉じる
              }}
              initialFocus // Popoverが開いたときにカレンダーにフォーカス
              locale={ja} // Calendarコンポーネントにロケールを渡す
            />
          </PopoverContent>
        </Popover>
      </div>

      <Button type="submit" disabled={isSubmitting} className="w-full">
        {isSubmitting ? '追加中...' : 'タスクを追加'}
      </Button>
    </form>
  )
}
