# SIG-510 — Ba làn ảnh theo cuộn · Three Scroll-Driven Image Lanes
- **Status:** draft · **Version:** 1.0.0
- **Glossary term:** Scroll-linked horizontal parallax, Marquee lanes (scrubbed), Opposing tracks
- **Trông như thế nào:** Tiêu đề phía trên, bên dưới là ba hàng ảnh xếp sát nhau. Cuộn xuống thì hàng 1 và 3 trượt sang trái, hàng 2 trượt sang phải, nhanh chậm đúng theo tốc độ cuộn; cuộn ngược thì đảo chiều. Không pin, trang vẫn cuộn bình thường.
- **Min Motion level:** 3 · **Pin/scrub:** scrub, không pin (tính vào sàn: Signature 1, pin/scrub 1, chuyển cảnh 0)
- **Kỹ thuật:** GSAP ScrollTrigger scrub `x` theo hàm (`invalidateOnRefresh`), quãng trượt = phần ảnh tràn khung (giới hạn 75% chiều rộng × intensity); mỗi hàng nhân đôi ảnh (bản sao `aria-hidden`) để không bao giờ hở mép.
- **Deps:** gsap, @gsap/react
- **Props:**

| Prop | Kiểu | Ghi chú |
|---|---|---|
| `title` | ReactNode | Bắt buộc. Tiêu đề `h2` |
| `eyebrow`, `intro` | string? / ReactNode? | Nhãn nhỏ, đoạn mô tả bên phải tiêu đề |
| `lanes` | `Sig510Image[][]` | Tối đa 3 hàng. Mỗi ảnh `{ src, alt, caption?, isResultPhoto? }`. Mỗi hàng nên ≥ 4 ảnh |
| `labels` | `{ region?, lane? }` | Tên đọc màn hình. Mặc định "Thư viện ảnh", "Hàng ảnh" |
| `intensity` | 1 \| 2 \| 3 | Quãng trượt ×0.7 / ×1 / ×1.4 |
| `id`, `className` | string? | Root (`section`) có `scroll-margin-top: var(--header-h)` |

Chiều cao hàng: 28vh / 34vh / 28vh (có clamp). Ảnh giữ đúng tỉ lệ gốc (cao cố định, rộng tự động).

- **Mobile version:** (≤767px) Vẫn ba hàng ngược chiều, ảnh thấp còn ~62%, quãng trượt còn 55% chiều rộng, scrub nhạy hơn (0.3) để khớp cuộn bằng tay; ẩn chú thích. Không pin nên không giành cuộn với trình duyệt.
- **Reduced motion:** Không chuyển động. Mỗi hàng thành dải vuốt ngang gốc (`overflow-x: auto`, scroll-snap), không có bản sao. Đây cũng là trạng thái khi chưa có JS.
- **Ảnh kết quả thật:** An toàn. Ảnh chỉ dịch chuyển (`translateX`) cả hàng, không scale, không nghiêng, không lọc màu; tỉ lệ ảnh luôn đúng.
- **Hợp với ẩn dụ:** Không gian/khoảnh khắc trôi qua: spa (không gian, khách check-in), nhà hàng (món, bàn, bếp), du lịch (điểm đến), studio (tác phẩm).
- **Changelog:** v1.0.0 — first cast (đúc tay trong phôi Miên Spa, 13/11/2026)
