import React from 'react';
import { Link } from 'react-router';

export const TopicEntry = ({ count, description, label, to }) => (
  <Link className="topic-entry" to={to}>
    <span>{label}</span>
    {description && <em>{description}</em>}
    {Number.isFinite(count) && <small>{count} sự kiện</small>}
  </Link>
);

export default TopicEntry;
