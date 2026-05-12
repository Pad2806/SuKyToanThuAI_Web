import React from 'react';
import { getAllTopics, getEventsByTopic } from '../../lib/event-queries.js';
import { TopicEntry } from './topic-entry.jsx';

export const ThematicCollections = () => (
  <section className="thematic-collections section-parchment">
    <div className="discovery-inner">
      <p className="section-kicker">Chủ đề</p>
      <h2>Bộ sưu tập theo mạch học</h2>
      <div className="collection-strip">
        {getAllTopics().map((topic) => (
          <TopicEntry
            count={getEventsByTopic(topic.slug).length}
            description={topic.description}
            key={topic.slug}
            label={topic.name}
            to={`/chu-de/${topic.slug}`}
          />
        ))}
      </div>
    </div>
  </section>
);

export default ThematicCollections;
