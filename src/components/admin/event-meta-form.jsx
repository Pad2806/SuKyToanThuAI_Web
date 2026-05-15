import React from 'react';

export const EventMetaForm = ({ event, onChange }) => {
  const update = (patch) => onChange({ ...event, ...patch });

  return (
    <form className="event-meta-form">
      <label>Khối lớp<input defaultValue={event.gradeTags.join(', ')} onBlur={(item) => update({ gradeTags: item.target.value.split(',').map((value) => value.trim()).filter(Boolean) })} /></label>
      <label>Thể loại<input value={event.type} onChange={(item) => update({ type: item.target.value })} /></label>
      <label>Nổi bật<input checked={event.featured} onChange={(item) => update({ featured: item.target.checked })} type="checkbox" /></label>
      <label>Đoạn trích<textarea value={event.excerpt} onChange={(item) => update({ excerpt: item.target.value })} /></label>
      <label>Tóm tắt<textarea value={event.summary} onChange={(item) => update({ summary: item.target.value })} /></label>
    </form>
  );
};

export default EventMetaForm;
