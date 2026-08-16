'use client';
import useOnboardingStore from '@/store/useOnboardingStore';

export default function StepResult() {
  const { currentStep, answers } = useOnboardingStore();
  const stepNumber = 11;

  if (currentStep !== stepNumber) return null;

  return (
    <section className="flow-step active" data-step={stepNumber}>
      <div className="result-screen">
        <div className="result-header-card">
          <div className="result-badge">
            <span className="result-badge-dot"></span>
            <span>AI Generated</span>
          </div>
          <h2 className="result-title">Your Huế Journey</h2>
          <div className="result-meta">
            <span className="result-meta-item">📅 {answers.duration}</span>
            <span className="result-meta-divider">·</span>
            <span className="result-meta-item">💰 {answers.budget}</span>
            <span className="result-meta-divider">·</span>
            <span className="result-meta-item">👫 {answers.companion}</span>
          </div>
        </div>

        <div className="itinerary-days">
          <div className="day-card">
            <div className="day-header">
              <span className="day-number">Demo Result</span>
              <span className="day-theme">Coming in Phase 4</span>
            </div>
            <div className="day-items">
              <div className="day-item">
                <span className="item-time">08:00</span>
                <div className="item-content">
                  <span className="item-name">Imperial Citadel</span>
                  <span className="item-type">🏛️ Culture</span>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>
    </section>
  );
}
