# DANH SÁCH CẢI TIẾN KỸ THUẬT (TECHNICAL IMPROVEMENTS)

**Dự án**: HueViVu - Trợ lý du lịch AI thông minh tại Huế
**Mục tiêu**: Đề xuất các giải pháp nâng cấp mã nguồn và kiến trúc hệ thống từ phiên bản MVP tĩnh (Vanilla HTML/CSS/JS) lên phiên bản phần mềm thực tế (Production-ready).

## 1. Nâng cấp Kiến trúc Frontend (Frontend Architecture)
- **Chuyển đổi sang Modern Framework**: Nâng cấp từ Vanilla Javascript lên **React.js** hoặc **Next.js**. Việc này giúp:
  - Tăng khả năng tái sử dụng code thông qua việc chia nhỏ các Component (như Thẻ địa điểm, Thanh điều hướng, Nút bấm).
  - Quản lý DOM hiệu quả hơn, chuyển trang mượt mà không cần load lại toàn bộ website.
  - Tối ưu SEO cho các trang địa điểm công khai (nếu sử dụng Next.js SSR).
- **State Management**: Sử dụng các thư viện quản lý trạng thái toàn cục như **Zustand** hoặc **Redux** để dễ dàng chia sẻ dữ liệu chuyến đi, bộ lọc tìm kiếm và trạng thái đăng nhập giữa nhiều trang khác nhau.
- **Type Safety**: Chuyển đổi mã nguồn sang **TypeScript** để giảm thiểu tối đa các lỗi ngầm (runtime errors) và giúp code dễ bảo trì hơn khi làm việc nhóm.

## 2. Xây dựng Backend & Cơ sở dữ liệu (Backend & Database)
- **API Server**: Phát triển hệ thống RESTful API bằng **Node.js (Express/NestJS)** để xử lý logic nghiệp vụ và kết nối với AI.
- **Database (Cơ sở dữ liệu)**:
  - Thiết kế Database bằng **PostgreSQL** hoặc **MongoDB** để lưu trữ thật (persist data) dữ liệu người dùng, thông tin lịch trình (Trips), và các bài viết nhật ký (Journals).
  - Sử dụng **Redis** để caching các truy vấn phổ biến (như danh sách các địa điểm trending) giúp hệ thống phản hồi siêu tốc.
- **Authentication (Xác thực)**: Xây dựng tính năng đăng nhập/đăng ký bảo mật bằng **JWT (JSON Web Tokens)** hoặc tích hợp **OAuth2** (Cho phép đăng nhập nhanh qua Google/Facebook).

## 3. Tích hợp AI Thực tế (Real AI Integration)
- **LLM API Integration**: Loại bỏ các dữ liệu giả lập (mock data), tiến hành gọi API thực tế tới các mô hình AI tiên tiến (như OpenAI GPT-4o hoặc Anthropic Claude 3.5).
- **Dynamic Prompt Engineering**: Xây dựng hệ thống cấu trúc Prompt tự động. Khi người dùng hoàn thành form 9 bước, hệ thống sẽ tự động ghép các thông số (thời gian, ngân sách, sở thích...) thành một câu lệnh hoàn chỉnh gửi cho AI.
- **RAG (Retrieval-Augmented Generation)**: Xây dựng cơ sở dữ liệu Vector chứa thông tin du lịch thực tế, chính xác của Huế (giá vé, giờ mở cửa...). RAG sẽ giúp AI kết hợp kiến thức nền với dữ liệu thực tế này, đảm bảo lịch trình sinh ra **không bị ảo giác (hallucination)**.

## 4. Tối ưu Hiệu năng & Trải nghiệm (Performance & UX)
- **Image Optimization**: Tự động nén ảnh sang định dạng WebP/AVIF và áp dụng **Lazy Loading** cho các hình ảnh trong trang Khám phá để tiết kiệm băng thông và tăng tốc độ tải.
- **PWA (Progressive Web App)**: Cấu hình PWA kèm Service Worker. Điều này cho phép người dùng "cài đặt" HueViVu vào màn hình chính điện thoại như một App native thực thụ. Đồng thời hỗ trợ cache dữ liệu để xem bản đồ/lịch trình ngay cả khi mất mạng (rất cần thiết khi đi du lịch).
- **Micro-interactions**: Nâng cấp các hiệu ứng chuyển động bằng CSS Animations phức tạp hơn hoặc thư viện Framer Motion để tạo cảm giác cao cấp (Premium feel) giống triết lý thiết kế của Apple.

## 5. Triển khai & Bảo mật (Deployment & DevSecOps)
- **CI/CD Pipeline**: Thiết lập luồng tự động kiểm thử và triển khai (Sử dụng GitHub Actions) để đảm bảo chất lượng code luôn xanh (pass tests) trước khi phát hành tính năng mới.
- **Hosting**: Triển khai Frontend lên Vercel/Netlify và Backend lên AWS/Render.
- **Security**: Cài đặt Rate Limiting chống spam request (đặc biệt quan trọng để bảo vệ chi phí gọi API AI) và thực hiện Data Sanitization để chống lỗi XSS từ các form nhập liệu.
