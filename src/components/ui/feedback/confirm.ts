import Swal from 'sweetalert2'

interface ConfirmOptions {
  title: string
  text?: string
  confirmText?: string
  cancelText?: string
  danger?: boolean
}

export async function confirm({
  title,
  text,
  confirmText = 'تأیید',
  cancelText = 'لغو',
  danger = false,
}: ConfirmOptions): Promise<boolean> {
  const result = await Swal.fire({
    title,
    text,
    icon: danger ? 'warning' : 'question',
    showCancelButton: true,
    confirmButtonText: confirmText,
    cancelButtonText: cancelText,
    reverseButtons: true,
    focusCancel: true,
  })

  return result.isConfirmed
}
