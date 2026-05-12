import React, { useState } from 'react';
import { createDraftFromText } from '../../lib/ai-draft-mapper.js';
import { ContentReviewCard } from './content-review-card.jsx';

export const AiImportReview = () => {
  const [draft, setDraft] = useState(null);
  const [text, setText] = useState('Năm: 938\nĐịa điểm: Sông Bạch Đằng\nNhân vật: Ngô Quyền\nKết quả: Giành độc lập\nChủ đề: Kháng chiến');

  return (
    <section className="ai-import-review">
      <h2>AI Import & Review</h2>
      <textarea value={text} onChange={(event) => setText(event.target.value)} />
      <button onClick={() => setDraft(createDraftFromText(text))} type="button">Tạo bản nháp</button>
      {draft && <p>Nổi bật mặc định: {draft.featured ? 'Có' : 'Không'}</p>}
      {draft?.story.beats.map((beat) => (
        <ContentReviewCard beat={beat} key={beat.type} onAction={() => undefined} />
      ))}
    </section>
  );
};

export default AiImportReview;
