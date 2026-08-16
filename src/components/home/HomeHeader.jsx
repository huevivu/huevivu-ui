import Image from 'next/image';
import Link from 'next/link';

export default function HomeHeader() {
  return (
    <header className="onboarding-header" id="header">
      <div className="logo-group">
        <div className="logo-icon" id="logo-icon">
          {/* We will use a placeholder or the actual asset if it exists. 
              Currently pointing to /assets/logo.png from the public folder. */}
          <Image src="/assets/logo.png" alt="HueViVu Logo" width={32} height={32} />
        </div>
        <div className="logo-text">
          <span className="logo-name">HueViVu</span>
          <span className="logo-tagline">AI Travel Companion</span>
        </div>
      </div>
      <div className="language-pill" id="lang-toggle">
        <span className="lang-active">EN</span>
        <span className="lang-divider">|</span>
        <span className="lang-inactive">VI</span>
      </div>
    </header>
  );
}
