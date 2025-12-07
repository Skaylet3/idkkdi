export const Role = {
  ADMIN: 'ADMIN',
  DIRECTOR: 'DIRECTOR',
  TEACHER: 'TEACHER',
} as const

export type Role = (typeof Role)[keyof typeof Role]

export interface User {
  id: string
  email: string
  password?: string // Only for create payloads, never returned from API
  name: string
  role: Role
  createdAt: string
  updatedAt: string
}

export interface CreateUserPayload {
  email: string
  password: string
  name: string
  role: Role
}

export interface UpdateUserPayload {
  email?: string
  name?: string
}

export interface UserResponse {
  id: string
  email: string
  name: string
  role: Role
  createdAt: string
  updatedAt: string
}
