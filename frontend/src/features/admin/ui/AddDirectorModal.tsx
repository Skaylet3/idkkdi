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
import type { CreateDirectorData } from '../model/types'
import type { AdminSchool } from '@/entities/admin-school'

interface AddDirectorModalProps {
  open: boolean
  onOpenChange: (open: boolean) => void
  onSubmit: (data: CreateDirectorData) => void | Promise<void>
  school: AdminSchool | null
  isLoading?: boolean
}

export function AddDirectorModal({
  open,
  onOpenChange,
  onSubmit,
  school,
  isLoading = false,
}: AddDirectorModalProps) {
  const [name, setName] = useState('')
  const [email, setEmail] = useState('')
  const [password, setPassword] = useState('')

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault()

    if (!school) return

    await onSubmit({
      name,
      email,
      password,
      schoolId: school.id,
    })

    // Reset form on success
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
            Add Director
          </DialogTitle>
        </DialogHeader>

        <form onSubmit={handleSubmit} className="space-y-4">
          <div className="p-3 bg-gray-50 rounded-lg">
            <p className="text-sm text-gray-500">School</p>
            <p className="font-medium text-gray-800">{school?.name}</p>
          </div>

          <div className="space-y-2">
            <Label htmlFor="director-name" className="text-gray-700">
              Director Name
            </Label>
            <Input
              id="director-name"
              value={name}
              onChange={(e) => setName(e.target.value)}
              placeholder=""
              className="h-11 rounded-lg border-gray-200"
              required
              disabled={isLoading}
            />
          </div>

          <div className="space-y-2">
            <Label htmlFor="director-email" className="text-gray-700">
              Email
            </Label>
            <Input
              id="director-email"
              type="email"
              value={email}
              onChange={(e) => setEmail(e.target.value)}
              placeholder=""
              className="h-11 rounded-lg border-gray-200"
              required
              disabled={isLoading}
            />
          </div>

          <div className="space-y-2">
            <Label htmlFor="director-password" className="text-gray-700">
              Password
            </Label>
            <Input
              id="director-password"
              type="password"
              value={password}
              onChange={(e) => setPassword(e.target.value)}
              placeholder=""
              className="h-11 rounded-lg border-gray-200"
              required
              disabled={isLoading}
            />
          </div>

          <Button
            type="submit"
            className="w-full h-11 bg-green-500 hover:bg-green-600 text-white rounded-xl font-medium"
            disabled={!name.trim() || !email.trim() || !password.trim() || isLoading}
          >
            {isLoading ? 'Creating...' : 'Create Director'}
          </Button>
        </form>
      </DialogContent>
    </Dialog>
  )
}
