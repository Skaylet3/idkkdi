import type { Question, CreateQuestionPayload } from '@/entities/question'

// Backend Event entity (matches Prisma schema)
export interface Event {
  id: string
  name: string
  description?: string
  isActive: boolean
  createdAt: string
  updatedAt: string
}

export interface EventWithQuestions extends Event {
  questions: Question[]
}

export interface CreateEventPayload {
  name: string
  description?: string
  isActive?: boolean
  questions: CreateQuestionPayload[]
}

export interface UpdateEventPayload {
  name?: string
  description?: string
  isActive?: boolean
}

// UI-specific types (for display purposes)
export type EventStatus = 'pending' | 'completed'
export type EventColor = 'lime' | 'blue' | 'purple' | 'orange'

export interface TeacherEvent {
  id: string
  title: string
  date: string
  questionCount: number
  status: EventStatus
  color: EventColor
}

// Helper to transform backend Event to UI TeacherEvent
export function toTeacherEvent(event: EventWithQuestions, status: EventStatus, color: EventColor): TeacherEvent {
  return {
    id: event.id,
    title: event.name,
    date: event.createdAt,
    questionCount: event.questions.length,
    status,
    color,
  }
}
