# BlackWhiteModel — Template Specification for AI Outline Generation

## Mục đích

File này là **hướng dẫn cho AI** để sinh outline phù hợp với template BlackWhiteModel.
Khi người dùng upload nội dung lịch sử, AI sẽ đọc file này + nội dung upload → sinh ra JSON outline đúng cấu trúc data mà các slide component cần.

---

## Thông tin template

- **Tên template**: BlackWhiteModel
- **Phong cách**: Dark gothic/vintage — nền đen, chữ trắng serif, viền ornamental, diamond dividers, ảnh tròn/oval
- **Phù hợp với**: Bài thuyết trình lịch sử, sự kiện lịch sử, nhân vật lịch sử, chiến tranh, triều đại
- **Tổng số slide**: 10–12 slide (tùy độ dài nội dung)

---

## Danh sách slide types và data schema

### 1. `title` — Slide bìa / Cover

Slide mở đầu, hiển thị tên chủ đề lớn.

```json
{
  "slide_order": 1,
  "layout_type": "title",
  "title": "Tên sự kiện / chủ đề lịch sử",
  "subtitle": "Mô tả ngắn 1 dòng (tùy chọn)",
  "content": "Thời kỳ / niên đại (ví dụ: 'Năm 40 – 43 SCN')",
  "image_suggestion": "từ khóa tìm ảnh minh họa cho sự kiện chính"
}
```

**Hướng dẫn AI**: Lấy tên sự kiện/chủ đề chính làm `title`. `subtitle` là câu mô tả ngắn gọn. `content` là khoảng thời gian.

---

### 2. `introduction` — Slide giới thiệu

Giới thiệu tổng quan về chủ đề, hiển thị ảnh lớn bên trái + đoạn văn bên phải.

```json
{
  "slide_order": 2,
  "layout_type": "introduction",
  "title": "Giới thiệu",
  "content": "Đoạn văn giới thiệu tổng quan 3-5 câu. Nêu bối cảnh, nhân vật chính, ý nghĩa khái quát.",
  "image_suggestion": "từ khóa ảnh minh họa bối cảnh"
}
```

**Hướng dẫn AI**: Tóm tắt nội dung thành đoạn giới thiệu ngắn gọn, dễ hiểu. Nên bao gồm: ai, ở đâu, khi nào, tại sao quan trọng.

---

### 3. `content` — Slide nội dung chính (danh sách đánh số)

Hiển thị tiêu đề bên trái + danh sách các điểm chính đánh số bên phải.

```json
{
  "slide_order": 3,
  "layout_type": "content",
  "title": "Tiêu đề nội dung (ví dụ: 'Nguyên nhân khởi nghĩa')",
  "content": "Câu dẫn nhập ngắn (tùy chọn)",
  "bullets": [
    "Điểm 1: Mô tả ngắn gọn 1-2 câu",
    "Điểm 2: Mô tả ngắn gọn 1-2 câu",
    "Điểm 3: Mô tả ngắn gọn 1-2 câu"
  ],
  "image_suggestion": "từ khóa ảnh minh họa"
}
```

**Hướng dẫn AI**: Tối đa 3-5 bullets. Mỗi bullet nên ngắn gọn (1-2 câu). Đây là slide dùng nhiều nhất — dùng cho nguyên nhân, diễn biến, hệ quả, đặc điểm, v.v.

---

### 4. `two_column` — Slide hai cột so sánh

Hai panel text cạnh nhau, phù hợp so sánh/đối chiếu.

```json
{
  "slide_order": 4,
  "layout_type": "two_column",
  "title": "Tiêu đề so sánh (ví dụ: 'So sánh lực lượng')",
  "columns": [
    {
      "heading": "Tiêu đề cột trái",
      "text": "Nội dung cột trái, 3-5 câu mô tả."
    },
    {
      "heading": "Tiêu đề cột phải",
      "text": "Nội dung cột phải, 3-5 câu mô tả."
    }
  ]
}
```

**Hướng dẫn AI**: Dùng khi có 2 khía cạnh đối lập hoặc bổ sung: quân ta vs quân địch, trước vs sau, nguyên nhân vs hệ quả, ưu điểm vs nhược điểm.

---

### 5. `timeline` — Slide dòng thời gian

Hiển thị các sự kiện theo trình tự thời gian.

