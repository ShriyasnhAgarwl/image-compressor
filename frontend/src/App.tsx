import React, { useState, useCallback } from 'react';
import axios from 'axios';
import './App.css';

function App() {
  const [image, setImage] = useState<File | null>(null);
  const [preview, setPreview] = useState<string | null>(null);
  const [compressedImage, setCompressedImage] = useState<string | null>(null);
  const [targetSize, setTargetSize] = useState<number>(100);
  const [loading, setLoading] = useState<boolean>(false);
  const [error, setError] = useState<string | null>(null);
  const [info, setInfo] = useState<{originalSize: number, compressedSize: number, compressionRatio: number} | null>(null);
  const [isDragging, setIsDragging] = useState(false);

  const handleFileSelect = useCallback((file: File) => {
    setImage(file);
    setError(null);
    setCompressedImage(null);
    setInfo(null);
    
    // Create preview
    const reader = new FileReader();
    reader.onload = (e) => {
      setPreview(e.target?.result as string);
    };
    reader.readAsDataURL(file);
  }, []);

  const handleFileChange = (event: React.ChangeEvent<HTMLInputElement>) => {
    const files = event.target.files;
    if (files && files[0]) {
      handleFileSelect(files[0]);
    }
  };

  const handleDragOver = (e: React.DragEvent) => {
    e.preventDefault();
    setIsDragging(true);
  };

  const handleDragLeave = (e: React.DragEvent) => {
    e.preventDefault();
    setIsDragging(false);
  };

  const handleDrop = (e: React.DragEvent) => {
    e.preventDefault();
    setIsDragging(false);
    
    const files = e.dataTransfer.files;
    if (files && files[0] && files[0].type.startsWith('image/')) {
      handleFileSelect(files[0]);
    }
  };

  const handleUpload = async () => {
    if (!image) return;

    setLoading(true);
    setError(null);
    setCompressedImage(null);

    const formData = new FormData();
    formData.append('image', image);
    formData.append('targetSize', targetSize.toString());

    try {
      const API_URL = process.env.REACT_APP_API_URL || '/api';
      const response = await axios.post(`${API_URL}/compress`, formData);
      setCompressedImage(response.data.compressedImage);
      setInfo({
        originalSize: response.data.originalSize,
        compressedSize: response.data.compressedSize,
        compressionRatio: response.data.compressionRatio
      });
    } catch (err) {
      setError('Failed to compress the image. Please try again.');
    }

    setLoading(false);
  };

  const downloadImage = () => {
    if (!compressedImage) return;
    
    const link = document.createElement('a');
    link.href = compressedImage;
    link.download = `compressed_${image?.name || 'image'}.jpg`;
    link.click();
  };

  const quickSizeSelect = (size: number) => {
    setTargetSize(size);
  };

  return (
    <div className="App">
      <div className="container">
        <h1>Image Compressor</h1>
        <p className="subtitle">Compress your images to specific file sizes</p>
        
        <div 
          className={`drop-zone ${isDragging ? 'dragging' : ''}`}
          onDragOver={handleDragOver}
          onDragLeave={handleDragLeave}
          onDrop={handleDrop}
        >
          <input 
            type="file" 
            onChange={handleFileChange} 
            accept="image/*" 
            id="file-input"
            className="file-input"
          />
          <label htmlFor="file-input" className="file-label">
            <div className="upload-content">
              <svg className="upload-icon" viewBox="0 0 24 24" width="48" height="48">
                <path d="M12 2L13.09 8.26L20 9L13.09 9.74L12 16L10.91 9.74L4 9L10.91 8.26L12 2Z" fill="currentColor"/>
              </svg>
              <p>Drop your image here or click to browse</p>
              <p className="file-types">Supports JPG, PNG, GIF, WebP</p>
            </div>
          </label>
        </div>

        {preview && (
          <div className="preview-section">
            <h3>Original Image</h3>
            <img src={preview} alt="Preview" className="preview-image" />
            <p className="file-info">{image?.name} - {Math.round((image?.size || 0) / 1024)} KB</p>
          </div>
        )}

        {image && (
          <div className="controls">
            <div className="size-controls">
              <label>
                Target Size (KB):
                <input 
                  type="number" 
                  value={targetSize} 
                  onChange={(e) => setTargetSize(Number(e.target.value))} 
                  min="10" 
                  max="5000" 
                  className="size-input"
                />
              </label>
              <div className="quick-sizes">
                <button onClick={() => quickSizeSelect(10)} className="size-btn">10KB</button>
                <button onClick={() => quickSizeSelect(50)} className="size-btn">50KB</button>
                <button onClick={() => quickSizeSelect(100)} className="size-btn">100KB</button>
                <button onClick={() => quickSizeSelect(200)} className="size-btn">200KB</button>
                <button onClick={() => quickSizeSelect(500)} className="size-btn">500KB</button>
              </div>
            </div>
            <button 
              onClick={handleUpload} 
              disabled={loading || !image} 
              className="compress-btn"
            >
              {loading ? 'Compressing...' : 'Compress Image'}
            </button>
          </div>
        )}

        {error && <div className="error">{error}</div>}
        
        {compressedImage && (
          <div className="result-section">
            <h3>Compressed Image</h3>
            <img src={compressedImage} alt="Compressed result" className="result-image" />
            {info && (
              <div className="compression-info">
                <div className="info-grid">
                  <div className="info-item">
                    <span className="info-label">Original Size:</span>
                    <span className="info-value">{info.originalSize} KB</span>
                  </div>
                  <div className="info-item">
                    <span className="info-label">Compressed Size:</span>
                    <span className="info-value">{info.compressedSize} KB</span>
                  </div>
                  <div className="info-item">
                    <span className="info-label">Compression Ratio:</span>
                    <span className="info-value">{info.compressionRatio}%</span>
                  </div>
                </div>
              </div>
            )}
            <button onClick={downloadImage} className="download-btn">
              Download Compressed Image
            </button>
          </div>
        )}
      </div>
    </div>
  );
}

export default App;
