import { Card, Button } from '@/shared/ui'
import { cn } from '@/shared/lib/utils'
import { Users, UserPlus } from 'lucide-react'
import type { School } from '../model/types'

interface SchoolCardProps {
  school: School
  onAddTeacher?: () => void
  onViewTeachers?: () => void
}

const colorVariants = {
  blue: 'bg-blue-500',
  purple: 'bg-purple-500',
  green: 'bg-green-500',
  orange: 'bg-orange-500',
}

export function SchoolCard({ school, onAddTeacher, onViewTeachers }: SchoolCardProps) {
  return (
    <Card className="bg-white rounded-2xl shadow-sm border-0">
      <div className="p-4">
        <div className="flex items-start gap-3">
          <div className="flex-1">
            <h3 className="text-gray-800 text-base font-bold leading-6">
              {school.name}
            </h3>
            <p className="text-gray-500 text-sm mt-1">
              {school.teacherCount} Teachers • {school.studentCount.toLocaleString()} Students
            </p>
          </div>

          <div className={cn('w-10 h-10 rounded-xl flex items-center justify-center', colorVariants[school.iconColor])}>
            <Users className="w-5 h-5 text-white" />
          </div>
        </div>

        <div className="flex items-center gap-2 mt-4">
          <Button
            size="sm"
            className="bg-green-500 hover:bg-green-600 text-white rounded-full px-4 h-8 text-xs font-medium gap-1"
            onClick={onAddTeacher}
          >
            <UserPlus className="w-3.5 h-3.5" />
            Add Teacher
          </Button>
          <Button
            variant="outline"
            size="sm"
            className="rounded-full px-4 h-8 text-xs font-medium text-gray-600 border-gray-200 gap-1"
            onClick={onViewTeachers}
          >
            <Users className="w-3.5 h-3.5" />
            Teachers
          </Button>
        </div>
      </div>
    </Card>
  )
}
