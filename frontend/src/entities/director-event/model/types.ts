export type DirectorEventIconType = 'clipboard' | 'document' | 'chart'

export interface DirectorEvent {
  id: string
  title: string
  date: string
  participantCount: number
  status: 'completed' | 'pending'
  iconType: DirectorEventIconType
}
