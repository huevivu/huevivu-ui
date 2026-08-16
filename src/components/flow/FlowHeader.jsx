'use client';
import { useRouter } from 'next/navigation';
import useOnboardingStore from '@/store/useOnboardingStore';

export default function FlowHeader() {
  const router = useRouter();
  const { currentStep, prevStep } = useOnboardingStore();

  const handleBack = () => {
    if (currentStep === 1) {
      router.push('/');
    } else {
      prevStep();
    }
  };

  const handleSkip = () => {
    // Tạm thời skip logic
    console.log("Skip");
  };

  const progressPercent = Math.min(((currentStep - 1) / 9) * 100, 100);

  // Ẩn header ở bước 10 (AI Thinking) và 11 (Result)
  if (currentStep >= 10) return null;

  return (
    <header className="flow-header" id="flow-header">
      <button className="flow-back" id="flow-back" aria-label="Go back" onClick={handleBack}>
        <svg width="22" height="22" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round">
          <path d="M19 12H5M12 19l-7-7 7-7"/>
        </svg>
      </button>
      <div className="flow-progress-bar">
        <div 
          className="flow-progress-fill" 
          id="progress-fill" 
          style={{ width: `${progressPercent}%` }}
        ></div>
      </div>
      <button className="flow-skip" id="flow-skip" onClick={handleSkip}>Skip</button>
    </header>
  );
}
