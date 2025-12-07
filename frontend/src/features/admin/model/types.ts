export interface CreateSchoolData {
  name: string
  address?: string
}

export interface UpdateSchoolData {
  id: string
  name: string
  address?: string
}

export interface DeleteSchoolData {
  id: string
  name: string
}

export interface CreateEventQuestionData {
  text: string
  type: 'FREE_TEXT' | 'MULTIPLE_CHOICE'
}

export interface CreateEventData {
  name: string
  description?: string
  isActive: boolean
  questions: CreateEventQuestionData[]
}

export interface CreateDirectorData {
  email: string
  password: string
  name: string
  schoolId: string
}
