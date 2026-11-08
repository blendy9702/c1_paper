export default function ResultNotFound() {
  return (
    <main
      style={{
        minHeight: '100dvh',
        background: '#f6f1e8',
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
          color: '#8d6840',
          fontSize: 11,
          letterSpacing: '0.2em',
          textTransform: 'uppercase',
          marginBottom: 12,
        }}
      >
        YEOUN
      </p>
      <h1 style={{ fontSize: 22, fontWeight: 300, color: '#2b241c', marginBottom: 12 }}>
        결과를 찾을 수 없습니다
      </h1>
      <p style={{ color: '#7a6f64', fontSize: 14, marginBottom: 28 }}>
        링크가 잘못되었거나 만료되었을 수 있어요.
      </p>
      <a
        href="/"
        style={{
          padding: '14px 32px',
          borderRadius: 9999,
          background: 'var(--color-button)',
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
