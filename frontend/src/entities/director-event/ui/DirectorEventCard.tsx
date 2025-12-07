import { Card } from '@/shared/ui'
import { cn } from '@/shared/lib/utils'
import { ClipboardCheck, FileText, TrendingUp, ChevronRight } from 'lucide-react'
import type { DirectorEvent } from '../model/types'

interface DirectorEventCardProps {
  event: DirectorEvent
  onClick?: () => void
}

const iconMap = {
  clipboard: ClipboardCheck,
  document: FileText,
  chart: TrendingUp,
}

const iconColorMap = {
  clipboard: {
    bg: 'bg-green-100',
    icon: 'text-green-600',
  },
  document: {
    bg: 'bg-blue-100',
    icon: 'text-blue-600',
  },
  chart: {
    bg: 'bg-purple-100',
    icon: 'text-purple-600',
  },
}

export function DirectorEventCard({ event, onClick }: DirectorEventCardProps) {
  const Icon = iconMap[event.iconType]
  const colors = iconColorMap[event.iconType]

  return (
    <Card
      className="bg-white rounded-2xl shadow-sm border-0 cursor-pointer hover:shadow-md transition-shadow"
      onClick={onClick}
    >
      <div className="p-4 flex items-center gap-4">
        <div className={cn('w-12 h-12 rounded-xl flex items-center justify-center shrink-0', colors.bg)}>
          <Icon className={cn('w-5 h-5', colors.icon)} />
        </div>

        <div className="flex-1 min-w-0">
          <h3 className="text-gray-800 text-base font-bold leading-6 line-clamp-2">
            {event.title}
          </h3>
          <p className="text-gray-500 text-sm mt-1">
            {event.date} • {event.participantCount} Participants
          </p>
          <div className="flex items-center gap-2 mt-1">
            <span
              className={cn(
                'px-2 py-0.5 rounded text-xs font-medium',
                event.status === 'completed' ? 'bg-green-100 text-green-700' : 'bg-yellow-100 text-yellow-700'
              )}
            >
              {event.status === 'completed' ? 'Completed' : 'Pending'}
            </span>
            <span className="text-gray-400 text-xs">
              View responses
            </span>
          </div>
        </div>

        <ChevronRight className="w-5 h-5 text-gray-400 shrink-0" />
      </div>
    </Card>
  )
}
