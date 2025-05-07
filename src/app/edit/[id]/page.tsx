'use client'

import { useState, useEffect } from 'react'
import { useRouter, useParams } from 'next/navigation'
import Link from 'next/link'
import { zodResolver } from '@hookform/resolvers/zod'
import { useForm, FormProvider } from 'react-hook-form' // FormProviderをインポート
import * as z from 'zod'
import { format, parseISO } from 'date-fns'
// import { ja } from 'date-fns/locale' // TodoFormFields側で処理
import { ArrowLeftCircle } from 'lucide-react' // CalendarIconはTodoFormFields側

import { Button } from '@/components/ui/button'
// Calendar, Input, Label, Popover関連, CheckboxはTodoFormFields側で使用
import { supabase } from '@/lib/supabaseClient'
import { useToast } from '@/hooks/use-toast'
import { TodoFormFields } from '@/components/TodoFormFields' // 共通フォームフィールドをインポート

const formSchema = z.object({
  task: z.string().min(1, { message: 'タスクを入力してください。' }),
  dueDate: z.date().optional(),
  is_completed: z.boolean().optional(),
})

type FormData = z.infer<typeof formSchema>

export default function EditTodoPage() {
  const router = useRouter()
  const params = useParams()
  const todoId = params.id as string
  const { toast } = useToast()

  const methods = useForm<FormData>({
    resolver: zodResolver(formSchema),
    // defaultValues のロジックは変更なし
    defaultValues: async () => {
      if (!todoId) return { task: '', is_completed: false };
      try {
        const { data, error } = await supabase
          .from('todos')
          .select('*')
          .eq('id', todoId)
          .single()
        if (error || !data) {
          toast({ title: 'エラー', description: 'タスクデータの読み込みに失敗しました。', variant: 'destructive' });
          router.push('/');
          return { task: '', is_completed: false };
        }
        return {
          task: data.task || '',
          dueDate: data.due_date ? parseISO(data.due_date) : undefined,
          is_completed: data.is_completed || false,
        };
      } catch (fetchError) {
        console.error('Error fetching task data for edit:', fetchError);
        toast({ title: 'エラー', description: 'タスクデータの読み込み中に問題が発生しました。', variant: 'destructive' });
        router.push('/');
        return { task: '', is_completed: false };
      }
    }
  })

  const [isSubmitting, setIsSubmitting] = useState(false)
  const [isLoadingData, setIsLoadingData] = useState(true);

  useEffect(() => {
    if (methods.formState.isDirty || Object.keys(methods.formState.defaultValues || {}).length > 2) {
      setIsLoadingData(false);
    }
  }, [methods.formState.isDirty, methods.formState.defaultValues]);

  async function onSubmit(data: FormData) {
    if (!todoId) return;
    setIsSubmitting(true)
    try {
      const { error } = await supabase
        .from('todos')
        .update({
          task: data.task,
          due_date: data.dueDate ? format(data.dueDate, 'yyyy-MM-dd') : null,
          is_completed: data.is_completed,
        })
        .eq('id', todoId)

      if (error) {
        throw error
      }

      toast({
        title: '成功',
        description: 'タスクを更新しました。',
      })
      router.push('/')

    } catch (error) {
      console.error('Error updating task:', error)
      let errorMessage = 'タスクの更新に失敗しました。'
      if (error instanceof Error) {
        errorMessage = `${errorMessage} (${error.message})`
      }
      toast({
        title: 'エラー',
        description: errorMessage,
        variant: 'destructive',
      })
    } finally {
      setIsSubmitting(false)
    }
  }

  if (isLoadingData) {
    return <p className="text-center mt-8">タスクデータを読み込み中...</p>;
  }

  return (
    <div className="max-w-md mx-auto">
      <h1 className="text-2xl font-bold text-center mb-6">タスク編集</h1>
      <FormProvider {...methods}> {/* FormProviderでラップ */}
        <form onSubmit={methods.handleSubmit(onSubmit)} className="space-y-4">
          <TodoFormFields
            control={methods.control} // controlを渡す
            isSubmitting={isSubmitting}
            showCompletedCheckbox={true} // 編集時はチェックボックス表示
          />
          <div className="space-y-4 pt-2">
            <Button type="submit" disabled={isSubmitting || isLoadingData} className="w-full">
              {isSubmitting ? '更新中...' : 'タスクを更新'}
            </Button>
            <Button asChild variant="outline" className="w-full" disabled={isSubmitting || isLoadingData}>
              <Link href="/">
                <ArrowLeftCircle className="mr-2 h-4 w-4" /> トップへ戻る
              </Link>
            </Button>
          </div>
        </form>
      </FormProvider>
    </div>
  )
}
