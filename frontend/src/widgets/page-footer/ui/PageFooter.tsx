export type FooterLink = {
  label: string
  href: string
}

interface PageFooterProps {
  copyright: string
  links?: FooterLink[]
}

export function PageFooter({ copyright, links = [] }: PageFooterProps) {
  return (
    <footer className="py-6 px-4 text-center">
      <p className="text-gray-500 text-xs mb-2">{copyright}</p>
      {links.length > 0 && (
        <div className="flex items-center justify-center gap-4 text-xs">
          {links.map((link) => (
            <a
              key={link.label}
              href={link.href}
              className="text-gray-500 hover:text-gray-700"
            >
              {link.label}
            </a>
          ))}
        </div>
      )}
    </footer>
  )
}
