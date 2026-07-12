export default function HomePage() {
  return (
    <div style={{ minHeight: '100vh', background: '#0f1117', color: '#e2e8f0', fontFamily: "'Inter', 'Segoe UI', sans-serif", display: 'flex', alignItems: 'center', justifyContent: 'center' }}>
      <div style={{ textAlign: 'center', padding: '2rem' }}>
        <div style={{ fontSize: '3rem', marginBottom: '1rem' }}>🛒</div>
        <h1 style={{ fontSize: '2.5rem', fontWeight: 800, background: 'linear-gradient(135deg, #818cf8, #c084fc)', WebkitBackgroundClip: 'text', WebkitTextFillColor: 'transparent', margin: '0 0 0.75rem' }}>
          Ehsaan-Test
        </h1>
        <p style={{ color: '#64748b', marginBottom: '2rem', fontSize: '1rem' }}>Next.js + Supabase starter project</p>
        <div style={{ display: 'flex', gap: '1rem', justifyContent: 'center', flexWrap: 'wrap' }}>
          <a href="/test-api" style={{
            background: 'linear-gradient(135deg, #6366f1, #8b5cf6)', color: 'white',
            padding: '0.75rem 1.75rem', borderRadius: '0.6rem',
            textDecoration: 'none', fontWeight: 700, fontSize: '0.9rem'
          }}>
            📦 Products Manager
          </a>
          <a href="/api/products" style={{
            background: '#1e293b', color: '#94a3b8',
            padding: '0.75rem 1.75rem', borderRadius: '0.6rem',
            textDecoration: 'none', fontWeight: 700, fontSize: '0.9rem',
            border: '1px solid #334155'
          }}>
            🔌 Raw API JSON
          </a>
        </div>
      </div>
    </div>
  );
}
