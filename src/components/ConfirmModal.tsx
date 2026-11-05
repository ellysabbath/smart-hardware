import type { ReactNode } from 'react'
import Modal from './ui/Modal'
import Button from './ui/Button'

interface Props {
  open: boolean
  title: string
  message: ReactNode
  onConfirm: () => void
  onCancel: () => void
  confirmText?: string
  variant?: 'danger' | 'primary' | 'success'
}

export default function ConfirmModal({
  open, title, message, onConfirm, onCancel, confirmText = 'Thibitisha', variant = 'danger',
}: Props) {
  return (
    <Modal open={open} onClose={onCancel} title={title} size="sm">
      <div className="text-slate-700 mb-6 text-sm sm:text-base">{message}</div>
      <div className="flex flex-col-reverse sm:flex-row gap-2 sm:gap-3 sm:justify-end">
        <Button variant="outline" onClick={onCancel} className="w-full sm:w-auto">
          Ghairi
        </Button>
        <Button variant={variant} onClick={onConfirm} className="w-full sm:w-auto">
          {confirmText}
        </Button>
      </div>
    </Modal>
  )
}