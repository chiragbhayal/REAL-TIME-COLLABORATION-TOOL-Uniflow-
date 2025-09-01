# 🚀 Render Deployment Guide

## Prerequisites

1. **MongoDB Atlas Setup**
   - Update the password in `/server/.env` from `yourpassword` to your actual MongoDB password
   - Ensure your MongoDB Atlas cluster allows connections from anywhere (0.0.0.0/0) for production

2. **GitHub Repository**
   - Push your code to a GitHub repository
   - Ensure all files are committed including the new deployment configurations

## Deployment Steps

### 1. Deploy Backend (Web Service)

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
   - `MONGODB_URI` = `your-mongodb-connection-string`
   - `FRONTEND_URL` = `https://your-frontend-url.onrender.com`

### 2. Deploy Frontend (Static Site)

1. Click "New +" → "Static Site"
2. Connect the same GitHub repository
3. Configure the site:
   - **Name**: `mern-collaboration-frontend`
   - **Build Command**: `cd client && npm install && npm run build`
   - **Publish Directory**: `client/build`

4. Add Environment Variable:
   - `REACT_APP_API_URL` = `https://your-backend-url.onrender.com`

### 3. Update CORS Configuration

After deployment, update the backend's CORS settings with your actual frontend URL.

## Environment Variables Reference

### Backend (.env)
```
MONGODB_URI=mongodb+srv://chiragbhayal7_db_user:YOUR_ACTUAL_PASSWORD@uniflow.tylnp43.mongodb.net/collaboration-tool?retryWrites=true&w=majority&appName=Uniflow
PORT=10000
NODE_ENV=production
FRONTEND_URL=https://your-frontend-url.onrender.com
```

### Frontend (Render Environment)
```
REACT_APP_API_URL=https://your-backend-url.onrender.com
```

## Post-Deployment

1. Test room creation and joining
2. Verify real-time collaboration works
3. Check WebSocket connections
4. Monitor logs for any issues

## Troubleshooting

- **MongoDB Connection**: Ensure the password is correct and IP whitelist includes 0.0.0.0/0
- **CORS Issues**: Verify frontend URL is added to backend CORS configuration
- **WebSocket**: Render supports WebSocket connections on free tier
- **Build Failures**: Check build logs and ensure all dependencies are in package.json

Your collaboration tool will be accessible at:
- **Frontend**: `https://your-frontend-name.onrender.com`
- **Backend API**: `https://your-backend-name.onrender.com`
