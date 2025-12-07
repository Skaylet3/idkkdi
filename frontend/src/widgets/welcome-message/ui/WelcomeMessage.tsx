interface WelcomeMessageProps {
  title: string
  subtitle: string
}

export function WelcomeMessage({ title, subtitle }: WelcomeMessageProps) {
  return (
    <section className= "border-0 py-6 px-[12px] text-center">
      <h2 className="text-xl font-bold text-gray-800 mb-1">{title}</h2>
      <p className="text-gray-500 text-sm">{subtitle}</p>
    </section>
  )
}
