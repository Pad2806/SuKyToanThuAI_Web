import React, { useEffect, useState } from 'react';
import { normalizeDraftEventData } from './event-studio-mappers.js';

const IconAi = () => (
  <svg aria-hidden="true" width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
    <polygon points="13 2 3 14 12 14 11 22 21 10 12 10 13 2"/>
  </svg>
);

const IconCheck = () => (
  <svg aria-hidden="true" width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
    <polyline points="20 6 9 17 4 12"/>
  </svg>
);

const IconWand = () => (
  <svg aria-hidden="true" width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
    <path d="M15 4V2"/><path d="M15 16v-2"/><path d="M8 9h2"/><path d="M20 9h2"/><path d="M17.8 11.8L19 13"/><path d="M15 9h.01"/><path d="M17.8 6.2L19 5"/><path d="M11 6.2L9.7 5"/><path d="M11 11.8l-1.3 1.2"/><path d="M3 21l9-9"/>
  </svg>
);

export const AiDraftPanel = ({ busy = false, disabled = false, draft, sourceCount = 0, onDraft, onAccept, onDraftChange }) => {
  const payload = draft?.payload;
  const [editedPayload, setEditedPayload] = useState(payload || null);
  const activePayload = editedPayload || payload;
  const coverage = activePayload?.coverageReport;

  useEffect(() => {
    setEditedPayload(payload ? clone(payload) : null);
  }, [payload]);

  const updatePayload = (updater) => {
    setEditedPayload((current) => {
      const next = updater(clone(current || payload));
      onDraftChange?.(next);
      return next;
    });
  };

  return (
    <section className="admin-card">
      <div className="admin-card__header">
        <div className="admin-card__icon"><IconAi /></div>
        <h2>Soạn thảo bằng AI</h2>
      </div>
      {disabled && <p className="admin-note">Sự kiện không còn ở trạng thái chỉnh sửa.</p>}
      <div className="admin-actions">
        <button className="admin-btn admin-btn--primary" disabled={busy || disabled || sourceCount === 0} onClick={onDraft} type="button">
          <IconWand />
          Tạo draft từ nguồn
        </button>
        <button className="admin-btn" disabled={busy || disabled || !activePayload} onClick={onAccept} type="button">
          <IconCheck />
          Nhận draft
        </button>
      </div>
      {sourceCount === 0 && <p className="admin-warning">Cần import ít nhất một nguồn chính thống trước khi draft.</p>}
      {draft?.detail && <p className="admin-warning">{draft.detail}</p>}
      {activePayload && (
        <div className="admin-draft-summary">
          <strong>{activePayload.title}</strong>
          <span>{activePayload.eventData?.story?.beats?.length ?? 0} cảnh</span>
          <span>{activePayload.eventData?.characters?.length ?? 0} nhân vật</span>
          <span>{activePayload.eventData?.timeline?.length ?? 0} mốc</span>
          <span>{activePayload.citations?.length ?? 0} trích dẫn</span>
          {coverage?.missing?.length
            ? <span style={{ color: '#ffb1a8' }}>Thiếu: {coverage.missing.join(', ')}</span>
            : <span style={{ color: '#7dd3a0' }}>Độ phủ đạt yêu cầu</span>}
        </div>
      )}
      {activePayload?.eventData && (
        <DraftEditForm disabled={busy || disabled} payload={activePayload} onChange={updatePayload} />
      )}
      {activePayload?.citations?.length > 0 && (
        <ul className="admin-source-list">
          {activePayload.citations.slice(0, 8).map((item, index) => (
            <li key={`${item.chunkId || item.sourceId || index}`}>{item.title || item.sourceId || 'Nguồn'} · {item.chunkId || 'không có đoạn trích'}</li>
          ))}
        </ul>
      )}
    </section>
  );
};

