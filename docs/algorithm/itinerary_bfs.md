# Thiết kế Thuật toán Đề xuất Lộ trình (Dựa trên Lưới 2D & BFS)

> [!NOTE]
> Tài liệu này mô tả ý tưởng và thiết kế luồng thuật toán gợi ý lộ trình du lịch dựa trên thuật toán loang theo chiều rộng (BFS) kết hợp với không gian lưới 2D (Grid Spatial Hashing). Tài liệu được đúc kết từ quá trình brainstroming.

## 1. Ý tưởng cốt lõi (Core Concept)

Thay vì duyệt qua toàn bộ các địa điểm trong thành phố bằng các thuật toán tính khoảng cách truyền thống tốn kém, ta mô hình hóa không gian thành một **Lưới 2D (Grid)**. 
- **Start (Điểm xuất phát):** Khách sạn, bến xe...
- **End (Điểm kết thúc):** Khách sạn, sân bay...

Bằng cách áp dụng **BFS Loang hai chiều (Bidirectional BFS)** kết hợp giới hạn không gian tìm kiếm, ta có thể tìm ra các lộ trình tối ưu về khoảng cách và phù hợp với quỹ thời gian của người dùng một cách nhanh chóng.

## 2. Các bước tinh chỉnh & Bổ sung

### 2.1. Mô hình hóa Không gian (Grid Spatial Hashing)
- Chia bản đồ thành các ô (Cell).
- Mỗi ô chứa một danh sách các POI (Points of Interest - Điểm tham quan, ăn uống) đã được phân loại. 
- Giúp thuật toán chỉ cần quan tâm đến các điểm trong ô hiện tại và ô lân cận thay vì rà quét toàn bộ bản đồ.

### 2.2. Giới hạn Không gian (Search Corridor / Bounding Box)
- **Vấn đề:** Không nên loang ra toàn bộ bản đồ vì sẽ gây bùng nổ tổ hợp.
- **Giải pháp:** Tạo một "corridor" (khu vực khoanh vùng dạng hình chữ nhật hoặc elip) bao quanh điểm Start và End. 
- Chỉ tải các địa điểm nằm trong khu vực này vào thuật toán BFS để tiết kiệm tài nguyên. Nếu số điểm thỏa mãn quá ít, thuật toán có thể tự động mở rộng dần "corridor" này.

### 2.3. Rẽ nhánh và Cắt tỉa (Pruning) trong BFS
- Mỗi bước loang (Node) không chỉ mang toạ độ, mà phải mang theo **Trạng thái (State)**: 
  `State = [Tọa độ ô hiện tại, Danh sách điểm đã đi, Tổng thời gian đã dùng]`
- **Cắt tỉa:** Trước khi quyết định loang sang ô tiếp theo, cần kiểm tra: `(Tổng thời gian đã đi + Thời gian tham quan ô mới + Thời gian ước tính về đích) > Quỹ thời gian trong ngày?`
  - Nếu **Có**: Hủy nhánh loang này (Không đi tiếp).
  - Nếu **Không**: Đi tiếp và cập nhật lại State.

### 2.4. Loang Hai Chiều (Bidirectional Search)
- Tối ưu hóa việc chia hướng (Ví dụ: "1 thằng đi lên đi xuống, 1 thằng đi lên đi phải"):
  - Một nhánh loang từ **Start** (Đại diện cho lịch trình buổi sáng/bắt đầu).
  - Một nhánh loang ngược từ **End** (Đại diện cho lịch trình buổi tối/kết thúc ngày).
- Khi hai nhánh giao nhau ở khu vực giữa bản đồ, ta sẽ ghép chúng lại thành một lộ trình hoàn chỉnh. Điều này giúp giảm độ phức tạp của bài toán từ $O(b^d)$ xuống chỉ còn $O(b^{d/2})$.

### 2.5. Heuristic BFS (Hướng tới A*)
- Thay vì dùng `Queue` (hàng đợi thông thường) để loang đều ra mọi hướng, ta nâng cấp lên `Priority Queue` (Hàng đợi ưu tiên).
- Khi nhìn sang 4 ô xung quanh, ô nào có địa điểm **khớp với vibe/sở thích** của user nhất thì ưu tiên đưa lên đầu hàng đợi để thuật toán loang về hướng đó trước.

---

## 3. Luồng thực thi hoàn chỉnh (Execution Flow)

