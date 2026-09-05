import type { TextareaHTMLAttributes } from 'react'

type TextareaSize = 'sm' | 'md' | 'lg'

interface TextareaProps extends TextareaHTMLAttributes<HTMLTextAreaElement> {
  label?: string
  error?: string
  hint?: string
  size?: TextareaSize
}

const sizeClasses: Record<TextareaSize, string> = {
  sm: 'px-3 py-1.5 text-xs',
  md: 'px-3 py-2 text-sm',
  lg: 'px-4 py-2.5 text-sm',
}

export default function Textarea({
  id,
  label,
  error,
  hint,
  size = 'md',
  required,
  disabled,
  className = '',
  rows = 4,
  ...props
}: TextareaProps) {
  const describedBy = error
    ? `${id}-error`
    : hint
      ? `${id}-hint`
      : undefined

  return (
    <div className="w-full">
      {label && (
        <label
          htmlFor={id}
          className="mb-1.5 block text-sm font-medium text-foreground"
        >
          {label}

          {required && (
            <span
              aria-hidden="true"
              className="mr-1 text-danger"
            >
              *
            </span>
          )}
        </label>
      )}

      <textarea
        {...props}
        id={id}
        rows={rows}
        required={required}
        disabled={disabled}
        aria-invalid={Boolean(error)}
        aria-describedby={describedBy}
        className={[
          'block w-full resize-y rounded-md border bg-surface text-foreground',
          'placeholder:text-muted-foreground',
          'transition',
          'focus:border-ring focus:outline-none focus:ring-2 focus:ring-ring/20',
          'disabled:cursor-not-allowed disabled:opacity-50',
          error
            ? 'border-danger focus:border-danger focus:ring-danger/20'
            : 'border-input',
          sizeClasses[size],
          className,
        ].join(' ')}
      />

      {error && (
        <p
          id={`${id}-error`}
          className="mt-1.5 text-xs text-danger"
        >
          {error}
        </p>
      )}

      {!error && hint && (
        <p
          id={`${id}-hint`}
          className="mt-1.5 text-xs text-muted-foreground"
        >
          {hint}
        </p>
      )}
    </div>
  )
}
