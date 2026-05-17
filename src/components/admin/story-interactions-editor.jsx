import React, { useEffect, useState } from 'react';

const beatTypes = ['hook', 'setup', 'rising', 'climax', 'falling', 'takeaway'];
const beatLabels = ['Mở màn', 'Bối cảnh', 'Dâng cao', 'Cao trào', 'Hệ quả', 'Bài học'];

const IconPen = () => (
  <svg aria-hidden="true" width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
    <path d="M12 20h9"/><path d="M16.5 3.5a2.12 2.12 0 013 3L7 19l-4 1 1-4L16.5 3.5z"/>
  </svg>
);

const IconSave = () => (
  <svg aria-hidden="true" width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
    <path d="M19 21H5a2 2 0 01-2-2V5a2 2 0 012-2h11l5 5v11a2 2 0 01-2 2z"/><polyline points="17 21 17 13 7 13 7 21"/><polyline points="7 3 7 8 15 8"/>
  </svg>
);

const IconPlus = () => (
  <svg aria-hidden="true" width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
    <line x1="12" y1="5" x2="12" y2="19"/><line x1="5" y1="12" x2="19" y2="12"/>
  </svg>
);

export const StoryInteractionsEditor = ({ event, story, readOnly = false, onSaveStory, onSaveInteractions }) => {
  const initial = initialEditorState(event, story);
  const [beats, setBeats] = useState(initial.beats);
  const [characters, setCharacters] = useState(initial.characters);
  const [timeline, setTimeline] = useState(initial.timeline);
  const [quiz, setQuiz] = useState(initial.quiz);
  const [climax, setClimax] = useState(initial.climax);
  const [aftermath, setAftermath] = useState(initial.aftermath);
  const [takeaway, setTakeaway] = useState(initial.takeaway);

  useEffect(() => {
    const normalized = normalizeStory(story?.story_json || story, event?.template_type);
    const interactive = event?.interactive_data || {};
    setBeats(normalized.beats);
    setCharacters(normalizeRows(interactive.characters, { name: '', role: '', bio: '' }));
    setTimeline(normalizeRows(interactive.timeline, { year: '', title: '', description: '' }));
    setQuiz(normalizeRows(interactive.quiz, { question: '', options: '', correct: 0, explanation: '' }));
    setClimax({
      title: interactive.climaxScene?.title || '',
      summary: interactive.climaxScene?.phases?.[0]?.summary || interactive.climaxScene?.phases?.[0]?.description || '',
    });
    setAftermath({ title: interactive.aftermath?.title || '' });
    setTakeaway({
      happened: interactive.takeaway?.happened || '',
      whyItMatters: interactive.takeaway?.whyItMatters || '',
      lesson: interactive.takeaway?.lesson || '',
    });
  }, [event?.id, event?.interactive_data, event?.template_type, story]);

  const saveStory = () => onSaveStory({
    templateType: event?.template_type || 'universal',
    beats: beats.map((beat) => ({
      type: beat.type,
      title: beat.title.trim(),
      blocks: beat.body.trim() ? [{ type: 'text', body: beat.body.trim() }] : [],
    })),
  });

  const saveInteractions = () => onSaveInteractions({
    characters: characters.filter((item) => item.name.trim()).map((item, index) => ({
      id: `nhan-vat-${index + 1}`,
      name: item.name.trim(),
      role: item.role.trim(),
      bio: item.bio.trim(),
    })),
    timeline: timeline.filter((item) => item.title.trim()).map((item, index) => ({
      id: `moc-${index + 1}`,
      year: item.year.trim(),
      title: item.title.trim(),
      description: item.description.trim(),
    })),
    climaxScene: climax.title.trim() || climax.summary.trim() ? {
      title: climax.title.trim(),
      phases: [{ id: 'giai-doan-1', label: 'Cao trào', summary: climax.summary.trim(), description: climax.summary.trim() }],
      hotspots: [],
    } : null,
    aftermath: aftermath.title.trim() ? { title: aftermath.title.trim(), stats: [] } : null,
    takeaway: Object.values(takeaway).some((v) => v.trim()) ? takeaway : null,
    quiz: quiz.filter((item) => item.question.trim()).map((item, index) => ({
      id: `cau-hoi-${index + 1}`,
      question: item.question.trim(),
      options: splitOptions(item.options),
      correct: Number(item.correct) || 0,
      explanation: item.explanation.trim(),
    })),
  });

  return (
    <section className="admin-card story-interactions-editor">
      <div className="admin-card__header">
        <div className="admin-card__icon"><IconPen /></div>
        <h2>Kịch bản &amp; tương tác</h2>
      </div>
      {readOnly && <p className="admin-note">Sự kiện đã công bố hoặc lưu trữ. Hãy tạo bản nháp chỉnh sửa nếu cần cập nhật.</p>}

      <div className="editor-list">
        {beats.map((beat, index) => (
          <fieldset key={beat.type} className="editor-row">
            <legend>{beatLabels[index]}</legend>
            <label>Tiêu đề cảnh
              <input
                autoComplete="off"
                disabled={readOnly}
                name={`beat-title-${beat.type}`}
                placeholder={beatLabels[index]}
                value={beat.title}
                onChange={(e) => updateRows(setBeats, index, 'title', e.target.value)}
              />
            </label>
            <label>Nội dung cảnh
              <textarea
                autoComplete="off"
                disabled={readOnly}
                name={`beat-body-${beat.type}`}
                placeholder="Nhập nội dung cảnh…"
                value={beat.body}
                onChange={(e) => updateRows(setBeats, index, 'body', e.target.value)}
              />
            </label>
          </fieldset>
        ))}
      </div>
      <button className="admin-btn admin-btn--primary" disabled={readOnly} onClick={saveStory} type="button">
        <IconSave />
        Lưu kịch bản
      </button>

      <hr className="admin-section-divider" />

      <EditorRows
        disabled={readOnly}
        title="Nhân vật"
        rows={characters}
        setRows={setCharacters}
        fields={[['name', 'Tên nhân vật'], ['role', 'Vai trò'], ['bio', 'Tiểu sử']]}
        empty={{ name: '', role: '', bio: '' }}
      />
      <EditorRows
        disabled={readOnly}
        title="Dòng thời gian"
        rows={timeline}
        setRows={setTimeline}
        fields={[['year', 'Năm'], ['title', 'Mốc sự kiện'], ['description', 'Mô tả']]}
        empty={{ year: '', title: '', description: '' }}
      />

      <div className="editor-grid">
        <label>Tiêu đề cao trào
          <input
            autoComplete="off"
            disabled={readOnly}
            name="climax-title"
            placeholder="Tiêu đề cao trào…"
            value={climax.title}
            onChange={(e) => setClimax({ ...climax, title: e.target.value })}
          />
        </label>
        <label>Tóm tắt cao trào
          <textarea
            autoComplete="off"
            disabled={readOnly}
            name="climax-summary"
            placeholder="Mô tả chi tiết…"
            value={climax.summary}
            onChange={(e) => setClimax({ ...climax, summary: e.target.value })}
          />
        </label>
        <label>Tiêu đề hệ quả
          <input
            autoComplete="off"
            disabled={readOnly}
            name="aftermath-title"
            placeholder="Tiêu đề hệ quả…"
            value={aftermath.title}
            onChange={(e) => setAftermath({ title: e.target.value })}
          />
        </label>
        <label>Điều đã xảy ra
          <textarea
            autoComplete="off"
            disabled={readOnly}
            name="takeaway-happened"
            placeholder="Mô tả diễn biến…"
            value={takeaway.happened}
            onChange={(e) => setTakeaway({ ...takeaway, happened: e.target.value })}
          />
        </label>
        <label>Vì sao quan trọng
          <textarea
            autoComplete="off"
            disabled={readOnly}
            name="takeaway-why"
            placeholder="Tầm quan trọng lịch sử…"
            value={takeaway.whyItMatters}
            onChange={(e) => setTakeaway({ ...takeaway, whyItMatters: e.target.value })}
          />
        </label>
        <label>Bài học rút ra
          <textarea
            autoComplete="off"
            disabled={readOnly}
            name="takeaway-lesson"
            placeholder="Bài học rút ra…"
            value={takeaway.lesson}
            onChange={(e) => setTakeaway({ ...takeaway, lesson: e.target.value })}
          />
        </label>
      </div>

      <EditorRows
        disabled={readOnly}
        title="Câu hỏi trắc nghiệm"
        rows={quiz}
        setRows={setQuiz}
        fields={[['question', 'Câu hỏi'], ['options', 'Đáp án (ngăn bằng |)'], ['correct', 'Đáp án đúng (số thứ tự)'], ['explanation', 'Giải thích']]}
        empty={{ question: '', options: '', correct: 0, explanation: '' }}
      />
      <button className="admin-btn admin-btn--primary" disabled={readOnly} onClick={saveInteractions} type="button">
        <IconSave />
        Lưu dữ liệu tương tác
      </button>
    </section>
  );
};

