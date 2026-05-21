import React, { useEffect, useMemo, useState } from 'react';
import { slugify } from '../../lib/slugify.js';
import { findTemplateDefinition, getTemplateDefinitions, templateAssetCount, templateDisplayName, templateFieldRows } from '../../lib/admin-template-utils.js';

const EVENT_TYPE_LABELS = { other: 'Khác', battle: 'Trận đánh', political: 'Chính trị', cultural: 'Văn hóa', diplomatic: 'Ngoại giao' };
const TEMPLATE_LABELS = { universal: 'Phổ quát', battle: 'Trận đánh', timeline: 'Dòng thời gian', biography: 'Tiểu sử' };

const IconSave = () => (
  <svg aria-hidden="true" width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
    <path d="M19 21H5a2 2 0 01-2-2V5a2 2 0 012-2h11l5 5v11a2 2 0 01-2 2z"/><polyline points="17 21 17 13 7 13 7 21"/><polyline points="7 3 7 8 15 8"/>
  </svg>
);

const IconInfo = () => (
  <svg aria-hidden="true" width="12" height="12" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round">
    <circle cx="12" cy="12" r="10"/><line x1="12" y1="16" x2="12" y2="12"/><line x1="12" y1="8" x2="12.01" y2="8"/>
  </svg>
);

const FieldBadge = ({ type = 'optional', children }) => (
  <span className={`admin-field-badge admin-field-badge--${type}`}>{children || (type === 'required' ? 'Bắt buộc' : 'Không bắt buộc')}</span>
);

const Field = ({ label, required = false, hint, children }) => (
  <label>
    <span className="admin-field-title">
      <span>{label}</span>
      <FieldBadge type={required ? 'required' : 'optional'} />
    </span>
    {children}
    {hint && <span className="admin-field-hint"><IconInfo /> {hint}</span>}
  </label>
);

