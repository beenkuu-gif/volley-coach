import { describe, it, expect } from 'vitest';
import {
  servePercent, attackPercent, receptionPositivePercent,
  blockPercent, defensePercent, emptyPlayerStats,
  rotateCourt, matchScore,
} from '../utils/stats';

describe('servePercent', () => {
  it('returns 0 when total is 0', () => {
    expect(servePercent({ total: 0, ace: 0, error: 0, inPlay: 0 })).toBe(0);
  });
  it('returns ace% rounded', () => {
    expect(servePercent({ total: 10, ace: 3, error: 2, inPlay: 5 })).toBe(30);
  });
});

describe('attackPercent', () => {
  it('returns kill% rounded', () => {
    expect(attackPercent({ total: 10, kill: 4, error: 2, blocked: 1, inPlay: 3 })).toBe(40);
  });
});

describe('receptionPositivePercent', () => {
  it('sums perfect+good over total', () => {
    expect(receptionPositivePercent({ total: 10, perfect: 3, good: 4, error: 3 })).toBe(70);
  });
});

describe('rotateCourt', () => {
  it('shifts players: pos2 becomes pos1, pos1 becomes pos6', () => {
    const lineup = { 1: 'p1', 2: 'p2', 3: 'p3', 4: 'p4', 5: 'p5', 6: 'p6' };
    const rotated = rotateCourt(lineup);
    expect(rotated[1]).toBe('p2');
    expect(rotated[6]).toBe('p1');
    expect(rotated[2]).toBe('p3');
  });
});

describe('matchScore', () => {
  it('counts won sets for each side', () => {
    const sets = [
      { us: 25, them: 18 },
      { us: 22, them: 25 },
      { us: 25, them: 20 },
    ];
    expect(matchScore(sets)).toEqual({ us: 2, them: 1 });
  });
  it('returns 0:0 for empty sets', () => {
    expect(matchScore([])).toEqual({ us: 0, them: 0 });
  });
});

describe('emptyPlayerStats', () => {
  it('returns zeroed stat structure', () => {
    const s = emptyPlayerStats();
    expect(s.serve.total).toBe(0);
    expect(s.attack.kill).toBe(0);
    expect(s.reception.perfect).toBe(0);
  });
});
