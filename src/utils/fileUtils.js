import { writeFile, readdir } from 'fs/promises';
import path from 'path';
import AdmZip from 'adm-zip';

export async function downloadFile(url, destPath) {
  const res = await fetch(url);
  if (!res.ok) throw new Error(`Download failed: ${res.status}`);
  const file = await res.arrayBuffer();
  await writeFile(destPath, Buffer.from(file));
  return destPath;
}

export function extractZip(zipPath, outDir) {
  const zip = new AdmZip(zipPath);
  zip.extractAllTo(outDir, true);
  return outDir;
}

export function numericIndexFromName(name) {
  const m = name.match(/mask_(\d+)\.png$/);
  return m ? parseInt(m[1], 10) : -1;
}

export async function listMaskFrames(dir) {
  async function walk(current) {
    const entries = await readdir(current, { withFileTypes: true });
    const results = [];
    for (const ent of entries) {
      const full = path.join(current, ent.name);
      if (ent.isDirectory()) {
        results.push(...(await walk(full)));
      } else if (ent.isFile() && /mask_(\d+)\.png$/.test(ent.name)) {
        results.push(full);
      }
    }
    return results;
  }
  const masks = await walk(dir);
  masks.sort((a, b) => numericIndexFromName(path.basename(a)) - numericIndexFromName(path.basename(b)));
  return masks;
}