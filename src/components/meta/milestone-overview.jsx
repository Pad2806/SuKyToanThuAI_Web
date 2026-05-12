import React from 'react';

export const beatLabels = {
  climax: 'Bước Ngoặt',
  falling: 'Hệ Quả',
  hook: 'Khoảnh Khắc',
  rising: 'Thử Thách',
  setup: 'Bối Cảnh',
  takeaway: 'Bài Học',
};

export const MilestoneOverview = ({ activeBeat, beats, onSelectBeat }) => (
  <nav aria-label="Mốc câu chuyện" className="milestone-overview">
    {beats.map((beat) => (
      <button
        className={beat.type === activeBeat ? 'is-active' : ''}
        key={beat.type}
        onClick={() => onSelectBeat(beat.type)}
        type="button"
      >
        {beatLabels[beat.type] ?? beat.title}
      </button>
    ))}
  </nav>
);

export default MilestoneOverview;
