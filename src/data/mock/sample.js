/**
 * ┌──────────────────────────────────────────────────────────────┐
 * │  SAMPLE — Cấu trúc JSON chuẩn cho một trang sự kiện lịch sử │
 * │  File này dùng làm reference cho:                            │
 * │    1. LLM prompt → Gemini phải trả JSON đúng format này      │
 * │    2. Frontend renderer (EventStoryPage)                     │
 * │    3. Tạo mock data mới                                      │
 * │                                                              │
 * │  6-part narrative: Hook → Setup → Rising → Climax            │
 * │                    → Aftermath → Takeaway + Quiz             │
 * └──────────────────────────────────────────────────────────────┘
 */

export const sampleEvent = {
  /* ═══════════════════════════════════════════════════════════════
   * I. METADATA — Thông tin cơ bản
   * ═══════════════════════════════════════════════════════════════ */
  id: 'event-sample-id',                       // UUID hoặc slug
  slug: 'ten-su-kien-slug',                    // URL-friendly slug
  title: 'Tên Sự Kiện Lịch Sử',               // Tiêu đề chuyên nghiệp (KHÔNG dùng nguyên câu user nhập)
  eraId: 'era-dai-viet',                       // ID thời kỳ, null nếu chưa xác định
  eraSlug: 'nha-tran',                         // Slug thời kỳ, null nếu chưa xác định
  year: 1288,                                  // Năm diễn ra chính, null nếu không rõ
  gradeTags: ['THCS', 'THPT'],                 // Cấp học liên quan, [] nếu không rõ

  type: 'battle',                              // battle | dynasty | movement | culture | universal
  featured: false,                             // true nếu là sự kiện nổi bật
  summary: 'Tóm tắt ngắn gọn 2-3 câu, viết ở ngôi thứ ba, giọng văn lịch sử. Mô tả ai, làm gì, kết quả ra sao.',
  excerpt: 'Một câu hook gây tò mò ≤ 220 ký tự, viết như mở đầu phim tài liệu — tạo kịch tính, không tóm tắt.',
  image: '/api/ai/ai-generated/imagen-xxxxx.png',       // Ảnh hero (AI sinh ra), null nếu chưa có
  fallbackImage: '/images/generated/parchment.png',      // Ảnh mặc định khi chưa có hero
  location: 'Sông Bạch Đằng',                           // Địa điểm, null nếu không rõ
  actors: ['Trần Hưng Đạo', 'Trần Khánh Dư'],          // Danh sách nhân vật chính, []
  opponent: 'Quân Nguyên – Mông',                       // Phe đối lập, null
  result: 'Đại Việt chiến thắng',                       // Kết quả, null
  theme: 'war-strategy',                                 // Theme cho UI styling
  relatedEventSlugs: [],                                 // Danh sách slug sự kiện liên quan

  /* ═══════════════════════════════════════════════════════════════
   * II. CHARACTERS — Nhân vật
   * Mỗi nhân vật gồm: id, name, role, side, portrait, bio, quote
   * ═══════════════════════════════════════════════════════════════ */
  characters: [
    {
      id: 'tran-hung-dao',                      // Slug từ tên
      name: 'Trần Hưng Đạo',
      role: 'Tổng chỉ huy Đại Việt',
      side: 'dai-viet',                         // dai-viet | nguyen-mong | phap | my | viet-minh | other
      portrait: '/api/ai/ai-generated/imagen-portrait.png', // Ảnh chân dung (AI sinh), null nếu chưa có
      bio: 'Hưng Đạo Đại Vương Trần Quốc Tuấn, tài năng quân sự lỗi lạc. Ba lần đánh bại quân Nguyên–Mông, viết "Hịch tướng sĩ" truyền cảm hứng cho toàn quân.',
      quote: '"Bệ hạ muốn hàng, hãy chém đầu thần trước đã."', // null nếu không có trích dẫn
    },
    {
      id: 'o-ma-nhi',
      name: 'Ô Mã Nhi',
      role: 'Tổng chỉ huy thủy quân Nguyên',
      side: 'nguyen-mong',
      portrait: null,                           // Chỉ nhân vật chính mới có portrait
      bio: 'Danh tướng hải quân Nguyên–Mông, chỉ huy đội chiến thuyền lớn. Bị bắt sống trong trận Bạch Đằng 1288.',
      quote: null,
    },
  ],

  /* ═══════════════════════════════════════════════════════════════
   * III. TIMELINE — Diễn biến theo thời gian
   * Hiển thị trong phần "III. Diễn Biến" (Rising Section)
   * ═══════════════════════════════════════════════════════════════ */
  timeline: [
    {
      id: 'step-1',
      year: '1287',
      month: 'Cuối năm',                       // Tháng hoặc giai đoạn: "Cuối năm", "Tháng 3", "Ngày 9/4"
      title: 'Quân Nguyên tiến vào Đại Việt',  // ≤ 60 ký tự
      description: 'Thoát Hoan dẫn 30 vạn quân, Ô Mã Nhi chỉ huy thủy quân từ biển tiến vào.',
      icon: '⚔️',                              // 1 emoji: ⚔️ 🚢 🪵 🌊 🏆 ⬇️ 🔥
      mood: 'tense',                            // tense | rising | preparation | tension | climax | victory | defeat | neutral
    },
    {
      id: 'step-2',
      year: '1288',
      month: 'Tháng 1',
      title: 'Trần Khánh Dư chặn lương ở Vân Đồn',
      description: 'Đoàn thuyền lương bị phục kích tại Vân Đồn. Quân Nguyên mất nguồn tiếp tế.',
      icon: '🚢',
      mood: 'rising',
    },
    {
      id: 'step-3',
      year: '1288',
      month: 'Tháng 2',
      title: 'Chuẩn bị trận địa cọc ngầm',
      description: 'Trần Hưng Đạo cho đóng hàng ngàn cọc gỗ lim bọc sắt dưới lòng sông.',
      icon: '🪵',
      mood: 'preparation',
    },
    {
      id: 'step-4',
      year: '1288',
      month: 'Ngày 9/4',
      title: 'Thủy triều rút — cọc gỗ lộ ra',
      description: 'Cọc nhọn nhô lên, chiến thuyền Nguyên bị đâm thủng, mắc cạn.',
      icon: '⬇️',
      mood: 'climax',
    },
    {
      id: 'step-5',
      year: '1288',
      month: 'Ngày 9/4',
      title: 'Đại Việt phản công toàn diện',
      description: 'Ô Mã Nhi bị bắt sống. Đạo thủy quân Nguyên bị tiêu diệt hoàn toàn.',
      icon: '🏆',
      mood: 'victory',
    },
  ],

  /* ═══════════════════════════════════════════════════════════════
   * IV. CLIMAX SCENE — Phần tương tác cao trào
   * Gồm: phases (giai đoạn) + hotspots (điểm nóng trên bản đồ)
   * null nếu không đủ thông tin
   * ═══════════════════════════════════════════════════════════════ */
  climaxScene: {
    title: 'Trận địa Bạch Đằng',
    backgroundImage: '/api/ai/ai-generated/imagen-climax.png', // Ảnh nền (AI sinh), null nếu chưa có
    phases: [
      {
        id: 'phase-tide-high',
        label: 'Thủy triều lên',                // Tên giai đoạn ngắn
        summary: 'Nước dâng cao, bãi cọc chìm hoàn toàn — hạm đội Nguyên tiến vào.', // ≤ 120 ký tự
        description: 'Mô tả chi tiết 3-5 câu về giai đoạn này. Có thể dùng \\n\\n để xuống dòng giữa các đoạn.',
        keyDetail: 'Chi tiết đặc biệt hoặc thú vị nhất — hiển thị nổi bật trong UI.',
      },
      {
        id: 'phase-lure',
        label: 'Dụ địch',
        summary: 'Quân Đại Việt giả thua — kéo hạm đội Nguyên vượt qua bãi cọc.',
        description: 'Chi tiết về cách dụ địch...',
        keyDetail: 'Chiến thuật dụ địch đã được Ngô Quyền sử dụng năm 938.',
      },
      {
        id: 'phase-tide-low',
        label: 'Thủy triều rút',
        summary: 'Nước rút — hàng ngàn cọc nhọn nhô lên, đâm xuyên thuyền Nguyên.',
        description: 'Chi tiết về thời khắc quyết định...',
        keyDetail: 'Cọc được cắm chéo theo hướng xuôi dòng — thiết kế cực kỳ tinh vi.',
      },
      {
        id: 'phase-attack',
        label: 'Tổng tấn công',
        summary: 'Quân Đại Việt tổng tấn công — hỏa công, cận chiến, bắt sống Ô Mã Nhi.',
        description: 'Chi tiết về trận tổng tấn công...',
        keyDetail: 'Ô Mã Nhi bị bắt sống cùng hàng trăm binh sĩ.',
      },
    ],
    hotspots: [
      { id: 'hs-stakes', x: 50, y: 55, label: 'Bãi cọc ngầm', description: 'Hàng ngàn cọc gỗ lim bọc sắt nhọn cắm dưới lòng sông.' },
      { id: 'hs-river', x: 50, y: 35, label: 'Sông Bạch Đằng', description: 'Dòng sông chảy ra vịnh Bắc Bộ, chênh lệch thủy triều rất lớn.' },
      { id: 'hs-ambush', x: 20, y: 45, label: 'Phục binh Đại Việt', description: 'Quân Đại Việt mai phục trong rừng rậm và trên bờ sông.' },
      { id: 'hs-fleet', x: 78, y: 40, label: 'Hạm đội Nguyên', description: 'Đạo chiến thuyền lớn do Ô Mã Nhi chỉ huy.' },
    ],
  },

  /* ═══════════════════════════════════════════════════════════════
   * V. AFTERMATH — Hệ quả / Kết quả
   * Hiển thị: stats (thống kê), before/after (so sánh)
   * null nếu không đủ thông tin
   * ═══════════════════════════════════════════════════════════════ */
  aftermath: {
    title: 'Kết quả trận Bạch Đằng 1288',
    stats: [
      { label: 'Quân Nguyên bị bắt', value: '400+', sublabel: 'chiến thuyền' },
      { label: 'Tướng giặc bị bắt sống', value: 'Ô Mã Nhi', sublabel: 'và nhiều tướng khác' },
      { label: 'Kết thúc', value: '30 năm', sublabel: 'chống xâm lược Mông–Nguyên' },
      { label: 'Ý nghĩa', value: 'Bảo vệ', sublabel: 'nền độc lập Đại Việt' },
    ],
    before: {
      title: 'Trước trận',
      items: [
        'Quân Nguyên–Mông 3 lần xâm lược Đại Việt',
        'Đạo thủy quân lớn từ biển tiến vào',
        'Nguồn lương thực dồi dào (trước Vân Đồn)',
        'Thoát Hoan tự tin chiến thắng',
      ],
    },
    after: {
      title: 'Sau trận',
      items: [
        'Thủy quân Nguyên bị tiêu diệt hoàn toàn',
        'Thoát Hoan rút quân, không dám quay lại',
        'Nhà Nguyên từ bỏ tham vọng chinh phục Đại Việt',
        'Đại Việt vào thời kỳ thịnh vượng',
      ],
    },
  },

  /* ═══════════════════════════════════════════════════════════════
   * VI. TAKEAWAY — Bài học rút ra
   * 3 câu hỏi: Chuyện gì đã xảy ra? Vì sao quan trọng? Bài học?
   * null nếu không đủ thông tin
   * ═══════════════════════════════════════════════════════════════ */
  takeaway: {
    happened: 'Trần Hưng Đạo dùng chiến thuật cọc ngầm trên sông Bạch Đằng, lợi dụng thủy triều tiêu diệt toàn bộ thủy quân Nguyên. Ô Mã Nhi bị bắt sống, Thoát Hoan rút chạy.',
    whyItMatters: 'Chiến thắng này kết thúc 30 năm Đại Việt chống xâm lược Mông–Nguyên (1258–1288) — đế chế quân sự hùng mạnh nhất thế giới thời bấy giờ. Đại Việt là một trong số ít quốc gia chiến thắng quân Mông Cổ.',
    lesson: 'Bạch Đằng 1288 dạy rằng: trí tuệ thắng sức mạnh. Hiểu biết về thiên nhiên (thủy triều), địa hình (sông), và tâm lý đối thủ (dụ địch) — tạo nên chiến thắng không cần quân số vượt trội.',
  },

  /* ═══════════════════════════════════════════════════════════════
   * VII. QUIZ — Kiểm tra hiểu bài
   * 3-4 câu trắc nghiệm, mỗi câu 4 lựa chọn
   * ═══════════════════════════════════════════════════════════════ */
  quiz: [
    {
      id: 'q1',
      question: 'Ai là tổng chỉ huy quân Đại Việt trong trận Bạch Đằng 1288?',
      options: ['Trần Nhân Tông', 'Trần Hưng Đạo', 'Trần Khánh Dư', 'Ngô Quyền'],
      correct: 1,                               // Index (0-3) của đáp án đúng
      explanation: 'Trần Hưng Đạo là tổng chỉ huy, người thiết kế chiến thuật cọc ngầm trên sông Bạch Đằng.',
    },
    {
      id: 'q2',
      question: 'Yếu tố tự nhiên nào quyết định chiến thắng Bạch Đằng?',
      options: ['Gió bão', 'Thủy triều', 'Động đất', 'Sương mù'],
      correct: 1,
      explanation: 'Thủy triều lên che giấu bãi cọc ngầm, khi triều rút cọc nhô lên đâm thủng chiến thuyền.',
    },
    {
      id: 'q3',
      question: 'Trận Bạch Đằng 1288 kết thúc bao nhiêu năm chống Mông–Nguyên?',
      options: ['10 năm', '20 năm', '30 năm', '50 năm'],
      correct: 2,
      explanation: 'Từ 1258 đến 1288 là 30 năm Đại Việt chống trả đế chế Mông–Nguyên.',
    },
    {
      id: 'q4',
      question: 'Tướng nào của quân Nguyên bị bắt sống?',
      options: ['Thoát Hoan', 'Ô Mã Nhi', 'Hốt Tất Liệt', 'Toa Đô'],
      correct: 1,
      explanation: 'Ô Mã Nhi bị bắt sống khi chiến thuyền mắc cạn trên bãi cọc.',
    },
  ],

  /* ═══════════════════════════════════════════════════════════════
   * VIII. STORY BEATS — Nội dung kể chuyện 6 phần
   * Đây là phần chính render ra giao diện trang
   *
   * Mỗi beat gồm: type, title, blocks[]
   * Block types: text | image | quote | quick-facts
   *
   * ❗ Nếu trường nào null → frontend tự ẩn, không render
   * ═══════════════════════════════════════════════════════════════ */
  story: {
    templateType: 'battle',                     // Cùng giá trị với `type`
    beats: [
      /* ── I. HOOK — Mở Màn (gây tò mò) ── */
      {
        type: 'hook',
        title: 'Khoảnh Khắc',
        blocks: [
          {
            type: 'text',
            body: 'Đoạn text gây tò mò, kịch tính — kéo người đọc vào câu chuyện. Viết như mở đầu phim tài liệu.',
          },
          {
            type: 'image',
            image: '/api/ai/ai-generated/imagen-xxxxx.png', // Ảnh hero (AI sinh), null nếu chưa có → ẩn
            caption: 'Mô tả ngắn gọn về ảnh, ví dụ: Trận Bạch Đằng 1288 — chiến thuyền Nguyên mắc cạn',
          },
          {
            type: 'quote',
            quote: 'Trích dẫn gây ấn tượng mạnh — lấy từ tài liệu lịch sử.',
            source: 'Đại Việt sử ký toàn thư',  // Nguồn trích dẫn
          },
        ],
      },

      /* ── II. SETUP — Bối Cảnh ── */
      {
        type: 'setup',
        title: 'Bối Cảnh',
        blocks: [
          {
            type: 'text',
            body: 'Đoạn 1: Mô tả bối cảnh lịch sử — kẻ thù là ai, tình hình đất nước.',
          },
          {
            type: 'text',
            body: 'Đoạn 2: Nhân vật chính xuất hiện — chuẩn bị cho cuộc chiến.',
          },
          {
            type: 'quick-facts',
            title: 'Dữ kiện nhanh',
            items: [
              { label: 'Năm', value: '1288' },
              { label: 'Chiến trường', value: 'Sông Bạch Đằng' },
              { label: 'Chỉ huy', value: 'Trần Hưng Đạo' },
              { label: 'Đối thủ', value: 'Quân Nguyên – Mông' },
              { label: 'Vũ khí bí mật', value: 'Bãi cọc ngầm bọc sắt' },
              { label: 'Kết quả', value: 'Đại Việt chiến thắng' },
            ],
          },
        ],
      },

      /* ── III. RISING — Diễn Biến ── */
      {
        type: 'rising',
        title: 'Diễn Biến',
        blocks: [
          {
            type: 'text',
            body: 'Đoạn 1: Các bước chuẩn bị — chiến thuật, bố trí lực lượng.',
          },
          {
            type: 'text',
            body: 'Đoạn 2: Tình huống căng thẳng leo thang — đối phương tiến vào bẫy.',
          },
          {
            type: 'text',
            body: 'Đoạn 3: Thời khắc quyết định đang đến gần.',
          },
        ],
      },

      /* ── IV. CLIMAX — Cao Trào ── */
      {
        type: 'climax',
        title: 'Cao Trào',
        blocks: [
          {
            type: 'text',
            body: 'Đoạn 1: Khoảnh khắc cao trào — hành động quyết định, kịch tính nhất.',
          },
          {
            type: 'text',
            body: 'Đoạn 2: Kết quả của hành động — ai thắng, ai thua, diễn biến ra sao.',
          },
          {
            type: 'quote',
            quote: 'Trích dẫn đắt giá nhất về khoảnh khắc cao trào.',
            source: 'Nguồn tài liệu',
          },
        ],
      },

      /* ── V. FALLING — Hệ Quả ── */
      {
        type: 'falling',
        title: 'Hệ Quả',
        blocks: [
          {
            type: 'text',
            body: 'Đoạn 1: Hậu quả trực tiếp — phe thua phải làm gì, phe thắng được gì.',
          },
          {
            type: 'text',
            body: 'Đoạn 2: Tầm ảnh hưởng lâu dài — thay đổi cục diện lịch sử ra sao.',
          },
        ],
      },

      /* ── VI. TAKEAWAY — Bài Học ── */
      {
        type: 'takeaway',
        title: 'Bài Học',
        blocks: [
          {
            type: 'text',
            body: 'Đoạn 1: Bài học chính — chiến lược, trí tuệ, tinh thần dân tộc.',
          },
          {
            type: 'text',
            body: 'Đoạn 2: Ý nghĩa vượt thời đại — tại sao sự kiện này vẫn còn giá trị ngày nay.',
          },
        ],
      },
    ],
  },
};
