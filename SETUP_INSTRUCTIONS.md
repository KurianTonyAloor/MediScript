# MedScript - Complete Setup Instructions

## Quick Start Guide

### Method 1: Download and Run Locally

1. **Download the project files** - Copy all files from this workspace to your computer

2. **Install Node.js** (if not already installed):
   - Visit https://nodejs.org/
   - Download and install the LTS version (18.x or newer)

3. **Open Terminal/Command Prompt** and navigate to the project folder:
   ```bash
   cd path/to/medscript-folder
   ```

4. **Install dependencies**:
   ```bash
   npm install
   ```

5. **Start the application**:
   ```bash
   npm run dev
   ```

6. **Open browser** and go to: http://localhost:5000

### Method 2: Deploy to Your Own Server

You can deploy this to any hosting service that supports Node.js:

**Recommended hosting options:**
- Vercel (free, easy deployment)
- Netlify (free, good for static sites)
- Railway (simple Node.js hosting)
- Your own VPS/server

## Project Structure

```
medscript/
├── package.json          # Dependencies and scripts
├── package-lock.json     # Locked dependency versions
├── vite.config.ts        # Build configuration
├── tailwind.config.ts    # Styling configuration
├── tsconfig.json         # TypeScript configuration
├── postcss.config.js     # CSS processing
├── components.json       # UI component configuration
├── README.md             # Project documentation
├── SETUP_INSTRUCTIONS.md # This file
│
├── client/               # Frontend application
│   ├── index.html        # Main HTML file
│   ├── public/           # Static assets
│   │   ├── manifest.json # PWA manifest
│   │   ├── sw.js         # Service worker
│   │   └── *.png         # App icons
│   └── src/
│       ├── main.tsx      # Application entry point
│       ├── App.tsx       # Main application component
│       ├── index.css     # Global styles
│       ├── components/   # React components
│       │   ├── prescription-form.tsx
│       │   ├── doctor-profile.tsx
│       │   ├── prescription-history.tsx
│       │   ├── qr-verification.tsx
│       │   ├── medication-form.tsx
│       │   ├── theme-provider.tsx
│       │   └── ui/       # Reusable UI components
│       ├── hooks/        # Custom React hooks
│       │   ├── use-local-storage.ts
│       │   ├── use-mobile.tsx
│       │   └── use-toast.ts
│       ├── lib/          # Utility libraries
│       │   ├── pdf-generator.ts
│       │   ├── qr-utils.ts
│       │   ├── storage.ts
│       │   ├── utils.ts
│       │   └── queryClient.ts
│       └── pages/        # Application pages
│           ├── home.tsx
│           └── not-found.tsx
│
├── server/               # Backend server
│   ├── index.ts          # Server entry point
│   ├── routes.ts         # API routes
│   ├── storage.ts        # Data storage interface
│   └── vite.ts           # Development server setup
│
└── shared/               # Shared TypeScript schemas
    └── schema.ts         # Data models and validation
```

## Features Overview

### Core Functionality
- **Doctor Profile Management** - Store professional information and digital signature
- **Prescription Creation** - Comprehensive forms for patient and medical data
- **Medication Management** - Add multiple medications with detailed information
- **PDF Generation** - Professional prescription PDFs with signatures and QR codes
- **Prescription History** - Search, filter, and manage past prescriptions
- **QR Verification** - Verify prescription authenticity using QR codes

### Technical Features
- **Offline First** - Works without internet connection
- **Local Data Storage** - All data stored in browser localStorage
- **Progressive Web App** - Installable on mobile devices
- **Responsive Design** - Works on desktop, tablet, and mobile
- **TypeScript** - Type-safe development
- **Modern UI** - Clean, professional medical interface

## Mobile Installation

Once you have the app running, you can install it on your phone:

**Android (Chrome/Edge):**
1. Open the app URL in browser
2. Tap menu (⋮) → "Add to Home screen"
3. App appears on home screen

**iPhone (Safari):**
1. Open app URL in Safari
2. Tap Share button → "Add to Home Screen"
3. App appears on home screen

## Customization

### Branding
- Edit `client/src/index.css` for colors and styling
- Replace icons in `client/public/` with your own
- Update app name in `client/public/manifest.json`

### Features
- Add new medication routes in `client/src/components/medication-form.tsx`
- Modify PDF layout in `client/src/lib/pdf-generator.ts`
- Add new form fields in `shared/schema.ts`

## Data Storage

All data is stored locally in the browser:
- **Doctor Profile**: `localStorage["doctorProfile"]`
- **Prescriptions**: `localStorage["prescriptions"]`
- **App Settings**: `localStorage["appSettings"]`
- **QR Verification**: `localStorage["qrVerification"]`

## Security

- All data remains on the user's device
- No external API calls or data transmission
- QR codes provide prescription verification
- Unique prescription IDs prevent duplication

## Troubleshooting

**Port already in use:**
```bash
# Kill process on port 5000
npx kill-port 5000
npm run dev
```

**Dependencies not installing:**
```bash
# Clear npm cache
npm cache clean --force
rm -rf node_modules package-lock.json
npm install
```

**Build errors:**
```bash
# Check Node.js version
node --version  # Should be 18.x or newer

# Update dependencies
npm update
```

## Support

This is a complete, standalone application. All functionality works offline and no external services are required.