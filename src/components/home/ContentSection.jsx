import Link from 'next/link';

export default function ContentSection() {
  return (
    <section className="content-section" id="content-section">
      <div className="ai-badge" id="ai-badge">
        <span className="ai-badge-dot"></span>
        <span className="ai-badge-text">Powered by AI</span>
      </div>
      <h1 className="headline" id="headline">
        Let AI plan your<br />
        <span className="headline-accent">Huế journey</span>
      </h1>
      <p className="subtext" id="subtext">
        Personalized travel plans based on your style, budget, food preferences, and travel goals.
      </p>
      <div className="cta-group" id="cta-group">
        <Link href="/flow" className="btn-primary" id="btn-start-planning">
          <span className="btn-sparkle">✨</span>
          <span className="btn-text">Start Planning</span>
          <span className="btn-arrow">→</span>
        </Link>
        <button className="btn-secondary" id="btn-explore">
          <span className="btn-icon">🔍</span>
          <span className="btn-text">Explore Manually</span>
        </button>
      </div>
      <div className="trust-signal" id="trust-signal">
        <span>🔒 No account required · Start exploring instantly</span>
      </div>
    </section>
  );
}
