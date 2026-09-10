import Button from './Button'

interface FormActionsProps {
  cancelLabel: string
  submitLabel: string
  onCancel: () => void
  isSubmitting?: boolean
}

export default function FormActions({
  cancelLabel,
  submitLabel,
  onCancel,
  isSubmitting = false,
}: FormActionsProps) {
  return (
    <div className="flex flex-col-reverse gap-3 sm:flex-row sm:justify-end">
      <Button
        type="button"
        variant="secondary"
        onClick={onCancel}
        disabled={isSubmitting}
      >
        {cancelLabel}
      </Button>

      <Button
        type="submit"
        loading={isSubmitting}
      >
        {submitLabel}
      </Button>
    </div>
  )
}
