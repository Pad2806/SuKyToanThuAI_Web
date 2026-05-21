import React, { useEffect, useMemo, useState } from 'react';
import { slugify } from '../../lib/slugify.js';

const statuses = ['all', 'draft', 'review', 'published', 'archived'];
const statusLabels = { all: 'Tất cả', draft: 'Bản nháp', review: 'Chờ duyệt', published: 'Đã đăng', archived: 'Lưu trữ' };
const statusIcons = {
  draft: 'M11 4H4a2 2 0 00-2 2v14a2 2 0 002 2h14a2 2 0 002-2v-7',
  review: 'M1 12s4-8 11-8 11 8 11 8-4 8-11 8-11-8-11-8z',
  published: 'M22 11.08V12a10 10 0 11-5.93-9.14',
  archived: 'M21 8v13H3V8M1 3h22v5H1zM10 12h4',
};
const EVENT_TYPE_ICONS = {
  battle: 'M14.5 10c-.83 0-1.5-.67-1.5-1.5v-5c0-.83.67-1.5 1.5-1.5s1.5.67 1.5 1.5v5c0 .83-.67 1.5-1.5 1.5zm-5 0C8.67 10 8 9.33 8 8.5v-5C8 2.67 8.67 2 9.5 2S11 2.67 11 3.5v5c0 .83-.67 1.5-1.5 1.5zm10 0c-.83 0-1.5-.67-1.5-1.5v-5c0-.83.67-1.5 1.5-1.5S21 2.67 21 3.5v5c0 .83-.67 1.5-1.5 1.5zM20 13c0-1.1-.9-2-2-2H6c-1.1 0-2 .9-2 2v7c0 1.1.9 2 2 2h12c1.1 0 2-.9 2-2v-7z',
  political: 'M12 2L2 7l10 5 10-5-10-5zM2 17l10 5 10-5M2 12l10 5 10-5',
  cultural: 'M12 22s8-4 8-10V5l-8-3-8 3v7c0 6 8 10 8 10z',
  diplomatic: 'M21 15a2 2 0 0 1-2 2H7l-4 4V5a2 2 0 0 1 2-2h14a2 2 0 0 1 2 2z',
  other: 'M12 22s8-4 8-10V5l-8-3-8 3v7c0 6 8 10 8 10z',
};
const EVENT_TYPE_LABELS = { other: 'Khác', battle: 'Trận đánh', political: 'Chính trị', cultural: 'Văn hóa', diplomatic: 'Ngoại giao' };

const eventLabel = (item) => {
  const label = item.title || item.name || item.slug;
  if (label) return String(label).trim();
  return `Sự kiện ${item.id || 'mới'}`;
};

const statusCount = (events, status) => {
  if (status === 'all') return events.length;
  return events.filter((item) => item.status === status).length;
};

const IconPlus = () => (
  <svg aria-hidden="true" width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
    <line x1="12" y1="5" x2="12" y2="19"/><line x1="5" y1="12" x2="19" y2="12"/>
  </svg>
);

const IconSearch = () => (
  <svg aria-hidden="true" width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
    <circle cx="11" cy="11" r="8"/><line x1="21" y1="21" x2="16.65" y2="16.65"/>
  </svg>
);

const IconChevronDown = () => (
  <svg aria-hidden="true" width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
    <polyline points="6 9 12 15 18 9"/>
  </svg>
);

const IconChevronUp = () => (
  <svg aria-hidden="true" width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
    <polyline points="18 15 12 9 6 15"/>
  </svg>
);

const IconInfo = () => (
  <svg aria-hidden="true" width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round">
    <circle cx="12" cy="12" r="10"/><line x1="12" y1="16" x2="12" y2="12"/><line x1="12" y1="8" x2="12.01" y2="8"/>
  </svg>
);

const FieldBadge = ({ type = 'optional', children }) => (
  <span className={`admin-field-badge admin-field-badge--${type}`}>{children || (type === 'required' ? 'Bắt buộc' : 'Không bắt buộc')}</span>
);

const FieldTitle = ({ children, required = false }) => (
  <span className="admin-field-title">
    <span>{children}</span>
    <FieldBadge type={required ? 'required' : 'optional'} />
  </span>
);

