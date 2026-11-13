// All copy, prices and contacts for Miên Spa Tuy Hòa.
// Sources: sale.md, "Miên Spa Tuy Hòa.docx", the client's own price board (bảng giá mới) and posts,
// and owner answers at the gate (13/11/2026). Nothing here is invented.

export const brand = {
  name: 'Miên Spa',
  fullName: 'Miên Spa Tuy Hòa',
  tagline: 'Nơi tạo nguồn cảm xúc', // printed in the client's logo
  logo: '/img/logo-mask.png',
  /** Client logo (public/Miên Spa Tuy Hòa/logo/logo.png), cropped + recoloured cream for the dark header. */
  logoLight: '/img/logo-light.png',
}

export const contact = {
  phoneDisplay: '0847 177 968',
  phoneHref: 'tel:0847177968',
  zaloHref: 'https://zalo.me/0847177968',
  facebookHref: 'https://www.facebook.com/mienspa',
  mapsHref: 'https://maps.app.goo.gl/YjJXGN9mLf2oLAtw9',
  address: '21 Điện Biên Phủ, Phường Tuy Hòa, Đắk Lắk',
  hours: '09:00 – 21:00 · mở cửa mỗi ngày',
}

export const nav = [
  { id: 've-mien', label: 'Về Miên' },
  { id: 'dich-vu', label: 'Dịch vụ' },
  { id: 'bang-gia', label: 'Bảng giá' },
  { id: 'danh-gia', label: 'Đánh giá' },
]

export const primaryCta = { label: 'Đặt lịch', target: 'dat-lich' }

/* ── Hero: two moods split by a draggable wall (SIG-208) ─────────────────── */
export const hero = {
  before: {
    kicker: '',
    title: 'Ngoài kia: một ngày dài, vai gáy nặng trĩu.',
    image: { src: '/img/ba-tang.jpg', alt: 'Cô gái áo cam đứng bên cửa sổ, vẻ trầm ngâm' },
  },
  after: {
    kicker: '',
    title: 'Tại Miên: thả lỏng thân, lắng tâm, sáng trí.',
    image: { src: '/img/tri.jpg', alt: 'Khách nằm thư giãn, mắt nhắm, tại Miên Spa' },
  },
  lead: 'Gội đầu dưỡng sinh, massage body, đá nóng, massage Thái và trị liệu cổ vai gáy tại 21 Điện Biên Phủ, Tuy Hòa.',
  dragHint: 'Kéo vách để bước vào Miên',
  facts: ['Mở cửa 09:00 – 21:00 mỗi ngày', '21 Điện Biên Phủ, Tuy Hòa'],
}

/* ── Về Miên — docx §1 (giới thiệu, phong cách, cam kết) + sale.md USP ───────── */
export const about = {
  title: 'Về Miên Spa Tuy Hòa',
  lead: '',
  body: 'Không gian hướng đến cảm giác thư thái, gần gũi với thiên nhiên: cây xanh, gỗ ấm và ánh đèn vàng dịu. Mỗi dịch vụ đều rõ thời lượng, mức giá và quy trình; kỹ thuật viên tư vấn tận tình trước, trong và sau buổi chăm sóc.',
  points: [
    { title: 'Không gian chuyên nghiệp', text: 'Không gian và trải nghiệm chăm sóc được chuẩn bị chỉn chu, sạch sẽ, yên tĩnh.' },
    { title: 'Tư vấn theo tình trạng', text: 'Liệu trình được tư vấn theo tình trạng và nhu cầu của từng khách.' },
    { title: 'Chú trọng chất lượng', text: 'Chú trọng chất lượng dịch vụ và trải nghiệm của khách hàng.' },
    { title: 'Hỗ trợ tận tình', text: 'Tư vấn tận tình, hỗ trợ khách trong suốt quá trình sử dụng dịch vụ.' },
  ],
  images: [
    { src: '/img/doi-ngu.jpg', alt: 'Hai kỹ thuật viên của Miên Spa bên bình hoa ly' },
    { src: '/img/ktv-khan.jpg', alt: 'Kỹ thuật viên chuẩn bị khăn trên giường massage' },
    { src: '/img/sanh-hoa.jpg', alt: 'Sảnh đón khách với hoa cẩm tú cầu' },
  ],
}

