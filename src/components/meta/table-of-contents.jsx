import React from 'react';
import { MilestoneOverview } from './milestone-overview.jsx';

export const TableOfContents = ({ activeBeat, beats }) => {
  const handleSelectBeat = (beatType) => {
    const target = document.getElementById(`beat-${beatType}`);
    const reducedMotion = window.matchMedia('(prefers-reduced-motion: reduce)').matches;

    target?.scrollIntoView({ behavior: reducedMotion ? 'auto' : 'smooth', block: 'start' });
  };

  return (
    <div aria-label="Mục lục" className="table-of-contents">
      <MilestoneOverview activeBeat={activeBeat} beats={beats} onSelectBeat={handleSelectBeat} />
    </div>
  );
};

export default TableOfContents;
