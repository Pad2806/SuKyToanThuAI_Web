import React, { useEffect, useMemo, useState } from 'react';
import { EventStoryPage } from '../story-system/event-story-page.jsx';
import { adminEventApi } from '../../lib/admin-event-api.js';
import { AdminWorkQueue } from './admin-work-queue.jsx';
import { EventMetaForm } from './event-meta-form.jsx';
import { SourceImportPanel } from './source-import-panel.jsx';
import { AiDraftPanel } from './ai-draft-panel.jsx';
import { AssetSlotBoard } from './asset-slot-board.jsx';
import { QualityGatePanel } from './quality-gate-panel.jsx';
import { StoryInteractionsEditor } from './story-interactions-editor.jsx';
import { AdminFlowChecklist, buildAdminFlowSteps } from './admin-flow-checklist.jsx';
import { factsFromDraft, interactionsFromDraft, saveManualAsset, toPreviewEvent } from './event-studio-mappers.js';

const IconAlert = () => (
  <svg aria-hidden="true" width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
    <circle cx="12" cy="12" r="10"/><line x1="12" y1="8" x2="12" y2="12"/><line x1="12" y1="16" x2="12.01" y2="16"/>
  </svg>
);

const IconPreview = () => (
  <svg aria-hidden="true" width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
    <path d="M1 12s4-8 11-8 11 8 11 8-4 8-11 8-11-8-11-8z"/><circle cx="12" cy="12" r="3"/>
  </svg>
);

const IconEdit = () => (
  <svg aria-hidden="true" width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
    <path d="M11 4H4a2 2 0 00-2 2v14a2 2 0 002 2h14a2 2 0 002-2v-7"/><path d="M18.5 2.5a2.12 2.12 0 013 3L12 15l-4 1 1-4 9.5-9.5z"/>
  </svg>
);

const IconArchive = () => (
  <svg aria-hidden="true" width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
    <polyline points="21 8 21 21 3 21 3 8"/><rect x="1" y="3" width="22" height="5"/><line x1="10" y1="12" x2="14" y2="12"/>
  </svg>
);

const ConfirmModal = ({ title, body, onConfirm, onCancel }) => (
  <div className="admin-modal-overlay" role="dialog" aria-modal="true" aria-labelledby="confirm-modal-title">
    <div className="admin-modal">
      <h3 className="admin-modal__title" id="confirm-modal-title">{title}</h3>
      <p className="admin-modal__body">{body}</p>
      <div className="admin-modal__actions">
        <button className="admin-btn" onClick={onCancel} type="button">Hủy</button>
        <button className="admin-btn admin-btn--danger" onClick={onConfirm} type="button">Xác nhận</button>
      </div>
    </div>
  </div>
);

