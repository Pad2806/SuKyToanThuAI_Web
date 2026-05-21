import React from 'react';
import { BeatBlocks, QuickFacts } from '../blocks/story-blocks.jsx';

export const SetupSection = ({ beat, event, sectionDef }) => {
  const imgBlock = beat?.blocks?.find((block) => block.type === 'image');
  const quickFacts = beat?.blocks?.find((block) => block.type === 'quick-facts');
  const textBlocks = beat?.blocks?.filter((block) => (
    block.type !== 'image' && block.type !== 'quick-facts'
  )) ?? [];
  const contextImage = imgBlock?.image || event.image || event.fallbackImage;

  return (
    <section className="evt-section evt-setup-section" id={sectionDef?.id ?? 'evt-setup'}>
      <div className="evt-setup-layout">
        <div className="evt-setup-image-panel">
          <figure className="evt-setup-figure">
            <img
              src={contextImage}
              alt={imgBlock?.caption || event.title}
              loading="eager"
              decoding="async"
            />
            {(imgBlock?.caption || event.location) && (
              <figcaption className="evt-setup-caption">
                {imgBlock?.caption || event.location}
              </figcaption>
            )}
          </figure>
        </div>

        <div className="evt-setup-content">
          <div className="evt-section__header">
            <div className="evt-section__eyebrow">
              <span className="evt-section__numeral">{sectionDef?.numeral ?? 'I'}</span>
              <span className="evt-section__eyebrow-text">{sectionDef?.label ?? 'Bối cảnh'}</span>
            </div>
            <p className="evt-setup-summary evt-setup-summary--lead">{event.excerpt || event.summary}</p>
            <p className="evt-setup-subtitle">{event.title}</p>
            <div className="evt-section__divider" aria-hidden="true" />
          </div>

          <div className="evt-section__body">
            <BeatBlocks blocks={textBlocks} />
            {quickFacts && (
              <QuickFacts title={quickFacts.title} items={quickFacts.items ?? []} />
            )}
          </div>
        </div>
      </div>
    </section>
  );
};

export default SetupSection;
