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
import type { CreateSchoolData } from '../model/types'

interface CreateSchoolModalProps {
  open: boolean
  onOpenChange: (open: boolean) => void
  onSubmit: (data: CreateSchoolData) => void | Promise<void>
  isLoading?: boolean
}

export function CreateSchoolModal({
  open,
  onOpenChange,
  onSubmit,
  isLoading = false,
}: CreateSchoolModalProps) {
  const [name, setName] = useState('')
  const [address, setAddress] = useState('')

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault()

    await onSubmit({
      name,
      address: address || undefined,
    })

    // Reset form on success
    setName('')
    setAddress('')
  }

  const handleOpenChange = (newOpen: boolean) => {
    if (!newOpen) {
      // Reset form when closing
      setName('')
      setAddress('')
    }
    onOpenChange(newOpen)
  }

  return (
    <Dialog open={open} onOpenChange={handleOpenChange}>
      <DialogContent className="w-[calc(100%-2rem)] sm:max-w-md rounded-2xl">
        <DialogHeader>
          <DialogTitle className="text-xl font-semibold text-gray-800">
            Create New School
          </DialogTitle>
        </DialogHeader>

        <form onSubmit={handleSubmit} className="space-y-4">
          <div className="space-y-2">
            <Label htmlFor="school-name" className="text-gray-700">
              School Name
            </Label>
            <Input
              id="school-name"
              value={name}
              onChange={(e) => setName(e.target.value)}
              placeholder=""
              className="h-11 rounded-lg border-gray-200"
              required
              disabled={isLoading}
            />
          </div>

          <div className="space-y-2">
            <Label htmlFor="school-address" className="text-gray-700">
              Address
            </Label>
            <Input
              id="school-address"
              value={address}
              onChange={(e) => setAddress(e.target.value)}
              placeholder=""
              className="h-11 rounded-lg border-gray-200"
              disabled={isLoading}
            />
          </div>

          <Button
            type="submit"
            className="w-full h-11 bg-green-500 hover:bg-green-600 text-white rounded-xl font-medium"
            disabled={!name.trim() || isLoading}
          >
            {isLoading ? 'Creating...' : 'Create School'}
          </Button>
        </form>
      </DialogContent>
    </Dialog>
  )
}
