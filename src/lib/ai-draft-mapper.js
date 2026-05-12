import { slugify } from './slugify.js';

const findLine = (text, labels) =>
  text.split(/\r?\n/).find((line) => labels.some((label) => line.toLowerCase().startsWith(label)));

const valueAfterColon = (line = '') => line.split(':').slice(1).join(':').trim();

export const createDraftFromText = (text) => {
  const year = valueAfterColon(findLine(text, ['năm:', 'year:'])) || 'Chưa rõ';
  const location = valueAfterColon(findLine(text, ['địa điểm:', 'location:'])) || 'Chưa rõ';
  const actors = valueAfterColon(findLine(text, ['nhân vật:', 'actors:'])) || 'Chưa rõ';
  const outcome = valueAfterColon(findLine(text, ['kết quả:', 'outcome:'])) || 'Cần duyệt';
  const topicSlug = slugify(valueAfterColon(findLine(text, ['chủ đề:', 'topic:'])) || 'ai-import');

  return {
    featured: false,
    topics: [topicSlug],
    story: {
      templateType: 'universal',
      beats: [
        {
          type: 'setup',
          title: 'Bối Cảnh',
          blocks: [{ type: 'quick-facts', items: [
            { label: 'Năm', value: year },
            { label: 'Địa điểm', value: location },
            { label: 'Nhân vật chính', value: actors },
            { label: 'Kết quả', value: outcome },
          ] }],
        },
        { type: 'rising', title: 'Thử Thách', blocks: [{ type: 'figure', name: actors, role: 'Nhân vật chính', bio: 'Cần biên tập sau khi AI trích xuất.' }] },
        { type: 'falling', title: 'Hệ Quả', blocks: [{ type: 'glossary', terms: [{ term: outcome, definition: 'Khái niệm cần được admin kiểm chứng.' }] }] },
      ],
    },
  };
};
