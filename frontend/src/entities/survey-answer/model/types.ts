import type { QuestionType } from '@/entities/question'

export interface SurveyAnswer {
  id: string
  questionId: string
  questionText: string
  questionType: QuestionType
  answerText?: string
  selectedOption?: string
}

export interface SurveyReview {
  eventId: string
  eventName: string
  answers: SurveyAnswer[]
}
