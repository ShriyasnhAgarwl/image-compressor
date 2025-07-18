import formidable from 'formidable';
import sharp from 'sharp';
import fs from 'fs';

export const config = {
  api: {
    bodyParser: false,
  },
};

export default async function handler(req, res) {
  if (req.method !== 'POST') {
    return res.status(405).json({ error: 'Method not allowed' });
  }

  // Set CORS headers
  res.setHeader('Access-Control-Allow-Origin', '*');
  res.setHeader('Access-Control-Allow-Methods', 'POST, OPTIONS');
  res.setHeader('Access-Control-Allow-Headers', 'Content-Type');

  if (req.method === 'OPTIONS') {
    return res.status(200).end();
  }

  try {
    const form = formidable({
      maxFileSize: 10 * 1024 * 1024, // 10MB
    });

    const [fields, files] = await form.parse(req);
    
    const targetSize = parseInt(fields.targetSize?.[0] || '100');
    if (!targetSize || targetSize <= 0) {
      return res.status(400).json({ error: 'Invalid target size' });
    }

    const imageFile = files.image?.[0];
    if (!imageFile) {
      return res.status(400).json({ error: 'No image file provided' });
    }

    // Read the uploaded file
    const originalBuffer = await fs.promises.readFile(imageFile.filepath);
    const originalSize = originalBuffer.length;

    // Get original image metadata
    const metadata = await sharp(originalBuffer).metadata();
    
    // Compress image to target size
    const compressedBuffer = await compressImageToSize(originalBuffer, targetSize);
    const compressedSize = compressedBuffer.length;

    // Convert to base64 for frontend
    const compressedBase64 = `data:image/jpeg;base64,${compressedBuffer.toString('base64')}`;

    // Clean up uploaded file
    await fs.promises.unlink(imageFile.filepath);

    res.json({
      success: true,
      originalSize: Math.round(originalSize / 1024), // KB
      compressedSize: Math.round(compressedSize / 1024), // KB
      compressionRatio: Math.round((1 - compressedSize / originalSize) * 100), // %
      originalDimensions: {
        width: metadata.width,
        height: metadata.height
      },
      compressedImage: compressedBase64
    });

  } catch (error) {
    console.error('Compression error:', error);
    res.status(500).json({ error: 'Failed to compress image' });
  }
}

async function compressImageToSize(buffer, targetSizeKB, format = 'jpeg') {
  const targetSizeBytes = targetSizeKB * 1024;
  let quality = 80;
  let compressed;
  
  // Start with initial compression
  compressed = await sharp(buffer)
    .jpeg({ quality: quality })
    .toBuffer();
  
  // If still too large, reduce quality iteratively
  while (compressed.length > targetSizeBytes && quality > 10) {
    quality -= 5;
    compressed = await sharp(buffer)
      .jpeg({ quality: quality })
      .toBuffer();
  }
  
  // If still too large, resize the image
  if (compressed.length > targetSizeBytes) {
    const metadata = await sharp(buffer).metadata();
    let width = metadata.width;
    let height = metadata.height;
    
    while (compressed.length > targetSizeBytes && width > 100) {
      width = Math.floor(width * 0.9);
      height = Math.floor(height * 0.9);
      
      compressed = await sharp(buffer)
        .resize(width, height)
        .jpeg({ quality: quality })
        .toBuffer();
    }
  }
  
  return compressed;
}
