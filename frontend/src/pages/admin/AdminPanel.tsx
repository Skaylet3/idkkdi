import { useState } from 'react'
import { Header } from '@/widgets/header'
import { AdminSchoolList } from '@/widgets/admin-school-list'
import { toAdminSchool, type AdminSchool } from '@/entities/admin-school'
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
import {
  useSchools,
  useCreateSchool,
  useUpdateSchool,
  useDeleteSchool,
  useCreateDirector,
  useCreateEvent,
} from '@/shared/api'

export function AdminPanel() {
  // Fetch schools from API
  const { data: schoolsData, isLoading: isLoadingSchools } = useSchools()

  // Mutations
  const createSchoolMutation = useCreateSchool()
  const updateSchoolMutation = useUpdateSchool()
  const deleteSchoolMutation = useDeleteSchool()
  const createDirectorMutation = useCreateDirector()
  const createEventMutation = useCreateEvent()

  // Transform API data to UI format
  const schools: AdminSchool[] = schoolsData?.map(toAdminSchool) ?? []

  // Modal states
  const [createSchoolOpen, setCreateSchoolOpen] = useState(false)
  const [createEventOpen, setCreateEventOpen] = useState(false)
  const [updateSchoolOpen, setUpdateSchoolOpen] = useState(false)
  const [deleteSchoolOpen, setDeleteSchoolOpen] = useState(false)
  const [addDirectorOpen, setAddDirectorOpen] = useState(false)

  // Selected school for update/delete/add director
  const [selectedSchool, setSelectedSchool] = useState<AdminSchool | null>(null)

  // Combined loading state
  const isLoading = createSchoolMutation.isPending ||
    updateSchoolMutation.isPending ||
    deleteSchoolMutation.isPending ||
    createDirectorMutation.isPending ||
    createEventMutation.isPending

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

  // Form submission handlers
  const handleCreateSchoolSubmit = async (data: CreateSchoolData) => {
    try {
      await createSchoolMutation.mutateAsync({
        name: data.name,
        address: data.address,
      })
      setCreateSchoolOpen(false)
    } catch (error) {
      console.error('Failed to create school:', error)
    }
  }

  const handleCreateEventSubmit = async (data: CreateEventData) => {
    try {
      await createEventMutation.mutateAsync({
        name: data.name,
        description: data.description,
        isActive: data.isActive,
        questions: data.questions.map((q, index) => ({
          text: q.text,
          type: q.type,
          order: index + 1,
        })),
      })
      setCreateEventOpen(false)
    } catch (error) {
      console.error('Failed to create event:', error)
    }
  }

  const handleUpdateSchoolSubmit = async (data: UpdateSchoolData) => {
    try {
      await updateSchoolMutation.mutateAsync({
        id: data.id,
        payload: {
          name: data.name,
          address: data.address,
        },
      })
      setUpdateSchoolOpen(false)
      setSelectedSchool(null)
    } catch (error) {
      console.error('Failed to update school:', error)
    }
  }

  const handleDeleteSchoolConfirm = async (data: DeleteSchoolData) => {
    try {
      await deleteSchoolMutation.mutateAsync(data.id)
      setDeleteSchoolOpen(false)
      setSelectedSchool(null)
    } catch (error) {
      console.error('Failed to delete school:', error)
    }
  }

  const handleAddDirectorSubmit = async (data: CreateDirectorData) => {
    try {
      await createDirectorMutation.mutateAsync({
        email: data.email,
        password: data.password,
        name: data.name,
        schoolId: data.schoolId,
      })
      setAddDirectorOpen(false)
      setSelectedSchool(null)
    } catch (error) {
      console.error('Failed to add director:', error)
    }
  }

  return (
    <div className="min-h-screen bg-stone-100">
      <Header
        title="Admin Panel"
        showHistoryButton={false}
      />

      <main className="px-3 py-4">
        {isLoadingSchools ? (
          <div className="flex justify-center py-8">
            <div className="text-gray-500">Loading schools...</div>
          </div>
        ) : (
          <AdminSchoolList
            schools={schools}
            onAddSchool={handleAddSchool}
            onCreateEvent={handleCreateEvent}
            onUpdateSchool={handleUpdateSchool}
            onDeleteSchool={handleDeleteSchool}
            onAddDirector={handleAddDirector}
          />
        )}
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
        school={selectedSchool}
        isLoading={isLoading}
      />
    </div>
  )
}
