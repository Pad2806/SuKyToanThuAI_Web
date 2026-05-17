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
  if (event?.template_type === 'battle') {
    return ['hero', 'climax', 'aftermath'].every((key) => approved.has(key))
      && (approved.has('battle-map') || approved.has('battlefield'));
  }
  return approved.has('hero');
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

export const AdminFlowChecklist = ({ steps }) => (
  <section className="admin-flow" aria-label="Quy trình xuất bản">
    <ol className="admin-flow__list">
      {steps.map((step, index) => (
        <li
          className={`admin-flow__step ${step.done ? 'is-done' : ''} ${step.active ? 'is-active' : ''}`}
          key={step.key}
        >
          <span className="admin-flow__index">{index + 1}</span>
          <span>{step.label}</span>
        </li>
      ))}
    </ol>
  </section>
);

export default AdminFlowChecklist;
