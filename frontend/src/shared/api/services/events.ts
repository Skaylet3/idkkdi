import { apiClient } from '../client'
import type { Event, EventWithQuestions, CreateEventPayload, UpdateEventPayload } from '../types'

export const eventsService = {
  getAll: async (): Promise<Event[]> => {
    const response = await apiClient.get<Event[]>('/events')
    return response.data
  },

  getById: async (id: string): Promise<EventWithQuestions> => {
    const response = await apiClient.get<EventWithQuestions>(`/events/${id}`)
    return response.data
  },

  create: async (payload: CreateEventPayload): Promise<EventWithQuestions> => {
    const response = await apiClient.post<EventWithQuestions>('/events', payload)
    return response.data
  },

  update: async (id: string, payload: UpdateEventPayload): Promise<Event> => {
    const response = await apiClient.patch<Event>(`/events/${id}`, payload)
    return response.data
  },

  delete: async (id: string): Promise<void> => {
    await apiClient.delete(`/events/${id}`)
  },
}
