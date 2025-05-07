'use client'

import { useState } from 'react'
import { supabase } from '@/lib/supabaseClient'
import { Button } from '@/components/ui/button'
import { Checkbox } from '@/components/ui/checkbox'
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from '@/components/ui/table'
import { Trash2, Edit3 } from 'lucide-react'
import { format, parseISO } from 'date-fns'
import { useToast } from '@/hooks/use-toast'
import {
  AlertDialog,
  AlertDialogAction,
  AlertDialogCancel,
  AlertDialogContent,
  AlertDialogDescription,
  AlertDialogFooter,
  AlertDialogHeader,
  AlertDialogTitle,
} from "@/components/ui/alert-dialog"
import Link from 'next/link'

// Supabaseから取得するtodosテーブルの型を定義
export interface Todo {
  id: string
  task: string | null
  is_completed: boolean | null
  created_at: string | null
  due_date: string | null // YYYY-MM-DD 形式の文字列を想定
}

// 親コンポーネントから受け取るPropsの型を定義
interface TodoListProps {
  todos: Todo[]
  isLoading: boolean
  error: string | null
  onRefresh: () => Promise<void> // データ再取得を親に依頼する関数
}

export function TodoList({ todos, isLoading, error, onRefresh }: TodoListProps) {
  const { toast } = useToast()
  const [showDeleteDialog, setShowDeleteDialog] = useState(false)
  const [taskToDelete, setTaskToDelete] = useState<string | null>(null)

  const handleToggleComplete = async (id: string, currentState: boolean | null) => {
    const newIsCompleted = !currentState
    try {
      const { error: updateError } = await supabase
        .from('todos')
        .update({ is_completed: newIsCompleted })
        .eq('id', id)

      if (updateError) {
        throw updateError
      }
      await onRefresh()
    } catch (err) {
      console.error('Error updating task status:', err)
    }
  }

  const confirmDeleteTask = (id: string) => {
    setTaskToDelete(id);
    setShowDeleteDialog(true);
  };

  const handleDeleteTask = async () => {
    if (!taskToDelete) return;
    try {
      const { error: deleteError } = await supabase
        .from('todos')
        .delete()
        .eq('id', taskToDelete);
      if (deleteError) { throw deleteError; }
      await onRefresh()
      toast({ title: '成功', description: 'タスクを削除しました。' });
    } catch (err) {
      console.error('Error deleting task:', err);
      let errorMessage = 'タスクの削除に失敗しました。';
      if (err instanceof Error) { errorMessage = `${errorMessage} (${err.message})`; }
      toast({ title: 'エラー', description: errorMessage, variant: 'destructive' });
    } finally {
      setShowDeleteDialog(false);
      setTaskToDelete(null);
    }
  };

  // ローディング、エラー、空状態の表示はPropsで受け取った値を使用
  if (isLoading) {
    return <p>読み込み中...</p>
  }

  if (error) {
    return <p className="text-red-500">{error}</p>
  }

  if (todos.length === 0) {
    return <p>タスクはありません。</p>
  }

  return (
    <>
      <Table>
        <TableHeader>
          <TableRow>
            <TableHead className="w-[50px]"></TableHead>
            <TableHead>タスク名</TableHead>
            <TableHead className="w-[120px]">期限日</TableHead>
            <TableHead className="w-[150px] text-right">操作</TableHead>
          </TableRow>
        </TableHeader>
        <TableBody>
          {todos.map((todo) => (
            <TableRow key={todo.id}>
              <TableCell>
                <Checkbox
                  checked={!!todo.is_completed}
                  onCheckedChange={() => handleToggleComplete(todo.id, todo.is_completed)}
                />
              </TableCell>
              <TableCell className={todo.is_completed ? 'line-through text-gray-500' : ''}>
                {todo.task}
              </TableCell>
              <TableCell className={todo.is_completed ? 'line-through text-gray-500' : ''}>
                {todo.due_date ? format(parseISO(todo.due_date), 'yyyy/MM/dd') : '-'}
              </TableCell>
              <TableCell className="text-right space-x-1">
                <Button asChild variant="ghost" size="icon" title="編集">
                  <Link href={`/edit/${todo.id}`}>
                    <Edit3 className="h-4 w-4" />
                  </Link>
                </Button>
                <Button
                  variant="ghost"
                  size="icon"
                  onClick={() => confirmDeleteTask(todo.id)}
                  title="削除"
                >
                  <Trash2 className="h-4 w-4" />
                </Button>
              </TableCell>
            </TableRow>
          ))}
        </TableBody>
      </Table>

      <AlertDialog open={showDeleteDialog} onOpenChange={setShowDeleteDialog}>
        <AlertDialogContent>
          <AlertDialogHeader>
            <AlertDialogTitle>本当に削除しますか？</AlertDialogTitle>
            <AlertDialogDescription>
              この操作は元に戻せません。タスクを完全に削除します。
            </AlertDialogDescription>
          </AlertDialogHeader>
          <AlertDialogFooter>
            <AlertDialogCancel onClick={() => setTaskToDelete(null)}>キャンセル</AlertDialogCancel>
            <AlertDialogAction onClick={handleDeleteTask}>削除</AlertDialogAction>
          </AlertDialogFooter>
        </AlertDialogContent>
      </AlertDialog>
    </>
  )
}
