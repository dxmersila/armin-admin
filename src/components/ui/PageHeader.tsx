import type { ReactNode } from 'react'
import type { LucideIcon } from 'lucide-react'

interface PageHeaderProps {
  title: ReactNode
  description?: ReactNode
  icon?: LucideIcon
  actions?: ReactNode
}

export default function PageHeader({
  title,
  description,
  icon: Icon,
  actions,
}: PageHeaderProps) {
  return (
    <div className="flex flex-col gap-4 sm:flex-row sm:items-start sm:justify-between">
      <div className="min-w-0">
        <h1 className="flex items-center gap-2 text-2xl font-semibold text-foreground">
          {Icon ? (
            <Icon className="size-6 shrink-0" />
          ) : null}

          <span className="min-w-0">{title}</span>
        </h1>

        {description ? (
          <p className="mt-2 text-sm text-muted-foreground">
            {description}
          </p>
        ) : null}
      </div>

      {actions ? (
        <div className="flex flex-wrap items-center gap-3">
          {actions}
        </div>
      ) : null}
    </div>
  )
}