/* ── Thân · Tâm · Trí (SIG-316) — the client's own words from their posts ── */
export const layers = [
  {
    no: '01',
    name: 'Thân',
    tone: 'clay',
    text: 'Cơ thể khỏe mạnh là nền tảng để bạn sống trọn vẹn. Các liệu trình tại Miên Spa như gội đầu dưỡng sinh, massage, xông hơi đá muối giúp thư giãn, giảm stress và nâng cao sức khỏe.',
    image: { src: '/img/than.jpg', alt: 'Kỹ thuật viên massage lưng cho khách' },
  },
  {
    no: '02',
    name: 'Tâm',
    tone: 'amber',
    text: 'Tâm hồn cũng cần được thư giãn. Liệu pháp tại Miên Spa giúp xoa dịu cơ thể, xóa bỏ lo âu và tìm lại sự bình yên.',
    image: { src: '/img/tam.jpg', alt: 'Cô gái áo cam giữa cây xanh, vẻ bình yên' },
  },
  {
    no: '03',
    name: 'Trí',
    tone: 'leaf',
    text: 'Tâm trí sáng suốt giúp bạn quyết đoán, làm việc hiệu quả và sống trọn vẹn. Chăm sóc trí óc là cách duy trì sự minh mẫn và sáng tạo.',
    image: { src: '/img/tri.jpg', alt: 'Khách nằm thư giãn, mắt nhắm' },
  },
] as const

/* ── Five main services (sale.md) as bento tiles (SIG-405).
   Descriptions: the client's own posters (Gội đầu, Cổ vai gáy, Massage thư giãn/trị liệu, Combo). ── */
export interface ServicePrice { name: string; time?: string; price: string; note?: string }
export const services: {
  id: string; layer: string; name: string; from: string; tagline: string; desc: string
  image: { src: string; alt: string }; prices: ServicePrice[]
}[] = [
  {
    id: 'goi-dau',
    layer: 'Trí',
    name: 'Gội đầu dưỡng sinh',
    from: 'từ 29K',
    tagline: 'Thư giãn từ da đầu, chữa lành từ tâm trí.',
    desc: 'Hương bồ kết, sả chanh thoang thoảng cùng tiếng nước róc rách. Thư giãn tinh thần, nuôi dưỡng da đầu, giảm căng thẳng mệt mỏi, ngủ ngon và sâu giấc hơn.',
    image: { src: '/img/goi-dau.jpg', alt: 'Kỹ thuật viên gội đầu dưỡng sinh cho khách' },
    prices: [
      { name: 'Gội nhanh em bé', time: '20 phút', price: '29K' },
      { name: 'Gội An Nhiên', time: '40 phút', price: '49K', note: 'Sạch gàu, thơm tóc, thư giãn nhẹ nhàng' },
      { name: 'Gội Thảo Mộc thư giãn', time: '50 phút', price: '89K', note: 'Nước gội thảo dược, đánh bay cơn đau đầu' },
      { name: 'Gội An Lạc dưỡng sinh', time: '75 phút', price: '149K', note: 'Massage đầu chuyên sâu, giúp ngủ ngon' },
    ],
  },
  {
    id: 'co-vai-gay',
    layer: 'Tâm',
    name: 'Chăm sóc cổ – vai – gáy',
    from: 'từ 149K',
    tagline: 'Cổ vai gáy căng cứng sau một ngày dài?',
    desc: 'Ngồi nhiều, làm việc lâu dễ gây cổ cứng, vai mỏi, đau đầu, khó ngủ. Liệu trình tại Miên giúp giảm căng cứng, tăng tuần hoàn máu, thư giãn tinh thần và nạp lại năng lượng.',
    image: { src: '/img/c-tay-vai.jpg', alt: 'Trị liệu vùng cổ vai gáy' },
    prices: [
      { name: 'Trị liệu đầu cổ vai gáy cơ bản', time: '30 phút', price: '149K', note: 'Đánh tan căng cứng cơ, giảm mỏi, nhẹ đầu' },
      { name: 'Trị liệu đầu cổ vai gáy chuyên sâu', time: '60 phút', price: '229K', note: 'Tác động sâu vùng cơ căng mỏi, ngủ ngon hơn' },
    ],
  },
  {
    id: 'massage-body',
    layer: 'Thân',
    name: 'Massage body thư giãn',
    from: 'từ 249K',
    tagline: 'Thả lỏng cơ thể, nhẹ nhàng tâm trí.',
    desc: 'Phù hợp khi bạn mệt mỏi, căng thẳng, muốn được thả lỏng sau những ngày làm việc. Kỹ thuật chủ yếu là xoa bóp, vuốt, miết với lực nhẹ đến vừa, giúp cơ thể dễ chịu, ngủ ngon hơn.',
    image: { src: '/img/c-massage-lung.jpg', alt: 'Massage lưng thư giãn' },
    prices: [
      { name: 'Massage Việt Nam – Nữ', time: '60/90 phút', price: '249K/339K' },
      { name: 'Massage Việt Nam – Nam', time: '60/90 phút', price: '329K/429K' },
      { name: 'Thư giãn bà bầu', time: '60 phút', price: '250K' },
    ],
  },
  {
    id: 'da-nong',
    layer: 'Thân',
    name: 'Massage đá nóng',
    from: 'từ 299K',
    tagline: 'Hơi ấm của đá đi sâu vào từng thớ cơ.',
    desc: 'Massage đá nóng trị liệu toàn thân giúp giãn cơ sâu, giảm đau nhức, lưu thông khí huyết và cân bằng năng lượng.',
    image: { src: '/img/c-da-nong.jpg', alt: 'Đá nóng đặt trên lưng khách' },
    prices: [
      { name: 'Liệu pháp Đá nóng – Nữ', time: '70/90 phút', price: '299K/389K' },
      { name: 'Liệu pháp Đá nóng – Nam', time: '70/90 phút', price: '369K/469K' },
    ],
  },
  {
    id: 'thai',
    layer: 'Thân',
    name: 'Massage Thái',
    from: '449K',
    tagline: 'Mỗi cơ thể có một nhu cầu khác nhau.',
    desc: 'Liệu trình massage body Thái 75 phút. Kỹ thuật viên tập trung vào những vùng cơ đang căng mỏi, với lực phù hợp từng người.',
    image: { src: '/img/c-an-huyet.jpg', alt: 'Ngón tay ấn huyệt trên lưng' },
    prices: [{ name: 'Massage body Thái', time: '75 phút', price: '449K' }],
  },
]

