import { test } from 'node:test';

test('import index', async () => {
  await import('./index.ts');
});
