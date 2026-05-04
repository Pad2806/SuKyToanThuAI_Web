/**
 * Mock data cho BlackWhiteModel template
 * Dữ liệu giả lập response từ content-service
 * Dùng để test flow: Thư viện → Tạo slide → Preview → Chỉnh sửa
 */

export const MOCK_BW_OUTLINE = {
  title: "Khởi nghĩa Hai Bà Trưng",
  template: "BlackWhiteModel",
  total_slides: 11,
  slides: [
    {
      slide_order: 1,
      layout_type: "title",
      title: "Khởi nghĩa Hai Bà Trưng",
      subtitle: "Cuộc khởi nghĩa chống Bắc thuộc đầu tiên",
      content: "Năm 40 – 43 SCN",
      image_suggestion: "Trung Sisters uprising Vietnam 40 AD",
    },
    {
      slide_order: 2,
      layout_type: "introduction",
      title: "Giới thiệu",
      content:
        "Khởi nghĩa Hai Bà Trưng là cuộc nổi dậy chống lại ách đô hộ của nhà Đông Hán do Hai Bà Trưng lãnh đạo. Cuộc khởi nghĩa diễn ra vào năm 40 SCN tại vùng Mê Linh. Đây là lần đầu tiên người Việt giành lại được quyền tự chủ sau thời kỳ Bắc thuộc. Sự kiện thể hiện tinh thần yêu nước và vai trò của phụ nữ trong lịch sử.",
      image_suggestion: "Me Linh district ancient Vietnam map",
    },
    {
      slide_order: 3,
      layout_type: "content",
      title: "Nguyên nhân khởi nghĩa",
      content: "Những nguyên nhân chính dẫn đến cuộc khởi nghĩa:",
      bullets: [
        "Chính sách cai trị tàn bạo của nhà Đông Hán khiến nhân dân lầm than, bị áp bức nặng nề.",
        "Thái thú Tô Định đàn áp dã man, gây căm phẫn trong dân chúng.",
        "Thi Sách, chồng của Trưng Trắc, bị giết hại làm bùng nổ ý chí khởi nghĩa.",
      ],
      image_suggestion: "Han dynasty rule oppression Vietnam illustration",
    },
    {
      slide_order: 4,
      layout_type: "timeline",
      title: "Diễn biến chính",
      events: [
        {
          year: "Năm 40",
          place: "Mê Linh",
          text: "Hai Bà Trưng phất cờ khởi nghĩa, nhanh chóng tập hợp lực lượng.",
        },
        {
          year: "Năm 40",
          place: "Luy Lâu",
          text: "Quân khởi nghĩa đánh chiếm các thành trì, buộc Tô Định phải bỏ chạy.",
        },
        {
          year: "Năm 40",
          place: "Miền Bắc Việt Nam",
          text: "Nhiều địa phương hưởng ứng, giành lại quyền kiểm soát rộng lớn.",
        },
        {
          year: "Năm 42–43",
          place: "Việt Nam",
          text: "Nhà Hán đưa quân sang đàn áp, cuộc khởi nghĩa thất bại.",
        },
      ],
    },
    {
      slide_order: 5,
      layout_type: "content",
      title: "Diễn biến chi tiết",
      content: "Một số điểm nổi bật trong quá trình khởi nghĩa:",
      bullets: [
        "Hai Bà Trưng nhanh chóng chiếm được hơn 60 thành trì trong thời gian ngắn.",
        "Trưng Trắc lên ngôi vua, đóng đô tại Mê Linh, thiết lập chính quyền độc lập.",
        "Cuộc khởi nghĩa nhận được sự ủng hộ rộng rãi của nhân dân.",
      ],
      image_suggestion: "Trung Sisters army battle illustration",
    },
    {
      slide_order: 6,
      layout_type: "two_column",
      title: "So sánh lực lượng",
      columns: [
        {
          heading: "Quân khởi nghĩa",
          text: "Do Hai Bà Trưng lãnh đạo, lực lượng chủ yếu là người Việt. Có tinh thần chiến đấu cao, được nhân dân ủng hộ. Tuy nhiên, vũ khí còn thô sơ và thiếu tổ chức lâu dài.",
        },
        {
          heading: "Quân Đông Hán",
          text: "Được trang bị tốt, có tổ chức chặt chẽ và kinh nghiệm chiến đấu. Do Mã Viện chỉ huy. Có ưu thế về quân sự và hậu cần.",
        },
      ],
    },
    {
      slide_order: 7,
      layout_type: "quote",
      title: "Lời thề khởi nghĩa",
      quote_text:
        "Một xin rửa sạch nước thù, hai xin dựng lại nghiệp xưa họ Hùng.",
      quote_author: "Hai Bà Trưng",
      quote_context:
        "Thể hiện quyết tâm giành lại độc lập dân tộc và khôi phục đất nước.",
    },
    {
      slide_order: 8,
      layout_type: "table",
      title: "Nhân vật tiêu biểu",
      table_headers: ["Tên", "Vai trò", "Đóng góp"],
      table_rows: [
        ["Trưng Trắc", "Lãnh đạo", "Chỉ huy khởi nghĩa, lên ngôi vua"],
        ["Trưng Nhị", "Lãnh đạo", "Hỗ trợ chỉ huy, cùng chiến đấu"],
        ["Thi Sách", "Chồng Trưng Trắc", "Nguyên nhân khởi nghĩa"],
        ["Mã Viện", "Tướng Đông Hán", "Đàn áp khởi nghĩa"],
      ],
      footer_text: "Các nhân vật chính trong sự kiện",
    },
    {
      slide_order: 9,
      layout_type: "data_results",
      title: "Kết quả khởi nghĩa",
      content:
        "Cuộc khởi nghĩa giành thắng lợi bước đầu khi đánh đuổi được quân Đông Hán và giành lại quyền tự chủ. Tuy nhiên, sau đó bị đàn áp và thất bại vào năm 43. Dù thất bại, sự kiện đã khơi dậy tinh thần đấu tranh mạnh mẽ. Đây là dấu mốc quan trọng trong lịch sử chống ngoại xâm của dân tộc.",
      chart_data: [
        { label: "Thành trì chiếm được", value: "Hơn 60", percent: 85 },
        { label: "Thời gian độc lập", value: "Khoảng 3 năm", percent: 60 },
        { label: "Mức độ ảnh hưởng", value: "Rộng lớn", percent: 90 },
      ],
    },
    {
      slide_order: 10,
      layout_type: "summary",
      title: "Ý nghĩa lịch sử",
      subtitle: "Tầm quan trọng của khởi nghĩa",
      bullets: [
        "Khẳng định tinh thần yêu nước và ý chí độc lập của dân tộc Việt.",
        "Thể hiện vai trò to lớn của phụ nữ trong lịch sử đấu tranh.",
        "Tạo tiền đề cho các cuộc khởi nghĩa sau này.",
      ],
      footer_text: "Một trong những biểu tượng anh hùng dân tộc",
    },
    {
      slide_order: 11,
      layout_type: "ending",
      title: "Cảm ơn",
      subtitle: "Xin cảm ơn đã lắng nghe",
      content: "Nhóm thuyết trình",
      image_suggestion: "Vietnam historical heritage monument",
    },
  ],
};