/* ── Combo Chuyên Sâu — 4 steps, text from the client's poster ───────────── */
export const combo = {
  name: 'Combo Chuyên Sâu',
  duration: '120 phút',
  price: '599K',
  steps: [
    { no: '01', name: 'Ngâm chân thảo dược', text: 'Thư giãn, kích thích huyệt đạo, lưu thông khí huyết.', image: { src: '/img/massage-chan.jpg', alt: 'Chăm sóc chân cho khách' } },
    { no: '02', name: 'Xông hơi đá muối', text: 'Đào thải độc tố qua tuyến mồ hôi, thanh lọc cơ thể.', image: { src: '/img/hanh-lang.jpg', alt: 'Hành lang ấm áp của Miên Spa' } },
    { no: '03', name: 'Massage đá nóng trị liệu toàn thân', text: 'Giãn cơ sâu, giảm đau nhức, lưu thông khí huyết, cân bằng năng lượng.', image: { src: '/img/da-nong.jpg', alt: 'Những viên đá nóng' } },
    { no: '04', name: 'Gội đầu An Lạc dưỡng sinh', text: 'Đánh thức giác quan, tóc sạch mềm mượt, thư giãn tinh thần.', image: { src: '/img/phong-goi.jpg', alt: 'Giường gội đầu dưỡng sinh' } },
  ],
}

