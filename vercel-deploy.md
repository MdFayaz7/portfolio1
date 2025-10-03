# 🌐 Quick Vercel Deployment Guide

## Frontend Deployment to Vercel

### 1. Prepare Your Frontend

Make sure your root folder contains:
- ✅ `package.json` with build script
- ✅ `vite.config.ts` configured
- ✅ `vercel.json` (optional)
- ✅ Environment variables documented

### 2. Create Vercel Project

1. **Go to [Vercel.com](https://vercel.com)**
2. **Sign up/Login with GitHub**
3. **Click "New Project"**
4. **Import your GitHub repository**

### 3. Configure Vercel Project

**Project Settings:**
- **Framework Preset**: `Vite`
- **Root Directory**: `./` (root of repository)
- **Build Command**: `npm run build`
- **Output Directory**: `dist`

### 4. Environment Variables

Add these in Vercel dashboard:

```
VITE_API_URL=https://your-backend.onrender.com/api
VITE_APP_NAME=MERN Portfolio
VITE_NODE_ENV=production
```

### 5. Deploy

1. **Click "Deploy"**
2. **Wait for deployment** (2-5 minutes)
3. **Get your frontend URL**: `https://your-portfolio.vercel.app`

### 6. Test Frontend

1. **Visit your Vercel URL**
2. **Check all sections load**
3. **Test admin login**: `/admin/login`

## 🔧 Post-Deployment Setup

### 1. Update Backend CORS

After getting your Vercel URL, update your backend CORS settings:

In `backend/server.js`:
```javascript
const allowedOrigins = process.env.NODE_ENV === 'production'
  ? [
      'https://your-portfolio.vercel.app',
      'https://your-portfolio-git-main.vercel.app'
    ]
  : ['http://localhost:5173'];
```

### 2. Create Admin User

Since this is a fresh deployment, create an admin user:

**Using curl:**
```bash
curl -X POST https://your-backend.onrender.com/api/auth/register \
  -H "Content-Type: application/json" \
  -d '{
    "email": "your-email@gmail.com",
    "password": "your-password"
  }'
```

**Using Postman:**
- **URL**: `https://your-backend.onrender.com/api/auth/register`
- **Method**: POST
- **Body**:
```json
{
  "email": "your-email@gmail.com",
  "password": "your-password"
}
```

### 3. Test Admin Dashboard

1. **Go to**: `https://your-portfolio.vercel.app/admin/login`
2. **Login with your credentials**
3. **Start adding content to your portfolio**

## 🎯 Custom Domain (Optional)

### 1. Add Custom Domain

1. **Go to Vercel dashboard**
2. **Select your project**
3. **Go to Settings → Domains**
4. **Add your custom domain**
5. **Configure DNS records**

### 2. Update Environment Variables

After setting up custom domain:
- Update `VITE_API_URL` if needed
- Update backend CORS origins

## 🔍 Troubleshooting

**Common Issues:**

1. **CORS Errors**
   - Check backend CORS settings
   - Ensure frontend URL is in allowed origins

2. **API Connection Issues**
   - Verify `VITE_API_URL` in Vercel
   - Check backend is running on Render

3. **Build Failures**
   - Check build logs in Vercel
   - Ensure all dependencies are installed

4. **Admin Login Issues**
   - Create admin user first
   - Check JWT_SECRET is set

## 🎉 Success!

Your MERN portfolio is now live:
- **Frontend**: `https://your-portfolio.vercel.app`
- **Backend**: `https://your-backend.onrender.com`
- **Admin**: `https://your-portfolio.vercel.app/admin/login`

---

**Your portfolio is now live in production! 🚀**
