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
import type { UpdateSchoolData } from '../model/types'

interface UpdateSchoolModalProps {
  open: boolean
  onOpenChange: (open: boolean) => void
  onSubmit: (data: UpdateSchoolData) => void | Promise<void>
  school: { id: string; name: string; address: string } | null
  isLoading?: boolean
}

export function UpdateSchoolModal({
  open,
  onOpenChange,
  onSubmit,
  school,
  isLoading = false,
}: UpdateSchoolModalProps) {
  const [name, setName] = useState('')
  const [address, setAddress] = useState('')

  // Sync form with school data when modal opens or school changes
  useEffect(() => {
    if (school) {
      setName(school.name)
      setAddress(school.address)
    }
  }, [school])

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault()

    if (!school) return

    await onSubmit({
      id: school.id,
      name,
      address: address || undefined,
    })
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
            Update School
          </DialogTitle>
        </DialogHeader>

        <form onSubmit={handleSubmit} className="space-y-4">
          <div className="space-y-2">
            <Label htmlFor="update-school-name" className="text-gray-700">
              School Name
            </Label>
            <Input
              id="update-school-name"
              value={name}
              onChange={(e) => setName(e.target.value)}
              placeholder=""
              className="h-11 rounded-lg border-gray-200"
              required
              disabled={isLoading}
            />
          </div>

          <div className="space-y-2">
            <Label htmlFor="update-school-address" className="text-gray-700">
              Address
            </Label>
            <Input
              id="update-school-address"
              value={address}
              onChange={(e) => setAddress(e.target.value)}
              placeholder=""
              className="h-11 rounded-lg border-gray-200"
              disabled={isLoading}
            />
          </div>

          <Button
            type="submit"
            className="w-full h-11 bg-amber-400 hover:bg-amber-500 text-white rounded-xl font-medium"
            disabled={!name.trim() || isLoading}
          >
            {isLoading ? 'Updating...' : 'Change'}
          </Button>
        </form>
      </DialogContent>
    </Dialog>
  )
}
