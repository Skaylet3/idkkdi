import { Header } from '@/widgets/header'
import { SchoolList } from '@/widgets/school-list'
import { DirectorEventList } from '@/widgets/director-event-list'
import type { School } from '@/entities/school'
import type { DirectorEvent } from '@/entities/director-event'

const mockSchools: School[] = [
  {
    id: '1',
    name: 'Lincoln High School',
    teacherCount: 245,
    studentCount: 2450,
    iconColor: 'blue',
  },
  {
    id: '2',
    name: 'Washington Academy',
    teacherCount: 180,
    studentCount: 1800,
    iconColor: 'purple',
  },
  {
    id: '3',
    name: 'Jefferson Elementary',
    teacherCount: 95,
    studentCount: 950,
    iconColor: 'green',
  },
]

const mockEvents: DirectorEvent[] = [
  {
    id: '1',
    title: 'Professional Development Workshop',
    date: 'March 15, 2024',
    participantCount: 42,
    status: 'completed',
    iconType: 'clipboard',
  },
  {
    id: '2',
    title: 'Teaching Methods Survey',
    date: 'March 10, 2024',
    participantCount: 38,
    status: 'completed',
    iconType: 'document',
  },
  {
    id: '3',
    title: 'Student Engagement Assessment',
    date: 'March 5, 2024',
    participantCount: 51,
    status: 'completed',
    iconType: 'chart',
  },
]

export function DirectorPanel() {
  const handleAddTeacher = (school: School) => {
    console.log('Add teacher to:', school.name)
  }

  const handleViewTeachers = (school: School) => {
    console.log('View teachers of:', school.name)
  }

  const handleEventClick = (event: DirectorEvent) => {
    console.log('Event clicked:', event.title)
  }

  return (
    <div className="min-h-screen bg-stone-100">
      <Header
        title="Director Panel"
        showHistoryButton={false}
      />

      <main className="px-3 py-4 space-y-6">
        <SchoolList
          title="Schools"
          schools={mockSchools}
          onAddTeacher={handleAddTeacher}
          onViewTeachers={handleViewTeachers}
        />

        <DirectorEventList
          title="Recent Events"
          events={mockEvents}
          onEventClick={handleEventClick}
        />
      </main>
    </div>
  )
}