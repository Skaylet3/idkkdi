import { PageFooter } from '@/widgets/page-footer'
import type { FooterLink } from '@/widgets/page-footer'
import { LoginFormCard } from '@/widgets/login-form-card'
import { WelcomeMessage } from '@/widgets/welcome-message'

export function LoginPage() {

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

  const handleLogin = (data: { email: string; password: string; rememberMe: boolean }) => {
    console.log('Login:', data)
    // TODO: Implement actual login logic
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
      />

      <PageFooter 
        copyright='© 2024 EduQuest. All rights reserved.'
        links={links}
      />
    </div>
  )
}
