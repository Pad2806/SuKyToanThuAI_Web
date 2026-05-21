import React from 'react';
import { BattleSection } from '../shared/battle-section.jsx';
import { BeatBlocks } from '../shared/battle-blocks.jsx';
import { ClimaxScene } from '../interactive/climax-scene.jsx';
import { resolveImageUrl } from '../../../../lib/fallback-image.js';

const PHASE_LABELS = [
  ['phase-1', 'Mở màn', 'Bước mở đầu của cao trào'],
  ['phase-2', 'Đỉnh điểm', 'Hành động chính làm cục diện thay đổi'],
  ['phase-3', 'Kết cục', 'Kết quả trực tiếp của cao trào'],
];

const textFromBeat = (beat) => (beat?.blocks ?? [])
  .filter((block) => block?.type === 'text' || block?.type === 'quote')
  .map((block) => block.body || block.quote)
  .filter(Boolean)
  .join(' ');

const getClimaxScene = (event, beat) => {
  const scene = event?.climaxScene;
  if (scene?.phases?.length) return scene;

  const text = textFromBeat(beat);
  if (!text) return null;

  const fallbackImage = resolveImageUrl(event?.image || event?.fallbackImage, event?.title);
  return {
    title: event?.title || beat?.title || 'Cao trào',
    backgroundImage: fallbackImage,
    phases: PHASE_LABELS.map(([id, label, summary]) => ({
      id,
      label,
      summary,
      description: text,
      image: fallbackImage,
    })),
    hotspots: [],
  };
};

/**
 * BattleClimax - Section IV: The decisive moment.
 */
export const BattleClimax = ({ beat, event, sectionDef, variant }) => {
  const scene = getClimaxScene(event, beat);

  return (
    <BattleSection variant={variant} def={sectionDef} title={beat?.title ?? 'Cao Trào'} wide>
      <BeatBlocks blocks={beat?.blocks} />

      {scene && (
        <ClimaxScene scene={scene} />
      )}
    </BattleSection>
  );
};

export default BattleClimax;
