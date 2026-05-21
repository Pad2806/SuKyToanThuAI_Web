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

const FieldBadge = ({ type = 'optional', children }) => (
  <span className={`admin-field-badge admin-field-badge--${type}`}>{children || (type === 'required' ? 'Bắt buộc' : 'Không bắt buộc')}</span>
);

const FieldTitle = ({ children, type = 'optional', badge }) => (
  <span className="admin-field-title">
    <span>{children}</span>
    <FieldBadge type={type}>{badge}</FieldBadge>
  </span>
);

const extractionLabels = {
  gemini_ocr: 'Đọc PDF scan bằng Gemini OCR',
  manual_text: 'Nội dung nhập thủ công',
  pdf_text: 'Đọc text trực tiếp từ PDF',
  txt: 'Tệp TXT',
};

export const SourceImportPanel = ({ busy = false, disabled = false, eventId, sources = [], onImport }) => {
  const [form, setForm] = useState({ title: '', text: '', publisher: '', sourceUrl: '', editionYear: '' });
  const [file, setFile] = useState(null);
  const canSubmit = !busy && !disabled && form.title.trim() && (form.text.trim() || file);
  const isPdf = file?.name?.toLowerCase().endsWith('.pdf') || file?.type === 'application/pdf';

  const update = (key, value) => setForm((current) => ({ ...current, [key]: value }));

  const submit = async (event) => {
    event.preventDefault();
    if (!canSubmit) return;
    const formElement = event.currentTarget;
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
    formElement.reset();
  };

  return (
    <section className="admin-card">
      <div className="admin-card__header">
        <div className="admin-card__icon"><IconBook /></div>
        <h2>Nguồn chính thống</h2>
        {sources.length > 0 && <span className="admin-status admin-status--published">{sources.length} nguồn</span>}
      </div>
      {disabled && <p className="admin-note">Sự kiện không còn ở trạng thái chỉnh sửa.</p>}
      <p className="admin-note">Cần tên nguồn và ít nhất một trong hai phần: nội dung trích dẫn hoặc tệp TXT/PDF.</p>
      <p className="admin-note">Có thể bỏ trống Nội dung trích dẫn khi đã chọn tệp. PDF scan cần Gemini OCR qua Vertex AI; nếu billing chưa bật, hãy dán nội dung trích dẫn hoặc dùng TXT/PDF có text.</p>

      <form className="admin-stack-form" onSubmit={submit}>
        <label>
          <FieldTitle type="required">Tên tài liệu / nguồn</FieldTitle>
          <input autoComplete="off" disabled={disabled || busy} name="title" placeholder="Ví dụ: Đại Việt sử ký toàn thư" value={form.title} onChange={(e) => update('title', e.target.value)} />
        </label>
        <label>
          <FieldTitle type="conditional" badge="Điền 1 trong 2">Nội dung trích dẫn</FieldTitle>
          <textarea autoComplete="off" disabled={disabled || busy} name="text" placeholder="Dán nội dung trích từ tài liệu nếu không tải tệp." value={form.text} onChange={(e) => update('text', e.target.value)} />
        </label>
        <label>
          <FieldTitle type="conditional" badge="Điền 1 trong 2">Tệp TXT / PDF</FieldTitle>
          <div className="admin-file-picker">
            <div className="admin-btn" style={{ pointerEvents: 'none' }}><IconUpload /> Chọn tệp</div>
            <span>{file ? `${file.name} · ${formatFileSize(file.size)}` : 'Chưa chọn tệp'}</span>
          </div>
          {isPdf && (
            <span className="admin-field-hint">
              {busy ? 'Đang đọc PDF; bản scan sẽ dùng Gemini OCR nếu Vertex AI sẵn sàng.' : 'PDF có text sẽ đọc trực tiếp; PDF scan fallback sang Gemini OCR, hoặc dùng nội dung trích dẫn nếu OCR không khả dụng.'}
            </span>
          )}
          <input accept=".txt,.pdf,text/plain,application/pdf" disabled={disabled || busy} name="file" onChange={(e) => setFile(e.target.files?.[0] ?? null)} type="file" style={{ display: 'none' }} />
        </label>
        <label>
          <FieldTitle>Nhà xuất bản / đơn vị</FieldTitle>
          <input autoComplete="off" disabled={disabled || busy} name="publisher" placeholder="Ví dụ: NXB Khoa học Xã hội" value={form.publisher} onChange={(e) => update('publisher', e.target.value)} />
        </label>
        <label>
          <FieldTitle>Đường dẫn nguồn (URL)</FieldTitle>
          <input autoComplete="off" disabled={disabled || busy} name="sourceUrl" type="url" placeholder="https://..." value={form.sourceUrl} onChange={(e) => update('sourceUrl', e.target.value)} />
        </label>
        <label>
          <FieldTitle>Năm xuất bản</FieldTitle>
          <input autoComplete="off" disabled={disabled || busy} inputMode="numeric" name="editionYear" type="number" placeholder="Ví dụ: 2010" value={form.editionYear} onChange={(e) => update('editionYear', e.target.value)} />
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
              <IconCheck />
              <span className="admin-source-list__body">
                <span>{item.title} · <span className={`admin-status admin-status--${item.status}`}>{item.status}</span></span>
                <span className="admin-source-list__meta">{sourceMetadataLabel(item.metadata)}</span>
              </span>
            </li>
          ))}
        </ul>
      )}
    </section>
  );
};

function sourceMetadataLabel(metadata = {}) {
  const method = extractionLabels[metadata.extractionMethod] || metadata.extractionMethod || 'Nguồn đã nhập';
  const chunks = Number(metadata.chunkCount || 0);
  const pages = Number(metadata.pageCount || metadata.readablePageCount || 0);
  const parts = [method];
  if (chunks > 0) parts.push(`${chunks} đoạn nguồn`);
  if (pages > 0) parts.push(`${pages} trang`);
  return parts.join(' · ');
}

function formatFileSize(size = 0) {
  if (!size) return '0 KB';
  if (size < 1024 * 1024) return `${Math.ceil(size / 1024)} KB`;
  return `${(size / (1024 * 1024)).toFixed(1)} MB`;
}

export default SourceImportPanel;
