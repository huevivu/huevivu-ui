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

---

## 5. Kiến trúc Đa ngày (Multi-Day) & Điểm Neo (Anchor Points)

Để xử lý bài toán lịch trình nhiều ngày với các điểm xuất phát/kết thúc thay đổi (Ví dụ: Ngày 1 từ Sân bay -> Khách sạn, Ngày 2 từ Khách sạn -> Ga tàu), hệ thống sử dụng chiến lược **Chia để trị (Divide and Conquer)** thông qua các **Key Locations (Anchor Points)**.

### 5.1. Khái niệm Anchor Points (Điểm Neo)
Điểm neo là các địa điểm mang tính "bắt buộc" và cố định về thời gian/không gian trong lịch trình của khách:
- Sân bay (Lúc đến/đi)
- Khách sạn (Check-in/Check-out/Ngủ qua đêm)
- Nhà ga, Bến xe...

### 5.2. Thuật toán Chia chặng (Segmentation)
Thay vì chạy một vòng lặp BFS khổng lồ cho toàn bộ chuyến đi 3 ngày (gây bùng nổ tổ hợp), thuật toán sẽ cắt nhỏ chuyến đi:
1. **Xác định các Khung thời gian (Time Envelopes):** Dựa vào các Anchor Points, chuyến đi được cắt thành các chặng nhỏ.
   - *Chặng 1 (Sáng Ngày 1):* `Start (Sân bay 9:00)` ➔ `End (Khách sạn 14:00)`.
   - *Chặng 2 (Chiều Ngày 1):* `Start (Khách sạn 15:00)` ➔ `End (Khách sạn 21:00)`.
2. **Gom cụm địa lý (Clustering):** Nhóm các địa điểm POI thành từng cụm. Phân bổ các cụm này vào các Chặng có quỹ đạo đường đi phù hợp (VD: Chặng Sân bay -> Khách sạn sẽ được phân bổ các POI nằm trên tuyến đường đó).
3. **Thực thi BFS Độc lập:** Chạy thuật toán BFS cho *từng chặng riêng biệt*. Vì mỗi chặng giờ đây chỉ còn 3-5 POI và quỹ thời gian ngắn, BFS sẽ chạy với tốc độ cực nhanh và không bị bùng nổ trạng thái.

### 5.3. Ý nghĩa kiến trúc
Việc sử dụng các cặp "Key Locations" đóng vai trò như các chốt chặn, giúp ngắt nhỏ không gian tìm kiếm. Đây là mảnh ghép quan trọng nhất để biến BFS thành một thuật toán chạy thực tế (Production-ready) trên hệ thống HueViVu.

---

## 6. Chiến lược Thu thập Dữ liệu Đầu vào (User Input Strategy)

Để thuật toán có đủ "nguyên liệu" (Anchor Points & Tiêu chí) mà không vi phạm nguyên tắc thiết kế cốt lõi của HueViVu (tránh các form nhập liệu khô khan, ép buộc), hệ thống áp dụng các giải pháp thu thập dữ liệu khéo léo sau:

### 6.1. Thuật toán cần gì? (Data Requirements)
- **Không gian & Thời gian (Neo):** Địa điểm/Giờ đến (Sân bay/Ga), Vị trí Khách sạn, Địa điểm/Giờ rời đi.
- **Tiêu chí lọc thô (Pre-filtering):** Cảm xúc/Sở thích (Vibe), Ngân sách, Nhịp độ (Relaxed hay Năng động).

### 6.2. Giải pháp thu thập theo chuẩn UX của HueViVu
1. **Trích xuất thông minh bằng AI (NLP Extraction):**
   - Giao diện không dùng form "Dropdown / Date Picker" truyền thống. Cho phép người dùng nhập/nói một câu tự nhiên.
   - *Ví dụ:* "Sáng mai mình bay chuyến 9h tới Phú Bài, ở KS Melia, mình muốn đi kiểu nhẹ nhàng."
   - AI (LLM) đằng sau sẽ tự động bóc tách thành data có cấu trúc: `[Anchor_Start: Phú Bài (09:00)]`, `[Anchor_Hotel: Melia]`, `[Vibe: Relaxed]` và bơm vào thuật toán.
2. **Khởi tạo với "Neo Ảo" (Smart Defaults & Lazy Input):**
   - Nếu người dùng chưa có vé máy bay hoặc chưa chốt khách sạn -> **Tuyệt đối không chặn flow**.
   - Thuật toán sẽ tự động thiết lập một "Neo Ảo" (Virtual Anchor) nằm ở lõi trung tâm thành phố (VD: Ngã 6 hoặc Phố đi bộ) làm điểm Start/End mặc định, với khung giờ tiêu chuẩn (Sáng 8:00 - Tối 21:00).
   - AI Companion sẽ hiện một thông điệp bối cảnh tinh tế: *"Mình tạm chọn điểm xuất phát từ trung tâm thành phố. Khi nào bạn chốt được khách sạn, cứ nhắn mình để tinh chỉnh lại đường đi cho tiện nhất nhé ✨"*
3. **Tinh chỉnh qua Hội thoại (Conversational Refinement):**
   - Việc điều chỉnh các Điểm Neo (Anchor) có thể diễn ra "on-the-fly" khi đang xem lịch trình.
   - *Ví dụ:* User chat *"Chiều mai 5h mình phải ra bến xe rồi"*. Ngay lập tức, AI cập nhật `Anchor_End` của Ngày 2 thành "Bến Xe lúc 17:00", và thuật toán BFS chỉ chạy lại đúng chặng của Chiều Ngày 2 để vẽ đường về bến xe, giữ nguyên các chặng khác.
