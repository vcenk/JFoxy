import { ImageResponse } from 'next/og'

export const runtime = 'edge'

export const alt = 'Job Foxy - AI Interview Coach & Resume Analysis'
export const size = {
  width: 1200,
  height: 630,
}
export const contentType = 'image/png'

export default async function Image() {
  return new ImageResponse(
    (
      <div
        style={{
          height: '100%',
          width: '100%',
          display: 'flex',
          flexDirection: 'column',
          alignItems: 'center',
          justifyContent: 'center',
          background: 'linear-gradient(135deg, #1e3a5f 0%, #0f1f33 100%)',
          fontFamily: 'system-ui, sans-serif',
        }}
      >
        {/* Fox Icon */}
        <div
          style={{
            display: 'flex',
            alignItems: 'center',
            justifyContent: 'center',
            marginBottom: 30,
          }}
        >
          <svg
            width="120"
            height="120"
            viewBox="0 0 100 100"
            fill="none"
          >
            {/* Simple fox face */}
            <path
              d="M50 10 L20 50 L35 85 L50 70 L65 85 L80 50 Z"
              fill="#f97316"
            />
            <circle cx="38" cy="45" r="6" fill="white" />
            <circle cx="62" cy="45" r="6" fill="white" />
            <circle cx="38" cy="45" r="3" fill="#1e3a5f" />
            <circle cx="62" cy="45" r="3" fill="#1e3a5f" />
            <ellipse cx="50" cy="58" rx="5" ry="4" fill="#1e3a5f" />
          </svg>
        </div>

        {/* Title */}
        <div
          style={{
            display: 'flex',
            fontSize: 72,
            fontWeight: 800,
            color: 'white',
            marginBottom: 16,
            letterSpacing: '-2px',
          }}
        >
          Job Foxy
        </div>

        {/* Tagline */}
        <div
          style={{
            display: 'flex',
            fontSize: 32,
            color: '#94a3b8',
            marginBottom: 40,
          }}
        >
          Stop Guessing. Master Your Interview.
        </div>

        {/* Features */}
        <div
          style={{
            display: 'flex',
            gap: 40,
          }}
        >
          {['AI Resume Analysis', 'Mock Interviews', 'Career Coaching'].map(
            (feature) => (
              <div
                key={feature}
                style={{
                  display: 'flex',
                  alignItems: 'center',
                  gap: 8,
                  color: '#f97316',
                  fontSize: 20,
                  fontWeight: 600,
                }}
              >
                <svg width="20" height="20" viewBox="0 0 20 20" fill="none">
                  <circle cx="10" cy="10" r="10" fill="#f97316" />
                  <path
                    d="M6 10 L9 13 L14 7"
                    stroke="white"
                    strokeWidth="2"
                    strokeLinecap="round"
                    strokeLinejoin="round"
                  />
                </svg>
                {feature}
              </div>
            )
          )}
        </div>
      </div>
    ),
    {
      ...size,
    }
  )
}
