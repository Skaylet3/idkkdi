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
  schools: AdminSchool[]
  isLoading?: boolean
}

export function AddDirectorModal({
  open,
  onOpenChange,
  onSubmit,
  schools,
  isLoading = false,
}: AddDirectorModalProps) {
  const [step, setStep] = useState<'select-school' | 'director-form'>('select-school')
  const [searchQuery, setSearchQuery] = useState('')
  const [selectedSchoolId, setSelectedSchoolId] = useState<string | null>(null)

  // Director form fields
  const [name, setName] = useState('')
  const [email, setEmail] = useState('')
  const [password, setPassword] = useState('')

  const filteredSchools = schools.filter((school) =>
    school.name.toLowerCase().includes(searchQuery.toLowerCase()) ||
    school.address.toLowerCase().includes(searchQuery.toLowerCase())
  )

  const selectedSchool = schools.find((s) => s.id === selectedSchoolId)

  const handleSchoolSelect = (schoolId: string) => {
    setSelectedSchoolId(schoolId)
  }

  const handleNext = () => {
    if (selectedSchoolId) {
      setStep('director-form')
    }
  }

  const handleBack = () => {
    setStep('select-school')
  }

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault()

    if (!selectedSchoolId) return

    await onSubmit({
      name,
      email,
      password,
      schoolId: selectedSchoolId,
    })

    // Reset form on success
    resetForm()
  }

  const resetForm = () => {
    setStep('select-school')
    setSearchQuery('')
    setSelectedSchoolId(null)
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

        {step === 'select-school' && (
          <div className="space-y-4">
            <div className="space-y-2">
              <Label htmlFor="search-school" className="text-gray-700">
                Search School
              </Label>
              <Input
                id="search-school"
                value={searchQuery}
                onChange={(e) => setSearchQuery(e.target.value)}
                placeholder="Type school name..."
                className="h-11 rounded-lg border-gray-200"
                disabled={isLoading}
              />
            </div>

            <div className="space-y-2 max-h-[200px] overflow-y-auto">
              {filteredSchools.map((school) => (
                <button
                  key={school.id}
                  type="button"
                  onClick={() => handleSchoolSelect(school.id)}
                  className={`w-full p-3 rounded-lg border text-left transition-colors ${
                    selectedSchoolId === school.id
                      ? 'border-green-500 bg-green-50'
                      : 'border-gray-200 hover:border-gray-300'
                  }`}
                  disabled={isLoading}
                >
                  <p className="font-medium text-gray-800">{school.name}</p>
                  <p className="text-sm text-gray-500">{school.address}</p>
                </button>
              ))}
              {filteredSchools.length === 0 && (
                <p className="text-center text-gray-500 py-4">No schools found</p>
              )}
            </div>

            <Button
              type="button"
              className="w-full h-11 bg-green-500 hover:bg-green-600 text-white rounded-xl font-medium"
              disabled={!selectedSchoolId || isLoading}
              onClick={handleNext}
            >
              Next
            </Button>
          </div>
        )}

        {step === 'director-form' && (
          <form onSubmit={handleSubmit} className="space-y-4">
            <div className="p-3 bg-gray-50 rounded-lg">
              <p className="text-sm text-gray-500">Selected School</p>
              <p className="font-medium text-gray-800">{selectedSchool?.name}</p>
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

            <div className="flex gap-3">
              <Button
                type="button"
                variant="outline"
                className="flex-1 h-11 rounded-xl font-medium border-gray-200"
                onClick={handleBack}
                disabled={isLoading}
              >
                Back
              </Button>
              <Button
                type="submit"
                className="flex-1 h-11 bg-green-500 hover:bg-green-600 text-white rounded-xl font-medium"
                disabled={!name.trim() || !email.trim() || !password.trim() || isLoading}
              >
                {isLoading ? 'Creating...' : 'Create Director'}
              </Button>
            </div>
          </form>
        )}
      </DialogContent>
    </Dialog>
  )
}
