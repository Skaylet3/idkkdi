import { apiClient } from '../client'
import type { DirectorResponse, CreateDirectorPayload, UpdateDirectorPayload } from '../types'

export const directorsService = {
  getAll: async (): Promise<DirectorResponse[]> => {
    const response = await apiClient.get<DirectorResponse[]>('/directors')
    return response.data
  },

  getById: async (id: string): Promise<DirectorResponse> => {
    const response = await apiClient.get<DirectorResponse>(`/directors/${id}`)
    return response.data
  },

  create: async (payload: CreateDirectorPayload): Promise<DirectorResponse> => {
    const response = await apiClient.post<DirectorResponse>('/directors', payload)
    return response.data
  },

  update: async (id: string, payload: UpdateDirectorPayload): Promise<DirectorResponse> => {
    const response = await apiClient.patch<DirectorResponse>(`/directors/${id}`, payload)
    return response.data
  },

  delete: async (id: string): Promise<void> => {
    await apiClient.delete(`/directors/${id}`)
  },
}
