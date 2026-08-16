# Kỹ thuật chi tiết: Feature 05 - Journal & System Feedback

## 1. Tổng quan
Tính năng "Nhật ký" (Journal) và Phản hồi (Feedback) không chỉ giúp người dùng lưu giữ kỷ niệm (với ảnh, mood, note) mà còn là nguồn cung cấp dữ liệu cực kỳ quý giá (`TRAINING_EXAMPLES`) để huấn luyện (fine-tune) lại Model AI, giúp HueViVu ngày càng thông minh và cá nhân hóa tốt hơn.

## 2. Kiến trúc Data & API

### 2.1 Nhật ký cá nhân (Journal Entries)
Bảng `JOURNAL_ENTRIES` lưu giữ cảm xúc theo thời gian thực tại các địa điểm.
- **Endpoint**: `POST /api/v1/journal`
- **Payload**:
  ```json
  {
    "trip_id": "trip_xxx",
    "place_id": "citadel_01",
    "mood": "wonder",
    "content": "Kiến trúc quá đẹp, hoàng hôn buông xuống nhìn rất thơ.",
    "is_private": true
  }
  ```

### 2.2 Thu thập tín hiệu (User Events & Feedback)
Thu thập dữ liệu Implicit (ngầm) và Explicit (chủ động).
- **Implicit Events**: Bắn API ngầm `POST /api/v1/events` khi người dùng:
  - Xem chi tiết 1 địa điểm > 10 giây (event: `view_long`).
  - Đổi địa điểm (event: `swap_place`, context: lý do/nơi bị đổi).
  - Đánh dấu đã đến (event: `check_in`).
- **Explicit Feedback**: Khi kết thúc chuyến đi, hiển thị form: `POST /api/v1/trips/:id/feedback`
  - Đánh giá tổng quan chuyến đi (1-5 sao).
  - Đánh giá mức độ hài lòng với AI (1-5 sao).
  - Chọn những điểm đã đi thực tế (`places_visited`) và những điểm đã bỏ qua (`places_skipped`).

## 3. Kiến trúc Huấn luyện (Data Pipeline cho AI)
Dữ liệu từ bảng `TRIP_FEEDBACK` sẽ được chạy qua một Cronjob hàng ngày (hoặc hàng tuần) để sinh ra `TRAINING_EXAMPLES`.

- **Thuật toán sinh Example**:
  1. Lấy 1 record từ `TRIP_FEEDBACK` có `ai_rating >= 4` (Feedbacks tốt).
  2. Lấy Profile ban đầu (`user_profile` từ Onboarding).
  3. Lấy Lịch trình thực tế user ĐÃ ĐI (`places_visited`).
  4. Đóng gói thành cặp [Input: Profile] -> [Output: Lịch trình thực tế].
  5. Nếu dùng OpenAI, chuyển JSON này thành định dạng JSONL để chạy Fine-tuning API.

## 4. UI/UX cho Nhật ký (Frontend)
- **Nút Check-in**: Hiển thị trên mỗi `ActivityCard` khi thiết bị định vị (GPS) nằm trong bán kính 500m của địa điểm đó (Sử dụng `navigator.geolocation`).
- **Micro-interactions**: Khi user chọn `mood` (như "Happy", "Tired", "Wonder"), làm các hiệu ứng animation nhỏ bung ra từ icon để tạo sự thích thú (Delightful UX).

## 5. Xử lý Ngoại lệ (Edge Cases)
- **Location Access Denied**: Nếu user từ chối quyền GPS, ẩn tính năng Check-in tự động, cho phép user click check-in thủ công.
- **Quá tải Database**: Bảng `USER_EVENTS` có thể phình to rất nhanh. Cần setup script để xóa bớt các event vô giá trị sau 30 ngày (Data Retention Policy) hoặc đẩy sang Cold Storage (VD: AWS S3).
- **Abusive Content**: Bảng `JOURNAL_ENTRIES` cần filter từ ngữ nhạy cảm nếu user set `is_private = 0` (Chia sẻ công khai).
