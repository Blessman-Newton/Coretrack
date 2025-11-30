# Deployment Guide - Fixing "Failed to Fetch" Error

## Problem

The application works locally but returns "failed to fetch" when deployed. This is typically caused by:

1. Incorrect API URL configuration in production
2. CORS issues between frontend and backend
3. Missing environment variables

## Solution

### 1. Frontend Configuration

The frontend now uses a consistent API configuration pattern. Make sure to set the correct environment variable for your deployment platform:

**For Netlify/Vercel/Other Static Hosts:**
Set the environment variable:

```
PUBLIC_API_BASE_URL=https://coretrack.onrender.com
```

**For Local Development:**

```
PUBLIC_API_BASE_URL=http://localhost:8000
```

### 2. Backend CORS Configuration

Your backend is already configured to allow requests from:

- `http://localhost:5173` (local Vite dev server)
- `http://localhost:3000` (local React dev server)
- `https://corepro.netlify.app` (your deployed frontend)

If your frontend is deployed to a different URL, update the `CORS_ORIGINS` in `backend/app/config.py`.

### 3. Deployment Steps

#### Frontend (Netlify)

1. Set environment variable: `PUBLIC_API_BASE_URL=https://coretrack.onrender.com`
2. Build and deploy

#### Backend (Render)

1. Ensure your backend is deployed and accessible at `https://coretrack.onrender.com`
2. Verify the CORS origins include your frontend URL

### 4. Testing

After deployment:

1. Open browser developer tools
2. Check the Network tab for API requests
3. Verify requests are going to the correct backend URL
4. Check for CORS errors in the console

### 5. Common Issues

- **Wrong API URL**: Check that `PUBLIC_API_BASE_URL` is set correctly
- **CORS Error**: Add your frontend domain to `CORS_ORIGINS` in backend config
- **SSL Issues**: Ensure both frontend and backend use HTTPS in production

## Files Modified

1. `frontend/src/services/api.ts` - Fixed API URL configuration
2. `frontend/.env.example` - Added environment variable example
3. `frontend/.env.production` - Production environment configuration
