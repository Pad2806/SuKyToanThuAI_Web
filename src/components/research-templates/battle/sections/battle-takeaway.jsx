import React from 'react';
import { Link } from 'react-router';
import { BattleSection } from '../shared/battle-section.jsx';
import { HistoricalTakeaway } from '../interactive/historical-takeaway.jsx';
import { KnowledgeQuiz } from '../interactive/knowledge-quiz.jsx';

/**
 * BattleTakeaway — Section VI: Lessons, Quiz, and End CTA.
 */
export const BattleTakeaway = ({ beat, event, sectionDef, variant, relatedEvents }) => (
  <BattleSection variant={variant} def={sectionDef} title={beat?.title ?? 'Bài Học'}>
    {event.takeaway && (
      <HistoricalTakeaway takeaway={event.takeaway} />
    )}

    {event.quiz?.length > 0 && (
      <KnowledgeQuiz questions={event.quiz} />
    )}

    {/* End CTA — back to AI Studio */}
    <div className="evt-end-cta">
      <span className="evt-end-cta__ornament" aria-hidden="true">✦</span>
      <p className="evt-end-cta__text">Kết thúc bài nghiên cứu</p>
      <Link to="/khong-gian-ai/nghien-cuu" className="evt-end-cta__link">
        Quay lại Không Gian Nghiên Cứu →
      </Link>
    </div>
  </BattleSection>
);

export default BattleTakeaway;
