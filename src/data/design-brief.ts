// Visual source of truth for the Miên Spa Tuy Hòa phôi. Approved at the gate on 13/11/2026.

export type AxisScore = 2 | 3 | 4 | 5

export interface DesignBrief {
  metaphor: { name: string; idea: string; heroMoment: string; carriedThrough: string[] }
  entryMode: 'metaphor-first' | 'effects-first' | 'reference-first'
  axes: { concept: 4 | 5; motion: AxisScore; color: AxisScore; reason: string; approvedExceptions: string[] }
  floors: {
    signatures: { target: number; actual: number }
    pinScrub: { target: number; actual: number }
    transitions: { target: number; actual: number }
    plainRevealMaxPct: { target: number; actual: number }
    largeMetaphorMoments: { target: number; actual: number }
  }
  signatures: { id: string; version: string; section: string; intensity: 1 | 2 | 3 }[]
  reference: { source: string; scope: 'structure' | 'structure+aesthetics' } | null
  palette: { token: string; hex: string; role: string }[]
  typography: { display: string; body: string; notes: string }
  imagery: string
  layout: { family: string; sectionOrder: string[] }
  motion: { signature: string; motifs: string[]; effectIds: string[]; webgl: string | null }
  conversion: { primaryCta: string; channel: string; placement: string }
  avoid: string[]
}

export const designBrief: DesignBrief = {
  metaphor: {
    name: 'Thân · Tâm · Trí — ba tầng được chăm sóc',
    idea: 'Trang đi từ cơ thể vào tâm trí như một hơi thở ra; mỗi tầng một tông màu lấy từ không gian thật (đất nung → hổ phách → lá).',
    heroMoment: 'Vách kéo chia "Ngoài kia" (vai gáy nặng trĩu) và "Tại Miên" (thả lỏng); kéo vách để bước vào. Vách chéo bám theo chuột; cuộn xuống, ba dải màu Thân · Tâm · Trí mở màn (tự chạy, không ghim) cho section Về Miên.',
    carriedThrough: ['hero', 've-mien', 'ba-tang', 'dich-vu', 'combo', 'dat-lich'],
  },
  entryMode: 'effects-first',
  axes: {
    concept: 5,
    motion: 4,
    color: 3,
    reason: 'Bảng ngành Spa/massage: C4/M3/M3. Chủ dự án chỉ định 6 SIG (106, 208, 405 cần M4) và duyệt Motion 4; Concept 5 vì cả trang là một "thế giới" ba tầng.',
    approvedExceptions: [
      'Motion 4 vượt khung ngành (3) — chủ dự án chỉ định SIG-106/208/405 và duyệt ở cổng 13/11/2026',
      'Dùng SIG trạng thái draft (106, 208, 316, 405, 705, 802, 510) — chủ dự án "duyệt hết" ở cổng',
    ],
  },
  floors: {
    signatures: { target: 2, actual: 7 },
    pinScrub: { target: 2, actual: 3 }, // ComboPath (sticky+scrub), SIG-316 (sticky), SIG-510 (scrub) — mỗi kiểu ≤ 2 lần
    transitions: { target: 2, actual: 2 }, // màn ba dải mở ve-mien (timed) + Combo mở từ thẻ bo góc ra full (timed clip-path)
    plainRevealMaxPct: { target: 20, actual: 0 },
    largeMetaphorMoments: { target: 3, actual: 3 }, // vách chéo hero, màn ba dải kín màn, combo nền tối kín màn + đường thở
  },
  signatures: [
    { id: 'SIG-106', version: '1.0.0', section: 'preloader/header', intensity: 1 },
    { id: 'SIG-208', version: 'cast 13/11', section: 'hero', intensity: 2 },
    { id: 'SIG-316', version: 'cast 13/11', section: 'ba-tang', intensity: 2 },
    { id: 'SIG-405', version: 'cast 13/11', section: 'dich-vu', intensity: 2 },
    { id: 'SIG-705', version: 'cast 13/11', section: 'danh-gia', intensity: 1 },
    { id: 'SIG-510', version: '1.0.0 (đúc tay 13/11)', section: 'khong-gian', intensity: 2 },
    { id: 'SIG-802', version: '1.0.0', section: 'dat-lich', intensity: 1 },
  ],
  reference: { source: 'public/layout/image.png (bộ mẫu spa Canva)', scope: 'structure+aesthetics' },
  palette: [
    { token: 'paper', hex: '#2b1d16', role: 'nền trang (nâu cà phê đậm — theo ảnh tham khảo của chủ dự án)' },
    { token: 'cream', hex: '#36261d', role: 'bề mặt nổi / dải xen kẽ' },
    { token: 'night', hex: '#1d130e', role: 'dải sâu nhất (Combo, footer)' },
    { token: 'ink', hex: '#f3e7d8', role: 'chữ chính' },
    { token: 'cocoa', hex: '#cdb6a0', role: 'chữ phụ' },
    { token: 'clay-deep', hex: '#d9a56b', role: 'CTA / nhấn (vàng đồng, chữ tối trên nút)' },
    { token: 'amber', hex: '#e6b97c', role: 'điểm sáng (giá, thanh tiến trình)' },
  ],
  typography: { display: 'Noto Serif Display (trục width 62.5–100, có tiếng Việt) — h1/h2 IN HOA, hẹp 62.5%', body: 'Be Vietnam Pro', notes: 'Câu hai bên hero: Playfair Display nghiêng. Theo ảnh tham khảo public/layout/image.png (Reference Adaptation: nền nâu toàn trang + tiêu đề in hoa serif hẹp).' },
  imagery: 'Chỉ ảnh thật của spa (public/img). Khung ảnh chữ nhật bo nhẹ (1.25rem). CẤM khung vòm (luật chủ dự án). Không dùng ảnh poster có người mẫu stock/AI. Ảnh chỉ translate/scale, không lọc màu, không méo.',
  layout: { family: 'Premium / Experience, Sequential', sectionOrder: ['hero', 've-mien', 'ba-tang', 'dich-vu', 'combo', 'bang-gia', 'khong-gian', 'danh-gia', 'dat-lich', 'footer'] },
  motion: {
    signature: 'Ba dải màu Thân · Tâm · Trí kéo ra như mở rèm cho section Về Miên (tự chạy khi vào màn, không ghim).',
    motifs: ['ba dải màu tầng (chỉ ở màn mở)', 'đường thở uốn lượn nối các bước (combo: đường cong bezier, chữ bước 1–3 trên chấm, bước 4 bên trái chấm)'],
    effectIds: ['SCR-10', 'STORY-10'],
    webgl: null,
  },
  conversion: { primaryCta: 'Đặt lịch', channel: 'Form 3 bước → sao chép nội dung + mở Zalo 0847 177 968; nút gọi luôn hiện', placement: 'Header (cố định), hero, combo, bảng giá, đặt lịch' },
  avoid: ['dùng một kiểu hiệu ứng/bố cục động > 2 lần', 'đổi màu nền theo từng section/tầng (một nền chính + Combo/footer tối)', 'section kéo dài > ~1 viewport bằng padding/ghim', 'bố cục award bất đối xứng, chữ khổng lồ, khoảng trắng lớn', 'khung vòm / mặt nạ hình vòm (chủ dự án cấm, trừ khi yêu cầu)', 'nhịp nhanh, tương phản gắt', 'dịch vụ trị mụn/nám/trẻ hóa (không có trong bảng giá)', 'voucher', 'số sao tổng / số lượt đánh giá', 'ảnh poster người mẫu stock', 'chữ "cuối tuần" cho combo 599K'],
}
