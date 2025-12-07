import {
  Dialog,
  DialogContent,
  Button,
} from '@/shared/ui'
import { ArrowLeft } from 'lucide-react'

interface QuestionFullTextModalProps {
  open: boolean
  onOpenChange: (open: boolean) => void
  onBack: () => void
  questionText: string
}

export function QuestionFullTextModal({
  open,
  onOpenChange,
  onBack,
  questionText,
}: QuestionFullTextModalProps) {
  const handleBack = () => {
    onOpenChange(false)
    onBack()
  }

  const handleOpenChange = (newOpen: boolean) => {
    if (!newOpen) {
      handleBack()
    } else {
      onOpenChange(newOpen)
    }
  }

  return (
    <Dialog open={open} onOpenChange={handleOpenChange}>
      <DialogContent className="w-[calc(100%-2rem)] sm:max-w-sm rounded-2xl">
        <div className="flex items-center gap-3">
          <button
            type="button"
            onClick={handleBack}
            className="p-1 rounded-full hover:bg-gray-100 transition-colors"
          >
            <ArrowLeft className="w-5 h-5 text-gray-600" />
          </button>
          <h2 className="text-lg font-semibold text-gray-800">
            Full Text
          </h2>
        </div>

        <p className="text-gray-600 text-sm leading-relaxed">
          {questionText}
        </p>

        <Button
          type="button"
          variant="outline"
          className="w-full h-11 rounded-xl font-medium border-gray-200 bg-gray-100 hover:bg-gray-200"
          onClick={handleBack}
        >
          Close
        </Button>
      </DialogContent>
    </Dialog>
  )
}
