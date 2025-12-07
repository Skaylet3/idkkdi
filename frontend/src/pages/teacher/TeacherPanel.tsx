import { useState } from 'react'
import { Header } from '@/widgets/header'
import { WelcomeCard } from '@/widgets/welcome-card'
import { EventList } from '@/widgets/event-list'
import type { TeacherEvent } from '@/entities/event'
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

const mockCompletedEvents: CompletedEvent[] = [
  {
    id: '1',
    eventId: '2',
    eventName: 'Teaching Methods Survey',
    completedAt: 'March 10, 2024',
  },
  {
    id: '2',
    eventId: '4',
    eventName: 'Classroom Innovation Ideas',
    completedAt: 'March 5, 2024',
  },
]

const mockQuestions: Question[] = [
  {
    id: '1',
    text: 'How do you engage students in your classroom?',
    type: QuestionType.MULTIPLE_CHOICE,
    order: 1,
    eventId: '1',
  },
  {
    id: '2',
    text: 'What teaching methods do you find most effective?',
    type: QuestionType.MULTIPLE_CHOICE,
    order: 2,
    eventId: '1',
  },
  {
    id: '3',
    text: 'How often do you use technology in your lessons?',
    type: QuestionType.MULTIPLE_CHOICE,
    order: 3,
    eventId: '1',
  },
]

const mockSurveyAnswers: SurveyAnswer[] = [
  {
    id: '1',
    questionId: '1',
    questionText: 'What teaching methods do you find most effective?',
    questionType: QuestionType.FREE_TEXT,
    answerText: 'I use blended learning combining traditional instruction with digital tools.',
  },
  {
    id: '2',
    questionId: '2',
    questionText: 'How often do you use technology?',
    questionType: QuestionType.MULTIPLE_CHOICE,
    selectedOption: '70/30',
  },
]

export function TeacherPanel() {
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

  // Loading states (for future API integration)
  const [isLoading, setIsLoading] = useState(false)

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
    setIsLoading(true)
    try {
      // TODO: Call API hook here
      console.log('Submit answers:', data)
    } finally {
      setIsLoading(false)
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

      {/* Level 1 Modals */}
      <EventHistoryModal
        open={eventHistoryOpen}
        onOpenChange={setEventHistoryOpen}
        events={mockCompletedEvents}
        onEventClick={handleCompletedEventClick}
        isLoading={isLoading}
      />

      <EventDetailsModal
        open={eventDetailsOpen}
        onOpenChange={(open) => {
          setEventDetailsOpen(open)
          if (!open) setSelectedEvent(null)
        }}
        eventName={selectedEvent?.title || ''}
        questions={mockQuestions}
        onStartQuestionnaire={handleStartQuestionnaire}
        isLoading={isLoading}
      />

      {/* Level 2 Modals */}
      <TeacherSurveyModal
        open={teacherSurveyOpen}
        onOpenChange={(open) => {
          setTeacherSurveyOpen(open)
          if (!open) setSelectedCompletedEvent(null)
        }}
        eventName={selectedCompletedEvent?.eventName || ''}
        answers={mockSurveyAnswers}
        onQuestionClick={handleQuestionClick}
        onAnswerClick={handleAnswerClick}
        isLoading={isLoading}
      />

      <QuestionsFormModal
        open={questionsFormOpen}
        onOpenChange={(open) => {
          setQuestionsFormOpen(open)
          if (!open) setSelectedEvent(null)
        }}
        eventId={selectedEvent?.id || ''}
        questions={mockQuestions}
        onSubmit={handleSubmitAnswers}
        onComplete={handleQuestionnaireComplete}
        isLoading={isLoading}
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
