import { useState } from 'react'
import { Header } from '@/widgets/header'
import { AdminSchoolList } from '@/widgets/admin-school-list'
import type { AdminSchool } from '@/entities/admin-school'
import {
  CreateSchoolModal,
  CreateEventModal,
  UpdateSchoolModal,
  DeleteSchoolModal,
  AddDirectorModal,
  type CreateSchoolData,
  type CreateEventData,
  type UpdateSchoolData,
  type DeleteSchoolData,
  type CreateDirectorData,
} from '@/features/admin'

const mockSchools: AdminSchool[] = [
  {
    id: '1',
    name: 'Lincoln Elementary School',
    address: '123 Main Street, Springfield',
  },
  {
    id: '2',
    name: 'Washington High School',
    address: '456 Oak Avenue, Springfield',
  },
]

export function AdminPanel() {
  // Modal states
  const [createSchoolOpen, setCreateSchoolOpen] = useState(false)
  const [createEventOpen, setCreateEventOpen] = useState(false)
  const [updateSchoolOpen, setUpdateSchoolOpen] = useState(false)
  const [deleteSchoolOpen, setDeleteSchoolOpen] = useState(false)
  const [addDirectorOpen, setAddDirectorOpen] = useState(false)

  // Selected school for update/delete/add director
  const [selectedSchool, setSelectedSchool] = useState<AdminSchool | null>(null)

  // Loading states (for future API integration)
  const [isLoading, setIsLoading] = useState(false)

  // Handlers to open modals
  const handleAddSchool = () => {
    setCreateSchoolOpen(true)
  }

  const handleCreateEvent = () => {
    setCreateEventOpen(true)
  }

  const handleUpdateSchool = (school: AdminSchool) => {
    setSelectedSchool(school)
    setUpdateSchoolOpen(true)
  }

  const handleDeleteSchool = (school: AdminSchool) => {
    setSelectedSchool(school)
    setDeleteSchoolOpen(true)
  }

  const handleAddDirector = (school: AdminSchool) => {
    setSelectedSchool(school)
    setAddDirectorOpen(true)
  }

  // Form submission handlers (ready for API hooks)
  const handleCreateSchoolSubmit = async (data: CreateSchoolData) => {
    setIsLoading(true)
    try {
      // TODO: Call API hook here
      console.log('Create school:', data)
      setCreateSchoolOpen(false)
    } finally {
      setIsLoading(false)
    }
  }

  const handleCreateEventSubmit = async (data: CreateEventData) => {
    setIsLoading(true)
    try {
      // TODO: Call API hook here
      console.log('Create event:', data)
      setCreateEventOpen(false)
    } finally {
      setIsLoading(false)
    }
  }

  const handleUpdateSchoolSubmit = async (data: UpdateSchoolData) => {
    setIsLoading(true)
    try {
      // TODO: Call API hook here
      console.log('Update school:', data)
      setUpdateSchoolOpen(false)
      setSelectedSchool(null)
    } finally {
      setIsLoading(false)
    }
  }

  const handleDeleteSchoolConfirm = async (data: DeleteSchoolData) => {
    setIsLoading(true)
    try {
      // TODO: Call API hook here
      console.log('Delete school:', data)
      setDeleteSchoolOpen(false)
      setSelectedSchool(null)
    } finally {
      setIsLoading(false)
    }
  }

  const handleAddDirectorSubmit = async (data: CreateDirectorData) => {
    setIsLoading(true)
    try {
      // TODO: Call API hook here
      console.log('Add director:', data)
      setAddDirectorOpen(false)
      setSelectedSchool(null)
    } finally {
      setIsLoading(false)
    }
  }

  return (
    <div className="min-h-screen bg-stone-100">
      <Header
        title="Admin Panel"
        showHistoryButton={false}
      />

      <main className="px-3 py-4">
        <AdminSchoolList
          schools={mockSchools}
          onAddSchool={handleAddSchool}
          onCreateEvent={handleCreateEvent}
          onUpdateSchool={handleUpdateSchool}
          onDeleteSchool={handleDeleteSchool}
          onAddDirector={handleAddDirector}
        />
      </main>

      {/* Modals */}
      <CreateSchoolModal
        open={createSchoolOpen}
        onOpenChange={setCreateSchoolOpen}
        onSubmit={handleCreateSchoolSubmit}
        isLoading={isLoading}
      />

      <CreateEventModal
        open={createEventOpen}
        onOpenChange={setCreateEventOpen}
        onSubmit={handleCreateEventSubmit}
        isLoading={isLoading}
      />

      <UpdateSchoolModal
        open={updateSchoolOpen}
        onOpenChange={(open) => {
          setUpdateSchoolOpen(open)
          if (!open) setSelectedSchool(null)
        }}
        onSubmit={handleUpdateSchoolSubmit}
        school={selectedSchool}
        isLoading={isLoading}
      />

      <DeleteSchoolModal
        open={deleteSchoolOpen}
        onOpenChange={(open) => {
          setDeleteSchoolOpen(open)
          if (!open) setSelectedSchool(null)
        }}
        onConfirm={handleDeleteSchoolConfirm}
        school={selectedSchool}
        isLoading={isLoading}
      />

      <AddDirectorModal
        open={addDirectorOpen}
        onOpenChange={(open) => {
          setAddDirectorOpen(open)
          if (!open) setSelectedSchool(null)
        }}
        onSubmit={handleAddDirectorSubmit}
        schools={mockSchools}
        isLoading={isLoading}
      />
    </div>
  )
}
