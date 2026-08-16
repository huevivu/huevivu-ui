# Kỹ thuật chi tiết: Feature 01 - Onboarding & User Persona Profiling

## 1. Tổng quan
Chức năng Onboarding đóng vai trò thu thập dữ liệu đầu vào (Preferences) để tạo ra chân dung người dùng (Persona). Dữ liệu này sẽ quyết định độ chính xác của AI Matching Engine. Luồng hiện tại gồm 9 bước (Duration, Companion, Budget, Pacing, Exploration, Energy, Physical, Taste, Styles).

## 2. Kiến trúc Dữ liệu (State & Data Model)

### 2.1 Frontend State (Zustand hoặc React Context)
State của luồng Onboarding cần được quản lý tập trung và lưu trữ tạm thời (persisted) để tránh mất dữ liệu nếu người dùng tải lại trang.

```javascript
interface OnboardingState {
  currentStep: number;
  isSubmitting: boolean;
  answers: {
    duration: number | null; // e.g., 3
    companion: 'solo' | 'couple' | 'friends' | 'family' | null;
    budget: 'budget' | 'moderate' | 'premium' | 'luxury' | null;
    pacing: 'action' | 'relaxed' | 'balanced' | null;
    exploration: 'hidden_gems' | 'iconic' | 'story' | null;
    energy: 'early_bird' | 'night_owl' | null;
    physical: 'outdoorsy' | 'comfort' | null;
    taste: string[]; // e.g., ['spicy', 'street']
    styles: string[]; // e.g., ['culture', 'nature']
  };
}
```

### 2.2 Payload API gửi xuống Backend
```json
{
  "user_id": "guest_12345",
  "session_id": "sess_abcxyz",
  "preferences": {
    "duration_days": 3,
    "budget_level": "moderate",
    "companion": "friends",
    "behavioral": {
      "pacing": "action",
      "exploration_style": "hidden_gems",
      "energy_level": "early_bird",
      "physical_comfort": "outdoorsy"
    },
    "food_taste": ["spicy", "street"],
    "interests": ["culture", "nature"]
  }
}
```

## 3. Logic Xử lý & Thuật toán Frontend

### 3.1 Chuyển bước mượt mà (Smooth Transitions)
- Tránh render lại toàn bộ DOM. Sử dụng CSS classes (`active`, `exit-left`, `exit-right`) để xử lý animation như hiện tại.
- Thời gian trễ (debounce) khoảng 400ms sau khi chọn xong (đối với single-select) để tự động chuyển bước, tạo cảm giác mượt mà không cần bấm "Next".

### 3.2 Validate (Kiểm tra hợp lệ)
- Nút "Next" chỉ được enable khi `answers[currentStepKey]` khác rỗng.
- Đối với `taste` và `styles` (multi-select), yêu cầu tối thiểu 1 lựa chọn và tối đa 3 lựa chọn để không làm nhiễu thuật toán AI. Nếu chọn quá 3, hiển thị Toast cảnh báo: "Bạn chỉ nên chọn tối đa 3 sở thích nổi bật nhất".

## 4. Giao tiếp Backend & API Integration

- **Endpoint**: `POST /api/v1/trips/generate`
- **Luồng hoạt động**:
  1. Người dùng hoàn thành bước 9, app chuyển sang bước 10 (AI Thinking).
  2. Gửi request POST tới endpoint trên. Cờ `isSubmitting = true`.
  3. API có thể mất 3-10 giây để xử lý (Nếu dùng LLM thực).
  4. Frontend hiển thị các câu Fun Fact ngẫu nhiên về Huế trong lúc chờ.
  5. Nếu API trả về `200 OK` chứa `trip_id`, chuyển sang bước 11 (Result) và lấy dữ liệu render.

## 5. Xử lý Ngoại lệ (Edge Cases)

- **Mất kết nối mạng**: Catch lỗi ở `catch(err)`, hiển thị màn hình báo lỗi nhẹ nhàng: "Đường truyền đang gián đoạn, nhưng đừng lo, sở thích của bạn đã được lưu lại. Thử lại nhé?". Cung cấp nút "Thử lại".
- **Hành vi Spam click**: Disable toàn bộ options trong 400ms sau khi click để tránh lỗi state.
- **Dữ liệu trống do bypass HTML**: Kiểm tra lại state.answers trước khi đóng gói payload gửi đi. Nếu thiếu, ép quay lại bước đầu tiên bị thiếu.
- **Quay lại trang chủ (Back button)**: Nếu user ấn Back trình duyệt, prompt xác nhận: "Bạn có chắc muốn hủy việc tạo lịch trình không? Dữ liệu sẽ không được lưu." (Bắt event `popstate`).