const DraftEditForm = ({ payload, disabled, onChange }) => {
  const data = normalizeDraftEventData(payload.eventData || {});
  const beats = data.story?.beats || [];
  return (
    <div className="admin-draft-editor">
      <h3>Chỉnh draft trước khi nhận</h3>
      <div className="editor-grid">
        <label>Tiêu đề
          <input autoComplete="off" disabled={disabled} value={data.title || ''} onChange={(e) => onChange((draft) => updateEventData(draft, { title: e.target.value }))} />
        </label>
        <label>Tóm tắt
          <textarea disabled={disabled} value={data.summary || ''} onChange={(e) => onChange((draft) => updateEventData(draft, { summary: e.target.value }))} />
        </label>
        <label>Trích đoạn
          <textarea disabled={disabled} value={data.excerpt || ''} onChange={(e) => onChange((draft) => updateEventData(draft, { excerpt: e.target.value }))} />
        </label>
      </div>
      <DraftSectionReview data={data} payload={payload} />
      <div className="editor-list">
        {beats.map((beat, index) => (
          <fieldset className="editor-row" key={`${beat.type}-${index}`}>
            <legend>{beat.type}</legend>
            <label>Tiêu đề cảnh
              <input autoComplete="off" disabled={disabled} value={beat.title || ''} onChange={(e) => onChange((draft) => updateBeat(draft, index, 'title', e.target.value))} />
            </label>
            <label>Nội dung cảnh đầu tiên
              <textarea disabled={disabled} value={beat.blocks?.[0]?.body || beat.blocks?.[0]?.quote || ''} onChange={(e) => onChange((draft) => updateBeat(draft, index, 'body', e.target.value))} />
            </label>
          </fieldset>
        ))}
      </div>
    </div>
  );
};

const DraftSectionReview = ({ data, payload }) => {
  const sections = buildDraftSections(data, payload);
  return (
    <div className="admin-draft-sections">
      <div className="admin-draft-sections__header">
        <h3>Nội dung AI theo từng section</h3>
        <p>Kiểm tra summary, description, bullet, prompt ảnh và dữ liệu tương tác trước khi nhận draft.</p>
      </div>
      {sections.map((section, index) => (
        <details className="admin-draft-section" key={section.id} open={index < 4}>
          <summary>
            <span><strong>{section.title}</strong><em>{section.count}</em></span>
            <span className={`admin-draft-section__status ${section.warnings.length ? 'is-warning' : 'is-ready'}`}>
              {section.warnings.length ? 'Thiếu nội dung' : 'Đủ nội dung'}
            </span>
          </summary>
          {section.warnings.length > 0 && (
            <ul className="admin-draft-section__warnings">
              {section.warnings.map((warning, i) => <li key={i}>{warning}</li>)}
            </ul>
          )}
          <div className="admin-draft-section__content">{section.content}</div>
        </details>
      ))}
    </div>
  );
};

