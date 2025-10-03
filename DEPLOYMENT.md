# 🚀 Deployment Guide - Render + Vercel

This guide will help you deploy your MERN portfolio to production using Render (backend) and Vercel (frontend).

## 📋 Prerequisites

- GitHub repository with your code
- MongoDB Atlas account (for database)
- Render account (for backend)
- Vercel account (for frontend)
- Cloudinary account (for image storage - optional)

## 🔧 Step 1: Prepare Your Repository

### 1.1 Update Environment Variables

**Frontend (.env):**
```bash
VITE_API_URL=https://your-backend.onrender.com/api
VITE_APP_NAME=MERN Portfolio
VITE_NODE_ENV=production
```

**Backend (.env):**
```bash
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

### 1.2 Update CORS Settings

In `backend/server.js`, update the allowed origins:
```javascript
const allowedOrigins = process.env.NODE_ENV === 'production'
  ? [
      'https://your-portfolio.vercel.app',
      'https://your-portfolio-git-main.vercel.app'
    ]
  : ['http://localhost:5173', 'http://localhost:3000'];
```

## 🖥️ Step 2: Deploy Backend to Render

### 2.1 Create Render Service

1. **Go to [Render Dashboard](https://dashboard.render.com)**
2. **Click "New +" → "Web Service"**
3. **Connect your GitHub repository**
4. **Configure the service:**

**Basic Settings:**
- **Name**: `portfolio-backend`
- **Environment**: `Node`
- **Region**: `Oregon (US West)`
- **Branch**: `main`

**Build & Deploy:**
- **Build Command**: `npm install`
- **Start Command**: `npm start`
- **Root Directory**: `backend`

### 2.2 Environment Variables in Render

Add these environment variables in Render dashboard:

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

### 2.3 Deploy Backend

1. **Click "Create Web Service"**
2. **Wait for deployment to complete**
3. **Note your backend URL**: `https://portfolio-backend.onrender.com`

## 🌐 Step 3: Deploy Frontend to Vercel

### 3.1 Create Vercel Project

1. **Go to [Vercel Dashboard](https://vercel.com/dashboard)**
2. **Click "New Project"**
3. **Import your GitHub repository**
4. **Configure the project:**

**Build Settings:**
- **Framework Preset**: `Vite`
- **Root Directory**: `./` (root of repository)
- **Build Command**: `npm run build`
- **Output Directory**: `dist`

### 3.2 Environment Variables in Vercel

Add these environment variables in Vercel dashboard:

```
VITE_API_URL=https://your-backend.onrender.com/api
VITE_APP_NAME=MERN Portfolio
VITE_NODE_ENV=production
```

### 3.3 Deploy Frontend

1. **Click "Deploy"**
2. **Wait for deployment to complete**
3. **Note your frontend URL**: `https://your-portfolio.vercel.app`

## 🔄 Step 4: Update CORS and Test

### 4.1 Update Backend CORS

After getting your Vercel URL, update the CORS settings in your backend:

1. **Go to Render dashboard**
2. **Find your backend service**
3. **Go to Environment tab**
4. **Add/Update CORS origins** (if needed)

Or update in your code and redeploy.

### 4.2 Test Your Deployment

1. **Visit your Vercel URL**
2. **Test the portfolio sections**
3. **Test admin login**: `https://your-portfolio.vercel.app/admin/login`
4. **Create admin user** (if not done already)

## 🔐 Step 5: Create Admin User

Since this is a fresh deployment, you need to create an admin user:

### 5.1 Using API Endpoint

**Method 1: Using curl**
```bash
curl -X POST https://your-backend.onrender.com/api/auth/register \
  -H "Content-Type: application/json" \
  -d '{
    "email": "your-email@gmail.com",
    "password": "your-password"
  }'
```

**Method 2: Using Postman**
- **URL**: `https://your-backend.onrender.com/api/auth/register`
- **Method**: POST
- **Body**:
```json
{
  "email": "your-email@gmail.com",
  "password": "your-password"
}
```

### 5.2 Login to Admin Dashboard

1. **Go to**: `https://your-portfolio.vercel.app/admin/login`
2. **Use the credentials you just created**
3. **Start managing your portfolio content**

## 🎯 Step 6: Custom Domain (Optional)

### 6.1 Vercel Custom Domain

1. **Go to Vercel dashboard**
2. **Select your project**
3. **Go to Settings → Domains**
4. **Add your custom domain**
5. **Configure DNS records**

### 6.2 Update Environment Variables

After setting up custom domain, update:
- **Vercel**: Update `VITE_API_URL` if needed
- **Render**: Update CORS origins if needed

## 🔧 Troubleshooting

### Common Issues:

**1. CORS Errors**
- Check CORS origins in backend
- Ensure frontend URL is in allowed origins

**2. API Connection Issues**
- Verify `VITE_API_URL` in Vercel
- Check backend is running on Render

**3. Database Connection**
- Verify MongoDB Atlas connection string
- Check network access in MongoDB Atlas

**4. Admin Login Issues**
- Create admin user first using registration endpoint
- Check JWT_SECRET is set correctly

**5. File Upload Issues**
- Configure Cloudinary (optional)
- Check file size limits

## 📊 Monitoring

### Render Monitoring
- **Logs**: Available in Render dashboard
- **Metrics**: CPU, Memory usage
- **Uptime**: Service health monitoring

### Vercel Monitoring
- **Analytics**: Built-in analytics
- **Functions**: Serverless function logs
- **Performance**: Core Web Vitals

## 🚀 Production Checklist

- [ ] Backend deployed to Render
- [ ] Frontend deployed to Vercel
- [ ] Environment variables configured
- [ ] CORS configured correctly
- [ ] Admin user created
- [ ] Database connected
- [ ] File uploads working (if using Cloudinary)
- [ ] Custom domain configured (optional)
- [ ] SSL certificates active
- [ ] Performance optimized

## 📞 Support

If you encounter issues:

1. **Check logs** in Render/Vercel dashboards
2. **Verify environment variables**
3. **Test API endpoints** directly
4. **Check database connectivity**
5. **Review CORS settings**

---

**🎉 Congratulations! Your MERN portfolio is now live in production!**
