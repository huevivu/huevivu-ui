import Image from 'next/image';

export default function HeroSection() {
  return (
    <section className="hero-section" id="hero-section">
      <div className="hero-image-container">
        <div className="hero-image-wrapper">
          <Image 
            src="/assets/hero.png" 
            alt="Hue Vietnam travel" 
            className="hero-image" 
            id="hero-image"
            width={600}
            height={800}
            priority
          />
          <div className="hero-image-overlay"></div>
        </div>
        <div className="floating-card card-itinerary" id="card-1">
          <div className="card-icon">📍</div>
          <div className="card-content">
            <span className="card-label">AI Itinerary</span>
            <span className="card-value">3-day plan ready</span>
          </div>
        </div>
        <div className="floating-card card-food" id="card-2">
          <div className="card-icon">🍜</div>
          <div className="card-content">
            <span className="card-label">Food Discovery</span>
            <span className="card-value">Bún bò Huế trail</span>
          </div>
        </div>
        <div className="floating-card card-budget" id="card-3">
          <div className="card-icon">✨</div>
          <div className="card-content">
            <span className="card-label">Smart Budget</span>
            <span className="card-value">$45/day avg</span>
          </div>
        </div>
      </div>
    </section>
  );
}
