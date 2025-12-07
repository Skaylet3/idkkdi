import { AdminPanel } from '@/pages/admin'
import { DirectorPanel } from '@/pages/director'
import { ErrorPage } from '@/pages/error'
import { LoginPage } from '@/pages/login'
import { TeacherPanel } from '@/pages/teacher'
import { createBrowserRouter } from 'react-router-dom'
import { ProtectedRoute } from './ProtectedRoute'
import { Role } from '@/entities/user'

/**
 * Application router configuration
 * Uses React Router v7 with createBrowserRouter for best practices
 */
export const router = createBrowserRouter([
  {
    path: '/',
    element: <LoginPage />,
    errorElement: <ErrorPage />,
  },
  {
    path: '/admin',
    element: (
      <ProtectedRoute allowedRoles={[Role.ADMIN]}>
        <AdminPanel />
      </ProtectedRoute>
    ),
    errorElement: <ErrorPage />,
  },
  {
    path: '/me/director',
    element: (
      <ProtectedRoute allowedRoles={[Role.DIRECTOR]}>
        <DirectorPanel />
      </ProtectedRoute>
    ),
    errorElement: <ErrorPage />,
  },
  {
    path: '/me/teacher',
    element: (
      <ProtectedRoute allowedRoles={[Role.TEACHER]}>
        <TeacherPanel />
      </ProtectedRoute>
    ),
    errorElement: <ErrorPage />,
  },
  {
    path: '*',
    element: <ErrorPage />,
  },
])
