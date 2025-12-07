import { useState } from 'react'
import { Header } from '@/widgets/header'
import { SchoolList } from '@/widgets/school-list'
import { DirectorEventList } from '@/widgets/director-event-list'
import type { School } from '@/entities/school'
import type { DirectorEvent } from '@/entities/director-event'
import { toTeacher, type Teacher } from '@/entities/teacher'
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
import {
  useTeachers,
  useCreateTeacher,
  useUpdateTeacher,
  useDeleteTeacher,
  useEvents,
  useSchoolResults,
  useTeacherHistory,
} from '@/shared/api'
import { useAuthStore } from '@/shared/auth'

export function DirectorPanel() {
  const { user } = useAuthStore()

  // Fetch data from API
  const { data: teachersData, isLoading: isLoadingTeachers } = useTeachers()
  const { data: eventsData, isLoading: isLoadingEvents } = useEvents()

  // Mutations
  const createTeacherMutation = useCreateTeacher()
  const updateTeacherMutation = useUpdateTeacher()
  const deleteTeacherMutation = useDeleteTeacher()

  // Transform API data to UI format
  const teachers: Teacher[] = teachersData?.map((t) => toTeacher(t)) ?? []

  // Transform events to DirectorEvent format
  const events: DirectorEvent[] = eventsData?.map((e, index) => ({
    id: e.id,
    title: e.name,
    date: new Date(e.createdAt).toLocaleDateString('en-US', { month: 'long', day: 'numeric', year: 'numeric' }),
    participantCount: 0, // Will be fetched separately when viewing event
    status: e.isActive ? 'pending' : 'completed',
    iconType: (['clipboard', 'document', 'chart'] as const)[index % 3],
  })) ?? []

  // Create a mock school from the director's assigned school
  const directorSchool: School = {
    id: user?.schoolId ?? '',
    name: 'My School',
    teacherCount: teachers.length,
    studentCount: 0,
    iconColor: 'blue',
  }

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

  // Fetch school results when an event is selected
  const { data: schoolResultsData, isLoading: isLoadingResults } = useSchoolResults(
    selectedEvent?.id ?? ''
  )

  // Fetch teacher history when a participant is selected
  const { data: teacherHistoryData, isLoading: isLoadingHistory } = useTeacherHistory(
    selectedParticipant?.teacherId ?? ''
  )

  // Transform school results to participants
  const participants: EventParticipant[] = schoolResultsData?.teacherResults?.map((r) => ({
    id: r.teacherId,
    teacherId: r.teacherId,
    teacherName: r.teacherName,
    schoolName: 'My School',
    status: r.answeredQuestionsCount > 0 ? 'completed' : 'pending',
  })) ?? []

  // Transform teacher history to answers
  const teacherAnswers: TeacherAnswer[] = teacherHistoryData?.participationHistory
    ?.find((h) => h.eventId === selectedEvent?.id)
    ?.answers?.map((a, index) => ({
      id: String(index),
      questionId: a.questionId,
      questionText: a.questionText,
      answerText: a.answerText ?? a.selectedOption ?? '',
    })) ?? []

  // Combined loading state
  const isLoading = createTeacherMutation.isPending ||
    updateTeacherMutation.isPending ||
    deleteTeacherMutation.isPending

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
    setTeachersListOpen(false)
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

  // Form submission handlers
  const handleAddTeacherSubmit = async (data: CreateTeacherData) => {
    try {
      await createTeacherMutation.mutateAsync({
        name: data.name,
        email: data.email,
        password: data.password,
      })
      setAddTeacherOpen(false)
    } catch (error) {
      console.error('Failed to create teacher:', error)
    }
  }

  const handleUpdateTeacherSubmit = async (data: UpdateTeacherData) => {
    try {
      await updateTeacherMutation.mutateAsync({
        id: data.id,
        payload: {
          name: data.name,
          email: data.email,
        },
      })
      setUpdateTeacherOpen(false)
      setSelectedTeacher(null)
    } catch (error) {
      console.error('Failed to update teacher:', error)
    }
  }

  const handleDeleteTeacherConfirm = async (data: DeleteTeacherData) => {
    try {
      await deleteTeacherMutation.mutateAsync(data.id)
      setDeleteTeacherOpen(false)
      setSelectedTeacher(null)
    } catch (error) {
      console.error('Failed to delete teacher:', error)
    }
  }

  return (
    <div className="min-h-screen bg-stone-100">
      <Header
        title="Director Panel"
        showHistoryButton={false}
      />

      <main className="px-3 py-4 space-y-6">
        {isLoadingTeachers ? (
          <div className="flex justify-center py-8">
            <div className="text-gray-500">Loading...</div>
          </div>
        ) : (
          <SchoolList
            title="Schools"
            schools={[directorSchool]}
            onAddTeacher={handleAddTeacher}
            onViewTeachers={handleViewTeachers}
          />
        )}

        {isLoadingEvents ? (
          <div className="flex justify-center py-8">
            <div className="text-gray-500">Loading events...</div>
          </div>
        ) : (
          <DirectorEventList
            title="Recent Events"
            events={events}
            onEventClick={handleEventClick}
          />
        )}
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
        teachers={teachers}
        onTeacherClick={handleTeacherClick}
        isLoading={isLoadingTeachers}
      />

      <EventParticipantsModal
        open={eventParticipantsOpen}
        onOpenChange={setEventParticipantsOpen}
        eventName={selectedEvent?.title || ''}
        participants={participants}
        onParticipantClick={handleParticipantClick}
        isLoading={isLoadingResults}
      />

      {/* Level 2 Modals */}
      <TeacherDetailsModal
        open={teacherDetailsOpen}
        onOpenChange={setTeacherDetailsOpen}
        onBack={() => setTeachersListOpen(true)}
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
        answers={teacherAnswers}
        isLoading={isLoadingHistory}
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
