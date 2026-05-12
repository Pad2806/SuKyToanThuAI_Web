import React from 'react';

const groups = [
  { title: 'Storytelling', blocks: [['text', 'Đoạn văn'], ['quote', 'Trích dẫn']] },
  { title: 'Visual', blocks: [['image', 'Hình ảnh'], ['map', 'Bản đồ'], ['timeline', 'Dòng thời gian'], ['stats', 'Số liệu']] },
  { title: 'Sách lịch sử', blocks: [['quick-facts', 'Sự kiện nhanh'], ['figure', 'Nhân vật'], ['fact-box', 'Hộp thông tin'], ['glossary', 'Chú giải'], ['illustration-first', 'Minh hoạ toàn trang']] },
];

const makeBlock = (type) => {
  if (type === 'quick-facts') return { type, items: [{ label: 'Năm', value: 'Chưa rõ' }] };
  if (type === 'figure') return { type, name: 'Nhân vật', role: 'Vai trò', bio: 'Tiểu sử ngắn.' };
  if (type === 'fact-box') return { type, title: 'Bạn có biết?', body: 'Thông tin cần biên tập.' };
  if (type === 'glossary') return { type, terms: [{ term: 'Thuật ngữ', definition: 'Định nghĩa.' }] };
  if (type === 'illustration-first') return { type, image: '/images/fallbacks/parchment.jpg', caption: 'Minh hoạ', body: 'Nội dung minh hoạ.' };
  return { type, body: 'Nội dung mới.' };
};

export const BlockEditor = ({ activeBeat, onInsertBlock }) => (
  <aside className="block-editor">
    <p>Beat đang chọn: {activeBeat}</p>
    {groups.map((group) => (
      <section key={group.title}>
        <h3>{group.title}</h3>
        {group.blocks.map(([type, label]) => (
          <button key={type} onClick={() => onInsertBlock(makeBlock(type))} type="button">{label}</button>
        ))}
      </section>
    ))}
  </aside>
);

export default BlockEditor;
