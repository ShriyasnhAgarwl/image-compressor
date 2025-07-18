# Deployment Guide for Image Compressor

## Vercel Deployment (Recommended)

This project is configured for easy deployment on Vercel with both frontend and backend in one app.

### Quick Deploy

1. **Push to GitHub:**
   ```bash
   git add .
   git commit -m "Ready for Vercel deployment"
   git push origin main
   ```

2. **Deploy to Vercel:**
   - Go to [vercel.com](https://vercel.com)
   - Click "New Project"
   - Import your GitHub repository
   - Vercel will automatically detect the configuration
   - Click "Deploy"

### Manual Configuration (if needed)

If automatic detection doesn't work:

- **Framework Preset:** Other
- **Build Command:** `cd frontend && npm run build`
- **Output Directory:** `frontend/build`
- **Install Command:** `npm install`

### Environment Variables

No environment variables are required for basic deployment. The app uses relative API paths.

For custom configurations, you can set:
- `REACT_APP_API_URL` (defaults to `/api`)

### API Routes

The backend API is available at:
- `POST /api/compress` - Compress images
- `GET /api/health` - Health check

### Project Structure

```
image-compressor/
├── api/                    # Vercel serverless functions
│   ├── compress.js        # Image compression endpoint
│   └── health.js          # Health check endpoint
├── frontend/              # React frontend
│   ├── src/
│   ├── public/
│   └── package.json
├── package.json           # Root package.json with API dependencies
└── vercel.json           # Vercel configuration
```

### Local Development

For local development with the new structure:

```bash
# Install dependencies
npm install

# Start development server
npm run dev
```

This will start the React app on `http://localhost:3000` and the API will be available at `http://localhost:3000/api/*`.

### Features

- ✅ Single deployment for both frontend and backend
- ✅ Serverless API functions
- ✅ Automatic HTTPS
- ✅ Custom domain support
- ✅ Automatic deployments from GitHub
- ✅ Built-in CDN
- ✅ Free tier available

### Vercel Free Tier Limits

- 100 GB bandwidth per month
- 1,000 serverless function invocations per day
- 10 second function timeout
- 50 MB function size limit

Perfect for a portfolio project or small-scale use!
