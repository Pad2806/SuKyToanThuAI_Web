const formatYear = (year) => {
  const value = Number(year);
  return value < 0 ? `${Math.abs(value)} TCN` : String(value);
};

const quickFactsFor = (event) => ({
  type: 'quick-facts',
  title: 'Sự kiện nhanh',
  items: [
    { label: 'Năm', value: formatYear(event.year) },
    { label: 'Địa điểm', value: event.location ?? 'Chưa rõ' },
    { label: 'Nhân vật chính', value: (event.actors ?? []).join(', ') },
    { label: 'Kết quả', value: event.summary },
  ],
});

const tensionByType = {
  battle: 'Thế trận buộc người chỉ huy phải biến địa hình, thời điểm và tinh thần quân sĩ thành lợi thế quyết định.',
  culture: 'Đằng sau truyền thuyết là cách cộng đồng giải thích thiên nhiên, lao động và nỗi lo giữ làng xóm yên ổn.',
  dynasty: 'Một thiết chế sơ khai cần đủ uy tín để quy tụ cư dân, tổ chức sản xuất và bảo vệ vùng đất chung.',
  movement: 'Khi đời sống bị dồn ép, một lời hiệu triệu có thể biến nỗi bất bình rời rạc thành hành động tập thể.',
};

const takeawayByType = {
  battle: 'Bài học nằm ở cách đọc thời cơ: thắng lợi không chỉ đến từ sức mạnh, mà từ chuẩn bị đúng lúc.',
  culture: 'Giá trị của câu chuyện là ký ức cộng đồng: người xưa gửi kinh nghiệm sống vào hình tượng dễ nhớ.',
  dynasty: 'Điều đáng nhớ là ý thức cộng đồng: từ làng xóm, người Việt bắt đầu hình dung một không gian chung.',
  movement: 'Ý nghĩa lớn nhất là tinh thần tự chủ: khi bản sắc bị đe dọa, ký ức độc lập lại được đánh thức.',
};

