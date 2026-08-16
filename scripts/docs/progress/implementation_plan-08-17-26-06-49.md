# Kế hoạch Thực thi Phase 7: Admin Dashboard (Data Collection UI)

Xin lỗi bạn, tôi đã sơ ý không kiểm tra thư mục `data/` nên không biết bạn đã có sẵn file `huevivu.db` (SQLite) chứa dữ liệu quý giá từ trước! 

Việc bạn muốn tạo một giao diện trực quan (Web Form) để các thành viên điền dữ liệu địa điểm thay vì phải gõ lệnh hoặc chèn trực tiếp vào DB là một ý tưởng cực kỳ chuyên nghiệp và cần thiết cho một dự án lớn.

## User Review Required
> [!IMPORTANT]
> Dưới đây là lộ trình xây dựng **Giao diện Nhập liệu Địa điểm**. Hãy kiểm tra và xác nhận để tôi bắt tay vào thực hiện nhé.

## Phase 7.1: Xây dựng Giao diện Nhập Liệu (Data Entry Form)
Tôi sẽ tạo một trang ẩn dành riêng cho quản trị viên/cộng tác viên tại đường dẫn: `http://localhost:3000/admin/places/new`.

**Thiết kế Form nhập liệu (dựa theo schema):**
Form sẽ được chia thành các nhóm (Section) trực quan để người nhập không bị rối mắt:
1. **Thông tin Cơ bản**: Tên địa điểm, Địa chỉ, Danh mục (Dropdown: heritage, food, cafe...), Giá cả.
2. **Hình ảnh & Bản đồ**: URL hình ảnh, Tọa độ Lat/Lng.
3. **Thời gian & Thể lực**: Giờ mở cửa, Thời gian tham quan trung bình (phút), Đòi hỏi thể lực (Easy/Moderate/Hard), Mức độ đi bộ.
4. **Phân tích AI (Đặc tính)**:
   - *Vibe* (Cảm giác): Checkbox chọn nhiều (romantic, historic, bustling...)
   - *Crowd Level* (Mức độ đông đúc): Dropdown.
   - *Taste Profile* (Vị giác - dành cho quán ăn): Checkbox (spicy, sweet...).
   - *Highlights & Tips*: Ô nhập Text nhiều dòng.

**Trải nghiệm người dùng (UX):**
- Có nút "Lưu Địa Điểm".
- Thông báo Toast message (thành công/thất bại).
- Giao diện đẹp, có chia cột, thiết kế gọn gàng.

## Phase 7.2: Chuyển dữ liệu cũ từ SQLite sang Supabase (Tùy chọn)
Do bạn đã có sẵn file `data/huevivu.db`, nếu bạn muốn, tôi có thể viết một script nhỏ để **copy toàn bộ dữ liệu** từ file SQLite cũ của bạn và bắn thẳng lên Supabase (PostgreSQL) để bạn không bị mất công sức đã thu thập trước đây!

---
**Bạn có đồng ý duyệt kế hoạch xây dựng Giao diện nhập liệu này không?** Và bạn có muốn tôi làm luôn bước 7.2 (Chuyển data cũ lên Supabase) không?
