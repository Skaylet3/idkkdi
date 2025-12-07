import { useState } from 'react'
import {
  Dialog,
  DialogContent,
  Button,
} from '@/shared/ui'
import { cn } from '@/shared/lib/utils'
import type { Question } from '@/entities/question'
import { DEFAULT_MULTIPLE_CHOICE_OPTIONS } from '@/entities/question'
import type { AnswerPayload, SubmitAnswersData } from '../model/types'

interface QuestionsFormModalProps {
  open: boolean
  onOpenChange: (open: boolean) => void
  eventId: string
  questions: Question[]
  onSubmit: (data: SubmitAnswersData) => void | Promise<void>
  onComplete: () => void
  isLoading?: boolean
}

export function QuestionsFormModal({
  open,
  onOpenChange,
  eventId,
  questions,
  onSubmit,
  onComplete,
  isLoading = false,
}: QuestionsFormModalProps) {
  const [currentIndex, setCurrentIndex] = useState(0)
  const [answers, setAnswers] = useState<Record<string, AnswerPayload>>({})

  const currentQuestion = questions[currentIndex]
  const totalQuestions = questions.length
  const progress = ((currentIndex + 1) / totalQuestions) * 100

  const currentAnswer = currentQuestion ? answers[currentQuestion.id] : null

  const handleOptionSelect = (option: string) => {
    if (!currentQuestion) return

    setAnswers((prev) => ({
      ...prev,
      [currentQuestion.id]: {
        questionId: currentQuestion.id,
        selectedOption: option,
      },
    }))
  }

  const handleNext = async () => {
    if (currentIndex < totalQuestions - 1) {
      setCurrentIndex((prev) => prev + 1)
    } else {
      // Last question - submit all answers
      const answersArray = Object.values(answers)
      await onSubmit({
        eventId,
        answers: answersArray,
      })
      onComplete()
      resetForm()
    }
  }

  const resetForm = () => {
    setCurrentIndex(0)
    setAnswers({})
  }

  const handleOpenChange = (newOpen: boolean) => {
    if (!newOpen) {
      resetForm()
    }
    onOpenChange(newOpen)
  }

  const isLastQuestion = currentIndex === totalQuestions - 1
  const hasAnswer = currentAnswer?.selectedOption || currentAnswer?.answerText

  if (!currentQuestion) return null

  return (
    <Dialog open={open} onOpenChange={handleOpenChange}>
      <DialogContent className="w-[calc(100%-2rem)] sm:max-w-md rounded-2xl">
        {/* Progress indicator */}
        <div className="flex items-center gap-3">
          <span className="text-sm font-medium text-gray-600">
            {currentIndex + 1} of {totalQuestions}
          </span>
          <div className="flex-1 h-2 bg-gray-200 rounded-full overflow-hidden">
            <div
              className="h-full bg-green-500 transition-all duration-300"
              style={{ width: `${progress}%` }}
            />
          </div>
        </div>

        {/* Question */}
        <div className="py-4">
          <h3 className="text-lg font-semibold text-gray-800 leading-relaxed">
            {currentQuestion.text}
          </h3>
        </div>

        {/* Options */}
        <div className="space-y-3">
          {DEFAULT_MULTIPLE_CHOICE_OPTIONS.map((option) => (
            <button
              key={option}
              type="button"
              onClick={() => handleOptionSelect(option)}
              disabled={isLoading}
              className={cn(
                "w-full p-4 rounded-xl border-2 text-left font-medium transition-all",
                currentAnswer?.selectedOption === option
                  ? "border-green-500 bg-green-50 text-green-700"
                  : "border-gray-200 bg-white text-gray-700 hover:border-gray-300"
              )}
            >
              {option}
            </button>
          ))}
        </div>

        {/* Next button */}
        <Button
          type="button"
          className="w-full h-11 bg-green-500 hover:bg-green-600 text-white rounded-xl font-medium"
          onClick={handleNext}
          disabled={!hasAnswer || isLoading}
        >
          {isLoading ? 'Submitting...' : isLastQuestion ? 'Complete' : 'Next Question'}
        </Button>
      </DialogContent>
    </Dialog>
  )
}
