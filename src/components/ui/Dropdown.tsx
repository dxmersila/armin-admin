import {
  cloneElement,
  useEffect,
  useRef,
  useState,
  type MouseEvent,
  type ReactElement,
  type ReactNode,
} from 'react'

interface DropdownTriggerProps {
  onClick?: (event: MouseEvent<HTMLElement>) => void
  'aria-haspopup'?: 'menu'
  'aria-expanded'?: boolean
}

interface DropdownProps {
  trigger: ReactElement<DropdownTriggerProps>
  children: ReactNode
  align?: 'start' | 'end'
}

export default function Dropdown({
  trigger,
  children,
  align = 'end',
}: DropdownProps) {
  const [isOpen, setIsOpen] = useState(false)
  const containerRef = useRef<HTMLDivElement>(null)

  useEffect(() => {
    if (!isOpen) {
      return
    }

    function handleClickOutside(event: globalThis.MouseEvent) {
      if (
        containerRef.current &&
        !containerRef.current.contains(event.target as Node)
      ) {
        setIsOpen(false)
      }
    }

    function handleKeyDown(event: KeyboardEvent) {
      if (event.key === 'Escape') {
        setIsOpen(false)
      }
    }

    document.addEventListener('mousedown', handleClickOutside)
    document.addEventListener('keydown', handleKeyDown)

    return () => {
      document.removeEventListener('mousedown', handleClickOutside)
      document.removeEventListener('keydown', handleKeyDown)
    }
  }, [isOpen])

  const triggerElement = cloneElement(trigger, {
    'aria-haspopup': 'menu',
    'aria-expanded': isOpen,
    onClick: (event) => {
      trigger.props.onClick?.(event)
      setIsOpen((current) => !current)
    },
  })

  return (
    <div ref={containerRef} className="relative inline-block">
      {triggerElement}

      {isOpen && (
        <div
          role="menu"
          className={[
            'absolute z-50 mt-2 min-w-40 rounded-lg border border-border',
            'bg-surface p-1 shadow-lg',
            align === 'end' ? 'end-0' : 'start-0',
          ].join(' ')}
        >
          {children}
        </div>
      )}
    </div>
  )
}
