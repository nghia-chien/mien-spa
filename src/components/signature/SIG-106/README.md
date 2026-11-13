# SIG-106 — Chữ thương hiệu bay về header · Wordmark Dock Preloader

- **Status:** draft · **Version:** 1.0.0
- **Trông như thế nào:** Overlay toàn màn hình với tên thương hiệu cỡ lớn — từng chữ hiện lên qua mặt nạ overflow hidden theo stagger, giữ nguyên rồi từng chữ bay thu nhỏ, đáp chính xác vào vị trí logo trên header (GSAP Flip reparent). Overlay mờ dần và ẩn, header logo hoàn chỉnh.
- **Min Motion level:** M4
- **Pin/scrub:** Không có
- **Kỹ thuật:** GSAP Flip — `Flip.getState()` → `element.appendChild()` → `Flip.from()` với `scale: true`; mask reveal bằng `overflow: hidden` + `yPercent`; `gsap.matchMedia()` hai điều kiện; reduced-motion fade 150ms
- **Deps:** `gsap`, `gsap/Flip`, `@gsap/react`
- **Props:**

| Prop | Kiểu | Mặc định | Mô tả |
|---|---|---|---|
| `brand` | `string` | _(bắt buộc)_ | Tên thương hiệu, mỗi ký tự là một phần tử riêng |
| `tagline` | `string?` | — | Dòng phụ hiển thị dưới wordmark trong overlay |
| `children` | `ReactNode?` | — | Nội dung trang bên dưới header |
| `intensity` | `1\|2\|3` | `2` | Hệ số tốc độ 0.7 / 1 / 1.4 |
| `labels.brand` | `string?` | giá trị `brand` | `aria-label` cho logo trên header |
| `labels.loading` | `string?` | — | Dành cho mở rộng sau |
| `id` | `string?` | — | HTML id của root |
| `className` | `string?` | `''` | CSS class bổ sung cho root |

- **Mobile version:** Stagger nhanh hơn (`0.055s × factor`), `clamp` co font-size nhỏ hơn trên màn hình hẹp. Hiệu ứng Flip vẫn chạy đầy đủ.
- **Reduced motion:** Overlay fade ra trong 150ms, chữ header hiện ngay tức thì, không có chuyển động.
- **Ảnh kết quả thật:** Không dùng ảnh — component thuần chữ.
- **Hợp với ẩn dụ:** Khai mạc thương hiệu, landing page studio cao cấp, trang chủ agency, màn giới thiệu sản phẩm.
- **Changelog:** v1.0.0 — first cast
