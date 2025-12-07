import { DirectorEventCard, type DirectorEvent } from '@/entities/director-event'

interface DirectorEventListProps {
  title: string
  events: DirectorEvent[]
  onEventClick?: (event: DirectorEvent) => void
}

export function DirectorEventList({ title, events, onEventClick }: DirectorEventListProps) {
  return (
    <section className="space-y-4">
      <h2 className="text-gray-800 text-xl font-bold leading-7">
        {title}
      </h2>
      <div className="space-y-4">
        {events.map((event) => (
          <DirectorEventCard
            key={event.id}
            event={event}
            onClick={() => onEventClick?.(event)}
          />
        ))}
      </div>
    </section>
  )
}
