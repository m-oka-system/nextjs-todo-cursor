'use client'

import { useState } from 'react'
import { useFormContext, Controller, Control } from 'react-hook-form' // useFormContext と Control をインポート
import { format } from 'date-fns'
import { ja } from 'date-fns/locale'
import { CalendarIcon } from 'lucide-react'

import { cn } from '@/lib/utils'
import { Button } from '@/components/ui/button'
import { Calendar } from '@/components/ui/calendar'
import { Input } from '@/components/ui/input'
import { Label } from '@/components/ui/label'
import { Checkbox } from "@/components/ui/checkbox"
import {
  Popover,
  PopoverContent,
  PopoverTrigger,
} from '@/components/ui/popover'

// 親から渡されるフォームデータの型 (zodスキーマと一致させる)
interface FormValues {
  task: string;
  dueDate?: Date;
  is_completed?: boolean;
}

interface TodoFormFieldsProps {
  control: Control<FormValues>; // react-hook-formのcontrolオブジェクト
  isSubmitting: boolean;
  showCompletedCheckbox?: boolean; // 完了チェックボックスを表示するかどうか
}

export function TodoFormFields({ control, isSubmitting, showCompletedCheckbox = false }: TodoFormFieldsProps) {
  const { register, formState: { errors }, watch, setValue } = useFormContext<FormValues>(); // 親のフォームコンテキストを使用
  const [isCalendarOpen, setIsCalendarOpen] = useState(false)

  return (
    <>
      {/* タスク名入力 */}
      <div>
        <Label htmlFor="task">タスク名</Label>
        <Input
          id="task"
          placeholder="例: 牛乳を買う"
          {...register('task')}
          disabled={isSubmitting}
        />
        {errors.task && (
          <p className="text-sm text-red-500 mt-1">{errors.task.message}</p>
        )}
      </div>

      {/* 期限日入力 */}
      <div>
        <Label htmlFor="dueDate">期限日 (任意)</Label>
        <Popover open={isCalendarOpen} onOpenChange={setIsCalendarOpen}>
          <PopoverTrigger asChild>
            <Button
              variant={'outline'}
              className={cn(
                'w-full justify-start text-left font-normal',
                !watch('dueDate') && 'text-muted-foreground'
              )}
              disabled={isSubmitting}
              onClick={() => setIsCalendarOpen(true)}
            >
              <CalendarIcon className="mr-2 h-4 w-4" />
              {watch('dueDate') ? (
                format(watch('dueDate')!, 'PPP', { locale: ja })
              ) : (
                <span>日付を選択</span>
              )}
            </Button>
          </PopoverTrigger>
          <PopoverContent className="w-auto p-0">
            <Calendar
              mode="single"
              selected={watch('dueDate')}
              onSelect={(date) => {
                setValue('dueDate', date, { shouldValidate: true })
                setIsCalendarOpen(false)
              }}
              initialFocus
              locale={ja}
            />
          </PopoverContent>
        </Popover>
      </div>

      {/* 完了状態チェックボックス (条件付き表示) */}
      {showCompletedCheckbox && (
        <div className="flex items-center space-x-2 pt-2">
          <Controller
            name="is_completed"
            control={control} // 親から渡されたcontrolを使用
            render={({ field }) => (
              <Checkbox
                id="is_completed"
                checked={field.value}
                onCheckedChange={field.onChange}
                disabled={isSubmitting}
              />
            )}
          />
          <Label htmlFor="is_completed" className="text-sm font-medium leading-none peer-disabled:cursor-not-allowed peer-disabled:opacity-70">
            完了にする
          </Label>
        </div>
      )}
    </>
  )
}
