import React from 'react';

export const SuspenseLoader = () => (
  <div className="evt-skeleton-loader general-page-skeleton" aria-hidden="true" style={{ padding: '80px 20px', minHeight: '100vh', background: '#0d0804', boxSizing: 'border-box' }}>
    <div style={{ maxWidth: '1200px', margin: '0 auto' }}>
      {/* Page Header Skeleton */}
      <div className="evt-skeleton-item evt-skeleton-shimmer" style={{ width: '150px', height: '16px', marginBottom: '16px', display: 'block' }} />
      <div className="evt-skeleton-item evt-skeleton-shimmer" style={{ width: 'min(100%, 380px)', height: '40px', marginBottom: '24px', display: 'block' }} />
      <div className="evt-skeleton-item evt-skeleton-shimmer" style={{ width: 'min(100%, 600px)', height: '20px', marginBottom: '48px', display: 'block' }} />
      
      {/* Page Grid Body Skeleton */}
      <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fill, minmax(280px, 1fr))', gap: '30px' }}>
        {Array.from({ length: 3 }).map((_, index) => (
          <div key={index} style={{ border: '1px solid rgba(222,188,98,0.08)', borderRadius: '12px', padding: '20px', display: 'flex', flexDirection: 'column', gap: '16px', boxSizing: 'border-box', background: '#0e0905' }}>
            <div className="evt-skeleton-item evt-skeleton-shimmer" style={{ width: '100%', height: '180px', borderRadius: '8px', display: 'block' }} />
            <div className="evt-skeleton-item evt-skeleton-shimmer" style={{ width: '40%', height: '14px', display: 'block' }} />
            <div className="evt-skeleton-item evt-skeleton-shimmer" style={{ width: '90%', height: '20px', display: 'block' }} />
            <div className="evt-skeleton-item evt-skeleton-shimmer" style={{ width: '100%', height: '40px', display: 'block' }} />
          </div>
        ))}
      </div>
    </div>
  </div>
);

export default SuspenseLoader;