/**
 * Mock assets — ảnh Wikipedia thật cho các slide có image_suggestion.
 * Giả lập response từ Media Service.
 */
export const MOCK_BW_ASSETS = [
  {
    slide_order: 1,
    image_url: "https://upload.wikimedia.org/wikipedia/commons/thumb/4/4e/Trung_Sisters.jpg/800px-Trung_Sisters.jpg",
    source: "wikimedia",
    license: "Public domain",
    keywords_used: ["Trung Sisters", "uprising", "Vietnam"],
  },
  {
    slide_order: 2,
    image_url: "https://upload.wikimedia.org/wikipedia/commons/thumb/b/b4/Hai_Ba_Trung_Temple_2.jpg/800px-Hai_Ba_Trung_Temple_2.jpg",
    source: "wikimedia",
    license: "CC BY-SA 4.0",
    keywords_used: ["Hai Ba Trung", "temple", "Me Linh"],
  },
  {
    slide_order: 3,
    image_url: "https://upload.wikimedia.org/wikipedia/commons/thumb/0/0b/Hai_Ba_Trung.jpg/800px-Hai_Ba_Trung.jpg",
    source: "wikimedia",
    license: "Public domain",
    keywords_used: ["Hai Ba Trung", "Han dynasty", "Vietnam"],
  },
  {
    slide_order: 5,
    image_url: "https://upload.wikimedia.org/wikipedia/commons/thumb/e/e3/HaiBaTrungStatue.jpg/800px-HaiBaTrungStatue.jpg",
    source: "wikimedia",
    license: "CC BY-SA 3.0",
    keywords_used: ["Trung Sisters", "statue", "battle"],
  },
  {
    slide_order: 11,
    image_url: "https://upload.wikimedia.org/wikipedia/commons/thumb/4/4e/Trung_Sisters.jpg/800px-Trung_Sisters.jpg",
    source: "wikimedia",
    license: "Public domain",
    keywords_used: ["Vietnam", "heritage", "monument"],
  },
];
