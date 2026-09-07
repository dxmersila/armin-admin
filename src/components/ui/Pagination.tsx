import { ChevronLeft, ChevronRight } from 'lucide-react'
import Button from './Button'

interface PaginationProps {
  currentPage: number
  lastPage: number
  onPageChange: (page: number) => void
  disabled?: boolean
}

export default function Pagination({
  currentPage,
  lastPage,
  onPageChange,
  disabled = false,
}: PaginationProps) {
  if (lastPage <= 1) {
    return null
  }

  return (
    <div className="flex items-center justify-between gap-2">
      <Button
        variant="secondary"
        size="sm"
        className="px-2 py-1 text-xs sm:px-3 sm:py-1.5 sm:text-xs"
        disabled={disabled || currentPage <= 1}
        onClick={() => onPageChange(currentPage - 1)}
      >
        <ChevronRight className="size-4" />
        قبلی
      </Button>

      <span className="whitespace-nowrap text-center text-xs text-muted-foreground sm:text-sm">
        صفحه {currentPage} از {lastPage}
      </span>

      <Button
        variant="secondary"
        size="sm"
        className="px-2 py-1 text-xs sm:px-3 sm:py-1.5 sm:text-xs"
        disabled={disabled || currentPage >= lastPage}
        onClick={() => onPageChange(currentPage + 1)}
      >
        بعدی
        <ChevronLeft className="size-4" />
      </Button>
    </div>
  )
}
