import { MOCK_BW_OUTLINE, MOCK_BW_ASSETS } from "../user/data/mockBlackWhiteModel";

import { api } from "./axiosInstance";

export async function createOutline(params) {
  const { data } = await api.post("/content/outline", params);
  return data;
}

export async function moderateContent(text, language = "vi") {
  const { data } = await api.post("/content/moderate", { text, language });
  return data;
}

// ─── Gemini AI sinh structured slides JSON ───────────────────────────────────

const GEMINI_API_KEY = "AIzaSyA3ec2Ybd6P_zptRurYHTQxmAxr6Sui3PM";
const GEMINI_MODEL = "gemini-2.0-flash";
const GEMINI_URL = `https://generativelanguage.googleapis.com/v1beta/models/${GEMINI_MODEL}:generateContent?key=${GEMINI_API_KEY}`;

/**
 * Dùng Gemini AI sinh structured slides JSON từ tên sự kiện.
 * Thay thế mockOutline() — sinh nội dung chi tiết, chính xác lịch sử.
 *
 * @param {Object} event - { id, title, era, desc }
 * @param {string} outputType - "slide" hoặc "comic"
 * @returns {Object} - { success, data: { outline_type, title, total_slides, slides[] } }
 */
export async function generateOutlineWithGemini(event, outputType = "slide") {
  const prompt = buildSlidePrompt(event, outputType);

  try {
    const response = await fetch(GEMINI_URL, {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({
        contents: [{ parts: [{ text: prompt }] }],
        generationConfig: {
          temperature: 0.3,
          responseMimeType: "application/json",
        },
      }),
    });

    if (!response.ok) {
      throw new Error(`Gemini API error: ${response.status}`);
    }

    const result = await response.json();
    const text = result.candidates?.[0]?.content?.parts?.[0]?.text;

    if (!text) {
      throw new Error("Gemini trả về rỗng");
    }

    const slides = JSON.parse(text);

    // Validate
    if (!Array.isArray(slides) || slides.length === 0) {
      throw new Error("Gemini không trả về mảng slides hợp lệ");
    }

    return {
      success: true,
      data: {
        outline_type: outputType,
        title: event.title,
        total_slides: slides.length,
        slides,
      },
    };
  } catch (error) {
    console.error("Gemini error, fallback to mock:", error);
    return mockOutline(event, outputType);
  }
}

function buildSlidePrompt(event, outputType) {
  return `Bạn là chuyên gia lịch sử Việt Nam và thiết kế slide thuyết trình.

Hãy tạo nội dung cho bài thuyết trình về sự kiện lịch sử: "${event.title}" (${event.era || ""}).
${event.desc ? `Mô tả: ${event.desc}` : ""}

Trả về một JSON array các slide objects. Mỗi slide phải có cấu trúc phù hợp với layout_type.

CÁC LAYOUT_TYPE HỖ TRỢ:

1. "title" — Slide mở đầu:
   { slide_order, layout_type: "title", title, subtitle, content (năm/thời kỳ), image_suggestion }

2. "content" — Slide nội dung (text + bullets + ảnh):
   { slide_order, layout_type: "content", title, content (mô tả ngắn), bullets: ["..."], image_suggestion }

3. "two_column" — So sánh 2 bên:
   { slide_order, layout_type: "two_column", title, columns: [{ icon_name, heading, text }], image_suggestion }
   icon_name: "crown", "skull", "shield", "fire", "star", "flag", "gavel", "chess"

4. "timeline" — Dòng thời gian (2-4 mốc):
   { slide_order, layout_type: "timeline", title, events: [{ place, year, text }], image_suggestion }

5. "summary" — Tổng kết:
   { slide_order, layout_type: "summary", title, subtitle, content, bullets: ["..."], footer_text, image_suggestion }

6. "quote" — Trích dẫn lịch sử:
   { slide_order, layout_type: "quote", title, quote_text, quote_author, quote_context, image_suggestion }

7. "table" — Bảng dữ liệu:
   { slide_order, layout_type: "table", title, table_headers: ["..."], table_rows: [["...", "..."]], footer_text, image_suggestion }

8. "section_divider" — Slide ngăn cách giữa các phần:
   { slide_order, layout_type: "section_divider", title, subtitle }

YÊU CẦU:
- Tạo 8-12 slides đa dạng layout
- Nội dung chính xác lịch sử, lấy từ sách giáo khoa
- Viết bằng tiếng Việt
- image_suggestion bằng tiếng Anh (để search Wikimedia)
- Slide đầu tiên phải là "title", slide cuối phải là "summary"
- Sử dụng đa dạng layout_type (không chỉ toàn "content")
- Bullets tối đa 4-5 items mỗi slide
- Columns tối đa 2-3 items
- Timeline events tối đa 3-4 items
- Nội dung chi tiết, có số liệu cụ thể

Trả về CHỈ JSON array, không có text khác.`;
}

/**
 * Mock outline cho BlackWhiteModel template.
 * Trả về dữ liệu đầy đủ 11 slides với layout types mới.
 */
export function mockOutlineBW(event, outputType = "slide") {
  return {
    success: true,
    data: {
      outline_type: outputType,
      template: "BlackWhiteModel",
      ...MOCK_BW_OUTLINE,
      assets: MOCK_BW_ASSETS,
    },
  };
}

/**
 * Mock outline fallback — dùng khi Gemini lỗi.
 */
export function mockOutline(event, outputType = "slide") {
  return {
    success: true,
    data: {
      outline_type: outputType,
      title: event.title,
      total_slides: 5,
      slides: [
        {
          slide_order: 1, layout_type: "title",
          title: event.title, subtitle: event.desc || "",
          content: event.era || "", image_suggestion: event.title,
        },
        {
          slide_order: 2, layout_type: "two_column",
          title: "Bối cảnh lịch sử",
          columns: [
            { icon_name: "crown", heading: "Bối cảnh trong nước", text: `Tình hình trong nước trước sự kiện ${event.title}.` },
            { icon_name: "skull", heading: "Bối cảnh quốc tế", text: `Tình hình quốc tế ảnh hưởng đến ${event.title}.` },
          ],
          image_suggestion: `${event.title} historical context`,
        },
        {
          slide_order: 3, layout_type: "content",
          title: "Diễn biến chính",
          content: `Các sự kiện quan trọng trong ${event.title}.`,
          bullets: ["Giai đoạn mở đầu", "Giai đoạn phát triển", "Giai đoạn cao trào", "Giai đoạn kết thúc"],
          image_suggestion: `${event.title} main events`,
        },
        {
          slide_order: 4, layout_type: "timeline",
          title: "Các mốc thời gian",
          events: [
            { place: "Khởi đầu", year: event.era || "", text: `${event.title} bắt đầu` },
            { place: "Phát triển", year: "", text: "Giai đoạn mở rộng" },
            { place: "Kết thúc", year: "", text: "Sự kiện kết thúc" },
          ],
          image_suggestion: `${event.title} timeline`,
        },
        {
          slide_order: 5, layout_type: "summary",
          title: "Kết quả và ý nghĩa", subtitle: "Bài học lịch sử",
          content: `Ý nghĩa lịch sử của ${event.title}.`,
          bullets: ["Kết quả trực tiếp", "Ý nghĩa lịch sử", "Bài học kinh nghiệm"],
          footer_text: `${event.title} — Một trang sử vẻ vang`,
          image_suggestion: `${event.title} significance`,
        },
      ],
    },
  };
}
