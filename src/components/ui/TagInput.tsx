import { useState, type KeyboardEvent } from 'react'
import { useTranslation } from 'react-i18next'
import { X } from 'lucide-react'

interface TagInputProps {
  value: string[]
  onChange: (value: string[]) => void
  label?: string
  placeholder?: string
  error?: string
  hint?: string
  disabled?: boolean
}

export default function TagInput({
  value,
  onChange,
  label,
  placeholder,
  error,
  hint,
  disabled = false,
}: TagInputProps) {
  const { t } = useTranslation()
  const resolvedLabel = label ?? t('tags.label')
  const resolvedPlaceholder = placeholder ?? t('tags.placeholder')
  const [inputValue, setInputValue] = useState('')

  function addTag() {
    const tag = inputValue.trim()

    if (!tag || disabled) {
      return
    }

    const exists = value.some(
      (existingTag) => existingTag.toLowerCase() === tag.toLowerCase(),
    )

    if (exists) {
      setInputValue('')
      return
    }

    onChange([...value, tag])
    setInputValue('')
  }

  function removeTag(tagToRemove: string) {
    onChange(value.filter((tag) => tag !== tagToRemove))
  }

  function handleKeyDown(event: KeyboardEvent<HTMLInputElement>) {
    if (event.key !== 'Enter') {
      return
    }

    event.preventDefault()
    addTag()
  }

  return (
    <div className="w-full">
      {resolvedLabel && (
        <label className="mb-1.5 block text-sm font-medium text-foreground">
          {resolvedLabel}
        </label>
      )}

      <div
        className={[
          'rounded-md border bg-surface p-2 transition',
          'focus-within:border-ring focus-within:ring-2 focus-within:ring-ring/20',
          error ? 'border-danger' : 'border-input',
          disabled ? 'cursor-not-allowed opacity-50' : '',
        ].join(' ')}
      >
        {value.length > 0 && (
          <div className="mb-2 flex flex-wrap gap-2">
            {value.map((tag) => (
              <span
                key={tag}
                className="inline-flex items-center gap-1 rounded-full border border-border bg-muted px-2.5 py-1 text-xs font-medium text-foreground"
              >
                <span>{tag}</span>

                <button
                  type="button"
                  onClick={() => removeTag(tag)}
                  disabled={disabled}
                  aria-label={`${t('tags.remove')} ${tag}`}
                  className="rounded-full p-0.5 text-muted-foreground transition hover:bg-surface hover:text-foreground disabled:pointer-events-none"
                >
                  <X className="size-3.5" />
                </button>
              </span>
            ))}
          </div>
        )}

        <input
          type="text"
          value={inputValue}
          onChange={(event) => setInputValue(event.target.value)}
          onKeyDown={handleKeyDown}
          placeholder={resolvedPlaceholder}
          disabled={disabled}
          className="block w-full border-0 bg-transparent px-2 py-1 text-sm text-foreground outline-none placeholder:text-muted-foreground"
        />
      </div>

      {error && (
        <p className="mt-1.5 text-xs text-danger">
          {error}
        </p>
      )}

      {!error && hint && (
        <p className="mt-1.5 text-xs text-muted-foreground">
          {hint}
        </p>
      )}
    </div>
  )
}
