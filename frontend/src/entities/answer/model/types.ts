export const MultipleChoiceOption = {
  YES: 'YES',
  NO: 'NO',
  OPTION_30_70: 'OPTION_30_70',
  OPTION_70_30: 'OPTION_70_30',
  OPTION_50_50: 'OPTION_50_50',
  I_DONT_KNOW: 'I_DONT_KNOW',
} as const

export type MultipleChoiceOption = (typeof MultipleChoiceOption)[keyof typeof MultipleChoiceOption]

export const MULTIPLE_CHOICE_LABELS: Record<MultipleChoiceOption, string> = {
  [MultipleChoiceOption.YES]: 'Yes',
  [MultipleChoiceOption.NO]: 'No',
  [MultipleChoiceOption.OPTION_30_70]: '30/70',
  [MultipleChoiceOption.OPTION_70_30]: '70/30',
  [MultipleChoiceOption.OPTION_50_50]: '50/50',
  [MultipleChoiceOption.I_DONT_KNOW]: "I don't know",
}

export interface Answer {
  id: string
  userId: string
  questionId: string
  eventId: string
  answerText?: string
  selectedOption?: MultipleChoiceOption
  createdAt: string
  updatedAt: string
}

export interface SubmitAnswerPayload {
  questionId: string
  answerText?: string
  selectedOption?: MultipleChoiceOption
}

export interface SubmitAnswersPayload {
  eventId: string
  answers: SubmitAnswerPayload[]
}

export interface SubmitAnswersResponse {
  success: boolean
  message: string
  answers: Answer[]
}

export interface AnswerWithQuestion extends Answer {
  question: {
    id: string
    text: string
    type: string
    order: number
  }
}

export interface MyAnswersResponse {
  eventId: string
  eventName: string
  answers: Array<{
    questionId: string
    questionText: string
    questionType: string
    answerText?: string
    selectedOption?: MultipleChoiceOption
    submittedAt: string
  }>
}

export interface MyHistoryResponse {
  eventId: string
  eventName: string
  eventDescription?: string
  isActive: boolean
  answeredQuestionsCount: number
  totalQuestionsCount: number
  participatedAt: string
}

export interface SchoolResultsResponse {
  eventId: string
  eventName: string
  teacherResults: Array<{
    teacherId: string
    teacherName: string
    teacherEmail: string
    answeredQuestionsCount: number
    totalQuestionsCount: number
    answers: Array<{
      questionId: string
      questionText: string
      questionType: string
      answerText?: string
      selectedOption?: MultipleChoiceOption
    }>
  }>
}

export interface TeacherHistoryResponse {
  teacherId: string
  teacherName: string
  teacherEmail: string
  participationHistory: Array<{
    eventId: string
    eventName: string
    eventDescription?: string
    isActive: boolean
    answeredQuestionsCount: number
    totalQuestionsCount: number
    answers: Array<{
      questionId: string
      questionText: string
      questionType: string
      answerText?: string
      selectedOption?: MultipleChoiceOption
    }>
    participatedAt: string
  }>
}
