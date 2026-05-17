import React, { useEffect, useState } from 'react';

const IconSave = () => (
  <svg aria-hidden="true" width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
    <path d="M19 21H5a2 2 0 01-2-2V5a2 2 0 012-2h11l5 5v11a2 2 0 01-2 2z"/><polyline points="17 21 17 13 7 13 7 21"/><polyline points="7 3 7 8 15 8"/>
  </svg>
);

export const EventMetaForm = ({ event, options, readOnly = false, onSave }) => {
  const [draft, setDraft] = useState(() => toForm(event));

  useEffect(() => {
    setDraft(toForm(event));
  }, [event?.id]);

  const update = (key, value) => setDraft((current) => ({ ...current, [key]: value }));

  const submit = (submitEvent) => {
    submitEvent.preventDefault();
    if (readOnly) return;
    const era = options?.eras?.find((item) => item.id === draft.eraId);
    onSave({
      ...draft,
      eraSlug: era?.slug || draft.eraSlug,
      year: Number(draft.year) || 0,
      gradeTags: splitList(draft.gradeTags),
      actors: splitList(draft.actors),
      relatedEventSlugs: splitList(draft.relatedEventSlugs),
    });
  };

  return (
    <form className="event-meta-form" onSubmit={submit}>
      <div className="admin-card__header">
        <div className="admin-card__icon">
          <svg aria-hidden="true" width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
            <circle cx="12" cy="12" r="10"/><line x1="12" y1="16" x2="12" y2="12"/><line x1="12" y1="8" x2="12.01" y2="8"/>
          </svg>
        </div>
        <h2>Thông tin sự kiện</h2>
      </div>
      {readOnly && <p className="admin-note">Sự kiện đã công bố hoặc lưu trữ. Hãy tạo bản nháp chỉnh sửa nếu cần cập nhật.</p>}
      <label>Tiêu đề <span aria-hidden="true" style={{ color: 'var(--gold)' }}>*</span>
        <input
          autoComplete="off"
          name="title"
          readOnly={readOnly}
          placeholder="Ví dụ: Trận Bạch Đằng…"
          value={draft.title}
          onChange={(e) => update('title', e.target.value)}
        />
      </label>
      <label>Đường dẫn (slug)
        <input
          autoComplete="off"
          name="slug"
          readOnly={readOnly}
          spellCheck={false}
          placeholder="tran-bach-dang…"
          value={draft.slug}
          onChange={(e) => update('slug', e.target.value)}
        />
      </label>
      <div className="meta-field-grid">
        <label>Thời kỳ lịch sử
          <select disabled={readOnly} name="eraId" value={draft.eraId} onChange={(e) => update('eraId', e.target.value)}>
            {(options?.eras || []).map((era) => <option key={era.id} value={era.id}>{era.name}</option>)}
          </select>
        </label>
        <label>Năm xảy ra
          <input
            autoComplete="off"
            name="year"
            type="number"
            inputMode="numeric"
            readOnly={readOnly}
            placeholder="Ví dụ: 938…"
            value={draft.year}
            onChange={(e) => update('year', e.target.value)}
          />
        </label>
      </div>
      <div className="meta-field-grid">
        <label>Loại sự kiện
          <select disabled={readOnly} name="type" value={draft.type} onChange={(e) => update('type', e.target.value)}>
            {(options?.eventTypes || ['other']).map((type) => <option key={type} value={type}>{type}</option>)}
          </select>
        </label>
        <label>Mẫu trang
          <select disabled={readOnly} name="templateType" value={draft.templateType} onChange={(e) => update('templateType', e.target.value)}>
            {(options?.templateTypes || ['universal']).map((type) => <option key={type} value={type}>{type}</option>)}
          </select>
        </label>
      </div>
      <div className="meta-field-grid">
        <label>Địa điểm
          <input
            autoComplete="off"
            name="location"
            readOnly={readOnly}
            placeholder="Ví dụ: Sông Bạch Đằng…"
            value={draft.location}
            onChange={(e) => update('location', e.target.value)}
          />
        </label>
        <label>Đối thủ / Kẻ thù
          <input
            autoComplete="off"
            name="opponent"
            readOnly={readOnly}
            placeholder="Ví dụ: Nam Hán…"
            value={draft.opponent}
            onChange={(e) => update('opponent', e.target.value)}
          />
        </label>
      </div>

      <label>Kết quả
        <input
          autoComplete="off"
          name="result"
          readOnly={readOnly}
          placeholder="Ví dụ: Thắng lợi…"
          value={draft.result}
          onChange={(e) => update('result', e.target.value)}
        />
      </label>
      <label>Khối lớp (ngăn bằng dấu phẩy)
        <input
          autoComplete="off"
          name="gradeTags"
          readOnly={readOnly}
          placeholder="Ví dụ: lop-6, lop-7…"
          value={draft.gradeTags}
          onChange={(e) => update('gradeTags', e.target.value)}
        />
      </label>
      <label>Nhân vật (ngăn bằng dấu phẩy)
        <input
          autoComplete="off"
          name="actors"
          readOnly={readOnly}
          placeholder="Ví dụ: Ngô Quyền, Dương Đình Nghệ…"
          value={draft.actors}
          onChange={(e) => update('actors', e.target.value)}
        />
      </label>
      <label>Sự kiện liên quan (slug, ngăn bằng dấu phẩy)
        <input
          autoComplete="off"
          name="relatedEventSlugs"
          spellCheck={false}
          readOnly={readOnly}
          placeholder="Ví dụ: nha-nuoc-ngo…"
          value={draft.relatedEventSlugs}
          onChange={(e) => update('relatedEventSlugs', e.target.value)}
        />
      </label>
      <label>Trích đoạn ngắn
        <textarea
          autoComplete="off"
          name="excerpt"
          readOnly={readOnly}
          placeholder="Mô tả ngắn về sự kiện…"
          value={draft.excerpt}
          onChange={(e) => update('excerpt', e.target.value)}
        />
      </label>
      <label>Tóm tắt
        <textarea
          autoComplete="off"
          name="summary"
          readOnly={readOnly}
          placeholder="Tóm tắt nội dung sự kiện…"
          value={draft.summary}
          onChange={(e) => update('summary', e.target.value)}
        />
      </label>
      <button className="admin-btn admin-btn--primary" disabled={readOnly} type="submit">
        <IconSave />
        Lưu thông tin
      </button>
    </form>
  );
};

function toForm(event = {}) {
  return {
    title: event.title ?? '',
    slug: event.slug ?? '',
    eraId: event.era_id ?? event.eraId ?? '',
    eraSlug: event.era_slug ?? event.eraSlug ?? '',
    year: event.year ?? 0,
    type: event.type ?? 'other',
    templateType: event.template_type ?? event.templateType ?? 'universal',
    location: event.location ?? '',
    opponent: event.opponent ?? '',
    result: event.result ?? '',
    gradeTags: (event.grade_tags ?? event.gradeTags ?? []).join(', '),
    actors: (event.actors ?? []).join(', '),
    relatedEventSlugs: (event.related_event_slugs ?? event.relatedEventSlugs ?? []).join(', '),
    excerpt: event.excerpt ?? '',
    summary: event.summary ?? '',
  };
}

function splitList(value) {
  return String(value || '').split(',').map((item) => item.trim()).filter(Boolean);
}

export default EventMetaForm;
