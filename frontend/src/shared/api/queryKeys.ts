export const queryKeys = {
  auth: {
    me: ['auth', 'me'] as const,
  },
  schools: {
    all: ['schools'] as const,
    detail: (id: string) => ['schools', id] as const,
  },
  directors: {
    all: ['directors'] as const,
    detail: (id: string) => ['directors', id] as const,
  },
  teachers: {
    all: ['teachers'] as const,
    detail: (id: string) => ['teachers', id] as const,
  },
  events: {
    all: ['events'] as const,
    detail: (id: string) => ['events', id] as const,
  },
  answers: {
    myHistory: ['answers', 'my-history'] as const,
    myAnswers: (eventId: string) => ['answers', 'my-answers', eventId] as const,
    schoolResults: (eventId: string) => ['answers', 'school-results', eventId] as const,
    teacherHistory: (teacherId: string) => ['answers', 'teacher-history', teacherId] as const,
  },
}
