import {
  ChevronDown,
  Filter,
} from 'lucide-react'
import {
  useState,
  type ReactNode,
} from 'react'

import Card from './Card'
import FilterBar from './FilterBar'

interface CollapsibleFilterBarProps {
  title: string
  description?: string
  activeCount?: number
  defaultOpen?: boolean
  children: ReactNode
}

export default function CollapsibleFilterBar({
  title,
  description,
  activeCount = 0,
  defaultOpen = false,
  children,
}: CollapsibleFilterBarProps) {
  const [isOpen, setIsOpen] = useState(defaultOpen)

  return (
    <Card className="p-4 sm:p-6">
      <button
        type="button"
        className="flex w-full items-center justify-between gap-3 text-start"
        onClick={() => setIsOpen((value) => !value)}
        aria-expanded={isOpen}
        aria-controls="filter-content"
      >
        <div className="flex items-center gap-2">
          <Filter className="size-5 text-muted-foreground" />

          <div>
            <h2 className="text-lg font-semibold text-foreground">
              {title}

              {activeCount > 0 && (
                <span className="ms-2 text-sm text-primary">
                  ({activeCount})
                </span>
              )}
            </h2>

            {description && (
              <p className="mt-1 text-sm text-muted-foreground">
                {description}
              </p>
            )}
          </div>
        </div>

        <ChevronDown
          className={[
            'size-5 transition-transform',
            isOpen ? 'rotate-180' : '',
          ].join(' ')}
        />
      </button>

      {isOpen && (
        <div
          id="filter-content"
          className="mt-5"
        >
          <FilterBar>
            {children}
          </FilterBar>
        </div>
      )}
    </Card>
  )
}
