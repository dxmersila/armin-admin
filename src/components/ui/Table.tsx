import type { ReactNode } from 'react'
import Spinner from './feedback/Spinner'

export interface TableColumn<T> {
  key: string
  header: ReactNode
  render: (row: T) => ReactNode
  className?: string
}

interface TableProps<T> {
  columns: TableColumn<T>[]
  data: T[]
  getRowKey: (row: T, index: number) => string | number
  loading?: boolean
  emptyMessage?: string
  className?: string
}

export default function Table<T>({
  columns,
  data,
  getRowKey,
  loading = false,
  emptyMessage = 'داده‌ای برای نمایش وجود ندارد.',
  className = '',
}: TableProps<T>) {
  return (
    <div
      className={[
        'overflow-x-auto rounded-lg border border-border',
        className,
      ].join(' ')}
    >
      <table className="w-full min-w-max table-auto text-sm">
        <thead className="bg-muted">
          <tr className="border-b border-border">
            {columns.map((column) => (
              <th
                key={column.key}
                scope="col"
                className={[
                  'whitespace-nowrap px-4 py-3 text-start font-medium text-muted-foreground',
                  column.className ?? '',
                ].join(' ')}
              >
                {column.header}
              </th>
            ))}
          </tr>
        </thead>

        <tbody className="divide-y divide-border">
          {loading ? (
            <tr>
              <td
                colSpan={columns.length}
                className="px-4 py-10 text-center"
              >
                <div className="flex justify-center">
                  <Spinner size="md" />
                </div>
              </td>
            </tr>
          ) : data.length === 0 ? (
            <tr>
              <td
                colSpan={columns.length}
                className="px-4 py-10 text-center text-muted-foreground"
              >
                {emptyMessage}
              </td>
            </tr>
          ) : (
            data.map((row, index) => (
              <tr
                key={getRowKey(row, index)}
                className="bg-surface transition hover:bg-muted/50"
              >
                {columns.map((column) => (
                  <td
                    key={column.key}
                    className={[
                      'px-4 py-3 text-foreground',
                      column.className ?? '',
                    ].join(' ')}
                  >
                    {column.render(row)}
                  </td>
                ))}
              </tr>
            ))
          )}
        </tbody>
      </table>
    </div>
  )
}
