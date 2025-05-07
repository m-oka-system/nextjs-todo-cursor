'use client'

import { useState } from 'react'
import { useRouter } from 'next/navigation'
import Link from 'next/link'
import { zodResolver } from '@hookform/resolvers/zod'
import { useForm, FormProvider } from 'react-hook-form'
import * as z from 'zod'
import { format } from 'date-fns'
import { ArrowLeftCircle } from 'lucide-react'

import { Button } from '@/components/ui/button'
import { supabase } from '@/lib/supabaseClient'
import { useToast } from '@/hooks/use-toast'
import { TodoFormFields } from '@/components/TodoFormFields'

const formSchema = z.object({
  task: z.string().min(1, { message: 'タスクを入力してください。' }),
  dueDate: z.date().optional(),
})

type FormData = z.infer<typeof formSchema>

export default function NewTodoPage() {
  const router = useRouter()
  const { toast } = useToast()
  const methods = useForm<FormData>({
    resolver: zodResolver(formSchema),
    defaultValues: {
      task: '',
    },
  })

  const [isSubmitting, setIsSubmitting] = useState(false)

  async function onSubmit(data: FormData) {
    setIsSubmitting(true)
    try {
      const { error } = await supabase.from('todos').insert([
        {
          task: data.task,
          due_date: data.dueDate ? format(data.dueDate, 'yyyy-MM-dd') : null,
          is_completed: false,
        },
      ])

      if (error) {
        throw error
      }

      toast({
        title: '成功',
        description: '新しいタスクを登録しました。',
      })
      router.push('/')

    } catch (error) {
      console.error('Error adding task:', error)
      let errorMessage = 'タスクの登録に失敗しました。'
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

  return (
    <div className="max-w-md mx-auto">
      <h1 className="text-2xl font-bold text-center mb-6">新規タスク登録</h1>
      <FormProvider {...methods}>
        <form onSubmit={methods.handleSubmit(onSubmit)} className="space-y-4">
          <TodoFormFields
            control={methods.control}
            isSubmitting={isSubmitting}
            showCompletedCheckbox={false}
          />
          <div className="space-y-4 pt-2">
            <Button type="submit" disabled={isSubmitting} className="w-full">
              {isSubmitting ? '登録中...' : 'タスクを登録'}
            </Button>
            <Button asChild variant="outline" className="w-full">
              <Link href="/">
                <ArrowLeftCircle className="h-4 w-4" /> トップへ戻る
              </Link>
            </Button>
          </div>
        </form>
      </FormProvider>
    </div>
  )
}