export const AdminWorkQueue = ({ events, options, selectedId, onSelect, onCreate }) => {
  const [form, setForm] = useState({
    title: '',
    slug: '',
    eraId: '',
    year: '',
    type: options?.eventTypes?.[0] || 'other',
    templateType: options?.templates?.[0]?.templateType || options?.templateTypes?.[0] || 'battle',
  });
  const [filter, setFilter] = useState('all');
  const [query, setQuery] = useState('');
  const [showCreate, setShowCreate] = useState(() => (
    events.length === 0 && Boolean(options?.templates?.length || options?.templateTypes?.length)
  ));
  const [slugEdited, setSlugEdited] = useState(false);

  /* Sync era default when options arrive for the first time */
  useEffect(() => {
    const firstEra = options?.eras?.[0];
    if (firstEra && !form.eraId) {
      setForm((current) => ({
        ...current,
        eraId: current.eraId || firstEra?.id || '',
      }));
    }
  }, [options]);

  const selectedEra = options?.eras?.find((item) => item.id === form.eraId) || options?.eras?.[0];
  const selectedTemplate = (options?.templates?.[0])
    || (options?.templateTypes?.[0] ? {
      templateType: options.templateTypes[0],
      name: 'Storytelling toàn màn hình',
      description: '',
      assetSlots: [],
      fieldGroups: [],
    } : null);
  const normalizedSlug = slugify(form.slug);
  const canCreate = form.title.trim().length >= 2 && normalizedSlug.length >= 2 && Boolean(selectedEra);

  const rows = useMemo(() => events.filter((item) => {
    const matchesStatus = filter === 'all' || item.status === filter;
    const text = `${eventLabel(item)} ${item.slug || ''} ${item.id || ''}`.toLowerCase();
    return matchesStatus && text.includes(query.toLowerCase().trim());
  }), [events, filter, query]);

  const update = (key, value) => {
    setForm((current) => ({ ...current, [key]: value }));
  };

  const handleTitleChange = (e) => {
    const val = e.target.value;
    setForm((current) => ({
      ...current,
      title: val,
      slug: slugEdited ? current.slug : slugify(val),
    }));
  };

  const handleSlugChange = (e) => {
    setSlugEdited(true);
    setForm((current) => ({ ...current, slug: e.target.value }));
  };

  const resetForm = () => {
    setForm({
      title: '',
      slug: '',
      eraId: selectedEra?.id || '',
      year: '',
      type: options?.eventTypes?.[0] || 'other',
      templateType: selectedTemplate?.templateType || 'battle',
    });
    setSlugEdited(false);
  };

  const submit = (event) => {
    event.preventDefault();
    const era = selectedEra;
    const title = form.title.trim();
    const slug = slugify(form.slug);
    if (title.length < 2 || slug.length < 2 || !era) return;
    onCreate({
      title,
      slug,
      summary: title,
      eraId: era.id,
      eraSlug: era.slug,
      year: Number(form.year) || 0,
      type: selectedTemplate?.eventType || form.type || 'other',
      templateType: selectedTemplate?.templateType || form.templateType || 'battle',
    });
    resetForm();
    setShowCreate(false);
  };

  return (
    <section className="admin-card admin-queue">
      <div className="admin-card__header">
        <div className="admin-card__icon">
          <svg aria-hidden="true" width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
            <path d="M14 2H6a2 2 0 00-2 2v16a2 2 0 002 2h12a2 2 0 002-2V8z"/><polyline points="14 2 14 8 20 8"/><line x1="16" y1="13" x2="8" y2="13"/><line x1="16" y1="17" x2="8" y2="17"/><polyline points="10 9 9 9 8 9"/>
          </svg>
        </div>
        <h2>Hàng đợi sự kiện</h2>
        <span className="admin-queue__count">{events.length}</span>
      </div>

      <button
        className={`admin-btn admin-btn--primary admin-queue__create-btn ${showCreate ? 'is-expanded' : ''}`}
        aria-expanded={showCreate}
        onClick={() => setShowCreate((v) => !v)}
        type="button"
      >
        <IconPlus />
        {showCreate ? 'Ẩn form tạo mới' : 'Tạo sự kiện mới'}
        {showCreate ? <IconChevronUp /> : <IconChevronDown />}
      </button>



      {showCreate && (
        <form className="admin-create-form" onSubmit={submit}>
          <div className="admin-create-form__header">
            <svg aria-hidden="true" width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
              <path d="M12 20h9M16.5 3.5a2.12 2.12 0 013 3L7 19l-4 1 1-4L16.5 3.5z"/>
            </svg>
            <span>Tạo sự kiện mới</span>
          </div>

          <label>
            <FieldTitle required>Tên sự kiện</FieldTitle>
            <input
              autoComplete="off"
              name="title"
              placeholder="Ví dụ: Trận Bạch Đằng 938…"
              value={form.title}
              onChange={handleTitleChange}
            />
            {form.title.trim().length > 0 && form.title.trim().length < 2 && (
              <span className="admin-field-hint admin-field-hint--warn">Tên cần ít nhất 2 ký tự</span>
            )}
          </label>

          <label>
            <FieldTitle required>Đường dẫn (slug)</FieldTitle>
            <input
              autoComplete="off"
              name="slug"
              spellCheck={false}
              placeholder="tự động tạo từ tên…"
              value={form.slug}
              onChange={handleSlugChange}
            />
            <span className="admin-field-hint">
              <IconInfo /> {slugEdited ? 'Đã chỉnh sửa thủ công' : 'Tự động tạo từ tên sự kiện'}
            </span>
          </label>

          <label>
            <FieldTitle required>Thời kỳ lịch sử</FieldTitle>
            <select name="eraId" value={form.eraId || ''} onChange={(e) => update('eraId', e.target.value)}>
              {!form.eraId && <option value="" disabled>— Chọn thời kỳ —</option>}
              {(options?.eras || []).map((era) => <option key={era.id} value={era.id}>{era.name}</option>)}
            </select>
          </label>


          <div className="admin-create-form__row">
            <label>
              <FieldTitle>Năm xảy ra</FieldTitle>
              <input
                autoComplete="off"
                name="year"
                type="number"
                inputMode="numeric"
                placeholder="Ví dụ: 938…"
                value={form.year}
                onChange={(e) => update('year', e.target.value)}
              />
            </label>
            <label>
              <FieldTitle>Loại sự kiện</FieldTitle>
              <select name="type" value={form.type} onChange={(e) => update('type', e.target.value)}>
                {(options?.eventTypes || ['other']).map((type) => <option key={type} value={type}>{EVENT_TYPE_LABELS[type] || type}</option>)}
              </select>
            </label>
          </div>



          <div className="admin-create-form__actions">
            <button
              className="admin-btn"
              type="button"
              onClick={() => { resetForm(); setShowCreate(false); }}
            >
              Hủy
            </button>
            <button
              className="admin-btn admin-btn--primary admin-create-form__submit"
              disabled={!canCreate}
              type="submit"
              title={!canCreate ? 'Vui lòng điền đầy đủ thông tin bắt buộc (tên + đường dẫn)' : 'Tạo bản nháp sự kiện mới'}
            >
              <IconPlus />
              Tạo bản nháp
            </button>
          </div>

          {!canCreate && form.title.trim().length >= 2 && (
            <p className="admin-field-hint admin-field-hint--warn" style={{ margin: 0 }}>
              {!selectedEra ? '⚠ Chưa chọn thời kỳ lịch sử' : normalizedSlug.length < 2 ? '⚠ Đường dẫn quá ngắn' : ''}
            </p>
          )}
        </form>
      )}

      <hr className="admin-section-divider" />

      <div className="admin-filter-row" role="group" aria-label="Lọc theo trạng thái">
        {statuses.map((status) => (
          <button
            aria-pressed={filter === status}
            className={filter === status ? 'is-active' : ''}
            key={status}
            onClick={() => setFilter(status)}
            type="button"
          >
            {statusLabels[status] || status}
            <span className="admin-filter-count">{statusCount(events, status)}</span>
          </button>
        ))}
      </div>

      <label className="admin-search-label">
        <span style={{ display: 'flex', alignItems: 'center', gap: '6px' }}>
          <IconSearch />
          Tìm sự kiện
        </span>
        <input
          autoComplete="off"
          name="admin-search"
          placeholder="Nhập tên hoặc đường dẫn…"
          value={query}
          onChange={(e) => setQuery(e.target.value)}
        />
      </label>

      <div className="admin-list" role="listbox" aria-label="Danh sách sự kiện">
        {rows.map((item) => {
          const era = options?.eras?.find((e) => e.id === item.eraId);
          const typeIcon = EVENT_TYPE_ICONS[item.type] || EVENT_TYPE_ICONS.other;
          const typeLabel = EVENT_TYPE_LABELS[item.type] || item.type || 'Khác';
          return (
            <button
              aria-selected={item.id === selectedId}
              className={`admin-list__item${item.id === selectedId ? ' is-active' : ''} admin-list__item--${item.status || 'draft'}`}
              key={item.id}
              onClick={() => onSelect(item.id)}
              role="option"
              type="button"
            >
              <span className="admin-list__item-accent" aria-hidden="true" />
              <div className="admin-list__event-info">
                <strong className="admin-list__event-title">{eventLabel(item)}</strong>
                <span className="admin-list__event-meta">
                  {era && <span className="admin-list__event-era">{era.name}</span>}
                  {era && item.year !== 0 && <span className="admin-list__event-sep" aria-hidden="true">·</span>}
                  {item.year !== 0 && <span className="admin-list__event-year">{item.year < 0 ? `${Math.abs(item.year)} TCN` : `Năm ${item.year}`}</span>}
                </span>
              </div>
              <span className={`admin-list__event-badge admin-status admin-status--${item.status || 'draft'}`}>
                {statusIcons[item.status] && (
                  <svg aria-hidden="true" width="9" height="9" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round">
                    <path d={statusIcons[item.status]}/>
                  </svg>
                )}
                {statusLabels[item.status] || item.status}
              </span>
            </button>
          );
        })}
        {!rows.length && (
          <div className="admin-empty">
            <svg aria-hidden="true" width="32" height="32" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round">
              <circle cx="11" cy="11" r="8"/><line x1="21" y1="21" x2="16.65" y2="16.65"/>
            </svg>
            <p>Không có sự kiện phù hợp.</p>
          </div>
        )}
      </div>
    </section>
  );
};

export default AdminWorkQueue;