function buildDraftSections(data, payload) {
  const setupBeat = findBeat(data, 'setup');
  const risingBeat = findBeat(data, 'rising');
  const climaxBeat = findBeat(data, 'climax');
  const fallingBeat = findBeat(data, 'falling');
  const takeawayBeat = findBeat(data, 'takeaway');
  const phases = data.climaxScene?.phases || [];
  const hotspots = data.climaxScene?.hotspots || data.tacticalMap?.points || [];
  const assets = payload.assets || [];

  return [
    section('hero', 'Hero / Ảnh bìa', data.imagePrompt || data.image ? 'có visual' : 'chưa có visual', [
      [data.title, 'Thiếu tiêu đề'], [data.summary, 'Thiếu summary'], [data.excerpt, 'Thiếu excerpt'],
    ], <FieldList fields={[['Tiêu đề', data.title], ['Summary', data.summary], ['Excerpt', data.excerpt], ['Image prompt', data.hero?.imagePrompt || data.imagePrompt], ['Image URL', data.image || data.hero?.imageUrl]]} />),
    section('context', 'Bối cảnh', `${setupBeat?.blocks?.length || 0} block`, [
      [sectionText(setupBeat), 'Bối cảnh thiếu description dài'],
    ], <SectionBeatPreview beat={setupBeat} extraFields={[['Context description', data.context?.description], ['Quick facts', listText(data.context?.quickFacts || data.context?.facts)], ['Image prompt', data.context?.imagePrompt]]} />),
    section('characters', 'Nhân vật chính', `${data.characters?.length || 0} nhân vật`, [
      [data.characters?.length, 'Chưa có nhân vật chính'],
      ...missingCount(data.characters, 'contribution', 'Thiếu contribution'),
      ...missingCount(data.characters, 'description', 'Thiếu description'),
    ], <ItemGrid items={data.characters || []} renderItem={renderCharacterItem} />),
    section('timeline', 'Diễn biến', `${data.timeline?.length || 0} mốc`, [
      [data.timeline?.length, 'Chưa có mốc diễn biến'],
      ...missingCount(data.timeline, 'description', 'Thiếu description'),
      ...missingCount(data.timeline, 'keyPoints', 'Thiếu key points'),
    ], <><SectionBeatPreview beat={risingBeat} /><ItemGrid items={data.timeline || []} renderItem={renderTimelineItem} /></>),
    section('climax', 'Cao trào', data.climaxScene?.title ? 'có cao trào' : 'chưa có', [
      [sectionText(climaxBeat) || data.climaxScene?.description || data.climaxScene?.summary, 'Thiếu diễn giải cao trào'],
      [data.climaxScene?.title, 'Thiếu title cao trào'],
    ], <><SectionBeatPreview beat={climaxBeat} /><FieldList fields={[['Scene title', data.climaxScene?.title], ['Summary', data.climaxScene?.summary], ['Description', data.climaxScene?.description], ['Quote', data.climaxScene?.quote]]} /></>),
    section('phases', '4 giai đoạn then chốt', `${phases.length} giai đoạn`, [
      [phases.length, 'Chưa có giai đoạn cao trào'], ...missingCount(phases, 'description', 'Thiếu description'),
    ], <ItemGrid items={phases} renderItem={renderPhaseItem} />),
    section('map', 'Bản đồ chiến thuật', `${hotspots.length} điểm`, [
      [hotspots.length, 'Bản đồ chiến thuật chưa có points/hotspots'],
    ], <><FieldList fields={[['Mô tả bản đồ', data.climaxScene?.mapDescription || data.tacticalMap?.description], ['Image prompt', data.tacticalMap?.imagePrompt]]} /><ItemGrid items={hotspots} renderItem={renderHotspotItem} /></>),
    section('aftermath', 'Hệ quả và bài học', `${(data.aftermath?.consequences || []).length} hệ quả · ${(data.aftermath?.lessons || []).length} bài học`, [
      [sectionText(fallingBeat) || data.aftermath?.description, 'Thiếu nội dung hệ quả'],
      [sectionText(takeawayBeat) || data.takeaway?.lesson || data.aftermath?.historicalMeaning, 'Thiếu bài học / ý nghĩa lịch sử'],
    ], <><SectionBeatPreview beat={fallingBeat} /><SectionBeatPreview beat={takeawayBeat} /><FieldList fields={[['Aftermath description', data.aftermath?.description], ['Consequences', listText(data.aftermath?.consequences)], ['Lessons', listText(data.aftermath?.lessons)], ['Historical meaning', data.aftermath?.historicalMeaning], ['Takeaway happened', data.takeaway?.happened], ['Takeaway whyItMatters', data.takeaway?.whyItMatters], ['Takeaway lesson', data.takeaway?.lesson]]} /></>),
    section('quiz', 'Quiz / Kiểm tra hiểu bài', `${data.quiz?.length || 0} câu hỏi`, [
      [(data.quiz?.length || 0) >= 3, 'Quiz chưa đủ 3 câu hỏi'],
    ], <ItemGrid items={data.quiz || []} renderItem={renderQuizItem} />),
    section('image-prompts', 'Image prompts / Hình ảnh', `${assets.length} asset prompt`, [
      [assets.length, 'Chưa có danh sách asset prompt trong draft'],
    ], <ItemGrid items={assets} renderItem={renderAssetItem} />),
  ];
}

function section(id, title, count, checks, content) {
  return { id, title, count, warnings: checks.filter(([ok]) => !hasContent(ok)).map(([, warning]) => warning), content };
}

const FieldList = ({ fields }) => (
  <dl className="admin-draft-fields">
    {fields.filter(([, value]) => hasContent(value)).map(([label, value]) => (
      <div key={label}><dt>{label}</dt><dd>{formatValue(value)}</dd></div>
    ))}
  </dl>
);

const SectionBeatPreview = ({ beat, extraFields = [] }) => {
  if (!beat && extraFields.every(([, value]) => !hasContent(value))) return null;
  return (
    <div className="admin-draft-item">
      {beat && <h4>{beat.title || beat.type}</h4>}
      {beat && <FieldList fields={(beat.blocks || []).map((block, index) => [`Block ${index + 1} · ${block.type}`, block.body || block.text || block.quote || listText(block.items)])} />}
      <FieldList fields={extraFields} />
    </div>
  );
};

const ItemGrid = ({ items, renderItem }) => (
  <div className="admin-draft-items">
    {items.length > 0 ? items.map((item, index) => renderItem(item, index)) : <p className="admin-note">Chưa có dữ liệu.</p>}
  </div>
);

