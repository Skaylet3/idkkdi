import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query'
import { queryKeys } from '../queryKeys'
import { answersService } from '../services'
import type { SubmitAnswersPayload } from '../types'

export function useSubmitAnswers() {
  const queryClient = useQueryClient()

  return useMutation({
    mutationFn: (payload: SubmitAnswersPayload) => answersService.submit(payload),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: queryKeys.answers.myHistory })
    },
  })
}

export function useMyHistory() {
  return useQuery({
    queryKey: queryKeys.answers.myHistory,
    queryFn: answersService.getMyHistory,
  })
}

export function useMyAnswers(eventId: string) {
  return useQuery({
    queryKey: queryKeys.answers.myAnswers(eventId),
    queryFn: () => answersService.getMyAnswers(eventId),
    enabled: !!eventId,
  })
}

export function useSchoolResults(eventId: string) {
  return useQuery({
    queryKey: queryKeys.answers.schoolResults(eventId),
    queryFn: () => answersService.getSchoolResults(eventId),
    enabled: !!eventId,
  })
}

export function useTeacherHistory(teacherId: string) {
  return useQuery({
    queryKey: queryKeys.answers.teacherHistory(teacherId),
    queryFn: () => answersService.getTeacherHistory(teacherId),
    enabled: !!teacherId,
  })
}
