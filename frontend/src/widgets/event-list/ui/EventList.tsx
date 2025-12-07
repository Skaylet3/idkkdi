import { EventCard, type TeacherEvent } from '@/entities/event'

interface EventListProps {
  title: string
  events: TeacherEvent[]
  onEventClick?: (event: TeacherEvent) => void
}

export function EventList({ title, events, onEventClick }: EventListProps) {
  return (
    <section className="space-y-4">
      <h2 className="text-gray-800 text-xl font-bold leading-7">
        {title}
      </h2>
      <div className="space-y-4">
        {events.map((event) => (
          <EventCard
            key={event.id}
            event={event}
            onClick={() => onEventClick?.(event)}
          />
        ))}
      </div>
    </section>
  )
}
