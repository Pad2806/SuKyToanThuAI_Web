import React from 'react';

/**
 * EraTakeaway — Takeaway + Quiz section for era-timeline.
 * Reuses quiz format from battle template.
 */
export const EraTakeaway = ({ beat, event, sectionDef, variant = 'dark' }) => {
  const takeaway = event.takeaway || {};
  const quiz = event.quiz || [];
  const blocks = beat?.blocks || [];

  const [quizState, setQuizState] = React.useState({});

  const handleAnswer = (qId, answerIndex, correctIndex) => {
    setQuizState((prev) => ({ ...prev, [qId]: { selected: answerIndex, correct: correctIndex } }));
  };

  return (
    <section className={`evt-section evt-section--${variant}`} id={sectionDef.id}>
      <div className="evt-section__shell">
        <div className="evt-section__header">
          <div className="evt-section__eyebrow">
            <span className="evt-section__numeral">{sectionDef.numeral}</span>
            <span className="evt-section__eyebrow-text">{sectionDef.label}</span>
          </div>
          <h2 className="evt-section__title">Bài Học Lịch Sử</h2>
          <div className="evt-section__divider" aria-hidden="true" />
        </div>
        <div className="evt-section__body">
          {/* Beat text blocks */}
          {blocks.filter((b) => b.type === 'text').map((block, i) => (
            <p className="evt-block-text" key={i}>{block.body}</p>
          ))}

          {/* Takeaway cards */}
          {takeaway.happened && (
            <div className="era-takeaway-cards">
              <div className="era-takeaway-card">
                <h4>📖 Điều đã xảy ra</h4>
                <p>{takeaway.happened}</p>
              </div>
              {takeaway.whyItMatters && (
                <div className="era-takeaway-card">
                  <h4>⭐ Tại sao quan trọng</h4>
                  <p>{takeaway.whyItMatters}</p>
                </div>
              )}
              {takeaway.lesson && (
                <div className="era-takeaway-card">
                  <h4>💡 Bài học rút ra</h4>
                  <p>{takeaway.lesson}</p>
                </div>
              )}
            </div>
          )}

          {/* Quiz */}
          {quiz.length > 0 && (
            <div className="era-quiz">
              <h3 className="era-quiz__title">🧠 Kiểm tra kiến thức</h3>
              {quiz.map((q) => {
                const state = quizState[q.id];
                return (
                  <div className="era-quiz__question" key={q.id}>
                    <p className="era-quiz__text">{q.question}</p>
                    <div className="era-quiz__options">
                      {(q.options || []).map((opt, oi) => {
                        let cls = 'era-quiz__option';
                        if (state) {
                          if (oi === state.correct) cls += ' era-quiz__option--correct';
                          else if (oi === state.selected && oi !== state.correct) cls += ' era-quiz__option--wrong';
                        }
                        return (
                          <button
                            key={oi}
                            className={cls}
                            onClick={() => handleAnswer(q.id, oi, q.correct)}
                            disabled={!!state}
                            type="button"
                          >
                            {opt}
                          </button>
                        );
                      })}
                    </div>
                    {state && q.explanation && (
                      <p className="era-quiz__explanation">
                        {state.selected === state.correct ? '✅ ' : '❌ '}
                        {q.explanation}
                      </p>
                    )}
                  </div>
                );
              })}
            </div>
          )}
        </div>
      </div>
    </section>
  );
};

export default EraTakeaway;
