import { ImageResponse } from 'next/og'

export const size = { width: 32, height: 32 }
export const contentType = 'image/png'

export default function Icon() {
  return new ImageResponse(
    (
      <div
        style={{
          width: 32,
          height: 32,
          borderRadius: 7,
          background: 'linear-gradient(135deg, #2ec4b6 0%, #1a9e92 100%)',
          display: 'flex',
          flexDirection: 'column',
          alignItems: 'center',
          justifyContent: 'center',
          gap: 2,
        }}
      >
        <span
          style={{
            color: 'white',
            fontSize: 20,
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
            width: 3,
            height: 3,
            borderRadius: '50%',
            background: 'rgba(255,255,255,0.9)',
          }}
        />
      </div>
    ),
    { ...size },
  )
}
