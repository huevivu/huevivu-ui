# Kỹ thuật chi tiết: Feature 06 - Core Infrastructure & API

## 1. Tổng quan
Đây là tài liệu quy định về kiến trúc cốt lõi của dự án (Framework, Routing, State Management, Authentication) đảm bảo ứng dụng HueViVu chạy ổn định, nhanh chóng và dễ dàng bảo trì.

## 2. Tech Stack (Khuyến nghị)
- **Frontend Framework**: Next.js (App Router) hoặc Vite (React). Next.js được ưu tiên để hỗ trợ SEO và Server-side Rendering (SSR) cho các trang public (Home, Explore).
- **Styling**: Vanilla CSS (như hiện tại) kết hợp CSS Variables để hỗ trợ Dark/Light mode và Theming.
- **State Management**: Zustand (nhỏ gọn, không boilerplate như Redux).
- **Backend / Database**: Supabase (PostgreSQL + Auth + Storage). Rất phù hợp với cấu trúc Database Schema hiện tại và hỗ trợ Realtime, Row Level Security (RLS).
- **AI Integration**: OpenAI API (GPT-4o-mini) cho Matching Engine.

## 3. Kiến trúc Xác thực (Authentication)
Dự án có 2 luồng: User vô danh (Guest) và User đã đăng nhập (Registered).

### 3.1 Guest Flow (Lưu Session)
- Khi user truy cập lần đầu, tạo một `session_id` ngẫu nhiên (UUID) và lưu vào `localStorage`.
- Mọi tương tác (Onboarding, Flow) sẽ được gắn với `session_id` này. Dữ liệu lưu cục bộ hoặc lưu tạm trên DB.
- Hạn chế: Khách chỉ được tạo tối đa 3 lịch trình (trips) mỗi thiết bị (để tránh lạm dụng API AI tốn phí).

### 3.2 Authenticated Flow (Supabase Auth)
- Hỗ trợ Login bằng Google / Email.
- Khi Guest đăng nhập thành công, trigger hàm `migrateGuestData(session_id, user_id)`: Chuyển toàn bộ các chuyến đi đang lưu dưới danh nghĩa Guest sang User thực.
- Cấp quyền `level`, theo dõi `total_trips`.

## 4. API & Network Layer
Tạo một file `api-client.js` hoặc `services/api.ts` chuẩn hóa.

```javascript
// Cấu trúc chuẩn hóa gọi API
const apiClient = axios.create({
  baseURL: '/api/v1',
  timeout: 15000,
});

apiClient.interceptors.response.use(
  (response) => response.data,
  (error) => {
    // Global Error Handling
    if (error.response?.status === 401) {
      // Redirect to login
    }
    return Promise.reject(error);
  }
);
```

## 5. Tối ưu Hiệu năng (Performance & SEO)
- **SEO**: Trang `home.html` và `explore.html` phải có đầy đủ Meta Tags, Open Graph cho Facebook/Zalo, Semantic HTML (`<header>`, `<main>`, `<article>`).
- **Web Vitals**:
  - *LCP (Largest Contentful Paint)*: Nạp trước (Preload) các font chữ (`Plus Jakarta Sans`) và ảnh nền Hero.
  - *CLS (Cumulative Layout Shift)*: Các card địa điểm cần set sẵn kích thước tĩnh (`min-height`) để tránh giật giao diện khi ảnh load xong.
- **PWA (Progressive Web App)**: Khuyến nghị thêm `manifest.json` và Service Worker để người dùng có thể "Cài đặt" HueViVu vào màn hình chính điện thoại, tăng cảm giác như một Native App.

## 6. Xử lý Ngoại lệ (Global Edge Cases)
- **404 Not Found**: Xây dựng trang `404.html` thân thiện, có nút quay về Home hoặc gợi ý "Khám phá Huế ngay".
- **500 Server Error**: Xây dựng trang báo lỗi máy chủ, ghi log lỗi (Sentry hoặc Supabase logs).
- **Rate Limiting**: Backend chặn spam request (ví dụ: tối đa 5 trips/phút cho 1 IP) để bảo vệ server khỏi bị tấn công DDoS hoặc lạm dụng API.