```json
{
  "slide_order": 5,
  "layout_type": "timeline",
  "title": "Tiêu đề timeline (ví dụ: 'Diễn biến chính')",
  "events": [
    {
      "year": "Năm hoặc mốc thời gian",
      "place": "Địa điểm (tùy chọn)",
      "text": "Mô tả sự kiện ngắn gọn 1-2 câu"
    },
    {
      "year": "...",
      "place": "...",
      "text": "..."
    }
  ]
}
```

**Hướng dẫn AI**: Tối đa 4-6 events. Sắp xếp theo thứ tự thời gian. Mỗi event nên có ít nhất `year` và `text`. `place` là tùy chọn nhưng nên có nếu liên quan đến địa lý.

---

### 6. `quote` — Slide trích dẫn

Hiển thị một câu nói nổi tiếng hoặc trích dẫn lịch sử.

```json
{
  "slide_order": 6,
  "layout_type": "quote",
  "title": "Tiêu đề (ví dụ: 'Lời thề sông Hát')",
  "quote_text": "Nội dung câu trích dẫn",
  "quote_author": "Tác giả / người nói",
  "quote_context": "Bối cảnh câu nói (tùy chọn, 1-2 câu)"
}
```

**Hướng dẫn AI**: Ưu tiên trích dẫn nổi tiếng, lời thề, chiếu chỉ, hoặc câu nói đáng nhớ liên quan đến sự kiện. Nếu không có trích dẫn cụ thể, có thể dùng nhận định của sử gia.

---

### 7. `table` — Slide bảng dữ liệu

Hiển thị thông tin dạng bảng.

```json
{
  "slide_order": 7,
  "layout_type": "table",
  "title": "Tiêu đề bảng (ví dụ: 'Các tướng lĩnh tiêu biểu')",
  "table_headers": ["Cột 1", "Cột 2", "Cột 3"],
  "table_rows": [
    ["Giá trị 1", "Giá trị 2", "Giá trị 3"],
    ["Giá trị 1", "Giá trị 2", "Giá trị 3"]
  ],
  "footer_text": "Ghi chú nguồn (tùy chọn)"
}
```

**Hướng dẫn AI**: Dùng cho danh sách nhân vật, so sánh số liệu, niên biểu ngắn, thống kê. Tối đa 3-4 cột, 4-6 hàng. Giữ nội dung mỗi ô ngắn gọn.

---

### 8. `data_results` — Slide dữ liệu & kết quả

Hiển thị biểu đồ/số liệu bên trái + mô tả bên phải. Nền cream.

```json
{
  "slide_order": 8,
  "layout_type": "data_results",
  "title": "Tiêu đề (ví dụ: 'Kết quả khởi nghĩa')",
  "content": "Đoạn mô tả kết quả/ý nghĩa 3-5 câu",
  "chart_data": [
    { "label": "Tên chỉ số", "value": "Giá trị hiển thị", "percent": 85 },
    { "label": "Tên chỉ số", "value": "Giá trị hiển thị", "percent": 60 }
  ]
}
```

**Hướng dẫn AI**: `chart_data` là mảng các chỉ số. `percent` (0-100) quyết định độ dài thanh bar. Dùng cho kết quả, thành tựu, con số thống kê. Tối đa 4-5 items. Nếu không có số liệu cụ thể, có thể ước lượng tương đối.

---

### 9. `summary` — Slide tóm tắt

Tóm tắt các điểm chính dưới dạng cards.

```json
{
  "slide_order": 9,
  "layout_type": "summary",
  "title": "Tiêu đề tóm tắt (ví dụ: 'Ý nghĩa lịch sử')",
  "subtitle": "Câu dẫn nhập (tùy chọn)",
  "bullets": [
    "Điểm tóm tắt 1",
    "Điểm tóm tắt 2",
    "Điểm tóm tắt 3"
  ],
  "footer_text": "Câu kết (tùy chọn)"
}
```

**Hướng dẫn AI**: Tối đa 3 bullets (hiển thị dạng cards). Mỗi bullet nên là 1 ý nghĩa/bài học quan trọng. Đặt gần cuối bài thuyết trình.

---

### 10. `section_divider` — Slide ngắt phần

Slide chuyển tiếp giữa các phần lớn.

