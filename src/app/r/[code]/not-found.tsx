export default function ResultNotFound() {
  return (
    <main
      style={{
        minHeight: '100dvh',
        background: '#0a0a0f',
        display: 'flex',
        flexDirection: 'column',
        alignItems: 'center',
        justifyContent: 'center',
        padding: 24,
        textAlign: 'center',
      }}
    >
      <p
        style={{
          color: 'rgba(201,169,110,0.7)',
          fontSize: 11,
          letterSpacing: '0.2em',
          textTransform: 'uppercase',
          marginBottom: 12,
        }}
      >
        YEOUN
      </p>
      <h1 style={{ fontSize: 22, fontWeight: 300, color: '#f0ede8', marginBottom: 12 }}>
        결과를 찾을 수 없습니다
      </h1>
      <p style={{ color: '#8a8278', fontSize: 14, marginBottom: 28 }}>
        링크가 잘못되었거나 만료되었을 수 있어요.
      </p>
      <a
        href="/"
        style={{
          padding: '14px 32px',
          borderRadius: 9999,
          background: 'linear-gradient(135deg, #c9a96e, #a07850)',
          color: '#fff',
          fontSize: 14,
          fontWeight: 600,
          textDecoration: 'none',
        }}
      >
        처음으로
      </a>
    </main>
  )
}
