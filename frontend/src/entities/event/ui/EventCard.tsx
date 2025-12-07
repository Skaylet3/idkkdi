import { Card } from '@/shared/ui'
import { cn } from '@/shared/lib/utils'
import { ClipboardCheck, FileText, TrendingUp, Lightbulb, ChevronRight } from 'lucide-react'
import type { TeacherEvent } from '../model/types'

interface EventCardProps {
  event: TeacherEvent
  onClick?: () => void
}

const iconMap = {
  lime: ClipboardCheck,
  blue: FileText,
  purple: TrendingUp,
  orange: Lightbulb,
}

const colorVariants = {
  lime: {
    bg: 'bg-lime-500/10',
    icon: 'text-lime-500',
  },
  blue: {
    bg: 'bg-blue-500/10',
    icon: 'text-blue-500',
  },
  purple: {
    bg: 'bg-purple-500/10',
    icon: 'text-purple-500',
  },
  orange: {
    bg: 'bg-orange-500/10',
    icon: 'text-orange-500',
  },
}

export function EventCard({ event, onClick }: EventCardProps) {
  const Icon = iconMap[event.color]
  const colors = colorVariants[event.color]
  const isPending = event.status === 'pending'

  return (
    <Card
      className="bg-white rounded-2xl shadow-sm border-0 cursor-pointer hover:shadow-md transition-shadow"
      onClick={onClick}
    >
      <div className="p-4 flex items-start gap-4">
        <div className={cn('w-12 h-12 rounded-xl flex items-center justify-center shrink-0', colors.bg)}>
          <Icon className={cn('w-5 h-5', colors.icon)} />
        </div>

        <div className="flex-1 min-w-0">
          <h3 className="text-gray-800 text-base font-bold leading-6 line-clamp-2">
            {event.title}
          </h3>
          <p className="text-gray-500 text-sm mt-1">
            {event.date} • {event.questionCount} Questions
          </p>
          <div className="flex items-center gap-2 mt-2">
            <span
              className={cn(
                'px-3 py-1 rounded-lg text-xs font-medium',
                isPending ? 'bg-yellow-100 text-yellow-700' : 'bg-green-100 text-green-700'
              )}
            >
              {isPending ? 'Pending' : 'Completed'}
            </span>
            <span className="text-gray-500 text-xs">
              {isPending ? 'Tap to preview' : 'Tap to review'}
            </span>
          </div>
        </div>

        <ChevronRight className="w-5 h-5 text-gray-400 shrink-0 mt-1" />
      </div>
    </Card>
  )
}
