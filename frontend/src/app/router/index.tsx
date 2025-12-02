import { createBrowserRouter } from 'react-router-dom'
import { HomePage } from '@/pages/home'
import { DashboardPage } from '@/pages/dashboard'
import { ProfilePage } from '@/pages/profile'
import { SettingsPage } from '@/pages/settings'
import { ErrorPage } from '@/pages/error'

/**
 * Application router configuration
 * Uses React Router v7 with createBrowserRouter for best practices
 */
export const router = createBrowserRouter([
  {
    path: '/',
    element: <HomePage />,
    errorElement: <ErrorPage />,
  },
  {
    path: '/dashboard',
    element: <DashboardPage />,
    errorElement: <ErrorPage />,
  },
  {
    path: '/profile',
    element: <ProfilePage />,
    errorElement: <ErrorPage />,
  },
  {
    path: '/settings',
    element: <SettingsPage />,
    errorElement: <ErrorPage />,
  },
  {
    path: '*',
    element: <ErrorPage />,
  },
])
