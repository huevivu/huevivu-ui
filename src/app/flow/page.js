import FlowHeader from '@/components/flow/FlowHeader';
import Navigation from '@/components/flow/Navigation';
import StepDuration from '@/components/flow/steps/StepDuration';
import StepCompanion from '@/components/flow/steps/StepCompanion';
import StepBudget from '@/components/flow/steps/StepBudget';
import StepPacing from '@/components/flow/steps/StepPacing';
import StepExploration from '@/components/flow/steps/StepExploration';
import StepEnergy from '@/components/flow/steps/StepEnergy';
import StepPhysical from '@/components/flow/steps/StepPhysical';
import StepTaste from '@/components/flow/steps/StepTaste';
import StepStyles from '@/components/flow/steps/StepStyles';
import AIThinking from '@/components/flow/steps/AIThinking';
import StepResult from '@/components/flow/steps/StepResult';
import '@/styles/flow.css';

export default function FlowPage() {
  return (
    <div id="app" className="app-container flow-app">
      {/* Ambient Background */}
      <div className="ambient-bg">
        <div className="ambient-orb orb-1"></div>
        <div className="ambient-orb orb-2"></div>
        <div className="ambient-orb orb-3"></div>
      </div>

      <FlowHeader />

      <main className="flow-main" id="flow-main">
        <StepDuration />
        <StepCompanion />
        <StepBudget />
        <StepPacing />
        <StepExploration />
        <StepEnergy />
        <StepPhysical />
        <StepTaste />
        <StepStyles />
        <AIThinking />
        <StepResult />
      </main>

      <Navigation />
    </div>
  );
}