const storySeeds = {
  'hung-vuong-dung-nuoc': {
    hook: 'Hãy hình dung một buổi hội trên miền trung du: trống đồng vang, các làng ven sông cùng hướng về một trung tâm chung. Từ đó, ký ức Hùng Vương mở ra như lời kể đầu tiên về đất nước.',
    setup: 'Cư dân Văn Lang sống dựa vào nông nghiệp lúa nước, sông ngòi và những cộng đồng làng. Nhu cầu cùng trị thủy, chống thú dữ, giữ mùa màng khiến ý niệm liên kết rộng hơn làng xóm dần hình thành.',
    tension: 'Điều khó nhất không phải dựng một tên gọi, mà là tạo được niềm tin để nhiều nhóm cư dân cùng nhận mình thuộc về một cộng đồng.',
    turn: 'Hình tượng các Vua Hùng trở thành điểm tụ của quyền lực, nghi lễ và huyết thống chung, giúp câu chuyện dựng nước có một khuôn mặt để ghi nhớ.',
    aftermath: 'Dù ranh giới giữa truyền thuyết và lịch sử còn cần khảo cứu, thời Hùng Vương vẫn là nền móng của ký ức cộng đồng Việt.',
    lesson: 'Một quốc gia bắt đầu từ điều rất đời thường: cùng sống trên một vùng đất, cùng chống thiên tai, cùng cần một câu chuyện để gọi nhau là đồng bào.',
  },
  'thanh-co-co-loa': {
    hook: 'Nhìn từ trên cao, Cổ Loa không giống một thành lũy bình thường. Những vòng đất uốn cong như vết mực xoáy, vừa bảo vệ kinh đô vừa cất giữ bi kịch An Dương Vương.',
    setup: 'Sau thời Văn Lang, Âu Lạc cần một trung tâm đủ mạnh để điều hành và phòng thủ. Cổ Loa nằm ở vị trí thuận lợi, kết nối đường sông và vùng đồng bằng Bắc Bộ.',
    tension: 'Một nhà nước mới phải trả lời hai câu hỏi cùng lúc: làm sao tổ chức được quyền lực, và làm sao giữ được quyền lực ấy trước các thế lực bên ngoài.',
    turn: 'Thành lũy nhiều vòng, truyền thuyết nỏ thần và câu chuyện Mỵ Châu - Trọng Thủy khiến Cổ Loa trở thành nơi kỹ thuật quân sự gặp bài học cảnh giác chính trị.',
    aftermath: 'Cổ Loa còn lại như dấu tích của một trình độ tổ chức cao, nhưng cũng nhắc rằng phòng tuyến vật chất không đủ nếu niềm tin bị đánh thủng.',
    lesson: 'Sức mạnh quốc gia cần kỹ thuật, địa thế và tổ chức; nhưng nó cũng cần sự tỉnh táo trong quan hệ quyền lực.',
  },
  'truyen-thuyet-son-tinh-thuy-tinh': {
    hook: 'Mỗi mùa nước lên, câu chuyện Sơn Tinh - Thủy Tinh lại như sống dậy: núi cao hơn, nước dâng hơn, con người đứng giữa thiên nhiên vừa sợ hãi vừa học cách chống chọi.',
    setup: 'Truyền thuyết ra đời từ đời sống cư dân nông nghiệp ven sông, nơi mùa màng phụ thuộc vào mưa, lũ, đê điều và kinh nghiệm tập thể.',
    tension: 'Cuộc tranh chấp trong truyện không chỉ là chuyện kén rể. Nó là cách dân gian hình dung cuộc đối đầu dai dẳng giữa ổn định và thiên tai.',
    turn: 'Sơn Tinh không thắng bằng một đòn duy nhất; vị thần núi thắng bằng khả năng nâng đất, dựng núi, bền bỉ chống nước qua từng đợt lũ.',
    aftermath: 'Câu chuyện giải thích vì sao lũ lụt lặp lại hằng năm, đồng thời gửi vào đó niềm tin rằng cộng đồng có thể học cách sống cùng thiên nhiên.',
    lesson: 'Truyền thuyết không chỉ để kể cho vui. Nó giữ lại tri thức sinh tồn bằng hình ảnh dễ nhớ, dễ truyền từ đời này sang đời khác.',
  },
  'khoi-nghia-hai-ba-trung': {
    hook: 'Từ Mê Linh, tiếng trống khởi nghĩa vang lên không như một lời than, mà như lời tuyên bố: người Việt vẫn có thể tự đứng dậy khi quyền tự chủ bị chà đạp.',
    setup: 'Đầu thế kỷ I, chính sách đô hộ làm đời sống bản địa bị kiểm soát nặng nề. Nỗi bất bình tích tụ trong các lạc tướng và cộng đồng địa phương.',
    tension: 'Một cuộc nổi dậy muốn lan rộng phải vượt qua sợ hãi, liên kết nhiều vùng và biến nỗi đau riêng thành mục tiêu chung.',
    turn: 'Trưng Trắc và Trưng Nhị trở thành trung tâm hiệu triệu. Từ một vùng, phong trào lan nhanh, giành lại nhiều thành trì và dựng nên chính quyền tự chủ trong thời gian ngắn.',
    aftermath: 'Cuộc khởi nghĩa cuối cùng bị đàn áp, nhưng hình tượng Hai Bà Trưng đi vào ký ức như bằng chứng rằng tinh thần độc lập chưa từng tắt.',
    lesson: 'Khi lịch sử bị đẩy vào thế mất tiếng nói, một lời hiệu triệu đúng lúc có thể đánh thức cả cộng đồng.',
  },
  'khoi-nghia-ba-trieu': {
    hook: 'Giữa vùng Cửu Chân, hình tượng Bà Triệu hiện lên với khát vọng không chịu cúi đầu. Câu chuyện của bà là một tiếng nói mạnh mẽ trong mạch đấu tranh lâu dài.',
    setup: 'Thế kỷ III, ách đô hộ tiếp tục đè nặng lên đời sống bản địa. Những cuộc nổi dậy địa phương cho thấy sức phản kháng vẫn âm ỉ.',
    tension: 'Một thủ lĩnh phải đối diện không chỉ quân lực mạnh hơn, mà còn khoảng cách giữa ý chí nổi dậy và khả năng duy trì lực lượng lâu dài.',
    turn: 'Bà Triệu quy tụ nghĩa quân, tạo nên một biểu tượng vượt khỏi phạm vi một trận đánh: hình ảnh người nữ tướng gắn với khát vọng tự do.',
    aftermath: 'Phong trào thất bại về quân sự, nhưng ký ức Bà Triệu vẫn tồn tại như một điểm sáng của tinh thần không khuất phục.',
    lesson: 'Không phải sự kiện nào cũng thắng theo nghĩa chính trị. Có những sự kiện thắng trong ký ức vì giữ được phẩm giá của cộng đồng.',
  },
  'chien-thang-bach-dang-938': {
    hook: 'Trên sông Bạch Đằng, nước triều không chỉ lên rồi xuống. Nó trở thành chiếc đồng hồ của chiến trận, nơi Ngô Quyền biến tự nhiên thành thế chủ động.',
    setup: 'Sau thời gian dài Bắc thuộc, cơ hội giành tự chủ mở ra nhưng chưa chắc chắn. Quân Nam Hán tiến vào bằng đường thủy, còn người Việt cần một đòn quyết định.',
    tension: 'Nếu đánh trực diện, thế lực xâm lược có ưu thế. Muốn thắng, Ngô Quyền phải buộc đối phương đi vào nơi địa hình, thời điểm và chuẩn bị đã được tính trước.',
    turn: 'Bãi cọc ngầm trên sông cùng nhịp thủy triều tạo thành thế trận. Khi thuyền giặc mắc kẹt, đòn phản công biến dòng sông thành nơi kết thúc tham vọng xâm lược.',
    aftermath: 'Chiến thắng năm 938 mở ra thời kỳ độc lập lâu dài, đặt nền cho các triều đại tự chủ về sau.',
    lesson: 'Bạch Đằng cho thấy trí tuệ chiến lược nằm ở việc hiểu rất rõ đất nước mình: địa hình, con nước, con người và thời cơ.',
  },
};

