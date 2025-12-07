import { Navigate, useLocation } from 'react-router-dom'
import { useAuthStore } from '@/shared/auth'
import { Role } from '@/entities/user'
import { useEffect } from 'react'

interface ProtectedRouteProps {
  children: React.ReactNode
  allowedRoles?: Role[]
}

export function ProtectedRoute({ children, allowedRoles }: ProtectedRouteProps) {
  const location = useLocation()
  const { isAuthenticated, user, isLoading, checkAuth } = useAuthStore()

  useEffect(() => {
    checkAuth()
  }, [checkAuth])

  // Show nothing while checking auth
  if (isLoading) {
    return (
      <div className="flex h-screen items-center justify-center">
        <div className="text-lg">Loading...</div>
      </div>
    )
  }

  // Not authenticated - redirect to login
  if (!isAuthenticated || !user) {
    return <Navigate to="/" state={{ from: location }} replace />
  }

  // Check role-based access
  if (allowedRoles && !allowedRoles.includes(user.role)) {
    // Redirect to appropriate panel based on role
    const roleRedirects: Record<Role, string> = {
      [Role.ADMIN]: '/admin',
      [Role.DIRECTOR]: '/me/director',
      [Role.TEACHER]: '/me/teacher',
    }
    return <Navigate to={roleRedirects[user.role]} replace />
  }

  return <>{children}</>
}
