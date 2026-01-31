import path from 'path';
import { mkdir } from 'fs/promises';
import { replicateService } from '../services/replicateService.js';
import { downloadFile, extractZip } from '../utils/fileUtils.js';
import { computePresenceSeries, presenceToSegments } from '../utils/imageUtils.js';
import { config } from '../config/env.js';

export const runVideoTask = async (req, res) => {
  try {
    const { video, prompt, mask_color, mask_opacity, mask_only, return_zip, area_threshold, min_run } = req.body;

    if (!video) {
      return res.status(400).json({ error: "Video URL is required" });
    }

    const sanitizedVideo = video.replace(/`/g, '').trim();
    const input = {
      video: sanitizedVideo,
      prompt: prompt || "object",
      mask_color: mask_color || "red",
      mask_opacity: mask_opacity !== undefined ? parseFloat(mask_opacity) : 0.8,
      mask_only: Boolean(mask_only),
      return_zip: Boolean(return_zip)
    };

    const output = await replicateService.runSam3(input);
    
    // Normalize output to URL string
    let outputUrl;
    if (typeof output === 'string') {
      outputUrl = output;
    } else if (output && typeof output.url === 'function') {
      outputUrl = output.url().href;
    } else if (output && output.href) {
      outputUrl = output.href;
    } else {
      outputUrl = String(output);
    }

    const timestamp = new Date().toISOString().replace(/[:.]/g, '-');
    const videoUrlObj = new URL(sanitizedVideo);
    const baseVideoName = (videoUrlObj.pathname.split('/').pop() || 'video').replace(/\.[^/.]+$/, '');
    const promptName = (prompt || 'default').toLowerCase().replace(/[^a-z0-9]+/g, '-').replace(/^-+|-+$/g, '');
    const outName = `output_${promptName}_${baseVideoName}_${timestamp}.${return_zip ? 'zip' : 'mp4'}`;

    if (Boolean(return_zip)) {
      const outputsDir = path.join(process.cwd(), 'outputs');
      await mkdir(outputsDir, { recursive: true });
      const zipPath = path.join(outputsDir, outName);
      
      await downloadFile(outputUrl, zipPath);
      
      const baseName = outName.replace(/\.zip$/, '');
      const extractDir = path.join(outputsDir, baseName);
      extractZip(zipPath, extractDir);

      const parsedAreaThreshold = typeof area_threshold === 'number' || typeof area_threshold === 'string'
        ? Number(area_threshold)
        : undefined;
      const ratioThreshold = Number.isFinite(parsedAreaThreshold) ? parsedAreaThreshold : undefined;
      const minRun = Number.isFinite(Number(min_run)) ? Number(min_run) : 2;

      const { presence, ratios } = await computePresenceSeries(extractDir, {
        thresholdPixels: ratioThreshold === undefined ? 1000 : undefined,
        ratioThreshold,
        withRatios: true
      });
      const segments = presenceToSegments(presence, minRun);
      const appearances = segments.length;
      const maxRatio = ratios.length ? Math.max(...ratios) : 0;
      const confidence = Math.round(maxRatio * 100);
      
      // Run second pass for video if ZIP requested
      const inputVideoMode = { ...input, return_zip: false };
      const outputVideo = await replicateService.runSam3(inputVideoMode);
      
      let outputVideoUrl;
      if (typeof outputVideo === 'string') {
        outputVideoUrl = outputVideo;
      } else if (outputVideo && typeof outputVideo.url === 'function') {
        outputVideoUrl = outputVideo.url().href;
      } else if (outputVideo && outputVideo.href) {
        outputVideoUrl = outputVideo.href;
      } else {
        outputVideoUrl = String(outputVideo);
      }
      
      console.log("ZIP mode summary:", { filename: outName, appearances, total_frames: presence.length });
      
      res.json({
        url: outputUrl,
        zip_url: outputUrl,
        video_url: outputVideoUrl,
        filename: outName,
        appearances,
        segments,
        total_frames: presence.length,
        max_ratio: maxRatio,
        confidence
      });
    } else {
      console.log("Video mode summary:", { filename: outName, url: outputUrl });
      res.json({ 
        url: outputUrl, 
        filename: outName
      });
    }

  } catch (error) {
    console.error("API Error:", error);
    res.status(500).json({ error: error.message });
  }
};

export const analyzeZip = async (req, res) => {
  try {
    const { zip_url, threshold, min_run } = req.body || {};
    if (!zip_url) {
      return res.status(400).json({ error: "zip_url is required" });
    }
    
    console.log("Analyze ZIP start:", { zip_url, threshold, min_run });
    const outputsDir = path.join(process.cwd(), 'outputs');
    await mkdir(outputsDir, { recursive: true });
    
    const timestamp = new Date().toISOString().replace(/[:.]/g, '-');
    const outName = `analyze_${timestamp}.zip`;
    const zipPath = path.join(outputsDir, outName);
    
    await downloadFile(String(zip_url).trim(), zipPath);
    
    const baseName = outName.replace(/\.zip$/, '');
    const extractDir = path.join(outputsDir, baseName);
    extractZip(zipPath, extractDir);
    
    const thr = Number.isFinite(Number(threshold)) ? Number(threshold) : 1000;
    const mr = Number.isFinite(Number(min_run)) ? Number(min_run) : 2;
    
    const { presence, ratios } = await computePresenceSeries(extractDir, {
      thresholdPixels: thr,
      withRatios: true
    });
    const segments = presenceToSegments(presence, mr);
    const appearances = segments.length;
    const maxRatio = ratios.length ? Math.max(...ratios) : 0;
    const confidence = Math.round(maxRatio * 100);
    
    console.log("Analyze ZIP result:", { appearances, total_frames: presence.length });
    
    res.json({
      zip_url,
      filename: outName,
      appearances,
      segments,
      total_frames: presence.length,
      max_ratio: maxRatio,
      confidence
    });
  } catch (error) {
    console.error("Analyze ZIP Error:", error);
    res.status(500).json({ error: error.message });
  }
};
