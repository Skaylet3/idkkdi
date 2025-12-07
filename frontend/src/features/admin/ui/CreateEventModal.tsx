import { useState } from 'react'
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
  Button,
  Input,
  Label,
  Textarea,
  Checkbox,
} from '@/shared/ui'
import type { CreateEventData } from '../model/types'

interface CreateEventModalProps {
  open: boolean
  onOpenChange: (open: boolean) => void
  onSubmit: (data: CreateEventData) => void | Promise<void>
  isLoading?: boolean
}

export function CreateEventModal({
  open,
  onOpenChange,
  onSubmit,
  isLoading = false,
}: CreateEventModalProps) {
  const [name, setName] = useState('')
  const [description, setDescription] = useState('')
  const [isActive, setIsActive] = useState(false)

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault()

    await onSubmit({
      name,
      description: description || undefined,
      isActive,
    })

    // Reset form on success
    setName('')
    setDescription('')
    setIsActive(false)
  }

  const handleOpenChange = (newOpen: boolean) => {
    if (!newOpen) {
      // Reset form when closing
      setName('')
      setDescription('')
      setIsActive(false)
    }
    onOpenChange(newOpen)
  }

  return (
    <Dialog open={open} onOpenChange={handleOpenChange}>
      <DialogContent className="w-[calc(100%-2rem)] sm:max-w-md rounded-2xl">
        <DialogHeader>
          <DialogTitle className="text-xl font-semibold text-gray-800">
            Create Event
          </DialogTitle>
        </DialogHeader>

        <form onSubmit={handleSubmit} className="space-y-4">
          <div className="space-y-2">
            <Label htmlFor="event-name" className="text-gray-700">
              Event Name
            </Label>
            <Input
              id="event-name"
              value={name}
              onChange={(e) => setName(e.target.value)}
              placeholder=""
              className="h-11 rounded-lg border-gray-200"
              required
              disabled={isLoading}
            />
          </div>

          <div className="space-y-2">
            <Label htmlFor="event-description" className="text-gray-700">
              Description (Optional)
            </Label>
            <Textarea
              id="event-description"
              value={description}
              onChange={(e) => setDescription(e.target.value)}
              placeholder=""
              className="min-h-[100px] rounded-lg border-gray-200 resize-y"
              disabled={isLoading}
            />
          </div>

          <div className="flex items-center justify-between py-2">
            <Label htmlFor="event-active" className="text-gray-700 cursor-pointer">
              Active
            </Label>
            <Checkbox
              id="event-active"
              checked={isActive}
              onCheckedChange={(checked) => setIsActive(checked === true)}
              disabled={isLoading}
              className="h-5 w-5"
            />
          </div>

          <Button
            type="submit"
            className="w-full h-11 bg-green-500 hover:bg-green-600 text-white rounded-xl font-medium"
            disabled={!name.trim() || isLoading}
          >
            {isLoading ? 'Creating...' : 'Next'}
          </Button>
        </form>
      </DialogContent>
    </Dialog>
  )
}
