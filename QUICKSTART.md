# Quick Start Guide

## For Local Development

### Method 1: Run both frontend and backend together (Recommended)

```bash
# Install dependencies
npm install

# Start both frontend and backend
npm start
```

This will:
- Start the backend API server on port 3001
- Start the frontend React app on port 3000
- Automatically proxy API calls from frontend to backend

### Method 2: Run separately (Advanced)

**Terminal 1 - Start Backend API:**
```bash
npm run dev:api
```

**Terminal 2 - Start Frontend:**
```bash
npm run dev:frontend
```

## URLs

- **Frontend**: http://localhost:3000
- **Backend API**: http://localhost:3001/api
- **Health Check**: http://localhost:3001/api/health

## Troubleshooting

### API Not Found Error (404)

If you get "POST http://localhost:3000/api/compress 404 (Not Found)", make sure:

1. The backend API server is running on port 3001
2. The frontend has proxy configuration pointing to port 3001
3. Both servers are running together using `npm start`

### Port Already in Use

If you get "port already in use" errors:

```bash
# Kill processes on port 3000
npx kill-port 3000

# Kill processes on port 3001
npx kill-port 3001
```

### Fresh Start

```bash
# Stop all processes
pkill -f "node"
pkill -f "react-scripts"

# Clear node_modules and reinstall
rm -rf node_modules frontend/node_modules
npm install

# Start fresh
npm start
```

## Building for Production

```bash
npm run build
```

This creates a production build in `frontend/build/` ready for deployment.
