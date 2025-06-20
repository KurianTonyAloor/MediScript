# MedScript - Complete Download Guide

## Method 1: Manual Setup (Recommended)

### Step 1: Create Project Structure
Create these folders on your computer:
```
medscript-app/
├── client/
│   ├── src/
│   │   ├── components/
│   │   │   └── ui/
│   │   ├── hooks/
│   │   ├── lib/
│   │   └── pages/
│   └── public/
├── server/
└── shared/
```

### Step 2: Download Each File
Copy the content from each file in this Replit project to your local files:

**Root Files:**
- package.json
- vite.config.ts  
- tailwind.config.ts
- tsconfig.json
- postcss.config.js
- components.json
- README.md

**Client Files:**
- client/index.html
- client/src/main.tsx
- client/src/App.tsx
- client/src/index.css
- client/src/components/prescription-form.tsx
- client/src/components/doctor-profile.tsx
- client/src/components/prescription-history.tsx
- client/src/components/qr-verification.tsx
- client/src/components/medication-form.tsx
- client/src/components/theme-provider.tsx
- client/src/hooks/use-local-storage.ts
- client/src/hooks/use-mobile.tsx
- client/src/hooks/use-toast.ts
- client/src/lib/pdf-generator.ts
- client/src/lib/qr-utils.ts
- client/src/lib/storage.ts
- client/src/lib/utils.ts
- client/src/lib/queryClient.ts
- client/src/pages/home.tsx
- client/src/pages/not-found.tsx
- client/public/manifest.json
- client/public/sw.js
- client/public/icon-192x192.png
- client/public/icon-512x512.png
- client/public/favicon-32x32.png
- client/public/favicon-16x16.png

**Server Files:**
- server/index.ts
- server/routes.ts
- server/storage.ts
- server/vite.ts

**Shared Files:**
- shared/schema.ts

**UI Components:** (Copy all files from client/src/components/ui/)
- Over 40 UI component files

### Step 3: Install and Run
```bash
cd medscript-app
npm install
npm run dev
```

## Method 2: Clone from Repository

If you have access to git, you can also:
1. Fork this Replit
2. Connect it to GitHub
3. Clone the repository to your computer

## Method 3: Use Replit Download

1. In Replit, go to the three dots menu
2. Select "Download as zip"
3. Extract and follow setup instructions

## Quick Setup Commands

Once you have the files:
```bash
# Navigate to project
cd medscript-app

# Install dependencies
npm install

# Start development server
npm run dev

# Open browser to http://localhost:5000
```

## Production Build

To create a production build:
```bash
npm run build
```

This creates optimized files in the `dist/` folder that you can deploy to any web server.

## Deployment Options

**Free Hosting:**
- Vercel.com (recommended)
- Netlify.com
- Railway.app
- GitHub Pages

**Self-hosted:**
- Any VPS with Node.js
- Docker container
- Local network server

## Mobile Installation

After deployment, users can install the app on their phones:
- Android: Chrome menu → "Add to Home screen"
- iPhone: Safari Share → "Add to Home Screen"

The app works completely offline once installed.