export interface TeacherSchool {
  id: string
  userId: string
  schoolId: string
  createdAt: string
}

export interface TeacherSchoolWithRelations extends TeacherSchool {
  user: {
    id: string
    email: string
    name: string
  }
  school: {
    id: string
    name: string
    address?: string
  }
}
