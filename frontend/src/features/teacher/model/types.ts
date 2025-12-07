export interface AnswerPayload {
  questionId: string
  answerText?: string
  selectedOption?: string
}

export interface SubmitAnswersData {
  eventId: string
  answers: AnswerPayload[]
}
