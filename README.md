<div align="center">
<img width="1200" height="475" alt="GHBanner" src="https://github.com/user-attachments/assets/0aa67016-6eaf-458a-adb2-6e31a0763ed6" />
</div>

# Ratery - AI-Powered Perception Audit

An AI-powered facial perception analysis tool that uses Claude Vision API to analyze first impressions.

## Features

- **Google Authentication** - Secure sign-in with Google
- **AI Face Analysis** - Real facial analysis using Claude Vision API
- **Detailed Metrics** - Trustworthiness, Charisma, Intelligence, Approachability, Authority, Energy
- **Beautiful UI** - Cyberpunk-inspired design with smooth animations

## Setup Instructions

### 1. Clone and Install

```bash
npm install
```

### 2. Firebase Setup (Already configured!)

Firebase project `rateryappone` is already set up. You just need to:

1. Go to [Firebase Console](https://console.firebase.google.com) > Select `rateryappone`
2. Go to **Authentication** > **Sign-in method** > Enable **Google**
3. Go to **Authentication** > **Settings** > **Authorized domains** > Add your Vercel domain

### 3. Claude API Setup

1. Go to [Anthropic Console](https://console.anthropic.com/)
2. Create an API key

### 4. Run Locally

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
| `ANTHROPIC_API_KEY` | Your Claude API key |

Firebase config is already hardcoded as fallback values - no need to add Firebase env vars unless you want to override them.

### Firebase Auth Domain Configuration

In Firebase Console > Authentication > Settings > Authorized domains, add:
- `your-project.vercel.app`
- Any custom domains

## Tech Stack

- **Frontend**: React 19, TypeScript, Vite
- **Styling**: Tailwind CSS, Framer Motion
- **Auth**: Firebase Authentication
- **AI**: Claude Vision API (Anthropic)
- **Deployment**: Vercel
