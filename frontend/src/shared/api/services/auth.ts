import { apiClient } from '../client'
import type { LoginPayload, LoginResponse, AuthMeResponse } from '../types'

export const authService = {
  login: async (payload: LoginPayload): Promise<LoginResponse> => {
    const response = await apiClient.post<LoginResponse>('/auth/login', payload)
    return response.data
  },

  getMe: async (): Promise<AuthMeResponse> => {
    const response = await apiClient.get<AuthMeResponse>('/auth/me')
    return response.data
  },
}
