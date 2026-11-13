// DUDI Signature SIG-802 v1.0.0 — Multi-step Booking Form
import { useId, useLayoutEffect, useRef, useState, type FormEvent } from 'react'
import gsap from 'gsap'
import { useGSAP } from '@gsap/react'

gsap.registerPlugin(useGSAP)

/* ───────────────────────── Types ───────────────────────── */

export interface Sig802Option {
  value: string
  label: string
}

interface FieldBase {
  name: string
  label: string
  required?: boolean
}

export interface Sig802TextField extends FieldBase {
  type: 'text' | 'tel' | 'email'
  placeholder?: string
  autoComplete?: string
  /** Regular expression source (whole value must match). Replaces the built-in phone / e-mail check. */
  pattern?: string
  /** Message shown when the format is wrong (overrides the default label). */
  errorMessage?: string
}
export interface Sig802TextareaField extends FieldBase {
  type: 'textarea'
  maxLength?: number
}
export interface Sig802ChoiceField extends FieldBase {
  type: 'choice'
  options: Sig802Option[]
  /** true → checkboxes (array value); false/omitted → radios (string value) */
  multiple?: boolean
}
export interface Sig802DateField extends FieldBase {
  type: 'date'
  /** ISO date `yyyy-mm-dd` */
  min?: string
}
export interface Sig802SelectField extends FieldBase {
  type: 'select'
  options: Sig802Option[]
}

export type Sig802Field = Sig802TextField | Sig802TextareaField | Sig802ChoiceField | Sig802DateField | Sig802SelectField

export interface Sig802Step {
  id: string
  title: string
  description?: string
  fields: Sig802Field[]
}

export type Sig802Values = Record<string, string | string[]>

export interface Sig802Labels {
  /** "Bước {n} / {total}" */
  step: string
  next: string
  back: string
  submit: string
  sending: string
  required: string
  invalidPhone: string
  invalidEmail: string
  invalidFormat: string
  invalidDate: string
  submitError: string
  selectPlaceholder: string
  stepsNav: string
  reset: string
  summaryTitle: string
}

export interface Sig802Props {
  id?: string
  className?: string
  /** 1 calm · 2 default · 3 bold — slide distance only; durations stay ≤ 350ms */
  intensity?: 1 | 2 | 3
  eyebrow?: string
  heading: string
  intro?: string
  steps: Sig802Step[]
  /** Overrides `labels.submit` */
  submitLabel?: string
  /** Awaited. Reject / throw to show `labels.submitError` and stay on the last step. */
  onSubmit: (values: Sig802Values) => void | Promise<void>
  success: { title: string; text?: string }
  labels?: Partial<Sig802Labels>
}

const DEFAULT_LABELS: Sig802Labels = {
  step: 'Bước {n} / {total}',
  next: 'Tiếp tục',
  back: 'Quay lại',
  submit: 'Gửi yêu cầu',
  sending: 'Đang gửi…',
  required: 'Vui lòng điền mục này',
  invalidPhone: 'Số điện thoại chưa đúng',
  invalidEmail: 'Email chưa đúng',
  invalidFormat: 'Định dạng chưa đúng',
  invalidDate: 'Ngày này chưa hợp lệ',
  submitError: 'Gửi chưa thành công, vui lòng thử lại',
  selectPlaceholder: 'Chọn một mục',
  stepsNav: 'Các bước',
  reset: 'Gửi yêu cầu khác',
  summaryTitle: 'Thông tin bạn đã gửi',
}

/* ───────────────────────── Helpers ───────────────────────── */

const DIST = { 1: 0.6, 2: 1, 3: 1.3 } as const
const PHONE_RE = /^(\+?84|0)\d{8,10}$/
const EMAIL_RE = /^[^\s@]+@[^\s@]+\.[^\s@]{2,}$/

type Mode = 'reduced' | 'mobile' | 'desktop'

const fmt = (tpl: string, n: number, total: number) => tpl.replace('{n}', String(n)).replace('{total}', String(total))

function initialValues(steps: Sig802Step[]): Sig802Values {
  const v: Sig802Values = {}
  for (const s of steps) for (const f of s.fields) v[f.name] = f.type === 'choice' && f.multiple ? [] : ''
  return v
}

