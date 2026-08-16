import FlowHeader from '@/components/flow/FlowHeader';
import Navigation from '@/components/flow/Navigation';
import StepDuration from '@/components/flow/steps/StepDuration';
// Import các step khác ở đây khi tạo xong...

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
        {/* <StepCompanion /> */}
        {/* ... */}
      </main>

      <Navigation />
    </div>
  );
}
