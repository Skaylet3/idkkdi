export interface DirectorSchool {
  id: string
  userId: string
  schoolId: string
  createdAt: string
}

export interface DirectorSchoolWithRelations extends DirectorSchool {
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
