# MD Reader Specification

## 1. Mục tiêu

Ứng dụng tập trung vào 2 chức năng chính:

1. Đọc file Markdown một cách đẹp, giống một trình đọc tài liệu chuyên nghiệp.
2. Xuất nội dung Markdown đang đọc thành file PDF có bố cục đẹp, phù hợp để in hoặc lưu trữ.

Không cần hệ thống tài khoản, đăng nhập, database hay backend phức tạp.

Ưu tiên ứng dụng chạy hoàn toàn phía client nếu có thể.

## 2. Công nghệ

Có thể sử dụng:

* React + TypeScript
* Vite
* Tailwind CSS
* thư viện Markdown parser như `react-markdown`
* `remark-gfm` để hỗ trợ GitHub Flavored Markdown
* thư viện syntax highlighting như `rehype-highlight` hoặc `Shiki`
* thư viện PDF phù hợp như `html2canvas + jsPDF` hoặc giải pháp PDF chất lượng cao hơn nếu phù hợp

Nếu có thể, ưu tiên phương án xuất PDF từ HTML/CSS để PDF giữ được bố cục đẹp.

Code phải có cấu trúc rõ ràng, dễ bảo trì.

## 3. Giao diện tổng thể

Thiết kế theo phong cách:

* Minimal
* Modern
* Documentation reader
* Giống GitHub / Notion / Obsidian nhưng đơn giản hơn
* Không quá nhiều màu sắc
* Typography đẹp
* Khoảng trắng hợp lý
* Responsive

Desktop là giao diện chính nhưng vẫn phải sử dụng tốt trên tablet/mobile.

Layout:

```text
┌─────────────────────────────────────────────────────────────┐
│ MD Reader     [Open File] [Export PDF] [☀/☾] [Settings]   │
├───────────────┬─────────────────────────────────────────────┤
│               │                                             │
│ Document      │                                             │
│              │        Markdown Content                     │
│              │                                             │
│ Table of      │        # Tiêu đề                           │
│ Contents      │                                             │
│              │        Nội dung...                          │
│              │                                             │
│              │                                             │
└───────────────┴─────────────────────────────────────────────┘
```

## 4. Mở file Markdown

Có nút:

**Open Markdown**

Khi click:

* mở file picker
* chỉ cho chọn `.md` và `.markdown`
* đọc file trực tiếp trên browser
* không upload file lên server

Ngoài ra hỗ trợ:

### Drag & Drop

Người dùng có thể kéo file `.md` vào cửa sổ trình duyệt.

Hiển thị vùng:

> Drop your Markdown file here

Sau khi thả file:

* đọc nội dung
* render Markdown
* lấy filename làm tên tài liệu

Ví dụ:

`software-requirements.md`

hiển thị:

`Software Requirements`

## 5. Markdown rendering

Hỗ trợ đầy đủ Markdown phổ biến:

* Heading H1 → H6
* Paragraph
* Bold
* Italic
* Strikethrough
* Ordered list
* Unordered list
* Nested list
* Task list
* Blockquote
* Link
* Image
* Horizontal rule
* Inline code
* Code block
* Table
* Footnote nếu thư viện hỗ trợ tốt

Đặc biệt hỗ trợ GitHub Flavored Markdown.

Ví dụ:

```markdown
# Hệ thống quản lý

## 1. Tổng quan

Đây là **hệ thống quản lý**.

### Chức năng

- Quản lý người dùng
- Quản lý sản phẩm
- Quản lý đơn hàng

| STT | Chức năng | Trạng thái |
|---|---|---|
| 1 | Đăng nhập | Hoàn thành |
| 2 | Sản phẩm | Đang làm |
```

phải được render thành giao diện tài liệu đẹp.

## 6. Typography

Phần nội dung phải được tối ưu để đọc lâu.

Thiết lập:

* max-width khoảng 800–900px
* line-height khoảng 1.7
* heading có khoảng cách rõ ràng
* paragraph dễ đọc
* bảng có border nhẹ
* code block có background riêng
* blockquote có visual distinction
* link dễ nhận biết

Không để nội dung trải dài toàn bộ màn hình.

## 7. Syntax Highlighting

Code block phải được highlight.

Ví dụ:

```javascript
const hello = "Hello World";
console.log(hello);
```

Hỗ trợ ít nhất:

* JavaScript
* TypeScript
* HTML
* CSS
* JSON
* Python
* Java
* C
* C++
* C#
* PHP
* SQL
* Bash
* Markdown

Nếu Markdown chỉ định language:

````markdown
```javascript
console.log("Hello");
```
````

phải highlight đúng ngôn ngữ.

Có nút **Copy** ở góc code block.

Khi copy thành công hiển thị trạng thái:

`Copied`

## 8. Table of Contents

Tự động phân tích các heading:

```text
Table of Contents

1. Introduction
2. System Overview
3. Requirements
   3.1 Functional Requirements
   3.2 Non-functional Requirements
4. Architecture
5. Conclusion
```

TOC nằm ở sidebar.

