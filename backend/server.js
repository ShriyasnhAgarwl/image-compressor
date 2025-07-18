const express = require('express');
const multer = require('multer');
const sharp = require('sharp');
const cors = require('cors');
const helmet = require('helmet');
const path = require('path');
const fs = require('fs');

const app = express();
const PORT = process.env.PORT || 3001;

// Middleware
app.use(helmet());
app.use(cors({
  origin: process.env.FRONTEND_URL || 'http://localhost:3000',
  credentials: true
}));
app.use(express.json());

// Create uploads directory if it doesn't exist
const uploadsDir = path.join(__dirname, 'uploads');
if (!fs.existsSync(uploadsDir)) {
  fs.mkdirSync(uploadsDir, { recursive: true });
}

// Configure multer for file uploads
const storage = multer.memoryStorage();
const upload = multer({
  storage: storage,
  limits: {
    fileSize: 10 * 1024 * 1024, // 10MB limit
  },
  fileFilter: (req, file, cb) => {
    if (file.mimetype.startsWith('image/')) {
      cb(null, true);
    } else {
      cb(new Error('Only image files are allowed!'), false);
    }
  },
});

// Helper function to compress image to target size
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

// Image compression endpoint
app.post('/compress', upload.single('image'), async (req, res) => {
  try {
    if (!req.file) {
      return res.status(400).json({ error: 'No image file provided' });
    }

    const targetSize = parseInt(req.body.targetSize);
    if (!targetSize || targetSize <= 0) {
      return res.status(400).json({ error: 'Invalid target size' });
    }

    const originalBuffer = req.file.buffer;
    const originalSize = originalBuffer.length;

    // Get original image metadata
    const metadata = await sharp(originalBuffer).metadata();
    
    // Compress image to target size
    const compressedBuffer = await compressImageToSize(originalBuffer, targetSize);
    const compressedSize = compressedBuffer.length;

    // Convert to base64 for frontend
    const compressedBase64 = `data:image/jpeg;base64,${compressedBuffer.toString('base64')}`;

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
});

// Health check endpoint
app.get('/health', (req, res) => {
  res.json({ status: 'OK', timestamp: new Date().toISOString() });
});

// Error handling middleware
app.use((error, req, res, next) => {
  if (error instanceof multer.MulterError) {
    if (error.code === 'LIMIT_FILE_SIZE') {
      return res.status(400).json({ error: 'File too large' });
    }
  }
  
  console.error('Server error:', error);
  res.status(500).json({ error: 'Internal server error' });
});

app.listen(PORT, () => {
  console.log(`Server running on port ${PORT}`);
});
