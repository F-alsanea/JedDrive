# 🏎️ JedDrive - Jeddah's Premier Car Services Super-App

**JedDrive** is a luxurious, modern PWA (Progressive Web App) designed for car owners in Jeddah. It bridges the gap between premium service providers and customers with a seamless, high-performance interface.

## 🌟 Key Features

- **PWA Ready**: Install on iOS/Android/Desktop for a native app experience.
- **Multilingual**: Full support for Arabic and English with RTL/LTR layouts.
- **Smart Dashboards**: Specialized views for Customers, Providers, and Admins.
- **Service Hub**: Towing, Washing, Repairing, and Tinting with multi-service ordering.
- **Marketing Engine**: Dynamic banners, scrolling tickers, and direct notification blasts.
- **Premium Experience**: Luxury dark mode and "JedDrive Orange" styling.

## 🚀 Getting Started Locally

1. **Install dependencies**:
   ```bash
   npm install
   ```
2. **Environment Setup**:
   Copy `.env.local.example` to `.env.local` and add your `GEMINI_API_KEY`.
3. **Run Dev Server**:
   ```bash
   npm run dev
   ```

## 🌐 Deployment Guide

### Deployment to GitHub
1. Initialize a new repo: `git init`
2. Add your files: `git add .`
3. Commit: `git commit -m "feat: initial premium release"`
4. Push to your GitHub repository.

### Deployment to Vercel
1. Go to [Vercel](https://vercel.com) and click **"New Project"**.
2. Import your GitHub repository.
3. Vercel will automatically detect **Vite** settings.
4. Add your `GEMINI_API_KEY` in the Environment Variables section.
5. Click **Deploy**. Done!

---
*Built with React, TypeScript, Tailwind CSS, and Zustand.*