const EditorRows = ({ title, rows, setRows, fields, empty, disabled }) => (
  <div className="editor-list">
    <h3>{title}</h3>
    {rows.map((row, index) => (
      <div className="editor-row" key={`${title}-${index}`}>
        {fields.map(([key, label]) => (
          <label key={key}>{label}
            <input
              autoComplete="off"
              disabled={disabled}
              name={`${title.toLowerCase().replace(/\s+/g, '-')}-${index}-${key}`}
              placeholder={`${label}…`}
              value={row[key]}
              onChange={(e) => updateRows(setRows, index, key, e.target.value)}
            />
          </label>
        ))}
      </div>
    ))}
    <button
      className="admin-btn"
      aria-label={`Thêm ${title.toLowerCase()}`}
      disabled={disabled}
      onClick={() => setRows((current) => [...current, empty])}
      type="button"
    >
      <IconPlus />
      Thêm {title.toLowerCase()}
    </button>
  </div>
);

function normalizeStory(story, templateType) {
  const sourceBeats = story?.beats || [];
  return {
    templateType: story?.templateType || templateType || 'universal',
    beats: beatTypes.map((type, index) => {
      const beat = sourceBeats.find((item) => item.type === type) || {};
      const block = beat.blocks?.[0] || {};
      return { type, title: beat.title || beatLabels[index], body: block.body || block.quote || '' };
    }),
  };
}

