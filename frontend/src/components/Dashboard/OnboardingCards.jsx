import { navigate } from '../../hooks/usePathname.js';
import { Icon } from '../Icon.jsx';

export function OnboardingHeaderBanner() {
  return (
    <div className="db-onboarding-welcome-card">
      <div className="db-onboarding-icon">
        <Icon name="spark" />
      </div>
      <div className="db-onboarding-text">
        <h3>Welcome to CareerPrep! 🚀</h3>
        <p>
          You're all set up. Get started by building your first ATS-friendly resume or starting an AI-powered mock interview to calculate your Career Readiness score.
        </p>
      </div>
    </div>
  );
}

export function OnboardingCardsGrid() {
  return (
    <div className="db-onboarding-grid">
      <div className="db-onboarding-card" onClick={() => navigate('/resume')}>
        <div className="db-onboarding-card-icon icon--blue">
          <Icon name="document" />
        </div>
        <h4>Build your first resume</h4>
        <p>Upload or create your resume to generate ATS recommendations and calculate your Resume Score.</p>
        <button type="button" className="db-onboarding-btn btn--blue">
          Create Resume →
        </button>
      </div>

      <div className="db-onboarding-card" onClick={() => navigate('/mock-interviews')}>
        <div className="db-onboarding-card-icon icon--violet">
          <Icon name="mic" />
        </div>
        <h4>Start your first mock interview</h4>
        <p>Practice realistic role questions with real-time AI feedback and uncover your strengths.</p>
        <button type="button" className="db-onboarding-btn btn--violet">
          Launch Mock Session →
        </button>
      </div>

      <div className="db-onboarding-card" onClick={() => navigate('/jd-analyzer')}>
        <div className="db-onboarding-card-icon icon--mint">
          <Icon name="analytics" />
        </div>
        <h4>Analyze a Job Description</h4>
        <p>Paste target JDs to match your skills and optimize your application strategy.</p>
        <button type="button" className="db-onboarding-btn btn--mint">
          Analyze JD →
        </button>
      </div>
    </div>
  );
}

export function EmptyRecentActivity() {
  return (
    <div className="db-empty-widget">
      <div className="db-empty-icon">
        <Icon name="refresh" />
      </div>
      <h4>No activity yet</h4>
      <p>Activities will automatically log here as you practice questions, optimize your resume, and conduct interviews.</p>
      <div className="db-empty-ctas">
        <button type="button" className="db-empty-cta-btn" onClick={() => navigate('/practice')}>
          Start Practice Drill
        </button>
      </div>
    </div>
  );
}

export function EmptyUpcomingInterview() {
  return (
    <div className="db-banner-interview-card" style={{ background: 'linear-gradient(135deg, #1e293b 0%, #0f172a 100%)' }}>
      <div className="db-banner-top-row">
        <div className="db-camera-badge">
          <Icon name="mic" />
        </div>
        <div className="db-banner-info">
          <h3>Start your first mock interview</h3>
          <p>No upcoming interviews scheduled yet. Launch an AI Mock Interview session to test your knowledge.</p>
        </div>
      </div>
      <div className="db-banner-bottom-row" style={{ justifyContent: 'flex-end', marginTop: '8px' }}>
        <button
          type="button"
          className="btn-prepare-now"
          onClick={() => navigate('/mock-interviews')}
        >
          Launch Mock Session
        </button>
      </div>
    </div>
  );
}
