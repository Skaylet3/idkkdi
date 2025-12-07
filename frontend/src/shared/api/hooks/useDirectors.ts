import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query'
import { queryKeys } from '../queryKeys'
import { directorsService } from '../services'
import type { CreateDirectorPayload, UpdateDirectorPayload } from '../types'

export function useDirectors() {
  return useQuery({
    queryKey: queryKeys.directors.all,
    queryFn: directorsService.getAll,
  })
}

export function useDirector(id: string) {
  return useQuery({
    queryKey: queryKeys.directors.detail(id),
    queryFn: () => directorsService.getById(id),
    enabled: !!id,
  })
}

export function useCreateDirector() {
  const queryClient = useQueryClient()

  return useMutation({
    mutationFn: (payload: CreateDirectorPayload) => directorsService.create(payload),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: queryKeys.directors.all })
    },
  })
}

export function useUpdateDirector() {
  const queryClient = useQueryClient()

  return useMutation({
    mutationFn: ({ id, payload }: { id: string; payload: UpdateDirectorPayload }) =>
      directorsService.update(id, payload),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: queryKeys.directors.all })
    },
  })
}

export function useDeleteDirector() {
  const queryClient = useQueryClient()

  return useMutation({
    mutationFn: (id: string) => directorsService.delete(id),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: queryKeys.directors.all })
    },
  })
}
