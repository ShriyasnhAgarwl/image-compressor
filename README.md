# Image Compressor

A full-stack web application for compressing images to specific file sizes. Built with React frontend and Node.js backend, designed for easy deployment on Vercel.

## Features

- 🖼️ **Smart Image Compression**: Compress images to specific target sizes (KB)
- 📱 **Responsive Design**: Works on desktop and mobile devices
- 🎯 **Drag & Drop Interface**: Easy file upload with drag and drop support
- 📊 **Compression Statistics**: View original vs compressed file sizes and compression ratios
- 💾 **Instant Download**: Download compressed images immediately
- 🚀 **Fast Processing**: Optimized image processing with Sharp library
- 🔒 **Client-side Processing**: No images stored on server (processed in memory)

## Supported Formats

- **Input**: JPG, PNG, GIF, WebP
- **Output**: JPEG (optimized for web)

## Technology Stack

- **Frontend**: React, TypeScript, Axios
- **Backend**: Node.js, Express, Sharp, Multer
- **Deployment**: Vercel (Serverless Functions)
- **Image Processing**: Sharp library

## Quick Start

### Prerequisites

- Node.js 18.0.0 or higher
- npm or yarn

### Installation

1. **Clone the repository**
   ```bash
   git clone https://github.com/ShriyasnhAgarwl/image-compressor.git
   cd image-compressor
   ```

2. **Install dependencies**
   ```bash
   npm install
   ```

3. **Start development server**
   ```bash
   npm run dev:local
   ```

4. **Open your browser**
   - Frontend: http://localhost:3000
   - API: http://localhost:3001/api

## Development

### Available Scripts

- `npm run dev:local` - Start both frontend and backend for local development
- `npm run dev` - Start only the frontend
- `npm run dev:api` - Start only the backend API
- `npm run build` - Build the frontend for production
- `npm run dev:vercel` - Start Vercel development server

### Project Structure

```
image-compressor/
├── api/                    # Vercel serverless functions
│   ├── compress.js        # Image compression endpoint
│   └── health.js          # Health check endpoint
├── frontend/              # React frontend
│   ├── src/
│   │   ├── App.tsx        # Main React component
│   │   ├── App.css        # Styling
│   │   └── index.tsx      # Entry point
│   ├── public/
│   └── package.json
├── backend/               # Standalone backend (optional)
├── dev-server.js          # Local development server
├── package.json           # Root dependencies
├── vercel.json           # Vercel configuration
└── README.md
```

## Deployment

### Vercel (Recommended)

1. **Push to GitHub**
   ```bash
   git add .
   git commit -m "Ready for deployment"
   git push origin main
   ```

2. **Deploy to Vercel**
   - Go to [vercel.com](https://vercel.com)
   - Click "New Project"
   - Import your GitHub repository
   - Vercel will automatically detect the configuration
   - Click "Deploy"

3. **Access your app**
   - Your app will be available at `https://your-project-name.vercel.app`

### Local Production Build

```bash
npm run build
```

The build artifacts will be stored in the `frontend/build` directory.

## API Documentation

### POST /api/compress

Compress an image to a target file size.

**Request:**
- Method: POST
- Content-Type: multipart/form-data
- Body:
  - `image`: Image file (max 10MB)
  - `targetSize`: Target size in KB (number)

**Response:**
```json
{
  "success": true,
  "originalSize": 1500,
  "compressedSize": 100,
  "compressionRatio": 93,
  "originalDimensions": {
    "width": 1920,
    "height": 1080
  },
  "compressedImage": "data:image/jpeg;base64,..."
}
```

### GET /api/health

Health check endpoint.

**Response:**
```json
{
  "status": "OK",
  "timestamp": "2024-01-01T00:00:00.000Z",
  "service": "Image Compressor API"
}
```

## Configuration

### Environment Variables

- `REACT_APP_API_URL`: API base URL (defaults to `/api`)

### Vercel Configuration

The `vercel.json` file contains the deployment configuration:

```json
{
  "buildCommand": "cd frontend && npm run build",
  "outputDirectory": "frontend/build",
  "installCommand": "npm install",
  "functions": {
    "api/compress.js": {
      "maxDuration": 30
    }
  }
}
```

## Contributing

1. Fork the repository
2. Create a feature branch (`git checkout -b feature/amazing-feature`)
3. Commit your changes (`git commit -m 'Add some amazing feature'`)
4. Push to the branch (`git push origin feature/amazing-feature`)
5. Open a Pull Request

## License

This project is licensed under the MIT License - see the [LICENSE](LICENSE) file for details.

## Support

If you encounter any issues or have questions, please [open an issue](https://github.com/ShriyasnhAgarwl/image-compressor/issues) on GitHub.

## Acknowledgments

- [Sharp](https://sharp.pixelplumbing.com/) for image processing
- [React](https://reactjs.org/) for the frontend framework
- [Vercel](https://vercel.com/) for hosting and deployment
