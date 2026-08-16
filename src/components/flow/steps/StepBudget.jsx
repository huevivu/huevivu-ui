'use client';
import useOnboardingStore from '@/store/useOnboardingStore';

export default function StepBudget() {
  const { currentStep, answers, setAnswer, nextStep } = useOnboardingStore();
  const stepNumber = 3;

  if (currentStep !== stepNumber) return null;

  const handleSelect = (value) => {
    setAnswer('budget', value);
    setTimeout(() => {
      nextStep();
    }, 400);
  };

  const options = [
    { value: 'budget', emoji: '🎒', label: 'Budget', range: '$20–35/day', desc: 'Hostels, street food, local transport' },
    { value: 'moderate', emoji: '🌸', label: 'Moderate', range: '$40–70/day', desc: 'Boutique stays, mixed dining', popular: true },
    { value: 'premium', emoji: '✨', label: 'Premium', range: '$80–150/day', desc: 'Luxury hotels, fine dining' },
    { value: 'luxury', emoji: '👑', label: 'Luxury', range: '$200+/day', desc: '5-star resorts, private tours' },
  ];

  return (
    <section className="flow-step active" data-step={stepNumber}>
      <div className="step-decorator">
        <span className="step-emoji">💰</span>
      </div>
      <div className="step-question">
        <span className="step-label">Step {stepNumber} of 9</span>
        <h2 className="step-title">What's your<br/><span className="accent">comfort zone?</span></h2>
        <p className="step-desc">AI will match stays, dining, and activities to your budget.</p>
      </div>
      
      <div className="budget-cards">
        {options.map((opt) => (
          <button 
            key={opt.value}
            className={`budget-card ${answers.budget === opt.value ? 'selected' : ''}`}
            onClick={() => handleSelect(opt.value)}
          >
            <div className="budget-card-top">
              <span className="budget-emoji">{opt.emoji}</span>
              <span className="budget-label">{opt.label}</span>
            </div>
            <span className="budget-range">{opt.range}</span>
            <span className="budget-desc">{opt.desc}</span>
            {opt.popular && <span className="budget-popular">Popular</span>}
          </button>
        ))}
      </div>
    </section>
  );
}
