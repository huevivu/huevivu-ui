'use client';
import useOnboardingStore from '@/store/useOnboardingStore';

export default function StepCompanion() {
  const { currentStep, answers, setAnswer, nextStep } = useOnboardingStore();
  const stepNumber = 2;

  if (currentStep !== stepNumber) return null;

  const handleSelect = (value) => {
    setAnswer('companion', value);
    setTimeout(() => {
      nextStep();
    }, 400);
  };

  const options = [
    { value: 'solo', emoji: '🧑', name: 'Solo Explorer', sub: 'Freedom to roam at your pace' },
    { value: 'couple', emoji: '💑', name: 'With Partner', sub: 'Romantic spots & cozy dining' },
    { value: 'friends', emoji: '👫', name: 'Friends Group', sub: 'Fun activities & nightlife' },
    { value: 'family', emoji: '👨‍👩‍👧', name: 'Family Trip', sub: 'Kid-friendly & relaxed pace' },
  ];

  return (
    <section className="flow-step active" data-step={stepNumber}>
      <div className="step-decorator">
        <span className="step-emoji">👥</span>
      </div>
      <div className="step-question">
        <span className="step-label">Step {stepNumber} of 9</span>
        <h2 className="step-title">Who's joining<br/><span className="accent">the adventure?</span></h2>
        <p className="step-desc">We'll adjust activities, dining and pacing accordingly.</p>
      </div>
      
      <div className="option-list">
        {options.map((opt) => (
          <button 
            key={opt.value}
            className={`option-row ${answers.companion === opt.value ? 'selected' : ''}`}
            onClick={() => handleSelect(opt.value)}
          >
            <span className="option-row-emoji">{opt.emoji}</span>
            <div className="option-row-text">
              <span className="option-row-name">{opt.name}</span>
              <span className="option-row-sub">{opt.sub}</span>
            </div>
            <span className="option-row-check"></span>
          </button>
        ))}
      </div>
    </section>
  );
}
