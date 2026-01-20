import { ImageResponse } from 'next/og'

export const runtime = 'edge'

export const alt = 'JobFoxy - AI Interview Coach & Resume Analysis'
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
          background: 'linear-gradient(135deg, #ffffff 0%, #f8fafc 100%)',
          fontFamily: 'system-ui, sans-serif',
        }}
      >
        {/* JobFoxy Logo Text with Heartbeat */}
        <div
          style={{
            display: 'flex',
            alignItems: 'center',
            justifyContent: 'center',
            marginBottom: 24,
          }}
        >
          <div
            style={{
              display: 'flex',
              alignItems: 'baseline',
              fontSize: 96,
              fontWeight: 700,
              color: '#3d4a4d',
              letterSpacing: '-3px',
            }}
          >
            <span>Job</span>
            {/* Heartbeat/Pulse SVG */}
            <svg
              width="60"
              height="40"
              viewBox="0 0 60 40"
              style={{ margin: '0 -4px', marginBottom: '-8px' }}
            >
              <path
                d="M0 20 L15 20 L20 8 L25 32 L30 20 L60 20"
                stroke="#3d4a4d"
                strokeWidth="4"
                fill="none"
                strokeLinecap="round"
                strokeLinejoin="round"
              />
            </svg>
            <span>F</span>
            {/* Fox "o" with ears */}
            <div style={{ display: 'flex', position: 'relative', width: 58, height: 72 }}>
              <svg width="58" height="72" viewBox="0 0 58 72">
                {/* Fox ears */}
                <path d="M10 28 L18 8 L26 24" fill="#3d4a4d" />
                <path d="M48 28 L40 8 L32 24" fill="#3d4a4d" />
                {/* Main "o" circle */}
                <circle cx="29" cy="42" r="26" stroke="#3d4a4d" strokeWidth="6" fill="none" />
                {/* Inner fox face - small smile */}
                <path
                  d="M20 44 Q29 52 38 44"
                  stroke="#3d4a4d"
                  strokeWidth="3"
                  fill="none"
                  strokeLinecap="round"
                />
              </svg>
            </div>
            <span>xy</span>
          </div>
        </div>

        {/* Tagline */}
        <div
          style={{
            display: 'flex',
            fontSize: 36,
            color: '#64748b',
            fontWeight: 500,
            marginBottom: 48,
          }}
        >
          AI Interview Coach & Resume Analysis
        </div>

        {/* Subtle brand accent line */}
        <div
          style={{
            display: 'flex',
            width: 120,
            height: 4,
            background: '#3d4a4d',
            borderRadius: 2,
          }}
        />
      </div>
    ),
    {
      ...size,
    }
  )
}