function initialEditorState(event, story) {
  const normalized = normalizeStory(story?.story_json || story, event?.template_type);
  const interactive = event?.interactive_data || {};
  return {
    beats: normalized.beats,
    characters: normalizeRows(interactive.characters, { name: '', role: '', bio: '' }),
    timeline: normalizeRows(interactive.timeline, { year: '', title: '', description: '' }),
    quiz: normalizeRows(interactive.quiz, { question: '', options: '', correct: 0, explanation: '' }),
    climax: {
      title: interactive.climaxScene?.title || '',
      summary: interactive.climaxScene?.phases?.[0]?.summary || interactive.climaxScene?.phases?.[0]?.description || '',
    },
    aftermath: { title: interactive.aftermath?.title || '' },
    takeaway: {
      happened: interactive.takeaway?.happened || '',
      whyItMatters: interactive.takeaway?.whyItMatters || '',
      lesson: interactive.takeaway?.lesson || '',
    },
  };
}

function normalizeRows(rows, empty) {
  return rows?.length
    ? rows.map((row) => ({ ...empty, ...row, options: Array.isArray(row.options) ? row.options.join(' | ') : row.options || '' }))
    : [empty];
}

function splitOptions(value) {
  return String(value || '').split('|').map((item) => item.trim()).filter(Boolean);
}

function updateRows(setRows, index, key, value) {
  setRows((rows) => rows.map((row, i) => i === index ? { ...row, [key]: value } : row));
}

export default StoryInteractionsEditor;
