import React from 'react';
import { StoryRenderer } from '../story/story-renderer.jsx';

export const StoryPreview = ({ event }) => {
  const illustrationCount = event.story.beats.flatMap((beat) => beat.blocks).filter((block) => block.type === 'illustration-first').length;

  return (
    <section className="story-preview">
      {illustrationCount > 2 && <p className="admin-warning">Đã vượt giới hạn minh hoạ toàn trang (tối đa 2 trên mỗi sự kiện)</p>}
      <StoryRenderer event={event} />
    </section>
  );
};

export default StoryPreview;
