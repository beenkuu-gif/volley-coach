export function servePercent(s) {
  if (!s || s.total === 0) return 0;
  return Math.round((s.ace / s.total) * 100);
}

export function attackPercent(s) {
  if (!s || s.total === 0) return 0;
  return Math.round((s.kill / s.total) * 100);
}

export function receptionPositivePercent(s) {
  if (!s || s.total === 0) return 0;
  return Math.round(((s.perfect + s.good) / s.total) * 100);
}

export function blockPercent(s) {
  if (!s || s.total === 0) return 0;
  return Math.round((s.point / s.total) * 100);
}

export function defensePercent(s) {
  if (!s || s.total === 0) return 0;
  return Math.round((s.success / s.total) * 100);
}

export function emptyPlayerStats() {
  return {
    serve:     { total: 0, ace: 0, error: 0, inPlay: 0 },
    attack:    { total: 0, kill: 0, error: 0, blocked: 0, inPlay: 0 },
    block:     { total: 0, point: 0, error: 0 },
    reception: { total: 0, perfect: 0, good: 0, error: 0 },
    defense:   { total: 0, success: 0, error: 0 },
  };
}

export function rotateCourt(lineup) {
  return {
    1: lineup[2], 2: lineup[3], 3: lineup[4],
    4: lineup[5], 5: lineup[6], 6: lineup[1],
  };
}

export function matchScore(sets) {
  if (!sets || sets.length === 0) return { us: 0, them: 0 };
  return sets.reduce(
    (acc, set) => ({
      us:   acc.us   + (set.us > set.them ? 1 : 0),
      them: acc.them + (set.them > set.us  ? 1 : 0),
    }),
    { us: 0, them: 0 }
  );
}
