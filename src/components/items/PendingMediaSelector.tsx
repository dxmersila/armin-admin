import { useEffect, useRef, useState } from 'react'
import { useTranslation } from 'react-i18next'
import {
  ImagePlus,
  Star,
  Trash2,
  Upload,
} from 'lucide-react'
import Button from '../ui/Button'
import Card from '../ui/Card'
import Badge from '../ui/Badge'

export interface PendingMedia {
  id: string
  file: File
  previewUrl: string
  isPrimary: boolean
}

interface PendingMediaSelectorProps {
  value: PendingMedia[]
  onChange: (media: PendingMedia[]) => void
  disabled?: boolean
}

const MAX_FILE_SIZE = 5 * 1024 * 1024

export default function PendingMediaSelector({
  value,
  onChange,
  disabled = false,
}: PendingMediaSelectorProps) {
  const { t } = useTranslation()
  const inputRef = useRef<HTMLInputElement | null>(null)
  const objectUrlsRef = useRef<Set<string>>(new Set())
  const [error, setError] = useState<string | null>(null)

  useEffect(() => {
    const objectUrls = objectUrlsRef.current

    return () => {
      objectUrls.forEach((url) => {
        URL.revokeObjectURL(url)
      })

      objectUrls.clear()
    }
  }, [])

  function handleFiles(
    event: React.ChangeEvent<HTMLInputElement>,
  ) {
    const files = Array.from(event.target.files ?? [])

    if (inputRef.current) {
      inputRef.current.value = ''
    }

    if (files.length === 0) {
      return
    }

    setError(null)

    const invalidFile = files.find(
      (file) =>
        !file.type.startsWith('image/') ||
        file.size > MAX_FILE_SIZE,
    )

    if (invalidFile) {
      setError(
        !invalidFile.type.startsWith('image/')
          ? t('items.media.invalidType')
          : t('items.media.fileTooLarge'),
      )

      return
    }

    const newMedia: PendingMedia[] = files.map((file) => {
      const previewUrl = URL.createObjectURL(file)

      objectUrlsRef.current.add(previewUrl)

      return {
        id: crypto.randomUUID(),
        file,
        previewUrl,
        isPrimary: false,
      }
    })

    const nextMedia = [...value, ...newMedia]

    if (nextMedia.length > 0 && !nextMedia.some((media) => media.isPrimary)) {
      nextMedia[0] = {
        ...nextMedia[0],
        isPrimary: true,
      }
    }

    onChange(nextMedia)
  }

  function removeMedia(id: string) {
    const media = value.find((item) => item.id === id)

    if (!media) {
      return
    }

    URL.revokeObjectURL(media.previewUrl)
    objectUrlsRef.current.delete(media.previewUrl)

    const remaining = value.filter(
      (item) => item.id !== id,
    )

    if (
      media.isPrimary &&
      remaining.length > 0
    ) {
      remaining[0] = {
        ...remaining[0],
        isPrimary: true,
      }
    }

    onChange(remaining)
  }

  function setPrimary(id: string) {
    onChange(
      value.map((media) => ({
        ...media,
        isPrimary: media.id === id,
      })),
    )
  }

  return (
    <Card className="space-y-5 p-4 sm:p-6">
      <div>
        <h2 className="font-semibold text-foreground">
          {t('items.media.title')}
        </h2>

        <p className="mt-1 text-sm text-muted-foreground">
          {t('items.media.selectionDescription')}
        </p>
      </div>

      {value.length === 0 ? (
        <div className="rounded-lg border border-dashed border-border p-8 text-center">
          <ImagePlus className="mx-auto size-8 text-muted-foreground" />

          <p className="mt-3 text-sm font-medium text-foreground">
            {t('items.media.selectionEmptyTitle')}
          </p>

          <p className="mt-1 text-xs text-muted-foreground">
            {t('items.media.selectionEmptyDescription')}
          </p>
        </div>
      ) : (
        <div className="grid grid-cols-1 gap-4 sm:grid-cols-2 lg:grid-cols-3">
          {value.map((media) => (
            <div
              key={media.id}
              className="overflow-hidden rounded-lg border border-border bg-surface"
            >
              <div className="relative aspect-video overflow-hidden bg-muted">
                <img
                  src={media.previewUrl}
                  alt={media.file.name}
                  className="h-full w-full object-cover"
                />

                {media.isPrimary && (
                  <div className="absolute start-3 top-3">
                    <Badge variant="success" size="sm">
                      <Star className="me-1 size-3" />
                      {t('items.media.primary')}
                    </Badge>
                  </div>
                )}
              </div>

              <div className="space-y-3 p-3">
                <p className="truncate text-sm font-medium text-foreground">
                  {media.file.name}
                </p>

                <div className="grid gap-2 sm:grid-cols-2">
                  <Button
                    type="button"
                    variant={
                      media.isPrimary
                        ? 'secondary'
                        : 'ghost'
                    }
                    size="sm"
                    onClick={() => setPrimary(media.id)}
                    disabled={
                      disabled || media.isPrimary
                    }
                  >
                    <Star className="size-4" />
                    {media.isPrimary
                      ? t('items.media.primaryImage')
                      : t('items.media.makePrimary')}
                  </Button>

                  <Button
                    type="button"
                    variant="danger"
                    size="sm"
                    onClick={() => removeMedia(media.id)}
                    disabled={disabled}
                    aria-label={`${t('items.media.delete')} ${media.file.name}`}
                  >
                    <Trash2 className="size-4" />
                    {t('items.media.delete')}
                  </Button>
                </div>
              </div>
            </div>
          ))}
        </div>
      )}

      {error && (
        <p className="text-sm text-danger">
          {error}
        </p>
      )}

      <div className="border-t border-border pt-5">
        <input
          ref={inputRef}
          type="file"
          accept="image/*"
          multiple
          onChange={handleFiles}
          disabled={disabled}
          className="sr-only"
        />

        <Button
          type="button"
          variant="secondary"
          onClick={() => inputRef.current?.click()}
          disabled={disabled}
        >
          <Upload className="size-4" />
          {t('items.media.selectImages')}
        </Button>
      </div>
    </Card>
  )
}
