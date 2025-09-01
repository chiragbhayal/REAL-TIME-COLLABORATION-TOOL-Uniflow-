# 🚀 Deployment Guide - Render + Vercel

## Prerequisites

1. **MongoDB Atlas Setup**
   - Update the password in `/server/.env` from `yourpassword` to your actual MongoDB password
   - Ensure your MongoDB Atlas cluster allows connections from anywhere (0.0.0.0/0) for production

2. **GitHub Repository**
   - Push your code to a GitHub repository
   - Ensure all files are committed including the new deployment configurations

## Deployment Steps

### 1. Deploy Backend to Render (Web Service)

1. Go to [Render Dashboard](https://dashboard.render.com)
2. Click "New +" → "Web Service"
3. Connect your GitHub repository
4. Configure the service:
   - **Name**: `mern-collaboration-backend`
   - **Environment**: `Node`
   - **Build Command**: `cd server && npm install`
   - **Start Command**: `cd server && npm start`
   - **Plan**: Free

5. Add Environment Variables:
   - `NODE_ENV` = `production`
   - `PORT` = `10000`
   - `MONGODB_URI` = `mongodb+srv://chiragbhayal7_db_user:YOUR_PASSWORD@uniflow.tylnp43.mongodb.net/collaboration-tool?retryWrites=true&w=majority&appName=Uniflow`
   - `FRONTEND_URL` = `https://your-vercel-app.vercel.app`

### 2. Deploy Frontend to Vercel

#### Option A: Vercel CLI (Recommended)
1. Install Vercel CLI: `npm install -g vercel`
2. Login: `vercel login`
3. Deploy: `vercel --prod`

#### Option B: Vercel Dashboard
1. Go to [Vercel Dashboard](https://vercel.com/dashboard)
2. Click "New Project"
3. Import your GitHub repository
4. Configure:
   - **Framework Preset**: Create React App
   - **Root Directory**: `client`
   - **Build Command**: `npm run build`
   - **Output Directory**: `build`

5. Add Environment Variable:
   - `REACT_APP_API_URL` = `https://your-render-backend.onrender.com`

### 3. Alternative: Blueprint Deployment

If using render.yaml (Backend only):
1. Place `render.yaml` in your repository root
2. Update the MongoDB URI with your actual password
3. Deploy via "New +" → "Blueprint" → Connect repository

## Environment Variables Reference

### Backend (.env)
```
MONGODB_URI=mongodb+srv://chiragbhayal7_db_user:YOUR_ACTUAL_PASSWORD@uniflow.tylnp43.mongodb.net/collaboration-tool?retryWrites=true&w=majority&appName=Uniflow
PORT=10000
NODE_ENV=production
FRONTEND_URL=https://your-vercel-app.vercel.app
```

### Frontend (Vercel Environment)
```
REACT_APP_API_URL=https://your-render-backend.onrender.com
```

## Deployment Architecture

- **Backend**: Render Web Service (Node.js + Socket.IO)
- **Frontend**: Vercel Static Site (React build)
- **Database**: MongoDB Atlas (cloud-hosted)
- **No Docker**: Native runtime deployments

## Vercel Configuration

The `vercel.json` file is configured for:
- React app build from `client` directory
- Environment variables for API URL
- SPA routing support with rewrites
- Automatic deployments from GitHub

## Post-Deployment

1. Test room creation and joining
2. Verify real-time collaboration works
3. Check WebSocket connections
4. Monitor logs for any issues

## Troubleshooting

- **MongoDB Connection**: Ensure the password is correct and IP whitelist includes 0.0.0.0/0
- **CORS Issues**: Verify Vercel URL is added to backend CORS configuration
- **WebSocket**: Both Render and Vercel support WebSocket connections
- **Build Failures**: Check build logs and ensure all dependencies are in package.json
- **Environment Variables**: Ensure API URLs match between services

Your collaboration tool will be accessible at:
- **Frontend**: `https://your-project.vercel.app`
- **Backend API**: `https://your-backend.onrender.com`
