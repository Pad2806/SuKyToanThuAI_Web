import React, { useState } from 'react';
import { AiImportReview } from '../components/admin/ai-import-review.jsx';
import { BlockEditor } from '../components/admin/block-editor.jsx';
import { EventMetaForm } from '../components/admin/event-meta-form.jsx';
import { StoryPreview } from '../components/admin/story-preview.jsx';
import { RouteCard } from '../components/shared/route-card.jsx';
import { getEventBySlug } from '../lib/event-queries.js';

const cloneEvent = () => JSON.parse(JSON.stringify(getEventBySlug('chien-thang-bach-dang-938')));

export const AdminPage = () => {
  const [event, setEvent] = useState(cloneEvent);
  const [activeBeat, setActiveBeat] = useState('setup');

  const insertBlock = (block) => {
    setEvent((current) => ({
      ...current,
      story: {
        ...current.story,
        beats: current.story.beats.map((beat) => (
          beat.type === activeBeat ? { ...beat, blocks: [...beat.blocks, block] } : beat
        )),
      },
    }));
  };

  return (
    <RouteCard eyebrow="Quản trị" title="Bàn dựng câu chuyện">
      <p className="section-lead">Không gian biên tập giữ cùng nhịp thị giác với trang đọc, để người viết nhìn thấy chất cinematic ngay khi dựng nội dung.</p>
      <div className="admin-layout">
        <div className="admin-panel-stack">
          <label className="admin-beat-select">
            Beat đang sửa
            <select value={activeBeat} onChange={(item) => setActiveBeat(item.target.value)}>
              {event.story.beats.map((beat) => <option key={beat.type} value={beat.type}>{beat.title}</option>)}
            </select>
          </label>
          <BlockEditor activeBeat={activeBeat} onInsertBlock={insertBlock} />
          <EventMetaForm event={event} onChange={setEvent} />
          <AiImportReview />
        </div>
        <StoryPreview event={event} />
      </div>
    </RouteCard>
  );
};

export default AdminPage;
