# MedScript - Digital Prescription Management System

A complete offline-first web application for doctors to create, manage, and verify digital prescriptions with local data storage.

## Features

- 📋 **Complete Doctor Profile Setup** - Store your professional information and digital signature
- 🏥 **Comprehensive Prescription Forms** - Patient details, medical information, and medication management
- 💊 **Dynamic Medication System** - Add, edit, and manage multiple medications per prescription
- 📄 **Professional PDF Generation** - Generate prescription PDFs with your signature and QR codes
- 📚 **Prescription History** - Search and filter through past prescriptions
- 🔒 **QR Code Verification** - Verify prescription authenticity using QR codes
- 📱 **Mobile Optimized** - Works perfectly on phones and tablets
- 💾 **Offline First** - All data stored locally, works without internet

## Installation

### Prerequisites
- Node.js 18+ installed on your computer
- A modern web browser

### Setup Instructions

1. **Extract the project files** to a folder on your computer

2. **Open terminal/command prompt** and navigate to the project folder:
   ```bash
   cd medscript-app
   ```

3. **Install dependencies**:
   ```bash
   npm install
   ```

4. **Start the application**:
   ```bash
   npm run dev
   ```

5. **Open your browser** and go to: `http://localhost:5000`

## Mobile Installation

### Install as App on Your Phone

**For Android (Chrome/Edge):**
1. Open the app URL in your browser
2. Tap the menu (⋮) → "Add to Home screen" or "Install app"
3. The app will appear on your home screen like a native app

**For iPhone (Safari):**
1. Open the app URL in Safari
2. Tap the Share button (□↗) → "Add to Home Screen"
3. The app will appear on your home screen

## Usage Guide

### 1. Setup Your Doctor Profile
- Go to the "Profile" tab
- Fill in your professional information
- Upload your digital signature (PNG recommended)
- Save your profile

### 2. Create Prescriptions
- Go to "New Prescription" tab
- Fill in patient information
- Add medical details (diagnosis, complaints)
- Add medications using the "Add Medication" button
- Generate PDF prescription

### 3. View History
- Go to "History" tab to see all past prescriptions
- Search by patient name or diagnosis
- Filter by date ranges
- Download PDFs again if needed

### 4. Verify Prescriptions
- Go to "Verify" tab
- Scan QR code with camera or enter prescription ID manually
- View prescription details for verification

## Technical Details

### Built With
- **Frontend**: React with TypeScript
- **UI Components**: Shadcn/ui with Tailwind CSS
- **PDF Generation**: jsPDF library
- **Local Storage**: Browser localStorage API
- **PWA**: Service Worker for offline functionality

### Data Storage
- All data is stored locally in your browser
- No data is sent to external servers
- Prescriptions and doctor profile stored in localStorage
- QR verification data maintained locally

### File Structure
```
medscript-app/
├── client/              # Frontend application
│   ├── src/
│   │   ├── components/  # React components
│   │   ├── hooks/       # Custom React hooks
│   │   ├── lib/         # Utility libraries
│   │   └── pages/       # Application pages
│   └── public/          # Static assets and PWA files
├── server/              # Express server (minimal)
├── shared/              # Shared TypeScript schemas
└── package.json         # Dependencies and scripts
```

## Security Features

- **Local Data Storage**: All sensitive data stays on your device
- **QR Code Verification**: Each prescription has a unique QR code
- **Prescription ID Tracking**: Unique IDs for each prescription
- **Offline Operation**: No internet connection required after setup

## Troubleshooting

### Common Issues

**App won't start:**
- Make sure Node.js is installed: `node --version`
- Delete `node_modules` folder and run `npm install` again

**PDF generation not working:**
- Make sure you've set up your doctor profile first
- Check that you've added at least one medication

**QR verification not working:**
- Ensure camera permissions are granted
- QR codes only work for prescriptions created in the same browser

## Support

This is a standalone application that runs entirely on your device. All data is stored locally and never transmitted externally.

## License

This project is provided as-is for medical professionals to manage digital prescriptions.