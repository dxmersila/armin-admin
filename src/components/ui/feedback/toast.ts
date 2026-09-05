import Swal from 'sweetalert2'

type ToastType = 'success' | 'error' | 'warning' | 'info'

const Toast = Swal.mixin({
  toast: true,
  position: 'top',
  showConfirmButton: false,
  timer: 3000,
  timerProgressBar: true,
})

function show(type: ToastType, message: string) {
  return Toast.fire({
    icon: type,
    title: message,
  })
}

export const toast = {
  success(message: string) {
    return show('success', message)
  },

  error(message: string) {
    return show('error', message)
  },

  warning(message: string) {
    return show('warning', message)
  },

  info(message: string) {
    return show('info', message)
  },
}
