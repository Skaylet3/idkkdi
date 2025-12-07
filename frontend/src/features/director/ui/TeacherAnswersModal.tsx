import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
} from '@/shared/ui'
import type { TeacherAnswer } from '@/entities/teacher-answer'

interface TeacherAnswersModalProps {
  open: boolean
  onOpenChange: (open: boolean) => void
  teacherName?: string
  answers: TeacherAnswer[]
  isLoading?: boolean
}

export function TeacherAnswersModal({
  open,
  onOpenChange,
  teacherName,
  answers,
  isLoading = false,
}: TeacherAnswersModalProps) {
  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogContent className="w-[calc(100%-2rem)] sm:max-w-md rounded-2xl">
        <DialogHeader>
          <DialogTitle className="text-xl font-semibold text-gray-800">
            Teacher Answers
          </DialogTitle>
        </DialogHeader>

        {teacherName && (
          <p className="text-gray-600 text-sm">{teacherName}</p>
        )}

        <div className="space-y-4 max-h-[400px] overflow-y-auto">
          {isLoading ? (
            <div className="py-8 text-center text-gray-500">Loading...</div>
          ) : answers.length === 0 ? (
            <div className="py-8 text-center text-gray-500">No answers found</div>
          ) : (
            answers.map((answer) => (
              <div key={answer.id} className="space-y-2">
                <p className="font-semibold text-gray-800 text-sm">
                  {answer.questionText}
                </p>
                <p className="text-gray-600 text-sm leading-relaxed">
                  {answer.answerText}
                </p>
              </div>
            ))
          )}
        </div>
      </DialogContent>
    </Dialog>
  )
}