Click vào mục nào thì scroll đến heading tương ứng.

Khi người dùng scroll tài liệu:

* mục hiện tại trong TOC được highlight.

Nếu tài liệu không có heading thì không hiển thị TOC.

## 9. Reading progress

Ở phía trên màn hình có thanh progress nhỏ.

Ví dụ:

```text
━━━━━━━━━━━━━━━━━━━━━━
██████████░░░░░░░░░░░░ 48%
━━━━━━━━━━━━━━━━━━━━━━
```

Progress dựa trên vị trí scroll của tài liệu.

## 10. Dark Mode

Có nút:

* Light
* Dark

Dark mode phải áp dụng cho:

* background
* text
* heading
* code block
* table
* blockquote
* sidebar
* toolbar

Không chỉ đơn giản đảo màu.

Lưu theme vào `localStorage`.

## 11. Font size

Trong Settings cho phép:

* Small
* Medium
* Large

Có thể dùng slider:

```text
A ─────────●──────── A
```

Thay đổi kích thước chữ nội dung mà không làm hỏng layout.

## 12. Full Screen Reading

Có nút:

**Focus Mode**

Khi bật:

* ẩn sidebar
* ẩn các control không cần thiết
* nội dung nằm giữa màn hình
* tối ưu cho việc đọc tài liệu dài

Có nút thoát Focus Mode.

## 13. Export PDF

Đây là chức năng quan trọng.

Nút:

**Export PDF**

Khi click mở modal:

```text
Export PDF

Document
Software Requirements

Paper size
○ A4
○ A5
○ Letter

Orientation
○ Portrait
○ Landscape

Theme
○ Light
○ Dark

Margins
○ Normal
○ Narrow
○ Wide

[ Cancel ] [ Export PDF ]
```

Mặc định:

* A4
* Portrait
* Light
* Normal margins

## 14. PDF phải đẹp

PDF xuất ra phải giống một tài liệu chuyên nghiệp, không phải screenshot của website.

PDF phải:

* selectable text
* copy được text
* search được text
* phân trang đúng
* không bị cắt heading
* không bị cắt bảng
* code block không bị vỡ
* hình ảnh hiển thị đúng
* link vẫn có thể click nếu thư viện hỗ trợ
* font dễ đọc

Đặc biệt tránh trường hợp:

```text
Heading
----------------
bị cắt đôi giữa hai trang
```

Nếu heading nằm gần cuối trang thì chuyển heading + phần nội dung tiếp theo sang trang mới khi cần.

## 15. PDF Header / Footer

Có thể thêm tùy chọn:

```text
[✓] Show header
[✓] Show footer
```

Header:

```text
MD Reader
Software Requirements
```

Footer:

```text
Page 1
```

Nếu có thể, thêm ngày xuất PDF.

## 16. PDF filename

Nếu file gốc:

`software-requirements.md`

PDF mặc định:

`software-requirements.pdf`

Nếu chưa mở file mà người dùng paste Markdown trực tiếp:

`document.pdf`

## 17. Print Preview

Thêm chức năng:

**Print / Preview**

Cho phép người dùng xem trước bản in trước khi xuất PDF.

CSS phải có:

```css
@media print
```

để đảm bảo nội dung khi print cũng đẹp.

## 18. Paste Markdown

Ngoài Open File, thêm nút:

**Paste Markdown**

Mở editor đơn giản để người dùng paste Markdown.

Layout:

```text
┌──────────────────────────────────────────────┐
│ Markdown Input                               │
│                                              │
│ # Hello                                      │
│                                              │
│ This is **Markdown**.                        │
│                                              │
└──────────────────────────────────────────────┘

              [ Preview ]
```

Sau đó chuyển sang Reader.

Không cần xây dựng editor Markdown quá phức tạp.

## 19. Recent Documents

Không cần database.

Có thể lưu metadata của những tài liệu gần đây vào `localStorage`.

Ví dụ:

```text
Recent Documents

Software Requirements.md
Yesterday

System Analysis.md
2 days ago

Project Documentation.md
5 days ago
```

Không lưu nội dung file nếu không cần thiết.

Có nút:

`Clear History`

## 20. Empty State

Khi chưa mở tài liệu:

```text
              MD

        Markdown Reader

Read beautiful Markdown documents
and export them to professional PDF files.

      [ Open Markdown ]

      or

Drag & Drop your .md file here
```

Bên dưới:

```text
Supports
Markdown · GFM · Tables · Code · Images · PDF
```

## 21. Error handling

Phải xử lý:

* file không phải Markdown
* file quá lớn
* Markdown lỗi
* image không load được
* PDF export thất bại
* browser không hỗ trợ một tính năng

Không để ứng dụng crash.

Hiển thị toast/error message rõ ràng.

## 22. Architecture

Tách component rõ ràng.

Ví dụ:

