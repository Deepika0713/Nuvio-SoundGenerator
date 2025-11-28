# 🚀 Deploy to Vercel - Step by Step Guide

## Method 1: Using Vercel CLI (Recommended)

### Step 1: Fix Audio Files
```powershell
.\fix-audio-names.ps1
```

### Step 2: Install Vercel CLI
```powershell
npm install -g vercel
```

### Step 3: Login to Vercel
```powershell
vercel login
```
This will open your browser. Choose your login method:
- GitHub
- GitLab
- Bitbucket
- Email

### Step 4: Deploy!
```powershell
vercel
```

**Follow the prompts:**
1. "Set up and deploy?" → **Yes**
2. "Which scope?" → Choose your account
3. "Link to existing project?" → **No**
4. "What's your project's name?" → **nuvio** (or your preferred name)
5. "In which directory is your code located?" → **./** (press Enter)
6. "Want to override the settings?" → **No**

### Step 5: Deploy to Production
```powershell
vercel --prod
```

**Done! 🎉** Your app is now live at `https://nuvio-[random].vercel.app`

---

## Method 2: Using Vercel Website (No CLI needed)

### Step 1: Fix Audio Files
```powershell
.\fix-audio-names.ps1
```

### Step 2: Push to GitHub

1. **Create a GitHub repository:**
   - Go to https://github.com/new
   - Name it "nuvio"
   - Click "Create repository"

2. **Push your code:**
```powershell
git init
git add .
git commit -m "Initial commit - Nuvio app"
git branch -M main
git remote add origin https://github.com/YOUR-USERNAME/nuvio.git
git push -u origin main
```

### Step 3: Deploy on Vercel

1. **Go to Vercel:**
   - Visit https://vercel.com
   - Click "Sign Up" or "Login"
   - Choose "Continue with GitHub"

2. **Import Project:**
   - Click "Add New..." → "Project"
   - Find your "nuvio" repository
   - Click "Import"

3. **Configure Project:**
   - **Framework Preset:** Vite (auto-detected)
   - **Root Directory:** ./
   - **Build Command:** `npm run build`
   - **Output Directory:** `dist`
   - Click "Deploy"

4. **Wait for deployment** (usually 1-2 minutes)

**Done! 🎉** Your app is live!

---

## Method 3: Drag & Drop (Quickest for Testing)

### Step 1: Fix Audio Files & Build
```powershell
.\fix-audio-names.ps1
npm install
npm run build
```

### Step 2: Deploy
1. Go to https://vercel.com
2. Login/Sign up
3. Drag and drop your `dist` folder onto the Vercel dashboard

**Done! 🎉** Instant deployment!

---

## 🎯 After Deployment

### Your App URL
Vercel will give you a URL like:
```
https://nuvio-abc123.vercel.app
```

### Add Custom Domain (Optional)
1. Go to your project settings on Vercel
2. Click "Domains"
3. Add your custom domain
4. Update your DNS records as instructed

### Environment Variables (If needed)
1. Go to project settings
2. Click "Environment Variables"
3. Add any variables you need

---

## 🔧 Vercel Configuration (Optional)

Create `vercel.json` in your project root for custom settings:

```json
{
  "buildCommand": "npm run build",
  "outputDirectory": "dist",
  "framework": "vite",
  "rewrites": [
    {
      "source": "/(.*)",
      "destination": "/index.html"
    }
  ]
}
```

---

## 📊 Vercel Features You Get (Free)

✅ **Automatic HTTPS** - Secure by default
✅ **Global CDN** - Fast worldwide
✅ **Automatic deployments** - Push to GitHub = auto deploy
✅ **Preview deployments** - Every PR gets a preview URL
✅ **Analytics** - Built-in (can enable in dashboard)
✅ **Custom domains** - Free SSL certificates
✅ **Serverless functions** - If you need backend later

---

## 🚀 Continuous Deployment (Automatic Updates)

Once connected to GitHub:

1. Make changes to your code
2. Commit and push:
```powershell
git add .
git commit -m "Update feature"
git push
```
3. Vercel automatically deploys! 🎉

---

## 🐛 Troubleshooting

### Build fails?
- Check the build logs in Vercel dashboard
- Make sure `npm run build` works locally first
- Verify all dependencies are in `package.json`

### Audio files not loading?
- Ensure files are in `public/audio/` before building
- Check file names match exactly (case-sensitive)
- Look for 404 errors in browser console

### App not loading?
- Check if build output is in `dist` folder
- Verify `vercel.json` settings if you created one
- Check Vercel deployment logs

---

## 💡 Pro Tips

1. **Use Git branches** for testing:
   - `main` branch = production
   - Other branches = preview deployments

2. **Enable Vercel Analytics:**
   - Go to project settings
   - Enable "Analytics"
   - Free tier includes 100k events/month

3. **Set up notifications:**
   - Get notified on Slack/Discord when deployments complete
   - Configure in project settings

4. **Use environment variables:**
   - Store API keys securely
   - Different values for preview vs production

---

## 🎉 You're Live!

Your Nuvio app is now deployed on Vercel with:
- ⚡ Lightning-fast global CDN
- 🔒 Automatic HTTPS
- 🌍 Available worldwide
- 📱 Works on all devices
- 🚀 Auto-deploys on every push

**Share your app and help people focus, relax, and sleep better! 🎵**

---

## Need Help?

- **Vercel Docs:** https://vercel.com/docs
- **Vercel Support:** https://vercel.com/support
- **Community:** https://github.com/vercel/vercel/discussions
