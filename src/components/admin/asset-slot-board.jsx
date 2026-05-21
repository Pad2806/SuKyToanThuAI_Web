import React, { useState } from 'react';
import { cleanImageUrl, isUsableImage } from '../../lib/image-utils.js';
import { templateAssetCount, templateDisplayName } from '../../lib/admin-template-utils.js';

const CORE_REQUIRED_SLOTS = new Set(['hero', 'context', 'climax', 'battle-map', 'air-raid-map', 'aftermath', 'takeaway']);

const SLOT_LABELS = {
  hero: 'Ảnh bìa',
  context: 'Bối cảnh',
  climax: 'Cao trào',
  aftermath: 'Hệ quả',
  takeaway: 'Bài học',
  'battle-map': 'Bản đồ chiến thuật',
  'air-raid-map': 'Bản đồ chiến thuật',
};

const IconImage = () => (
  <svg aria-hidden="true" width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
    <rect x="3" y="3" width="18" height="18" rx="2" ry="2"/><circle cx="8.5" cy="8.5" r="1.5"/><polyline points="21 15 16 10 5 21"/>
  </svg>
);

const IconGrid = () => (
  <svg aria-hidden="true" width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
    <rect x="3" y="3" width="7" height="7"/><rect x="14" y="3" width="7" height="7"/><rect x="14" y="14" width="7" height="7"/><rect x="3" y="14" width="7" height="7"/>
  </svg>
);

const IconWand = () => (
  <svg aria-hidden="true" width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
    <path d="M15 4V2"/><path d="M15 16v-2"/><path d="M8 9h2"/><path d="M20 9h2"/><path d="M17.8 11.8L19 13"/><path d="M15 9h.01"/><path d="M17.8 6.2L19 5"/><path d="M11 6.2L9.7 5"/><path d="M11 11.8l-1.3 1.2"/><path d="M3 21l9-9"/>
  </svg>
);

const FieldBadge = ({ type = 'optional', children }) => (
  <span className={`admin-field-badge admin-field-badge--${type}`}>{children || (type === 'required' ? 'Bắt buộc' : 'Không bắt buộc')}</span>
);

