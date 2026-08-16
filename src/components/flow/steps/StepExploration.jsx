'use client';
import useOnboardingStore from '@/store/useOnboardingStore';

export default function StepExploration() {
  const { currentStep, answers, setAnswer, nextStep } = useOnboardingStore();
  const stepNumber = 5;

  if (currentStep !== stepNumber) return null;

  const handleSelect = (value) => {
    setAnswer('exploration', value);
    setTimeout(() => {
      nextStep();
    }, 400);
  };

  const options = [
    { value: 'hidden_gems', emoji: '💎', name: 'Hidden Gems', sub: 'Local spots, off the beaten path' },
    { value: 'iconic', emoji: '📸', name: 'Iconic Landmarks', sub: 'Must-see attractions' },
    { value: 'story', emoji: '🎭', name: 'Story-seeker', sub: 'History, art, and local tales' },
  ];

  return (
    <section className="flow-step active" data-step={stepNumber}>
      <div className="step-decorator">
        <span className="step-emoji">🗺️</span>
      </div>
      <div className="step-question">
        <span className="step-label">Step {stepNumber} of 9</span>
        <h2 className="step-title">How do you like to<br/><span className="accent">explore?</span></h2>
        <p className="step-desc">Your preferred way to discover the city.</p>
      </div>
      
      <div className="option-list">
        {options.map((opt) => (
          <button 
            key={opt.value}
            className={`option-row ${answers.exploration === opt.value ? 'selected' : ''}`}
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
