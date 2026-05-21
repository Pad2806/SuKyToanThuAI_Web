import React from 'react';
import { EventStoryPage } from '../story-system/event-story-page.jsx';

export const StoryPreview = ({ event }) => {
  const beats = event.story?.beats ?? [];
  const illustrationCount = beats
    .flatMap((beat) => beat.blocks ?? [])
    .filter((block) => block.type === 'illustration-first')
    .length;

  return (
    <section className="story-preview">
      {illustrationCount > 2 && (
        <p className="admin-warning">
          Đã vượt giới hạn minh hoạ toàn trang (tối đa 2 trên mỗi sự kiện)
        </p>
      )}
      <EventStoryPage data={event} previewMode />
    </section>
  );
};

export default StoryPreview;
