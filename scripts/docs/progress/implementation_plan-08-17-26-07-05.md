# Kế hoạch Thực thi Phase 8: Hoàn thiện toàn bộ Giao diện Legacy (Legacy UI Migration)

Bạn nói rất đúng, chúng ta đã chuyển đổi thành công trang Landing Page (`index.html`) sang Next.js, nhưng "trái tim" thực sự của ứng dụng — tức là màn hình **Dashboard (`home.html`)** và các trang tính năng khác trong thư mục `vanilla_legacy` — vẫn chưa được đưa lên Next.js.

Để đưa toàn bộ "lặt vặt tất tần tật" lên Next.js một cách mượt mà và không bị lỗi, tôi xin đề xuất chia nhỏ việc này thành các bước sau:

## User Review Required
> [!IMPORTANT]
> Việc bê nguyên toàn bộ mười mấy trang HTML cũ sang React/Next.js cùng một lúc là bất khả thi và dễ gây lỗi. Chúng ta cần ưu tiên làm từng trang một. Dưới đây là lộ trình tôi đề xuất. Xin hãy cho biết ý kiến của bạn!

## Lộ trình Di chuyển (Migration Roadmap)

### Phase 8.1: App Shell & Home Dashboard (Ưu tiên số 1)
- **Mục tiêu:** Chuyển đổi `vanilla_legacy/home.html`.
- **Chi tiết:**
  - Tạo Component `BottomNav` (Thanh điều hướng dưới cùng cho Mobile) gồm 5 tab: Home, Explore, AI (nút giữa), Trips, Profile.
  - Tạo trang `src/app/home/page.js` chứa giao diện:
    - Lời chào & Thanh tìm kiếm.
    - Card "Chuyến đi đang hoạt động".
    - Banner "AI gợi ý hôm nay".
    - Các nút AI Quick Actions.
    - Thanh cuộn Danh mục (Di tích, Ẩm thực...).

### Phase 8.2: Trang Khám Phá (Explore) & Chi tiết Địa Điểm
- **Mục tiêu:** Chuyển đổi `explore.html` và `place-detail.html`.
- **Chi tiết:**
  - Trang `/explore` hiển thị danh sách địa điểm dạng lưới, có filter lọc danh mục.
  - Sẽ kết nối trực tiếp với API lấy dữ liệu từ Supabase thay vì dùng dữ liệu giả (mock data).
  - Trang `/places/[id]` hiển thị chi tiết hình ảnh, review và tọa độ bản đồ.

### Phase 8.3: Quản lý Lịch trình (Trips) & Profile
- **Mục tiêu:** Chuyển đổi `trips.html`, `profile.html` và `journal.html`.
- **Chi tiết:**
  - Hoàn thiện luồng hiển thị lịch trình sau khi AI trả kết quả.
  - Giao diện nhật ký chuyến đi.

## Proposed Changes (Cho Phase 8.1)

### App Shell & Components
#### [NEW] `src/components/layout/BottomNav.jsx`
- Thanh điều hướng dưới cùng của ứng dụng.
#### [NEW] `src/styles/app-shell.css`
- CSS dùng chung cho các màn hình bên trong ứng dụng.

### Home Dashboard
#### [NEW] `src/app/home/page.js`
- Lắp ráp giao diện từ `vanilla_legacy/home.html`.
#### [NEW] `src/styles/home.css`
- Port CSS từ `vanilla_legacy/home.css`.

## Verification Plan
1. **Lỗi 404:** Tôi đã FIX xong lỗi 404 cho trang `/admin/places`. Từ giờ khi bạn vào đó, nó sẽ tự động chuyển hướng đúng vào `/admin/places/new`.
2. **Phase 8.1:** Chạy localhost, mở giao diện Mobile mô phỏng và verify thanh Bottom Nav hoạt động chuẩn, trang `/home` hiển thị đẹp như bản thiết kế gốc.

---
> [!NOTE]
> Bạn có đồng ý với kế hoạch chia nhỏ như trên và cho phép tôi bắt đầu code ngay **Phase 8.1 (App Shell & Home Dashboard)** không? Bấm **Proceed** để tôi tiến hành nhé!
