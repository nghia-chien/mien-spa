import { brand, contact, nav } from '../data/site'
import { goTo } from '../lib/smooth'

const MAP_SRC = `https://www.google.com/maps?q=${encodeURIComponent('Miên Spa, 21 Điện Biên Phủ, Tuy Hòa')}&output=embed`

/** Compact footer: brand, contact, hours & links in plain columns (no cards, no rounded corners) + the map. */
export function Footer() {
  return (
    <footer className="bg-night text-[0.95rem] text-ink/90">
      <div className="wrap grid gap-8 py-10 md:grid-cols-2 lg:grid-cols-[1fr_1fr_1fr_1.4fr] lg:gap-10">
        <div>
          <img src={brand.logo} alt={brand.fullName} loading="lazy" className="h-12 w-auto brightness-0 invert" />
          <p className="font-display mt-2 text-[1.15rem] text-amber">{brand.tagline}</p>
          <p className="mt-2">Gội đầu dưỡng sinh, massage body, đá nóng, massage Thái, trị liệu cổ vai gáy.</p>
        </div>

        <div>
          <h2 className="text-[0.85rem] font-semibold uppercase tracking-wider text-amber">Liên hệ</h2>
          <ul className="mt-3 grid gap-1.5">
            <li>{contact.address}</li>
            <li><a href={contact.phoneHref} className="hover:text-amber">Hotline / Zalo: <span className="font-semibold">{contact.phoneDisplay}</span></a></li>
            <li>Mở cửa {contact.hours}</li>
            <li className="flex gap-4 pt-1">
              <a href={contact.facebookHref} target="_blank" rel="noreferrer" className="underline underline-offset-4 hover:text-amber">Facebook</a>
              <a href={contact.zaloHref} target="_blank" rel="noreferrer" className="underline underline-offset-4 hover:text-amber">Zalo</a>
              <a href={contact.mapsHref} target="_blank" rel="noreferrer" className="underline underline-offset-4 hover:text-amber">Chỉ đường</a>
            </li>
          </ul>
        </div>

        <div>
          <h2 className="text-[0.85rem] font-semibold uppercase tracking-wider text-amber">Xem nhanh</h2>
          <ul className="mt-3 grid gap-1.5">
            {[...nav, { id: 'dat-lich', label: 'Đặt lịch' }].map((n) => (
              <li key={n.id}>
                <a href={`#${n.id}`} onClick={(e) => { e.preventDefault(); goTo(n.id) }} className="hover:text-amber">{n.label}</a>
              </li>
            ))}
          </ul>
        </div>

        <iframe
          title={`Bản đồ ${contact.address}`}
          src={MAP_SRC}
          loading="lazy"
          referrerPolicy="no-referrer-when-downgrade"
          className="block h-52 w-full border-0 md:col-span-2 lg:col-span-1 lg:h-full lg:min-h-48"
        />
      </div>

      <div className="border-t border-ink/15">
        <p className="wrap py-4 text-[0.85rem] text-ink/70">© {brand.fullName} · {contact.address}</p>
      </div>
    </footer>
  )
}
