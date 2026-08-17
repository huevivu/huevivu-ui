import '../styles/home.css';

export default function HomeDashboard() {
  return (
    <div className="home-scroll" id="home-scroll">
      {/* Greeting Header */}
      <header className="home-header scrolled" id="home-header">
        <div className="greeting-row">
          <div className="greeting-text">
            <span className="greeting-hi">Xin chào! 👋</span>
            <h1 className="greeting-name">Khám phá Huế</h1>
          </div>
          <div className="header-actions">
            <button className="header-btn" id="btn-notif" aria-label="Notifications">
              <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
                <path d="M18 8A6 6 0 006 8c0 7-3 9-3 9h18s-3-2-3-9M13.73 21a2 2 0 01-3.46 0" />
              </svg>
              <span className="notif-dot"></span>
            </button>
            <div className="avatar" id="btn-profile">
              <span>H</span>
            </div>
          </div>
        </div>

        {/* Search Bar */}
        <div className="search-bar" id="search-bar">
          <svg className="search-icon" width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round">
            <circle cx="11" cy="11" r="8" />
            <path d="M21 21l-4.35-4.35" />
          </svg>
          <input type="text" className="search-input" id="search-input" placeholder="Tìm địa điểm, ẩm thực, trải nghiệm..." />
          <button className="search-filter" id="search-filter" aria-label="Filter">
            <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round">
              <line x1="4" y1="21" x2="4" y2="14" />
              <line x1="4" y1="10" x2="4" y2="3" />
              <line x1="12" y1="21" x2="12" y2="12" />
              <line x1="12" y1="8" x2="12" y2="3" />
              <line x1="20" y1="21" x2="20" y2="16" />
              <line x1="20" y1="12" x2="20" y2="3" />
            </svg>
          </button>
        </div>
      </header>

      {/* Active Trip Card */}
      <section className="section visible" id="active-trip-section">
        <div className="active-trip-card" id="active-trip-card">
          <div className="atc-left">
            <div className="atc-badge">
              <span className="atc-badge-dot"></span> Chuyến đi đang hoạt động
            </div>
            <h3 className="atc-title">3-Day Food & Culture</h3>
            <div className="atc-meta">
              <span>📅 3 ngày</span>
              <span>·</span>
              <span>📍 12 điểm</span>
            </div>
            <button className="atc-btn" id="btn-view-trip">Xem lịch trình →</button>
          </div>
          <div className="atc-right">
            {/* Using a placeholder since we don't have the exact image ported yet */}
            <div style={{width: '100%', height: '100%', background: '#fff', borderRadius: '8px', display: 'flex', alignItems: 'center', justifyContent: 'center', fontSize: '2rem'}}>⛩️</div>
          </div>
        </div>
      </section>

      {/* AI Welcome Banner */}
      <section className="section visible" id="ai-welcome-section">
        <div className="ai-welcome-banner" id="ai-welcome-banner">
          <div className="ai-welcome-row">
            <div className="ai-welcome-avatar">
              <span>✨</span>
            </div>
            <div className="ai-welcome-body">
              <span className="ai-welcome-label">AI gợi ý hôm nay</span>
              <p className="ai-welcome-text">Chào buổi sáng! Trời đẹp 28°C — thích hợp ghé Chùa Thiên Mụ lúc sáng sớm, ít người và ánh sáng đẹp để chụp ảnh. 🌅</p>
            </div>
          </div>
          <div className="ai-welcome-actions">
            <button className="ai-welcome-chip" id="ai-chip-accept">Xem lịch trình →</button>
            <button className="ai-welcome-chip ai-welcome-chip-alt" id="ai-chip-dismiss">Lần sau</button>
          </div>
        </div>
      </section>

      {/* AI Quick Actions */}
      <section className="section visible">
        <h2 className="section-title">✨ AI có thể giúp gì?</h2>
        <div className="quick-actions">
          <button className="qa-card" data-action="plan" id="qa-plan">
            <span className="qa-icon">🗺️</span>
            <span className="qa-label">Lên kế hoạch</span>
          </button>
          <button className="qa-card" data-action="food" id="qa-food">
            <span className="qa-icon">🍜</span>
            <span className="qa-label">Tìm quán ăn</span>
          </button>
          <button className="qa-card" data-action="culture" id="qa-culture">
            <span className="qa-icon">🏛️</span>
            <span className="qa-label">Văn hóa</span>
          </button>
          <button className="qa-card" data-action="photo" id="qa-photo">
            <span className="qa-icon">📸</span>
            <span className="qa-label">Chụp ảnh</span>
          </button>
        </div>
      </section>

      {/* Categories */}
      <section className="section visible">
        <div className="section-header">
          <h2 className="section-title">🔍 Khám phá theo danh mục</h2>
        </div>
        <div className="category-scroll">
          <button className="cat-pill active" data-cat="all">Tất cả</button>
          <button className="cat-pill" data-cat="heritage">Di tích</button>
          <button className="cat-pill" data-cat="food">Ẩm thực</button>
          <button className="cat-pill" data-cat="nature">Thiên nhiên</button>
          <button className="cat-pill" data-cat="temple">Chùa chiền</button>
          <button className="cat-pill" data-cat="market">Chợ</button>
          <button className="cat-pill" data-cat="cafe">Cà phê</button>
        </div>
      </section>
      
      {/* Spacer for bottom nav */}
      <div style={{height: '100px'}}></div>
    </div>
  );
}
