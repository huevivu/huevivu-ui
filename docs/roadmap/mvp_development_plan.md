# KẾ HOẠCH PHÁT TRIỂN MVP - DỰ ÁN HUEVIVU
*(Tài liệu lưu hành nội bộ - Báo cáo tiến độ)*

## 1. Mục tiêu dự án
Xây dựng và ra mắt phiên bản Minimum Viable Product (MVP) cho ứng dụng HueViVu - Trợ lý du lịch AI thông minh tại Huế trong thời gian 4 tuần. MVP sẽ tập trung vào các tính năng cốt lõi nhất để kiểm chứng nhu cầu thị trường, trình diễn ý tưởng và thu thập phản hồi từ người dùng đầu tiên.

## 2. Phạm vi MVP (Scope of Work)
Dựa trên bản đặc tả tính năng đã thống nhất, MVP sẽ bao gồm:
- **Module 1**: Giao diện người dùng cốt lõi (Trang chủ, Khám phá, Quản lý chuyến đi).
- **Module 2**: AI Trip Planner cơ bản (Thu thập sở thích qua form 9 bước và trả về lịch trình tĩnh được mock-up).
- **Module 3**: Nhật ký du lịch (Travel Journal) dạng cơ bản (Lưu text và hình ảnh offline).
- **Giới hạn**: Bản MVP dành cho báo cáo này chưa tích hợp Database thời gian thực hay Backend phức tạp, không yêu cầu hệ thống đăng nhập/tài khoản (chạy hoàn toàn ở client-side/LocalStorage).

## 3. Lộ trình triển khai (Timeline)
Tổng thời gian dự kiến: **4 Tuần**

### Tuần 1: Khởi tạo & Thiết kế (Khảo sát & Lên ý tưởng)
- **Công việc**:
  - Chốt danh sách tính năng MVP để đưa vào báo cáo.
  - Thiết kế Wireframe và UI/UX (Sử dụng Figma).
  - Lên cấu trúc thư mục, khởi tạo source code frontend.
- **Kết quả nghiệm thu**: Bản thiết kế UI/UX hoàn chỉnh, Base project setup.

### Tuần 2: Xây dựng Giao diện & Frontend Core
- **Công việc**:
  - Viết mã HTML/CSS/JS cho trang Home, Explore, Flow (Luồng tạo lịch trình).
  - Xử lý responsive cho thiết bị di động (Mobile-first).
  - Khởi tạo các components dùng chung (Buttons, Forms, Navigation Bar).
- **Kết quả nghiệm thu**: Các trang web tĩnh hoàn thiện giao diện, có thể điều hướng qua lại.

### Tuần 3: Ghép nối Logic & Tích hợp Mock Data
- **Công việc**:
  - Xử lý logic Javascript cho form 9 bước tạo lịch trình.
  - Viết thuật toán điều phối (hoặc mock data/giả lập API) để sinh lịch trình dựa trên các lựa chọn của người dùng.
  - Cấu hình lưu trữ dữ liệu chuyến đi, thông tin lưu tạm vào LocalStorage của trình duyệt.
- **Kết quả nghiệm thu**: Luồng tạo lịch trình hoạt động mượt mà từ đầu đến cuối (User Flow hoàn chỉnh).

### Tuần 4: Kiểm thử, Tối ưu & Đóng gói Báo cáo (Release)
- **Công việc**:
  - Kiểm thử toàn bộ luồng người dùng, kịch bản edge cases.
  - Tối ưu hóa hiệu năng, dung lượng ảnh và sửa lỗi giao diện (CSS bugs).
  - Triển khai (Deploy) ứng dụng lên Vercel/GitHub Pages để phục vụ demo trực tuyến.
  - Hoàn thiện slide và tài liệu báo cáo nghiệm thu.
- **Kết quả nghiệm thu**: Link demo MVP chạy ổn định, không lỗi nghiêm trọng, sẵn sàng trình bày.

## 4. Phân bổ nguồn lực (Team Allocation)
- **01 Project Manager (PM) / BA**: Quản lý tiến độ, phân chia task, viết tài liệu và làm báo cáo.
- **01 UI/UX Designer**: Thiết kế giao diện, cắt tài nguyên ảnh (assets).
- **02 Frontend Developers**: Lập trình giao diện, xử lý logic tương tác.
- **01 QA/Tester**: Kiểm thử chức năng, tìm lỗi (bugs) và kiểm tra tương thích trình duyệt.

## 5. Đánh giá rủi ro & Kế hoạch dự phòng
| Rủi ro | Mức độ | Biện pháp xử lý / Dự phòng |
|---|---|---|
| Chậm tiến độ phần AI Logic | Cao | Sử dụng dữ liệu tĩnh (Mock data/Hardcode) phân nhánh sẵn cho bản báo cáo đầu tiên thay vì gọi API AI thật sự, nhằm đảm bảo có sản phẩm demo kịp hạn. |
| Giao diện hiển thị sai trên Mobile | Trung bình | Yêu cầu developer áp dụng Mobile-first ngay từ đầu và kiểm tra liên tục trên Chrome DevTools (cỡ màn hình iPhone/Android). |
| Scope Creep (Phình to yêu cầu) | Cao | PM cần kiên quyết cắt bỏ các tính năng không thuộc phạm vi MVP (như hệ thống Đăng nhập/Đăng ký, Database đám mây, Thanh toán). |

## 6. Tiêu chí nghiệm thu cuối cùng (Acceptance Criteria)
- Ứng dụng có thể mở và chạy mượt mà trên trình duyệt mà không cần cài đặt thêm phần mềm.
- Người dùng có thể click trải nghiệm hết quy trình điền form và nhận lại 1 lịch trình gợi ý.
- Giao diện đẹp, chuyên nghiệp và đáp ứng tốt trên màn hình điện thoại (Responsive).
- Nút bấm và điều hướng hoạt động bình thường, không có lỗi crash trình duyệt.
