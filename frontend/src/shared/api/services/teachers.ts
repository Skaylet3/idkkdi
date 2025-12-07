import { apiClient } from '../client'
import type { TeacherResponse, CreateTeacherPayload, UpdateTeacherPayload } from '../types'

export const teachersService = {
  getAll: async (): Promise<TeacherResponse[]> => {
    const response = await apiClient.get<TeacherResponse[]>('/teachers')
    return response.data
  },

  getById: async (id: string): Promise<TeacherResponse> => {
    const response = await apiClient.get<TeacherResponse>(`/teachers/${id}`)
    return response.data
  },

  create: async (payload: CreateTeacherPayload): Promise<TeacherResponse> => {
    const response = await apiClient.post<TeacherResponse>('/teachers', payload)
    return response.data
  },

  update: async (id: string, payload: UpdateTeacherPayload): Promise<TeacherResponse> => {
    const response = await apiClient.patch<TeacherResponse>(`/teachers/${id}`, payload)
    return response.data
  },

  delete: async (id: string): Promise<void> => {
    await apiClient.delete(`/teachers/${id}`)
  },
}
