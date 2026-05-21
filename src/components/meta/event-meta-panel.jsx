import React from 'react';
import { formatHistoricalYear } from '../../lib/event-queries.js';

const typeLabels = {
  battle: 'Trận đánh',
  culture: 'Văn hoá',
  diplomacy: 'Ngoại giao',
  dynasty: 'Triều đại',
  movement: 'Phong trào',
  other: 'Khác',
};

export const EventMetaPanel = ({ event }) => {
  const eraSlug = event.eraSlug ?? event.era_slug ?? '';
  const gradeTags = event.gradeTags ?? event.grade_tags ?? [];

  return (
    <aside className="event-meta-panel block-entrance">
      <dl>
        <div>
          <dt>Năm</dt>
          <dd>{formatHistoricalYear(event.year)}</dd>
        </div>
        <div>
          <dt>Thời kỳ</dt>
          <dd>{eraSlug ? eraSlug.replaceAll('-', ' ') : 'Chưa rõ'}</dd>
        </div>
        <div>
          <dt>Địa điểm</dt>
          <dd>{event.location ?? 'Chưa rõ'}</dd>
        </div>
        <div>
          <dt>Nhân vật</dt>
          <dd>{(event.actors ?? []).join(', ') || 'Chưa rõ'}</dd>
        </div>
        <div>
          <dt>Thể loại</dt>
          <dd>{typeLabels[event.type] ?? 'Khác'}</dd>
        </div>
        <div>
          <dt>Khối lớp</dt>
          <dd>{gradeTags.join(', ') || 'Chưa phân loại'}</dd>
        </div>
      </dl>
    </aside>
  );
};

export default EventMetaPanel;
