import React from 'react';

export const AiPageBg = ({ image = '/images/generated/parchment.png' }) => (
  <div className="ai-page-bg" aria-hidden="true">
    <img src={image} alt="" />
    <div className="ai-page-bg__vignette" />
    <div className="ai-page-bg__pattern" />
  </div>
);

export default AiPageBg;
