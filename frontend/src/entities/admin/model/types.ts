export interface Admin {
  id: string
  email: string
  name: string
  role: 'ADMIN'
  createdAt: string
  updatedAt: string
}

export interface CreateAdminPayload {
  email: string
  password: string
  name: string
}

export interface AdminResponse {
  id: string
  email: string
  name: string
  createdAt: string
  updatedAt: string
}
