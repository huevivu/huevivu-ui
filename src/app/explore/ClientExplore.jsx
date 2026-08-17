'use client';
import { useState } from 'react';
import Link from 'next/link';
import '../../styles/explore.css';

export default function ClientExplore({ initialPlaces }) {
  const [activeFilter, setActiveFilter] = useState('all');
  const [searchQuery, setSearchQuery] = useState('');

  // Lọc dữ liệu theo category và search
  const filteredPlaces = initialPlaces.filter((place) => {
    const matchesCat = activeFilter === 'all' || place.category === activeFilter;
    const matchesSearch = place.name.toLowerCase().includes(searchQuery.toLowerCase());
    return matchesCat && matchesSearch;
  });

  return (
    <div className="page-scroll" id="page-scroll">
      {/* Header */}
      <header className="page-header" id="page-header">
        <h1 className="page-header-title">Khám phá</h1>
        <button className="page-header-btn" id="btn-map" aria-label="Map">
          <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
            <polygon points="1 6 1 22 8 18 16 22 23 18 23 2 16 6 8 2 1 6" />
            <line x1="8" y1="2" x2="8" y2="18" />
            <line x1="16" y1="6" x2="16" y2="22" />
          </svg>
        </button>
      </header>

      {/* Search */}
      <div className="explore-search" id="explore-search">
        <div className="explore-search-bar">
          <svg className="search-icon" width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round">
            <circle cx="11" cy="11" r="8" />
            <path d="M21 21l-4.35-4.35" />
          </svg>
          <input 
            type="text" 
            className="search-input" 
            placeholder="Tìm kiếm địa điểm, trải nghiệm..." 
            value={searchQuery}
            onChange={(e) => setSearchQuery(e.target.value)}
          />
        </div>
      </div>

      {/* AI Suggestion Bar */}
      <div className="ai-explore-bar" id="ai-explore-bar">
        <div className="ai-explore-icon"><span>✨</span></div>
        <div className="ai-explore-content">
          <span className="ai-explore-text">Hôm nay trời đẹp — thích hợp ghé thăm Chùa Thiên Mụ lúc sáng sớm!</span>
        </div>
        <button className="ai-explore-action">Xem →</button>
      </div>

      {/* Filter Chips */}
      <div className="filter-chips">
        <button className={`filter-chip ${activeFilter === 'all' ? 'active' : ''}`} onClick={() => setActiveFilter('all')}>🌟 Tất cả</button>
        <button className={`filter-chip ${activeFilter === 'heritage' ? 'active' : ''}`} onClick={() => setActiveFilter('heritage')}>🏛️ Di tích</button>
        <button className={`filter-chip ${activeFilter === 'food' ? 'active' : ''}`} onClick={() => setActiveFilter('food')}>🍜 Ẩm thực</button>
        <button className={`filter-chip ${activeFilter === 'nature' ? 'active' : ''}`} onClick={() => setActiveFilter('nature')}>🌿 Thiên nhiên</button>
        <button className={`filter-chip ${activeFilter === 'temple' ? 'active' : ''}`} onClick={() => setActiveFilter('temple')}>🛕 Chùa chiền</button>
        <button className={`filter-chip ${activeFilter === 'cafe' ? 'active' : ''}`} onClick={() => setActiveFilter('cafe')}>☕ Cà phê</button>
      </div>

      {/* Danh sách địa điểm */}
      <section className="section visible">
        <div className="section-header">
          <h2 className="section-title">📍 Gợi ý cho bạn</h2>
          <button className="see-all">Xem bản đồ</button>
        </div>
        <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '14px', marginTop: '14px' }}>
          {filteredPlaces.length > 0 ? (
            filteredPlaces.map(place => (
              <Link href={`/places/${place.id}`} key={place.id} style={{ textDecoration: 'none' }}>
                <div className="place-card" style={{ width: '100%' }}>
                  <div className="place-img" style={{ height: '120px' }}>
                    <img src={place.images?.[0] || 'https://images.unsplash.com/photo-1540483761890-a1f7be05ce34?w=400&q=80'} alt={place.name} />
                    <div className="place-badge">HOT</div>
                  </div>
                  <div className="place-body">
                    <span className="place-name" style={{ fontSize: '0.85rem' }}>{place.name}</span>
                    <span className="place-cat">{place.category === 'food' ? '🍜 Ẩm thực' : '🏛️ Tham quan'}</span>
                    <div className="place-meta">
                      <span className="nearby-rating">⭐ {place.rating}</span>
                    </div>
                  </div>
                </div>
              </Link>
            ))
          ) : (
            <div style={{ gridColumn: '1 / -1', textAlign: 'center', padding: '40px 20px', color: '#666' }}>
              Không tìm thấy địa điểm nào phù hợp.
            </div>
          )}
        </div>
      </section>

      {/* Spacer cho bottom nav */}
      <div style={{ height: '100px' }}></div>
    </div>
  );
}
