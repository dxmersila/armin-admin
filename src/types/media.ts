export interface AdminMediaFile {
  id: number
  name: string
  path: string
  url: string
  mime_type: string
  size: number
}

export interface AdminMedia {
  id: number
  is_primary: boolean
  sort_order: number
  file: AdminMediaFile
}
