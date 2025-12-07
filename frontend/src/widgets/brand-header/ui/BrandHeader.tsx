import { GraduationCap } from 'lucide-react'

interface BrandHeaderProps {
  title: string
  subtitle: string
}

export function BrandHeader({ title, subtitle }: BrandHeaderProps) {
  return (
    <div className="bg-gray-600 pt-10 pb-16 px-4">
      <div className="flex flex-col items-center text-center">
        <div className="w-16 h-16 bg-white/20 rounded-full flex items-center justify-center mb-4">
          <GraduationCap className="w-8 h-8 text-white" />
        </div>
        <h1 className="text-2xl font-bold text-white mb-1">{title}</h1>
        <p className="text-white/80 text-sm">{subtitle}</p>
      </div>
    </div>
  )
}
