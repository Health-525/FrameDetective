import sharp from 'sharp';
import { listMaskFrames } from './fileUtils.js';

export async function maskPixelCount(file) {
  const img = sharp(file).ensureAlpha();
  const { width, height } = await img.metadata();
  const raw = await img.raw().toBuffer();
  let count = 0;
  for (let i = 0; i < raw.length; i += 4) {
    const r = raw[i];
    const g = raw[i + 1];
    const b = raw[i + 2];
    const a = raw[i + 3];
    if (a > 0 && (r > 0 || g > 0 || b > 0)) count++;
  }
  return { count, total: width * height };
}

export async function computePresenceWithStats(dir, options = {}) {
  const { thresholdPixels, ratioThreshold } = options;
  const masks = await listMaskFrames(dir);
  const series = [];
  const ratios = [];
  for (const m of masks) {
    const { count, total } = await maskPixelCount(m);
    const ratio = total ? count / total : 0;
    ratios.push(ratio);
    let present;
    if (typeof ratioThreshold === 'number' && !Number.isNaN(ratioThreshold)) {
      present = ratio >= ratioThreshold;
    } else {
      const thr = typeof thresholdPixels === 'number' && !Number.isNaN(thresholdPixels) ? thresholdPixels : 0;
      present = count >= thr;
    }
    series.push(present);
  }
  return { presence: series, ratios };
}

export async function computePresenceSeries(dir, options) {
  const { presence, ratios } = await computePresenceWithStats(dir, options || {});
  if (options && options.withRatios) {
    return { presence, ratios };
  }
  return presence;
}

export function presenceToSegments(presence, minRun) {
  const segments = [];
  let runTrue = 0;
  let runFalse = 0;
  let inScene = false;
  let startIdx = -1;
  for (let i = 0; i < presence.length; i++) {
    const p = presence[i];
    if (p) {
      runTrue += 1;
      runFalse = 0;
      if (!inScene && runTrue >= minRun) {
        inScene = true;
        startIdx = i - minRun + 1;
      }
    } else {
      runFalse += 1;
      runTrue = 0;
      if (inScene && runFalse >= minRun) {
        inScene = false;
        const endIdx = i - runFalse;
        segments.push({ start_index: startIdx, end_index: endIdx });
        startIdx = -1;
      }
    }
  }
  if (inScene && startIdx >= 0) {
    segments.push({ start_index: startIdx, end_index: presence.length - 1 });
  }
  return segments;
}
