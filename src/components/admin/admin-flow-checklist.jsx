import React from 'react';

const isFilled = (value) => {
  if (Array.isArray(value)) return value.length > 0;
  if (value && typeof value === 'object') return Object.keys(value).length > 0;
  return Boolean(value);
};

const approvedAssetKeys = (assets = []) => new Set(
  assets
    .filter((asset) => asset.status === 'approved' && isFilled(asset.image_url || asset.imageUrl))
    .map((asset) => asset.slot_key || asset.slotKey),
);

const assetsReady = (event, assets = []) => {
  const approved = approvedAssetKeys(assets);
  return requiredAssetKeys(event).every((key) => approved.has(key));
};

const requiredAssetKeys = (event) => {
  const data = event?.interactive_data || {};
  const keys = ['hero', 'context', 'climax', 'aftermath', 'takeaway'];
  (data.characters || []).forEach((_, index) => keys.push(`character-${index + 1}`));
  (data.timeline || []).forEach((_, index) => keys.push(`timeline-scene-${index + 1}`));
  (data.climaxScene?.phases || []).forEach((_, index) => keys.push(`climax-phase-${index + 1}`));
  if (data.climaxScene?.hotspots?.length) {
    keys.push(event?.template_type === 'battle_air_defense' ? 'air-raid-map' : 'battle-map');
  } else if (event?.template_type === 'battle') {
    keys.push('battle-map');
  }
  return keys;
};

const interactionsReady = (event) => {
  const data = event?.interactive_data || {};
  return (data.characters || []).length >= 1
    && (data.timeline || []).length >= 4
    && (data.quiz || []).length >= 3
    && isFilled(data.climaxScene)
    && isFilled(data.aftermath)
    && isFilled(data.takeaway);
};

export const buildAdminFlowSteps = (detail, qualityReport) => {
  if (!detail?.event) return [];
  const storyBeats = detail.story?.story_json?.beats || [];
  const steps = [
    { key: 'event', label: 'Tạo sự kiện', done: isFilled(detail.event.title) && isFilled(detail.event.era_id) },
    { key: 'sources', label: 'Nhập nguồn RAG', done: (detail.sources || []).length > 0 },
    { key: 'draft', label: 'Nhận draft AI', done: storyBeats.length >= 6 },
    { key: 'interactions', label: 'Hoàn thiện tương tác', done: interactionsReady(detail.event) },
    { key: 'assets', label: 'Duyệt hình ảnh', done: assetsReady(detail.event, detail.assets) },
    { key: 'quality', label: 'Đạt kiểm duyệt', done: Boolean(qualityReport?.passed) || ['review', 'published'].includes(detail.event.status) },
    { key: 'publish', label: 'Công bố', done: detail.event.status === 'published' },
  ];
  const activeIndex = steps.findIndex((step) => !step.done);
  return steps.map((step, index) => ({ ...step, active: activeIndex === index }));
};

const IconCheck = () => (
  <svg aria-hidden="true" width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="3" strokeLinecap="round" strokeLinejoin="round">
    <polyline points="20 6 9 17 4 12"/>
  </svg>
);

export const AdminFlowChecklist = ({ steps }) => (
  <section className="admin-flow" aria-label="Quy trình xuất bản">
    <ol className="admin-flow__list">
      {steps.map((step, index) => (
        <li
          className={`admin-flow__step ${step.done ? 'is-done' : ''} ${step.active ? 'is-active' : ''}`}
          key={step.key}
          style={{ opacity: !step.done && !step.active ? 0.5 : 1, color: step.active ? 'var(--gold)' : (step.done ? 'var(--green, #4ade80)' : 'inherit') }}
        >
          <span className="admin-flow__index" style={{ display: 'inline-flex', alignItems: 'center', justifyContent: 'center' }}>
            {step.done ? <IconCheck /> : index + 1}
          </span>
          <span>{step.label}</span>
        </li>
      ))}
    </ol>
  </section>
);

export default AdminFlowChecklist;
