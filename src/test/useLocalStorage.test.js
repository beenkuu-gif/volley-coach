import { describe, it, expect, beforeEach } from 'vitest';
import { renderHook, act } from '@testing-library/react';
import { useLocalStorage } from '../hooks/useLocalStorage';

beforeEach(() => localStorage.clear());

describe('useLocalStorage', () => {
  it('returns initial value when key absent', () => {
    const { result } = renderHook(() => useLocalStorage('test-key', [1, 2]));
    expect(result.current[0]).toEqual([1, 2]);
  });

  it('persists value to localStorage', () => {
    const { result } = renderHook(() => useLocalStorage('test-key', []));
    act(() => result.current[1](['new']));
    expect(JSON.parse(localStorage.getItem('test-key'))).toEqual(['new']);
  });

  it('reads existing value from localStorage', () => {
    localStorage.setItem('test-key', JSON.stringify({ x: 1 }));
    const { result } = renderHook(() => useLocalStorage('test-key', {}));
    expect(result.current[0]).toEqual({ x: 1 });
  });

  it('supports functional updates', () => {
    const { result } = renderHook(() => useLocalStorage('test-key', [1]));
    act(() => result.current[1]((prev) => [...prev, 2]));
    expect(result.current[0]).toEqual([1, 2]);
  });
});