```text
src/
├── components/
│   ├── Header/
│   ├── Sidebar/
│   ├── MarkdownViewer/
│   ├── MarkdownInput/
│   ├── TableOfContents/
│   ├── CodeBlock/
│   ├── ExportPdfModal/
│   ├── Settings/
│   └── EmptyState/
│
├── hooks/
│   ├── useMarkdown.ts
│   ├── useTheme.ts
│   └── useReadingProgress.ts
│
├── utils/
│   ├── markdown.ts
│   ├── pdf.ts
│   └── storage.ts
│
├── styles/
│
└── App.tsx
```

Có thể thay đổi cấu trúc nếu có kiến trúc tốt hơn.

## 23. Security

Markdown có thể chứa HTML/script.

Phải sanitize HTML để tránh XSS.

Không được thực thi JavaScript từ nội dung Markdown.

Nếu sử dụng `rehype-raw`, phải kết hợp với sanitizer phù hợp.

File Markdown phải được xử lý local trên browser.

## 24. Performance

Ứng dụng phải hoạt động tốt với Markdown dài.

Ưu tiên:

* lazy loading nếu cần
* memoization
* tránh render lại toàn bộ document khi scroll
* debounce các thao tác phù hợp

Với tài liệu vài trăm KB vẫn phải đọc được tương đối mượt.

## 25. Responsive

Desktop:

```text
Sidebar 260px
Content 800–900px
Toolbar
```

Tablet:

* sidebar thu nhỏ hoặc collapsible

Mobile:

* sidebar trở thành drawer
* toolbar responsive
* nội dung full width với padding
* bảng có horizontal scroll
* code block có horizontal scroll

## 26. Accessibility

Hỗ trợ:

* keyboard navigation
* semantic HTML
* button có aria-label
* focus state
* contrast đủ tốt
* heading hierarchy đúng

## 27. Không làm quá mức

Đây là ứng dụng đọc Markdown, không phải Notion.

Không thêm:

* authentication
* database
* user management
* collaboration
* cloud storage
* payment
* backend nếu không cần

Giữ app đơn giản, nhanh và ổn định.

## 28. Tiêu chí hoàn thành

Ứng dụng được coi là hoàn thành khi:

1. Có thể mở `.md`.
2. Có thể kéo thả `.md`.
3. Markdown render đẹp.
4. GFM hoạt động.
5. Code syntax highlighting hoạt động.
6. Có Copy Code.
7. Có Table of Contents.
8. TOC scroll đúng đến heading.
9. Có reading progress.
10. Có Light/Dark mode.
11. Có Focus Mode.
12. Có điều chỉnh font size.
13. Có Paste Markdown.
14. Có Export PDF.
15. PDF A4 đẹp.
16. PDF có selectable text.
17. PDF phân trang chính xác.
18. Không cắt heading/code/table một cách bất hợp lý.
19. Có Print Preview.
20. Responsive.
21. Không có lỗi console nghiêm trọng.
22. Không có XSS từ Markdown.
23. Không cần backend.

## 29. QUY TRÌNH BẮT BUỘC SAU KHI CODE

Không được chỉ viết code rồi kết luận hoàn thành.

Sau khi xây dựng xong:

### Bước 1 — Chạy project

Khởi động development server và đảm bảo app chạy được.

### Bước 2 — Tự kiểm thử bằng browser

Sử dụng browser để mở web thật.

Kiểm tra:

* giao diện
* responsive
* buttons
* modal
* sidebar
* TOC
* dark mode
* file upload
* drag/drop
* Markdown rendering
* code block
* copy code
* PDF export
* print preview

### Bước 3 — Tạo dữ liệu test

Tạo một file Markdown test chứa:

* H1–H6
* paragraph
* bold
* italic
* lists
* nested lists
* checkbox
* blockquote
* links
* image
* table
* JavaScript code
* Python code
* JSON code
* long content

Dùng file này để kiểm tra toàn bộ hệ thống.

### Bước 4 — Kiểm tra PDF

Export PDF và kiểm tra trực tiếp file PDF.

Đặc biệt kiểm tra:

* page break
* heading
* paragraph
* table
* code block
* image
* footer
* page number
* font
* margins
* A4
* selectable text

### Bước 5 — Tự tìm lỗi

Không chờ tôi chỉ lỗi.

Nếu phát hiện:

* UI lệch
* overflow
* font quá nhỏ
* spacing xấu
* PDF bị cắt
* button không hoạt động
* console error
* responsive lỗi

thì tự sửa.

Sau khi sửa phải test lại.

### Bước 6 — Lặp lại

Quy trình:

```text
CODE
 ↓
RUN
 ↓
OPEN BROWSER
 ↓
TEST
 ↓
FIND BUGS
 ↓
FIX
 ↓
TEST AGAIN
 ↓
EXPORT PDF
 ↓
VERIFY PDF
 ↓
FINAL REVIEW
```

Chỉ báo cáo hoàn thành sau khi toàn bộ flow trên đã được thực hiện.

## 30. Báo cáo cuối cùng

Sau khi hoàn thành, báo cáo ngắn gọn:

```text
Project:
MD Reader

Tech Stack:
...

Implemented:
✓ Markdown Reader
✓ GFM
...
```
