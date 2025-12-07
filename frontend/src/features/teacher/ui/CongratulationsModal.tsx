import {
  Dialog,
  DialogContent,
  Button,
} from '@/shared/ui'
import { Trophy } from 'lucide-react'

interface CongratulationsModalProps {
  open: boolean
  onOpenChange: (open: boolean) => void
  onGoToHub: () => void
}

export function CongratulationsModal({
  open,
  onOpenChange,
  onGoToHub,
}: CongratulationsModalProps) {
  const handleGoToHub = () => {
    onGoToHub()
    onOpenChange(false)
  }

  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogContent className="w-[calc(100%-2rem)] sm:max-w-sm rounded-2xl">
        <div className="flex flex-col items-center text-center space-y-4 py-4">
          <div className="w-16 h-16 rounded-full bg-green-100 flex items-center justify-center">
            <Trophy className="w-8 h-8 text-green-500" />
          </div>

          <h2 className="text-2xl font-bold text-green-600">
            Congratulations!
          </h2>

          <p className="text-gray-500">
            You have successfully completed the questionnaire. Thank you for your participation!
          </p>

          <Button
            type="button"
            className="w-full h-11 bg-green-500 hover:bg-green-600 text-white rounded-xl font-medium"
            onClick={handleGoToHub}
          >
            Go to Hub
          </Button>
        </div>
      </DialogContent>
    </Dialog>
  )
}
