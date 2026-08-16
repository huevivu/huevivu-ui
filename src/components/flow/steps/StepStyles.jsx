'use client';
import useOnboardingStore from '@/store/useOnboardingStore';

export default function StepStyles() {
  const { currentStep, answers, toggleArrayAnswer } = useOnboardingStore();
  const stepNumber = 9;

  if (currentStep !== stepNumber) return null;

  const handleSelect = (value) => {
    toggleArrayAnswer('styles', value);
    // Step này dùng nút Next để chuyển tới AI Thinking (Step 10)
  };

  const options = [
    { value: 'culture', emoji: '🏛️', name: 'History & Culture', sub: 'Imperial citadel, tombs' },
    { value: 'nature', emoji: '🌿', name: 'Nature & Wellness', sub: 'Hot springs, trails' },
    { value: 'photo', emoji: '📸', name: 'Photography', sub: 'Golden hour spots' },
    { value: 'spiritual', emoji: '🛕', name: 'Temples & Spiritual', sub: 'Pagodas, zen gardens' },
    { value: 'craft', emoji: '🎨', name: 'Art & Craft', sub: 'Villages, workshops' },
  ];

  return (
    <section className="flow-step active" data-step={stepNumber}>
      <div className="step-decorator">
        <span className="step-emoji">🎨</span>
      </div>
      <div className="step-question">
        <span className="step-label">Step {stepNumber} of 9</span>
        <h2 className="step-title">What excites you<br/><span className="accent">the most?</span></h2>
        <p className="step-desc">Pick all that spark joy. AI will blend them into your plan.</p>
      </div>
      
      <div className="option-grid option-grid-2 multi-select">
        {options.map((opt) => (
          <button 
            key={opt.value}
            className={`option-card ${(answers.styles || []).includes(opt.value) ? 'selected' : ''}`}
            onClick={() => handleSelect(opt.value)}
          >
            <span className="option-emoji">{opt.emoji}</span>
            <span className="option-name">{opt.name}</span>
            <span className="option-sub">{opt.sub}</span>
          </button>
        ))}
      </div>
      <div className="multi-hint">
        <span>💡 Tap multiple to select</span>
      </div>
    </section>
  );
}
