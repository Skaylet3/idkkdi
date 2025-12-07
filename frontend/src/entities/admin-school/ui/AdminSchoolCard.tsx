import { useState } from 'react'
import { Card, Button } from '@/shared/ui'
import { ChevronDown, Pencil, Trash2, UserPlus } from 'lucide-react'
import { cn } from '@/shared/lib/utils'
import type { AdminSchool } from '../model/types'

interface AdminSchoolCardProps {
  school: AdminSchool
  onUpdate?: () => void
  onDelete?: () => void
  onAddDirector?: () => void
}

export function AdminSchoolCard({ school, onUpdate, onDelete, onAddDirector }: AdminSchoolCardProps) {
  const [isExpanded, setIsExpanded] = useState(true)

  return (
    <Card className="bg-white rounded-2xl shadow-sm border-0 overflow-hidden">
      <div className="p-4">
        <div className="flex items-center justify-between">
          <div className="flex-1">
            <h3 className="text-gray-800 text-base font-semibold">
              {school.name}
            </h3>
            <p className="text-gray-500 text-sm mt-0.5">
              {school.address}
            </p>
          </div>

          <Button
            variant="ghost"
            size="icon"
            className="rounded-full h-8 w-8"
            onClick={() => setIsExpanded(!isExpanded)}
          >
            <ChevronDown
              className={cn(
                "w-5 h-5 text-gray-500 transition-transform duration-200",
                isExpanded && "rotate-180"
              )}
            />
          </Button>
        </div>

        {isExpanded && (
          <div className="flex flex-wrap items-center gap-2 mt-3">
            <Button
              size="sm"
              className="bg-amber-400 hover:bg-amber-500 text-white rounded-lg px-3 h-8 text-xs font-medium gap-1.5"
              onClick={onUpdate}
            >
              <Pencil className="w-3.5 h-3.5" />
              Update
            </Button>
            <Button
              size="sm"
              className="bg-red-500 hover:bg-red-600 text-white rounded-lg px-3 h-8 text-xs font-medium gap-1.5"
              onClick={onDelete}
            >
              <Trash2 className="w-3.5 h-3.5" />
              Delete
            </Button>
            <Button
              size="sm"
              className="bg-green-500 hover:bg-green-600 text-white rounded-lg px-3 h-8 text-xs font-medium gap-1.5"
              onClick={onAddDirector}
            >
              <UserPlus className="w-3.5 h-3.5" />
              Add Director
            </Button>
          </div>
        )}
      </div>
    </Card>
  )
}
