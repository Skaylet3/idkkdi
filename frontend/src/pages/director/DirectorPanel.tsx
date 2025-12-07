import { useState } from 'react'
import { Header } from '@/widgets/header'
import { SchoolList } from '@/widgets/school-list'
import { DirectorEventList } from '@/widgets/director-event-list'
import type { School } from '@/entities/school'
import type { DirectorEvent } from '@/entities/director-event'
import type { Teacher } from '@/entities/teacher'
import type { EventParticipant } from '@/entities/event-participant'
import type { TeacherAnswer } from '@/entities/teacher-answer'
import {
  AddTeacherModal,
  TeachersListModal,
  TeacherDetailsModal,
  UpdateTeacherModal,
  DeleteTeacherModal,
  EventParticipantsModal,
  TeacherAnswersModal,
  type CreateTeacherData,
  type UpdateTeacherData,
  type DeleteTeacherData,
} from '@/features/director'

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

const mockTeachers: Teacher[] = [
  {
    id: '1',
    name: 'Sarah Johnson',
    email: 'sarah.johnson@school.com',
    schoolId: '1',
    schoolName: 'Lincoln High School',
    subject: 'Math Teacher',
  },
  {
    id: '2',
    name: 'Michael Chen',
    email: 'michael.chen@school.com',
    schoolId: '1',
    schoolName: 'Lincoln High School',
    subject: 'Science Teacher',
  },
  {
    id: '3',
    name: 'Emily Rodriguez',
    email: 'emily.rodriguez@school.com',
    schoolId: '1',
    schoolName: 'Lincoln High School',
    subject: 'English Teacher',
  },
]

const mockParticipants: EventParticipant[] = [
  {
    id: '1',
    teacherId: '1',
    teacherName: 'Sarah Johnson',
    schoolName: 'Lincoln High School',
    status: 'completed',
  },
  {
    id: '2',
    teacherId: '2',
    teacherName: 'Michael Chen',
    schoolName: 'Washington Academy',
    status: 'completed',
  },
  {
    id: '3',
    teacherId: '3',
    teacherName: 'Emily Rodriguez',
    schoolName: 'Lincoln High School',
    status: 'completed',
  },
]

const mockAnswers: TeacherAnswer[] = [
  {
    id: '1',
    questionId: '1',
    questionText: 'How do you engage students in your classroom?',
    answerText: 'I use interactive activities, group discussions, and real-world examples to keep students engaged and motivated throughout the lesson.',
  },
  {
    id: '2',
    questionId: '2',
    questionText: 'What teaching methods do you find most effective?',
    answerText: 'Blended learning combining traditional instruction with digital tools has proven most effective in my experience.',
  },
  {
    id: '3',
    questionId: '3',
    questionText: 'How do you assess student progress?',
    answerText: 'I use a combination of formative assessments, project-based evaluations, and regular feedback sessions to track student growth.',
  },
]

