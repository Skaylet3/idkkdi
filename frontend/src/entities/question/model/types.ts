import { MultipleChoiceOption, MULTIPLE_CHOICE_LABELS } from '@/entities/answer'

export const QuestionType = {
  FREE_TEXT: 'FREE_TEXT',
  MULTIPLE_CHOICE: 'MULTIPLE_CHOICE',
} as const

export type QuestionType = (typeof QuestionType)[keyof typeof QuestionType]

export interface Question {
  id: string
  text: string
  type: QuestionType
  order: number
  eventId: string
  createdAt?: string
  updatedAt?: string
}

export interface QuestionWithOptions extends Question {
  options?: string[]
}

export interface CreateQuestionPayload {
  text: string
  type: QuestionType
  order: number
}

export interface UpdateQuestionPayload {
  text?: string
  type?: QuestionType
  order?: number
}

// Map backend enum values to display labels
export const DEFAULT_MULTIPLE_CHOICE_OPTIONS = Object.values(MultipleChoiceOption)
export const MULTIPLE_CHOICE_OPTION_LABELS = MULTIPLE_CHOICE_LABELS
