export interface EventParticipant {
  id: string
  teacherId: string
  teacherName: string
  schoolName: string
  avatarUrl?: string
  status: 'completed' | 'pending'
}
