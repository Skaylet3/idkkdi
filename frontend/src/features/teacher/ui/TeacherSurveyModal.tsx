import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
} from '@/shared/ui'
import type { SurveyAnswer } from '@/entities/survey-answer'

interface TeacherSurveyModalProps {
  open: boolean
  onOpenChange: (open: boolean) => void
  eventName: string
  answers: SurveyAnswer[]
  onQuestionClick: (answer: SurveyAnswer) => void
  onAnswerClick: (answer: SurveyAnswer) => void
  isLoading?: boolean
}

export function TeacherSurveyModal({
  open,
  onOpenChange,
  eventName,
  answers,
  onQuestionClick,
  onAnswerClick,
  isLoading = false,
}: TeacherSurveyModalProps) {
  const getDisplayAnswer = (answer: SurveyAnswer) => {
    return answer.answerText || answer.selectedOption || 'No answer'
  }

  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogContent className="w-[calc(100%-2rem)] sm:max-w-md rounded-2xl">
        <DialogHeader>
          <DialogTitle className="text-xl font-semibold text-gray-800">
            {eventName}
          </DialogTitle>
        </DialogHeader>

        <div className="space-y-4 max-h-[400px] overflow-y-auto">
          {isLoading ? (
            <div className="py-8 text-center text-gray-500">Loading...</div>
          ) : answers.length === 0 ? (
            <div className="py-8 text-center text-gray-500">No answers found</div>
          ) : (
            answers.map((answer) => (
              <div key={answer.id} className="space-y-1">
                <button
                  type="button"
                  onClick={() => onQuestionClick(answer)}
                  className="text-left w-full"
                >
                  <p className="font-semibold text-gray-800 text-sm hover:text-blue-600 transition-colors">
                    Q: {answer.questionText}
                  </p>
                </button>
                <button
                  type="button"
                  onClick={() => onAnswerClick(answer)}
                  className="text-left w-full"
                >
                  <p className="text-gray-600 text-sm hover:text-blue-600 transition-colors">
                    A: {getDisplayAnswer(answer)}
                  </p>
                </button>
              </div>
            ))
          )}
        </div>
      </DialogContent>
    </Dialog>
  )
}
