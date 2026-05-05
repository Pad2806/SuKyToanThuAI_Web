# VintageElegance — Template Specification for AI Outline Generation

## Mục đích

File này là **hướng dẫn cho AI** để sinh outline phù hợp với template VintageElegance.
Khi người dùng upload nội dung lịch sử, AI sẽ đọc file này + nội dung upload → sinh ra JSON outline đúng cấu trúc data mà các slide component cần.

---

## Thông tin template

- **Tên template**: VintageElegance
- **Phong cách**: Warm parchment/antique — nền giấy cũ beige, chữ nâu sẫm serif, viền hoa văn cổ điển ở 4 góc, khung ornate
- **Phù hợp với**: Bài thuyết trình lịch sử, sự kiện lịch sử, nhân vật lịch sử, văn hóa truyền thống
- **Tổng số slide**: 10–12 slide (tùy độ dài nội dung)

---

## Danh sách slide types và data schema

Schema giống hoàn toàn BlackWhiteModel — cùng layout_type, cùng field names.
Xem `BlackWhiteModel/TEMPLATE_SPEC.md` để biết chi tiết từng slide type.

### Các layout_type hỗ trợ:

1. `title` — Slide bìa / Cover
2. `introduction` — Slide giới thiệu
3. `content` — Slide nội dung chính (numbered list)
4. `two_column` — Slide hai cột so sánh
5. `timeline` — Slide dòng thời gian
6. `quote` — Slide trích dẫn
7. `table` — Slide bảng dữ liệu
8. `data_results` — Slide dữ liệu & kết quả
9. `summary` — Slide tóm tắt
10. `section_divider` — Slide ngắt phần
11. `ending` — Slide kết thúc / Cảm ơn
12. `image_sources` — Slide nguồn ảnh (tự động)

---

## Điểm khác biệt so với BlackWhiteModel

| Đặc điểm | BlackWhiteModel | VintageElegance |
|-----------|----------------|-----------------|
| Nền | Đen (#1a1a1a) | Giấy cũ beige (#e8dcc4) |
| Chữ | Trắng/cream | Nâu sẫm (#3b2a1a) |
| Ornament | Diamond dividers | Corner flourishes + frame border |
| Cảm giác | Dark gothic/vintage | Warm antique/classical |
| Ảnh frame | Tròn/oval viền | Hình chữ nhật bo góc viền ornate |

---

## Quy tắc sinh outline

Giống hoàn toàn BlackWhiteModel. Xem `BlackWhiteModel/TEMPLATE_SPEC.md` phần "Quy tắc sinh outline".
