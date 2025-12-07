import { Card } from '@/shared/ui'
import { LoginForm } from '@/features/auth'

interface LoginFormCardProps {
  onSubmit?: (data: { email: string; password: string; rememberMe: boolean }) => void
  onForgotPassword?: () => void
  onSignUp?: () => void
}

export function LoginFormCard({ onSubmit, onForgotPassword, onSignUp }: LoginFormCardProps) {
  return (
    <Card className="bg-white rounded-2xl shadow-sm border-0 p-6 mx-[12px]">
      <LoginForm
        onSubmit={onSubmit}
        onForgotPassword={onForgotPassword}
        onSignUp={onSignUp}
      />
    </Card>
  )
}
