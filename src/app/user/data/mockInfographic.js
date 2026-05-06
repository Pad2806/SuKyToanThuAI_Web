/**
 * Mock data cho Infographic Generator
 * Chủ đề: Khởi nghĩa Hai Bà Trưng
 */

export const BLOCK_TYPES = {
  HEADER: "header",
  INTRO: "intro",
  TIMELINE: "timeline",
  STATS: "stats",
  QUOTE: "quote",
  COMPARISON: "comparison",
  GALLERY: "gallery",
  KEY_FIGURES: "key_figures",
  FOOTER: "footer",
};

export const MOCK_INFOGRAPHIC_DATA = {
  title: "Khởi nghĩa Hai Bà Trưng",
  template: "template1",
  blocks: [
    {
      block_order: 1,
      block_type: "header",
      title: "Khởi Nghĩa Hai Bà Trưng",
      subtitle: "Cuộc khởi nghĩa chống Bắc thuộc đầu tiên trong lịch sử Việt Nam",
      era: "Năm 40 – 43 SCN",
      image_suggestion: "Cach Mang Thang Tam historical ",
      image_url: null,
    },
    {
      block_order: 2,
      block_type: "intro",
      content:
        "Khởi nghĩa Hai Bà Trưng là cuộc nổi dậy chống lại ách đô hộ của nhà Đông Hán, do hai chị em Trưng Trắc và Trưng Nhị lãnh đạo vào mùa xuân năm 40 SCN. Đây là lần đầu tiên người Việt giành lại được quyền tự chủ sau hơn 200 năm Bắc thuộc, đồng thời khẳng định vai trò to lớn của phụ nữ Việt Nam trong sự nghiệp đấu tranh giải phóng dân tộc.",
      image_suggestion: "Trung Trac Trung Nhi",
      image_url: null,
    },
    {
      block_order: 3,
      block_type: "timeline",
      title: "Diễn biến chính",
      events: [
        {
          year: "111 TCN",
          title: "Bắc thuộc lần 1",
          description: "Nhà Hán chiếm Âu Lạc, đặt ách đô hộ lên người Việt.",
        },
        {
          year: "Năm 34",
          title: "Tô Định làm Thái thú",
          description: "Tô Định cai trị tàn bạo, bóc lột nhân dân, giết Thi Sách.",
        },
        {
          year: "Mùa xuân 40",
          title: "Phất cờ khởi nghĩa",
          description: "Hai Bà Trưng dấy binh tại Hát Môn, nhanh chóng chiếm 65 thành.",
        },
        {
          year: "Năm 40",
          title: "Xưng vương",
          description: "Trưng Trắc lên ngôi vua, đóng đô tại Mê Linh.",
        },
        {
          year: "Năm 42",
          title: "Mã Viện xâm lược",
          description: "Nhà Hán cử Mã Viện đem đại quân sang đàn áp.",
        },
        {
          year: "Năm 43",
          title: "Khởi nghĩa thất bại",
          description: "Hai Bà Trưng hy sinh, nước ta lại rơi vào ách đô hộ.",
        },
      ],
    },
    {
      block_order: 4,
      block_type: "stats",
      title: "Con số nổi bật",
      items: [
        { value: "65", label: "Thành trì giải phóng", icon: "🏯" },
        { value: "3", label: "Năm độc lập", icon: "⏳" },
        { value: "30+", label: "Nữ tướng tham gia", icon: "⚔️" },
        { value: "200+", label: "Năm Bắc thuộc trước đó", icon: "⛓️" },
      ],
    },
    {
      block_order: 5,
      block_type: "quote",
      quote_text:
        "Một xin rửa sạch nước thù,\nHai xin dựng lại nghiệp xưa họ Hùng,\nBa kẻo oan ức lòng chồng,\nBốn xin vẻn vẹn sở công lênh này.",
      author: "Trưng Trắc",
      context: "Lời thề khi phất cờ khởi nghĩa tại cửa sông Hát, mùa xuân năm 40 SCN",
    },
    {
      block_order: 6,
      block_type: "comparison",
      title: "So sánh lực lượng",
      left: {
        heading: "Quân khởi nghĩa",
        items: [
          "Lãnh đạo: Trưng Trắc, Trưng Nhị",
          "Lực lượng: Nông dân, lạc tướng",
          "Tinh thần chiến đấu cao",
          "Am hiểu địa hình",
          "Vũ khí thô sơ",
        ],
      },
      right: {
        heading: "Quân Đông Hán",
        items: [
          "Chỉ huy: Mã Viện",
          "Lực lượng: Quân chính quy",
          "Trang bị tốt, tổ chức chặt",
          "Xa xứ, không quen khí hậu",
          "Hậu cần mạnh",
        ],
      },
    },
    {
      block_order: 7,
      block_type: "key_figures",
      title: "Nhân vật chính",
      figures: [
        {
          name: "Trưng Trắc",
          role: "Lãnh đạo tối cao, xưng vương",
          image_url: null,
        },
        {
          name: "Trưng Nhị",
          role: "Phó tướng, em gái Trưng Trắc",
          image_url: null,
        },
        {
          name: "Thi Sách",
          role: "Chồng Trưng Trắc, lạc tướng Chu Diên",
          image_url: null,
        },
        {
          name: "Mã Viện",
          role: "Tướng Đông Hán, đàn áp khởi nghĩa",
          image_url: null,
        },
      ],
    },
    {
      block_order: 8,
      block_type: "footer",
      title: "Ý nghĩa lịch sử",
      sources: [
        "Đại Việt sử ký toàn thư",
        "Wikimedia Commons",
        "Sách giáo khoa Lịch sử lớp 6",
      ],
      credits: "SuKyToanThu AI — Tạo bởi trí tuệ nhân tạo",
    },
  ],
};

