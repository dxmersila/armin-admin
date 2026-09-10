import { useRef, useState } from 'react'
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
import { confirm } from '../ui/feedback/confirm'
import { toast } from '../ui/feedback/toast'
import type { AdminMedia } from '../../types/media'
import {
  deleteAdminMedia,
  setAdminMediaPrimary,
  uploadAdminMedia,
} from '../../services/mediaService'

interface MediaManagerProps {
  itemId: number
  media: AdminMedia[]
  deferPrimaryChange?: boolean
  onMediaChange?: (media: AdminMedia[]) => void
  onPrimaryChange?: (mediaId: number | null) => void
}

export default function MediaManager({
  itemId,
  media: initialMedia,
  deferPrimaryChange = false,
  onMediaChange,
  onPrimaryChange,
}: MediaManagerProps) {
  const { t } = useTranslation()
  const fileInputRef = useRef<HTMLInputElement | null>(null)

  const [media, setMedia] = useState<AdminMedia[]>(initialMedia)
  const [isUploading, setIsUploading] = useState(false)
  const [deletingMediaId, setDeletingMediaId] = useState<number | null>(null)
  const [settingPrimaryMediaId, setSettingPrimaryMediaId] =
    useState<number | null>(null)
  const [error, setError] = useState<string | null>(null)

  function updateMedia(nextMedia: AdminMedia[]) {
    setMedia(nextMedia)
    onMediaChange?.(nextMedia)
  }

  function getPrimaryMediaId(items: AdminMedia[]) {
    return (
      items.find((item) => item.is_primary)?.id ?? null
    )
  }

  async function handleFileChange(
    event: React.ChangeEvent<HTMLInputElement>,
  ) {
    const file = event.target.files?.[0] ?? null

    if (fileInputRef.current) {
      fileInputRef.current.value = ''
    }

    if (!file) {
      return
    }

    setError(null)
    setIsUploading(true)

    try {
      const uploadedMedia = await uploadAdminMedia(itemId, {
        file,
        sortOrder: media.length,
      })

      let nextMedia = [...media, uploadedMedia]
      let nextPrimaryId = getPrimaryMediaId(nextMedia)

      if (nextPrimaryId === null) {
        nextMedia = nextMedia.map((item) => ({
          ...item,
          is_primary: item.id === uploadedMedia.id,
        }))

        nextPrimaryId = uploadedMedia.id
      }

      updateMedia(nextMedia)

      if (deferPrimaryChange) {
        onPrimaryChange?.(nextPrimaryId)
      }

      await toast.success(t('items.media.uploadSuccess'))
    } catch (uploadError) {
      console.error('Media upload failed:', uploadError)
      setError(t('items.media.uploadError'))
      await toast.error(t('items.media.uploadError'))
    } finally {
      setIsUploading(false)
    }
  }

  async function handleSetPrimary(mediaItem: AdminMedia) {
    if (mediaItem.is_primary) {
      return
    }

    setError(null)

    if (deferPrimaryChange) {
      const nextMedia = media.map((item) => ({
        ...item,
        is_primary: item.id === mediaItem.id,
      }))

      updateMedia(nextMedia)
      onPrimaryChange?.(mediaItem.id)

      return
    }

    setSettingPrimaryMediaId(mediaItem.id)

    try {
      const updatedMedia = await setAdminMediaPrimary(
        itemId,
        mediaItem.id,
      )

      const nextMedia = media.map((item) =>
        item.id === updatedMedia.id
          ? updatedMedia
          : {
              ...item,
              is_primary: false,
            },
      )

      updateMedia(nextMedia)

      await toast.success(t('items.media.primarySuccess'))
    } catch (primaryError) {
      console.error(
        'Setting primary media failed:',
        primaryError,
      )
      setError(t('items.media.primaryError'))
      await toast.error(t('items.media.primaryError'))
    } finally {
      setSettingPrimaryMediaId(null)
    }
  }

  async function handleDelete(mediaItem: AdminMedia) {
    const accepted = await confirm({
      title: t('items.media.deleteTitle', { name: mediaItem.file.name }),
      text: mediaItem.is_primary
        ? t('items.media.deletePrimaryWarning')
        : t('items.media.deleteWarning'),
      confirmText: t('items.media.delete'),
      cancelText: t('items.form.cancel'),
      danger: true,
    })

    if (!accepted) {
      return
    }

    setDeletingMediaId(mediaItem.id)
    setError(null)

    try {
      await deleteAdminMedia(itemId, mediaItem.id)

      let nextMedia = media.filter(
        (item) => item.id !== mediaItem.id,
      )

      let nextPrimaryId = getPrimaryMediaId(nextMedia)

      if (
        mediaItem.is_primary &&
        nextMedia.length > 0
      ) {
        nextPrimaryId = nextMedia[0].id

        nextMedia = nextMedia.map((item, index) => ({
          ...item,
          is_primary: index === 0,
        }))
      }

      updateMedia(nextMedia)

      if (mediaItem.is_primary) {
        onPrimaryChange?.(nextPrimaryId)
      }

      await toast.success(t('items.media.deleteSuccess'))
    } catch (deleteError) {
      console.error('Media delete failed:', deleteError)
      setError(t('items.media.deleteError'))
      await toast.error(t('items.media.deleteError'))
    } finally {
      setDeletingMediaId(null)
    }
  }

  const primaryChangeDisabled =
    isUploading ||
    deletingMediaId !== null ||
    settingPrimaryMediaId !== null

  return (
    <Card className="space-y-5 p-4 sm:p-6">
      <div>
        <h2 className="font-semibold text-foreground">
          {t('items.media.title')}
        </h2>

        <p className="mt-1 text-sm text-muted-foreground">
          {t('items.media.description')}
        </p>
      </div>

      {media.length === 0 ? (
        <div className="rounded-lg border border-dashed border-border p-8 text-center">
          <ImagePlus className="mx-auto size-8 text-muted-foreground" />

          <p className="mt-3 text-sm font-medium text-foreground">
            {t('items.media.emptyTitle')}
          </p>

          <p className="mt-1 text-xs text-muted-foreground">
            {t('items.media.emptyDescription')}
          </p>
        </div>
      ) : (
        <div className="grid grid-cols-1 gap-4 sm:grid-cols-2 lg:grid-cols-3">
          {media.map((mediaItem) => (
            <div
              key={mediaItem.id}
              className="overflow-hidden rounded-lg border border-border bg-surface"
            >
              <div className="relative aspect-video overflow-hidden bg-muted">
                <img
                  src={mediaItem.file.url}
                  alt={mediaItem.file.name}
                  className="h-full w-full object-cover"
                />

                {mediaItem.is_primary && (
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
                  {mediaItem.file.name}
                </p>

                <div className="grid gap-2 sm:grid-cols-2">
                  {!mediaItem.is_primary ? (
                    <Button
                      type="button"
                      variant="secondary"
                      size="sm"
                      onClick={() =>
                        void handleSetPrimary(mediaItem)
                      }
                      loading={
                        settingPrimaryMediaId === mediaItem.id
                      }
                      disabled={primaryChangeDisabled}
                    >
                      <Star className="size-4" />
                      {t('items.media.makePrimary')}
                    </Button>
                  ) : (
                    <div className="flex items-center justify-center rounded-md border border-border px-3 py-1.5 text-xs font-medium text-muted-foreground">
                      <Star className="me-1 size-3.5" />
                      {t('items.media.primaryImage')}
                    </div>
                  )}

                  <Button
                    type="button"
                    variant="danger"
                    size="sm"
                    onClick={() => void handleDelete(mediaItem)}
                    loading={deletingMediaId === mediaItem.id}
                    disabled={
                      deletingMediaId !== null ||
                      settingPrimaryMediaId !== null ||
                      isUploading
                    }
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
          ref={fileInputRef}
          type="file"
          accept="image/*"
          onChange={(event) => void handleFileChange(event)}
          disabled={isUploading}
          className="sr-only"
        />

        <Button
          type="button"
          variant="secondary"
          onClick={() => fileInputRef.current?.click()}
          disabled={isUploading}
          loading={isUploading}
        >
          <Upload className="size-4" />

          {isUploading
            ? t('items.media.uploading')
            : t('items.media.upload')}
        </Button>
      </div>
    </Card>
  )
}
