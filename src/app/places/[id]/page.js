import { createClient } from '@supabase/supabase-js';
import Link from 'next/link';
import '../../styles/place-detail.css';

const supabaseUrl = process.env.NEXT_PUBLIC_SUPABASE_URL;
const supabaseKey = process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY;
const supabase = createClient(supabaseUrl, supabaseKey);

export const revalidate = 60;

export default async function PlaceDetailPage({ params }) {
  const { id } = params;

  // Fetch dữ liệu từ Supabase dựa trên id
  const { data: place, error } = await supabase
    .from('places')
    .select('*')
    .eq('id', id)
    .single();

  if (error || !place) {
    return (
      <div className="page-scroll" style={{ padding: '40px 20px', textAlign: 'center' }}>
        <h2>Không tìm thấy địa điểm</h2>
        <Link href="/explore">Quay lại Khám phá</Link>
      </div>
    );
  }

  // Fallback ảnh nếu thiếu
  const heroImg = place.images?.[0] || 'https://images.unsplash.com/photo-1540483761890-a1f7be05ce34?w=800&q=80';

  return (
    <div className="page-app">
      {/* Hero */}
      <div className="detail-hero" id="detail-hero">
        <img className="detail-hero-img" id="hero-img" src={heroImg} alt={place.name} />
        <div className="detail-hero-overlay"></div>
        <div className="detail-hero-nav">
          <Link href="/explore" className="detail-back" id="btn-back" aria-label="Back">
            <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round"><path d="M19 12H5M12 19l-7-7 7-7"/></svg>
          </Link>
          <div className="detail-hero-actions">
            <button className="detail-action-btn" id="btn-save" aria-label="Save">
              <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><path d="M20.84 4.61a5.5 5.5 0 00-7.78 0L12 5.67l-1.06-1.06a5.5 5.5 0 00-7.78 7.78l1.06 1.06L12 21.23l7.78-7.78 1.06-1.06a5.5 5.5 0 000-7.78z"/></svg>
            </button>
            <button className="detail-action-btn" id="btn-share" aria-label="Share">
              <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><path d="M4 12v8a2 2 0 002 2h12a2 2 0 002-2v-8M16 6l-4-4-4 4M12 2v13"/></svg>
            </button>
          </div>
        </div>
        <div className="detail-hero-badges" id="hero-badges">
          {place.vibe?.slice(0, 1).map(v => (
            <span key={v} className="hero-badge-tag">{v.toUpperCase()}</span>
          ))}
        </div>
      </div>

      {/* Scrollable Content */}
      <div className="detail-scroll" id="detail-scroll" style={{ paddingBottom: '100px' }}>
        
        {/* Title Section */}
        <section className="detail-title-section">
          <h1 className="detail-name">{place.name}</h1>
          <div className="detail-cats">
            <span className="detail-cat">{place.category === 'food' ? '🍜 Ẩm thực' : '🏛️ Tham quan'}</span>
            <span className="detail-cat">📍 {place.address}</span>
          </div>
          <div className="detail-stats">
            <div className="detail-stat">
              <span className="detail-stat-icon">⭐</span>
              <span className="detail-stat-val">{place.rating || '4.5'}</span>
              <span className="detail-stat-label">({place.rating_count || 0})</span>
            </div>
            <div className="detail-stat-divider"></div>
            <div className="detail-stat">
              <span className="detail-stat-icon">💰</span>
              <span className="detail-stat-val">{place.price || 'Miễn phí'}</span>
            </div>
            <div className="detail-stat-divider"></div>
            <div className="detail-stat">
              <span className="detail-stat-icon">⏱</span>
              <span className="detail-stat-val">{place.duration || '1 giờ'}</span>
            </div>
          </div>
        </section>

        {/* AI Insight */}
        {place.ai_insight && (
          <section className="section" id="ai-insight-section">
            <div className="detail-ai-insight">
              <div className="dai-icon">🧠</div>
              <div className="dai-body">
                <span className="dai-label">AI gợi ý</span>
                <p className="dai-text">{place.ai_insight}</p>
              </div>
            </div>
          </section>
        )}

        {/* Description */}
        <section className="section" id="desc-section">
          <h2 className="section-title">📖 Giới thiệu</h2>
          <p className="detail-desc">{place.description}</p>
          
          {place.highlights && place.highlights.length > 0 && (
            <ul style={{ marginTop: '10px', paddingLeft: '20px', color: 'var(--color-text-light)', fontSize: '0.85rem' }}>
              {place.highlights.map(h => <li key={h} style={{ marginBottom: '6px' }}>{h}</li>)}
            </ul>
          )}
        </section>
        
        {/* Tips */}
        {place.tips && place.tips.length > 0 && (
          <section className="section">
            <h2 className="section-title">💡 Mẹo bỏ túi</h2>
            <div style={{ background: '#f5f7fa', padding: '16px', borderRadius: '12px', marginTop: '12px' }}>
              {place.tips.map(tip => (
                <div key={tip} style={{ display: 'flex', gap: '8px', marginBottom: '10px' }}>
                  <span>✓</span>
                  <span style={{ fontSize: '0.85rem', color: 'var(--color-text)' }}>{tip}</span>
                </div>
              ))}
            </div>
          </section>
        )}
      </div>
    </div>
  );
}
