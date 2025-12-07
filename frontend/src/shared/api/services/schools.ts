import { apiClient } from '../client'
import type { School, CreateSchoolPayload, UpdateSchoolPayload } from '../types'

export const schoolsService = {
  getAll: async (): Promise<School[]> => {
    const response = await apiClient.get<School[]>('/schools')
    return response.data
  },

  getById: async (id: string): Promise<School> => {
    const response = await apiClient.get<School>(`/schools/${id}`)
    return response.data
  },

  create: async (payload: CreateSchoolPayload): Promise<School> => {
    const response = await apiClient.post<School>('/schools', payload)
    return response.data
  },

  update: async (id: string, payload: UpdateSchoolPayload): Promise<School> => {
    const response = await apiClient.patch<School>(`/schools/${id}`, payload)
    return response.data
  },

  delete: async (id: string): Promise<void> => {
    await apiClient.delete(`/schools/${id}`)
  },
}
