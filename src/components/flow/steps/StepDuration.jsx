'use client';
import useOnboardingStore from '@/store/useOnboardingStore';

export default function StepDuration() {
  const { currentStep, answers, setAnswer, nextStep } = useOnboardingStore();
  const stepNumber = 1;

  if (currentStep !== stepNumber) return null;

  const handleSelect = (value) => {
    setAnswer('duration', value);
    // Tự động chuyển bước sau 400ms để tạo cảm giác mượt mà
    setTimeout(() => {
      nextStep();
    }, 400);
  };

  return (
    <section className="flow-step active" data-step={stepNumber}>
      <div className="step-decorator">
        <span className="step-emoji">🗓️</span>
      </div>
      <div className="step-question">
        <span className="step-label">Step {stepNumber} of 9</span>
        <h2 className="step-title">How long will you<br/><span className="accent">explore Huế?</span></h2>
        <p className="step-desc">This helps AI tailor the pace and depth of your itinerary.</p>
      </div>
      
      <div className="option-grid option-grid-2">
        {[
          { value: '1-2', emoji: '⚡', name: '1–2 days', sub: 'Quick visit' },
          { value: '3-4', emoji: '🌤️', name: '3–4 days', sub: 'Weekend trip' },
          { value: '5-7', emoji: '🧳', name: '5–7 days', sub: 'Deep dive' },
          { value: 'open', emoji: '♾️', name: 'Not sure yet', sub: 'Flexible' },
        ].map((opt) => (
          <button 
            key={opt.value}
            className={`option-card ${answers.duration === opt.value ? 'selected' : ''}`}
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
