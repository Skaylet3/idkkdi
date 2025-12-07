export interface Director {
  id: string
  email: string
  name: string
  role: 'DIRECTOR'
  schoolId: string
  createdAt: string
  updatedAt: string
}

export interface CreateDirectorPayload {
  email: string
  password: string
  name: string
  schoolId: string
}

export interface UpdateDirectorPayload {
  email?: string
  name?: string
}

export interface DirectorResponse {
  id: string
  email: string
  name: string
  schoolId: string
  createdAt: string
  updatedAt: string
}

export interface DirectorWithSchool extends DirectorResponse {
  school: {
    id: string
    name: string
    address?: string
  }
}
