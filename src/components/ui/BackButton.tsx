import type { ReactNode } from 'react'
import { ArrowRight } from 'lucide-react'
import { Link, type LinkProps } from 'react-router'

interface BackButtonProps extends LinkProps {
  children?: ReactNode
}

export default function BackButton({
  children = 'بازگشت',
  className = '',
  ...props
}: BackButtonProps) {
  return (
    <Link
      {...props}
      className={[
        'inline-flex shrink-0 items-center justify-center gap-2 rounded-md',
        'border border-border bg-surface px-3 py-1.5 text-sm font-medium',
        'text-foreground transition hover:bg-muted',
        'focus:outline-none focus:ring-2 focus:ring-ring',
        className,
      ].join(' ')}
    >
      <ArrowRight className="size-4" />
      {children}
    </Link>
  )
}
