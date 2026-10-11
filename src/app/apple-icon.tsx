import { ImageResponse } from 'next/og'

export const size = { width: 180, height: 180 }
export const contentType = 'image/png'

export default function AppleIcon() {
  return new ImageResponse(
    (
      <div
        style={{
          width: 180,
          height: 180,
          borderRadius: 40,
          background: 'linear-gradient(135deg, #2ec4b6 0%, #1a9e92 100%)',
          display: 'flex',
          flexDirection: 'column',
          alignItems: 'center',
          justifyContent: 'center',
          gap: 8,
        }}
      >
        <span
          style={{
            color: 'white',
            fontSize: 110,
            fontWeight: 900,
            lineHeight: 1,
            letterSpacing: '-0.04em',
            fontFamily: 'system-ui, sans-serif',
          }}
        >
          t
        </span>
        <div
          style={{
            width: 12,
            height: 12,
            borderRadius: '50%',
            background: 'rgba(255,255,255,0.9)',
          }}
        />
      </div>
    ),
    { ...size },
  )
}
