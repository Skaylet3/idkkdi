import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
  Button,
} from '@/shared/ui'
import { Play } from 'lucide-react'
import type { Question } from '@/entities/question'

interface EventDetailsModalProps {
  open: boolean
  onOpenChange: (open: boolean) => void
  eventName: string
  questions: Question[]
  onStartQuestionnaire: () => void
  isLoading?: boolean
}

export function EventDetailsModal({
  open,
  onOpenChange,
  eventName,
  questions,
  onStartQuestionnaire,
  isLoading = false,
}: EventDetailsModalProps) {
  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogContent className="w-[calc(100%-2rem)] sm:max-w-md rounded-2xl">
        <DialogHeader>
          <DialogTitle className="text-xl font-semibold text-blue-600">
            {eventName}
          </DialogTitle>
        </DialogHeader>

        <div className="space-y-4 max-h-[300px] overflow-y-auto">
          {isLoading ? (
            <div className="py-8 text-center text-gray-500">Loading...</div>
          ) : questions.length === 0 ? (
            <div className="py-8 text-center text-gray-500">No questions available</div>
          ) : (
            questions.map((question, index) => (
              <div key={question.id} className="space-y-1">
                <p className="font-semibold text-gray-800 text-sm">
                  Question {index + 1}:
                </p>
                <p className="text-gray-600 text-sm">
                  {question.text}
                </p>
              </div>
            ))
          )}
        </div>

        <Button
          type="button"
          className="w-full h-11 bg-green-500 hover:bg-green-600 text-white rounded-xl font-medium gap-2"
          onClick={onStartQuestionnaire}
          disabled={isLoading || questions.length === 0}
        >
          <Play className="w-4 h-4" />
          Start Questionnaire
        </Button>
      </DialogContent>
    </Dialog>
  )
}
