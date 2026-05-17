import { readFileSync } from 'node:fs';
import { describe, expect, it } from 'vitest';

describe('admin route wiring', () => {
  it('maps /admin to the Admin Event Studio page', () => {
    const routerSource = readFileSync(new URL('../src/router.jsx', import.meta.url), 'utf8');

    expect(routerSource).toContain("const AdminPage = lazy(() => import('./routes/admin-page.jsx'))");
    expect(routerSource).toContain('<Route path="/admin" element={<AdminPage />} />');
  });
});
