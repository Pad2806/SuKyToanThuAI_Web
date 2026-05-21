import React, { useState, useCallback } from 'react';
import { GiSwordClash, GiCastle, GiCrown, GiScrollUnfurled, GiShield, GiTrophy, GiFireSilhouette, GiSailboat } from 'react-icons/gi';
import { FaLandmark, FaChevronDown, FaChevronUp, FaUserTie } from 'react-icons/fa';
import { resolveImageUrl } from '../../../../lib/fallback-image.js';

const significanceColors = {
  high: '#c9a84c',
  medium: '#8b7332',
  low: '#5a5a5a',
};

/** Map icon name (from LLM) → react-icon component */
const iconMap = {
  'sword': GiSwordClash,
  'castle': GiCastle,
  'crown': GiCrown,
  'scroll': GiScrollUnfurled,
  'shield': GiShield,
  'trophy': GiTrophy,
  'fire': GiFireSilhouette,
  'ship': GiSailboat,
  'landmark': FaLandmark,
};

/** Get icon component, fallback to scroll */
const getIcon = (iconKey) => {
  if (!iconKey) return GiScrollUnfurled;
  // If it's an emoji, fallback
  if (/\p{Emoji}/u.test(iconKey)) return GiScrollUnfurled;
  return iconMap[iconKey] || GiScrollUnfurled;
};

/** Format year: negative → TCN, positive → normal */
const formatYear = (year) => {
  if (year === null || year === undefined) return '';
  if (typeof year === 'string') return year; // Already formatted like "2879 TCN"
  if (year < 0) return `${Math.abs(year)} TCN`;
  return String(year);
};

const formatYearRange = (range) => {
  if (!range) return '';
  return String(range).replace(/(^|[\s(])-(\d+)/g, (_, prefix, value) => `${prefix}${value} TCN`);
};

/**
 * EraFlow — Vertical timeline of eras with events and connections.
 * THE WOW COMPONENT for era-timeline template.
 */
export const EraFlow = ({ eras = [], connections = [], sectionDef, variant = 'dark', fallbackImage = '/images/generated/parchment.png' }) => {
  const [expandedEra, setExpandedEra] = useState(null);

  const toggleEra = useCallback((eraId) => {
    setExpandedEra((prev) => (prev === eraId ? null : eraId));
  }, []);

  const getConnection = useCallback((fromId) => {
    return connections.find((c) => c.from === fromId);
  }, [connections]);

  return (
    <section className={`evt-section evt-section--${variant}`} id={sectionDef.id}>
      <div className="evt-section__shell evt-section__shell--wide">
        <div className="evt-section__header">
          <div className="evt-section__eyebrow">
            <span className="evt-section__numeral">{sectionDef.numeral}</span>
            <span className="evt-section__eyebrow-text">{sectionDef.label}</span>
          </div>
          <h2 className="evt-section__title">Dòng Chảy Lịch Sử</h2>
          <div className="evt-section__divider" aria-hidden="true" />
        </div>
        <div className="evt-section__body">
          <div className="era-flow">
            {/* Central timeline line */}
            <div className="era-flow__line" aria-hidden="true" />

            {eras.map((era, i) => {
              const isExpanded = expandedEra === era.id;
              const isLeft = i % 2 === 0;
              const connection = getConnection(era.id);
              const eraImage = resolveImageUrl(era.image || fallbackImage, era.name || era.id);

              return (
                <div key={era.id}>
                  {/* Era Card */}
                  <div className={`era-card era-card--${isLeft ? 'left' : 'right'} ${isExpanded ? 'era-card--expanded' : ''}`}>
                    {/* Timeline dot */}
                    <div className="era-card__dot" aria-hidden="true">
                      <div className="era-card__dot-inner" />
                      <div className="era-card__dot-glow" />
                    </div>

                    {/* Card content */}
                    <div className="era-card__content">
                      {/* Era image */}
                      {eraImage && (
                        <div className="era-card__image">
                          <img src={eraImage} alt={era.name} loading="lazy" />
                          <div className="era-card__image-overlay" />
                        </div>
                      )}

                      <div className="era-card__body">
                        <button
                          className="era-card__header"
                          onClick={() => toggleEra(era.id)}
                          type="button"
                          aria-expanded={isExpanded}
                        >
                          <span className="era-card__year-range">{formatYearRange(era.yearRange)}</span>
                          <h3 className="era-card__name">{era.name}</h3>
                          {isExpanded
                            ? <FaChevronUp className="era-card__chevron era-card__chevron--open" />
                            : <FaChevronDown className="era-card__chevron" />
                          }
                        </button>

                        <p className="era-card__summary">{era.summary}</p>

                        {/* Key figures badges */}
                        {era.keyFigures?.length > 0 && (
                          <div className="era-card__figures">
                            {era.keyFigures.map((name, fi) => (
                              <span className="era-figure-badge" key={fi}>
                                <FaUserTie className="era-figure-badge__icon" /> {name}
                              </span>
                            ))}
                          </div>
                        )}

                        {/* Expandable events */}
                        <div className={`era-card__events ${isExpanded ? 'era-card__events--visible' : ''}`}>
                          {(era.keyEvents || []).map((evt, ei) => {
                            const IconComp = getIcon(evt.icon);
                            return (
                              <div
                                className="era-event-node"
                                key={ei}
                                style={{ '--accent': significanceColors[evt.significance] || significanceColors.medium }}
                              >
                                <span className="era-event-node__icon">
                                  <IconComp />
                                </span>
                                <div className="era-event-node__content">
                                  <span className="era-event-node__year">{formatYear(evt.year)}</span>
                                  <h4 className="era-event-node__title">{evt.title}</h4>
                                  <p className="era-event-node__desc">{evt.description}</p>
                                </div>
                              </div>
                            );
                          })}
                        </div>

                        {/* Expand button */}
                        {!isExpanded && era.keyEvents?.length > 0 && (
                          <button
                            className="era-card__expand"
                            onClick={() => toggleEra(era.id)}
                            type="button"
                          >
                            Xem {era.keyEvents.length} sự kiện
                            <FaChevronDown size={12} />
                          </button>
                        )}
                      </div>
                    </div>
                  </div>

                  {/* Connection arrow between eras */}
                  {connection && i < eras.length - 1 && (
                    <div className="era-connector">
                      <div className="era-connector__line" />
                      <span className="era-connector__label">{connection.label}</span>
                    </div>
                  )}
                </div>
              );
            })}
          </div>
        </div>
      </div>
    </section>
  );
};

export default EraFlow;
