import React, { useMemo, useState } from 'react';
import { slugify } from '../../lib/slugify.js';

const statuses = ['all', 'draft', 'review', 'published', 'archived'];
const statusLabels = { all: 'Tất cả', draft: 'Bản nháp', review: 'Chờ duyệt', published: 'Đã đăng', archived: 'Lưu trữ' };

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

export const AdminWorkQueue = ({ events, options, selectedId, onSelect, onCreate }) => {
  const firstEra = options?.eras?.[0];
  const [form, setForm] = useState({
    title: '',
    slug: '',
    eraId: firstEra?.id || '',
    year: '',
    type: 'other',
    templateType: 'universal',
  });
  const [filter, setFilter] = useState('all');
  const [query, setQuery] = useState('');
  const [showCreate, setShowCreate] = useState(false);

  const rows = useMemo(() => events.filter((item) => {
    const matchesStatus = filter === 'all' || item.status === filter;
    const text = `${item.title} ${item.slug}`.toLowerCase();
    return matchesStatus && text.includes(query.toLowerCase().trim());
  }), [events, filter, query]);

  const update = (key, value) => {
    setForm((current) => ({
      ...current,
      [key]: value,
      slug: key === 'title' && !current.slug ? slugify(value) : current.slug,
    }));
  };

  const submit = (event) => {
    event.preventDefault();
    const era = options?.eras?.find((item) => item.id === form.eraId) || firstEra;
    if (!form.title.trim() || !form.slug.trim() || !era) return;
    onCreate({
      title: form.title.trim(),
      slug: slugify(form.slug),
      summary: form.title.trim(),
      eraId: era.id,
      eraSlug: era.slug,
      year: Number(form.year) || 0,
      type: form.type || 'other',
      templateType: form.templateType || 'universal',
    });
    setForm({ title: '', slug: '', eraId: era.id, year: '', type: form.type, templateType: form.templateType });
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
      </div>

      <button
        className="admin-btn admin-btn--primary"
        aria-expanded={showCreate}
        onClick={() => setShowCreate((v) => !v)}
        type="button"
      >
        <IconPlus />
        {showCreate ? 'Ẩn form tạo mới' : 'Tạo sự kiện mới'}
      </button>

      {showCreate && (
        <form className="admin-stack-form" onSubmit={submit}>
          <label>Tên sự kiện <span aria-hidden="true" style={{ color: 'var(--gold)' }}>*</span>
            <input
              autoComplete="off"
              name="title"
              placeholder="Ví dụ: Trận Bạch Đằng 938…"
              value={form.title}
              onChange={(e) => update('title', e.target.value)}
            />
          </label>
          <label>Đường dẫn (slug) <span aria-hidden="true" style={{ color: 'var(--gold)' }}>*</span>
            <input
              autoComplete="off"
              name="slug"
              spellCheck={false}
              placeholder="tran-bach-dang-938…"
              value={form.slug}
              onChange={(e) => update('slug', e.target.value)}
            />
          </label>
          <label>Thời kỳ lịch sử
            <select name="eraId" value={form.eraId || firstEra?.id || ''} onChange={(e) => update('eraId', e.target.value)}>
              {(options?.eras || []).map((era) => <option key={era.id} value={era.id}>{era.name}</option>)}
            </select>
          </label>
          <label>Năm xảy ra
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
          <label>Loại sự kiện
            <select name="type" value={form.type} onChange={(e) => update('type', e.target.value)}>
              {(options?.eventTypes || ['other']).map((type) => <option key={type} value={type}>{type}</option>)}
            </select>
          </label>
          <label>Mẫu trang
            <select name="templateType" value={form.templateType} onChange={(e) => update('templateType', e.target.value)}>
              {(options?.templateTypes || ['universal']).map((t) => <option key={t} value={t}>{t}</option>)}
            </select>
          </label>
          <button
            className="admin-btn admin-btn--primary"
            disabled={!form.title.trim() || !form.slug.trim() || !firstEra}
            type="submit"
          >
            <IconPlus />
            Tạo bản nháp
          </button>
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
          </button>
        ))}
      </div>

      <label>
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
        {rows.map((item) => (
          <button
            aria-selected={item.id === selectedId}
            className={item.id === selectedId ? 'is-active' : ''}
            key={item.id}
            onClick={() => onSelect(item.id)}
            role="option"
            type="button"
          >
            <strong>{item.title}</strong>
            <span className={`admin-status admin-status--${item.status}`}>{statusLabels[item.status] || item.status}</span>
          </button>
        ))}
        {!rows.length && (
          <div className="admin-empty">
            <p>Không có sự kiện phù hợp.</p>
          </div>
        )}
      </div>
    </section>
  );
};

export default AdminWorkQueue;
