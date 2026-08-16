# Kỹ thuật chi tiết: Feature 04 - Places Database & Caching

## 1. Tổng quan
HueViVu cần một hệ thống quản lý dữ liệu địa điểm (Database) mạnh mẽ, có khả năng lọc (filter), tìm kiếm nhanh (search) và lưu trữ cục bộ (caching) để người dùng không phải chờ đợi mỗi khi xem thông tin chi tiết hoặc tìm điểm thay thế.

## 2. Kiến trúc Data & API

### 2.1 Cấu trúc API chính
- `GET /api/v1/places`: Lấy danh sách địa điểm (có hỗ trợ pagination, cursor, filter).
- `GET /api/v1/places/:id`: Lấy chi tiết một địa điểm.
- `GET /api/v1/places/search?q=...`: Tìm kiếm Text-based nhanh.

### 2.2 Các Tham số Lọc (Query Params)
Dựa theo `database_schema.md`, API cần hỗ trợ các query phức tạp:
- `?category=heritage&vibe=historic`
- `?taste_profile=spicy&dining_style=street_food`
- `?accessibility=wheelchair`
- `?sort=rating_desc` (Hoặc `sort=popularity_desc`)

## 3. Kỹ thuật Caching (Frontend & Edge)

### 3.1 Client-side Caching (SWR hoặc React Query)
Thay vì fetch lại dữ liệu liên tục:
- **React Query (Tùy chọn)**: Dùng `useQuery(['places', filters])` với thời gian `staleTime: 10 * 60 * 1000` (10 phút).
- Điều này có nghĩa là khi user vuốt qua lại giữa các màn hình, dữ liệu sẽ render tức thì từ bộ nhớ đệm (Cache) mà không tốn request mạng.

### 3.2 Offline Storage (IndexedDB)
Dành cho tính năng "Lưu ngoại tuyến" (Offline Mode):
- Khi user bấm "Save This Trip", ứng dụng sẽ tải chi tiết của TẤT CẢ địa điểm trong lịch trình đó (ảnh thumbnail, tọa độ map, info) và lưu vào `IndexedDB` của trình duyệt.
- Nếu người dùng mất mạng khi đang đi trên đường ở Huế, họ vẫn xem được lịch trình và thông tin các điểm này.

## 4. Lazy Loading & Image Optimization
Bảng `PLACES` có chứa đường dẫn ảnh (`img`). Hình ảnh là thứ gây nặng web nhất.
- **Lazy Load**: Thẻ `<img loading="lazy" />` hoặc sử dụng Intersection Observer. Chỉ load ảnh khi thẻ `ActivityCard` cuộn vào màn hình.
- **Progressive Image**: Hiển thị ảnh Blur (độ phân giải cực thấp) hoặc dùng CSS Skeleton trước khi ảnh chính thức được tải xong.

## 5. Xử lý Ngoại lệ (Edge Cases)
- **Hết dữ liệu khi cuộn**: Xử lý cờ `hasMore = false` ở API trả về, không gọi thêm API Infinite Scroll nữa.
- **Lỗi tải ảnh**: Gắn sự kiện `onerror` cho thẻ `<img />`, tự động fallback về một hình ảnh "Hue Placeholder" mặc định (VD: hình vector nón lá hoặc cầu Tràng Tiền) để UI không bị vỡ.
- **Không tìm thấy kết quả**: Khi `GET /places/search` trả về mảng rỗng, hiển thị một Empty State thân thiện: "Không tìm thấy địa điểm nào khớp, bạn thử bỏ bớt bộ lọc xem sao nhé?".