function renderCharacterItem(character, index) {
  return <article className="admin-draft-item" key={character.id || index}><h4>{index + 1}. {character.name || 'Chưa đặt tên'}</h4><FieldList fields={[['Phe', character.side || character.faction], ['Vai trò', character.role], ['Đặc điểm', listText(character.traits || character.trait)], ['Contribution', character.contribution], ['Description', character.description || character.bio], ['Image prompt', character.imagePrompt], ['Image URL', character.imageUrl || character.portrait]]} /></article>;
}

function renderTimelineItem(item, index) {
  return <article className="admin-draft-item" key={item.id || index}><h4>{String(item.order || index + 1).padStart(2, '0')} · {item.title}</h4><FieldList fields={[['Thời gian', item.date || item.time || [item.day, item.month, item.year].filter(Boolean).join('/')], ['Summary', item.summary], ['Description', item.description || item.longDescription || item.detail], ['Key points', listText(item.keyPoints || item.points || item.facts)], ['Image prompt', item.imagePrompt], ['Image URL', item.imageUrl || item.image]]} /></article>;
}

function renderPhaseItem(phase, index) {
  return <article className="admin-draft-item" key={phase.id || index}><h4>{index + 1}. {phase.label || phase.title}</h4><FieldList fields={[['Summary', phase.summary], ['Description', phase.description], ['Chi tiết quan trọng', phase.keyDetail || phase.importantDetail], ['Image prompt', phase.imagePrompt]]} /></article>;
}

function renderHotspotItem(point, index) {
  return <article className="admin-draft-item" key={point.id || index}><h4>{point.label || point.name || `Điểm ${index + 1}`}</h4><FieldList fields={[['Vị trí', point.position ? `x:${point.position.x}, y:${point.position.y}` : `x:${point.x}, y:${point.y}`], ['Description', point.description], ['Vai trò chiến thuật', point.tacticalRole || point.role]]} /></article>;
}

function renderQuizItem(question, index) {
  return <article className="admin-draft-item" key={question.id || index}><h4>{index + 1}. {question.question}</h4><FieldList fields={[['Options', listText(question.options)], ['Correct index', String(question.correct ?? '')], ['Explanation', question.explanation]]} /></article>;
}

function renderAssetItem(asset, index) {
  return <article className="admin-draft-item" key={asset.slot || asset.slotKey || index}><h4>{asset.slot || asset.slotKey || `Asset ${index + 1}`}</h4><FieldList fields={[['Prompt', asset.prompt], ['URL', asset.publicUrl || asset.imageUrl], ['Status', asset.status]]} /></article>;
}

function updateEventData(payload, patch) {
  const eventData = { ...(payload.eventData || {}), ...patch };
  return { ...payload, title: patch.title ?? payload.title, eventData };
}

function updateBeat(payload, index, key, value) {
  const eventData = clone(payload.eventData || {});
  const story = { ...(eventData.story || {}) };
  const beats = [...(story.beats || [])];
  const beat = { ...(beats[index] || {}) };
  if (key === 'title') {
    beat.title = value;
  } else {
    const blocks = [...(beat.blocks || [])];
    const first = { type: 'text', ...(blocks[0] || {}), body: value };
    blocks[0] = first;
    beat.blocks = blocks;
  }
  beats[index] = beat;
  story.beats = beats;
  eventData.story = story;
  return { ...payload, eventData };
}

function findBeat(data, type) {
  return (data.story?.beats || []).find((beat) => beat.type === type);
}

function sectionText(beat) {
  return (beat?.blocks || []).map((block) => block.body || block.text || block.quote || listText(block.items)).filter(Boolean).join('\n\n');
}

function missingCount(items = [], field, label) {
  const count = items.filter((item) => !hasContent(item?.[field])).length;
  return count ? [[false, `${label} cho ${count}/${items.length} mục`]] : [];
}

function listText(value) {
  if (!Array.isArray(value)) return value || '';
  return value.map((item) => (typeof item === 'string' ? item : item.value || item.label || item.title)).filter(Boolean).join('\n');
}

function formatValue(value) {
  return Array.isArray(value) ? listText(value) : String(value || '');
}

function hasContent(value) {
  if (Array.isArray(value)) return value.length > 0;
  return Boolean(String(value ?? '').trim());
}

function clone(value) {
  return value ? JSON.parse(JSON.stringify(value)) : null;
}

export default AiDraftPanel;
