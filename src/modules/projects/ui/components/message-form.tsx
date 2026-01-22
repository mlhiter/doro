import { useForm } from 'react-hook-form'
import z from 'zod'
import { zodResolver } from '@hookform/resolvers/zod'
import TextareaAutoSize from 'react-textarea-autosize'
import { Form, FormField } from '@/components/ui/form'
import { cn } from '@/lib/utils'
import { useState } from 'react'
import { useMutation, useQuery, useQueryClient } from '@tanstack/react-query'
import { toast } from 'sonner'
import { useTRPC } from '@/trpc/client'
import { Button } from '@/components/ui/button'
import { ArrowUpIcon, Loader2 } from 'lucide-react'
import { Usage } from './usage'
import { useRouter } from 'next/navigation'

interface MessageFormProps {
  projectId: string
}

const formSchema = z.object({
  value: z.string().min(1, { message: 'Value is required' }).max(10000, { message: 'Value is too long' }),
})

export const MessageForm = ({ projectId }: MessageFormProps) => {
  const trpc = useTRPC()
  const queryClient = useQueryClient()
  const router = useRouter()
  const form = useForm<z.infer<typeof formSchema>>({
    resolver: zodResolver(formSchema),
    defaultValues: {
      value: '',
    },
  })
  const { data: usage } = useQuery(trpc.usage.status.queryOptions())
  const createMessage = useMutation(
    trpc.messages.create.mutationOptions({
      onError: (error) => {
        toast.error(error.message)
        if (error.data?.code === 'TOO_MANY_REQUESTS') {
          router.push('/pricing')
        }
      },
      onSuccess: () => {
        form.reset()
        queryClient.invalidateQueries(trpc.messages.getMany.queryOptions({ projectId }))
        queryClient.invalidateQueries(trpc.usage.status.queryOptions())
      },
    })
  )
  const onSubmit = async (values: z.infer<typeof formSchema>) => {
    await createMessage.mutateAsync({
      value: values.value,
      projectId,
    })
  }

  const [isFocused, setIsFocused] = useState(false)
  const isPending = createMessage.isPending
  const isButtonDisabled = isPending || !form.formState.isValid
  const showUsage = !!usage

  return (
    <Form {...form}>
      {showUsage && <Usage points={usage.remainingPoints} msBeforeNext={usage.msBeforeNext} />}
      <form
        onSubmit={form.handleSubmit(onSubmit)}
        className={cn(
          'relative rounded-xl border bg-sidebar p-4 pt-1 transition-all dark:bg-sidebar',
          isFocused && 'shadow-xs',
          showUsage && 'rounded-t-none'
        )}>
        <FormField
          control={form.control}
          name="value"
          render={({ field }) => (
            <TextareaAutoSize
              {...field}
              disabled={isPending}
              onFocus={() => setIsFocused(true)}
              onBlur={() => setIsFocused(false)}
              minRows={2}
              maxRows={8}
              className="w-full resize-none border-none bg-transparent pt-4 outline-none"
              placeholder="What would you like to build?"
              onKeyDown={(e) => {
                if (e.key === 'Enter' && (e.ctrlKey || e.metaKey)) {
                  e.preventDefault()
                  form.handleSubmit(onSubmit)(e)
                }
              }}
            />
          )}
        />
        <div className="flex items-end justify-between gap-x-2 pt-2">
          <div className="font-mono text-[10px] text-muted-foreground">
            <kbd className="pointer-events-none ml-auto inline-flex h-5 items-center gap-1 rounded border bg-muted px-1.5 font-mono text-[10px] font-medium text-muted-foreground select-none">
              <span>&#8984;</span>Enter
            </kbd>
            &nbsp;to submit
          </div>
          <Button
            type="submit"
            disabled={isButtonDisabled}
            className={cn('size-8 rounded-full', isButtonDisabled && 'border bg-muted-foreground')}>
            {isPending ? <Loader2 className="size-4 animate-spin" /> : <ArrowUpIcon />}
          </Button>
        </div>
      </form>
    </Form>
  )
}
