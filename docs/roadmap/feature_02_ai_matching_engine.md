# Kỹ thuật chi tiết: Feature 02 - AI Matching Engine & Generating Itinerary

## 1. Tổng quan
Đây là "bộ não" của HueViVu. AI Matching Engine có nhiệm vụ nhận Payload từ luồng Onboarding (Feature 01) và tìm kiếm trong bảng `PLACES` để lọc, chấm điểm (scoring), và sắp xếp các địa điểm thành một lịch trình hoàn chỉnh theo từng ngày.

## 2. Kiến trúc Xử lý (Backend / Serverless Function)

### 2.1 Thuật toán chấm điểm (Scoring Algorithm)
Mỗi địa điểm trong `PLACES` sẽ được chấm điểm từ 0-100 dựa trên độ khớp với `preferences` của user.

- **Base Score (Trọng số cơ bản)**: Dựa trên rating và độ phổ biến.
- **Match Score (Điểm khớp)**:
  - `pacing` = `action` 👉 ưu tiên các điểm `ideal_pacing = quick_stop` (+20 điểm).
  - `exploration` = `hidden_gems` 👉 ưu tiên `authenticity = 4, 5` (+25 điểm) và trừ điểm các nơi `crowd_level = high`.
  - `energy` = `early_bird` 👉 filter các điểm có `best_time_of_day` chứa `early_morning`.
  - `physical` = `comfort` 👉 loại bỏ các điểm `walking_distance = extensive` hoặc `weather_dependent = 1` nếu dự báo thời tiết có mưa.
  - `taste` và `styles`: Chấm điểm dựa trên sự xuất hiện của các tag trong `tags`, `vibe`, `taste_profile`.

### 2.2 Logic Phân bổ Lịch trình (Routing & Scheduling)
Sau khi có danh sách các điểm "Top Score", Engine sẽ phân bổ vào các ngày.
- **Giới hạn một ngày**: 
  - Sáng: 1-2 điểm tham quan + 1 ăn sáng + 1 cafe.
  - Chiều: 1-2 điểm tham quan + 1 ăn trưa.
  - Tối: 1 điểm vui chơi + 1 ăn tối.
- **Tối ưu khoảng cách (Distance Optimization)**: Các điểm trong cùng 1 buổi (Sáng/Chiều) phải có khoảng cách địa lý gần nhau (cùng phường/khu vực) để giảm thời gian di chuyển.
- **Cân bằng Ngân sách (Budget Balancing)**: Tổng `price` của các địa điểm + ăn uống trong 1 ngày không được vượt quá `budget_level` quy đổi theo ngày (VD: Moderate = ~800k VNĐ/ngày).

## 3. Tích hợp AI (Tùy chọn LLM)
Nếu sử dụng LLM (như OpenAI GPT-4 hoặc Gemini) để xử lý thay vì hard-code thuật toán:
1. Fetch toàn bộ danh sách `PLACES` từ Database (giới hạn Top 100 điểm tốt nhất).
2. Viết **System Prompt** truyền vào `preferences` và danh sách `PLACES` ở dạng JSON.
3. LLM trả về JSON Schema định sẵn chứa mảng `days`, `activities` và `ai_insight`.
4. Validate JSON trả về, lưu vào bảng `TRIPS`.

## 4. Giao tiếp Dữ liệu (Database)
- **Input**: Đọc từ bảng `PLACES`.
- **Output**: Lưu một bản ghi mới vào bảng `TRIPS` với cấu trúc JSON trong cột `itinerary`. Trả về `trip_id` cho Frontend.

## 5. Xử lý Ngoại lệ (Edge Cases)
- **Không tìm đủ địa điểm**: Nếu User chọn điều kiện quá ngặt nghèo (VD: 7 ngày, ăn chay, ở trong nhà, budget siêu rẻ), AI sẽ tự động "nới lỏng" các điều kiện phụ (như budget hoặc trong nhà) và sinh ra một trường `ai_insight` cảnh báo: "Do điều kiện thời tiết và số ngày dài, chúng tôi đã thêm một số điểm tham quan ngoài trời với chi phí hợp lý để làm phong phú chuyến đi".
- **LLM Timeout/Lỗi (Nếu dùng LLM)**: Fallback về thuật toán Rule-based nội bộ để luôn đảm bảo có kết quả trả về dưới 10 giây.
- **Lỗi Parse JSON (Nếu dùng LLM)**: Thử gọi LLM lại (Retry) tối đa 2 lần. Nếu vẫn lỗi, dùng template lịch trình tĩnh (Static Template) tốt nhất có sẵn.
