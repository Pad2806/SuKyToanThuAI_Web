import React from 'react';
import { Link } from 'react-router';
import { BeatBlocks } from '../blocks/story-blocks.jsx';
import { RelatedEvents } from '../blocks/related-events.jsx';
import { AftermathSummary } from '../../story-interactive/aftermath-summary.jsx';
import { HistoricalTakeaway } from '../../story-interactive/historical-takeaway.jsx';
import { KnowledgeQuiz } from '../../story-interactive/knowledge-quiz.jsx';

export const AftermathSection = ({
  beat,
  takeawayBeat,
  event,
  sectionDef,
  relatedEvents,
}) => {
  const safeDef = sectionDef || { id: 'evt-outcomes', numeral: 'VI', label: 'Hệ quả và bài học' };
  const aftermathImage = event.aftermath?.image
    || event.climaxScene?.backgroundImage
    || event.image
    || event.fallbackImage;
  const analysisBlocks = beat?.blocks ?? [];
  const lessonBlocks = takeawayBeat?.blocks ?? [];

  return (
    <section className="evt-section evt-section--light evt-section--outcomes" id={safeDef.id}>
      <div className="evt-section__shell evt-section__shell--wide evt-outcomes-shell">
        <div className="evt-section__header">
          <div className="evt-section__eyebrow">
            <span className="evt-section__numeral">{safeDef.numeral}</span>
            <span className="evt-section__eyebrow-text">{safeDef.label}</span>
          </div>
          <h2 className="evt-section__title">Hệ quả và bài học</h2>
          <p className="evt-outcomes-subtitle">
            Từ chiến thắng trên sông Bạch Đằng, Đại Việt không chỉ giữ vững độc lập mà còn để lại
            những bài học quân sự và chính trị lâu dài.
          </p>
          <div className="evt-section__divider" aria-hidden="true" />
        </div>

        <div className="evt-section__body">
          <div className="evt-outcomes-layout">
            <div className="evt-outcomes-main">
              {analysisBlocks.length > 0 && (
                <div className="evt-outcome-copy evt-outcomes-narrative">
                  <span className="evt-outcomes-panel-label">Hệ quả trực tiếp</span>
                  <BeatBlocks blocks={analysisBlocks} />
                </div>
              )}

              {event.aftermath && <AftermathSummary aftermath={event.aftermath} />}
            </div>

            <aside className="evt-outcomes-rail">
              {aftermathImage && (
                <figure className="evt-outcomes-visual">
                  <img src={aftermathImage} alt="Hệ quả và bài học" loading="lazy" decoding="async" />
                  <figcaption>Dấu ấn Bạch Đằng trong lịch sử Đại Việt</figcaption>
                </figure>
              )}
              {event.takeaway && <HistoricalTakeaway takeaway={event.takeaway} />}
            </aside>
          </div>

          {lessonBlocks.length > 0 && (
            <div className="evt-outcomes-lessons-section">
              <div className="evt-outcomes-lessons-heading">
                <span className="evt-outcomes-panel-label">Bài học rút ra</span>
                <h3>Trí tuệ thắng sức mạnh</h3>
              </div>
              <div className="evt-outcomes-lessons-copy">
                <BeatBlocks blocks={lessonBlocks} />
              </div>
            </div>
          )}

          {event.quiz?.length > 0 && (
            <div className="evt-outcomes-quiz-panel">
              <KnowledgeQuiz questions={event.quiz} />
            </div>
          )}

          {relatedEvents?.length > 0 && <RelatedEvents events={relatedEvents} />}

          <div className="evt-end-cta">
            <span className="evt-end-cta__ornament" aria-hidden="true">✦</span>
            <p className="evt-end-cta__text">Kết thúc câu chuyện</p>
            <Link to="/" className="evt-end-cta__link">
              Khám phá thêm câu chuyện lịch sử →
            </Link>
          </div>
        </div>
      </div>
    </section>
  );
};

export default AftermathSection;
