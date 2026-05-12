import { describe, expect, it } from 'vitest';
import { createDraftFromText } from '../src/lib/ai-draft-mapper.js';

describe('AI draft mapper', () => {
  it('creates quick facts, figure, glossary, and keeps featured false', () => {
    const draft = createDraftFromText('Năm: 938\nĐịa điểm: Bạch Đằng\nNhân vật: Ngô Quyền\nKết quả: Độc lập\nChủ đề: Kháng chiến');
    const blockTypes = draft.story.beats.flatMap((beat) => beat.blocks.map((block) => block.type));

    expect(draft.featured).toBe(false);
    expect(blockTypes).toContain('quick-facts');
    expect(blockTypes).toContain('figure');
    expect(blockTypes).toContain('glossary');
  });
});
