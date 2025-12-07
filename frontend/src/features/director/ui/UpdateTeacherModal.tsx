import { useState, useEffect } from 'react'
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
  Button,
  Input,
  Label,
} from '@/shared/ui'
import { Check } from 'lucide-react'
import type { Teacher } from '@/entities/teacher'
import type { UpdateTeacherData } from '../model/types'

interface UpdateTeacherModalProps {
  open: boolean
  onOpenChange: (open: boolean) => void
  onSubmit: (data: UpdateTeacherData) => void | Promise<void>
  teacher: Teacher | null
  isLoading?: boolean
}

export function UpdateTeacherModal({
  open,
  onOpenChange,
  onSubmit,
  teacher,
  isLoading = false,
}: UpdateTeacherModalProps) {
  const [name, setName] = useState('')
  const [email, setEmail] = useState('')

  useEffect(() => {
    if (teacher) {
      setName(teacher.name)
      setEmail(teacher.email)
    }
  }, [teacher])

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault()

    if (!teacher) return

    await onSubmit({
      id: teacher.id,
      name,
      email,
    })
  }

  const handleOpenChange = (newOpen: boolean) => {
    if (!newOpen) {
      setName('')
      setEmail('')
    }
    onOpenChange(newOpen)
  }

  return (
    <Dialog open={open} onOpenChange={handleOpenChange}>
      <DialogContent className="w-[calc(100%-2rem)] sm:max-w-md rounded-2xl">
        <DialogHeader>
          <DialogTitle className="text-xl font-semibold text-blue-600">
            Update Teacher
          </DialogTitle>
        </DialogHeader>

        <form onSubmit={handleSubmit} className="space-y-4">
          <div className="space-y-2">
            <Label htmlFor="update-teacher-name" className="text-gray-700">
              Full Name
            </Label>
            <Input
              id="update-teacher-name"
              value={name}
              onChange={(e) => setName(e.target.value)}
              className="h-11 rounded-lg border-gray-200"
              required
              disabled={isLoading}
            />
          </div>

          <div className="space-y-2">
            <Label htmlFor="update-teacher-email" className="text-gray-700">
              Email Address
            </Label>
            <Input
              id="update-teacher-email"
              type="email"
              value={email}
              onChange={(e) => setEmail(e.target.value)}
              className="h-11 rounded-lg border-gray-200"
              required
              disabled={isLoading}
            />
          </div>

          <div className="space-y-2">
            <Label className="text-gray-700">Schools</Label>
            <div className="p-3 bg-gray-50 rounded-lg">
              <p className="text-gray-800">{teacher?.schoolName || 'No school assigned'}</p>
            </div>
          </div>

          <Button
            type="submit"
            className="w-full h-11 bg-green-500 hover:bg-green-600 text-white rounded-xl font-medium gap-2"
            disabled={!name.trim() || !email.trim() || isLoading}
          >
            <Check className="w-4 h-4" />
            {isLoading ? 'Updating...' : 'Update Teacher'}
          </Button>
        </form>
      </DialogContent>
    </Dialog>
  )
}
