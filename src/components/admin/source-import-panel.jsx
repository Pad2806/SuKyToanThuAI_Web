import React, { useState } from 'react';

const IconUpload = () => (
  <svg aria-hidden="true" width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
    <path d="M21 15v4a2 2 0 01-2 2H5a2 2 0 01-2-2v-4"/><polyline points="17 8 12 3 7 8"/><line x1="12" y1="3" x2="12" y2="15"/>
  </svg>
);

const IconBook = () => (
  <svg aria-hidden="true" width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
    <path d="M4 19.5A2.5 2.5 0 016.5 17H20"/><path d="M6.5 2H20v20H6.5A2.5 2.5 0 014 19.5v-15A2.5 2.5 0 016.5 2z"/>
  </svg>
);

const IconCheck = () => (
  <svg aria-hidden="true" width="12" height="12" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="3" strokeLinecap="round" strokeLinejoin="round">
    <polyline points="20 6 9 17 4 12"/>
  </svg>
);

export const SourceImportPanel = ({ disabled = false, eventId, sources = [], onImport }) => {
  const [form, setForm] = useState({ title: '', text: '', publisher: '', sourceUrl: '', editionYear: '' });
  const [file, setFile] = useState(null);
  const canSubmit = !disabled && form.title.trim() && (form.text.trim() || file);

  const update = (key, value) => setForm((current) => ({ ...current, [key]: value }));

  const submit = async (event) => {
    event.preventDefault();
    if (!canSubmit) return;
    const data = new FormData();
    data.set('title', form.title.trim());
    if (form.text.trim()) data.set('text', form.text.trim());
    if (form.publisher.trim()) data.set('publisher', form.publisher.trim());
    if (form.sourceUrl.trim()) data.set('source_url', form.sourceUrl.trim());
    if (form.editionYear) data.set('edition_year', form.editionYear);
    if (file) data.set('file', file);
    await onImport(eventId, data);
    setForm({ title: '', text: '', publisher: '', sourceUrl: '', editionYear: '' });
    setFile(null);
    event.currentTarget.reset();
  };

  return (
    <section className="admin-card">
      <div className="admin-card__header">
        <div className="admin-card__icon"><IconBook /></div>
        <h2>Nguồn chính thống</h2>
        {sources.length > 0 && <span className="admin-status admin-status--published">{sources.length} nguồn</span>}
      </div>
      {disabled && <p className="admin-note">Sự kiện không còn ở trạng thái chỉnh sửa.</p>}
      <form className="admin-stack-form" onSubmit={submit}>
        <label>Tên tài liệu / nguồn <span aria-hidden="true" style={{ color: 'var(--gold)' }}>*</span>
          <input
            autoComplete="off"
            disabled={disabled}
            name="title"
            placeholder="Ví dụ: Đại Việt Sử Ký Toàn Thư…"
            value={form.title}
            onChange={(e) => update('title', e.target.value)}
          />
        </label>
        <label>Nội dung trích dẫn <span aria-hidden="true" style={{ color: 'var(--gold)' }}>*</span>
          <textarea
            autoComplete="off"
            disabled={disabled}
            name="text"
            placeholder="Dán nội dung trích từ tài liệu…"
            value={form.text}
            onChange={(e) => update('text', e.target.value)}
          />
        </label>
        <label>Tệp TXT / PDF
          <input
            accept=".txt,.pdf,text/plain,application/pdf"
            disabled={disabled}
            name="file"
            onChange={(e) => setFile(e.target.files?.[0] ?? null)}
            type="file"
          />
        </label>
        <label>Nhà xuất bản / đơn vị
          <input
            autoComplete="off"
            disabled={disabled}
            name="publisher"
            placeholder="Ví dụ: NXB Khoa Học Xã Hội…"
            value={form.publisher}
            onChange={(e) => update('publisher', e.target.value)}
          />
        </label>
        <label>Đường dẫn nguồn (URL)
          <input
            autoComplete="off"
            disabled={disabled}
            name="sourceUrl"
            type="url"
            placeholder="https://…"
            value={form.sourceUrl}
            onChange={(e) => update('sourceUrl', e.target.value)}
          />
        </label>
        <label>Năm xuất bản
          <input
            autoComplete="off"
            disabled={disabled}
            inputMode="numeric"
            name="editionYear"
            type="number"
            placeholder="Ví dụ: 2010…"
            value={form.editionYear}
            onChange={(e) => update('editionYear', e.target.value)}
          />
        </label>
        <button className="admin-btn admin-btn--primary" disabled={!canSubmit} type="submit">
          <IconUpload />
          Nhập nguồn
        </button>
      </form>
      {sources.length > 0 && (
        <ul className="admin-source-list">
          {sources.map((item) => (
            <li key={item.id}>
              <IconCheck /> {item.title} · <span className={`admin-status admin-status--${item.status}`}>{item.status}</span>
            </li>
          ))}
        </ul>
      )}
    </section>
  );
};

export default SourceImportPanel;
