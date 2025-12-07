import { Card } from '@/shared/ui'
import { Avatar, AvatarImage, AvatarFallback } from '@/shared/ui'

interface WelcomeCardProps {
  userName: string
  avatarUrl?: string
  message?: string
}

export function WelcomeCard({ userName, avatarUrl, message = "Ready for today's questionnaires?" }: WelcomeCardProps) {
  const initials = userName
    .split(' ')
    .map((n) => n[0])
    .join('')
    .toUpperCase()
    .slice(0, 2)

  return (
    <Card className="bg-white rounded-2xl shadow-sm border-0">
      <div className="p-4 flex items-center gap-4">
        <Avatar className="w-14 h-14">
          <AvatarImage src={avatarUrl} alt={userName} />
          <AvatarFallback className="bg-gray-200 text-gray-600 text-lg font-medium">
            {initials}
          </AvatarFallback>
        </Avatar>
        <div>
          <h2 className="text-gray-800 text-lg font-bold leading-7">
            Welcome, {userName}!
          </h2>
          <p className="text-gray-500 text-sm leading-5">
            {message}
          </p>
        </div>
      </div>
    </Card>
  )
}
