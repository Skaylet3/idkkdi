import { Avatar, AvatarImage, AvatarFallback, Badge } from '@/shared/ui'
import type { EventParticipant } from '../model/types'

interface ParticipantListItemProps {
  participant: EventParticipant
  onClick?: () => void
}

export function ParticipantListItem({ participant, onClick }: ParticipantListItemProps) {
  const initials = participant.teacherName
    .split(' ')
    .map((n) => n[0])
    .join('')
    .toUpperCase()
    .slice(0, 2)

  return (
    <button
      type="button"
      onClick={onClick}
      className="w-full flex items-center gap-3 p-3 rounded-xl bg-gray-50 hover:bg-gray-100 transition-colors text-left"
    >
      <Avatar className="h-12 w-12">
        <AvatarImage src={participant.avatarUrl} alt={participant.teacherName} />
        <AvatarFallback className="bg-gray-200 text-gray-600 text-sm font-medium">
          {initials}
        </AvatarFallback>
      </Avatar>

      <div className="flex-1 min-w-0">
        <p className="font-semibold text-gray-800 truncate">{participant.teacherName}</p>
        <p className="text-sm text-gray-500 truncate">{participant.schoolName}</p>
      </div>

      <Badge
        variant="outline"
        className={
          participant.status === 'completed'
            ? 'bg-green-50 text-green-600 border-green-200'
            : 'bg-yellow-50 text-yellow-600 border-yellow-200'
        }
      >
        {participant.status === 'completed' ? 'Completed' : 'Pending'}
      </Badge>
    </button>
  )
}
