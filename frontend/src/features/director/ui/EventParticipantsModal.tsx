import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
} from '@/shared/ui'
import { ParticipantListItem, type EventParticipant } from '@/entities/event-participant'

interface EventParticipantsModalProps {
  open: boolean
  onOpenChange: (open: boolean) => void
  eventName: string
  participants: EventParticipant[]
  onParticipantClick: (participant: EventParticipant) => void
  isLoading?: boolean
}

export function EventParticipantsModal({
  open,
  onOpenChange,
  eventName,
  participants,
  onParticipantClick,
  isLoading = false,
}: EventParticipantsModalProps) {
  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogContent className="w-[calc(100%-2rem)] sm:max-w-md rounded-2xl">
        <DialogHeader>
          <DialogTitle className="text-xl font-semibold text-gray-800">
            Event Participants
          </DialogTitle>
        </DialogHeader>

        <p className="text-gray-600 text-sm">{eventName}</p>

        <div className="space-y-2 max-h-[400px] overflow-y-auto">
          {isLoading ? (
            <div className="py-8 text-center text-gray-500">Loading...</div>
          ) : participants.length === 0 ? (
            <div className="py-8 text-center text-gray-500">No participants yet</div>
          ) : (
            participants.map((participant) => (
              <ParticipantListItem
                key={participant.id}
                participant={participant}
                onClick={() => onParticipantClick(participant)}
              />
            ))
          )}
        </div>
      </DialogContent>
    </Dialog>
  )
}