export const AssetSlotBoard = ({ disabled = false, slots = [], templateDefinition = null, assetUsage = null, onEnsure, onPrompts, onImage, onReview, onManual }) => {
  const [manual, setManual] = useState({});
  const [notes, setNotes] = useState({});
  const usageBySlot = buildUsageLookup(assetUsage);
  const requiredCount = slots.filter((slot) => getRequirement(slot, slot.slotKey || slot.slot_key).type === 'required').length;
  const totalCount = slots.length || templateAssetCount(templateDefinition);

  return (
    <section className="admin-card">
      <div className="admin-card__header">
        <div className="admin-card__icon"><IconImage /></div>
        <h2>Hình ảnh minh họa</h2>
        {totalCount > 0 && <span className="admin-status admin-status--review">{totalCount} vị trí</span>}
      </div>
      {disabled && <p className="admin-note">Sự kiện không còn ở trạng thái chỉnh sửa.</p>}
      <p className="admin-note">
        Layout storytelling hiện tại dùng ảnh theo nội dung thật: bìa, bối cảnh, nhân vật, từng mốc diễn biến,
        cao trào, bản đồ chiến thuật và phần kết. Số vị trí sẽ tăng theo số nhân vật, timeline và giai đoạn cao trào.
      </p>
      {templateDefinition && (
        <div className="admin-template-summary">
          <strong>{templateDisplayName(templateDefinition)}</strong>
          <span>
            {slots.length
              ? `${slots.length} vị trí hiện tại, ${requiredCount} bắt buộc`
              : `${templateAssetCount(templateDefinition)} ảnh nền tảng trước khi nhập nội dung chi tiết`}
          </span>
          <ul className="admin-template-slot-list">
            {(templateDefinition.assetSlots || []).map((slot) => <li key={slot.slotKey}>{slot.slotLabel || SLOT_LABELS[slot.slotKey] || slot.slotKey}</li>)}
          </ul>
        </div>
      )}
      <div className="admin-actions">
        <button className="admin-btn admin-btn--primary" disabled={disabled} onClick={onEnsure} type="button"><IconGrid /> Tạo vị trí ảnh</button>
        <button className="admin-btn" disabled={disabled || !slots.length} onClick={onPrompts} type="button"><IconWand /> Tạo gợi ý AI</button>
      </div>
      <div className="asset-slot-grid">
        {slots.map((slot) => {
          const key = slot.slotKey || slot.slot_key;
          const image = cleanImageUrl(slot.imageUrl || slot.image_url);
          const manualUrl = cleanImageUrl(manual[key]);
          const requirement = getRequirement(slot, key);
          const usage = usageBySlot.get(key);
          return (
            <article key={slot.id || key} className="asset-slot">
              <header className="asset-slot__header">
                <h3>{slotDisplayLabel(slot, key)}</h3>
                <span className={`admin-status admin-status--${slot.status}`}>{slot.status}</span>
                <FieldBadge type={requirement.type}>{requirement.label}</FieldBadge>
                <UsageBadge image={image} slotStatus={slot.status} usage={usage} />
              </header>
              {isUsableImage(image, { allowDefault: false }) ? (
                <img alt={slot.slotLabel || key} src={image} loading="lazy" width="640" height="360" />
              ) : (
                <div className="admin-empty" style={{ padding: '16px' }}><IconImage /><span>Chưa có hình ảnh</span></div>
              )}
              {slot.prompt && (
                <details className="asset-slot__prompt">
                  <summary>Prompt AI</summary>
                  <p>{slot.prompt}</p>
                </details>
              )}
              <label>
                <span className="admin-field-title"><span>URL hình ảnh thủ công</span><FieldBadge /></span>
                <input autoComplete="off" disabled={disabled || slot.status === 'approved'} name={`hinh-anh-${key}`} placeholder="https://..." type="url" value={manual[key] ?? ''} onChange={(e) => setManual({ ...manual, [key]: e.target.value })} />
              </label>
              <label>
                <span className="admin-field-title"><span>Ghi chú kiểm duyệt</span><FieldBadge /></span>
                <input autoComplete="off" disabled={disabled} name={`ghi-chu-${key}`} placeholder="Ghi chú cho hình ảnh này" value={notes[key] ?? ''} onChange={(e) => setNotes({ ...notes, [key]: e.target.value })} />
              </label>
              <div className="admin-actions">
                <button className="admin-btn" disabled={disabled || !manualUrl || slot.status === 'approved'} onClick={() => onManual(slot, manualUrl)} type="button">Lưu URL</button>
                <button className="admin-btn admin-btn--primary" disabled={disabled || slot.status === 'approved'} onClick={() => onImage(slot)} type="button"><IconWand /> Tạo ảnh AI</button>
                <button className="admin-btn admin-btn--approve" disabled={disabled || !image} onClick={() => onReview(slot, 'approved', notes[key])} type="button">Duyệt</button>
                <button className="admin-btn admin-btn--danger" disabled={disabled} onClick={() => onReview(slot, 'rejected', notes[key])} type="button">Từ chối</button>
              </div>
            </article>
          );
        })}
        {!slots.length && <div className="admin-empty"><IconGrid /><p>Chưa có vị trí ảnh. Hãy tạo vị trí theo mẫu trước.</p></div>}
      </div>
    </section>
  );
};

function UsageBadge({ image, slotStatus, usage }) {
  if (!isUsableImage(image, { allowDefault: false })) return null;
  if (usage?.usedIn?.length) {
    const label = usage.usedIn.length > 1
      ? `${usage.usedIn[0]} +${usage.usedIn.length - 1}`
      : usage.usedIn[0];
    return <span className="admin-usage-badge admin-usage-badge--used">Đang dùng: {label}</span>;
  }
  if (['approved', 'generated'].includes(slotStatus)) {
    return <span className="admin-usage-badge admin-usage-badge--unused">Chưa dùng trong preview</span>;
  }
  return null;
}

function buildUsageLookup(assetUsage) {
  const lookup = new Map();
  for (const row of assetUsage?.used || []) {
    if (row.slotKey) lookup.set(row.slotKey, row);
  }
  return lookup;
}

function getRequirement(slot, key) {
  const requirement = slot.metadata?.requirement || slot.requirement;
  if (requirement === 'required') return { type: 'required', label: 'Bắt buộc' };
  if (requirement === 'one-of') {
    return { type: 'required', label: 'Cần 1 trong nhóm' };
  }
  if (CORE_REQUIRED_SLOTS.has(key)) return { type: 'required', label: 'Bắt buộc' };
  return { type: 'optional', label: 'Không bắt buộc' };
}

function slotDisplayLabel(slot, key) {
  if (SLOT_LABELS[key]) return SLOT_LABELS[key];
  if (key?.startsWith('character-')) return `Nhân vật ${key.split('-').at(-1)}`;
  if (key?.startsWith('timeline-scene-')) return `Mốc diễn biến ${key.split('-').at(-1)}`;
  if (key?.startsWith('climax-phase-')) return `Giai đoạn cao trào ${key.split('-').at(-1)}`;
  return slot.slotLabel || slot.slot_label || key;
}

export default AssetSlotBoard;
