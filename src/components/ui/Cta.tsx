import type { ReactNode } from 'react'
import { goTo } from '../../lib/smooth'

/** Primary CTA (one style for the whole page). `tone="light"` for dark backgrounds. */
export function Cta({ target, children, tone = 'dark', className = '' }: { target: string; children: ReactNode; tone?: 'dark' | 'light'; className?: string }) {
  // clay-deep on paper text ≈ 6.9:1 (AA). Pill decided once for every button on the page.
  const base =
    'inline-flex min-h-12 items-center gap-2 rounded-full px-6 py-3 text-base font-semibold transition-[background-color,transform] duration-200 active:scale-[0.97]'
  const look = tone === 'dark' ? 'bg-clay-deep text-night hover:bg-ink' : 'bg-ink text-night hover:bg-amber'
  return (
    <a
      href={`#${target}`}
      onClick={(e) => {
        e.preventDefault()
        goTo(target)
      }}
      className={`${base} ${look} ${className}`}
    >
      {children}
      <span aria-hidden="true">→</span>
    </a>
  )
}
