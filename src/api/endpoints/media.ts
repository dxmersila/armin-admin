export const mediaEndpoints = {
  upload: (itemId: number) => `/admin/items/${itemId}/media`,
  delete: (itemId: number, mediaId: number) =>
    `/admin/items/${itemId}/media/${mediaId}`,
  setPrimary: (itemId: number, mediaId: number) =>
    `/admin/items/${itemId}/media/${mediaId}/primary`,
} as const
