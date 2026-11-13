# SIG-802 — Form nhiều bước · Multi-step Booking Form
- **Status:** draft · **Version:** 1.0.0
- **Glossary term:** Multi-step form, Progress stepper, Slide transition, Height tween (accordion-style), Stroke draw (check icon)
- **Trông như thế nào:** Một khung liên hệ / đặt lịch có tiêu đề và thanh các bước ("1 Dịch vụ — 2 Thời gian — 3 Thông tin"). Bấm "Tiếp tục": hệ thống kiểm tra bước hiện tại, bước cũ trượt sang trái, bước mới trượt vào từ phải, vạch tiến trình giữa các chấm chạy đầy, chiều cao khung co giãn mượt theo bước mới. "Quay lại" đảo chiều. Ô nhập sai hiện lời nhắn ngay dưới ô (mở ra từ từ) và con trỏ nhảy tới ô sai đầu tiên. Gửi xong, form được thay bằng màn hình cảm ơn: dấu tick tự vẽ nét, tóm tắt thông tin đã nhập, nút "Gửi yêu cầu khác".
- **Min Motion level:** 2 · **Pin/scrub:** no (vùng chuyển đổi: chuyển bước ≤ 350ms, không bao giờ chặn nhập liệu)
- **Kỹ thuật:** GSAP timeline (x + opacity cho bước, height cho khung, scaleX cho vạch tiến trình, strokeDashoffset cho dấu tick), `gsap.matchMedia` 3 nhánh, `contextSafe` cho các tween chạy trong sự kiện. Không dùng ScrollTrigger.
- **Deps:** gsap, @gsap/react
- **Props:**

| Prop | Type | Note |
|---|---|---|
| `heading` | string | Bắt buộc. Tiêu đề `h2` |
| `eyebrow`, `intro` | string? | Nhãn nhỏ phía trên, đoạn giới thiệu phía dưới tiêu đề |
| `steps` | `{ id; title; description?; fields: Field[] }[]` | Bắt buộc. Cấu hình hoàn toàn bằng props, không có field cứng |
| `Field` | union theo `type` | `text`/`tel`/`email` (`placeholder?`, `autoComplete?`, `pattern?` là nguồn regex khớp toàn chuỗi, `errorMessage?`), `textarea` (`maxLength?`), `choice` (`options`, `multiple?` → chip bằng radio/checkbox thật), `date` (`min?` dạng `yyyy-mm-dd`), `select` (`options`). Tất cả có `name`, `label`, `required?` |
| `onSubmit` | `(values: Record<string, string \| string[]>) => void \| Promise<void>` | Được `await`. Nút hiện trạng thái đang gửi. Nếu lỗi: hiện `labels.submitError` và ở lại bước cuối |
| `success` | `{ title: string; text?: string }` | Nội dung màn hình cảm ơn |
| `submitLabel` | string? | Chữ nút gửi ở bước cuối (mặc định "Gửi yêu cầu") |
| `labels` | `Partial<Sig802Labels>`? | Mặc định tiếng Việt: `step` "Bước {n} / {total}", `next`, `back`, `submit`, `sending`, `required`, `invalidPhone`, `invalidEmail`, `invalidFormat`, `invalidDate`, `submitError`, `selectPlaceholder`, `stepsNav`, `reset`, `summaryTitle` |
| `intensity` | 1 \| 2 \| 3 | Chỉ đổi quãng trượt (×0.6 / ×1 / ×1.3). Thời lượng luôn ≤ 350ms |
| `id`, `className` | string? | Root (`section`) có `scroll-margin-top: var(--header-h)` |

Biến CSS ngoài danh sách chuẩn: `--sig-danger` (màu báo lỗi, fallback `#ef6f5e`).

- **Mobile version:** (≤767px) Thanh các bước thu gọn thành "Bước n / tổng" kèm tên bước và một thanh tiến trình. Bước đổi bằng trượt ngắn 16px kèm cross-fade (thay vì 56px). Nút full-width, nút chính nằm trên, "Quay lại" nằm dưới. Ô nhập ≥16px (không bị iOS tự phóng to), vùng chạm ≥44px.
- **Reduced motion:** Bước đổi tức thì (chỉ fade ≤150ms), không tween chiều cao, vạch tiến trình nhảy thẳng tới vị trí mới, ô lỗi hiện ngay, dấu tick ở màn hình cảm ơn hiện sẵn đã vẽ xong.
- **Ảnh kết quả thật:** Không dùng ảnh. An toàn.
- **Hợp với ẩn dụ:** Vùng chuyển đổi, cần bình tĩnh và nhanh:
  - **Spa / phun xăm:** đặt lịch tư vấn (dịch vụ, giờ, thông tin).
  - **Nha khoa / y tế:** hẹn khám, chọn bác sĩ và khung giờ.
  - **Du lịch / nhà hàng / nội thất:** yêu cầu báo giá, đặt bàn, hẹn khảo sát.
- **Accessibility:** `<form noValidate>` thật; mỗi ô có `<label>` (chip dùng `fieldset` + `legend`); lỗi nối bằng `aria-describedby` + `aria-invalid`; đổi bước thì focus chuyển tới tiêu đề bước mới (`tabIndex=-1`) và vùng `aria-live="polite"` đọc "Bước 2 / 3"; bước không hiện bị `hidden` + `inert` nên Tab không chạm tới; Enter ở bước chưa cuối chuyển bước (không gửi form). Khi chưa có JS / chưa hydrate, mọi bước hiện xếp dọc trong một form dài; chỉ sau khi mount mới chuyển sang dạng từng bước.
- **Changelog:** v1.0.0 — first cast
