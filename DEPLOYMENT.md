# Complete Deployment Guide

This guide will walk you through deploying the Wiki Quiz Generator from scratch.

## Prerequisites

- GitHub account
- Render account (free tier available)
- Vercel account (free tier available)
- Google Gemini API key from https://aistudio.google.com/app/apikey

---

## Step 1: Push to GitHub

### Option A: If you deleted the repo (start fresh)

1. **Create a new repository on GitHub**:
   - Go to https://github.com/new
   - Repository name: `wiki-quiz-generator`
   - Description: "Wiki Quiz Generator - AI-powered quiz generator from Wikipedia articles"
   - Choose Public or Private
   - **Don't** initialize with README, .gitignore, or license
   - Click "Create repository"

2. **Remove old remote and add new one**:
   ```bash
   git remote remove origin
   git remote add origin https://github.com/YOUR_USERNAME/wiki-quiz-generator.git
   ```

3. **Push to GitHub**:
   ```bash
   git branch -M main
   git push -u origin main
   ```

### Option B: If repo still exists

Just push the changes:
```bash
git push origin master
# or if your default branch is main:
git push origin main
```

---

## Step 2: Deploy Backend to Render

### Get Your Gemini API Key

1. Go to https://aistudio.google.com/app/apikey
2. Sign in with Google
3. Click "Create API Key"
4. Copy the key (you'll need it in Step 2.5)

### Deploy Using Blueprint (Easiest Method)

1. **Go to Render Dashboard**: https://dashboard.render.com
2. **Sign up/Login** (use GitHub for easy integration)
3. **Create Blueprint**:
   - Click "New +" → "Blueprint"
   - Connect your GitHub account if not already connected
   - Select your `wiki-quiz-generator` repository
   - Click "Apply"
4. **Render will automatically**:
   - Create a PostgreSQL database (`wiki-quiz-db`)
   - Create a web service (`wiki-quiz-backend`)
   - Link them together
5. **Add Gemini API Key**:
   - Wait for services to be created
   - Click on `wiki-quiz-backend` service
   - Go to "Environment" tab
   - Click "Add Environment Variable"
   - Key: `GEMINI_API_KEY`
   - Value: (paste your API key from above)
   - Click "Save Changes"
6. **Wait for deployment**:
   - Go to "Events" tab to see build progress
   - First deployment takes 5-10 minutes
7. **Get your backend URL**:
   - Once deployed, you'll see: `https://wiki-quiz-backend.onrender.com`
   - **Copy this URL** - you'll need it for Vercel!

### Manual Setup (Alternative)

If Blueprint doesn't work:

1. **Create PostgreSQL Database**:
   - Click "New +" → "PostgreSQL"
   - Name: `wiki-quiz-db`
   - Database: `wiki_quiz`
   - User: `wiki_quiz_user`
   - Plan: Free
   - Region: Choose closest to you
   - Click "Create Database"
   - Wait for it to be ready
   - Copy the "Internal Database URL" (you'll need it)

2. **Create Web Service**:
   - Click "New +" → "Web Service"
   - Connect GitHub repository: `wiki-quiz-generator`
   - Configure:
     - **Name**: `wiki-quiz-backend`
     - **Environment**: `Python 3`
     - **Region**: Same as database
     - **Branch**: `main` (or `master` if that's your branch)
     - **Root Directory**: (leave empty)
     - **Build Command**: `pip install -r backend/requirements.txt`
     - **Start Command**: `cd backend && python run.py`
     - **Plan**: Free
   - Click "Create Web Service"

3. **Add Environment Variables**:
   - In your web service, go to "Environment" tab
   - Add these variables:
     - `GEMINI_API_KEY`: (your Gemini API key)
     - `DATABASE_URL`: (click "Link" next to your PostgreSQL database, or paste the Internal Database URL)
   - Click "Save Changes"

4. **Deploy**:
   - Render will automatically start building
   - Check "Events" tab for progress
   - Once done, your backend URL will be: `https://wiki-quiz-backend.onrender.com`

### Verify Backend is Working

1. Visit your backend URL: `https://wiki-quiz-backend.onrender.com`
2. You should see: `{"status": "Wiki Quiz Backend Running"}`
3. If you see an error, check the "Logs" tab in Render

---

## Step 3: Deploy Frontend to Vercel

1. **Go to Vercel**: https://vercel.com
2. **Sign up/Login** with GitHub
3. **Import Project**:
   - Click "Add New..." → "Project"
   - Import your `wiki-quiz-generator` repository
   - Configure:
     - **Framework Preset**: Create React App
     - **Root Directory**: `frontend` (important!)
     - **Build Command**: `npm run build` (should auto-detect)
     - **Output Directory**: `build` (should auto-detect)
     - **Install Command**: `npm install` (should auto-detect)
   - Click "Deploy"
4. **Add Environment Variable**:
   - After first deployment, go to Project Settings → Environment Variables
   - Click "Add New"
   - Key: `REACT_APP_API_URL`
   - Value: `https://wiki-quiz-backend.onrender.com` (your Render backend URL)
   - Environment: Production, Preview, Development (select all)
   - Click "Save"
5. **Redeploy**:
   - Go to "Deployments" tab
   - Click the three dots (⋯) on the latest deployment
   - Click "Redeploy"
   - This will rebuild with the new environment variable
6. **Your app is live!**
   - Visit: `https://your-project.vercel.app`
   - The frontend will now connect to your Render backend

---

## Troubleshooting

### Backend Issues

**Problem**: Build fails with "ModuleNotFoundError"
- **Solution**: Make sure `requirements.txt` is in the `backend/` folder

**Problem**: "API key failed" error
- **Solution**: Check that `GEMINI_API_KEY` is set correctly in Render Environment tab

**Problem**: Database connection error
- **Solution**: Make sure `DATABASE_URL` is linked to your PostgreSQL database in Render

### Frontend Issues

**Problem**: Frontend can't connect to backend (CORS error)
- **Solution**: Check that `REACT_APP_API_URL` in Vercel matches your Render backend URL exactly

**Problem**: Build fails
- **Solution**: Make sure Root Directory is set to `frontend` in Vercel settings

### General Issues

**Problem**: Changes not showing up
- **Solution**: 
  - Make sure you pushed to GitHub
  - Render/Vercel should auto-deploy, but you can manually trigger a redeploy

---

## Environment Variables Summary

### Render (Backend)
- `GEMINI_API_KEY`: Your Google Gemini API key (required)
- `DATABASE_URL`: Automatically set when you link PostgreSQL database
- `PORT`: Automatically set by Render

### Vercel (Frontend)
- `REACT_APP_API_URL`: Your Render backend URL (e.g., `https://wiki-quiz-backend.onrender.com`)

---

## Next Steps

1. ✅ Code is pushed to GitHub
2. ✅ Backend deployed to Render
3. ✅ Frontend deployed to Vercel
4. 🎉 Your app is live!

Test your deployment:
- Visit your Vercel frontend URL
- Try generating a quiz from a Wikipedia article
- Check that quizzes are saved and can be viewed in history

---

## Support

If you encounter issues:
1. Check the logs in Render (for backend) or Vercel (for frontend)
2. Verify all environment variables are set correctly
3. Make sure your API keys are valid
4. Check that your GitHub repository is properly connected

Good luck! 🚀

