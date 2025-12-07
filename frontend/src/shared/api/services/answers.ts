import { apiClient } from '../client'
import type {
  SubmitAnswersPayload,
  SubmitAnswersResponse,
  MyHistoryResponse,
  MyAnswersResponse,
  SchoolResultsResponse,
  TeacherHistoryResponse,
} from '../types'

export const answersService = {
  submit: async (payload: SubmitAnswersPayload): Promise<SubmitAnswersResponse> => {
    const response = await apiClient.post<SubmitAnswersResponse>('/answers/submit', payload)
    return response.data
  },

  getMyHistory: async (): Promise<MyHistoryResponse[]> => {
    const response = await apiClient.get<MyHistoryResponse[]>('/answers/my-participated-events')
    return response.data
  },

  getMyAnswers: async (eventId: string): Promise<MyAnswersResponse> => {
    const response = await apiClient.get<MyAnswersResponse>(`/answers/my-answers/${eventId}`)
    return response.data
  },

  getSchoolResults: async (eventId: string): Promise<SchoolResultsResponse> => {
    const response = await apiClient.get<SchoolResultsResponse>(`/answers/school-results/${eventId}`)
    return response.data
  },

  getTeacherHistory: async (teacherId: string): Promise<TeacherHistoryResponse> => {
    const response = await apiClient.get<TeacherHistoryResponse>(`/answers/teacher-history/${teacherId}`)
    return response.data
  },
}
