import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query'
import { queryKeys } from '../queryKeys'
import { schoolsService } from '../services'
import type { CreateSchoolPayload, UpdateSchoolPayload } from '../types'

export function useSchools() {
  return useQuery({
    queryKey: queryKeys.schools.all,
    queryFn: schoolsService.getAll,
  })
}

export function useSchool(id: string) {
  return useQuery({
    queryKey: queryKeys.schools.detail(id),
    queryFn: () => schoolsService.getById(id),
    enabled: !!id,
  })
}

export function useCreateSchool() {
  const queryClient = useQueryClient()

  return useMutation({
    mutationFn: (payload: CreateSchoolPayload) => schoolsService.create(payload),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: queryKeys.schools.all })
    },
  })
}

export function useUpdateSchool() {
  const queryClient = useQueryClient()

  return useMutation({
    mutationFn: ({ id, payload }: { id: string; payload: UpdateSchoolPayload }) =>
      schoolsService.update(id, payload),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: queryKeys.schools.all })
    },
  })
}

export function useDeleteSchool() {
  const queryClient = useQueryClient()

  return useMutation({
    mutationFn: (id: string) => schoolsService.delete(id),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: queryKeys.schools.all })
    },
  })
}
