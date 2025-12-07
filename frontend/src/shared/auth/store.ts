import { create } from 'zustand'
import { persist } from 'zustand/middleware'
import { Role } from '@/entities/user'
import { apiClient } from '@/shared/api'
import type { LoginPayload, LoginResponse } from '@/shared/api'

interface User {
  userId: string
  email: string
  role: Role
  schoolId?: string
}

interface AuthState {
  token: string | null
  user: User | null
  isAuthenticated: boolean
  isLoading: boolean

  // Actions
  login: (payload: LoginPayload) => Promise<void>
  logout: () => void
  setUser: (user: User | null) => void
  checkAuth: () => Promise<void>
}

export const useAuthStore = create<AuthState>()(
  persist(
    (set, _get) => ({
      token: null,
      user: null,
      isAuthenticated: false,
      isLoading: false,

      login: async (payload: LoginPayload) => {
        set({ isLoading: true })
        try {
          const response = await apiClient.post<LoginResponse>('/auth/login', payload)
          const { access_token, user } = response.data

          localStorage.setItem('access_token', access_token)

          set({
            token: access_token,
            user,
            isAuthenticated: true,
            isLoading: false,
          })
        } catch (error) {
          set({ isLoading: false })
          throw error
        }
      },

      logout: () => {
        localStorage.removeItem('access_token')
        set({
          token: null,
          user: null,
          isAuthenticated: false,
        })
      },

      setUser: (user: User | null) => {
        set({ user, isAuthenticated: !!user })
      },

      checkAuth: async () => {
        const token = localStorage.getItem('access_token')
        if (!token) {
          set({ isAuthenticated: false, user: null, token: null })
          return
        }

        set({ isLoading: true })
        try {
          const response = await apiClient.get('/auth/me')
          const { user } = response.data
          set({
            token,
            user,
            isAuthenticated: true,
            isLoading: false,
          })
        } catch {
          localStorage.removeItem('access_token')
          set({
            token: null,
            user: null,
            isAuthenticated: false,
            isLoading: false,
          })
        }
      },
    }),
    {
      name: 'auth-storage',
      partialize: (state) => ({ token: state.token, user: state.user }),
    }
  )
)
