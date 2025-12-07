export interface CreateTeacherData {
  name: string
  email: string
  password: string
  schoolId: string
}

export interface UpdateTeacherData {
  id: string
  name: string
  email: string
}

export interface DeleteTeacherData {
  id: string
  name: string
}
