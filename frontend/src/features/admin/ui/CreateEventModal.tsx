import { useState } from 'react'
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
  Button,
  Input,
  Label,
  Textarea,
  Checkbox,
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from '@/shared/ui'
import { X } from 'lucide-react'
import type { CreateEventData, CreateEventQuestionData } from '../model/types'

interface CreateEventModalProps {
  open: boolean
  onOpenChange: (open: boolean) => void
  onSubmit: (data: CreateEventData) => void | Promise<void>
  isLoading?: boolean
}

type QuestionType = 'FREE_TEXT' | 'MULTIPLE_CHOICE'

export function CreateEventModal({
  open,
  onOpenChange,
  onSubmit,
  isLoading = false,
}: CreateEventModalProps) {
  const [step, setStep] = useState<'event-info' | 'questions'>('event-info')

  // Event info fields
  const [name, setName] = useState('')
  const [description, setDescription] = useState('')
  const [isActive, setIsActive] = useState(false)

  // Questions fields
  const [questions, setQuestions] = useState<CreateEventQuestionData[]>([])
  const [questionText, setQuestionText] = useState('')
  const [questionType, setQuestionType] = useState<QuestionType>('FREE_TEXT')

  const handleNext = () => {
    if (name.trim()) {
      setStep('questions')
    }
  }

  const handleBack = () => {
    setStep('event-info')
  }

  const handleAddQuestion = () => {
    if (questionText.trim()) {
      setQuestions([
        ...questions,
        {
          text: questionText.trim(),
          type: questionType,
        },
      ])
      setQuestionText('')
      setQuestionType('FREE_TEXT')
    }
  }

  const handleRemoveQuestion = (index: number) => {
    setQuestions(questions.filter((_, i) => i !== index))
  }

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault()

    if (questions.length === 0) return

    await onSubmit({
      name,
      description: description || undefined,
      isActive,
      questions,
    })

    // Reset form on success
    resetForm()
  }

  const resetForm = () => {
    setStep('event-info')
    setName('')
    setDescription('')
    setIsActive(false)
    setQuestions([])
    setQuestionText('')
    setQuestionType('FREE_TEXT')
  }

  const handleOpenChange = (newOpen: boolean) => {
    if (!newOpen) {
      resetForm()
    }
    onOpenChange(newOpen)
  }

  return (
    <Dialog open={open} onOpenChange={handleOpenChange}>
      <DialogContent className="w-[calc(100%-2rem)] sm:max-w-md rounded-2xl">
        <DialogHeader>
          <DialogTitle className="text-xl font-semibold text-gray-800">
            {step === 'event-info' ? 'Create Event' : 'Add Questions'}
          </DialogTitle>
        </DialogHeader>

        {step === 'event-info' && (
          <div className="space-y-4">
            <div className="space-y-2">
              <Label htmlFor="event-name" className="text-gray-700">
                Event Name
              </Label>
              <Input
                id="event-name"
                value={name}
                onChange={(e) => setName(e.target.value)}
                placeholder=""
                className="h-11 rounded-lg border-gray-200"
                disabled={isLoading}
              />
            </div>

            <div className="space-y-2">
              <Label htmlFor="event-description" className="text-gray-700">
                Description (Optional)
              </Label>
              <Textarea
                id="event-description"
                value={description}
                onChange={(e) => setDescription(e.target.value)}
                placeholder=""
                className="min-h-[100px] rounded-lg border-gray-200 resize-y"
                disabled={isLoading}
              />
            </div>

            <div className="flex items-center justify-between py-2">
              <Label htmlFor="event-active" className="text-gray-700 cursor-pointer">
                Active
              </Label>
              <Checkbox
                id="event-active"
                checked={isActive}
                onCheckedChange={(checked) => setIsActive(checked === true)}
                disabled={isLoading}
                className="h-5 w-5"
              />
            </div>

            <Button
              type="button"
              className="w-full h-11 bg-green-500 hover:bg-green-600 text-white rounded-xl font-medium"
              disabled={!name.trim() || isLoading}
              onClick={handleNext}
            >
              Next
            </Button>
          </div>
        )}

        {step === 'questions' && (
          <form onSubmit={handleSubmit} className="space-y-4">
            <div className="p-3 bg-gray-50 rounded-lg">
              <p className="text-sm text-gray-500">Event</p>
              <p className="font-medium text-gray-800">{name}</p>
            </div>

            {/* Add question form */}
            <div className="space-y-3">
              <div className="space-y-2">
                <Label htmlFor="question-text" className="text-gray-700">
                  Question Text
                </Label>
                <Input
                  id="question-text"
                  value={questionText}
                  onChange={(e) => setQuestionText(e.target.value)}
                  placeholder="Enter question..."
                  className="h-11 rounded-lg border-gray-200"
                  disabled={isLoading}
                />
              </div>

              <div className="space-y-2">
                <Label htmlFor="question-type" className="text-gray-700">
                  Question Type
                </Label>
                <Select
                  value={questionType}
                  onValueChange={(value: QuestionType) => setQuestionType(value)}
                  disabled={isLoading}
                >
                  <SelectTrigger className="h-11 rounded-lg bg-white border-0">
                    <SelectValue placeholder="Select type" />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="FREE_TEXT">Free Text</SelectItem>
                    <SelectItem value="MULTIPLE_CHOICE">Multiple Choice</SelectItem>
                  </SelectContent>
                </Select>
              </div>

              <Button
                type="button"
                variant="outline"
                className="w-full h-10 rounded-lg border-gray-200"
                disabled={!questionText.trim() || isLoading}
                onClick={handleAddQuestion}
              >
                Add Question
              </Button>
            </div>

            {/* Questions list */}
            {questions.length > 0 && (
              <div className="space-y-2">
                <Label className="text-gray-700">
                  Questions ({questions.length})
                </Label>
                <div className="space-y-2 max-h-[200px] overflow-y-auto">
                  {questions.map((q, index) => (
                    <div
                      key={index}
                      className="flex items-start gap-2 p-3 bg-gray-50 rounded-lg"
                    >
                      <div className="flex-1 min-w-0">
                        <p className="text-sm font-medium text-gray-800 truncate">
                          {index + 1}. {q.text}
                        </p>
                        <p className="text-xs text-gray-500">
                          {q.type === 'FREE_TEXT' ? 'Free Text' : 'Multiple Choice'}
                        </p>
                      </div>
                      <button
                        type="button"
                        onClick={() => handleRemoveQuestion(index)}
                        className="p-1 text-gray-400 hover:text-red-500 transition-colors"
                        disabled={isLoading}
                      >
                        <X className="w-4 h-4" />
                      </button>
                    </div>
                  ))}
                </div>
              </div>
            )}

            <div className="flex gap-3">
              <Button
                type="button"
                variant="outline"
                className="flex-1 h-11 rounded-xl font-medium border-gray-200"
                onClick={handleBack}
                disabled={isLoading}
              >
                Back
              </Button>
              <Button
                type="submit"
                className="flex-1 h-11 bg-green-500 hover:bg-green-600 text-white rounded-xl font-medium"
                disabled={questions.length === 0 || isLoading}
              >
                {isLoading ? 'Creating...' : 'Create Event'}
              </Button>
            </div>
          </form>
        )}
      </DialogContent>
    </Dialog>
  )
}
