import { useState } from 'react'
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
  Button,
  Input,
  Label,
} from '@/shared/ui'
import { UserPlus } from 'lucide-react'
import type { CreateTeacherData } from '../model/types'

interface AddTeacherModalProps {
  open: boolean
  onOpenChange: (open: boolean) => void
  onSubmit: (data: CreateTeacherData) => void | Promise<void>
  schoolId: string
  schoolName: string
  isLoading?: boolean
}

export function AddTeacherModal({
  open,
  onOpenChange,
  onSubmit,
  schoolId,
  schoolName,
  isLoading = false,
}: AddTeacherModalProps) {
  const [name, setName] = useState('')
  const [email, setEmail] = useState('')
  const [password, setPassword] = useState('')

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault()

    await onSubmit({
      name,
      email,
      password,
      schoolId,
    })

    resetForm()
  }

  const resetForm = () => {
    setName('')
    setEmail('')
    setPassword('')
  }

  const handleOpenChange = (newOpen: boolean) => {
    if (!newOpen) {
      resetForm()
    }
    onOpenChange(newOpen)
  }

  return (
    <Dialog open={open} onOpenChange={handleOpenChange}>
      <DialogContent className="w-[calc(100%-2rem)] sm:max-w-md rounded-2xl">
        <DialogHeader>
          <DialogTitle className="text-xl font-semibold text-gray-800">
            Add Teacher
          </DialogTitle>
        </DialogHeader>

        <p className="text-gray-600 text-sm">{schoolName}</p>

        <form onSubmit={handleSubmit} className="space-y-4">
          <div className="space-y-2">
            <Label htmlFor="teacher-name" className="text-gray-700">
              Full Name
            </Label>
            <Input
              id="teacher-name"
              value={name}
              onChange={(e) => setName(e.target.value)}
              placeholder="Enter teacher name"
              className="h-11 rounded-lg border-gray-200"
              required
              disabled={isLoading}
            />
          </div>

          <div className="space-y-2">
            <Label htmlFor="teacher-email" className="text-gray-700">
              Email Address
            </Label>
            <Input
              id="teacher-email"
              type="email"
              value={email}
              onChange={(e) => setEmail(e.target.value)}
              placeholder="teacher@school.com"
              className="h-11 rounded-lg border-gray-200"
              required
              disabled={isLoading}
            />
          </div>

          <div className="space-y-2">
            <Label htmlFor="teacher-password" className="text-gray-700">
              Password
            </Label>
            <Input
              id="teacher-password"
              type="password"
              value={password}
              onChange={(e) => setPassword(e.target.value)}
              placeholder="Create password"
              className="h-11 rounded-lg border-gray-200"
              required
              disabled={isLoading}
            />
          </div>

          <Button
            type="submit"
            className="w-full h-11 bg-green-500 hover:bg-green-600 text-white rounded-xl font-medium gap-2"
            disabled={!name.trim() || !email.trim() || !password.trim() || isLoading}
          >
            <UserPlus className="w-4 h-4" />
            {isLoading ? 'Adding...' : 'Add Teacher'}
          </Button>
        </form>
      </DialogContent>
    </Dialog>
  )
}
