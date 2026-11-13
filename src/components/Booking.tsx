import { Sig802MultiStepForm, type Sig802Step, type Sig802Values } from './signature/SIG-802/SIG-802'
import { booking, bookingSteps, contact, services, combo } from '../data/site'

const today = new Date().toISOString().slice(0, 10)

const steps: Sig802Step[] = [
  {
    id: 'dich-vu',
    title: 'Dịch vụ',
    description: 'Hôm nay bạn muốn chăm tầng nào? Chọn một dịch vụ, Miên tư vấn thêm khi bạn đến.',
    fields: [
      {
        type: 'choice',
        name: 'service',
        label: 'Dịch vụ',
        required: true,
        options: [
          ...services.map((s) => ({ value: s.name, label: `${s.name} — ${s.from}` })),
          { value: combo.name, label: `${combo.name} — ${combo.price} / ${combo.duration}` },
          { value: 'Cần tư vấn', label: 'Chưa chắc, cần tư vấn' },
        ],
      },
    ],
  },
  {
    id: 'thoi-gian',
    title: 'Thời gian',
    description: `Bạn muốn đến lúc nào? Miên mở cửa ${contact.hours}.`,
    fields: [
      { type: 'date', name: 'date', label: 'Ngày', required: true, min: today },
      {
        type: 'select',
        name: 'time',
        label: 'Khung giờ',
        required: true,
        options: ['09:00 – 11:00', '11:00 – 13:00', '13:00 – 15:00', '15:00 – 17:00', '17:00 – 19:00', '19:00 – 21:00'].map((v) => ({ value: v, label: v })),
      },
    ],
  },
  {
    id: 'thong-tin',
    title: 'Thông tin',
    description: 'Miên liên hệ lại với bạn qua số này.',
    fields: [
      { type: 'text', name: 'name', label: 'Tên của bạn', required: true, autoComplete: 'name' },
      { type: 'tel', name: 'phone', label: 'Số điện thoại / Zalo', required: true, autoComplete: 'tel', pattern: '(\\+?84|0)[0-9 .]{8,12}', errorMessage: 'Số điện thoại chưa đúng' },
      { type: 'textarea', name: 'note', label: 'Ghi chú (không bắt buộc)', maxLength: 300 },
    ],
  },
]

function toMessage(v: Sig802Values): string {
  const s = (k: string) => (Array.isArray(v[k]) ? (v[k] as string[]).join(', ') : (v[k] as string) ?? '')
  return [
    'Chào Miên Spa, mình muốn đặt lịch:',
    `- Dịch vụ: ${s('service')}`,
    `- Ngày: ${s('date')} · ${s('time')}`,
    `- Tên: ${s('name')} · SĐT: ${s('phone')}`,
    s('note') ? `- Ghi chú: ${s('note')}` : '',
  ].filter(Boolean).join('\n')
}

/**
 * No backend: the form composes the booking message, copies it, and opens Zalo (zalo.me does not accept
 * prefilled text, so the visitor pastes it). Phone + Zalo stay visible beside the form at every step.
 */
export function Booking() {
  const onSubmit = (v: Sig802Values) => {
    const msg = toMessage(v)
    window.open(contact.zaloHref, '_blank', 'noopener')
    return navigator.clipboard?.writeText(msg).catch(() => undefined)
  }

  return (
    <section id="dat-lich" aria-labelledby="dat-lich-title" className="section-y bg-cream">
      <div className="wrap grid gap-10 lg:grid-cols-[minmax(0,0.9fr)_minmax(0,1.1fr)] lg:gap-14">
        <div>
          <h2 id="dat-lich-title" className="h2">{booking.heading}</h2>
          <p className="lead mt-3">{booking.intro}</p>

          <ol className="mt-7 grid gap-4">
            {bookingSteps.map((st, i) => (
              <li key={st.title} className="flex gap-4">
                <span aria-hidden="true" className="grid h-9 w-9 shrink-0 place-items-center rounded-full bg-clay-deep font-semibold text-night">{i + 1}</span>
                <div>
                  <h3 className="font-semibold text-ink">{st.title}</h3>
                  <p className="mt-0.5 text-[0.98rem] text-ink/85">{st.text}</p>
                </div>
              </li>
            ))}
          </ol>

          <div className="mt-8 rounded-2xl bg-paper p-5">
            <p className="text-[0.95rem] text-cocoa">Gọi hoặc nhắn Zalo</p>
            <a href={contact.phoneHref} className="font-display mt-1 block text-[2.25rem] font-semibold leading-none text-ink hover:text-clay-deep">{contact.phoneDisplay}</a>
            <div className="mt-4 flex flex-wrap gap-3">
              <a href={contact.zaloHref} target="_blank" rel="noreferrer" className="inline-flex min-h-11 items-center rounded-full bg-cream px-5 font-medium text-cocoa hover:bg-ink hover:text-night">Nhắn Zalo</a>
              <a href={contact.facebookHref} target="_blank" rel="noreferrer" className="inline-flex min-h-11 items-center rounded-full bg-cream px-5 font-medium text-cocoa hover:bg-ink hover:text-night">Facebook</a>
              <a href={contact.mapsHref} target="_blank" rel="noreferrer" className="inline-flex min-h-11 items-center rounded-full bg-cream px-5 font-medium text-cocoa hover:bg-ink hover:text-night">Chỉ đường</a>
            </div>
            <p className="mt-4 text-[0.95rem] text-ink">{contact.address} · {contact.hours}</p>
          </div>
        </div>

        <div className="booking-form">
          <Sig802MultiStepForm
            heading="Gửi yêu cầu đặt lịch"
            steps={steps}
            onSubmit={onSubmit}
            submitLabel="Gửi qua Zalo"
            success={{ title: booking.success.title, text: 'Nội dung đặt lịch đã được sao chép. Zalo của Miên đang mở, bạn chỉ cần dán và gửi. Nếu cần nhanh, hãy gọi ' + contact.phoneDisplay + '.' }}
          />
        </div>
      </div>
    </section>
  )
}
