'use client';
import Link from 'next/link';
import { usePathname } from 'next/navigation';

export default function BottomNav() {
  const pathname = usePathname();

  // Danh sách các trang KHÔNG hiển thị Bottom Nav
  const hiddenRoutes = ['/', '/flow', '/admin/places/new'];
  if (hiddenRoutes.includes(pathname)) return null;
  // Hoặc ẩn nếu route bắt đầu bằng /admin
  if (pathname?.startsWith('/admin')) return null;

  return (
    <>
      {/* Floating AI Button */}
      <Link href="/flow" className="floating-ai-btn" aria-label="AI Plan">
        <span className="fab-ai-icon">✨</span>
      </Link>

      {/* Bottom Navbar */}
      <nav className="bottom-nav">
        <Link href="/home" className={`nav-item ${pathname === '/home' ? 'active' : ''}`}>
          <svg width="22" height="22" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
            <path d="M3 9l9-7 9 7v11a2 2 0 01-2 2H5a2 2 0 01-2-2z"/>
            <polyline points="9 22 9 12 15 12 15 22"/>
          </svg>
          <span>Trang chủ</span>
        </Link>
        <Link href="/explore" className={`nav-item ${pathname === '/explore' ? 'active' : ''}`}>
          <svg width="22" height="22" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
            <circle cx="11" cy="11" r="8"/>
            <path d="M21 21l-4.35-4.35"/>
          </svg>
          <span>Khám phá</span>
        </Link>
        
        {/* Placeholder spacer for floating button */}
        <div className="nav-item-spacer"></div>

        <Link href="/trips" className={`nav-item ${pathname === '/trips' ? 'active' : ''}`}>
          <svg width="22" height="22" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
            <rect x="3" y="4" width="18" height="18" rx="2" ry="2" />
            <line x1="16" y1="2" x2="16" y2="6" />
            <line x1="8" y1="2" x2="8" y2="6" />
            <line x1="3" y1="10" x2="21" y2="10" />
          </svg>
          <span>Chuyến đi</span>
        </Link>
        <Link href="/profile" className={`nav-item ${pathname === '/profile' ? 'active' : ''}`}>
          <svg width="22" height="22" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
            <path d="M20 21v-2a4 4 0 00-4-4H8a4 4 0 00-4 4v2"/>
            <circle cx="12" cy="7" r="4"/>
          </svg>
          <span>Cá nhân</span>
        </Link>
      </nav>
    </>
  );
}