export const EventMetaForm = ({ event, options, lesson, readOnly = false, onSave, onAssignLesson }) => {
  const [draft, setDraft] = useState(() => toForm(event));
  const [slugEdited, setSlugEdited] = useState(false);
  const [saved, setSaved] = useState(false);

  /* ── Textbook assignment state ── */
  const [selectedGradeId, setSelectedGradeId] = useState('');
  const [selectedPartId, setSelectedPartId] = useState('');
  const [selectedLessonId, setSelectedLessonId] = useState('');
  const [lessonSaved, setLessonSaved] = useState(false);

  useEffect(() => {
    setDraft(toForm(event));
    setSlugEdited(Boolean(event?.slug));
  }, [event?.id]);

  /* Sync lesson state when detail loads */
  useEffect(() => {
    if (lesson) {
      setSelectedGradeId(lesson.gradeId || '');
      setSelectedPartId(lesson.partId || '');
      setSelectedLessonId(lesson.lessonId || '');
    } else {
      setSelectedGradeId('');
      setSelectedPartId('');
      setSelectedLessonId('');
    }
  }, [lesson, event?.id]);

  const update = (key, value) => {
    setSaved(false);
    if (key === 'slug') setSlugEdited(true);
    setDraft((current) => {
      const next = { ...current, [key]: value };
      if (key === 'title' && !slugEdited) next.slug = slugify(value);
      return next;
    });
  };

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
    setSaved(true);
    setTimeout(() => setSaved(false), 3000);
  };

  /* ── Textbook cascading data ── */
  const grades = useMemo(() => options?.grades || [], [options]);
  const selectedGrade = useMemo(() => grades.find((g) => g.id === selectedGradeId), [grades, selectedGradeId]);
  const parts = useMemo(() => selectedGrade?.parts || [], [selectedGrade]);
  const selectedPart = useMemo(() => parts.find((p) => p.id === selectedPartId), [parts, selectedPartId]);
  const lessons = useMemo(() => selectedPart?.lessons || [], [selectedPart]);

  const handleGradeChange = (gradeId) => {
    setSelectedGradeId(gradeId);
    setSelectedPartId('');
    setSelectedLessonId('');
  };

  const handlePartChange = (partId) => {
    setSelectedPartId(partId);
    setSelectedLessonId('');
  };

  const handleLessonChange = (lessonId) => {
    setSelectedLessonId(lessonId);
  };

  const saveLesson = () => {
    if (!onAssignLesson || readOnly) return;
    onAssignLesson(selectedLessonId || null);
    setLessonSaved(true);
    setTimeout(() => setLessonSaved(false), 3000);
  };

  const currentLessonChanged = (lesson?.lessonId || '') !== selectedLessonId;

  const hasChanges = JSON.stringify(toForm(event)) !== JSON.stringify(draft);
  const selectedTemplate = findTemplateDefinition(options, draft.templateType);
  const selectedTemplateFields = templateFieldRows(selectedTemplate);
  const slugHint = slugEdited ? 'Đang chỉnh thủ công. Xóa trống để tự tạo lại từ tiêu đề.' : 'Tự động tạo từ tiêu đề.';

  return (
    <form className="event-meta-form" onSubmit={submit}>
      <div className="admin-card__header">
        <div className="admin-card__icon"><IconInfo /></div>
        <h2>Thông tin sự kiện</h2>
        {hasChanges && !readOnly && <span className="admin-unsaved-badge">Chưa lưu</span>}
        {saved && <span className="admin-saved-badge">Đã lưu</span>}
      </div>
      {readOnly && <p className="admin-note">Sự kiện đã công bố hoặc lưu trữ. Hãy tạo bản nháp chỉnh sửa nếu cần cập nhật.</p>}

      {selectedTemplate && (
        <div className="admin-template-summary">
          <strong>{templateDisplayName(selectedTemplate)}</strong>
          {selectedTemplate.description && <p>{selectedTemplate.description}</p>}
          <span>{templateAssetCount(selectedTemplate)} ảnh nền tảng, số ảnh thực tế tăng theo nội dung</span>
          {selectedTemplateFields.length > 0 && (
            <ul className="admin-template-field-list" aria-label="Trường theo template">
              {selectedTemplateFields.map((field) => (
                <li key={field.key}>
                  <span>{field.label}</span>
                  <FieldBadge type={field.required ? 'required' : 'optional'} />
                </li>
              ))}
            </ul>
          )}
        </div>
      )}

      <fieldset className="event-meta-form__group">
        <legend>Thông tin cơ bản</legend>
        <Field label="Tiêu đề" required>
          <input autoComplete="off" name="title" readOnly={readOnly} placeholder="Ví dụ: Trận Bạch Đằng 938" value={draft.title} onChange={(e) => update('title', e.target.value)} />
        </Field>
        <Field label="Đường dẫn (slug)" required hint={slugHint}>
          <input autoComplete="off" name="slug" readOnly={readOnly} spellCheck={false} placeholder="tran-bach-dang-938" value={draft.slug} onChange={(e) => update('slug', e.target.value)} />
        </Field>
      </fieldset>

      <fieldset className="event-meta-form__group">
        <legend>Phân loại</legend>
        <div className="meta-field-grid">
          <Field label="Thời kỳ lịch sử" required>
            <select disabled={readOnly} name="eraId" value={draft.eraId} onChange={(e) => update('eraId', e.target.value)}>
              {!draft.eraId && <option value="">Chọn thời kỳ</option>}
              {(options?.eras || []).map((era) => <option key={era.id} value={era.id}>{era.name}</option>)}
            </select>
          </Field>
          <Field label="Năm xảy ra" required>
            <input autoComplete="off" name="year" type="number" inputMode="numeric" readOnly={readOnly} placeholder="Ví dụ: 938" value={draft.year} onChange={(e) => update('year', e.target.value)} />
          </Field>
          <Field label="Loại sự kiện" required>
            <select disabled={readOnly} name="type" value={draft.type} onChange={(e) => update('type', e.target.value)}>
              {(options?.eventTypes || ['other']).map((type) => <option key={type} value={type}>{EVENT_TYPE_LABELS[type] || type}</option>)}
            </select>
          </Field>
        </div>
      </fieldset>

      {/* ── Textbook Assignment (Chương / Bài) ── */}
      <fieldset className="event-meta-form__group">
        <legend>Phân theo sách giáo khoa</legend>
        <div className="meta-field-grid meta-field-grid--textbook">
          <Field label="Khối lớp" hint="Chọn khối lớp để xem danh sách chương.">
            <select disabled={readOnly} value={selectedGradeId} onChange={(e) => handleGradeChange(e.target.value)}>
              <option value="">— Chọn khối lớp —</option>
              {grades.map((g) => (
                <option key={g.id} value={g.id}>{g.label}</option>
              ))}
            </select>
          </Field>
          <Field label="Chương" hint="Chọn chương trong sách giáo khoa.">
            <select disabled={readOnly || !selectedGradeId} value={selectedPartId} onChange={(e) => handlePartChange(e.target.value)}>
              <option value="">— Chọn chương —</option>
              {parts.map((p) => (
                <option key={p.id} value={p.id}>
                  Chương {p.partNumber}: {p.title}
                </option>
              ))}
            </select>
          </Field>
          <Field label="Bài" hint="Chọn bài học cụ thể để gắn sự kiện.">
            <select disabled={readOnly || !selectedPartId} value={selectedLessonId} onChange={(e) => handleLessonChange(e.target.value)}>
              <option value="">— Chọn bài —</option>
              {lessons.map((l) => {
                const taken = l.eventId && l.eventId !== event?.id;
                return (
                  <option key={l.id} value={l.id} disabled={taken}>
                    Bài {l.lessonNumber}: {l.title}{taken ? ' (đã gán)' : ''}
                  </option>
                );
              })}
            </select>
          </Field>
        </div>
        {lesson && (
          <div className="admin-lesson-current">
            <IconInfo />
            <span>
              Đang gán: <strong>Chương {lesson.partNumber}</strong> — <strong>Bài {lesson.lessonNumber}</strong>: {lesson.lessonTitle}
            </span>
          </div>
        )}
        <button
          className="admin-btn"
          disabled={readOnly || !currentLessonChanged}
          onClick={saveLesson}
          type="button"
        >
          <IconSave />
          {lessonSaved ? 'Đã lưu bài học' : (selectedLessonId ? 'Gán bài học' : 'Bỏ gán bài học')}
        </button>
      </fieldset>

      <fieldset className="event-meta-form__group">
        <legend>Nội dung hiển thị công khai</legend>
        <Field label="Trích đoạn ngắn" required>
          <textarea autoComplete="off" name="excerpt" readOnly={readOnly} placeholder="Câu mở ngắn xuất hiện ở danh sách và hero." value={draft.excerpt} onChange={(e) => update('excerpt', e.target.value)} />
        </Field>
        <Field label="Tóm tắt" required>
          <textarea autoComplete="off" name="summary" readOnly={readOnly} placeholder="Tóm tắt nội dung chính của sự kiện." value={draft.summary} onChange={(e) => update('summary', e.target.value)} />
        </Field>
      </fieldset>

      <fieldset className="event-meta-form__group">
        <legend>Thông tin bổ sung</legend>
        <div className="meta-field-grid">
          <Field label="Địa điểm"><input autoComplete="off" name="location" readOnly={readOnly} placeholder="Ví dụ: Sông Bạch Đằng" value={draft.location} onChange={(e) => update('location', e.target.value)} /></Field>
          <Field label="Đối thủ / bối cảnh đối lập"><input autoComplete="off" name="opponent" readOnly={readOnly} placeholder="Ví dụ: quân Nam Hán" value={draft.opponent} onChange={(e) => update('opponent', e.target.value)} /></Field>
        </div>
        <Field label="Kết quả"><input autoComplete="off" name="result" readOnly={readOnly} placeholder="Ví dụ: Đại Việt giành thắng lợi" value={draft.result} onChange={(e) => update('result', e.target.value)} /></Field>
        <Field label="Khối lớp (tag)" hint="Ngăn cách nhiều giá trị bằng dấu phẩy."><input autoComplete="off" name="gradeTags" readOnly={readOnly} placeholder="lop-6, lop-7" value={draft.gradeTags} onChange={(e) => update('gradeTags', e.target.value)} /></Field>
        <Field label="Nhân vật" hint="Ngăn cách nhiều nhân vật bằng dấu phẩy."><input autoComplete="off" name="actors" readOnly={readOnly} placeholder="Ngô Quyền, Trần Hưng Đạo" value={draft.actors} onChange={(e) => update('actors', e.target.value)} /></Field>
        <Field label="Sự kiện liên quan" hint="Nhập slug, ngăn cách bằng dấu phẩy."><input autoComplete="off" name="relatedEventSlugs" spellCheck={false} readOnly={readOnly} placeholder="nha-ngo, bach-dang-1288" value={draft.relatedEventSlugs} onChange={(e) => update('relatedEventSlugs', e.target.value)} /></Field>
      </fieldset>

      <button className="admin-btn admin-btn--primary" disabled={readOnly || !hasChanges} type="submit">
        <IconSave />
        {saved ? 'Đã lưu' : 'Lưu thông tin'}
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
    templateType: 'battle',
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
