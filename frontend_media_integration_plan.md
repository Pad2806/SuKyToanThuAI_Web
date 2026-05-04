# 📋 Frontend Plan — Tích hợp Media Service API

> **Mục tiêu:** Kết nối FE (React/Vite) với Media Service API để hiển thị ảnh thật từ Wikimedia
> **Trạng thái hiện tại:** FE dùng dữ liệu tĩnh (hardcode), chưa gọi API nào
> **Sau khi hoàn thành:** FE gọi API → nhận ảnh thật → hiển thị trên slide preview

---

## 📊 PHÂN TÍCH HIỆN TRẠNG FRONTEND

### Cấu trúc hiện tại

```
src/app/
├── App.jsx                    ← Router chính
├── user/
│   ├── pages/
│   │   ├── HomeScreen.jsx     ← Trang chủ (hero + recent works)
│   │   ├── LibraryScreen.jsx  ← Thư viện sự kiện (chọn sự kiện → tạo slide/comic)
│   │   ├── WorkspaceScreen.jsx← Upload/nhập text → tạo slide/comic
│   │   ├── AIScreen.jsx       ← Chat AI + Preview slide (HARDCODE 3 slide)
│   │   ├── ProfileScreen.jsx  ← Thông tin user
│   │   └── AdminScreen.jsx    ← Admin panel
│   ├── components/
│   │   ├── Nav.jsx            ← Navigation bar
│   │   └── LoadingOverlay.jsx ← Loading animation
│   ├── data/
│   │   └── constants.js       ← Dữ liệu tĩnh (EVENTS, AI_REPLIES, ...)
│   └── styles/                ← CSS files
└── admin/                     ← Admin pages
```

### Vấn đề cần giải quyết

| #   | Vấn đề                                    | Hiện tại                                    | Cần làm                                      |
| :-- | :----------------------------------------- | :------------------------------------------ | :-------------------------------------------- |
| 1   | Không có API client                        | Không có axios/fetch setup                  | Tạo `api/` folder với axios instance          |
| 2   | Dữ liệu sự kiện hardcode                  | `constants.js` chứa EVENTS tĩnh            | Gọi API lấy categories + events               |
| 3   | Slide preview hardcode                     | `AIScreen.jsx` render 3 slide tĩnh         | Gọi `/generate-assets` → render ảnh thật      |
| 4   | Không có luồng tạo slide thật              | Bấm "Tạo Slide" → navigate thẳng `/ai`     | Bấm → gọi Content `/outline` → Media `/generate-assets` |
| 5   | Không có chức năng đổi ảnh                 | Không có nút "Đổi ảnh"                      | Thêm nút → gọi `/regenerate-image`            |
| 6   | Không có state management                  | Dùng `useState` local                       | Có thể giữ useState hoặc thêm context         |

---

## 🏗️ KẾ HOẠCH THỰC HIỆN (5 Tasks)

### Task 1: Tạo API Client (`api/` folder)

**Mục tiêu:** Setup axios instance kết nối với backend qua Nginx gateway (:8000)

**Tạo file mới:**

```
src/app/
├── api/
│   ├── axiosInstance.js    ← Axios config (base URL, token interceptor)
│   ├── mediaApi.js         ← Các hàm gọi Media Service API
│   └── contentApi.js       ← Các hàm gọi Content Service API (nếu cần)
```

**`api/axiosInstance.js`:**

```javascript
import axios from "axios";

export const api = axios.create({
  baseURL: import.meta.env.VITE_API_BASE_URL || "http://localhost:8000/api/v1",
  timeout: 30000, // 30s — generate-assets có thể chậm
});

// Tự động chèn token vào mỗi request
api.interceptors.request.use((config) => {
  const token = localStorage.getItem("access_token");
  if (token) {
    config.headers.Authorization = `Bearer ${token}`;
  }
  return config;
});

// Xử lý lỗi chung
api.interceptors.response.use(
  (response) => response,
  (error) => {
    if (error.response?.status === 401) {
      // Token hết hạn → redirect login
      localStorage.removeItem("access_token");
      window.location.href = "/login";
    }
    return Promise.reject(error);
  }
);
```

**`api/mediaApi.js`:**

```javascript
import { api } from "./axiosInstance";

/**
 * Tạo ảnh cho danh sách slides
 * @param {string} projectId - UUID project
 * @param {Array} slides - [{ slide_order, image_suggestion }]
 * @returns {Promise} - { success, data: { assets[], total_matched, total_requested } }
 */
export async function generateAssets(projectId, slides) {
  const { data } = await api.post("/media/generate-assets", {
    project_id: projectId,
    slides,
  });
  return data;
}

/**
 * Đổi ảnh cho 1 slide
 * @param {Object} params - { slide_order, image_suggestion, reason?, preferred_keywords?, exclude_urls? }
 * @returns {Promise} - { success, data: { asset, is_fallback } }
 */
export async function regenerateImage(params) {
  const { data } = await api.post("/media/regenerate-image", params);
  return data;
}

/**
 * Tìm ảnh theo keywords
 * @param {Array} keywords - [{ keyword_en, category? }]
 * @param {number} maxResults
 * @returns {Promise} - { success, data: { images[], total_found } }
 */
export async function searchImages(keywords, maxResults = 10) {
  const { data } = await api.post("/media/search", {
    keywords,
    max_results: maxResults,
  });
  return data;
}
```

