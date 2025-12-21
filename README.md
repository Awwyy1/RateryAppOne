<div align="center">
<img width="1200" height="475" alt="GHBanner" src="https://github.com/user-attachments/assets/0aa67016-6eaf-458a-adb2-6e31a0763ed6" />
</div>

# Ratery - AI-Powered Perception Audit

An AI-powered facial perception analysis tool that uses Google Gemini Vision API to analyze first impressions.

## Features

- **Google Authentication** - Secure sign-in with Google
- **AI Face Analysis** - Real facial analysis using Gemini Vision API
- **Detailed Metrics** - Trustworthiness, Charisma, Intelligence, Approachability, Authority, Energy
- **Beautiful UI** - Cyberpunk-inspired design with smooth animations

## Setup Instructions

### 1. Clone and Install

```bash
npm install
```

### 2. Firebase Setup

1. Go to [Firebase Console](https://console.firebase.google.com)
2. Create a new project (or use existing)
3. Go to **Authentication** > **Sign-in method** > Enable **Google**
4. Go to **Project Settings** > **General** > **Your apps** > Add **Web app**
5. Copy the config values

### 3. Gemini API Setup

1. Go to [Google AI Studio](https://makersuite.google.com/app/apikey)
2. Create an API key

### 4. Environment Variables

Create `.env.local` file in the root:

```env
# Firebase (for local development)
VITE_FIREBASE_API_KEY=your-api-key
VITE_FIREBASE_AUTH_DOMAIN=your-project.firebaseapp.com
VITE_FIREBASE_PROJECT_ID=your-project-id
VITE_FIREBASE_STORAGE_BUCKET=your-project.appspot.com
VITE_FIREBASE_MESSAGING_SENDER_ID=123456789
VITE_FIREBASE_APP_ID=1:123456789:web:abc123

# Gemini API (for local development with Vercel CLI)
GEMINI_API_KEY=your-gemini-api-key
```

### 5. Run Locally

For full functionality with API routes, use Vercel CLI:

```bash
npm install -g vercel
vercel dev
```

Or for frontend only:

```bash
npm run dev
```

## Vercel Deployment

### Environment Variables in Vercel Dashboard

Go to your Vercel project > **Settings** > **Environment Variables** and add:

| Variable | Value |
|----------|-------|
| `VITE_FIREBASE_API_KEY` | Your Firebase API key |
| `VITE_FIREBASE_AUTH_DOMAIN` | your-project.firebaseapp.com |
| `VITE_FIREBASE_PROJECT_ID` | your-project-id |
| `VITE_FIREBASE_STORAGE_BUCKET` | your-project.appspot.com |
| `VITE_FIREBASE_MESSAGING_SENDER_ID` | Your sender ID |
| `VITE_FIREBASE_APP_ID` | Your app ID |
| `GEMINI_API_KEY` | Your Gemini API key |

### Firebase Auth Domain Configuration

In Firebase Console > Authentication > Settings > Authorized domains, add:
- `your-project.vercel.app`
- Any custom domains

## Tech Stack

- **Frontend**: React 19, TypeScript, Vite
- **Styling**: Tailwind CSS, Framer Motion
- **Auth**: Firebase Authentication
- **AI**: Google Gemini Vision API
- **Deployment**: Vercel
