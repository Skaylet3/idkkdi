import { Header } from '@/widgets/header'
import { WelcomeCard } from '@/widgets/welcome-card'
import { EventList } from '@/widgets/event-list'
import type { TeacherEvent } from '@/entities/event'

const mockEvents: TeacherEvent[] = [
  {
    id: '1',
    title: 'Professional Development Workshop',
    date: 'Today',
    questionCount: 5,
    status: 'pending',
    color: 'lime',
  },
  {
    id: '2',
    title: 'Teaching Methods Survey',
    date: 'Yesterday',
    questionCount: 7,
    status: 'completed',
    color: 'blue',
  },
  {
    id: '3',
    title: 'Student Engagement Assessment',
    date: '2 days ago',
    questionCount: 4,
    status: 'pending',
    color: 'purple',
  },
  {
    id: '4',
    title: 'Classroom Innovation Ideas',
    date: '3 days ago',
    questionCount: 6,
    status: 'completed',
    color: 'orange',
  },
]

export function TeacherPanel() {
  const handleHistoryClick = () => {
    // Navigate to history page
    console.log('History clicked')
  }

  const handleEventClick = (event: TeacherEvent) => {
    // Navigate to event detail or questionnaire
    console.log('Event clicked:', event)
  }

  return (
    <div className="min-h-screen bg-stone-100">
      <Header
        title="Teacher Panel"
        onHistoryClick={handleHistoryClick}
      />

      <main className="px-3 py-4 space-y-6">
        <WelcomeCard
          userName="Sarah"
          avatarUrl="https://images.unsplash.com/photo-1494790108377-be9c29b29330?w=120&h=120&fit=crop&crop=face"
        />

        <EventList
          title="Recent Events (Last 7 Days)"
          events={mockEvents}
          onEventClick={handleEventClick}
        />
      </main>
    </div>
  )
}