function validateField(f: Sig802Field, v: string | string[] | undefined, L: Sig802Labels): string | null {
  if (Array.isArray(v)) return f.required && v.length === 0 ? L.required : null
  const s = (v ?? '').trim()
  if (!s) return f.required ? L.required : null
  if (f.type === 'text' || f.type === 'tel' || f.type === 'email') {
    let ok = true
    if (f.pattern) {
      try {
        ok = new RegExp(`^(?:${f.pattern})$`, 'u').test(s)
      } catch {
        ok = true
      }
    } else if (f.type === 'tel') ok = PHONE_RE.test(s.replace(/[\s.\-()]/g, ''))
    else if (f.type === 'email') ok = EMAIL_RE.test(s)
    if (ok) return null
    return f.errorMessage ?? (f.type === 'tel' ? L.invalidPhone : f.type === 'email' ? L.invalidEmail : L.invalidFormat)
  }
  if (f.type === 'date') {
    if (Number.isNaN(Date.parse(s)) || (f.min && s < f.min)) return L.invalidDate
  }
  return null
}

function displayValue(f: Sig802Field, v: string | string[] | undefined): string {
  if (v === undefined) return ''
  const list = Array.isArray(v) ? v : [v]
  if (f.type === 'choice' || f.type === 'select') {
    return list.map((x) => f.options.find((o) => o.value === x)?.label ?? x).join(', ')
  }
  return list.join(', ')
}

/* ───────────────────────── Field view ───────────────────────── */

interface FieldViewProps {
  field: Sig802Field
  id: string
  value: string | string[]
  error?: string
  labels: Sig802Labels
  onChange: (v: string | string[]) => void
  setInputRef: (el: HTMLElement | null) => void
  setErrRef: (el: HTMLElement | null) => void
}

function FieldView({ field, id, value, error, labels, onChange, setInputRef, setErrRef }: FieldViewProps) {
  const errId = `${id}-err`
  const common = {
    'aria-invalid': error ? (true as const) : undefined,
    'aria-describedby': error ? errId : undefined,
    'aria-required': field.required ? (true as const) : undefined,
  }
  const str = Array.isArray(value) ? '' : value

  let control: React.ReactNode
  switch (field.type) {
    case 'text':
    case 'tel':
    case 'email':
      control = (
        <input
          {...common}
          ref={setInputRef}
          id={id}
          className="sig802-input"
          name={field.name}
          type={field.type}
          inputMode={field.type === 'tel' ? 'tel' : field.type === 'email' ? 'email' : undefined}
          value={str}
          placeholder={field.placeholder}
          autoComplete={field.autoComplete}
          onChange={(e) => onChange(e.target.value)}
        />
      )
      break
    case 'textarea':
      control = (
        <>
          <textarea
            {...common}
            ref={setInputRef}
            id={id}
            className="sig802-input sig802-textarea"
            name={field.name}
            value={str}
            maxLength={field.maxLength}
            onChange={(e) => onChange(e.target.value)}
          />
          {field.maxLength ? (
            <span className="sig802-count" aria-hidden="true">
              {str.length}/{field.maxLength}
            </span>
          ) : null}
        </>
      )
      break
    case 'date':
      control = (
        <input
          {...common}
          ref={setInputRef}
          id={id}
          className="sig802-input"
          name={field.name}
          type="date"
          min={field.min}
          value={str}
          onChange={(e) => onChange(e.target.value)}
        />
      )
      break
    case 'select':
      control = (
        <select {...common} ref={setInputRef} id={id} className="sig802-input" name={field.name} value={str} onChange={(e) => onChange(e.target.value)}>
          <option value="">{labels.selectPlaceholder}</option>
          {field.options.map((o) => (
            <option key={o.value} value={o.value}>
              {o.label}
            </option>
          ))}
        </select>
      )
      break
    case 'choice': {
      const multi = !!field.multiple
      const arr = Array.isArray(value) ? value : []
      return (
        <fieldset className="sig802-field sig802-choice" aria-describedby={error ? errId : undefined}>
          <legend className="sig802-label">{field.label}</legend>
          <div className="sig802-chips">
            {field.options.map((o, i) => (
              <label key={o.value} className="sig802-chip">
                <input
                  ref={i === 0 ? setInputRef : undefined}
                  type={multi ? 'checkbox' : 'radio'}
                  name={field.name}
                  value={o.value}
                  checked={multi ? arr.includes(o.value) : value === o.value}
                  aria-invalid={error ? true : undefined}
                  onChange={(e) => {
                    if (multi) onChange(e.target.checked ? [...arr, o.value] : arr.filter((x) => x !== o.value))
                    else onChange(o.value)
                  }}
                />
                <span>{o.label}</span>
              </label>
            ))}
          </div>
          {error && (
            <p ref={setErrRef} id={errId} className="sig802-err">
              {error}
            </p>
          )}
        </fieldset>
      )
    }
  }

  return (
    <div className="sig802-field">
      <label className="sig802-label" htmlFor={id}>
        {field.label}
      </label>
      <div className="sig802-control">{control}</div>
      {error && (
        <p ref={setErrRef} id={errId} className="sig802-err">
          {error}
        </p>
      )}
    </div>
  )
}

/* ───────────────────────── Component ───────────────────────── */

