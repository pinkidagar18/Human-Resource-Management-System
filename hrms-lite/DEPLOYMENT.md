# HRMS Lite - Deployment Guide

This guide provides step-by-step instructions for deploying the HRMS Lite application to production.

## Prerequisites

Before deploying, ensure you have:
- A GitHub account
- MongoDB Atlas account (free tier available)
- Vercel/Netlify account (for frontend)
- Render/Railway account (for backend)

---

## Part 1: Database Setup (MongoDB Atlas)

### Step 1: Create MongoDB Atlas Cluster

1. Go to [MongoDB Atlas](https://www.mongodb.com/cloud/atlas)
2. Sign up or log in
3. Click "Build a Database"
4. Choose "Free" tier (M0 Sandbox)
5. Select a cloud provider and region close to your users
6. Click "Create Cluster"

### Step 2: Configure Database Access

1. Go to "Database Access" in the left sidebar
2. Click "Add New Database User"
3. Create a username and strong password (save these!)
4. Set user privileges to "Read and write to any database"
5. Click "Add User"

### Step 3: Configure Network Access

1. Go to "Network Access" in the left sidebar
2. Click "Add IP Address"
3. Click "Allow Access from Anywhere" (0.0.0.0/0)
   - Note: For production, you should restrict this to your backend server's IP
4. Click "Confirm"

### Step 4: Get Connection String

1. Go to "Database" in the left sidebar
2. Click "Connect" on your cluster
3. Choose "Connect your application"
4. Copy the connection string
5. Replace `<password>` with your database user password
6. Replace `<dbname>` with `hrms_lite`

Example: `mongodb+srv://username:password@cluster0.xxxxx.mongodb.net/hrms_lite?retryWrites=true&w=majority`

---

## Part 2: Backend Deployment (Render)

### Step 1: Prepare Backend for Deployment

1. Ensure your `backend/package.json` has the start script:
   ```json
   "scripts": {
     "start": "node server.js"
   }
   ```

### Step 2: Deploy to Render

1. Go to [Render](https://render.com/)
2. Sign up/log in and connect your GitHub account
3. Click "New +" → "Web Service"
4. Find and select your repository
5. Configure the service:
   - **Name**: `hrms-lite-backend` (or your choice)
   - **Region**: Choose closest to your users
   - **Branch**: `main` (or your default branch)
   - **Root Directory**: `backend`
   - **Environment**: `Node`
   - **Build Command**: `npm install`
   - **Start Command**: `npm start`
   - **Instance Type**: Free

### Step 3: Add Environment Variables

In the Render dashboard, add these environment variables:

| Key | Value |
|-----|-------|
| `MONGODB_URI` | Your MongoDB Atlas connection string |
| `NODE_ENV` | `production` |
| `PORT` | `5000` (Render will override this automatically) |

### Step 4: Deploy

1. Click "Create Web Service"
2. Wait for the build and deployment to complete
3. Note your backend URL (e.g., `https://hrms-lite-backend.onrender.com`)
4. Test the API by visiting `https://your-backend-url.onrender.com/api/health`

### Alternative: Deploy to Railway

1. Go to [Railway](https://railway.app/)
2. Sign up/log in with GitHub
3. Click "New Project" → "Deploy from GitHub repo"
4. Select your repository
5. Select the `backend` directory as root
6. Add environment variables (same as Render)
7. Deploy

---

## Part 3: Frontend Deployment (Vercel)

### Step 1: Update API URL

In your frontend code, the API URL should use environment variables:
- File: `frontend/src/api/api.js`
- The code already uses `import.meta.env.VITE_API_URL`

### Step 2: Deploy to Vercel

1. Go to [Vercel](https://vercel.com/)
2. Sign up/log in with GitHub
3. Click "Add New..." → "Project"
4. Import your GitHub repository
5. Configure the project:
   - **Framework Preset**: Vite
   - **Root Directory**: `frontend`
   - **Build Command**: `npm run build` (auto-detected)
   - **Output Directory**: `dist` (auto-detected)

### Step 3: Add Environment Variable

In the Vercel project settings:

| Key | Value |
|-----|-------|
| `VITE_API_URL` | `https://your-backend-url.onrender.com/api` |

**Important**: Replace `your-backend-url.onrender.com` with your actual Render backend URL!

### Step 4: Deploy

1. Click "Deploy"
2. Wait for the build to complete
3. Get your frontend URL (e.g., `https://hrms-lite.vercel.app`)

### Alternative: Deploy to Netlify

1. Go to [Netlify](https://www.netlify.com/)
2. Sign up/log in with GitHub
3. Click "Add new site" → "Import an existing project"
4. Connect to GitHub and select your repository
5. Configure:
   - **Base directory**: `frontend`
   - **Build command**: `npm run build`
   - **Publish directory**: `frontend/dist`
6. Add environment variable:
   - `VITE_API_URL`: Your backend URL
7. Click "Deploy site"

---

## Part 4: Update CORS Settings (Backend)

After deployment, you might need to update CORS settings if you encounter issues:

1. Go to your backend code: `backend/server.js`
2. Update the CORS configuration:

```javascript
app.use(cors({
  origin: [
    'http://localhost:3000',
    'https://your-frontend-url.vercel.app'  // Add your actual frontend URL
  ],
  credentials: true
}));
```

3. Commit and push to trigger a new deployment

---

## Part 5: Verification & Testing

### Test Backend API

1. Visit: `https://your-backend-url.onrender.com/api/health`
2. You should see:
   ```json
   {
     "success": true,
     "message": "HRMS Lite API is running",
     "timestamp": "2024-02-07T..."
   }
   ```

### Test Complete Application

1. Visit your frontend URL: `https://your-frontend-url.vercel.app`
2. Test all features:
   - ✅ Dashboard loads without errors
   - ✅ Can add new employees
   - ✅ Can view employees
   - ✅ Can delete employees
   - ✅ Can mark attendance
   - ✅ Can view attendance records
   - ✅ Can filter attendance

---

## Common Issues & Solutions

### Issue 1: "Network Error" or "CORS Error"

**Solution**:
- Check that `VITE_API_URL` in Vercel matches your backend URL exactly
- Include `/api` at the end
- Verify CORS is configured correctly in backend
- Check browser console for specific error messages

### Issue 2: Backend "Application Error"

**Solution**:
- Check Render logs for errors
- Verify MongoDB connection string is correct
- Ensure all environment variables are set
- Check that MongoDB Atlas allows connections from anywhere

### Issue 3: Frontend builds but shows blank page

**Solution**:
- Check browser console for errors
- Verify the build completed successfully in Vercel
- Check that all frontend dependencies are in `package.json`
- Ensure `vercel.json` is present for proper routing

### Issue 4: Database connection fails

**Solution**:
- Verify MongoDB Atlas IP whitelist includes 0.0.0.0/0
- Check username and password in connection string
- Ensure database user has read/write permissions
- Test connection string format

### Issue 5: Frontend can't reach backend

**Solution**:
- Verify backend is actually running (visit health endpoint)
- Check that `VITE_API_URL` environment variable is set in Vercel
- Ensure URL doesn't have trailing slash
- Rebuild frontend after changing environment variables

---

## Production Checklist

Before considering deployment complete:

- [ ] Backend health endpoint returns 200 OK
- [ ] MongoDB connection is successful
- [ ] Frontend loads without console errors
- [ ] All CRUD operations work (Create, Read, Delete)
- [ ] Attendance marking works
- [ ] Filters work correctly
- [ ] Dashboard shows accurate statistics
- [ ] Application is responsive on mobile
- [ ] No CORS errors in browser console
- [ ] Error states display properly
- [ ] Loading states work correctly
- [ ] All environment variables are set correctly

---

## Monitoring & Maintenance

### Render Dashboard
- Monitor backend logs for errors
- Check response times and uptime
- Set up email alerts for downtime

### Vercel Dashboard
- Monitor build logs
- Check deployment status
- Review analytics (if enabled)

### MongoDB Atlas
- Monitor database size
- Check connection counts
- Review slow queries

---

## Cost Considerations

### Free Tier Limits

**Render (Free)**:
- Spins down after 15 minutes of inactivity
- First request after spin-down takes 30-60 seconds
- 750 hours/month
- 512 MB RAM

**Vercel (Free)**:
- 100 GB bandwidth
- Unlimited deployments
- No sleep time

**MongoDB Atlas (Free)**:
- 512 MB storage
- Shared RAM
- Shared vCPU

For production use with real users, consider upgrading to paid tiers for better performance and reliability.

---

## Next Steps

After successful deployment:

1. Update README.md with live URLs
2. Test the application thoroughly
3. Share the URLs for review
4. Consider setting up a custom domain
5. Set up monitoring and alerts
6. Plan for scaling if needed

---

**Congratulations!** 🎉 Your HRMS Lite application is now live!
