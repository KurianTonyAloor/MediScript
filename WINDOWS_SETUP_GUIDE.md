# MedScript - Windows Setup Guide

## Quick Start
Your MedScript application is now ready to use! Follow these simple steps:

### 1. Start the Application
Open Command Prompt or PowerShell in your project folder and run:
```bash
npm run dev
```

### 2. Access the Application
Open your web browser and go to:
```
http://localhost:5000
```

### 3. Using MedScript

#### First Time Setup
1. **Doctor Profile**: Set up your doctor profile with your name, medical license, and clinic information
2. **Digital Signature**: Upload or draw your signature for prescriptions

#### Creating Prescriptions
1. **Patient Details**: Enter patient information (name, age, address, etc.)
2. **Add Medications**: Click "Add Medication" to add prescriptions
3. **Generate PDF**: Click "Generate PDF" to create a professional prescription with QR code
4. **Save & Download**: Your prescription is automatically saved and downloaded

#### Managing Prescriptions
1. **History**: View all previous prescriptions in the "Prescription History" tab
2. **Search**: Use the search bar to find specific prescriptions
3. **Verify**: Use QR codes to verify prescription authenticity

### 4. Mobile Installation (PWA)
On your phone:
1. Open the app in your mobile browser: `http://localhost:5000`
2. Tap the browser menu (3 dots)
3. Select "Add to Home Screen" or "Install App"
4. The app will install like a native app on your phone

## Features
- ✅ **Completely Offline**: Works without internet connection
- ✅ **Local Storage**: All data stored on your computer
- ✅ **PDF Generation**: Professional prescription PDFs with signatures
- ✅ **QR Verification**: Secure prescription verification system
- ✅ **Mobile Ready**: Install as app on phones and tablets
- ✅ **Windows Compatible**: Fixed all Windows-specific issues

## Troubleshooting

### If Port 5000 is Busy
If you get a "port already in use" error, either:
1. Close other applications using port 5000, or
2. The app will automatically try different ports

### If npm run dev Doesn't Work
Use this direct command instead:
```bash
npx tsx server/index.ts
```

### Security Warnings
The npm security warnings are normal and don't affect the app's functionality. They're common in development environments.

## Data Location
All your prescription data is stored locally in your browser's storage. To backup your data:
1. Export important prescriptions as PDFs
2. Keep the project folder safe as it contains all your settings

## System Requirements
- Windows 10/11
- Node.js (already installed)
- Modern web browser (Chrome, Firefox, Edge)
- 100MB free disk space

Your MedScript application is now fully functional and ready for professional use!