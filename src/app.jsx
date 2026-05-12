import React from 'react';
import { BrowserRouter } from 'react-router';
import { AppRoutes } from './router.jsx';
import { AppShell } from './components/layout/app-shell.jsx';

export const App = () => (
  <BrowserRouter>
    <AppShell>
      <AppRoutes />
    </AppShell>
  </BrowserRouter>
);

export default App;
