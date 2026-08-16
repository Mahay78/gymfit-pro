import { describe, it, expect } from 'vitest';
import { importDatabaseFromJson } from '../backupRestore';

describe('backupRestore', () => {
  it('rejects invalid JSON backup format', async () => {
    const invalidJson = JSON.stringify({ app: 'OtherApp', data: {} });
    const result = await importDatabaseFromJson(invalidJson);
    expect(result.success).toBe(false);
  });
});