**File `.env` (tạo ở root FE):**

```env
VITE_API_BASE_URL=http://localhost:8000/api/v1
```

**Cài axios:**

```powershell
cd SuKyToanThuAI_Web
npm install axios
```

---

### Task 2: Sửa LibraryScreen — Gọi API khi bấm "Tạo Slide"

**Mục tiêu:** Khi user bấm "Tạo Slide" trên 1 sự kiện → gọi Content `/outline` → gọi Media `/generate-assets` → navigate sang AIScreen với dữ liệu thật

**File sửa:** `src/app/user/pages/LibraryScreen.jsx`

**Thay đổi chính:**

1. Bấm "Tạo Slide" → gọi `POST /content/outline` (giả lập hoặc mock nếu Content Service chưa sẵn sàng)
2. Nhận outline chứa `slides[].image_suggestion`
3. Gọi `POST /media/generate-assets` với slides
4. Navigate sang `/ai` kèm dữ liệu slides + assets

**Luồng:**

```
User bấm "Tạo Slide" trên sự kiện "Điện Biên Phủ"
  │
  ▼ (hiển thị loading)
  │
  ├── Gọi POST /content/outline
  │   → Nhận: slides[] với image_suggestion
  │
  ├── Gọi POST /media/generate-assets
  │   → Nhận: assets[] với image_url
  │
  ▼ (tắt loading)
  │
  Navigate sang /ai?projectId=xxx
  AIScreen hiển thị slides + ảnh thật
```

**Lưu ý:** Nếu Content Service chưa sẵn sàng, tạo mock outline:

```javascript
// Mock outline (dùng tạm khi Content Service chưa có)
function mockOutline(event) {
  return {
    slides: [
      { slide_order: 1, image_suggestion: `Toàn cảnh ${event.title}` },
      { slide_order: 2, image_suggestion: `Bối cảnh lịch sử ${event.era}` },
      { slide_order: 3, image_suggestion: `Nhân vật chính trong ${event.title}` },
      { slide_order: 4, image_suggestion: `Diễn biến chính ${event.title}` },
      { slide_order: 5, image_suggestion: `Kết quả và ý nghĩa ${event.title}` },
    ],
  };
}
```

---

### Task 3: Sửa AIScreen — Hiển thị ảnh thật từ API

**Mục tiêu:** AIScreen nhận dữ liệu slides + assets → render slide preview với ảnh thật thay vì hardcode

**File sửa:** `src/app/user/pages/AIScreen.jsx`

**Thay đổi chính:**

1. Nhận `slides` + `assets` từ route state hoặc context
2. Thay 3 component `Slide1`, `Slide2`, `Slide3` hardcode bằng component dynamic
3. Mỗi slide hiển thị `image_url` từ assets

**Component mới — `SlidePreview`:**

```jsx
function SlidePreview({ slide, asset, slideIndex, totalSlides, onRegenerate }) {
  const hasImage = asset && asset.source !== "fallback";

  return (
    <div className="slide-preview">
      {/* Ảnh nền từ Wikimedia */}
      {hasImage && (
        <img
          src={asset.image_url}
          alt={slide.title || `Slide ${slideIndex}`}
          className="slide-preview__bg-image"
          style={{
            position: "absolute", top: 0, left: 0,
            width: "100%", height: "100%",
            objectFit: "cover", opacity: 0.3,
          }}
        />
      )}

      {/* Nội dung slide */}
      <div style={{ position: "relative", zIndex: 1, padding: 32 }}>
        <h3 style={{ color: "#F0E8D8", fontSize: "1.2rem" }}>
          {slide.title || `Slide ${slideIndex}`}
        </h3>
        <p style={{ color: "rgba(240,232,216,0.7)", fontSize: "0.7rem", marginTop: 8 }}>
          {slide.content || slide.image_suggestion}
        </p>

        {/* License info */}
        {hasImage && asset.license && (
          <div style={{ fontSize: "0.5rem", color: "rgba(255,255,255,0.3)", marginTop: 12 }}>
            📷 {asset.license}
          </div>
        )}
      </div>

      {/* Slide number */}
      <div className="slide-preview__num">
        {slideIndex} / {totalSlides}
      </div>

      {/* Nút đổi ảnh */}
      <button
        className="slide-preview__regen-btn"
        onClick={() => onRegenerate(slide, asset)}
        style={{
          position: "absolute", top: 8, right: 8,
          background: "rgba(0,0,0,0.5)", border: "1px solid rgba(255,255,255,0.2)",
          color: "#fff", borderRadius: 4, padding: "4px 8px",
          fontSize: "0.6rem", cursor: "pointer",
        }}
      >
        🔄 Đổi ảnh
      </button>
    </div>
  );
}
```

---

