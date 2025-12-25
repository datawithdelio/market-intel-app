function toNum(v) {
  const n = Number(v);
  return Number.isFinite(n) ? n : null;
}

// percent change from prev to current
function pctChange(prev, curr) {
  const p = toNum(prev);
  const c = toNum(curr);
  if (p === null || c === null) return null;
  if (p === 0) return null;
  return ((c - p) / p) * 100;
}

// Input: array of observations sorted DESC (latest first)
// Expect at least 13 points: latest + ~12 months ago
function yoyFromIndex(windowObs) {
  if (!Array.isArray(windowObs) || windowObs.length < 2) {
    return { value: null, change: null, asOfDate: null };
  }

  // If it's DESC: [0] = latest, [12] = 12 months ago (if present)
  const latest = windowObs[0];
  const prior = windowObs[Math.min(12, windowObs.length - 1)];

  const latestVal = toNum(latest?.value);
  const priorVal = toNum(prior?.value);

  if (latestVal === null || priorVal === null || priorVal === 0) {
    return { value: null, change: null, asOfDate: latest?.date ?? null };
  }

  const yoy = ((latestVal - priorVal) / priorVal) * 100;

  // "change" = YoY change vs previous YoY (optional)
  // We'll compute it if we have 13+2 points (i.e., 14+)
  let yoyPrev = null;
  if (windowObs.length >= 14) {
    const latestPrev = windowObs[1];
    const priorPrev = windowObs[Math.min(13, windowObs.length - 1)];
    const lp = toNum(latestPrev?.value);
    const pp = toNum(priorPrev?.value);
    if (lp !== null && pp !== null && pp !== 0) {
      yoyPrev = ((lp - pp) / pp) * 100;
    }
  }

  return {
    value: yoy,
    change: yoyPrev === null ? null : yoy - yoyPrev,
    asOfDate: latest?.date ?? null,
  };
}

module.exports = { pctChange, yoyFromIndex };
