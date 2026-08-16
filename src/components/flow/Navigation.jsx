'use client';
import useOnboardingStore from '@/store/useOnboardingStore';

export default function Navigation() {
  const { currentStep, nextStep } = useOnboardingStore();

  // Chỉ hiển thị Navigation (nút Next) ở các bước cho phép chọn nhiều (Step 8 và 9)
  if (currentStep !== 8 && currentStep !== 9) return null;

  return (
    <div className="flow-nav">
      <button className="btn-primary btn-next" onClick={nextStep}>
        <span>Next</span>
        <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round">
          <path d="M5 12h14M12 5l7 7-7 7"/>
        </svg>
      </button>
    </div>
  );
}
