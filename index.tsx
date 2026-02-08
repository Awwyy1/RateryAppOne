import React from 'react';
import ReactDOM from 'react-dom/client';
import * as Sentry from '@sentry/react';
import App from './App';

// Initialize Sentry (only when DSN is configured)
const sentryDsn = import.meta.env.VITE_SENTRY_DSN;
if (sentryDsn) {
  Sentry.init({
    dsn: sentryDsn,
    integrations: [
      Sentry.browserTracingIntegration(),
      Sentry.replayIntegration(),
    ],
    tracesSampleRate: 0.1,
    replaysSessionSampleRate: 0.1,
    replaysOnErrorSampleRate: 1.0,
    environment: import.meta.env.MODE,
  });
}

function ErrorFallback() {
  return (
    <div style={{
      minHeight: '100vh',
      display: 'flex',
      alignItems: 'center',
      justifyContent: 'center',
      background: '#050505',
      color: '#fff',
      fontFamily: 'Plus Jakarta Sans, sans-serif',
    }}>
      <div style={{ textAlign: 'center', padding: '2rem' }}>
        <h1 style={{ fontSize: '1.5rem', marginBottom: '1rem' }}>Something went wrong</h1>
        <p style={{ color: 'rgba(255,255,255,0.5)', marginBottom: '1.5rem' }}>
          An unexpected error occurred. Please refresh the page.
        </p>
        <button
          onClick={() => window.location.reload()}
          style={{
            background: '#00f0ff',
            color: '#000',
            border: 'none',
            padding: '0.75rem 2rem',
            borderRadius: '1rem',
            fontWeight: 'bold',
            cursor: 'pointer',
          }}
        >
          Refresh Page
        </button>
      </div>
    </div>
  );
}

const rootElement = document.getElementById('root');
if (!rootElement) {
  throw new Error('Could not find root element to mount to');
}

const root = ReactDOM.createRoot(rootElement);
root.render(
  <React.StrictMode>
    <Sentry.ErrorBoundary fallback={<ErrorFallback />}>
      <App />
    </Sentry.ErrorBoundary>
  </React.StrictMode>
);
