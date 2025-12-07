// Backend School entity (matches Prisma schema)
export interface School {
  id: string
  name: string
  address?: string
  adminId: string
  createdAt: string
  updatedAt: string
}

export interface CreateSchoolPayload {
  name: string
  address?: string
}

export interface UpdateSchoolPayload {
  name?: string
  address?: string
}

// UI-specific type (alias for backwards compatibility)
export interface AdminSchool {
  id: string
  name: string
  address: string
}

// Helper to transform backend School to UI AdminSchool
export function toAdminSchool(school: School): AdminSchool {
  return {
    id: school.id,
    name: school.name,
    address: school.address ?? '',
  }
}
