import React from 'react';

export const EventSkeleton = () => {
  return (
    <div className="evt-skeleton-loader" aria-hidden="true">
      {/* Hero Skeleton */}
      <div className="evt-skeleton-hero">
        <div className="evt-skeleton-hero__back evt-skeleton-item evt-skeleton-shimmer" />
        <div className="evt-skeleton-hero__era evt-skeleton-item evt-skeleton-shimmer" />
        <div className="evt-skeleton-hero__title evt-skeleton-item evt-skeleton-shimmer" />
        <div className="evt-skeleton-hero__divider" />
        <div className="evt-skeleton-hero__quote evt-skeleton-item evt-skeleton-shimmer" />
        <div className="evt-skeleton-hero__facts">
          <div className="evt-skeleton-hero__fact evt-skeleton-item evt-skeleton-shimmer" />
          <div className="evt-skeleton-hero__fact evt-skeleton-item evt-skeleton-shimmer" />
          <div className="evt-skeleton-hero__fact evt-skeleton-item evt-skeleton-shimmer" />
        </div>
        <div className="evt-skeleton-hero__scroll" />
      </div>

      {/* Body Content Skeleton */}
      <div className="evt-skeleton-body">
        <div className="evt-skeleton-body__left">
          <div className="evt-skeleton-body__title evt-skeleton-item evt-skeleton-shimmer" />
          <div className="evt-skeleton-body__text evt-skeleton-item evt-skeleton-shimmer" />
          <div className="evt-skeleton-body__text evt-skeleton-item evt-skeleton-shimmer" />
          <div className="evt-skeleton-body__text evt-skeleton-item evt-skeleton-shimmer" />
          <div className="evt-skeleton-body__text--short evt-skeleton-item evt-skeleton-shimmer" />
          <div style={{ height: '30px' }} />
          <div className="evt-skeleton-body__title evt-skeleton-item evt-skeleton-shimmer" style={{ width: '220px' }} />
          <div className="evt-skeleton-body__text evt-skeleton-item evt-skeleton-shimmer" />
          <div className="evt-skeleton-body__text--short evt-skeleton-item evt-skeleton-shimmer" />
        </div>
        <div className="evt-skeleton-body__right evt-skeleton-item evt-skeleton-shimmer" />
      </div>
    </div>
  );
};

export default EventSkeleton;
