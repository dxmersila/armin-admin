import { LoaderCircle } from 'lucide-react'

type SpinnerSize = 'sm' | 'md' | 'lg'

interface SpinnerProps {
  size?: SpinnerSize
  label?: string
}

const sizeClasses: Record<SpinnerSize, string> = {
  sm: 'size-4',
  md: 'size-5',
  lg: 'size-6',
}

export default function Spinner({
  size = 'md',
  label,
}: SpinnerProps) {
  return (
    <LoaderCircle
      className={`${sizeClasses[size]} animate-spin text-muted-foreground`}
      {...(label
        ? {
            'aria-label': label,
            role: 'status',
          }
        : {
            'aria-hidden': true,
          })}
    />
  )
}
