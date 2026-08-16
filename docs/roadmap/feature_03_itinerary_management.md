# Kỹ thuật chi tiết: Feature 03 - Itinerary Management & UI

## 1. Tổng quan
Đây là module chịu trách nhiệm hiển thị kết quả (Lịch trình đã được tạo) và cung cấp các công cụ để người dùng có thể tương tác, thay đổi, và quản lý lịch trình của mình. Màn hình này cần mang lại cảm giác "điều khiển hành trình" mà không quá phức tạp.

## 2. Kiến trúc Giao diện & Component

### 2.1 Các Component chính
- **ItineraryHeader**: Hiển thị tên lịch trình, số ngày, ngân sách, nút Share và Save.
- **DaySelector (Tabs)**: Thanh trượt ngang để chọn xem chi tiết từng ngày (Day 1, Day 2...).
- **TimelineView**: Hiển thị danh sách các hoạt động trong một ngày theo chiều dọc, nối với nhau bằng các đường kẻ (Timeline paths).
- **ActivityCard**: Thẻ hiển thị một địa điểm/hoạt động (ảnh, tên, giờ, nút thay đổi).
- **MapToggle**: Chế độ xem Bản đồ cho các địa điểm trong ngày.
- **SwapDrawer / Modal**: Chứa danh sách các địa điểm gợi ý thay thế khi user muốn đổi một điểm trong lịch trình.

### 2.2 State Management (Frontend)
```javascript
interface ItineraryState {
  tripId: string;
  tripData: TripObject;
  selectedDay: parseInt; // 1, 2, 3...
  isEditingMode: boolean; // Trạng thái kéo thả
  isSwapModalOpen: boolean;
  itemToSwap: string | null; // ID của địa điểm đang muốn đổi
}
```

## 3. Chức năng tương tác cốt lõi (Core Interactions)

### 3.1 Kéo thả (Drag & Drop)
- Sử dụng thư viện như `dnd-kit` (nếu dùng React) hoặc HTML5 Drag & Drop API nguyên bản.
- **Logic**: User có thể kéo một `ActivityCard` lên hoặc xuống để thay đổi thứ tự thời gian.
- **Auto-calculate Time**: Khi thứ tự thay đổi, hàm `recalculateTimeline(dayIndex)` sẽ chạy để tự động tính toán lại giờ đến/giờ đi dựa trên `avg_visit_min` và khoảng cách địa lý (hoặc thời gian di chuyển tĩnh giả định, VD: +15 phút đi đường).

### 3.2 Đổi địa điểm (Swap Location)
- **Luồng**: Click "Swap" trên một thẻ 👉 Mở SwapDrawer 👉 Fetch API `GET /api/v1/places/suggest?category=...&lat=...&lng=...` để lấy 5 điểm gần đó có cùng thể loại 👉 User chọn 1 điểm 👉 Cập nhật Local State 👉 Recalculate Timeline.

### 3.3 Thêm/Xóa (Add/Remove)
- Xóa: Remove khỏi mảng của ngày hiện tại, chạy lại Recalculate Timeline.
- Thêm: Mở màn hình Search/Khám phá, chọn địa điểm, chọn ngày và giờ muốn chèn vào.

## 4. Giao tiếp API (Backend)

- **Lưu lịch trình**: Bất cứ khi nào user Drag & Drop, Swap, hoặc Xóa, gọi API ngầm (Debounce 2s):
  `PUT /api/v1/trips/:id` với body là mảng `itinerary` đã được update.
- **Tối ưu**: Tránh spam API, chỉ gửi update khi user ngừng thao tác (Sử dụng Optimistic UI Update).

## 5. Xử lý Ngoại lệ (Edge Cases)
- **Trùng lặp địa điểm**: Khi user Add/Swap một điểm đã có trong ngày khác, hiện cảnh báo "Bạn đã đi địa điểm này vào Ngày X, bạn có chắc chắn muốn đi lại không?".
- **Quá thời gian (Over-scheduling)**: Nếu tổng thời gian tham quan trong 1 ngày vượt quá 12 tiếng, hiển thị cảnh báo nhỏ (Warning badge) trên Tab của ngày đó: "Lịch trình ngày này khá đặc, hãy cân nhắc giảm bớt điểm đến".
- **Khoảng cách quá xa**: Tính toán khoảng cách tọa độ (Lat/Lng) bằng công thức Haversine (hoặc Map API). Nếu hai điểm liên tiếp cách nhau > 15km, tự động cộng thêm 45 phút vào thời gian di chuyển và có thể hiện icon cảnh báo kẹt xe.
