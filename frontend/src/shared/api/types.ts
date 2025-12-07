import type { Role } from '@/entities/user'

// ============================================
// AUTH API TYPES
// ============================================

export interface LoginPayload {
  email: string
  password: string
}

export interface LoginResponse {
  access_token: string
  user: {
    userId: string
    email: string
    role: Role
    schoolId?: string
  }
}

export interface JwtPayload {
  userId: string
  email: string
  role: Role
  schoolId?: string
  iat: number
  exp: number
}

export interface AuthMeResponse {
  message: string
  user: JwtPayload
}

// ============================================
// GENERIC API TYPES
// ============================================

export interface ApiError {
  statusCode: number
  message: string | string[]
  error?: string
}

export interface PaginatedResponse<T> {
  data: T[]
  total: number
  page: number
  limit: number
}

// ============================================
// RE-EXPORTS FROM ENTITIES
// ============================================

// Schools
export type {
  School,
  CreateSchoolPayload,
  UpdateSchoolPayload,
} from '@/entities/admin-school'

// Directors
export type {
  Director,
  CreateDirectorPayload,
  UpdateDirectorPayload,
  DirectorResponse,
  DirectorWithSchool,
} from '@/entities/director'

// Teachers
export type {
  TeacherResponse,
  TeacherWithSchool,
  CreateTeacherPayload,
  UpdateTeacherPayload,
} from '@/entities/teacher'

// Events
export type {
  Event,
  EventWithQuestions,
  CreateEventPayload,
  UpdateEventPayload,
} from '@/entities/event'

// Questions
export type {
  Question,
  CreateQuestionPayload,
  UpdateQuestionPayload,
  QuestionType,
} from '@/entities/question'

// Answers
export type {
  Answer,
  SubmitAnswerPayload,
  SubmitAnswersPayload,
  SubmitAnswersResponse,
  MyAnswersResponse,
  MyHistoryResponse,
  SchoolResultsResponse,
  TeacherHistoryResponse,
  MultipleChoiceOption,
} from '@/entities/answer'
