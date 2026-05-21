# Quyết Định Thiết Kế: Xử Lý Cuộn Textarea Với Lenis

## 1. Tóm Tắt (Understanding Summary)
- **Vấn đề:** Các thẻ `textarea` trong AI Studio (`creator-page.jsx`, `studio-page.jsx`) không thể cuộn được bằng chuột do thư viện Lenis đã chiếm quyền sự kiện lăn chuột toàn cục.
- **Mục tiêu:** Cho phép người dùng cuộn hết nội dung bên trong `textarea`, sau đó mới tiếp tục cuộn trang chính (Scroll Chaining mặc định của trình duyệt).
- **Ràng buộc:** Không làm hỏng hiệu ứng cuộn mượt (smooth scroll) của toàn trang. Không thay đổi UI/UX mặc định của form.

## 2. Các Giả Định (Assumptions)
- Dự án đang sử dụng phiên bản chuẩn của Lenis, mặc định hỗ trợ thuộc tính data (`data-lenis-prevent`) để bỏ qua các vùng cuộn cục bộ.
- Hành vi này cần áp dụng đồng bộ cho mọi `textarea` nhập liệu dài trên toàn dự án để đảm bảo tính nhất quán về UX.

## 3. Nhật Ký Quyết Định (Decision Log)
- **Quyết định:** Sử dụng thuộc tính `data-lenis-prevent` của thư viện Lenis thay vì tự viết các hàm chặn sự kiện `stopPropagation` hay tắt/bật Lenis thủ công bằng `onMouseEnter/Leave`.
- **Các phương án đã cân nhắc:**
  - *Chặn nổi bọt sự kiện (Event Stop Propagation):* Dễ gây side-effect với các script tracking hoặc event listener khác ở cấp global. Bị loại.
  - *Tắt/bật Lenis qua hook:* Quá phức tạp, rủi ro cao gây liệt thanh cuộn nếu lỗi logic mount/unmount. Bị loại.
- **Lý do chọn:** `data-lenis-prevent` là API chuẩn do chính Lenis cung cấp. Nó tuân thủ chặt chẽ nguyên tắc YAGNI (K.I.S.S), dễ bảo trì và hoàn toàn không rủi ro.

## 4. Thiết Kế Cuối Cùng (Final Design)
Thêm trực tiếp thuộc tính boolean `data-lenis-prevent` vào thẻ `textarea`. 

**Lưu ý quan trọng:** Đây là một **HTML data attribute**, không phải là class name.
```jsx
// ĐÚNG:
<textarea
  className="creator-form__textarea"
  data-lenis-prevent
  ...
/>

// SAI:
<textarea
  className="creator-form__textarea data-lenis-prevent"
  ...
/>
```
