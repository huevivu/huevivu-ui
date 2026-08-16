'use client';
import useOnboardingStore from '@/store/useOnboardingStore';

export default function StepTaste() {
  const { currentStep, answers, toggleArrayAnswer } = useOnboardingStore();
  const stepNumber = 8;

  if (currentStep !== stepNumber) return null;

  const handleSelect = (value) => {
    toggleArrayAnswer('taste', value);
    // Lưu ý: Step này dùng nút Next ở Navigation component để chuyển bước
  };

  const options = [
    { value: 'spicy', emoji: '🌶️', name: 'Spicy & Bold', sub: 'True Huế flavors' },
    { value: 'light', emoji: '🌿', name: 'Light & Veg', sub: 'Healthy or plant-based' },
    { value: 'street', emoji: '🛵', name: 'Street Eats', sub: 'Plastic chairs & alleys' },
    { value: 'fine', emoji: '🏰', name: 'Nice Dining', sub: 'Comfortable, premium' },
    { value: 'cafe', emoji: '☕', name: 'Cafe & Chill', sub: 'Great aesthetics & drinks' },
  ];

  return (
    <section className="flow-step active" data-step={stepNumber}>
      <div className="step-decorator">
        <span className="step-emoji">🍽️</span>
      </div>
      <div className="step-question">
        <span className="step-label">Step {stepNumber} of 9</span>
        <h2 className="step-title">What is your<br/><span className="accent">dining style?</span></h2>
        <p className="step-desc">Pick all that apply. We'll find the perfect spots.</p>
      </div>
      
      <div className="option-grid option-grid-2 multi-select">
        {options.map((opt) => (
          <button 
            key={opt.value}
            className={`option-card ${(answers.taste || []).includes(opt.value) ? 'selected' : ''}`}
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