export function DirectorPanel() {
  // Modal states
  const [addTeacherOpen, setAddTeacherOpen] = useState(false)
  const [teachersListOpen, setTeachersListOpen] = useState(false)
  const [teacherDetailsOpen, setTeacherDetailsOpen] = useState(false)
  const [updateTeacherOpen, setUpdateTeacherOpen] = useState(false)
  const [deleteTeacherOpen, setDeleteTeacherOpen] = useState(false)
  const [eventParticipantsOpen, setEventParticipantsOpen] = useState(false)
  const [teacherAnswersOpen, setTeacherAnswersOpen] = useState(false)

  // Selected items
  const [selectedSchool, setSelectedSchool] = useState<School | null>(null)
  const [selectedTeacher, setSelectedTeacher] = useState<Teacher | null>(null)
  const [selectedEvent, setSelectedEvent] = useState<DirectorEvent | null>(null)
  const [selectedParticipant, setSelectedParticipant] = useState<EventParticipant | null>(null)

  // Loading states (for future API integration)
  const [isLoading, setIsLoading] = useState(false)

  // School handlers
  const handleAddTeacher = (school: School) => {
    setSelectedSchool(school)
    setAddTeacherOpen(true)
  }

  const handleViewTeachers = (school: School) => {
    setSelectedSchool(school)
    setTeachersListOpen(true)
  }

  // Teacher list handlers
  const handleTeacherClick = (teacher: Teacher) => {
    setSelectedTeacher(teacher)
    setTeacherDetailsOpen(true)
  }

  // Teacher details handlers
  const handleUpdateTeacherClick = () => {
    setTeacherDetailsOpen(false)
    setUpdateTeacherOpen(true)
  }

  const handleDeleteTeacherClick = () => {
    setTeacherDetailsOpen(false)
    setDeleteTeacherOpen(true)
  }

  // Event handlers
  const handleEventClick = (event: DirectorEvent) => {
    setSelectedEvent(event)
    setEventParticipantsOpen(true)
  }

  // Participant handlers
  const handleParticipantClick = (participant: EventParticipant) => {
    setSelectedParticipant(participant)
    setTeacherAnswersOpen(true)
  }

  // Form submission handlers (ready for API hooks)
  const handleAddTeacherSubmit = async (data: CreateTeacherData) => {
    setIsLoading(true)
    try {
      // TODO: Call API hook here
      console.log('Create teacher:', data)
      setAddTeacherOpen(false)
    } finally {
      setIsLoading(false)
    }
  }

  const handleUpdateTeacherSubmit = async (data: UpdateTeacherData) => {
    setIsLoading(true)
    try {
      // TODO: Call API hook here
      console.log('Update teacher:', data)
      setUpdateTeacherOpen(false)
      setSelectedTeacher(null)
    } finally {
      setIsLoading(false)
    }
  }

  const handleDeleteTeacherConfirm = async (data: DeleteTeacherData) => {
    setIsLoading(true)
    try {
      // TODO: Call API hook here
      console.log('Delete teacher:', data)
      setDeleteTeacherOpen(false)
      setSelectedTeacher(null)
    } finally {
      setIsLoading(false)
    }
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

      {/* Level 1 Modals */}
      <AddTeacherModal
        open={addTeacherOpen}
        onOpenChange={setAddTeacherOpen}
        onSubmit={handleAddTeacherSubmit}
        schoolId={selectedSchool?.id || ''}
        schoolName={selectedSchool?.name || ''}
        isLoading={isLoading}
      />

      <TeachersListModal
        open={teachersListOpen}
        onOpenChange={setTeachersListOpen}
        schoolName={selectedSchool?.name || ''}
        teachers={mockTeachers}
        onTeacherClick={handleTeacherClick}
        isLoading={isLoading}
      />

      <EventParticipantsModal
        open={eventParticipantsOpen}
        onOpenChange={setEventParticipantsOpen}
        eventName={selectedEvent?.title || ''}
        participants={mockParticipants}
        onParticipantClick={handleParticipantClick}
        isLoading={isLoading}
      />

      {/* Level 2 Modals */}
      <TeacherDetailsModal
        open={teacherDetailsOpen}
        onOpenChange={(open) => {
          setTeacherDetailsOpen(open)
          if (!open) setSelectedTeacher(null)
        }}
        teacher={selectedTeacher}
        onUpdate={handleUpdateTeacherClick}
        onDelete={handleDeleteTeacherClick}
      />

      <TeacherAnswersModal
        open={teacherAnswersOpen}
        onOpenChange={(open) => {
          setTeacherAnswersOpen(open)
          if (!open) setSelectedParticipant(null)
        }}
        teacherName={selectedParticipant?.teacherName}
        answers={mockAnswers}
        isLoading={isLoading}
      />

      {/* Level 3 Modals */}
      <UpdateTeacherModal
        open={updateTeacherOpen}
        onOpenChange={(open) => {
          setUpdateTeacherOpen(open)
          if (!open) setSelectedTeacher(null)
        }}
        onSubmit={handleUpdateTeacherSubmit}
        teacher={selectedTeacher}
        isLoading={isLoading}
      />

      <DeleteTeacherModal
        open={deleteTeacherOpen}
        onOpenChange={(open) => {
          setDeleteTeacherOpen(open)
          if (!open) setSelectedTeacher(null)
        }}
        onConfirm={handleDeleteTeacherConfirm}
        teacher={selectedTeacher}
        isLoading={isLoading}
      />
    </div>
  )
}
