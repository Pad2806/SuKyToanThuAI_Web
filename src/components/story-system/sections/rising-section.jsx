import React from 'react';
import { BeatBlocks } from '../blocks/story-blocks.jsx';
import { InteractiveTimeline } from '../../story-interactive/interactive-timeline.jsx';

export const RisingSection = ({
  beat,
  event,
  sectionDef,
  scrollContainerRef = null,
}) => {
  const imageBlock = beat?.blocks?.find((block) => block.type === 'image');
  const introBlocks = beat?.blocks?.filter((block) => block.type !== 'image') ?? [];
  const introImage = imageBlock?.image || event.image || event.fallbackImage;

  return (
    <section className="evt-section evt-rising-section" id={sectionDef?.id ?? 'evt-rising'}>
      <div className="evt-rising-intro">
        <img className="evt-rising-intro__image" src={introImage} alt="" loading="lazy" />
        <div className="evt-rising-intro__shade" aria-hidden="true" />
        <div className="evt-rising-intro__content">
          <div className="evt-section__eyebrow">
            <span className="evt-section__numeral">{sectionDef?.numeral ?? 'III'}</span>
            <span className="evt-section__eyebrow-text">{sectionDef?.label ?? 'Diễn biến'}</span>
          </div>
          <h2 className="evt-section__title">{beat?.title ?? 'Diễn biến'}</h2>
          <div className="evt-section__divider" aria-hidden="true" />
          <div className="evt-rising-intro__body">
            <BeatBlocks blocks={introBlocks} />
          </div>
        </div>
      </div>

      {event.timeline?.length > 0 && (
        <InteractiveTimeline
          milestones={event.timeline}
          introImage={introImage}
          scrollContainerRef={scrollContainerRef}
        />
      )}
    </section>
  );
};

export default RisingSection;
