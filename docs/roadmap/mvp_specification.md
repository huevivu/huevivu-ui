# Đặc tả tính năng MVP - HueViVu

Dựa trên phân tích từ thư mục `vanilla_legacy`, dưới đây là bản đặc tả tính năng MVP (Minimum Viable Product) cho ứng dụng HueViVu - một trợ lý du lịch AI thông minh dành riêng cho Huế.

## 1. Core Experience (Trải nghiệm cốt lõi)

### 1.1. AI Trip Planner (Tạo lịch trình AI)
*Đường dẫn: `flow.html`*
- **Quy trình thu thập sở thích (9 bước)**: 
  - Thời gian lưu trú (1-2 ngày, 3-4 ngày...)
  - Người đồng hành (Solo, Cặp đôi, Bạn bè, Gia đình)
  - Ngân sách (Tiết kiệm, Tiêu chuẩn, Cao cấp, Sang trọng)
  - Nhịp độ (Nhanh, Thư giãn, Cân bằng)
  - Phong cách khám phá (Iconic, Hidden Gems, Story-seeker)
  - Thời gian năng động (Sáng sớm, Cú đêm)
  - Mức độ thoải mái (Thích ngoài trời, Ưu tiên tiện nghi)
  - Khẩu vị (Cay, Nhẹ, Street food, Fine dining, Cafe)
  - Sở thích (Văn hóa, Thiên nhiên, Chụp ảnh, Tâm linh...)
- **AI Processing Screen**: Màn hình loading hiển thị quá trình AI đang suy nghĩ, kèm theo các mẹo vặt/fun fact về Huế.
- **Generated Itinerary**: Trả về lịch trình chi tiết theo từng ngày, từng giờ.

### 1.2. Trip Hub & Itinerary Management (Quản lý lịch trình)
*Đường dẫn: `hub.html`, `trips.html`*
- **Hero Stats**: Hiển thị tổng quan chuyến đi (Số ngày, Ngân sách ước tính, Thời tiết, Số lượng điểm đến).
- **Timeline Lịch trình**: Danh sách các hoạt động theo giờ, có tích hợp AI Insight (ví dụ: "Trời có thể mưa lúc 3h chiều, đổi sang đi bảo tàng").
- **Smart Customization (Quick Actions)**: Cho phép người dùng yêu cầu AI chỉnh sửa nhanh: Ít đi bộ hơn, Thêm đồ ăn địa phương, Thêm hoạt động về đêm, Lịch trình thư giãn hơn...
- **Quản lý trạng thái chuyến đi**: Đang diễn ra (Active), Sắp tới (Upcoming), Đã qua (Past).
- **Bản đồ hành trình**: Hiển thị các điểm đến trên bản đồ (có hỗ trợ chế độ Offline).

### 1.3. Home Dashboard (Trang chủ)
*Đường dẫn: `home.html`*
- **Greeting & Active Trip**: Lời chào cá nhân hóa và thẻ trạng thái của chuyến đi hiện tại.
- **AI Welcome Banner**: Gợi ý ngay lập tức từ AI dựa trên thời gian thực (ví dụ: "Sáng nay trời đẹp, rất thích hợp đi Chùa Thiên Mụ").
- **Quick AI Actions**: Các nút thao tác nhanh (Lên kế hoạch, Tìm quán ăn, Tìm điểm văn hóa, Chụp ảnh).
- **Khám phá theo danh mục**: Di tích, Ẩm thực, Thiên nhiên, Chùa chiền, Cà phê...

### 1.4. Explore & Search (Khám phá)
*Đường dẫn: `explore.html`*
- **Tìm kiếm thông minh**: Tìm địa điểm, trải nghiệm, ẩm thực.
- **Gợi ý theo vị trí (Nearby)**: Các địa điểm, quán ăn xung quanh vị trí hiện tại.
- **Bộ sưu tập (Collections)**: Nhóm các địa điểm theo chủ đề (Di sản UNESCO, Ẩm thực Must-try, Điểm ngắm hoàng hôn...).
- **Local Tips**: Các mẹo du lịch được chia sẻ từ người dân địa phương.

### 1.5. Travel Journal (Nhật ký du lịch)
*Đường dẫn: `journal.html`*
- **Viết nhật ký**: Ghi lại cảm xúc (Mood), địa điểm, thời gian và hình ảnh.
- **AI Recap**: AI tự động tóm tắt chuyến đi dựa trên các bài viết nhật ký.
- **Privacy**: Quyền riêng tư cho từng bài viết (Công khai hoặc Cá nhân).

---

## 2. Các tính năng phi chức năng (Non-functional Requirements)

- **UI/UX**: Giao diện mang hơi hướng "Apple Travel", tối giản, tinh tế, sử dụng các hiệu ứng ánh sáng (ambient orbs), chuyển động mượt mà. Tone màu ấm áp mang bản sắc Huế.
- **AI Interaction**: AI phải mang lại cảm giác thân thiện, như một người bạn đồng hành thực sự (không dùng giọng văn robot).
- **Mobile-first**: Thiết kế hoàn toàn tối ưu cho trải nghiệm trên điện thoại di động (Progressive Web App / Responsive).

## 3. Lộ trình triển khai MVP (Gợi ý)

1. **Giai đoạn 1**: Xây dựng UI/UX cốt lõi và hệ thống Navigation (Home, Khám phá, Chuyến đi).
2. **Giai đoạn 2**: Tích hợp Database địa điểm (Dữ liệu tĩnh ban đầu) và AI Flow (Prompt Engineering để sinh ra lịch trình).
3. **Giai đoạn 3**: Quản lý lịch trình cá nhân (CRUD chuyến đi, chỉnh sửa lịch trình).
4. **Giai đoạn 4**: Tính năng Nhật ký và các tiện ích nâng cao (Bản đồ offline).
