import React, { useState, useCallback } from 'react';

export const KnowledgeQuiz = ({ questions }) => {
  const [currentQ, setCurrentQ] = useState(0);
  const [selected, setSelected] = useState(null);
  const [answered, setAnswered] = useState(new Set());
  const [score, setScore] = useState(0);
  const [showResult, setShowResult] = useState(false);

  const q = questions[currentQ];
  const isAnswered = selected !== null;
  const isCorrect = selected === q.correct;
  const isFinished = showResult;

  const handleSelect = useCallback((optionIndex) => {
    if (isAnswered) return;
    setSelected(optionIndex);
    if (optionIndex === q.correct) {
      setScore((s) => s + 1);
    }
    setAnswered((prev) => new Set(prev).add(currentQ));
  }, [isAnswered, currentQ, q.correct]);

  const handleNext = useCallback(() => {
    if (currentQ < questions.length - 1) {
      setCurrentQ((c) => c + 1);
      setSelected(null);
    } else {
      setShowResult(true);
    }
  }, [currentQ, questions.length]);

  const handleRestart = useCallback(() => {
    setCurrentQ(0);
    setSelected(null);
    setAnswered(new Set());
    setScore(0);
    setShowResult(false);
  }, []);

  if (isFinished) {
    const percentage = Math.round((score / questions.length) * 100);
    const emoji = percentage >= 75 ? '🏆' : percentage >= 50 ? '👍' : '📚';
    const message = percentage >= 75
      ? 'Xuất sắc! Bạn nắm rất vững kiến thức!'
      : percentage >= 50
        ? 'Khá tốt! Cần ôn lại một số chi tiết.'
        : 'Hãy đọc lại câu chuyện và thử lại nhé!';

    return (
      <div className="quiz">
        <div className="quiz__result">
          <span className="quiz__result-emoji" aria-hidden="true">{emoji}</span>
          <h3 className="quiz__result-title">Kết quả</h3>
          <p className="quiz__result-score">
            {score}/{questions.length} câu đúng ({percentage}%)
          </p>
          <p className="quiz__result-message">{message}</p>
          <button className="quiz__btn quiz__btn--restart" onClick={handleRestart} type="button">
            Làm lại
          </button>
        </div>
      </div>
    );
  }

  return (
    <div className="quiz">
      <div className="quiz__header">
        <h3 className="quiz__title">Kiểm tra hiểu bài</h3>
        <span className="quiz__progress">{currentQ + 1} / {questions.length}</span>
      </div>

      <div className="quiz__progress-bar" aria-hidden="true">
        <div
          className="quiz__progress-fill"
          style={{ width: `${((currentQ + (isAnswered ? 1 : 0)) / questions.length) * 100}%` }}
        />
      </div>

      <p className="quiz__question">{q.question}</p>

      <div className="quiz__options" role="radiogroup" aria-label="Các đáp án">
        {q.options.map((option, i) => {
          let state = '';
          if (isAnswered) {
            if (i === q.correct) state = 'quiz__option--correct';
            else if (i === selected) state = 'quiz__option--wrong';
          }

          return (
            <button
              className={`quiz__option ${state} ${selected === i ? 'is-selected' : ''}`}
              key={i}
              onClick={() => handleSelect(i)}
              disabled={isAnswered}
              type="button"
              role="radio"
              aria-checked={selected === i}
            >
              <span className="quiz__option-letter">{String.fromCharCode(65 + i)}</span>
              <span className="quiz__option-text">{option}</span>
              {isAnswered && i === q.correct && (
                <svg className="quiz__option-icon" width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="3" aria-hidden="true">
                  <path d="M20 6L9 17l-5-5" />
                </svg>
              )}
              {isAnswered && i === selected && i !== q.correct && (
                <svg className="quiz__option-icon" width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="3" aria-hidden="true">
                  <path d="M18 6L6 18M6 6l12 12" />
                </svg>
              )}
            </button>
          );
        })}
      </div>

      {isAnswered && (
        <div className={`quiz__feedback ${isCorrect ? 'quiz__feedback--correct' : 'quiz__feedback--wrong'}`}>
          <strong>{isCorrect ? '✓ Chính xác!' : '✗ Chưa đúng'}</strong>
          <p>{q.explanation}</p>
        </div>
      )}

      {isAnswered && (
        <button className="quiz__btn quiz__btn--next" onClick={handleNext} type="button">
          {currentQ < questions.length - 1 ? 'Câu tiếp theo →' : 'Xem kết quả'}
        </button>
      )}
    </div>
  );
};

export default KnowledgeQuiz;
