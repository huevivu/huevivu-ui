# 🔄 HueViVu — HỒ SƠ BÀN GIAO CHO AGENT (HANDOVER DOCUMENT)

**Dự án**: HueViVu (AI Travel Companion / AI Travel OS)
**Cập nhật lần cuối**: 17/05/2026
**Tình trạng**: Đang phát triển tính năng Social & Journaling.

Tài liệu này được tạo ra để bàn giao toàn bộ context, tiến độ, và các công việc đang dang dở cho một Agent mới (do thay đổi tài khoản) để có thể tiếp tục công việc một cách liền mạch nhất.

---

## 1. TỔNG QUAN DỰ ÁN & TRIẾT LÝ (QUAN TRỌNG)
Agent mới **BẮT BUỘC** phải đọc kỹ các rules trong `.agents/rules/` và `design-system.md`, `product-identify.md`.
*   **Không phải là MXH hay Booking app**: HueViVu là "AI Travel Operating System". Tính năng social chỉ để làm data layer cho AI recommendation.
*   **UI/UX**: Layout mobile-first (430px frame). Phong cách "Soft Premium", cảm xúc, điện ảnh, tông màu san hô (coral) và xanh navy ấm. 
*   **Không dùng form dài**: Mọi tương tác nên giống như đang trò chuyện với một người bạn đồng hành AI (chip, swipe, bottom sheet).

---

## 2. NHỮNG GÌ ĐÃ HOÀN THÀNH (DONE)

### Giao diện Gamification
*   **Profile Page (`profile.html/css/js`)**: Hoàn thành hệ thống Badge Accordion (Dropdown danh hiệu thám hiểm Huế), hiệu ứng thanh tiến trình mượt mà, phân chia badge khóa/đã mở.

### Suite Tính năng Social & Journal (4 Trang Mới)
Đã hoàn thiện UI/UX và logic tương tác (frontend) cho 4 trang mới:
1.  **`community.html`**: Feed cộng đồng ưu tiên hiển thị theo "AI Match Score" (độ phù hợp) thay vì độ phổ biến. Có filter, trending cards.
2.  **`journal.html`**: Nhật ký cá nhân. Render timeline theo ngày, có mood picker, bottom sheet để viết nhật ký (cảm giác private-first).
3.  **`shared-trip-detail.html`**: Chi tiết lịch trình được người khác chia sẻ (có accordion từng ngày, budget, AI Match badge, và nút Clone/Optimize).
4.  **`travel-memory.html`**: Trải nghiệm Recap điện ảnh do AI tạo ra sau chuyến đi (ảnh masonry, mood timeline line, AI insights).

### Sửa lỗi UI (Bug Fixes)
*   **Hình ảnh**: Đã map lại toàn bộ ảnh bị lỗi (như `pagoda.png`, `food1.png`...) về các assets đang có sẵn trong thư mục `assets/` (`citadel.png`, `food.png`, `hero.png`, v.v.).
*   **CSS**: Sửa lỗi giao diện "Mood Timeline" trên trang `travel-memory.html` (connector bị lỗi hiển thị thành khối vuông đã được sửa thành đường line dọc tinh tế dùng `::after`).

### Kiến trúc Backend
*   **`backend-social-feature.md`**: Đã viết xong bản thiết kế kiến trúc DB, API, thuật toán chấm điểm AI matching, và chiến lược mở rộng cho hệ thống Social. Lưu tại `.agents/backend-social-feature.md`.

---

## 3. CÔNG VIỆC ĐANG DANG DỞ (IN PROGRESS - BỊ NGẮT QUÃNG)

**Vấn đề Navbar (Bottom Nav)**
*   **Bối cảnh**: Ban đầu, tôi đã thay thế tab **"Chuyến đi" (Trips)** bằng tab **"Cộng đồng" (Community)** trên thanh điều hướng dưới cùng (bottom nav). Tuy nhiên, điều này làm mất lối vào trang Trips. User yêu cầu khôi phục lại.
*   **Đang làm**: Tôi đang trong quá trình **khôi phục lại nút "Chuyến đi"** (thay thế nút "Cộng đồng" vừa thêm).
*   **Trạng thái**:
    *   ✅ Đã khôi phục trên: `home.html`, `explore.html`.
    *   ❌ **CHƯA KHÔI PHỤC (Cần Agent mới làm ngay)**: `trips.html`, `profile.html`, và `community.html`.
    *   *Note cho Agent mới*: Cần sửa HTML của navbar trong 3 file này để đảm bảo bottom nav có đúng 5 mục: `Trang chủ`, `Khám phá`, `AI Plan` (nút giữa), `Chuyến đi`, `Cá nhân`. Giữ đúng icon và cấu trúc SVG của "Chuyến đi" (trips).

---

## 4. NHỮNG VIỆC CẦN LÀM TIẾP THEO (TODO CHO AGENT MỚI)

1.  **Hoàn thiện sửa Navbar (Ưu tiên 1)**: Như đã đề cập ở phần 3. Thay `<a id="nav-community">...</a>` thành `<a id="nav-trips">...</a>` trong `trips.html` (nhớ set `class="nav-item active"`), `profile.html`, và `community.html`.
2.  **Tạo lối vào (Entry Point) cho Trang Cộng Đồng**: Vì đã bỏ "Cộng đồng" khỏi bottom nav, Agent mới cần thiết kế một nút bấm, thẻ (card), hoặc floating action button tinh tế ở trang `home.html` hoặc `explore.html` để user có thể truy cập vào `community.html`.
3.  **Tích hợp JS thực (Integration)**: Chuyển các chức năng mô phỏng (fake click, set timeout) trong file JS của 4 trang mới sang fetch API dựa trên tài liệu kiến trúc backend đã thiết kế.
4.  **Kiểm tra toàn diện**: Đảm bảo luồng đi từ Home -> Trips -> Shared Trip Detail -> Clone -> Profile hoạt động trơn tru.

---

## Lời nhắn cho Agent mới:
*Hãy đọc file này đầu tiên. Môi trường làm việc đang ở trạng thái rất tốt, code Frontend đã khá sạch và bám sát design system. Hãy tiếp tục giữ vững vibe "Cinematic & Emotional" của HueViVu nhé! Chúc may mắn.*
