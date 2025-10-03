# 🚀 Quick Render Deployment Guide

## Backend Deployment to Render

### 1. Prepare Your Backend

Make sure your `backend/` folder contains:
- ✅ `package.json` with start script
- ✅ `server.js` as main file
- ✅ All dependencies listed
- ✅ Environment variables documented

### 2. Create Render Service

1. **Go to [Render.com](https://render.com)**
2. **Sign up/Login with GitHub**
3. **Click "New +" → "Web Service"**
4. **Connect your GitHub repository**

### 3. Configure Render Service

**Service Settings:**
- **Name**: `portfolio-backend`
- **Environment**: `Node`
- **Region**: `Oregon (US West)`
- **Branch**: `main`
- **Root Directory**: `backend`

**Build Settings:**
- **Build Command**: `npm install`
- **Start Command**: `npm start`

### 4. Environment Variables

Add these in Render dashboard:

```
NODE_ENV=production
PORT=10000
MONGODB_URI=mongodb+srv://username:password@cluster.mongodb.net/portfolio_db
JWT_SECRET=your_super_secure_jwt_secret_key_here
ADMIN_EMAIL=your-email@gmail.com
ADMIN_PASSWORD=your_secure_password_here
EMAIL_USER=your-email@gmail.com
EMAIL_PASS=your_app_password_here
CLOUDINARY_CLOUD_NAME=your_cloudinary_name
CLOUDINARY_API_KEY=your_cloudinary_api_key
CLOUDINARY_API_SECRET=your_cloudinary_api_secret
```

### 5. Deploy

1. **Click "Create Web Service"**
2. **Wait for deployment** (5-10 minutes)
3. **Get your backend URL**: `https://portfolio-backend.onrender.com`

### 6. Test Backend

Visit: `https://your-backend.onrender.com/api/health`

Should return:
```json
{
  "status": "OK",
  "message": "Portfolio backend is running",
  "timestamp": "2024-01-01T00:00:00.000Z"
}
```

## 🎯 Next Steps

1. **Deploy frontend to Vercel**
2. **Update CORS settings**
3. **Create admin user**
4. **Test full application**

---

**Your backend is now live! 🎉**
