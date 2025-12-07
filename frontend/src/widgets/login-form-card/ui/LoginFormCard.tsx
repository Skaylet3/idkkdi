import { Card } from '@/shared/ui'
import { LoginForm } from '@/features/auth'

interface LoginFormCardProps {
  onSubmit?: (data: { email: string; password: string; rememberMe: boolean }) => void
  onForgotPassword?: () => void
  onSignUp?: () => void
  isLoading?: boolean
  error?: string | null
}

export function LoginFormCard({ onSubmit, onForgotPassword, onSignUp, isLoading, error }: LoginFormCardProps) {
  return (
    <Card className="bg-white rounded-2xl shadow-sm border-0 p-6 mx-[12px]">
      <LoginForm
        onSubmit={onSubmit}
        onForgotPassword={onForgotPassword}
        onSignUp={onSignUp}
        isLoading={isLoading}
        error={error}
      />
    </Card>
  )
}
