import React from 'react';
import { BeatBlocks } from '../blocks/story-blocks.jsx';
import { ClimaxScene, TacticalMap } from '../../story-interactive/climax-scene.jsx';

const SectionHeader = ({ def, title, eyebrow }) => (
  <div className="evt-section__header">
    <div className="evt-section__eyebrow">
      <span className="evt-section__numeral">{def?.numeral}</span>
      <span className="evt-section__eyebrow-text">{eyebrow || def?.label}</span>
    </div>
    <h2 className="evt-section__title">{title}</h2>
    <div className="evt-section__divider" aria-hidden="true" />
  </div>
);

export const ClimaxSection = ({ beat, event, sectionDef, mapSectionDef }) => (
  <>
    <section
      className="evt-section evt-section--climax"
      id={sectionDef?.id ?? 'evt-climax'}
      style={{
        '--climax-bg-image': event.climaxScene?.backgroundImage
          ? `url(${event.climaxScene.backgroundImage})`
          : 'none',
      }}
    >
      <div className="evt-section__shell evt-section__shell--wide">
        <SectionHeader
          def={sectionDef}
          title={beat?.title ?? 'Cao trào'}
          eyebrow="Cao trào"
        />
        <div className="evt-section__body">
          {beat?.blocks?.length > 0 && (
            <div className="evt-climax-lead">
              <BeatBlocks blocks={beat.blocks} />
            </div>
          )}
          {event.climaxScene && <ClimaxScene scene={event.climaxScene} />}
        </div>
      </div>
    </section>

    {(event.climaxScene?.mapImage || event.climaxScene?.backgroundImage) && event.climaxScene?.hotspots?.length > 0 && (
      <section className="evt-section evt-section--tactical-map" id={mapSectionDef?.id ?? 'evt-tactical-map'}>
        <div className="evt-section__shell evt-section__shell--wide">
          <SectionHeader
            def={mapSectionDef}
            title="Bản đồ chiến thuật"
            eyebrow="Không gian trận địa"
          />
          <div className="evt-section__body">
            <TacticalMap scene={event.climaxScene} fullscreen showHeading={false} />
          </div>
        </div>
      </section>
    )}
  </>
);

export default ClimaxSection;
