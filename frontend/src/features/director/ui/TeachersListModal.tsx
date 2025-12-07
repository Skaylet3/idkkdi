import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
} from '@/shared/ui'
import { TeacherListItem, type Teacher } from '@/entities/teacher'

interface TeachersListModalProps {
  open: boolean
  onOpenChange: (open: boolean) => void
  schoolName: string
  teachers: Teacher[]
  onTeacherClick: (teacher: Teacher) => void
  isLoading?: boolean
}

export function TeachersListModal({
  open,
  onOpenChange,
  schoolName,
  teachers,
  onTeacherClick,
  isLoading = false,
}: TeachersListModalProps) {
  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogContent className="w-[calc(100%-2rem)] sm:max-w-md rounded-2xl">
        <DialogHeader>
          <DialogTitle className="text-xl font-semibold text-gray-800">
            Teachers List
          </DialogTitle>
        </DialogHeader>

        <p className="text-gray-600 text-sm">{schoolName}</p>

        <div className="space-y-2 max-h-[400px] overflow-y-auto">
          {isLoading ? (
            <div className="py-8 text-center text-gray-500">Loading...</div>
          ) : teachers.length === 0 ? (
            <div className="py-8 text-center text-gray-500">No teachers found</div>
          ) : (
            teachers.map((teacher) => (
              <TeacherListItem
                key={teacher.id}
                teacher={teacher}
                onClick={() => onTeacherClick(teacher)}
              />
            ))
          )}
        </div>
      </DialogContent>
    </Dialog>
  )
}
