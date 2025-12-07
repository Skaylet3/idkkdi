import {
  Dialog,
  DialogContent,
  Button,
  Avatar,
  AvatarImage,
  AvatarFallback,
} from '@/shared/ui'
import { Pencil, Trash2, ArrowLeft } from 'lucide-react'
import type { Teacher } from '@/entities/teacher'

interface TeacherDetailsModalProps {
  open: boolean
  onOpenChange: (open: boolean) => void
  onBack: () => void
  teacher: Teacher | null
  onUpdate: () => void
  onDelete: () => void
}

export function TeacherDetailsModal({
  open,
  onOpenChange,
  onBack,
  teacher,
  onUpdate,
  onDelete,
}: TeacherDetailsModalProps) {
  if (!teacher) return null

  const initials = teacher.name
    .split(' ')
    .map((n) => n[0])
    .join('')
    .toUpperCase()
    .slice(0, 2)

  const handleBack = () => {
    onOpenChange(false)
    onBack()
  }

  const handleOpenChange = (newOpen: boolean) => {
    if (!newOpen) {
      handleBack()
    } else {
      onOpenChange(newOpen)
    }
  }

  return (
    <Dialog open={open} onOpenChange={handleOpenChange}>
      <DialogContent className="w-[calc(100%-2rem)] sm:max-w-md rounded-2xl">
        <div className="flex items-center gap-3">
          <button
            type="button"
            onClick={handleBack}
            className="p-1 rounded-full hover:bg-gray-100 transition-colors"
          >
            <ArrowLeft className="w-5 h-5 text-gray-600" />
          </button>
          <h2 className="text-xl font-semibold text-gray-800">
            Teacher Details
          </h2>
        </div>

        <div className="flex items-center gap-4">
          <Avatar className="h-16 w-16">
            <AvatarImage src={teacher.avatarUrl} alt={teacher.name} />
            <AvatarFallback className="bg-gray-200 text-gray-600 text-lg font-medium">
              {initials}
            </AvatarFallback>
          </Avatar>

          <div>
            <p className="font-semibold text-gray-800 text-lg">{teacher.name}</p>
            <p className="text-gray-500 text-sm">{teacher.email}</p>
          </div>
        </div>

        <div className="space-y-2">
          <p className="text-gray-700 font-medium text-sm">Schools</p>
          <div className="p-3 bg-gray-50 rounded-lg">
            <p className="text-gray-800">{teacher.schoolName || 'No school assigned'}</p>
          </div>
        </div>

        <div className="flex items-center gap-3 pt-2">
          <Button
            type="button"
            className="flex-1 h-11 bg-green-500 hover:bg-green-600 text-white rounded-xl font-medium gap-2"
            onClick={onUpdate}
          >
            <Pencil className="w-4 h-4" />
            Update
          </Button>
          <Button
            type="button"
            className="flex-1 h-11 bg-red-500 hover:bg-red-600 text-white rounded-xl font-medium gap-2"
            onClick={onDelete}
          >
            <Trash2 className="w-4 h-4" />
            Delete
          </Button>
        </div>
      </DialogContent>
    </Dialog>
  )
}
