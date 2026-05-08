'use client'
import Link from 'next/link'
import { usePathname } from 'next/navigation'

const links = [
  { href: '/', label: 'Dashboard' },
  { href: '/objetivas', label: 'Objetivas' },
  { href: '/discursivas', label: 'Discursivas' },
  { href: '/progresso', label: 'Progresso' },
]

export default function Navbar() {
  const path = usePathname()
  return (
    <nav className="bg-white border-b border-gray-200 sticky top-0 z-50">
      <div className="max-w-6xl mx-auto px-4 flex items-center justify-between h-14">
        <Link href="/" className="font-bold text-blue-700 text-lg tracking-tight">
          TEP Pediatria <span className="text-gray-400 font-normal text-sm">2026</span>
        </Link>
        <div className="flex gap-1">
          {links.map(l => (
            <Link
              key={l.href}
              href={l.href}
              className={`px-3 py-1.5 rounded-lg text-sm font-medium transition-colors ${
                path === l.href
                  ? 'bg-blue-100 text-blue-700'
                  : 'text-gray-600 hover:bg-gray-100'
              }`}
            >
              {l.label}
            </Link>
          ))}
        </div>
      </div>
    </nav>
  )
}
