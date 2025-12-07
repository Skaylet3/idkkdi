import { Header } from '@/widgets/header'
import { AdminSchoolList } from '@/widgets/admin-school-list'
import type { AdminSchool } from '@/entities/admin-school'

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
  const handleAddSchool = () => {
    console.log('Add school clicked')
  }

  const handleCreateEvent = () => {
    console.log('Create event clicked')
  }

  const handleUpdateSchool = (school: AdminSchool) => {
    console.log('Update school:', school.name)
  }

  const handleDeleteSchool = (school: AdminSchool) => {
    console.log('Delete school:', school.name)
  }

  const handleAddDirector = (school: AdminSchool) => {
    console.log('Add director to:', school.name)
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
    </div>
  )
}
