# 🚀 Nuvio Deployment Guide

## Step 1: Fix Audio File Names

Your audio files need to be renamed to match the expected format. Run this command:

```powershell
.\fix-audio-names.ps1
```

This will rename all files to the correct format (e.g., `rain.mp3`, `ocean.mp3`, etc.)

---

## Step 2: Test Locally

Before deploying, test the application locally:

```bash
# Install dependencies (if not already done)
npm install

# Run development server
npm run dev
```

Open `http://localhost:5173` in your browser and test:
- ✅ All 20 sounds play correctly
- ✅ Volume controls work
- ✅ Timer functions properly
- ✅ Mix saving/loading works
- ✅ Theme switching works
- ✅ All UI elements display correctly

---

## Step 3: Build for Production

Create an optimized production build:

```bash
npm run build
```

This creates a `dist` folder with your production-ready files.

---

## Step 4: Deploy

### Option A: Vercel (Recommended - Free & Easy)

1. **Install Vercel CLI:**
```bash
npm install -g vercel
```

2. **Deploy:**
```bash
vercel
```

3. **Follow the prompts:**
   - Link to your Vercel account
   - Confirm project settings
   - Deploy!

4. **Your app will be live at:** `https://your-project.vercel.app`

### Option B: Netlify (Also Free & Easy)

1. **Install Netlify CLI:**
```bash
npm install -g netlify-cli
```

2. **Deploy:**
```bash
netlify deploy --prod
```

3. **Or use Netlify Drop:**
   - Go to https://app.netlify.com/drop
   - Drag and drop your `dist` folder
   - Done!

### Option C: GitHub Pages

1. **Install gh-pages:**
```bash
npm install --save-dev gh-pages
```

2. **Add to package.json:**
```json
{
  "scripts": {
    "predeploy": "npm run build",
    "deploy": "gh-pages -d dist"
  },
  "homepage": "https://yourusername.github.io/nuvio"
}
```

3. **Deploy:**
```bash
npm run deploy
```

### Option D: Your Own Server

1. **Build the project:**
```bash
npm run build
```

2. **Upload the `dist` folder to your server**

3. **Configure your web server:**
   - Point to the `dist` folder
   - Enable SPA routing (redirect all routes to index.html)
   - Enable HTTPS (required for Web Audio API on some browsers)

**Nginx example:**
```nginx
server {
    listen 80;
    server_name yourdomain.com;
    root /path/to/dist;
    index index.html;

    location / {
        try_files $uri $uri/ /index.html;
    }
}
```

---

## Step 5: Post-Deployment Checklist

After deployment, verify:

- [ ] All 20 sounds load and play
- [ ] No console errors
- [ ] Audio works on mobile devices
- [ ] Theme persistence works
- [ ] Mix saving/loading works
- [ ] Timer functions correctly
- [ ] Responsive design works on all screen sizes
- [ ] HTTPS is enabled (required for some browsers)

---

## 🔧 Troubleshooting

### Audio files not loading?
- Check browser console for 404 errors
- Verify file names match exactly (case-sensitive)
- Ensure files are in `public/audio/` folder before building

### Audio not playing on mobile?
- Web Audio API requires user interaction first
- The app handles this with "Resume audio context" on mount
- Some browsers block autoplay - user must interact first

### Mix saving not working?
- Check if localStorage is available
- Some browsers block localStorage in private/incognito mode
- The app shows a warning banner if storage is unavailable

---

## 📊 Performance Tips

### Optimize Audio Files
```bash
# Reduce file size while maintaining quality
# Use tools like ffmpeg:
ffmpeg -i input.wav -b:a 128k output.mp3
```

### Enable Compression
Most hosting platforms enable gzip/brotli automatically. If self-hosting:
- Enable gzip compression for .js, .css, .html files
- Consider using brotli for even better compression

### CDN
For better global performance:
- Use a CDN for static assets
- Vercel and Netlify include CDN automatically

---

## 🌐 Custom Domain

### Vercel
```bash
vercel domains add yourdomain.com
```

### Netlify
```bash
netlify domains:add yourdomain.com
```

Then update your DNS records as instructed.

---

## 📈 Analytics (Optional)

Add analytics to track usage:

1. **Google Analytics:**
   - Add tracking code to `index.html`

2. **Plausible (Privacy-friendly):**
   - Add script tag to `index.html`

3. **Vercel Analytics:**
   - Enable in Vercel dashboard (free)

---

## 🔒 Security Headers (Optional)

Add security headers in your hosting platform:

```
X-Frame-Options: DENY
X-Content-Type-Options: nosniff
Referrer-Policy: strict-origin-when-cross-origin
Permissions-Policy: microphone=(), camera=(), geolocation=()
```

---

## 🎉 You're Done!

Your Nuvio app is now live and ready to help people focus, relax, and sleep better!

**Share your deployment:**
- Tweet about it
- Share on Product Hunt
- Post in relevant communities

---

## Need Help?

- Check the main README.md for technical details
- Review the requirements.md and design.md in `.kiro/specs/`
- All code is well-documented with comments
