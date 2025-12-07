import {
  Dialog,
  DialogContent,
  Button,
} from '@/shared/ui'
import { AlertTriangle } from 'lucide-react'
import type { DeleteSchoolData } from '../model/types'

interface DeleteSchoolModalProps {
  open: boolean
  onOpenChange: (open: boolean) => void
  onConfirm: (data: DeleteSchoolData) => void | Promise<void>
  school: { id: string; name: string } | null
  isLoading?: boolean
}

export function DeleteSchoolModal({
  open,
  onOpenChange,
  onConfirm,
  school,
  isLoading = false,
}: DeleteSchoolModalProps) {
  const handleConfirm = async () => {
    if (!school) return

    await onConfirm({
      id: school.id,
      name: school.name,
    })
  }

  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogContent className="w-[calc(100%-2rem)] sm:max-w-sm rounded-2xl">
        <div className="flex flex-col items-center text-center space-y-4 py-2">
          <div className="w-12 h-12 rounded-full bg-red-100 flex items-center justify-center">
            <AlertTriangle className="w-6 h-6 text-red-500" />
          </div>

          <h2 className="text-xl font-semibold text-gray-800">
            Confirm Delete
          </h2>

          <p className="text-gray-600">
            Are you sure you want to delete "{school?.name}"?
          </p>

          <div className="flex items-center gap-3 w-full pt-2">
            <Button
              type="button"
              variant="outline"
              className="flex-1 h-11 rounded-xl font-medium border-gray-200"
              onClick={() => onOpenChange(false)}
              disabled={isLoading}
            >
              Cancel
            </Button>
            <Button
              type="button"
              className="flex-1 h-11 bg-red-500 hover:bg-red-600 text-white rounded-xl font-medium"
              onClick={handleConfirm}
              disabled={isLoading}
            >
              {isLoading ? 'Deleting...' : 'Confirm'}
            </Button>
          </div>
        </div>
      </DialogContent>
    </Dialog>
  )
}
