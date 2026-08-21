# Cấu trúc Cơ sở dữ liệu (Database Schema)

Để đáp ứng được thuật toán **Multi-Day State-Space BFS** và cơ chế **Pre-filtering** theo tiêu chí cá nhân hóa của HueViVu, bảng dữ liệu `places` (Các điểm POI) cần được thiết kế lại, chuẩn hóa và "dọn sạch" với các trường thông tin bắt buộc sau.

## Bảng: `places`

| Tên Cột | Kiểu dữ liệu (Supabase) | Giải thích & Vai trò trong Thuật toán |
| :--- | :--- | :--- |
| **`id`** | `uuid` | Khóa chính. Tự động sinh. |
| **`name`** | `text` | Tên địa điểm (VD: Lăng Tự Đức, Cơm Hến Hoa Đông). |
| **`description`** | `text` | Mô tả ngắn gọn để hiển thị trên UI. |
| **`image_url`** | `text` | Ảnh đại diện của địa điểm. |
| **`latitude`** | `float8` | Vĩ độ. Bắt buộc để ánh xạ địa điểm vào Lưới 2D (Grid). |
| **`longitude`** | `float8` | Kinh độ. Bắt buộc để ánh xạ địa điểm vào Lưới 2D (Grid). |
| **`poi_type`** | `text` | Phân loại gốc: `attraction` (tham quan), `food` (ăn uống), `transit` (ga, sân bay - dùng làm Anchor), `accommodation` (KS - dùng làm Anchor). |
| **`open_time`** | `time` | Giờ mở cửa (VD: `07:30:00`). Dùng để check ràng buộc Time-Window. |
| **`close_time`** | `time` | Giờ đóng cửa (VD: `17:00:00`). Dùng để check ràng buộc Time-Window. |
| **`duration_mins`** | `integer` | Thời gian tham quan/ăn uống trung bình tính bằng phút (VD: 90). Dùng để cộng dồn vào `State.time` khi BFS loang qua. |
| **`vibes`** | `text[]` (Array) | Mảng các tag cảm xúc (VD: `['chill', 'cultural', 'nature']`). Dùng để lọc thô (Pre-filter) khớp với lựa chọn của người dùng. |
| **`physical_level`**| `integer` | Mức độ tốn sức: 1 (Nhẹ nhàng), 2 (Vừa phải), 3 (Mất sức). Dùng để Pre-filter. |
| **`budget_level`** | `integer` | Mức giá: 1 (Rẻ), 2 (Trung bình), 3 (Cao cấp). Dùng để Pre-filter. |
| **`rating`** | `float4` | Điểm đánh giá (VD: 4.8). Dùng để làm hệ số nhân (Heuristic Score) khi thuật toán chọn nhánh ưu tiên. |

---

## Giải thích cách Thuật toán sử dụng Bảng này:

### Bước 1: Lọc thô (Pre-filtering) dựa trên Sở thích
Giả sử AI trích xuất được Context của người dùng là: *"Tôi muốn lịch trình chill, ít đi bộ, ngân sách vừa phải"*.
Câu lệnh truy vấn (Query) xuống DB sẽ là:
```sql
SELECT * FROM places 
WHERE 'chill' = ANY(vibes) 
  AND physical_level <= 1 
  AND budget_level <= 2
  AND poi_type = 'attraction';
```
👉 *Kết quả:* Từ 500 điểm ban đầu của thành phố Huế, chỉ còn khoảng 15-20 điểm "chắc chắn phù hợp với cá tính của người này" được trả về.

### Bước 2: Lọc Khung giờ theo Chặng (Time-Window Filtering)
Khi thuật toán lên lịch cho Chặng Sáng (VD: 9:00 - 12:00), nó sẽ tiếp tục lọc mảng 20 điểm ở trên. Bất kỳ địa điểm nào có `open_time > 10:00` (mở cửa trễ) hoặc các quán nhậu (chỉ mở chiều tối) sẽ bị loại thẳng tay. 
👉 *Kết quả:* Cuối cùng chỉ còn đúng 4-5 điểm hoàn hảo nhất được nạp vào Lưới BFS. Đảm bảo thuật toán chạy nhẹ tựa lông hồng.

### Bước 3: Tính toán Cắt tỉa nhánh trong BFS (Pruning)
Khi nhánh loang của thuật toán dẫm chân vào điểm "Lăng Tự Đức", nó sẽ lấy giá trị `duration_mins` (ví dụ 90 phút) để cộng vào tổng thời gian đã tiêu tốn của nhánh lộ trình đó.
- Nếu `Tổng thời gian đã đi + 90 phút > Thời gian cho phép của Chặng` ➔ Cắt bỏ nhánh đó (Không cho đi tiếp).
- Ngược lại ➔ Chấp nhận lưu trạng thái và cho loang tiếp đi tìm điểm thứ 2.
