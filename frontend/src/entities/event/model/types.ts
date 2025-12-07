export type EventStatus = 'pending' | 'completed'

export interface TeacherEvent {
  id: string
  title: string
  date: string
  questionCount: number
  status: EventStatus
  color: 'lime' | 'blue' | 'purple' | 'orange'
}
