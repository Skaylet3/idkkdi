import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
} from '@/shared/ui'
import { CompletedEventItem, type CompletedEvent } from '@/entities/completed-event'

interface EventHistoryModalProps {
  open: boolean
  onOpenChange: (open: boolean) => void
  events: CompletedEvent[]
  onEventClick: (event: CompletedEvent) => void
  isLoading?: boolean
}

export function EventHistoryModal({
  open,
  onOpenChange,
  events,
  onEventClick,
  isLoading = false,
}: EventHistoryModalProps) {
  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogContent className="w-[calc(100%-2rem)] sm:max-w-md rounded-2xl">
        <DialogHeader>
          <DialogTitle className="text-xl font-semibold text-gray-800">
            Event History
          </DialogTitle>
        </DialogHeader>

        <div className="space-y-3 max-h-[400px] overflow-y-auto">
          {isLoading ? (
            <div className="py-8 text-center text-gray-500">Loading...</div>
          ) : events.length === 0 ? (
            <div className="py-8 text-center text-gray-500">No completed events yet</div>
          ) : (
            events.map((event) => (
              <CompletedEventItem
                key={event.id}
                event={event}
                onClick={() => onEventClick(event)}
              />
            ))
          )}
        </div>
      </DialogContent>
    </Dialog>
  )
}
