'use client';
import useOnboardingStore from '@/store/useOnboardingStore';

export default function StepEnergy() {
  const { currentStep, answers, setAnswer, nextStep } = useOnboardingStore();
  const stepNumber = 6;

  if (currentStep !== stepNumber) return null;

  const handleSelect = (value) => {
    setAnswer('energy', value);
    setTimeout(() => {
      nextStep();
    }, 400);
  };

  const options = [
    { value: 'early_bird', emoji: '🌅', name: 'Early Bird', sub: 'Morning explorer' },
    { value: 'night_owl', emoji: '🌙', name: 'Night Owl', sub: 'Evening adventurer' },
  ];

  return (
    <section className="flow-step active" data-step={stepNumber}>
      <div className="step-decorator">
        <span className="step-emoji">🔋</span>
      </div>
      <div className="step-question">
        <span className="step-label">Step {stepNumber} of 9</span>
        <h2 className="step-title">When do you have<br/><span className="accent">the most energy?</span></h2>
        <p className="step-desc">We'll schedule the best activities at your peak times.</p>
      </div>
      
      <div className="option-grid option-grid-2">
        {options.map((opt) => (
          <button 
            key={opt.value}
            className={`option-card ${answers.energy === opt.value ? 'selected' : ''}`}
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
