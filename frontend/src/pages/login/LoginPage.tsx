import { useState, useEffect } from 'react'
import { useNavigate } from 'react-router-dom'
import { PageFooter } from '@/widgets/page-footer'
import type { FooterLink } from '@/widgets/page-footer'
import { LoginFormCard } from '@/widgets/login-form-card'
import { WelcomeMessage } from '@/widgets/welcome-message'
import { useAuthStore } from '@/shared/auth'
import { Role } from '@/entities/user'

export function LoginPage() {
  const navigate = useNavigate()
  const { login, isLoading, isAuthenticated, user } = useAuthStore()
  const [error, setError] = useState<string | null>(null)

  // Redirect if already authenticated
  useEffect(() => {
    if (isAuthenticated && user) {
      const redirectPath = {
        [Role.ADMIN]: '/admin',
        [Role.DIRECTOR]: '/me/director',
        [Role.TEACHER]: '/me/teacher',
      }[user.role]
      navigate(redirectPath, { replace: true })
    }
  }, [isAuthenticated, user, navigate])

  const links: FooterLink[] = [
    {
      label: 'Privacy Policy',
      href: 'https://ui.shadcn.com/docs/components/card'
    },
    {
      label: 'Terms of Service',
      href: 'https://ui.shadcn.com/docs/components/card'
    },
    {
      label: 'Support',
      href: 'https://ui.shadcn.com/docs/components/card'
    },
  ]

  const handleLogin = async (data: { email: string; password: string; rememberMe: boolean }) => {
    setError(null)
    try {
      await login({ email: data.email, password: data.password })
      // Redirect will happen in useEffect when isAuthenticated changes
    } catch (err) {
      const errorMessage = err instanceof Error ? err.message : 'Invalid email or password'
      setError(errorMessage)
    }
  }

  const handleForgotPassword = () => {
    console.log('Forgot password clicked')
    // TODO: Navigate to forgot password page
  }

  const handleSignUp = () => {
    console.log('Sign up clicked')
    // TODO: Navigate to sign up page
  }

  return (
    <div className="min-h-screen bg-stone-100 flex flex-col">

      <WelcomeMessage
        title='Welcome back!'
        subtitle='Sign in to continue your journey'
      />

      <LoginFormCard
        onSubmit={handleLogin}
        onForgotPassword={handleForgotPassword}
        onSignUp={handleSignUp}
        isLoading={isLoading}
        error={error}
      />

      <PageFooter
        copyright='© 2024 EduQuest. All rights reserved.'
        links={links}
      />
    </div>
  )
}