/* ── Full price list — bảng giá mới (owner confirmed) ────────────────────── */
export interface PriceRow { name: string; time?: string; price: string; note?: string }
export const priceGroups: { title: string; rows: PriceRow[] }[] = [
  {
    title: 'Gội đầu',
    rows: [
      { name: 'Gội nhanh em bé', time: '20′', price: '29K' },
      { name: 'Gội An Nhiên', time: '40′', price: '49K' },
      { name: 'Gội Thảo Mộc thư giãn', time: '50′', price: '89K' },
      { name: 'Gội An Lạc dưỡng sinh', time: '75′', price: '149K' },
    ],
  },
  {
    title: 'Massage cổ vai gáy',
    rows: [
      { name: 'Trị liệu đầu cổ vai gáy cơ bản', time: '30′', price: '149K' },
      { name: 'Trị liệu đầu cổ vai gáy chuyên sâu', time: '60′', price: '229K' },
    ],
  },
  {
    title: 'Body massage',
    rows: [
      { name: 'Massage Việt Nam – Nữ', time: '60′/90′', price: '249K/339K' },
      { name: 'Massage Việt Nam – Nam', time: '60′/90′', price: '329K/429K' },
      { name: 'Liệu pháp Đá nóng – Nữ', time: '70′/90′', price: '299K/389K' },
      { name: 'Liệu pháp Đá nóng – Nam', time: '70′/90′', price: '369K/469K' },
      { name: 'Massage body Thái', time: '75′', price: '449K' },
      { name: 'Thư giãn bà bầu', time: '60′', price: '250K' },
      { name: 'Massage thải độc hàn khí, giải rượu bia', time: '60′', price: '389K' },
    ],
  },
  {
    title: 'Combo',
    rows: [
      { name: 'Combo Thư Giãn', time: '75′', price: '288K', note: 'Ngâm chân thảo dược · Trị liệu cổ vai gáy · Gội đầu An Nhiên' },
      { name: 'Combo Dưỡng Sinh', time: '90′', price: '339K', note: 'Xông hơi đá muối · Massage trị liệu toàn thân · Gội đầu thư giãn' },
      { name: 'Combo Khỏe Đẹp Toàn Diện', time: '90′', price: '349K', note: 'Ngâm chân thảo dược · Chăm sóc da mặt chuyên sâu · Gội đầu An Lạc dưỡng sinh' },
      { name: 'Combo Chuyên Sâu', time: '120′', price: '599K', note: 'Ngâm chân · Xông hơi đá muối · Massage đá nóng toàn thân · Gội An Lạc dưỡng sinh' },
    ],
  },
  {
    title: 'Xông hơi · Chân',
    rows: [
      { name: 'Xông khô đá muối', time: '30′', price: '50K' },
      { name: 'Liệu pháp trị liệu bàn chân', time: '30′/60′', price: '149K/288K' },
    ],
  },
  {
    title: 'Dịch vụ lẻ',
    rows: [
      { name: 'Giác hơi', price: '50K' },
      { name: 'Chườm đá nóng', price: '50K' },
      { name: 'Đắp thuốc Bắc giảm đau mỏi vai gáy', price: '69K' },
      { name: 'Châm cứu không kim', price: '79K' },
      { name: 'Ủ huyết yến trắng da', price: '89K' },
      { name: 'Massage mặt & đầu', time: '30′', price: '149K' },
      { name: 'Trị liệu vùng thắt lưng', time: '30′', price: '149K' },
      { name: 'Chăm sóc da mặt nâng cơ tự nhiên', time: '45′', price: '120K' },
    ],
  },
]

/* ── Space gallery — SIG-510, three lanes of real photos (space · care · guests) ─────────── */
export const space = {
  title: 'Không gian ấm của Miên',
  intro: `Ảnh thật tại ${contact.address}: sảnh đón, phòng trị liệu, phòng gội và những buổi chăm sóc thường ngày.`,
  lanes: [
    [
      { src: '/img/hanh-lang.jpg', alt: 'Hành lang gỗ ấm, đèn vàng' },
      { src: '/img/lily.jpg', alt: 'Bình hoa ly vàng cạnh bảng giá' },
      { src: '/img/sanh-hoa.jpg', alt: 'Sảnh đón khách với hoa cẩm tú cầu' },
      { src: '/img/phong-cho.jpg', alt: 'Khu chờ nhìn từ trên cao' },
      { src: '/img/vom-logo.jpg', alt: 'Bức tường đèn hổ phách với logo Miên Spa' },
    ],
    [
      { src: '/img/ktv-khan.jpg', alt: 'Kỹ thuật viên chuẩn bị khăn trên giường massage' },
      { src: '/img/goi-dau.jpg', alt: 'Gội đầu dưỡng sinh' },
      { src: '/img/c-da-nong.jpg', alt: 'Đá nóng trên lưng khách' },
      { src: '/img/massage-chan.jpg', alt: 'Chăm sóc chân' },
      { src: '/img/phong-goi.jpg', alt: 'Giường gội đầu dưỡng sinh' },
      { src: '/img/c-massage-lung.jpg', alt: 'Massage lưng' },
    ],
    [
      { src: '/img/than.jpg', alt: 'Kỹ thuật viên massage lưng cho khách' },
      { src: '/img/tam.jpg', alt: 'Cô gái áo cam giữa cây xanh' },
      { src: '/img/da-nong.jpg', alt: 'Những viên đá nóng' },
      { src: '/img/ba-tang.jpg', alt: 'Cô gái áo cam bên cửa sổ gỗ' },
      { src: '/img/tri.jpg', alt: 'Khách nằm thư giãn, mắt nhắm' },
      { src: '/img/c-tay-vai.jpg', alt: 'Trị liệu vùng vai gáy' },
    ],
  ],
}

