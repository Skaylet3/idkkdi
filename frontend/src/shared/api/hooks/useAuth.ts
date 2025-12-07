import { useQuery } from '@tanstack/react-query'
import { queryKeys } from '../queryKeys'
import { authService } from '../services'

export function useCurrentUser() {
  return useQuery({
    queryKey: queryKeys.auth.me,
    queryFn: authService.getMe,
    retry: false,
    staleTime: 1000 * 60 * 5, // 5 minutes
  })
}
