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

export const EventMetaPanel = ({ event }) => (
  <aside className="event-meta-panel block-entrance">
    <dl>
      <div>
        <dt>Năm</dt>
        <dd>{formatHistoricalYear(event.year)}</dd>
      </div>
      <div>
        <dt>Thời kỳ</dt>
        <dd>{event.eraSlug.replaceAll('-', ' ')}</dd>
      </div>
      <div>
        <dt>Địa điểm</dt>
        <dd>{event.location ?? 'Chưa rõ'}</dd>
      </div>
      <div>
        <dt>Nhân vật</dt>
        <dd>{(event.actors ?? []).join(', ')}</dd>
      </div>
      <div>
        <dt>Thể loại</dt>
        <dd>{typeLabels[event.type] ?? 'Khác'}</dd>
      </div>
      <div>
        <dt>Khối lớp</dt>
        <dd>{event.gradeTags.join(', ')}</dd>
      </div>
    </dl>
  </aside>
);

export default EventMetaPanel;
