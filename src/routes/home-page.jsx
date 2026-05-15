import React, { useEffect, useState } from 'react';
import { HistoryScrolly } from '../components/discovery/history-scrolly.jsx';
import { FinalCta } from '../components/discovery/final-cta.jsx';
import { loadAllEras, loadAllEvents } from '../lib/event-queries.js';

export const HomePage = () => {
  const [contentVersion, setContentVersion] = useState(0);

  useEffect(() => {
    let cancelled = false;
    Promise.all([loadAllEras(), loadAllEvents()]).finally(() => {
      if (!cancelled) setContentVersion((version) => version + 1);
    });
    return () => { cancelled = true; };
  }, []);

  return (
    <>
      <HistoryScrolly key={contentVersion} />
      <FinalCta />
    </>
  );
};

export default HomePage;
