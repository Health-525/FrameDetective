import path from 'path';
import { readFile } from 'fs/promises';
import { llmService } from '../services/llmService.js';

export const extractFeatures = async (req, res) => {
  try {
    const { image } = req.body || {};
    if (!image || typeof image !== "string" || !image.trim()) {
      return res.status(400).json({ error: "image is required" });
    }
    
    let imageUrl = String(image).trim();
    
    // Handle local URLs
    if (imageUrl.includes('localhost') || imageUrl.includes('127.0.0.1')) {
      try {
        const filename = imageUrl.split('/uploads/').pop();
        if (filename) {
          const filePath = path.join(process.cwd(), 'public', 'uploads', filename);
          const fileBuffer = await readFile(filePath);
          const ext = path.extname(filename).substring(1);
          const base64Image = fileBuffer.toString('base64');
          imageUrl = `data:image/${ext === 'jpg' ? 'jpeg' : ext};base64,${base64Image}`;
          console.log(`Converted local image ${filename} to Base64.`);
        }
      } catch (err) {
        console.warn("Failed to convert local image to base64:", err);
      }
    }

    const result = await llmService.extractFeatures(imageUrl);
    res.json(result);

  } catch (error) {
    console.error("Extract features error:", error);
    res.status(500).json({ error: error.message });
  }
};