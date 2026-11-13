import { useEffect, useState } from 'react'
import { nav, primaryCta, contact } from '../data/site'
import { goTo } from '../lib/smooth'
import { Cta } from './ui/Cta'

/**
 * Nav + CTA laid over the right side of SIG-106's sticky header (SIG-106 owns the logo dock;
 * its internals are not modified during the phôi build).
 */
export function SiteNav() {
  const [open, setOpen] = useState(false)

  useEffect(() => {
    if (!open) return
    const onKey = (e: KeyboardEvent) => e.key === 'Escape' && setOpen(false)
    window.addEventListener('keydown', onKey)
    return () => window.removeEventListener('keydown', onKey)
  }, [open])

  const go = (id: string) => {
    setOpen(false) // close BEFORE scrolling (rules-core §5)
    requestAnimationFrame(() => goTo(id))
  }

  return (
    <nav aria-label="Điều hướng chính" className="fixed right-0 top-0 z-[110] flex h-[var(--header-h)] items-center gap-6 pr-[var(--page-x)]">
      <ul className="hidden items-center gap-7 text-[0.95rem] text-ink lg:flex">
        {nav.map((n) => (
          <li key={n.id}>
            <a href={`#${n.id}`} onClick={(e) => { e.preventDefault(); go(n.id) }} className="py-2 transition-colors hover:text-clay-deep">
              {n.label}
            </a>
          </li>
        ))}
      </ul>
      <a href={contact.phoneHref} className="hidden text-[0.95rem] font-medium text-cocoa hover:text-clay-deep md:inline">{contact.phoneDisplay}</a>
      <Cta target={primaryCta.target} className="!min-h-10 !px-5 !py-2 !text-[0.95rem]">{primaryCta.label}</Cta>
      <button
        type="button"
        className="grid h-11 w-11 place-items-center rounded-full text-ink lg:hidden"
        aria-expanded={open}
        aria-controls="mobile-menu"
        aria-label={open ? 'Đóng menu' : 'Mở menu'}
        onClick={() => setOpen((o) => !o)}
      >
        <span aria-hidden="true" className="relative block h-3 w-5">
          <span className={`absolute left-0 h-0.5 w-5 bg-current transition-transform ${open ? 'top-1.5 rotate-45' : 'top-0'}`} />
          <span className={`absolute left-0 h-0.5 w-5 bg-current transition-transform ${open ? 'top-1.5 -rotate-45' : 'top-3'}`} />
        </span>
      </button>
      {open && (
        <div id="mobile-menu" className="fixed inset-x-0 top-[var(--header-h)] z-[110] bg-paper px-[var(--page-x)] pb-8 pt-4 shadow-lg lg:hidden">
          <ul className="flex flex-col">
            {nav.map((n) => (
              <li key={n.id}>
                <a href={`#${n.id}`} onClick={(e) => { e.preventDefault(); go(n.id) }} className="block py-3 font-display text-2xl text-ink">
                  {n.label}
                </a>
              </li>
            ))}
          </ul>
          <a href={contact.phoneHref} className="mt-4 inline-block text-cocoa">Gọi {contact.phoneDisplay}</a>
        </div>
      )}
    </nav>
  )
}
