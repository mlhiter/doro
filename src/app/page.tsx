'use client'

import { Button } from '@/components/ui/button'
import { Input } from '@/components/ui/input'
import { useTRPC } from '@/trpc/client'
import { useMutation, useQuery } from '@tanstack/react-query'
import { useState } from 'react'
import { toast } from 'sonner'

export default function Home() {
  const [value, setValue] = useState('')

  const trpc = useTRPC()

  const { data: messages } = useQuery(trpc.messages.getMany.queryOptions())

  const createMessage = useMutation(
    trpc.messages.create.mutationOptions({
      onSuccess: () => toast.success('Background job started!'),
    })
  )

  return (
    <div className="mx-auto max-w-7xl p-4">
      <Input value={value} onChange={(e) => setValue(e.target.value)} />
      <Button onClick={() => createMessage.mutate({ value })} disabled={createMessage.isPending}>
        Invoke
      </Button>

      {JSON.stringify(messages)}
    </div>
  )
}
