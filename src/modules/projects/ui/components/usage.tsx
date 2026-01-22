import { Button } from '@/components/ui/button'
import { formatDuration, intervalToDuration } from 'date-fns'
import { CrownIcon } from 'lucide-react'
import Link from 'next/link'
import { useAuth } from '@clerk/nextjs'

interface Props {
  points: number
  msBeforeNext: number
}

export const Usage = ({ points, msBeforeNext }: Props) => {
  const { has } = useAuth()
  const hasProAccess = has?.({ plan: 'pro' })

  return (
    <div className="rounded-t-xl border border-b-0 bg-background p-2.5">
      <div className="flex items-center gap-x-2">
        <div>
          <p className="text-sm">
            {points} {hasProAccess ? '' : 'free'} credits remaining
          </p>
          <p className="text-xs text-muted-foreground">
            Resets in {''}
            {formatDuration(
              intervalToDuration({
                start: new Date(),
                // eslint-disable-next-line react-hooks/purity
                end: new Date(Date.now() + msBeforeNext),
              }),
              { format: ['months', 'days', 'hours'] }
            )}
          </p>
        </div>
        {!hasProAccess && (
          <Button variant="tertiary" size="sm" asChild className="ml-auto">
            <Link href="/pricing">
              <CrownIcon /> Upgrade
            </Link>
          </Button>
        )}
      </div>
    </div>
  )
}
