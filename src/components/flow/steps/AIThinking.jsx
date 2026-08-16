'use client';
import { useEffect, useState } from 'react';
import useOnboardingStore from '@/store/useOnboardingStore';
import { API } from '@/lib/api-client';

export default function AIThinking() {
  const { currentStep, answers, setSubmitting, nextStep } = useOnboardingStore();
  const [activeStep, setActiveStep] = useState(1);
  const stepNumber = 10;

  useEffect(() => {
    if (currentStep !== stepNumber) return;

    // Bắt đầu quá trình AI thinking
    setSubmitting(true);
    let stepInterval;
    let currentAiStep = 1;

    // Giả lập tiến trình suy nghĩ của AI
    stepInterval = setInterval(() => {
      currentAiStep++;
      if (currentAiStep <= 4) {
        setActiveStep(currentAiStep);
      } else {
        clearInterval(stepInterval);
      }
    }, 800);

    // Gọi API thực tế
    API.generateTrip(answers)
      .then((data) => {
        clearInterval(stepInterval);
        setActiveStep(4);
        setTimeout(() => {
          setSubmitting(false);
          nextStep(); // Chuyển sang Step 11 (Result)
        }, 500);
      })
      .catch((error) => {
        console.error('Failed to generate trip:', error);
        setSubmitting(false);
        // Ở đây có thể xử lý lỗi và quay lại step 9
      });

    return () => clearInterval(stepInterval);
  }, [currentStep, answers, setSubmitting, nextStep]);

  if (currentStep !== stepNumber) return null;

  return (
    <section className="flow-step active" data-step={stepNumber}>
      <div className="ai-thinking-screen">
        <div className="ai-orb-container">
          <div className="ai-orb">
            <div className="ai-orb-ring ring-1"></div>
            <div className="ai-orb-ring ring-2"></div>
            <div className="ai-orb-ring ring-3"></div>
            <div className="ai-orb-core">✨</div>
          </div>
        </div>
        <h2 className="ai-thinking-title">Creating your journey...</h2>
        <p className="ai-thinking-sub">AI is analyzing your preferences</p>
        <div className="ai-thinking-steps">
          <div className={`ai-step ${activeStep >= 1 ? 'active' : ''} ${activeStep > 1 ? 'done' : ''}`}>
            <span className="ai-step-icon">🗺️</span>
            <span className="ai-step-text">Mapping best routes</span>
            <span className="ai-step-status"></span>
          </div>
          <div className={`ai-step ${activeStep >= 2 ? 'active' : ''} ${activeStep > 2 ? 'done' : ''}`}>
            <span className="ai-step-icon">🍜</span>
            <span className="ai-step-text">Finding food gems</span>
            <span className="ai-step-status"></span>
          </div>
          <div className={`ai-step ${activeStep >= 3 ? 'active' : ''} ${activeStep > 3 ? 'done' : ''}`}>
            <span className="ai-step-icon">🏛️</span>
            <span className="ai-step-text">Curating experiences</span>
            <span className="ai-step-status"></span>
          </div>
          <div className={`ai-step ${activeStep >= 4 ? 'active' : ''} ${activeStep > 4 ? 'done' : ''}`}>
            <span className="ai-step-icon">💰</span>
            <span className="ai-step-text">Optimizing budget</span>
            <span className="ai-step-status"></span>
          </div>
        </div>
        <div className="ai-fun-fact">
          <span className="fact-icon">💡</span>
          <span className="fact-text">Did you know? Huế has over 1,300 unique dishes in its culinary tradition!</span>
        </div>
      </div>
    </section>
  );
}
