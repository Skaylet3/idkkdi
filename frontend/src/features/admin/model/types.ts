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

export interface CreateEventData {
  name: string
  description?: string
  isActive: boolean
}

export interface CreateDirectorData {
  email: string
  password: string
  name: string
  schoolId: string
}
