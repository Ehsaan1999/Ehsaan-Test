'use client';

import { useState, useEffect, useCallback } from 'react';

type Product = {
  id: number;
  name: string;
  price: number;
  description: string | null;
  category: string | null;
  created_at: string;
};

export default function ProductsPage() {
  const [products, setProducts] = useState<Product[]>([]);
  const [loading, setLoading] = useState(true);
  const [submitting, setSubmitting] = useState(false);
  const [deletingId, setDeletingId] = useState<number | null>(null);
  const [toast, setToast] = useState<{ msg: string; type: 'success' | 'error' } | null>(null);
  const [form, setForm] = useState({ name: '', price: '', description: '', category: '' });

  const showToast = (msg: string, type: 'success' | 'error') => {
    setToast({ msg, type });
    setTimeout(() => setToast(null), 3500);
  };

  const fetchProducts = useCallback(async () => {
    setLoading(true);
    const res = await fetch('/api/products');
    const data = await res.json();
    setProducts(data.products || []);
    setLoading(false);
  }, []);

  useEffect(() => { fetchProducts(); }, [fetchProducts]);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!form.name || !form.price) return showToast('Name and price are required', 'error');
    setSubmitting(true);
    const res = await fetch('/api/products', {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify(form),
    });
    const data = await res.json();
    setSubmitting(false);
    if (!res.ok) return showToast(data.error || 'Failed to add product', 'error');
    setForm({ name: '', price: '', description: '', category: '' });
    showToast('Product added successfully!', 'success');
    fetchProducts();
  };

  const handleDelete = async (id: number) => {
    setDeletingId(id);
    const res = await fetch(`/api/products/${id}`, { method: 'DELETE' });
    const data = await res.json();
    setDeletingId(null);
    if (!res.ok) return showToast(data.error || 'Failed to delete', 'error');
    showToast('Product deleted', 'success');
    fetchProducts();
  };

  const categories = ['Electronics', 'Office', 'Kitchen', 'Stationery', 'Clothing', 'Other'];

  return (
    <div style={{ minHeight: '100vh', background: '#0f1117', color: '#e2e8f0', fontFamily: "'Inter', 'Segoe UI', sans-serif" }}>
      {/* Toast */}
      {toast && (
        <div style={{
          position: 'fixed', top: '1.5rem', right: '1.5rem', zIndex: 9999,
          padding: '0.875rem 1.25rem', borderRadius: '0.75rem',
          background: toast.type === 'success' ? '#052e16' : '#2d0a0a',
          border: `1px solid ${toast.type === 'success' ? '#16a34a' : '#dc2626'}`,
          color: toast.type === 'success' ? '#4ade80' : '#f87171',
          fontWeight: 600, fontSize: '0.875rem',
          boxShadow: '0 10px 40px rgba(0,0,0,0.4)',
          animation: 'slideIn 0.3s ease',
        }}>
          {toast.type === 'success' ? '✅' : '❌'} {toast.msg}
        </div>
      )}

      <div style={{ maxWidth: '960px', margin: '0 auto', padding: '2.5rem 1.5rem' }}>
        {/* Header */}
        <div style={{ marginBottom: '2.5rem' }}>
          <div style={{ display: 'flex', alignItems: 'center', gap: '0.75rem', marginBottom: '0.5rem' }}>
            <div style={{
              width: '10px', height: '10px', borderRadius: '50%',
              background: '#4ade80', boxShadow: '0 0 8px #4ade80',
              animation: 'pulse 2s infinite'
            }} />
            <span style={{ fontSize: '0.75rem', color: '#4ade80', fontWeight: 600, letterSpacing: '0.1em', textTransform: 'uppercase' }}>
              Supabase Connected
            </span>
          </div>
          <h1 style={{ fontSize: '2rem', fontWeight: 800, background: 'linear-gradient(135deg, #818cf8, #c084fc)', WebkitBackgroundClip: 'text', WebkitTextFillColor: 'transparent', margin: 0 }}>
            Products Manager
          </h1>
          <p style={{ color: '#64748b', marginTop: '0.5rem', fontSize: '0.9rem' }}>
            Add, view and delete products — stored live in Supabase
          </p>
        </div>

        {/* Add Product Form */}
        <div style={{
          background: 'linear-gradient(135deg, #1e1b4b 0%, #1a1a2e 100%)',
          border: '1px solid #312e81', borderRadius: '1rem',
          padding: '1.75rem', marginBottom: '2rem',
          boxShadow: '0 4px 24px rgba(99,102,241,0.1)'
        }}>
          <h2 style={{ fontSize: '1rem', fontWeight: 700, color: '#a5b4fc', marginBottom: '1.25rem', display: 'flex', alignItems: 'center', gap: '0.5rem' }}>
            <span style={{ fontSize: '1.1rem' }}>＋</span> Add New Product
          </h2>
          <form onSubmit={handleSubmit}>
            <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '1rem', marginBottom: '1rem' }}>
              <div>
                <label style={{ display: 'block', fontSize: '0.75rem', fontWeight: 600, color: '#94a3b8', marginBottom: '0.4rem', letterSpacing: '0.05em', textTransform: 'uppercase' }}>Name *</label>
                <input
                  value={form.name}
                  onChange={e => setForm({ ...form, name: e.target.value })}
                  placeholder="e.g. Wireless Headphones"
                  style={{ width: '100%', background: '#0f1117', border: '1px solid #334155', borderRadius: '0.5rem', padding: '0.65rem 0.875rem', color: '#e2e8f0', fontSize: '0.9rem', outline: 'none', boxSizing: 'border-box' }}
                />
              </div>
              <div>
                <label style={{ display: 'block', fontSize: '0.75rem', fontWeight: 600, color: '#94a3b8', marginBottom: '0.4rem', letterSpacing: '0.05em', textTransform: 'uppercase' }}>Price ($) *</label>
                <input
                  type="number" step="0.01" min="0"
                  value={form.price}
                  onChange={e => setForm({ ...form, price: e.target.value })}
                  placeholder="0.00"
                  style={{ width: '100%', background: '#0f1117', border: '1px solid #334155', borderRadius: '0.5rem', padding: '0.65rem 0.875rem', color: '#e2e8f0', fontSize: '0.9rem', outline: 'none', boxSizing: 'border-box' }}
                />
              </div>
              <div>
                <label style={{ display: 'block', fontSize: '0.75rem', fontWeight: 600, color: '#94a3b8', marginBottom: '0.4rem', letterSpacing: '0.05em', textTransform: 'uppercase' }}>Category</label>
                <select
                  value={form.category}
                  onChange={e => setForm({ ...form, category: e.target.value })}
                  style={{ width: '100%', background: '#0f1117', border: '1px solid #334155', borderRadius: '0.5rem', padding: '0.65rem 0.875rem', color: form.category ? '#e2e8f0' : '#64748b', fontSize: '0.9rem', outline: 'none', boxSizing: 'border-box' }}
                >
                  <option value="">Select category...</option>
                  {categories.map(c => <option key={c} value={c}>{c}</option>)}
                </select>
              </div>
              <div>
                <label style={{ display: 'block', fontSize: '0.75rem', fontWeight: 600, color: '#94a3b8', marginBottom: '0.4rem', letterSpacing: '0.05em', textTransform: 'uppercase' }}>Description</label>
                <input
                  value={form.description}
                  onChange={e => setForm({ ...form, description: e.target.value })}
                  placeholder="Short description..."
                  style={{ width: '100%', background: '#0f1117', border: '1px solid #334155', borderRadius: '0.5rem', padding: '0.65rem 0.875rem', color: '#e2e8f0', fontSize: '0.9rem', outline: 'none', boxSizing: 'border-box' }}
                />
              </div>
            </div>
            <button
              type="submit"
              disabled={submitting}
              style={{
                background: submitting ? '#312e81' : 'linear-gradient(135deg, #6366f1, #8b5cf6)',
                color: 'white', border: 'none', borderRadius: '0.5rem',
                padding: '0.7rem 1.75rem', fontWeight: 700, fontSize: '0.9rem',
                cursor: submitting ? 'not-allowed' : 'pointer',
                transition: 'all 0.2s', opacity: submitting ? 0.7 : 1,
              }}
            >
              {submitting ? '⏳ Saving...' : '🚀 Add to Supabase'}
            </button>
          </form>
        </div>

        {/* Products List */}
        <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', marginBottom: '1rem' }}>
          <h2 style={{ fontSize: '1rem', fontWeight: 700, color: '#94a3b8', margin: 0 }}>
            {loading ? 'Loading...' : `${products.length} Product${products.length !== 1 ? 's' : ''} in Database`}
          </h2>
          <button
            onClick={fetchProducts}
            style={{ background: 'transparent', border: '1px solid #334155', color: '#94a3b8', borderRadius: '0.4rem', padding: '0.4rem 0.875rem', cursor: 'pointer', fontSize: '0.8rem', fontWeight: 600 }}
          >
            ↻ Refresh
          </button>
        </div>

        {loading ? (
          <div style={{ textAlign: 'center', padding: '3rem', color: '#475569' }}>
            <div style={{ fontSize: '2rem', marginBottom: '0.5rem' }}>⏳</div>
            Fetching from Supabase...
          </div>
        ) : products.length === 0 ? (
          <div style={{ textAlign: 'center', padding: '3rem', color: '#475569', border: '1px dashed #334155', borderRadius: '1rem' }}>
            <div style={{ fontSize: '2.5rem', marginBottom: '0.75rem' }}>📦</div>
            No products yet. Add one above!
          </div>
        ) : (
          <div style={{ display: 'grid', gap: '0.75rem' }}>
            {products.map(p => (
              <div
                key={p.id}
                style={{
                  background: '#161b27', border: '1px solid #1e293b',
                  borderRadius: '0.75rem', padding: '1.1rem 1.25rem',
                  display: 'flex', alignItems: 'center', justifyContent: 'space-between',
                  gap: '1rem', transition: 'border-color 0.2s',
                }}
              >
                <div style={{ flex: 1, minWidth: 0 }}>
                  <div style={{ display: 'flex', alignItems: 'center', gap: '0.6rem', flexWrap: 'wrap' }}>
                    <span style={{ fontWeight: 700, fontSize: '0.95rem', color: '#e2e8f0' }}>{p.name}</span>
                    {p.category && (
                      <span style={{
                        fontSize: '0.7rem', fontWeight: 600, padding: '0.15rem 0.5rem',
                        background: '#1e1b4b', color: '#818cf8', borderRadius: '999px',
                        border: '1px solid #312e81'
                      }}>{p.category}</span>
                    )}
                  </div>
                  {p.description && (
                    <p style={{ margin: '0.3rem 0 0', fontSize: '0.8rem', color: '#64748b', overflow: 'hidden', textOverflow: 'ellipsis', whiteSpace: 'nowrap' }}>{p.description}</p>
                  )}
                  <p style={{ margin: '0.25rem 0 0', fontSize: '0.7rem', color: '#475569' }}>
                    ID: {p.id} · Added {new Date(p.created_at).toLocaleString()}
                  </p>
                </div>
                <div style={{ display: 'flex', alignItems: 'center', gap: '1rem', flexShrink: 0 }}>
                  <span style={{ fontSize: '1.1rem', fontWeight: 800, color: '#4ade80' }}>
                    ${Number(p.price).toFixed(2)}
                  </span>
                  <button
                    onClick={() => handleDelete(p.id)}
                    disabled={deletingId === p.id}
                    style={{
                      background: 'transparent', border: '1px solid #450a0a',
                      color: deletingId === p.id ? '#475569' : '#f87171',
                      borderRadius: '0.4rem', padding: '0.35rem 0.7rem',
                      cursor: deletingId === p.id ? 'not-allowed' : 'pointer',
                      fontSize: '0.8rem', fontWeight: 600, transition: 'all 0.2s',
                    }}
                  >
                    {deletingId === p.id ? '...' : '🗑 Delete'}
                  </button>
                </div>
              </div>
            ))}
          </div>
        )}
      </div>

      <style>{`
        @keyframes pulse { 0%, 100% { opacity: 1; } 50% { opacity: 0.4; } }
        @keyframes slideIn { from { opacity: 0; transform: translateX(20px); } to { opacity: 1; transform: translateX(0); } }
        input:focus, select:focus { border-color: #6366f1 !important; }
      `}</style>
    </div>
  );
}
