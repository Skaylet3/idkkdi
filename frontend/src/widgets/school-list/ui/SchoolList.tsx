import { SchoolCard, type School } from '@/entities/school'

interface SchoolListProps {
  title: string
  schools: School[]
  onAddTeacher?: (school: School) => void
  onViewTeachers?: (school: School) => void
}

export function SchoolList({ title, schools, onAddTeacher, onViewTeachers }: SchoolListProps) {
  return (
    <section className="space-y-4">
      <h2 className="text-gray-800 text-xl font-bold leading-7">
        {title}
      </h2>
      <div className="space-y-4">
        {schools.map((school) => (
          <SchoolCard
            key={school.id}
            school={school}
            onAddTeacher={() => onAddTeacher?.(school)}
            onViewTeachers={() => onViewTeachers?.(school)}
          />
        ))}
      </div>
    </section>
  )
}
