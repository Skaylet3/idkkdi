export interface TeacherAnswer {
  id: string
  questionId: string
  questionText: string
  answerText: string
}

export interface TeacherEventAnswers {
  teacherId: string
  teacherName: string
  eventId: string
  eventName: string
  answers: TeacherAnswer[]
}
