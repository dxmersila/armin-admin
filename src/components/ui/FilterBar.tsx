import type { HTMLAttributes, ReactNode } from 'react'

interface FilterBarProps extends HTMLAttributes<HTMLDivElement> {
  children: ReactNode
}

export default function FilterBar({
  children,
  className = '',
  ...props
}: FilterBarProps) {
  return (
    <div
      {...props}
      className={[
        'space-y-5',
        className,
      ].join(' ')}
    >
      {children}
    </div>
  )
}