export function Sig802MultiStepForm({
  id,
  className,
  intensity = 2,
  eyebrow,
  heading,
  intro,
  steps,
  submitLabel,
  onSubmit,
  success,
  labels,
}: Sig802Props) {
  const L: Sig802Labels = { ...DEFAULT_LABELS, ...labels }
  const uid = useId()
  const total = steps.length
  const last = total - 1

  const root = useRef<HTMLElement>(null)
  const vpRef = useRef<HTMLDivElement>(null)
  const panelRefs = useRef<(HTMLElement | null)[]>([])
  const headingRefs = useRef<(HTMLElement | null)[]>([])
  const inputRefs = useRef<Record<string, HTMLElement | null>>({})
  const errRefs = useRef<Record<string, HTMLElement | null>>({})
  const successTitle = useRef<HTMLHeadingElement>(null)
  const stepRef = useRef(0)
  const modeRef = useRef<Mode>('desktop')
  const tlRef = useRef<gsap.core.Timeline | null>(null)
  const finishRef = useRef<(() => void) | null>(null)
  const focusName = useRef<string | null>(null)
  const focusHead = useRef(false)
  const prevErrKeys = useRef<string[]>([])
  const pendingRef = useRef(false)
  const alive = useRef(true)

  const [ready, setReady] = useState(false)
  const [step, setStep] = useState(0)
  const [values, setValues] = useState<Sig802Values>(() => initialValues(steps))
  const [errors, setErrors] = useState<Record<string, string>>({})
  const [pending, setPending] = useState(false)
  const [submitError, setSubmitError] = useState<string | null>(null)
  const [submitted, setSubmitted] = useState(false)
  const [snapshot, setSnapshot] = useState<Sig802Values>({})
  const [announce, setAnnounce] = useState('')

  /** Progress fills: connector lines (desktop) + one bar (mobile). Transform only. */
  const paintProgress = (to: number, animate: boolean) => {
    const el = root.current
    if (!el) return
    const d = animate && modeRef.current !== 'reduced' ? 0.3 : 0
    el.querySelectorAll<HTMLElement>('.sig802-fill').forEach((f, i) => {
      gsap.to(f, { scaleX: i < to ? 1 : 0, duration: d, ease: 'power2.inOut', overwrite: 'auto' })
    })
    const m = el.querySelector<HTMLElement>('.sig802-mfill')
    if (m) gsap.to(m, { scaleX: (to + 1) / Math.max(1, total), duration: d, ease: 'power2.inOut', overwrite: 'auto' })
  }

  const { contextSafe } = useGSAP(
    () => {
      const mm = gsap.matchMedia()
      mm.add(
        {
          reduce: '(prefers-reduced-motion: reduce)',
          mobile: '(max-width: 767px) and (prefers-reduced-motion: no-preference)',
          desktop: '(min-width: 768px) and (prefers-reduced-motion: no-preference)',
        },
        (ctx) => {
          const c = ctx.conditions as { reduce: boolean; mobile: boolean; desktop: boolean }
          modeRef.current = c.reduce ? 'reduced' : c.mobile ? 'mobile' : 'desktop'
        },
      )
      return () => mm.revert()
    },
    { scope: root },
  )

  /** Slide / fade between steps. Never blocks input: a new call finishes the running one first. */
  const goTo = contextSafe((to: number) => {
    const from = stepRef.current
    if (to === from || to < 0 || to > last) return
    if (tlRef.current) {
      tlRef.current.kill()
      tlRef.current = null
      finishRef.current?.()
    }
    const prev = panelRefs.current[from]
    const next = panelRefs.current[to]
    const vp = vpRef.current
    stepRef.current = to
    setStep(to)
    setAnnounce(fmt(L.step, to + 1, total) + ' · ' + steps[to].title)
    paintProgress(to, true)
    if (!prev || !next || !vp) return

    const mode = modeRef.current
    const dir = to > from ? 1 : -1
    const h0 = vp.offsetHeight
    prev.setAttribute('inert', '')
    prev.style.pointerEvents = 'none'

    if (mode === 'reduced') {
      prev.hidden = true
      prev.style.pointerEvents = ''
      next.hidden = false
      next.removeAttribute('inert')
      headingRefs.current[to]?.focus({ preventScroll: true })
      gsap.fromTo(next, { opacity: 0 }, { opacity: 1, duration: 0.15, ease: 'none', clearProps: 'opacity' })
      return
    }

    const dist = (mode === 'mobile' ? 16 : 56) * DIST[intensity]
    vp.style.height = `${h0}px`
    vp.style.overflow = 'hidden'
    next.hidden = false
    next.removeAttribute('inert')
    const h1 = next.offsetHeight
    gsap.set(next, { opacity: 0, x: dir * dist })
    headingRefs.current[to]?.focus({ preventScroll: true })

    const finish = () => {
      prev.hidden = true
      prev.style.pointerEvents = ''
      gsap.set([prev, next], { clearProps: 'transform,opacity' })
      vp.style.height = ''
      vp.style.overflow = ''
      if (finishRef.current === finish) finishRef.current = null
    }
    finishRef.current = finish
    tlRef.current = gsap
      .timeline({
        onComplete: () => {
          tlRef.current = null
          finish()
        },
      })
      .to(prev, { x: -dir * dist * 0.6, opacity: 0, duration: 0.16, ease: 'power2.in' }, 0)
      .to(next, { x: 0, opacity: 1, duration: 0.26, ease: 'power3.out' }, 0.08)
      .to(vp, { height: h1, duration: 0.3, ease: 'power2.inOut' }, 0)
  })

  const animateErr = contextSafe((el: HTMLElement) => {
    if (modeRef.current === 'reduced') return
    gsap.fromTo(
      el,
      { height: 0, opacity: 0, overflow: 'hidden' },
      { height: 'auto', opacity: 1, duration: 0.2, ease: 'power2.out', clearProps: 'height,overflow,opacity' },
    )
  })

  // Mount: from "all steps stacked" (no-JS markup) to the stepped version.
  useLayoutEffect(() => {
    alive.current = true
    setReady(true)
    return () => {
      alive.current = false
    }
  }, [])

  useLayoutEffect(() => {
    if (!ready) return
    if (submitted) {
      successTitle.current?.focus({ preventScroll: true })
      return
    }
    panelRefs.current.forEach((p, i) => {
      if (!p) return
      const active = i === stepRef.current
      p.hidden = !active
      if (active) p.removeAttribute('inert')
      else p.setAttribute('inert', '')
    })
    paintProgress(stepRef.current, false)
    if (focusHead.current) {
      focusHead.current = false
      headingRefs.current[0]?.focus({ preventScroll: true })
    }
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [ready, submitted])

  // Errors: slide open new messages, move focus to the first invalid field.
  useLayoutEffect(() => {
    const keys = Object.keys(errors)
    for (const k of keys) {
      if (!prevErrKeys.current.includes(k)) {
        const el = errRefs.current[k]
        if (el) animateErr(el)
      }
    }
    prevErrKeys.current = keys
    if (focusName.current) {
      inputRefs.current[focusName.current]?.focus()
      focusName.current = null
    }
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [errors])

  // Success state: check icon draws itself (final state is in the markup).
  useGSAP(
    () => {
      if (!submitted) return
      const mm = gsap.matchMedia()
      mm.add(
        {
          motion: '(prefers-reduced-motion: no-preference)',
          mobile: '(max-width: 767px)',
        },
        (ctx) => {
          const mobile = (ctx.conditions as { motion: boolean; mobile: boolean }).mobile
          const tl = gsap.timeline({ defaults: { ease: 'power2.out' } })
          tl.from('.sig802-success', { opacity: 0, y: mobile ? 10 : 18, duration: 0.3 }, 0)
            .fromTo('.sig802-ring', { strokeDashoffset: 1.02 }, { strokeDashoffset: 0, duration: 0.5, ease: 'power2.inOut' }, 0.05)
            .fromTo('.sig802-tick', { strokeDashoffset: 1.02 }, { strokeDashoffset: 0, duration: 0.3, ease: 'power2.out' }, 0.35)
            .from('.sig802-sumrow', { opacity: 0, y: 8, duration: 0.25, stagger: 0.04 }, 0.4)
        },
      )
      return () => mm.revert()
    },
    { scope: root, dependencies: [submitted] },
  )

  const setValue = (name: string, v: string | string[]) => {
    setValues((p) => ({ ...p, [name]: v }))
    setErrors((p) => {
      if (!p[name]) return p
      const n = { ...p }
      delete n[name]
      return n
    })
  }

  const validateStep = (i: number) => {
    const errs: Record<string, string> = {}
    let first: string | null = null
    for (const f of steps[i].fields) {
      const m = validateField(f, values[f.name], L)
      if (m) {
        errs[f.name] = m
        first ??= f.name
      }
    }
    return { errs, first }
  }

  const doSubmit = async () => {
    if (pendingRef.current) return
    // Validate every step (a step could have been left invalid); jump to the first one that is.
    const all: Record<string, string> = {}
    let firstStep = -1
    let firstName: string | null = null
    steps.forEach((_, i) => {
      const { errs, first } = validateStep(i)
      Object.assign(all, errs)
      if (first && firstStep < 0) {
        firstStep = i
        firstName = first
      }
    })
    if (firstStep >= 0) {
      focusName.current = firstName
      setErrors(all)
      if (firstStep !== stepRef.current) goTo(firstStep)
      return
    }
    pendingRef.current = true
    setPending(true)
    setSubmitError(null)
    try {
      await onSubmit(values)
      if (!alive.current) return
      setSnapshot(values)
      setSubmitted(true)
    } catch {
      if (alive.current) setSubmitError(L.submitError)
    } finally {
      pendingRef.current = false
      if (alive.current) setPending(false)
    }
  }

  const handleSubmit = (e: FormEvent) => {
    e.preventDefault()
    if (!ready) return
    if (step < last) {
      const { errs, first } = validateStep(step)
      if (first) {
        focusName.current = first
        setErrors((p) => ({ ...p, ...errs }))
        return
      }
      goTo(step + 1)
    } else {
      void doSubmit()
    }
  }

  const reset = () => {
    if (tlRef.current) {
      tlRef.current.kill()
      tlRef.current = null
    }
    finishRef.current = null
    stepRef.current = 0
    prevErrKeys.current = []
    focusHead.current = true
    setStep(0)
    setValues(initialValues(steps))
    setErrors({})
    setSnapshot({})
    setSubmitError(null)
    setAnnounce('')
    setSubmitted(false)
  }

  const baseId = `sig802-${uid}`
  const headId = `${baseId}-h`
  const isLast = step === last
  const primaryLabel = ready && !isLast ? L.next : (submitLabel ?? L.submit)

  const summary = steps.flatMap((s) =>
    s.fields
      .map((f) => ({ key: f.name, label: f.label, text: displayValue(f, snapshot[f.name]) }))
      .filter((r) => r.text.trim() !== ''),
  )

  return (
    <section
      id={id}
      ref={root}
      className={['sig802', className].filter(Boolean).join(' ')}
      data-ready={ready ? 'true' : 'false'}
      aria-labelledby={headId}
      style={{
        position: 'relative',
        background: 'var(--sig-bg, #0e0e0e)',
        color: 'var(--sig-fg, #f4efe8)',
        fontFamily: 'var(--sig-font-body, system-ui, sans-serif)',
        scrollMarginTop: 'var(--header-h, 0px)',
      }}
    >
      <div className="sig802-wrap">
        <header className="sig802-head">
          {eyebrow && <p className="sig802-eyebrow">{eyebrow}</p>}
          <h2 id={headId} className="sig802-title">
            {heading}
          </h2>
          {intro && <p className="sig802-intro">{intro}</p>}
        </header>

        <div className="sig802-card">
          {submitted ? (
            <div className="sig802-success">
              <svg className="sig802-icon" viewBox="0 0 48 48" width="72" height="72" fill="none" aria-hidden="true" focusable="false">
                <circle className="sig802-ring" cx="24" cy="24" r="22" pathLength={1} />
                <path className="sig802-tick" d="M14 25.5l7 7 13-15" pathLength={1} />
              </svg>
              <h3 ref={successTitle} tabIndex={-1} className="sig802-stitle">
                {success.title}
              </h3>
              {success.text && <p className="sig802-stext">{success.text}</p>}
              {summary.length > 0 && (
                <div className="sig802-summary">
                  <p className="sig802-sumhead">{L.summaryTitle}</p>
                  <dl>
                    {summary.map((r) => (
                      <div className="sig802-sumrow" key={r.key}>
                        <dt>{r.label}</dt>
                        <dd>{r.text}</dd>
                      </div>
                    ))}
                  </dl>
                </div>
              )}
              <button type="button" className="sig802-btn sig802-btn-ghost" onClick={reset}>
                {L.reset}
              </button>
            </div>
          ) : (
            <form noValidate onSubmit={handleSubmit} aria-labelledby={headId}>
              <ol className="sig802-steps" aria-label={L.stepsNav}>
                {steps.map((s, i) => {
                  const state = i < step ? 'done' : i === step ? 'current' : 'todo'
                  return (
                    <li key={s.id} className="sig802-stepitem" data-state={state} aria-current={i === step ? 'step' : undefined}>
                      <span className="sig802-dot" aria-hidden="true">
                        {state === 'done' ? (
                          <svg viewBox="0 0 16 16" width="14" height="14" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
                            <path d="M3.5 8.5l3 3 6-7" />
                          </svg>
                        ) : (
                          i + 1
                        )}
                      </span>
                      <span className="sig802-steptitle">{s.title}</span>
                      {i < last && (
                        <span className="sig802-line" aria-hidden="true">
                          <span className="sig802-fill" />
                        </span>
                      )}
                    </li>
                  )
                })}
              </ol>
              <div className="sig802-mprog" aria-hidden="true">
                <div className="sig802-mtext">
                  <strong>{fmt(L.step, step + 1, total)}</strong>
                  <span>{steps[step]?.title}</span>
                </div>
                <div className="sig802-mtrack">
                  <span className="sig802-mfill" />
                </div>
              </div>

              <div className="sig802-vp" ref={vpRef}>
                {steps.map((s, i) => (
                  <section key={s.id} ref={(el) => void (panelRefs.current[i] = el)} className="sig802-panel" aria-labelledby={`${baseId}-s${i}`}>
                    <h3 id={`${baseId}-s${i}`} ref={(el) => void (headingRefs.current[i] = el)} tabIndex={-1} className="sig802-stephead">
                      {s.title}
                    </h3>
                    {s.description && <p className="sig802-stepdesc">{s.description}</p>}
                    <div className="sig802-fields">
                      {s.fields.map((f) => (
                        <FieldView
                          key={f.name}
                          field={f}
                          id={`${baseId}-${f.name}`}
                          value={values[f.name] ?? (f.type === 'choice' && f.multiple ? [] : '')}
                          error={errors[f.name]}
                          labels={L}
                          onChange={(v) => setValue(f.name, v)}
                          setInputRef={(el) => void (inputRefs.current[f.name] = el)}
                          setErrRef={(el) => void (errRefs.current[f.name] = el)}
                        />
                      ))}
                    </div>
                  </section>
                ))}
              </div>

              {submitError && (
                <p role="alert" className="sig802-err sig802-suberr">
                  {submitError}
                </p>
              )}

              <div className="sig802-actions">
                <button type="submit" className="sig802-btn sig802-btn-primary" aria-disabled={pending || undefined} aria-busy={pending || undefined}>
                  {pending && <span className="sig802-spin" aria-hidden="true" />}
                  {pending ? L.sending : primaryLabel}
                </button>
                {ready && step > 0 && (
                  <button type="button" className="sig802-btn sig802-btn-ghost" onClick={() => goTo(step - 1)}>
                    {L.back}
                  </button>
                )}
              </div>
            </form>
          )}
        </div>

        <div className="sig802-sr" role="status" aria-live="polite">
          {announce}
        </div>
      </div>

      <style>{`
        .sig802 { padding: clamp(56px, 9vw, 120px) 24px; box-sizing: border-box; }
        .sig802 *, .sig802 *::before, .sig802 *::after { box-sizing: border-box; }
        .sig802-wrap { max-width: 760px; margin: 0 auto; }
        .sig802-head { margin: 0 0 clamp(24px, 4vw, 40px); }
        .sig802-eyebrow { margin: 0 0 14px; font-size: 12px; font-weight: 600; letter-spacing: 0.25em; text-transform: uppercase; color: var(--sig-accent, #e0a25b); }
        .sig802-title { margin: 0; font-family: var(--sig-font-display, serif); font-weight: 500; font-size: clamp(2rem, 5vw, 3.5rem); line-height: 1.08; letter-spacing: -0.02em; text-wrap: balance; }
        .sig802-intro { margin: 16px 0 0; max-width: 34em; font-size: 17px; line-height: 1.55; color: var(--sig-muted, color-mix(in oklab, var(--sig-fg, #f4efe8) 60%, transparent)); }
        .sig802-card {
          padding: clamp(20px, 4vw, 40px); border-radius: 24px;
          border: 1px solid color-mix(in oklab, var(--sig-fg, #f4efe8) 14%, transparent);
          background: color-mix(in oklab, var(--sig-fg, #f4efe8) 4%, var(--sig-bg, #0e0e0e));
        }
        .sig802-sr { position: absolute; width: 1px; height: 1px; margin: -1px; padding: 0; border: 0; overflow: hidden; clip: rect(0 0 0 0); clip-path: inset(50%); white-space: nowrap; }

        /* Stepper — hidden until mounted (without JS all steps are stacked, a stepper would mislead) */
        .sig802-steps, .sig802-mprog { display: none; }
        .sig802[data-ready='true'] .sig802-steps { display: flex; list-style: none; margin: 0 0 clamp(20px, 3vw, 32px); padding: 0; align-items: center; }
        .sig802-stepitem { display: flex; align-items: center; min-width: 0; }
        .sig802-stepitem:not(:last-child) { flex: 1 1 0; }
        .sig802-dot {
          flex: none; width: 32px; height: 32px; border-radius: 50%; display: inline-grid; place-items: center;
          font-size: 14px; font-weight: 600;
          border: 1.5px solid color-mix(in oklab, var(--sig-fg, #f4efe8) 28%, transparent);
          color: var(--sig-muted, color-mix(in oklab, var(--sig-fg, #f4efe8) 60%, transparent));
          transition: background-color 0.25s, color 0.25s, border-color 0.25s;
        }
        .sig802-stepitem[data-state='current'] .sig802-dot { border-color: var(--sig-accent, #e0a25b); color: var(--sig-accent, #e0a25b); }
        .sig802-stepitem[data-state='done'] .sig802-dot { background: var(--sig-accent, #e0a25b); border-color: var(--sig-accent, #e0a25b); color: var(--sig-bg, #0e0e0e); }
        .sig802-steptitle { margin-left: 10px; font-size: 14px; font-weight: 500; white-space: nowrap; color: var(--sig-muted, color-mix(in oklab, var(--sig-fg, #f4efe8) 60%, transparent)); transition: color 0.25s; }
        .sig802-stepitem[data-state='current'] .sig802-steptitle { color: var(--sig-fg, #f4efe8); }
        .sig802-line { position: relative; flex: 1 1 24px; height: 2px; margin: 0 14px; overflow: hidden; background: color-mix(in oklab, var(--sig-fg, #f4efe8) 16%, transparent); }
        .sig802-fill, .sig802-mfill { position: absolute; inset: 0; background: var(--sig-accent, #e0a25b); transform: scaleX(0); transform-origin: 0 50%; }

        .sig802-mtext { display: flex; justify-content: space-between; gap: 12px; align-items: baseline; font-size: 14px; margin-bottom: 10px; }
        .sig802-mtext span { color: var(--sig-muted, color-mix(in oklab, var(--sig-fg, #f4efe8) 60%, transparent)); text-align: right; }
        .sig802-mtrack { position: relative; height: 3px; overflow: hidden; border-radius: 2px; background: color-mix(in oklab, var(--sig-fg, #f4efe8) 16%, transparent); }

        /* Panels: stacked in flow without JS, overlaid in one grid cell once mounted */
        .sig802-vp { display: grid; row-gap: 40px; position: relative; }
        .sig802[data-ready='true'] .sig802-vp { row-gap: 0; }
        .sig802[data-ready='true'] .sig802-panel { grid-area: 1 / 1; }
        .sig802-panel { min-width: 0; align-self: start; }
        .sig802-panel[hidden] { display: none; }
        .sig802-stephead { margin: 0; font-family: var(--sig-font-display, serif); font-size: clamp(1.35rem, 2.6vw, 1.75rem); font-weight: 500; letter-spacing: -0.01em; outline: none; }
        .sig802-stepdesc { margin: 8px 0 0; font-size: 15px; line-height: 1.55; color: var(--sig-muted, color-mix(in oklab, var(--sig-fg, #f4efe8) 60%, transparent)); }
        .sig802-fields { display: grid; gap: 22px; margin-top: 22px; }

        .sig802-field { margin: 0; padding: 0; border: 0; min-width: 0; position: relative; }
        .sig802-label { display: block; padding: 0; margin: 0 0 8px; font-size: 15px; font-weight: 500; }
        .sig802-input {
          display: block; width: 100%; min-height: 48px; padding: 0 14px; border-radius: 12px; margin: 0;
          font: inherit; font-size: 16px; color: var(--sig-fg, #f4efe8);
          background: color-mix(in oklab, var(--sig-fg, #f4efe8) 5%, transparent);
          border: 1px solid color-mix(in oklab, var(--sig-fg, #f4efe8) 24%, transparent);
          transition: border-color 0.2s, background-color 0.2s;
          color-scheme: dark light;
        }
        .sig802-input::placeholder { color: color-mix(in oklab, var(--sig-fg, #f4efe8) 40%, transparent); }
        .sig802-textarea { min-height: 120px; padding: 12px 14px; resize: vertical; line-height: 1.5; }
        .sig802-count { display: block; margin-top: 6px; text-align: right; font-size: 13px; color: var(--sig-muted, color-mix(in oklab, var(--sig-fg, #f4efe8) 55%, transparent)); }
        .sig802-input:focus-visible, .sig802-btn:focus-visible { outline: 2px solid var(--sig-accent, #e0a25b); outline-offset: 2px; }
        .sig802-input[aria-invalid='true'] { border-color: var(--sig-danger, #ef6f5e); }
        .sig802-err { margin: 8px 0 0; font-size: 14px; line-height: 1.4; color: var(--sig-danger, #ef6f5e); }
        .sig802-suberr { margin: 20px 0 0; }

        .sig802-chips { display: flex; flex-wrap: wrap; gap: 10px; }
        .sig802-chip { position: relative; display: inline-flex; }
        .sig802-chip input { position: absolute; inset: 0; width: 100%; height: 100%; margin: 0; opacity: 0; cursor: pointer; }
        .sig802-chip span {
          display: inline-flex; align-items: center; gap: 8px; min-height: 44px; padding: 0 18px; border-radius: 999px;
          font-size: 16px; line-height: 1.2;
          border: 1px solid color-mix(in oklab, var(--sig-fg, #f4efe8) 26%, transparent);
          transition: border-color 0.2s, background-color 0.2s;
        }
        .sig802-chip input:checked + span { border-color: var(--sig-accent, #e0a25b); background: color-mix(in oklab, var(--sig-accent, #e0a25b) 16%, transparent); }
        .sig802-chip input:checked + span::before { content: '\\2713'; font-size: 14px; color: var(--sig-accent, #e0a25b); }
        .sig802-chip input:focus-visible + span { outline: 2px solid var(--sig-accent, #e0a25b); outline-offset: 2px; }
        .sig802-chip input[aria-invalid='true'] + span { border-color: var(--sig-danger, #ef6f5e); }

        .sig802-actions { display: flex; flex-direction: row-reverse; justify-content: space-between; align-items: center; gap: 12px; margin-top: 28px; }
        .sig802-btn {
          display: inline-flex; align-items: center; justify-content: center; gap: 10px; min-height: 48px; padding: 0 28px; border-radius: 999px;
          font: inherit; font-size: 16px; font-weight: 600; cursor: pointer; border: 1px solid transparent;
          transition: filter 0.2s, background-color 0.2s, border-color 0.2s;
        }
        .sig802-btn-primary { background: var(--sig-accent, #e0a25b); color: var(--sig-bg, #0e0e0e); }
        .sig802-btn-primary:hover { filter: brightness(1.08); }
        .sig802-btn-primary[aria-disabled='true'] { cursor: progress; opacity: 0.75; }
        .sig802-btn-ghost { background: transparent; color: var(--sig-fg, #f4efe8); border-color: color-mix(in oklab, var(--sig-fg, #f4efe8) 28%, transparent); }
        .sig802-btn-ghost:hover { border-color: var(--sig-fg, #f4efe8); }
        .sig802-spin { width: 16px; height: 16px; border-radius: 50%; border: 2px solid currentColor; border-right-color: transparent; animation: sig802-rot 0.7s linear infinite; }
        @keyframes sig802-rot { to { transform: rotate(360deg); } }

        .sig802-success { display: flex; flex-direction: column; align-items: center; text-align: center; padding: clamp(8px, 2vw, 24px) 0; }
        .sig802-icon { color: var(--sig-accent, #e0a25b); }
        .sig802-ring, .sig802-tick { stroke: currentColor; stroke-width: 2.5; stroke-linecap: round; stroke-linejoin: round; stroke-dasharray: 1 1; stroke-dashoffset: 0; }
        .sig802-stitle { margin: 20px 0 0; font-family: var(--sig-font-display, serif); font-weight: 500; font-size: clamp(1.6rem, 3.4vw, 2.25rem); line-height: 1.15; outline: none; }
        .sig802-stext { margin: 12px 0 0; max-width: 30em; font-size: 16px; line-height: 1.55; color: var(--sig-muted, color-mix(in oklab, var(--sig-fg, #f4efe8) 60%, transparent)); }
        .sig802-summary { width: 100%; margin: 28px 0; padding: 18px 20px; text-align: left; border-radius: 16px; border: 1px solid color-mix(in oklab, var(--sig-fg, #f4efe8) 14%, transparent); }
        .sig802-sumhead { margin: 0 0 10px; font-size: 12px; font-weight: 600; letter-spacing: 0.2em; text-transform: uppercase; color: var(--sig-accent, #e0a25b); }
        .sig802-summary dl { margin: 0; }
        .sig802-sumrow { display: grid; grid-template-columns: minmax(0, 0.8fr) minmax(0, 1.4fr); gap: 16px; padding: 8px 0; font-size: 15px; }
        .sig802-sumrow + .sig802-sumrow { border-top: 1px solid color-mix(in oklab, var(--sig-fg, #f4efe8) 10%, transparent); }
        .sig802-sumrow dt { color: var(--sig-muted, color-mix(in oklab, var(--sig-fg, #f4efe8) 60%, transparent)); }
        .sig802-sumrow dd { margin: 0; overflow-wrap: anywhere; }

        @media (max-width: 767px) {
          .sig802 { padding: 48px 16px; }
          .sig802-card { border-radius: 20px; padding: 20px 16px; }
          .sig802[data-ready='true'] .sig802-steps { display: none; }
          .sig802[data-ready='true'] .sig802-mprog { display: block; margin-bottom: 22px; }
          .sig802-actions { flex-direction: column; align-items: stretch; }
          .sig802-btn { width: 100%; }
          .sig802-sumrow { grid-template-columns: 1fr; gap: 2px; }
        }
        @media (prefers-reduced-motion: reduce) {
          .sig802 * { transition: none !important; }
          .sig802-spin { animation: none; border-right-color: currentColor; }
        }
      `}</style>
    </section>
  )
}

export default Sig802MultiStepForm
