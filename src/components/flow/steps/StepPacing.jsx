'use client';
import useOnboardingStore from '@/store/useOnboardingStore';

export default function StepPacing() {
  const { currentStep, answers, setAnswer, nextStep } = useOnboardingStore();
  const stepNumber = 4;

  if (currentStep !== stepNumber) return null;

  const handleSelect = (value) => {
    setAnswer('pacing', value);
    setTimeout(() => {
      nextStep();
    }, 400);
  };

  const options = [
    { value: 'action', emoji: '🏃', name: 'Action-packed', sub: 'See as much as possible' },
    { value: 'relaxed', emoji: '🚶', name: 'Relaxed', sub: 'Take time at each spot' },
    { value: 'balanced', emoji: '⚖️', name: 'Balanced', sub: 'A bit of both' },
  ];

  return (
    <section className="flow-step active" data-step={stepNumber}>
      <div className="step-decorator">
        <span className="step-emoji">⏱️</span>
      </div>
      <div className="step-question">
        <span className="step-label">Step {stepNumber} of 9</span>
        <h2 className="step-title">What's your preferred<br/><span className="accent">trip pace?</span></h2>
        <p className="step-desc">How you like to move through your day.</p>
      </div>
      
      <div className="option-list">
        {options.map((opt) => (
          <button 
            key={opt.value}
            className={`option-row ${answers.pacing === opt.value ? 'selected' : ''}`}
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