1. **Tiền Xử lý (Pre-filtering):**
   - Query từ cơ sở dữ liệu các POI thỏa mãn tiêu chí cứng (Budget, Vibe, Loại hình...).
   - Lọc tiếp các điểm nằm trong "Search Corridor" giữa Start và End.
2. **Khởi tạo Lưới (Grid Init):**
   - Phân bổ các điểm vừa lọc vào các Ô (Cell) trên lưới 2D (dựa trên vĩ độ/kinh độ).
3. **Quá trình Loang (Bidirectional BFS):**
   - Khởi tạo 2 Hàng đợi Ưu tiên (Priority Queue) bắt đầu từ vị trí ô của Start và End.
   - Bắt đầu loang sang các ô xung quanh (Lên, Xuống, Trái, Phải).
   - *Nếu vào ô trống:* Chỉ cộng thời gian di chuyển.
   - *Nếu vào ô có POI:* Cộng thời gian di chuyển + thời gian tham quan POI đó.
   - Chủ động cắt tỉa các nhánh vượt quá quỹ thời gian cho phép.
4. **Hội quân (Intersection):**
   - Khi luồng từ Start và luồng từ End gặp nhau tại một tập hợp các ô (thường là khoảng thời gian buổi trưa/chiều), tiến hành ghép nối lộ trình.
5. **Đánh giá & Trả kết quả (Scoring):**
   - Chấm điểm tổng các lộ trình tìm được dựa trên độ khớp sở thích (Match Score) và độ tiện lợi khi di chuyển.
   - Trả về Top 3 (hoặc 5) lộ trình tốt nhất đưa lên giao diện người dùng (UI).

---

## 4. Kích thước Ô (Cell Sizing) & Đảm bảo Tiêu chí

Kích thước ô quyết định trực tiếp đến sự cân bằng giữa **độ chính xác lộ trình** và **tốc độ thuật toán**. Đối với đặc thù du lịch ở Huế, kích thước ô lý tưởng là **400m x 400m hoặc 500m x 500m**.

### 4.1. Tại sao là 500m x 500m?
- **Độ sai số chấp nhận được:** 500m tương đương khoảng 5 - 7 phút đi bộ. Trong trải nghiệm du lịch, sai số 5 phút di chuyển là hoàn toàn có thể chấp nhận được.
- **Tránh quá tải tổ hợp:** Với kích thước này, sau khi đã đi qua bước Lọc thô (Pre-filtering), một ô thường chỉ chứa khoảng 1 đến tối đa 3 điểm phù hợp, giúp thuật toán không bị "ngộp" khi xét các tổ hợp nhánh (States).
- **Tránh duyệt "ô trống":** Nếu chia quá nhỏ (VD: 50m x 50m), ma trận lưới sẽ khổng lồ, thuật toán phải lặp qua hàng ngàn ô không chứa địa điểm nào chỉ để mô phỏng quãng đường di chuyển.

### 4.2. Đảm bảo đúng tiêu chí của người dùng
- **Lọc trước khi đưa vào lưới (Pre-filtering):** Đây là nguyên tắc cốt lõi. Thuật toán BFS **không** chịu trách nhiệm duyệt xem địa điểm có hợp với tiêu chí người dùng hay không. Bước truy vấn cơ sở dữ liệu ban đầu đã phải loại bỏ các điểm không hợp (Vibe, Ngân sách...). Chỉ những điểm "chắc chắn phù hợp" mới được phép trải lên ma trận lưới.
- **Điểm ưu tiên (Matching Score):** 
  Mỗi POI trên ô lưu kèm `match_score`. Ví dụ một Cell có thể chứa dữ liệu: `[{ id: "lang_tu_duc", match_score: 95 }, { id: "doi_vong_canh", match_score: 85 }]`.
  Khi thuật toán BFS (kết hợp Heuristic A*) loang vào ô này, nó sẽ tự động sinh nhánh (State) ưu tiên cho các điểm có `match_score` cao hơn.

### 4.3. Nâng cấp tương lai: Lưới Đa cấp (QuadTree / H3)
- **Khu Trung tâm (Đại Nội, phố đi bộ):** Các điểm tham quan nằm sát vách nhau, du khách chủ yếu đi bộ -> Có thể chia ô nhỏ (100m x 100m).
- **Khu Ngoại ô (Các Lăng tẩm xa):** Các điểm thưa thớt cách xa nhau, du khách di chuyển bằng xe máy/taxi -> Gộp ô lớn (1km x 1km hoặc 2km x 2km).
