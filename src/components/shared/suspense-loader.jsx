import React from 'react';

export const SuspenseLoader = ({ label = 'Đang tải' }) => (
  <div className="suspense-loader" role="status">
    {label}
  </div>
);

export default SuspenseLoader;
