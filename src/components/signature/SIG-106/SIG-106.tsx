// DUDI Signature SIG-106 v1.0.0 → biến thể dự án: sửa lỗi chữ tĩnh ẩn vẫn chiếm chỗ (logo header bị lệch)

import { useRef } from 'react'
import type { ReactNode, CSSProperties } from 'react'
import gsap from 'gsap'
import { Flip } from 'gsap/Flip'
import { useGSAP } from '@gsap/react'

gsap.registerPlugin(Flip)

export interface SIG106Props {
  id?: string
  className?: string
  intensity?: 1 | 2 | 3
  brand: string
  tagline?: string
  children?: ReactNode
  labels?: {
    brand?: string
    loading?: string
  }
}

export function SIG106({
  id,
  className = '',
  intensity = 2,
  brand,
  tagline,
  children,
  labels,
}: SIG106Props) {
  const root          = useRef<HTMLDivElement>(null)
  const overlayRef    = useRef<HTMLDivElement>(null)
  const centerRef     = useRef<HTMLDivElement>(null)
  const headerLogoRef = useRef<HTMLDivElement>(null)
  const accentRef     = useRef<HTMLDivElement>(null)

  const factor = intensity === 1 ? 0.7 : intensity === 3 ? 1.4 : 1
  const chars  = brand.split('')

  useGSAP(
    () => {
      const mm = gsap.matchMedia()

      /* ── Reduced motion: fast overlay fade ───────────────────────────── */
      mm.add('(prefers-reduced-motion: reduce)', () => {
        const overlay    = overlayRef.current
        const headerLogo = headerLogoRef.current
        if (!overlay || !headerLogo) return
        gsap.set(headerLogo.querySelectorAll<HTMLElement>('.sig106-static'), { autoAlpha: 1 })
        gsap.to(overlay, {
          autoAlpha: 0,
          duration: 0.15,
          onComplete() { overlay.style.display = 'none' },
        })
      })

      /* ── Full animation ───────────────────────────────────────────────── */
      mm.add(
        {
          desktop: '(min-width: 768px) and (prefers-reduced-motion: no-preference)',
          mobile : '(max-width: 767px) and (prefers-reduced-motion: no-preference)',
        },
        (ctx) => {
          const { desktop } = ctx.conditions as { desktop: boolean; mobile: boolean }
          const overlay    = overlayRef.current
          const center     = centerRef.current
          const headerLogo = headerLogoRef.current
          if (!overlay || !center || !headerLogo) return

          const letterSpans = gsap.utils.toArray<HTMLElement>('.sig106-letter', center)
          if (!letterSpans.length) return

          /* initial states */
          // project fix: hidden static letters must not keep their width, or the docked wordmark is offset
          gsap.set(headerLogo.querySelectorAll<HTMLElement>('.sig106-static'), { display: 'none' })
          gsap.set(letterSpans, { yPercent: 115 })
          if (accentRef.current) {
            gsap.set(accentRef.current, { scaleX: 0, transformOrigin: 'left center' })
          }

          const stagger   = (desktop ? 0.07 : 0.055) * factor
          const revealDur = 0.65 * factor

          gsap
            .timeline()
            /* accent bar */
            .to(accentRef.current, {
              scaleX  : 1,
              duration: revealDur * 0.9,
              ease    : 'power2.out',
            }, 0)
            /* letter mask reveal */
            .to(letterSpans, {
              yPercent: 0,
              duration: revealDur,
              stagger,
              ease    : 'power3.out',
            }, 0.1 * factor)
            /* hold */
            .to({}, { duration: 0.55 * factor })
            /* Flip: reparent → animate to header */
            .call(() => {
              const state = Flip.getState(letterSpans)

              letterSpans.forEach((el) => headerLogo.appendChild(el))

              Flip.from(state, {
                duration : 0.85 * factor,
                ease     : 'power2.inOut',
                stagger  : { amount: 0.15 * factor, from: 'center' },
                scale    : true,
                onComplete() {
                  if (overlay) overlay.style.display = 'none'
                },
              })

              gsap.to(overlay, {
                autoAlpha: 0,
                duration : 0.5 * factor,
                delay    : 0.3 * factor,
                ease     : 'power2.in',
              })
            })
        }
      )

      return () => mm.revert()
    },
    { scope: root, dependencies: [brand, intensity] }
  )

  /* ─── shared style fragment ─────────────────────────────────────────────── */
  const displayFont: CSSProperties = {
    fontFamily   : 'var(--sig-font-display, serif)',
    fontWeight   : 700,
    letterSpacing: '-0.02em',
    lineHeight   : 1,
  }

  return (
    <div
      id={id}
      ref={root}
      className={className}
      style={{
        scrollMarginTop: 'var(--header-h, 0px)',
        background     : 'var(--sig-bg, #0e0e0e)',
        color          : 'var(--sig-fg, #f4efe8)',
        minHeight      : '100vh',
        fontFamily     : 'var(--sig-font-body, system-ui, sans-serif)',
        position       : 'relative',
      }}
    >
      {/* ── Preloader overlay ─────────────────────────────────────────────── */}
      <div
        ref={overlayRef}
        aria-hidden="true"
        style={{
          position      : 'fixed',
          inset         : 0,
          zIndex        : 1000,
          display       : 'flex',
          flexDirection : 'column',
          alignItems    : 'center',
          justifyContent: 'center',
          background    : 'var(--sig-bg, #0e0e0e)',
          pointerEvents : 'none',
        }}
      >
        {/* Accent bar */}
        <div
          ref={accentRef}
          aria-hidden="true"
          style={{
            position : 'absolute',
            bottom   : '12%',
            left     : 'calc(50% - 2.5rem)',
            width    : '5rem',
            height   : '2px',
            background: 'var(--sig-accent, #e0a25b)',
          }}
        />

        {/* Large wordmark */}
        <div ref={centerRef} style={{ display: 'flex', alignItems: 'flex-end', gap: '0.04em' }}>
          {chars.map((char, i) => (
            <span
              key={i}
              style={{
                display   : 'block',
                overflow  : 'hidden',
                lineHeight: 1.1,
                ...displayFont,
                fontSize  : 'clamp(3rem, 11vw, 10rem)',
                color     : 'var(--sig-fg, #f4efe8)',
              }}
            >
              <span className="sig106-letter" style={{ display: 'block' }}>
                {char === ' ' ? '\u00A0' : char}
              </span>
            </span>
          ))}
        </div>

        {tagline && (
          <p
            style={{
              marginTop    : '1.5rem',
              fontFamily   : 'var(--sig-font-body, system-ui, sans-serif)',
              fontSize     : 'clamp(0.65rem, 1.2vw, 0.875rem)',
              letterSpacing: '0.35em',
              textTransform: 'uppercase',
              color        : 'var(--sig-muted, color-mix(in oklab, var(--sig-fg, #f4efe8) 35%, transparent))',
            }}
          >
            {tagline}
          </p>
        )}
      </div>

      {/* ── Sticky header ─────────────────────────────────────────────────── */}
      <header
        style={{
          position    : 'sticky',
          top         : 0,
          zIndex      : 100,
          display     : 'flex',
          alignItems  : 'center',
          padding     : '0.875rem 2rem',
          borderBottom: '1px solid var(--sig-muted, color-mix(in oklab, var(--sig-fg, #f4efe8) 35%, transparent))',
          background  : 'var(--sig-bg, #0e0e0e)',
        }}
      >
        <div
          ref={headerLogoRef}
          role="img"
          aria-label={labels?.brand ?? brand}
          style={{
            display   : 'flex',
            alignItems: 'flex-end',
            gap       : '0.02em',
            ...displayFont,
            fontSize  : 'clamp(1rem, 2vw, 1.4rem)',
            color     : 'var(--sig-fg, #f4efe8)',
          }}
        >
          {/* Static fallback — hidden by GSAP; keeps text in DOM for a11y */}
          {chars.map((char, i) => (
            <span
              key={`s-${i}`}
              className="sig106-static"
              aria-hidden="true"
              style={{ display: 'block' }}
            >
              {char === ' ' ? '\u00A0' : char}
            </span>
          ))}
        </div>
      </header>

      {/* ── Page content ──────────────────────────────────────────────────── */}
      {children != null && (
        <div style={{ padding: '4rem 2rem' }}>{children}</div>
      )}
    </div>
  )
}

export default SIG106
