import React from 'react';
import { Link } from 'react-router';
import { StorySection } from '../story-section.jsx';
import { HistoricalTakeaway } from '../../story-interactive/historical-takeaway.jsx';
import { KnowledgeQuiz } from '../../story-interactive/knowledge-quiz.jsx';
import { RelatedEvents } from '../blocks/related-events.jsx';

/**
 * Section VI: Takeaway — Summary, Quiz, and End CTA.
 */
export const TakeawaySection = ({ beat, event, sectionDef, variant, relatedEvents }) => (
  <StorySection variant={variant} def={sectionDef} title={beat?.title ?? 'Bài Học'}>
    {event.takeaway && (
      <HistoricalTakeaway takeaway={event.takeaway} />
    )}

    {event.quiz?.length > 0 && (
      <KnowledgeQuiz questions={event.quiz} />
    )}

    {relatedEvents?.length > 0 && (
      <RelatedEvents events={relatedEvents} />
    )}

    {/* End CTA */}
    <div className="evt-end-cta">
      <span className="evt-end-cta__ornament" aria-hidden="true">✦</span>
      <p className="evt-end-cta__text">Kết thúc câu chuyện</p>
      <Link to="/" className="evt-end-cta__link">Khám phá thêm câu chuyện lịch sử →</Link>
    </div>
  </StorySection>
);

export default TakeawaySection;
