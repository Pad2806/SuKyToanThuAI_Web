const allowedIllustrationBeats = new Set(['rising', 'falling']);

export const getRenderableBlocks = (beat, event) => {
  const blocks = beat.blocks ?? [];
  let illustrationCount = 0;

  return blocks.filter((block) => {
    if (block.type !== 'illustration-first') {
      return true;
    }

    illustrationCount += 1;
    const allowedBeat = allowedIllustrationBeats.has(beat.type);
    const withinLimit = illustrationCount <= 2;

    if (!allowedBeat) {
      console.warn('[Sử Ký AI] Minh hoạ toàn trang chỉ dùng ở phần Thử thách hoặc Hệ quả');
    }

    if (!withinLimit) {
      console.warn('[Sử Ký AI] Illustration-first vượt giới hạn (tối đa 2/sự kiện)');
    }

    return allowedBeat && withinLimit;
  });
};

export const warnWhenWowBudgetExceeded = (route, root = document) => {
  const count = root.querySelectorAll('.wow-effect').length;

  if (count > 3) {
    console.warn(`[Sử Ký AI] WOW budget vượt giới hạn: ${count}/3 trên route ${route}`);
  }
};
