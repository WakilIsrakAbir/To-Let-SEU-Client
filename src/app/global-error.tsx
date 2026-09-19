'use client';

import React, { useEffect } from 'react';

export default function GlobalError({
  error,
  reset,
}: {
  error: Error & { digest?: string };
  reset: () => void;
}) {
  useEffect(() => {
    console.error('Fatal Root Layout Error caught in global-error.tsx:', error);
  }, [error]);

  return (
    <html lang="en">
      <body
        style={{
          margin: 0,
          padding: 0,
          backgroundColor: '#080f0c',
          color: '#f1f5f9',
          fontFamily:
            "system-ui, -apple-system, BlinkMacSystemFont, 'Segoe UI', Roboto, sans-serif",
          display: 'flex',
          alignItems: 'center',
          justifyContent: 'center',
          minHeight: '100vh',
        }}
      >
        <div
          style={{
            maxWidth: '520px',
            margin: '20px',
            backgroundColor: '#0e1713',
            border: '1px solid #1c2b23',
            borderRadius: '24px',
            padding: '40px 32px',
            textAlign: 'center',
            boxShadow: '0 20px 40px rgba(0,0,0,0.5)',
          }}
        >
          {/* Accent Emblem */}
          <div
            style={{
              width: '64px',
              height: '64px',
              borderRadius: '20px',
              backgroundColor: '#1f1315',
              border: '1px solid #4c1d24',
              color: '#f43f5e',
              display: 'inline-flex',
              alignItems: 'center',
              justifyContent: 'center',
              fontSize: '28px',
              marginBottom: '20px',
            }}
          >
            &#9888;
          </div>

          <h1
            style={{
              fontSize: '24px',
              fontWeight: 900,
              margin: '0 0 8px 0',
              color: '#ffffff',
              letterSpacing: '-0.02em',
            }}
          >
            Fatal Application Error
          </h1>

          <p
            style={{
              fontSize: '13px',
              color: '#10b981',
              fontWeight: 700,
              margin: '0 0 12px 0',
            }}
          >
            TO-LET SEU &bull; Southeast University Housing Portal
          </p>

          <p
            style={{
              fontSize: '14px',
              color: '#94a3b8',
              lineHeight: '1.6',
              margin: '0 0 28px 0',
            }}
          >
            A critical system error prevented the page layout from rendering properly. Please
            reload the application or return to the home screen.
          </p>

          <div
            style={{
              display: 'flex',
              gap: '12px',
              justifyContent: 'center',
              flexWrap: 'wrap',
            }}
          >
            <button
              onClick={() => reset()}
              style={{
                backgroundColor: '#10b981',
                color: '#ffffff',
                border: 'none',
                padding: '12px 24px',
                borderRadius: '12px',
                fontWeight: 700,
                fontSize: '14px',
                cursor: 'pointer',
                boxShadow: '0 4px 14px rgba(16, 185, 129, 0.4)',
              }}
            >
              Try Again
            </button>

            <button
              onClick={() => {
                if (typeof window !== 'undefined') {
                  window.location.href = '/';
                }
              }}
              style={{
                backgroundColor: '#1a2720',
                color: '#e2e8f0',
                border: '1px solid #2a3e33',
                padding: '12px 24px',
                borderRadius: '12px',
                fontWeight: 700,
                fontSize: '14px',
                cursor: 'pointer',
              }}
            >
              Back to Home
            </button>
          </div>

          {error?.digest && (
            <div
              style={{
                marginTop: '28px',
                paddingTop: '16px',
                borderTop: '1px solid #1c2b23',
                fontSize: '11px',
                color: '#64748b',
                fontFamily: 'monospace',
              }}
            >
              Digest: {error.digest}
            </div>
          )}
        </div>
      </body>
    </html>
  );
}
