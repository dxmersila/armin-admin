import type {
  ButtonHTMLAttributes,
  ReactNode,
} from 'react'

type IconButtonVariant = 'default' | 'danger'

interface IconButtonProps
  extends ButtonHTMLAttributes<HTMLButtonElement> {
  variant?: IconButtonVariant
  children: ReactNode
}

const variantClasses: Record<
  IconButtonVariant,
  string
> = {
  default:
    'text-muted-foreground hover:bg-muted hover:text-foreground',
  danger:
    'text-danger hover:bg-danger/10',
}

export default function IconButton({
  variant = 'default',
  children,
  className = '',
  ...props
}: IconButtonProps) {
  return (
    <button
      {...props}
      className={[
        'inline-flex size-8 items-center justify-center rounded-md',
        'transition focus:outline-none focus:ring-2 focus:ring-ring',
        'disabled:cursor-not-allowed disabled:opacity-50',
        variantClasses[variant],
        className,
      ].join(' ')}
    >
      {children}
    </button>
  )
}