const seedFor = (event) => storySeeds[event.slug] ?? {};

export const createFallbackStory = (event) => ({
  templateType: event.story?.templateType ?? 'universal',
  beats: [
    {
      type: 'hook',
      title: 'Khoảnh Khắc',
      blocks: [{ type: 'quote', quote: seedFor(event).hook ?? event.excerpt, source: event.title }],
    },
    {
      type: 'setup',
      title: 'Bối Cảnh',
      blocks: [
        quickFactsFor(event),
        {
          type: 'text',
          body: seedFor(event).setup ?? `${event.title} diễn ra tại ${event.location ?? 'một địa điểm còn cần khảo cứu'}, trong mạch ${event.eraSlug.replaceAll('-', ' ')}. ${event.summary}`,
        },
      ],
    },
    {
      type: 'rising',
      title: 'Thử Thách',
      blocks: [{ type: 'fact-box', title: 'Mâu thuẫn chính', body: seedFor(event).tension ?? tensionByType[event.type] ?? event.excerpt }],
    },
    {
      type: 'climax',
      title: 'Bước Ngoặt',
      blocks: [
        { type: 'image', image: event.image ?? event.fallbackImage, caption: event.title },
        { type: 'quote', quote: seedFor(event).turn ?? 'Một cột mốc lịch sử thường bắt đầu từ khoảnh khắc rất cụ thể: một quyết định, một thế trận, một lời hiệu triệu.', source: 'Sử Ký AI' },
      ],
    },
    {
      type: 'falling',
      title: 'Hệ Quả',
      blocks: [{ type: 'text', body: seedFor(event).aftermath ?? `Sau ${formatYear(event.year)}, câu chuyện không khép lại ngay. Nó để lại cách người đời sau nhớ về ${event.location ?? 'vùng đất ấy'} và những nhân vật như ${(event.actors ?? []).join(', ') || 'cộng đồng đương thời'}.` }],
    },
    {
      type: 'takeaway',
      title: 'Bài Học',
      blocks: [
        { type: 'text', body: seedFor(event).lesson ?? takeawayByType[event.type] ?? 'Mỗi sự kiện là một cách nhìn lại lựa chọn của con người trong hoàn cảnh lịch sử cụ thể.' },
        { type: 'glossary', terms: [{ term: 'Tự chủ', definition: 'Quyền tự quyết vận mệnh của cộng đồng.' }] },
      ],
    },
  ],
});

export const withStoryFallback = (event) => {
  if (!event) return null;
  if (event.story?.beats?.length) return event;
  return { ...event, story: createFallbackStory(event) };
};
