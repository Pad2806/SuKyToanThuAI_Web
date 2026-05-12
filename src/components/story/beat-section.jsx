import React from 'react';
import { useBlockRenderer } from '../../hooks/use-block-renderer.jsx';
import { getRenderableBlocks } from '../../lib/story-constraints.js';
import { EventMetaPanel } from '../meta/event-meta-panel.jsx';

const beatIntros = {
  climax: 'Hồi quyết định',
  falling: 'Hồi lắng lại',
  hook: 'Hồi mở màn',
  rising: 'Hồi căng lên',
  setup: 'Hồi đặt cảnh',
  takeaway: 'Hồi còn lại',
};

export const BeatSection = ({ beat, event, index = 0 }) => {
  const renderBlock = useBlockRenderer(event);
  const renderableBlocks = getRenderableBlocks(beat, event);
  const hasMetaOverride = renderableBlocks.some((block) => block.type === 'event-meta');
  const isSetup = beat.type === 'setup';

  return (
    <section className={`beat-section beat-section--${beat.type}`} id={`beat-${beat.type}`}>
      <div className="beat-section__shell">
        <aside className="beat-section__rail" aria-hidden="true">
          {String(index + 1).padStart(2, '0')}
        </aside>
        <div className="beat-section__inner">
          <p className="beat-section__eyebrow">{beatIntros[beat.type] ?? 'Hồi kể chuyện'}</p>
          <h2>{beat.title}</h2>
          {isSetup && !hasMetaOverride && <EventMetaPanel event={event} />}
          {renderableBlocks.map(renderBlock)}
        </div>
      </div>
    </section>
  );
};

export default BeatSection;
