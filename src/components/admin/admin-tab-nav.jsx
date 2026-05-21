import React from 'react';

const tabs = [
  { id: 'info', label: 'Thông tin', icon: 'M13 2H6a2 2 0 00-2 2v16a2 2 0 002 2h12a2 2 0 002-2V8z' },
  { id: 'sources', label: 'Nguồn & AI', icon: 'M21 15v4a2 2 0 01-2 2H5a2 2 0 01-2-2v-4M17 8l-5-5-5 5M12 3v12' },
  { id: 'content', label: 'Nội dung', icon: 'M12 20h9M16.5 3.5a2.12 2.12 0 013 3L7 19l-4 1 1-4L16.5 3.5z' },
  { id: 'publish', label: 'Xuất bản', icon: 'M22 11.08V12a10 10 0 11-5.93-9.14' },
];

export const AdminTabNav = ({ activeTab, onChange, flowSteps }) => {
  const getTabStatus = (tabId) => {
    if (!flowSteps) return null;
    switch (tabId) {
      case 'info': return flowSteps[0]?.done ? 'done' : null;
      case 'sources': return flowSteps[1]?.done ? 'done' : null;
      case 'content': return (flowSteps[2]?.done && flowSteps[3]?.done) ? 'done' : null;
      case 'publish': return flowSteps[5]?.done ? 'done' : null;
      default: return null;
    }
  };

  return (
    <nav className="admin-tabs" role="tablist" aria-label="Bước chỉnh sửa sự kiện">
      {tabs.map((tab) => {
        const status = getTabStatus(tab.id);
        return (
          <button
            key={tab.id}
            role="tab"
            type="button"
            aria-selected={activeTab === tab.id}
            className={`admin-tabs__item ${activeTab === tab.id ? 'is-active' : ''} ${status === 'done' ? 'is-done' : ''}`}
            onClick={() => onChange(tab.id)}
          >
            <svg aria-hidden="true" width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
              <path d={tab.icon} />
            </svg>
            <span>{tab.label}</span>
            {status === 'done' && (
              <svg className="admin-tabs__check" aria-label="Hoàn thành" width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="3" strokeLinecap="round" strokeLinejoin="round">
                <polyline points="20 6 9 17 4 12" />
              </svg>
            )}
          </button>
        );
      })}
    </nav>
  );
};

export default AdminTabNav;
