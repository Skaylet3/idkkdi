// Backend Teacher entity (matches API response)
export interface TeacherResponse {
  id: string
  email: string
  name: string
  schoolId: string
  createdAt: string
  updatedAt: string
}

export interface TeacherWithSchool extends TeacherResponse {
  school: {
    id: string
    name: string
    address?: string
  }
}

export interface CreateTeacherPayload {
  name: string
  email: string
  password: string
}

export interface UpdateTeacherPayload {
  name?: string
  email?: string
}

// UI-specific type (for display purposes)
export interface Teacher {
  id: string
  name: string
  email: string
  schoolId: string
  schoolName?: string
  avatarUrl?: string
  subject?: string
}

// Helper to transform backend response to UI Teacher
export function toTeacher(teacher: TeacherResponse, schoolName?: string): Teacher {
  return {
    id: teacher.id,
    name: teacher.name,
    email: teacher.email,
    schoolId: teacher.schoolId,
    schoolName,
  }
}