/* ── Google reviews — quoted verbatim from the client's screenshots (owner approved) ── */
export const reviews = [
  { name: 'Nguyễn Bảo Vân Nhi', text: 'Mình ng sg có dịp đi ngang qua xong vô đại mà khá thích nha, dùng gói gội dưỡng sinh 149k mà có ngâm chân, Massager cổ vai gáy tay chân gội đầu 2l gội xong còn ủ r đắp mặt nạ các thứ :)) quài không hết thời gian, sẽ quay lại đây khi đi phú yên tiếp nheee.' },
  { name: 'Misa house', text: 'Ghé Phú Yên tình cờ thấy Miên spa nên vào trãi nghiệm, thực sự quá hài lòng, bạn Tuyền nhân viên nhiệt tình, tay nghề cao, làm xong đỡ đau lưng với vai cổ gáy hẳn luôn! Sẽ giới thiệu cho bạn bè tới Phú Yên ghé tiệm' },
  { name: 'Kate Kate', text: 'Dịch vụ tốt, nhiệt tình, trả lời nhanh, nhân viên làm dạn tay, bé Tuyền chăm sóc khách tốt, hợp lý, thoải mái, sẽ ủng hộ tiếp' },
  { name: 'Dimario Habersham', text: 'Miên Spa Tuy Hòa provides a very calm, clean, and peaceful environment in which clients are able to relax fully and enjoy their treatment(s). I have had many massages during my travels and the massages that I have received at this spa rank easily in my Top 3.', lang: 'en' },
  { name: 'pixroamer', text: 'Tôi đã có một trải nghiệm rất dễ chịu và thư giãn. Nó kỹ lưỡng hơn nhiều so với những dịch vụ massage du lịch cẩu thả. Rất đáng để ghé thăm.', note: 'Bản dịch tự động của Google' },
  { name: 'Nguyen Oanh', text: 'Ngon bổ rẻ nhân viên làm rất có tâm mà giá cả phải chăng' },
] as const

export const guests = [
  { src: '/img/khach-1.jpg', alt: 'Nhóm khách quốc tế check-in trước tường logo Miên Spa' },
  { src: '/img/khach-3.jpg', alt: 'Hai khách cầm bảng Đi Phú Yên ghé Miên' },
  { src: '/img/khach-2.jpg', alt: 'Cặp đôi check-in tại sảnh Miên Spa' },
]

export const reviewsCopy = {
  eyebrow: 'Khách nói về Miên',
  title: 'Lời khách sau buổi thư giãn',
  intro: 'Trích nguyên văn từ đánh giá trên Google Maps của Miên Spa Tuy Hòa.',
  source: 'Đánh giá trên Google Maps',
}

export const servicesCopy = {
  title: 'Dịch vụ tại Miên',
  intro: 'Năm dịch vụ chính cho thân, tâm và trí. Bấm vào từng dịch vụ để xem mô tả, thời lượng và giá.',
}

export const layersCopy = {
  heading: 'Ba tầng được chăm sóc',
  lead: 'Ở Miên, một buổi chăm sóc không chỉ dành cho cơ thể.',
}

export const bookingSteps = [
  { title: 'Chọn cách liên hệ', text: 'Gọi hotline, nhắn Zalo / Fanpage hoặc gửi biểu mẫu bên cạnh.' },
  { title: 'Miên xác nhận', text: 'Spa xác nhận lại thời gian và dịch vụ phù hợp trước khi bạn đến.' },
  { title: 'Đến và thư giãn', text: 'Giờ cao điểm là 12h trưa và 17h30 chiều, nên đặt trước để có giờ đẹp.' },
]

export const booking = {
  heading: 'Đặt lịch tại Miên',
  intro: 'Chọn dịch vụ và giờ bạn muốn. Miên sẽ xác nhận lại qua Zalo hoặc điện thoại trước khi bạn đến.',
  success: { title: 'Đã soạn xong tin nhắn', text: 'Zalo đang mở với nội dung đặt lịch của bạn. Nếu Zalo chưa mở, hãy gọi 0847 177 968.' },
}
