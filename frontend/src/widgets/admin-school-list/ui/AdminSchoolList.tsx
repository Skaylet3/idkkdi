import { AdminSchoolCard, type AdminSchool } from '@/entities/admin-school'
import { Button } from '@/shared/ui'
import { Plus, Calendar } from 'lucide-react'

interface AdminSchoolListProps {
  schools: AdminSchool[]
  onAddSchool?: () => void
  onCreateEvent?: () => void
  onUpdateSchool?: (school: AdminSchool) => void
  onDeleteSchool?: (school: AdminSchool) => void
  onAddDirector?: (school: AdminSchool) => void
}

export function AdminSchoolList({
  schools,
  onAddSchool,
  onCreateEvent,
  onUpdateSchool,
  onDeleteSchool,
  onAddDirector,
}: AdminSchoolListProps) {
  return (
    <section className="space-y-4">
      <div className="flex items-center justify-between">
        <h2 className="text-gray-800 text-xl font-bold leading-7">
          Schools<br />Management
        </h2>
        <Button
          size="sm"
          className="bg-green-500 hover:bg-green-600 text-white rounded-lg px-4 h-9 text-sm font-medium gap-1.5"
          onClick={onAddSchool}
        >
          <Plus className="w-4 h-4" />
          Add School
        </Button>
      </div>

      <Button
        className="w-full bg-blue-500 hover:bg-blue-600 text-white rounded-xl h-11 text-sm font-medium gap-2"
        onClick={onCreateEvent}
      >
        <Calendar className="w-4 h-4" />
        Create Event
      </Button>

      <div className="space-y-4">
        {schools.map((school) => (
          <AdminSchoolCard
            key={school.id}
            school={school}
            onUpdate={() => onUpdateSchool?.(school)}
            onDelete={() => onDeleteSchool?.(school)}
            onAddDirector={() => onAddDirector?.(school)}
          />
        ))}
      </div>
    </section>
  )
}
