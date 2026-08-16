'use client';
import useOnboardingStore from '@/store/useOnboardingStore';

export default function StepPhysical() {
  const { currentStep, answers, setAnswer, nextStep } = useOnboardingStore();
  const stepNumber = 7;

  if (currentStep !== stepNumber) return null;

  const handleSelect = (value) => {
    setAnswer('physical', value);
    setTimeout(() => {
      nextStep();
    }, 400);
  };

  const options = [
    { value: 'outdoorsy', emoji: '☀️', name: 'Outdoorsy', sub: 'Walks & weather are fine' },
    { value: 'comfort', emoji: '☂️', name: 'Comfort-first', sub: 'Prefer AC, minimal walking' },
  ];

  return (
    <section className="flow-step active" data-step={stepNumber}>
      <div className="step-decorator">
        <span className="step-emoji">🌦️</span>
      </div>
      <div className="step-question">
        <span className="step-label">Step {stepNumber} of 9</span>
        <h2 className="step-title">What is your<br/><span className="accent">comfort level?</span></h2>
        <p className="step-desc">How you handle weather and walking.</p>
      </div>
      
      <div className="option-grid option-grid-2">
        {options.map((opt) => (
          <button 
            key={opt.value}
            className={`option-card ${answers.physical === opt.value ? 'selected' : ''}`}
            onClick={() => handleSelect(opt.value)}
          >
            <span className="option-emoji">{opt.emoji}</span>
            <span className="option-name">{opt.name}</span>
            <span className="option-sub">{opt.sub}</span>
          </button>
        ))}
      </div>
    </section>
  );
}
