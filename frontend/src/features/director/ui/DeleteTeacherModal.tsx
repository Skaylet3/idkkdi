import {
  Dialog,
  DialogContent,
  Button,
} from '@/shared/ui'
import { Trash2 } from 'lucide-react'
import type { DeleteTeacherData } from '../model/types'

interface DeleteTeacherModalProps {
  open: boolean
  onOpenChange: (open: boolean) => void
  onConfirm: (data: DeleteTeacherData) => void | Promise<void>
  teacher: { id: string; name: string } | null
  isLoading?: boolean
}

export function DeleteTeacherModal({
  open,
  onOpenChange,
  onConfirm,
  teacher,
  isLoading = false,
}: DeleteTeacherModalProps) {
  const handleConfirm = async () => {
    if (!teacher) return

    await onConfirm({
      id: teacher.id,
      name: teacher.name,
    })
  }

  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogContent className="w-[calc(100%-2rem)] sm:max-w-sm rounded-2xl">
        <div className="flex flex-col items-center text-center space-y-4 py-2">
          <div className="w-14 h-14 rounded-full bg-red-100 flex items-center justify-center">
            <Trash2 className="w-7 h-7 text-red-500" />
          </div>

          <h2 className="text-xl font-semibold text-gray-800">
            Delete Teacher?
          </h2>

          <p className="text-gray-500">
            This action cannot be undone. The teacher will be permanently removed from the system.
          </p>

          <div className="flex items-center gap-3 w-full pt-2">
            <Button
              type="button"
              variant="outline"
              className="flex-1 h-11 rounded-xl font-medium border-gray-200 bg-gray-100 hover:bg-gray-200"
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