### Task 4: Implement chức năng "Đổi ảnh" (Regenerate)

**Mục tiêu:** User bấm "Đổi ảnh" trên 1 slide → gọi `/regenerate-image` → cập nhật ảnh mới

**File sửa:** `src/app/user/pages/AIScreen.jsx`

**Logic:**

```javascript
import { regenerateImage } from "../../api/mediaApi";

async function handleRegenerate(slide, currentAsset) {
  setRegeneratingSlide(slide.slide_order); // Hiển thị loading trên slide đó

  try {
    const result = await regenerateImage({
      slide_order: slide.slide_order,
      image_suggestion: slide.image_suggestion,
      reason: "User muốn đổi ảnh khác",
      exclude_urls: currentAsset ? [currentAsset.image_url] : [],
    });

    if (result.success && !result.data.is_fallback) {
      // Cập nhật asset mới cho slide
      setAssets((prev) =>
        prev.map((a) =>
          a.slide_order === slide.slide_order ? result.data.asset : a
        )
      );
    }
  } catch (error) {
    console.error("Regenerate failed:", error);
  } finally {
    setRegeneratingSlide(null);
  }
}
```

---

### Task 5: Sửa WorkspaceScreen — Kết nối luồng "Tạo từ nội dung user"

**Mục tiêu:** User nhập text → gọi Content `/moderate` → `/outline` → Media `/generate-assets` → hiển thị preview

**File sửa:** `src/app/user/pages/WorkspaceScreen.jsx`

**Thay đổi chính:**

1. Bấm "Bắt đầu tạo với AI" → lấy text từ textarea
2. Gọi `POST /content/moderate` (kiểm duyệt)
3. Gọi `POST /content/outline` (tạo outline)
4. Gọi `POST /media/generate-assets` (tìm ảnh)
5. Navigate sang `/ai` với dữ liệu

**Lưu ý:** Nếu Content Service chưa sẵn sàng, dùng mock tương tự Task 2.

---

## 📁 CẤU TRÚC FILE SAU KHI HOÀN THÀNH

```
src/app/
├── api/                          ← 🆕 MỚI
│   ├── axiosInstance.js          ← Axios config
│   ├── mediaApi.js               ← Media Service API calls
│   └── contentApi.js             ← Content Service API calls
├── user/
│   ├── pages/
│   │   ├── HomeScreen.jsx        ← (giữ nguyên)
│   │   ├── LibraryScreen.jsx     ← ✏️ SỬA — gọi API khi tạo slide
│   │   ├── WorkspaceScreen.jsx   ← ✏️ SỬA — gọi API khi tạo từ text
│   │   ├── AIScreen.jsx          ← ✏️ SỬA — hiển thị ảnh thật + đổi ảnh
│   │   └── ...
│   ├── components/
│   │   ├── SlidePreview.jsx      ← 🆕 MỚI — component render 1 slide với ảnh
│   │   └── ...
│   └── data/
│       └── constants.js          ← (giữ nguyên, dùng làm fallback)
```

---

## 🔗 API ENDPOINTS CẦN GỌI

| Endpoint                          | Khi nào gọi                              | Từ trang nào       |
| :-------------------------------- | :--------------------------------------- | :------------------ |
| `POST /media/generate-assets`     | Sau khi có outline → tìm ảnh cho slides  | LibraryScreen, WorkspaceScreen |
| `POST /media/regenerate-image`    | User bấm "Đổi ảnh" trên 1 slide         | AIScreen            |
| `POST /media/search`              | User search ảnh thủ công (optional)      | AIScreen (nếu cần)  |
| `POST /content/outline`           | Tạo outline từ sự kiện hoặc text         | LibraryScreen, WorkspaceScreen |
| `POST /content/moderate`          | Kiểm duyệt text user nhập               | WorkspaceScreen     |

---

## ⏱️ THỨ TỰ THỰC HIỆN

```
Task 1: Tạo api/ folder + axios setup          (~30 phút)
  ↓
Task 2: Sửa LibraryScreen (gọi API tạo slide)  (~2 giờ)
  ↓
Task 3: Sửa AIScreen (hiển thị ảnh thật)        (~3 giờ)
  ↓
Task 4: Implement đổi ảnh (regenerate)           (~1 giờ)
  ↓
Task 5: Sửa WorkspaceScreen (tạo từ text)       (~2 giờ)
```

**Tổng ước tính: ~1-2 ngày**

---

## ⚠️ LƯU Ý QUAN TRỌNG

1. **Content Service có thể chưa sẵn sàng** — dùng mock outline trước, thay bằng API thật sau
2. **generate-assets có thể chậm** (5-15 giây) — cần hiển thị loading rõ ràng
3. **Ảnh Wikimedia có thể bị CORS** — nếu gặp lỗi, thêm proxy trong vite.config.js
4. **Fallback ảnh** — nếu `source === "fallback"`, hiển thị placeholder đẹp thay vì URL placeholder xấu
5. **Timeout** — set axios timeout 30s vì generate-assets gọi AI + Wikimedia cho mỗi slide
