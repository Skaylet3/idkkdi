import { Check, ChevronRight } from 'lucide-react'
import type { CompletedEvent } from '../model/types'

interface CompletedEventItemProps {
  event: CompletedEvent
  onClick?: () => void
}

export function CompletedEventItem({ event, onClick }: CompletedEventItemProps) {
  return (
    <button
      type="button"
      onClick={onClick}
      className="w-full flex items-center gap-3 p-4 rounded-xl bg-gray-50 hover:bg-gray-100 transition-colors text-left"
    >
      <div className="w-10 h-10 rounded-full bg-green-100 flex items-center justify-center flex-shrink-0">
        <Check className="w-5 h-5 text-green-500" />
      </div>

      <div className="flex-1 min-w-0">
        <p className="font-semibold text-gray-800 truncate">{event.eventName}</p>
        <p className="text-sm text-green-600">
          Completed • {event.completedAt}
        </p>
      </div>

      <ChevronRight className="w-5 h-5 text-gray-400 flex-shrink-0" />
    </button>
  )
}
