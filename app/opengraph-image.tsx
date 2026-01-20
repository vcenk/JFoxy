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
          background: 'linear-gradient(145deg, #1a1a2e 0%, #16213e 50%, #0f3460 100%)',
        }}
      >
        <div
          style={{
            display: 'flex',
            flexDirection: 'column',
            alignItems: 'center',
          }}
        >
          <div
            style={{
              display: 'flex',
              fontSize: 140,
              fontWeight: 800,
              letterSpacing: '-2px',
              background: 'linear-gradient(135deg, #ffffff 0%, #e2e8f0 100%)',
              backgroundClip: 'text',
              color: 'transparent',
              textShadow: '0 4px 30px rgba(255,255,255,0.1)',
            }}
          >
            JOB FOXY
          </div>
          <div
            style={{
              display: 'flex',
              width: 200,
              height: 4,
              background: 'linear-gradient(90deg, transparent, #64748b, transparent)',
              marginTop: 24,
              borderRadius: 2,
            }}
          />
        </div>
      </div>
    ),
    {
      ...size,
    }
  )
}
