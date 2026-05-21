import React, { useEffect, useRef, useState } from 'react';

const PIPELINE_STEPS = [
  {
    id: 'moderation',
    label: 'Kiểm duyệt nội dung',
    detail: 'Đảm bảo an toàn & phù hợp cộng đồng',
    icon: '🛡️',
    durationMs: 1200,
  },
  {
    id: 'analyze',
    label: 'AI phân tích sự kiện lịch sử',
    detail: 'Trích xuất nhân vật, mốc thời gian, bối cảnh',
    icon: '🧠',
    durationMs: 5000,
  },
  {
    id: 'structure',
    label: 'Dựng cấu trúc trang',
    detail: 'Tổ chức dữ liệu thành timeline & nhân vật',
    icon: '📜',
    durationMs: 1500,
  },
];

/**
 * Tính chỉ số step hiện tại dựa trên tổng thời gian đã trôi qua
 */
function getActiveStep(elapsedMs) {
  let cumulative = 0;
  for (let i = 0; i < PIPELINE_STEPS.length; i++) {
    cumulative += PIPELINE_STEPS[i].durationMs;
    if (elapsedMs < cumulative) return i;
  }
  return PIPELINE_STEPS.length - 1;
}

/**
 * Hook tạo hiệu ứng highlight từng từ trong đoạn văn bản
 * Trả về mảng tokens với trạng thái highlighted / done
 */
function useWordScan(text, isActive) {
  const [scanIndex, setScanIndex] = useState(0);
  const timerRef = useRef(null);
  const words = text ? text.trim().split(/\s+/) : [];

  useEffect(() => {
    if (!isActive || !words.length) {
      setScanIndex(0);
      return;
    }

    // Tốc độ duyệt: nhanh ở đầu, giảm dần ở giữa, tăng lại cuối
    const getDelay = (idx) => {
      const pct = idx / words.length;
      if (pct < 0.15) return 40;    // bắt đầu nhanh
      if (pct < 0.7) return 60;     // giữa chậm hơn
      return 35;                     // cuối nhanh lại
    };

    const advance = (idx) => {
      if (idx >= words.length) return;
      setScanIndex(idx);
      timerRef.current = setTimeout(() => advance(idx + 1), getDelay(idx));
    };

    timerRef.current = setTimeout(() => advance(0), 300);
    return () => clearTimeout(timerRef.current);
  }, [isActive, text]);

  return { words, scanIndex };
}

export function CreatorLoadingScreen({ content }) {
  const [elapsedMs, setElapsedMs] = useState(0);
  const startTimeRef = useRef(Date.now());
  const rafRef = useRef(null);

  // Cập nhật elapsed time bằng requestAnimationFrame để mượt
  useEffect(() => {
    startTimeRef.current = Date.now();
    const tick = () => {
      setElapsedMs(Date.now() - startTimeRef.current);
      rafRef.current = requestAnimationFrame(tick);
    };
    rafRef.current = requestAnimationFrame(tick);
    return () => cancelAnimationFrame(rafRef.current);
  }, []);

  const activeStep = getActiveStep(elapsedMs);

  // Chỉ duyệt từng từ khi đang ở bước analyze (bước giữa và dài nhất)
  const isScanActive = activeStep === 1;
  const { words, scanIndex } = useWordScan(content, isScanActive);

  // Tính % tiến trình tổng
  const totalDuration = PIPELINE_STEPS.reduce((s, p) => s + p.durationMs, 0);
  const progressPct = Math.min((elapsedMs / totalDuration) * 100, 99);

  return (
    <div className="cls-overlay" role="status" aria-live="polite" aria-label="Đang xử lý nội dung">
      {/* Nền mờ glassmorphism */}
      <div className="cls-backdrop" />

      <div className="cls-card">
        {/* Header */}
        <div className="cls-header">
          <span className="cls-orb" aria-hidden="true" />
          <span className="cls-header__label">AI Đang Xử Lý</span>
        </div>

        {/* Vùng preview "duyệt từng từ" */}
        {content && (
          <div className="cls-scan" aria-hidden="true">
            <div className="cls-scan__label">
              {isScanActive ? 'Đang đọc nội dung của bạn...' : 'Nội dung đã sẵn sàng'}
            </div>
            <p className="cls-scan__text">
              {words.map((word, idx) => (
                <span
                  key={idx}
                  className={
                    'cls-scan__word' +
                    (idx === scanIndex ? ' cls-scan__word--active' : '') +
                    (idx < scanIndex ? ' cls-scan__word--done' : '')
                  }
                >
                  {word}{' '}
                </span>
              ))}
            </p>
          </div>
        )}

        {/* Pipeline Steps */}
        <ol className="cls-pipeline" aria-label="Các bước xử lý">
          {PIPELINE_STEPS.map((step, idx) => {
            const isDone = idx < activeStep;
            const isCurrentActive = idx === activeStep;
            return (
              <li
                key={step.id}
                className={
                  'cls-step' +
                  (isCurrentActive ? ' cls-step--active' : '') +
                  (isDone ? ' cls-step--done' : '')
                }
              >
                <span className="cls-step__icon" aria-hidden="true">
                  {isDone ? '✓' : step.icon}
                </span>
                <div className="cls-step__body">
                  <span className="cls-step__label">{step.label}</span>
                  {isCurrentActive && (
                    <span className="cls-step__detail">{step.detail}</span>
                  )}
                </div>
                {isCurrentActive && <span className="cls-step__spinner" aria-hidden="true" />}
              </li>
            );
          })}
        </ol>

        {/* Thanh tiến trình tổng */}
        <div className="cls-progress" role="progressbar" aria-valuenow={Math.round(progressPct)} aria-valuemin={0} aria-valuemax={100}>
          <div className="cls-progress__bar" style={{ width: `${progressPct}%` }} />
        </div>
        <p className="cls-progress__hint">
          Có thể mất 10–20 giây. Đừng tắt trang nhé.
        </p>
      </div>
    </div>
  );
}
