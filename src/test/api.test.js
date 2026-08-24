import { describe, it, expect, vi, beforeEach } from 'vitest';

// Mock fetch globally
const mockFetch = vi.fn();
global.fetch = mockFetch;

beforeEach(() => {
  mockFetch.mockReset();
  localStorage.clear();
});

describe('api service', () => {
  it('sends GET with Authorization header when token set', async () => {
    const { default: api } = await import('../services/api.js');
    api.setToken('test-token');
    mockFetch.mockResolvedValueOnce({ ok: true, json: async () => ({ data: 1 }) });
    await api.get('/test');
    expect(mockFetch).toHaveBeenCalledWith(
      expect.stringContaining('/test'),
      expect.objectContaining({ headers: expect.objectContaining({ Authorization: 'Bearer test-token' }) })
    );
    api.clearToken();
  });

  it('throws error message on non-ok response', async () => {
    const { default: api } = await import('../services/api.js');
    mockFetch.mockResolvedValueOnce({ ok: false, json: async () => ({ error: 'Brak dostępu' }) });
    await expect(api.get('/test')).rejects.toMatchObject({ message: 'Brak dostępu' });
  });
});
