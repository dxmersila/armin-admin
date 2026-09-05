import type { HTMLAttributes, ReactNode } from 'react'

interface CardProps extends HTMLAttributes<HTMLDivElement> {
  children: ReactNode
}

export default function Card({
  children,
  className = '',
  ...props
}: CardProps) {
  return (
    <div
      {...props}
      className={[
        'rounded-lg border border-border bg-surface text-surface-foreground',
        'shadow-sm',
        className,
      ].join(' ')}
    >
      {children}
    </div>
  )
}
