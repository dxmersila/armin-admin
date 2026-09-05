import type { ReactNode } from 'react'
import {
  AlertCircle,
  CheckCircle2,
  Info,
  TriangleAlert,
} from 'lucide-react'

type AlertVariant = 'success' | 'error' | 'warning' | 'info'

interface AlertProps {
  variant?: AlertVariant
  children: ReactNode
  title?: string
}

const variantClasses: Record<AlertVariant, string> = {
  success: 'border-success/30 bg-success/10 text-success',
  error: 'border-danger/30 bg-danger/10 text-danger',
  warning: 'border-warning/30 bg-warning/10 text-warning',
  info: 'border-info/30 bg-info/10 text-info',
}

const icons: Record<AlertVariant, typeof Info> = {
  success: CheckCircle2,
  error: AlertCircle,
  warning: TriangleAlert,
  info: Info,
}

export default function Alert({
  variant = 'info',
  title,
  children,
}: AlertProps) {
  const Icon = icons[variant]

  return (
    <div
      role="alert"
      className={[
        'flex gap-3 rounded-lg border px-4 py-3',
        variantClasses[variant],
      ].join(' ')}
    >
      <Icon className="mt-0.5 size-5 shrink-0" />

      <div className="min-w-0">
        {title && (
          <p className="text-sm font-semibold">
            {title}
          </p>
        )}

        <div className={title ? 'mt-1 text-sm' : 'text-sm'}>
          {children}
        </div>
      </div>
    </div>
  )
}
