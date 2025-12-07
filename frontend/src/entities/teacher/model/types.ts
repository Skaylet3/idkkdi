export interface Teacher {
  id: string
  name: string
  email: string
  schoolId: string
  schoolName?: string
  avatarUrl?: string
  subject?: string
}

export interface CreateTeacherPayload {
  name: string
  email: string
  password: string
  schoolId: string
}

export interface UpdateTeacherPayload {
  name?: string
  email?: string
}
