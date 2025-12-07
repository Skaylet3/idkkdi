import { Button } from '@/shared/ui'
import { ArrowLeft, History } from 'lucide-react'

interface HeaderProps {
  title: string
  onHistoryClick?: () => void
  showBackButton?: boolean
  showHistoryButton?: boolean
}

export function Header({
  title,
  onHistoryClick,
  showBackButton = true,
  showHistoryButton = true,
}: HeaderProps) {
  const handleBack = () => {
    window.history.back()
  }

  return (
    <header className="bg-white shadow-sm sticky top-0 z-10">
      <div className="h-16 px-3 flex items-center justify-between">
        <div className="w-10 h-10 flex items-center justify-center">
          {showBackButton && (
            <Button
              variant="ghost"
              size="icon"
              className="rounded-full"
              onClick={handleBack}
            >
              <ArrowLeft 
                className="text-gray-700"
              />
            </Button>
          )}
        </div>

        <h1 className="text-gray-800 text-lg font-bold">
          {title}
        </h1>

        <div className="w-10 h-10 flex items-center justify-center">
          {showHistoryButton && (
            <Button
              variant="ghost"
              size="icon"
              className="rounded-full"
              onClick={onHistoryClick}
            >
              <History className="w-5 h-5 text-gray-700" />
            </Button>
          )}
        </div>
      </div>
    </header>
  )
}
