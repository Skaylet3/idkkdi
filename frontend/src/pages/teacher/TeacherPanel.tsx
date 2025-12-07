import { useState } from 'react'
import { Header } from '@/widgets/header'
import { WelcomeCard } from '@/widgets/welcome-card'
import { EventList } from '@/widgets/event-list'
import type { TeacherEvent, EventColor } from '@/entities/event'
import type { CompletedEvent } from '@/entities/completed-event'
import { QuestionType, type Question } from '@/entities/question'
import type { SurveyAnswer } from '@/entities/survey-answer'
import {
  EventHistoryModal,
  TeacherSurveyModal,
  QuestionFullTextModal,
  AnswerFullTextModal,
  EventDetailsModal,
  QuestionsFormModal,
  CongratulationsModal,
  type SubmitAnswersData,
} from '@/features/teacher'
import {
  useEvents,
  useEvent,
  useMyHistory,
  useMyAnswers,
  useSubmitAnswers,
  type SubmitAnswerPayload,
  type Answer,
} from '@/shared/api'
import { useAuthStore } from '@/shared/auth'

// Color rotation for events display
const EVENT_COLORS: EventColor[] = ['lime', 'blue', 'purple', 'orange']

export function TeacherPanel() {
  const { user } = useAuthStore()

  // Fetch data from API
  const { data: eventsData, isLoading: isLoadingEvents } = useEvents()
  const { data: historyData, isLoading: isLoadingHistory } = useMyHistory()

  // Mutations
  const submitAnswersMutation = useSubmitAnswers()

  // Modal states
  const [eventHistoryOpen, setEventHistoryOpen] = useState(false)
  const [teacherSurveyOpen, setTeacherSurveyOpen] = useState(false)
  const [questionFullTextOpen, setQuestionFullTextOpen] = useState(false)
  const [answerFullTextOpen, setAnswerFullTextOpen] = useState(false)
  const [eventDetailsOpen, setEventDetailsOpen] = useState(false)
  const [questionsFormOpen, setQuestionsFormOpen] = useState(false)
  const [congratulationsOpen, setCongratulationsOpen] = useState(false)

  // Selected items
  const [selectedEvent, setSelectedEvent] = useState<TeacherEvent | null>(null)
  const [selectedCompletedEvent, setSelectedCompletedEvent] = useState<CompletedEvent | null>(null)
  const [selectedAnswer, setSelectedAnswer] = useState<SurveyAnswer | null>(null)

  // Fetch event details when an event is selected (for pending events)
  const { data: eventDetailsData, isLoading: isLoadingEventDetails } = useEvent(
    selectedEvent?.id ?? ''
  )

  // Fetch event details for completed event (to get question texts)
  const { data: completedEventDetailsData, isLoading: isLoadingCompletedEventDetails } = useEvent(
    selectedCompletedEvent?.eventId ?? ''
  )

  // Fetch my answers when viewing a completed event
  const { data: myAnswersData, isLoading: isLoadingMyAnswers } = useMyAnswers(
    selectedCompletedEvent?.eventId ?? ''
  )

  // Create a Set of completed event IDs for quick lookup
  const completedEventIds = new Set(historyData?.map((h) => h.eventId) ?? [])

  // Transform API data to UI format
  const events: TeacherEvent[] = eventsData?.map((e, index) => ({
    id: e.id,
    title: e.name,
    date: new Date(e.createdAt).toLocaleDateString('en-US', { month: 'long', day: 'numeric', year: 'numeric' }),
    questionCount: 0, // Will be fetched with event details
    status: completedEventIds.has(e.id) ? 'completed' : 'pending',
    color: EVENT_COLORS[index % EVENT_COLORS.length],
  })) ?? []

  // Transform history to CompletedEvent format
  const completedEvents: CompletedEvent[] = historyData?.map((h) => ({
    id: h.eventId,
    eventId: h.eventId,
    eventName: h.eventName,
    completedAt: new Date(h.participatedAt).toLocaleDateString('en-US', { month: 'long', day: 'numeric', year: 'numeric' }),
    questionCount: h.totalQuestionsCount,
  })) ?? []

  // Transform event details to questions
  const questions: Question[] = eventDetailsData?.questions?.map((q: Question) => ({
    id: q.id,
    text: q.text,
    type: q.type as QuestionType,
    order: q.order,
    eventId: eventDetailsData.id,
  })) ?? []

  // Transform my answers to SurveyAnswer format by merging with question data
  const surveyAnswers: SurveyAnswer[] = (() => {
    if (!myAnswersData || !completedEventDetailsData?.questions) return []

    // Create a map of question data for quick lookup
    const questionMap = new Map<string, Question>(
      completedEventDetailsData.questions.map((q: Question) => [q.id, q])
    )

    return myAnswersData.map((a: Answer, index: number) => {
      const question = questionMap.get(a.questionId)
      return {
        id: String(index),
        questionId: a.questionId,
        questionText: question?.text ?? 'Unknown question',
        questionType: (question?.type ?? 'FREE_TEXT') as QuestionType,
        answerText: a.answerText,
        selectedOption: a.selectedOption,
      }
    })
  })()

  // Combined loading state for mutations
  const isMutating = submitAnswersMutation.isPending

  // Header history button handler
  const handleHistoryClick = () => {
    setEventHistoryOpen(true)
  }

  // Event card click handler (from main list)
  const handleEventClick = (event: TeacherEvent) => {
    setSelectedEvent(event)
    if (event.status === 'pending') {
      setEventDetailsOpen(true)
    }
    // Completed events don't open anything from main list - use History
  }

  // Event History Modal handlers
  const handleCompletedEventClick = (completedEvent: CompletedEvent) => {
    setSelectedCompletedEvent(completedEvent)
    setEventHistoryOpen(false)
    setTeacherSurveyOpen(true)
  }

  // Teacher Survey Modal handlers
  const handleQuestionClick = (answer: SurveyAnswer) => {
    setSelectedAnswer(answer)
    setTeacherSurveyOpen(false)
    setQuestionFullTextOpen(true)
  }

  const handleAnswerClick = (answer: SurveyAnswer) => {
    setSelectedAnswer(answer)
    setTeacherSurveyOpen(false)
    setAnswerFullTextOpen(true)
  }

  // Event Details Modal handlers
  const handleStartQuestionnaire = () => {
    setEventDetailsOpen(false)
    setQuestionsFormOpen(true)
  }

  // Questions Form Modal handlers
  const handleSubmitAnswers = async (data: SubmitAnswersData) => {
    try {
      await submitAnswersMutation.mutateAsync({
        eventId: data.eventId,
        answers: data.answers.map((a) => ({
          questionId: a.questionId,
          answerText: a.answerText,
          // Cast selectedOption to API type (UI uses string, API expects MultipleChoiceOption)
          selectedOption: a.selectedOption as SubmitAnswerPayload['selectedOption'],
        })),
      })
    } catch (error) {
      console.error('Failed to submit answers:', error)
    }
  }

  const handleQuestionnaireComplete = () => {
    setQuestionsFormOpen(false)
    setCongratulationsOpen(true)
  }

  // Congratulations Modal handlers
  const handleGoToHub = () => {
    setCongratulationsOpen(false)
    setSelectedEvent(null)
  }

  // Get display answer for full text modal
  const getDisplayAnswer = (answer: SurveyAnswer | null) => {
    if (!answer) return ''
    return answer.answerText || answer.selectedOption || ''
  }

  // Get user name for welcome card (extract from email or use default)
  const userName = user?.email?.split('@')[0] ?? 'Teacher'

  return (
    <div className="min-h-screen bg-stone-100">
      <Header
        title="Teacher Panel"
        onHistoryClick={handleHistoryClick}
      />

      <main className="px-3 py-4 space-y-6">
        <WelcomeCard
          userName={userName}
          avatarUrl="https://images.unsplash.com/photo-1494790108377-be9c29b29330?w=120&h=120&fit=crop&crop=face"
        />

        {isLoadingEvents ? (
          <div className="flex justify-center py-8">
            <div className="text-gray-500">Loading events...</div>
          </div>
        ) : (
          <EventList
            title="Recent Events (Last 7 Days)"
            events={events}
            onEventClick={handleEventClick}
          />
        )}
      </main>

      {/* Level 1 Modals */}
      <EventHistoryModal
        open={eventHistoryOpen}
        onOpenChange={setEventHistoryOpen}
        events={completedEvents}
        onEventClick={handleCompletedEventClick}
        isLoading={isLoadingHistory}
      />

      <EventDetailsModal
        open={eventDetailsOpen}
        onOpenChange={(open) => {
          setEventDetailsOpen(open)
          if (!open) setSelectedEvent(null)
        }}
        eventName={selectedEvent?.title || ''}
        questions={questions}
        onStartQuestionnaire={handleStartQuestionnaire}
        isLoading={isLoadingEventDetails}
      />

      {/* Level 2 Modals */}
      <TeacherSurveyModal
        open={teacherSurveyOpen}
        onOpenChange={(open) => {
          setTeacherSurveyOpen(open)
          if (!open) setSelectedCompletedEvent(null)
        }}
        eventName={selectedCompletedEvent?.eventName || ''}
        answers={surveyAnswers}
        onQuestionClick={handleQuestionClick}
        onAnswerClick={handleAnswerClick}
        isLoading={isLoadingMyAnswers || isLoadingCompletedEventDetails}
      />

      <QuestionsFormModal
        open={questionsFormOpen}
        onOpenChange={(open) => {
          setQuestionsFormOpen(open)
          if (!open) setSelectedEvent(null)
        }}
        eventId={selectedEvent?.id || ''}
        questions={questions}
        onSubmit={handleSubmitAnswers}
        onComplete={handleQuestionnaireComplete}
        isLoading={isMutating}
      />

      {/* Level 3 Modals */}
      <QuestionFullTextModal
        open={questionFullTextOpen}
        onOpenChange={(open) => {
          setQuestionFullTextOpen(open)
          if (!open) setSelectedAnswer(null)
        }}
        onBack={() => setTeacherSurveyOpen(true)}
        questionText={selectedAnswer?.questionText || ''}
      />

      <AnswerFullTextModal
        open={answerFullTextOpen}
        onOpenChange={(open) => {
          setAnswerFullTextOpen(open)
          if (!open) setSelectedAnswer(null)
        }}
        onBack={() => setTeacherSurveyOpen(true)}
        answerText={getDisplayAnswer(selectedAnswer)}
      />

      {/* Success Modal */}
      <CongratulationsModal
        open={congratulationsOpen}
        onOpenChange={setCongratulationsOpen}
        onGoToHub={handleGoToHub}
      />
    </div>
  )
}
