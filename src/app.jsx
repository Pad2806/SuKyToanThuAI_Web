import React from 'react';
import { BrowserRouter } from 'react-router';
import { AppRoutes } from './router.jsx';
import { AppShell } from './components/layout/app-shell.jsx';
import { AuthProvider } from './lib/auth-context.jsx';

export const App = () => (
  <BrowserRouter>
    <AuthProvider>
      <AppShell>
        <AppRoutes />
      </AppShell>
    </AuthProvider>
  </BrowserRouter>
);

export default App;
