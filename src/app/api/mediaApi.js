import { api } from "./axiosInstance";

/**
 * Tạo ảnh cho danh sách slides.
 * Gọi sau khi có outline từ Content Service.
 *
 * @param {string} projectId - UUID của project
 * @param {Array<{slide_order: number, image_suggestion: string}>} slides
 * @returns {Promise<{success: boolean, data: {assets: Array, total_matched: number, total_requested: number}}>}
 *
 * @example
 * const result = await generateAssets("uuid-123", [
 *   { slide_order: 1, image_suggestion: "Panorama thung lũng Điện Biên Phủ" },
 *   { slide_order: 2, image_suggestion: "Bản đồ Đông Dương 1954" },
 * ]);
 * console.log(result.data.assets); // [{ slide_order, image_url, source, license, ... }]
 */
export async function generateAssets(projectId, slides) {
  const { data } = await api.post("/media/generate-assets", {
    project_id: projectId,
    slides,
  });
  return data;
}

/**
 * Đổi ảnh cho 1 slide khi user không hài lòng.
 *
 * @param {Object} params
 * @param {number} params.slide_order - Slide thứ mấy cần đổi
 * @param {string} params.image_suggestion - Gợi ý ảnh gốc từ outline
 * @param {string} [params.reason] - Lý do đổi ảnh
 * @param {string[]} [params.preferred_keywords] - Keyword user muốn tìm
 * @param {string[]} [params.exclude_urls] - URL ảnh cũ cần loại bỏ
 * @returns {Promise<{success: boolean, data: {asset: Object, is_fallback: boolean}}>}
 *
 * @example
 * const result = await regenerateImage({
 *   slide_order: 1,
 *   image_suggestion: "Panorama thung lũng Điện Biên Phủ",
 *   reason: "Ảnh không đúng bối cảnh",
 *   exclude_urls: ["https://upload.wikimedia.org/old-image.jpg"],
 * });
 * console.log(result.data.asset.image_url); // URL ảnh mới
 */
export async function regenerateImage(params) {
  const { data } = await api.post("/media/regenerate-image", params);
  return data;
}

/**
 * Tìm ảnh theo danh sách keyword tiếng Anh.
 * Dùng cho chức năng search ảnh thủ công (nếu cần).
 *
 * @param {Array<{keyword_en: string, category?: string}>} keywords
 * @param {number} [maxResults=10]
 * @returns {Promise<{success: boolean, data: {images: Array, total_found: number}}>}
 *
 * @example
 * const result = await searchImages(
 *   [{ keyword_en: "Dien Bien Phu 1954", category: "event" }],
 *   5
 * );
 * console.log(result.data.images); // [{ id, title, url, width, height, license, ... }]
 */
export async function searchImages(keywords, maxResults = 10) {
  const { data } = await api.post("/media/search", {
    keywords,
    max_results: maxResults,
  });
  return data;
}


/**
 * Sinh file PPTX từ structured slides JSON.
 * Gọi backend → nhận file PPTX → trigger download.
 *
 * @param {string} title - Tiêu đề bài thuyết trình
 * @param {Array} slides - Danh sách slides (structured JSON từ Content Service)
 */
export async function generateAndDownloadPptx(title, slides) {
  const response = await api.post(
    "/media/generate-pptx",
    { title, slides },
    { responseType: "blob" }
  );

  // Tạo link download
  const blob = new Blob([response.data], {
    type: "application/vnd.openxmlformats-officedocument.presentationml.presentation",
  });
  const url = window.URL.createObjectURL(blob);
  const a = document.createElement("a");
  a.href = url;
  a.download = `${title.replace(/\s+/g, "_")}.pptx`;
  document.body.appendChild(a);
  a.click();
  document.body.removeChild(a);
  window.URL.revokeObjectURL(url);
}


/**
 * Tạo Google Slides presentation.
 * Backend tạo slide trên Google Drive → trả URL.
 *
 * @param {string} title
 * @param {Array} slides
 * @returns {Promise<{success: boolean, data: {presentation_id: string, presentation_url: string}}>}
 */
export async function generateGoogleSlides(title, slides, googleAccessToken) {
  const { data } = await api.post("/media/generate-google-slides", {
    title,
    slides,
    google_access_token: googleAccessToken,
  });
  return data;
}