export const EventStudioWizard = () => {
  const [events, setEvents] = useState([]);
  const [options, setOptions] = useState(null);
  const [selectedId, setSelectedId] = useState(null);
  const [detail, setDetail] = useState(null);
  const [draft, setDraft] = useState(null);
  const [quality, setQuality] = useState(null);
  const [error, setError] = useState('');
  const [busy, setBusy] = useState('');
  const [previewOpen, setPreviewOpen] = useState(false);
  const [archiveConfirm, setArchiveConfirm] = useState(false);

  useEffect(() => { boot(); }, []);
  useEffect(() => { if (selectedId) loadDetail(selectedId); }, [selectedId]);

  const readOnly = detail?.event?.status && !['draft', 'review'].includes(detail.event.status);
  const preview = useMemo(() => detail ? toPreviewEvent(detail) : null, [detail]);
  const qualityReport = quality?.quality || quality;
  const flowSteps = useMemo(() => buildAdminFlowSteps(detail, qualityReport), [detail, qualityReport]);

  const run = async (label, action) => {
    setError('');
    setBusy(label);
    try {
      return await action();
    } catch (err) {
      setError(err.message);
      return null;
    } finally {
      setBusy('');
    }
  };

  const boot = async () => run('boot', async () => {
    const [opts, rows] = await Promise.all([adminEventApi.options(), adminEventApi.list()]);
    setOptions(opts);
    setEvents(rows);
    if (rows[0]) setSelectedId(rows[0].id);
  });

  const loadEvents = async () => {
    const rows = await adminEventApi.list();
    setEvents(rows);
    return rows;
  };

  const loadDetail = async (id) => run('detail', async () => {
    const [eventDetail, sources] = await Promise.all([adminEventApi.detail(id), adminEventApi.sources(id)]);
    setDetail({ ...eventDetail, sources });
    setDraft(null);
    setQuality(null);
  });

  const refresh = async () => selectedId && loadDetail(selectedId);

  const create = async (payload) => run('create', async () => {
    const row = await adminEventApi.create(payload);
    await loadEvents();
    setSelectedId(row.id);
  });

  const createRevision = async () => run('revision', async () => {
    if (!detail) return;
    const row = await adminEventApi.revisionDraft(detail.event.id);
    await loadEvents();
    setSelectedId(row.id);
  });

  const archiveEvent = async () => {
    setArchiveConfirm(false);
    run('archive', async () => {
      await adminEventApi.archive(detail.event.id);
      await refresh();
      await loadEvents();
    });
  };

  const submitReview = async () => run('submit-review', async () => {
    if (!detail) return;
    await adminEventApi.submitReview(detail.event.id);
    await refresh();
    await loadEvents();
  });

  const acceptDraft = async () => run('accept-draft', async () => {
    const payload = draft?.payload;
    if (!payload || !detail) return;
    const data = payload.eventData;
    await adminEventApi.updateFacts(detail.event.id, factsFromDraft(data));
    await adminEventApi.updateStory(detail.event.id, {
      story: data.story,
      generationMetadata: {
        ...(payload.generationMetadata || {}),
        citations: payload.citations || [],
        coverageReport: payload.coverageReport || {},
      },
    });
    await adminEventApi.updateInteractions(detail.event.id, interactionsFromDraft(data));
    await refresh();
  });

  const statusLabels = { draft: 'Bản nháp', review: 'Chờ duyệt', published: 'Đã đăng', archived: 'Lưu trữ' };

  return (
    <div className="admin-studio">
      {error && (
        <div className="admin-banner admin-banner--error" role="alert">
          <IconAlert />
          <span>{error}</span>
        </div>
      )}
      {busy && (
        <div className="admin-banner admin-banner--busy" aria-live="polite">
          <span className="admin-spinner" aria-hidden="true" />
          <span>Đang xử lý: {busy}…</span>
        </div>
      )}

      <div className="admin-studio-layout">
        <aside className="admin-studio-sidebar">
          <AdminWorkQueue events={events} options={options} onCreate={create} onSelect={setSelectedId} selectedId={selectedId} />
        </aside>

        <div className="admin-studio-content">
          {detail && (
            <>
              <div className="admin-command-bar">
                <span className="admin-command-bar__title">{detail.event.title}</span>
                <span className={`admin-status admin-status--${detail.event.status}`}>
                  {statusLabels[detail.event.status] || detail.event.status}
                </span>
                <button
                  className="admin-btn"
                  aria-pressed={previewOpen}
                  onClick={() => setPreviewOpen((v) => !v)}
                  type="button"
                >
                  <IconPreview />
                  {previewOpen ? 'Ẩn xem trước' : 'Xem trước'}
                </button>
                <button
                  className="admin-btn"
                  disabled={detail.event.status !== 'published'}
                  onClick={createRevision}
                  type="button"
                >
                  <IconEdit />
                  Tạo bản nháp chỉnh sửa
                </button>
                <button
                  className="admin-btn admin-btn--danger"
                  disabled={detail.event.status === 'archived'}
                  onClick={() => setArchiveConfirm(true)}
                  type="button"
                >
                  <IconArchive />
                  Lưu trữ
                </button>
              </div>

              <AdminFlowChecklist steps={flowSteps} />

              <EventMetaForm
                event={detail.event}
                options={options}
                readOnly={readOnly}
                onSave={(payload) => run('save-facts', async () => {
                  await adminEventApi.updateFacts(detail.event.id, payload);
                  await refresh();
                })}
              />
              <SourceImportPanel
                disabled={readOnly}
                eventId={detail.event.id}
                onImport={(id, body) => run('import-source', async () => {
                  await adminEventApi.importSource(id, body);
                  await refresh();
                })}
                sources={detail.sources}
              />
              <AiDraftPanel
                disabled={readOnly}
                draft={draft}
                sourceCount={detail.sources.length}
                onAccept={acceptDraft}
                onDraft={() => run('ai-draft', async () => setDraft(await adminEventApi.draftStory(detail.event.id, { sourceIds: detail.sources.map((item) => item.id) })))}
              />
              <StoryInteractionsEditor
                event={detail.event}
                story={detail.story}
                readOnly={readOnly}
                onSaveStory={(story) => run('save-story', async () => {
                  await adminEventApi.updateStory(detail.event.id, { story, generationMetadata: { source: 'admin-editor' } });
                  await refresh();
                })}
                onSaveInteractions={(payload) => run('save-interactions', async () => {
                  await adminEventApi.updateInteractions(detail.event.id, payload);
                  await refresh();
                })}
              />
              <AssetSlotBoard
                disabled={readOnly}
                onEnsure={() => run('ensure-slots', async () => { await adminEventApi.ensureSlots(detail.event.id); await refresh(); })}
                onImage={(slot) => run('generate-image', async () => { await adminEventApi.generateImage(detail.event.id, slot.id); await refresh(); })}
                onManual={(slot, url) => run('manual-asset', async () => { await saveManualAsset(detail.event.id, slot, url); await refresh(); })}
                onPrompts={() => run('asset-prompts', async () => { await adminEventApi.generatePrompts(detail.event.id); await refresh(); })}
                onReview={(slot, status, note) => run('review-asset', async () => { await adminEventApi.reviewAsset(detail.event.id, slot.id, { status, reviewNotes: note }); await refresh(); })}
                slots={detail.assets}
              />
              <QualityGatePanel
                eventStatus={detail.event.status}
                onCheck={() => run('quality', async () => setQuality(await adminEventApi.quality(detail.event.id)))}
                onSubmitReview={submitReview}
                onPublish={() => run('publish', async () => {
                  setQuality(await adminEventApi.publish(detail.event.id));
                  await refresh();
                  await loadEvents();
                })}
                report={qualityReport}
              />
            </>
          )}
          {!detail && !busy && (
            <div className="admin-empty">
              <svg aria-hidden="true" width="48" height="48" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round">
                <rect x="3" y="3" width="18" height="18" rx="2" ry="2"/><line x1="3" y1="9" x2="21" y2="9"/><line x1="9" y1="21" x2="9" y2="9"/>
              </svg>
              <p>Chọn hoặc tạo một sự kiện để bắt đầu.</p>
            </div>
          )}
        </div>
      </div>

      {previewOpen && preview && (
        <section className="admin-preview">
          <EventStoryPage data={preview} />
        </section>
      )}

      {archiveConfirm && (
        <ConfirmModal
          title="Lưu trữ sự kiện?"
          body="Sự kiện sẽ không còn nằm trong quy trình chỉnh sửa hiện tại. Bạn vẫn có thể khôi phục sau khi lưu trữ."
          onConfirm={archiveEvent}
          onCancel={() => setArchiveConfirm(false)}
        />
      )}
    </div>
  );
};

export default EventStudioWizard;
