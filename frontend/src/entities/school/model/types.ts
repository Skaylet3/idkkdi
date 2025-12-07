export type SchoolIconColor = 'blue' | 'purple' | 'green' | 'orange'

export interface School {
  id: string
  name: string
  teacherCount: number
  studentCount: number
  iconColor: SchoolIconColor
}
