/**
 * Research Templates — Template registry
 *
 * Maps template keys to their page-level components.
 * Each template is a self-contained folder that renders AI-generated data.
 *
 * Usage:
 *   import { getResearchTemplate } from './research-templates/template-registry';
 *   const Template = getResearchTemplate('battle');
 *   return <Template data={eventData} />;
 */
import { BattleTemplate } from './battle/battle-template.jsx';
import { EraTimelineTemplate } from './era-timeline/era-timeline-template.jsx';

const TEMPLATE_MAP = {
  battle: BattleTemplate,
  'era-timeline': EraTimelineTemplate,
  universal: BattleTemplate, // fallback — reuse battle layout for now
};

/**
 * Returns the React component for the given template key.
 * Falls back to BattleTemplate if no match found.
 */
export function getResearchTemplate(templateKey) {
  return TEMPLATE_MAP[templateKey] || BattleTemplate;
}

export default getResearchTemplate;

