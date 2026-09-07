import { apiClient } from '../api/client'
import { mediaEndpoints } from '../api/endpoints/media'
import type { AdminMedia } from '../types/media'

interface UploadMediaOptions {
  file: File
  isPrimary?: boolean
  sortOrder?: number
}

export async function uploadAdminMedia(
  itemId: number,
  options: UploadMediaOptions,
): Promise<AdminMedia> {
  const formData = new FormData()

  formData.append('file', options.file)
  formData.append(
    'is_primary',
    options.isPrimary ? '1' : '0',
  )
  formData.append(
    'sort_order',
    String(options.sortOrder ?? 0),
  )

  const response = await apiClient.post<{ data: AdminMedia }>(
    mediaEndpoints.upload(itemId),
    formData,
  )

  return response.data.data
}

export async function deleteAdminMedia(
  itemId: number,
  mediaId: number,
): Promise<void> {
  await apiClient.delete(
    mediaEndpoints.delete(itemId, mediaId),
  )
}

export async function setAdminMediaPrimary(
  itemId: number,
  mediaId: number,
): Promise<AdminMedia> {
  const response = await apiClient.patch<{ data: AdminMedia }>(
    mediaEndpoints.setPrimary(itemId, mediaId),
  )

  return response.data.data
}