```json
{
  "slide_order": 10,
  "layout_type": "section_divider",
  "title": "Tên phần (ví dụ: 'Phần II: Di sản và tưởng nhớ')",
  "subtitle": "Mô tả ngắn phần tiếp theo (tùy chọn)"
}
```

**Hướng dẫn AI**: Chỉ dùng khi bài thuyết trình có nhiều phần rõ ràng (>8 slide). Không bắt buộc.

---

### 11. `ending` — Slide kết thúc / Cảm ơn

Slide cuối cùng.

```json
{
  "slide_order": 11,
  "layout_type": "ending",
  "title": "Cảm ơn",
  "subtitle": "Câu kết thúc (tùy chọn)",
  "content": "Tên người/nhóm thuyết trình (tùy chọn)",
  "image_suggestion": "từ khóa ảnh tổng hợp"
}
```

**Hướng dẫn AI**: Luôn đặt cuối cùng. `title` thường là "Cảm ơn" hoặc "Kết thúc".

---

### 12. `image_sources` — Slide nguồn ảnh

Liệt kê nguồn ảnh đã sử dụng. **Slide này được tự động sinh bởi hệ thống, AI KHÔNG cần tạo.**

---

## Quy tắc sinh outline

### Cấu trúc bắt buộc

Outline phải là JSON với format:

```json
{
  "title": "Tên chủ đề chính",
  "total_slides": 10,
  "slides": [
    { "slide_order": 1, "layout_type": "title", ... },
    { "slide_order": 2, "layout_type": "introduction", ... },
    ...
  ]
}
```

### Thứ tự slide khuyến nghị

Với nội dung lịch sử tiêu chuẩn, nên theo flow:

| Thứ tự | Layout type      | Nội dung                          |
|--------|------------------|-----------------------------------|
| 1      | `title`          | Bìa — tên sự kiện, thời kỳ       |
| 2      | `introduction`   | Giới thiệu tổng quan              |
| 3      | `content`        | Bối cảnh / Nguyên nhân            |
| 4      | `timeline`       | Diễn biến theo thời gian          |
| 5      | `content`        | Chi tiết sự kiện quan trọng       |
| 6      | `two_column`     | So sánh / Đối chiếu               |
| 7      | `quote`          | Trích dẫn nổi tiếng               |
| 8      | `table`          | Bảng nhân vật / số liệu           |
| 9      | `data_results`   | Kết quả / Thành tựu               |
| 10     | `summary`        | Tóm tắt ý nghĩa                   |
| 11     | `ending`         | Cảm ơn                            |

### Quy tắc linh hoạt

- **Tối thiểu 8 slide, tối đa 14 slide** (không tính `image_sources`)
- Có thể dùng nhiều slide `content` nếu nội dung dài
- `section_divider` chỉ dùng khi có >10 slide và cần chia phần rõ ràng
- `quote` có thể bỏ nếu không tìm được trích dẫn phù hợp
- `data_results` có thể bỏ nếu không có số liệu
- `table` có thể bỏ nếu không có dữ liệu dạng bảng
- `two_column` có thể thay bằng `content` nếu không có nội dung so sánh
- **Luôn bắt đầu bằng `title` và kết thúc bằng `ending`**

### Quy tắc nội dung

1. **Ngôn ngữ**: Tiếng Việt, phù hợp học sinh cấp 2-3
2. **Độ dài text**:
   - `title`: tối đa 8 từ
   - `subtitle`: tối đa 15 từ
   - `content` (đoạn văn): 3-5 câu
   - `bullets`: mỗi bullet 1-2 câu
   - `quote_text`: tối đa 3 câu
3. **image_suggestion**: Từ khóa tiếng Anh, cụ thể, dùng để tìm ảnh trên Wikimedia Commons
   - Tốt: `"Trung Sisters uprising Vietnam 40 AD"`
   - Xấu: `"lịch sử Việt Nam"`
4. **Chính xác lịch sử**: Chỉ sử dụng thông tin có trong nội dung người dùng upload. Không bịa thêm sự kiện hoặc số liệu.
5. **slide_order**: Đánh số liên tục từ 1

---

## Ví dụ output hoàn chỉnh

Xem file `SlidePreviewPage.jsx` trong cùng project để tham khảo mock data mẫu cho từng loại slide.
