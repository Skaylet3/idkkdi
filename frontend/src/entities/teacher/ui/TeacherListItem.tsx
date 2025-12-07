import { Avatar, AvatarImage, AvatarFallback } from '@/shared/ui'
import { ChevronRight } from 'lucide-react'
import type { Teacher } from '../model/types'

interface TeacherListItemProps {
  teacher: Teacher
  onClick?: () => void
}

export function TeacherListItem({ teacher, onClick }: TeacherListItemProps) {
  const initials = teacher.name
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
        <AvatarImage src={teacher.avatarUrl} alt={teacher.name} />
        <AvatarFallback className="bg-gray-200 text-gray-600 text-sm font-medium">
          {initials}
        </AvatarFallback>
      </Avatar>

      <div className="flex-1 min-w-0">
        <p className="font-semibold text-gray-800 truncate">{teacher.name}</p>
        <p className="text-sm text-gray-500 truncate">
          {teacher.subject || teacher.email}
        </p>
      </div>

      <ChevronRight className="w-5 h-5 text-gray-400 flex-shrink-0" />
    </button>
  )
}
