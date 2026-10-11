'use client'
import { create } from 'zustand'
import { persist } from 'zustand/middleware'
import type { AuthUser } from '@/lib/api/auth'
import { loginApi, registerApi, logoutApi, refreshTokensApi } from '@/lib/api/auth'

interface AuthStore {
  user: AuthUser | null
  accessToken: string | null
  refreshToken: string | null
  isLoading: boolean
  error: string | null

  login: (email: string, password: string) => Promise<void>
  register: (data: {
    firstName: string
    lastName: string
    email: string
    phone: string
    password: string
    companyName?: string
    gstin?: string
  }) => Promise<void>
  logout: () => Promise<void>
  setSession: (user: AuthUser, accessToken: string, refreshToken: string) => void
  clearError: () => void
  isAuthenticated: () => boolean
  isAdmin: () => boolean
}

export const useAuthStore = create<AuthStore>()(
  persist(
    (set, get) => ({
      user: null,
      accessToken: null,
      refreshToken: null,
      isLoading: false,
      error: null,

      login: async (email, password) => {
        set({ isLoading: true, error: null })
        try {
          const res = await loginApi(email, password)
          set({
            user: res.user,
            accessToken: res.accessToken,
            refreshToken: res.refreshToken,
            isLoading: false,
            error: null,
          })
        } catch (err: any) {
          set({ isLoading: false, error: err.message || 'Login failed' })
          throw err
        }
      },

      register: async (data) => {
        set({ isLoading: true, error: null })
        try {
          const res = await registerApi(data)
          set({
            user: res.user,
            accessToken: res.accessToken,
            refreshToken: res.refreshToken,
            isLoading: false,
            error: null,
          })
        } catch (err: any) {
          set({ isLoading: false, error: err.message || 'Registration failed' })
          throw err
        }
      },

      logout: async () => {
        try { await logoutApi() } catch {}
        set({ user: null, accessToken: null, refreshToken: null, error: null })
      },

      setSession: (user, accessToken, refreshToken) =>
        set({ user, accessToken, refreshToken, error: null, isLoading: false }),

      clearError: () => set({ error: null }),

      isAuthenticated: () => !!get().accessToken && !!get().user,

      isAdmin: () => {
        const role = get().user?.role
        return role === 'admin' || role === 'super_admin'
      },
    }),
    {
      name: 'toolhaat-auth',
      // Only persist credentials, not loading state
      partialize: (s) => ({
        user: s.user,
        accessToken: s.accessToken,
        refreshToken: s.refreshToken,
      }),
    },
  ),
)
