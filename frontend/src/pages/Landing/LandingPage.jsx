import { Icon } from '../../components/Icon.jsx';
import { RouteLink } from '../../components/Common/RouteLink.jsx';
import { MarketingHeader } from '../../components/Layout/MarketingHeader.jsx';
import { MarketingFooter } from '../../components/Layout/MarketingFooter.jsx';

function PricingCard({ title, price, items, cta, featured = false }) {
  return (
    <article className={`pricing-card ${featured ? 'pricing-card--featured' : ''}`}>
      {featured ? <div className="pricing-badge">MOST POPULAR</div> : null}
      <p className="pricing-title">{title}</p>
      <h3 className="pricing-amount">
        {price}
        {price !== 'Custom' ? <span className="price-period">/mo</span> : null}
      </h3>
      <div className="pricing-card__items">
        {items.map((item) => (
          <div key={item} className="pricing-item">
            <Icon name="checkCircle" />
            <span>{item}</span>
          </div>
        ))}
      </div>
      <RouteLink
        path={title === 'TEAM' ? '/auth' : '/dashboard'}
        className={featured ? 'pricing-btn pricing-btn--featured' : 'pricing-btn'}
      >
        {cta}
      </RouteLink>
    </article>
  );
}

export default function LandingPage() {
  return (
    <div className="marketing-shell">
      <MarketingHeader />

      {/* Hero Section */}
      <section className="hero">
        <div className="hero__copy">
          <div className="hero-pill">
            <Icon name="spark" />
            <span>AI-Powered Career</span>
          </div>
          <h1 className="hero-title">
            Master Your Career
            <br />
            Journey with <span className="text-highlight">AI</span>
          </h1>
          <p className="hero-subtitle">
            The intelligent command center for ambitious professionals. Analyze your resume,
            practice with AI avatars, and build your personalized roadmap to success.
          </p>
          <div className="hero__actions">
            <RouteLink path="/resume" className="hero-btn-primary">
              Build Resume <Icon name="arrowRight" />
            </RouteLink>
            <RouteLink path="/mock-interviews" className="hero-btn-secondary">
              Mock Interview
            </RouteLink>
          </div>
          <div className="hero__social-proof">
            <div className="avatar-stack">
              <img src="/images/avatar_alex.png" alt="User 1" />
              <img src="/images/avatar_sarah.png" alt="User 2" />
              <img src="/images/avatar_james.png" alt="User 3" />
            </div>
            <p>
              Joined by <strong>50k+</strong> professionals
            </p>
          </div>
        </div>

        <div className="hero__visual">
          <div className="hero-visual-card">
            <img src="/images/hero_dashboard.png" alt="CareerPrep AI Dashboard" className="hero-visual-img" />

            {/* Floating Widget */}
            <div className="hero-floating-widget">
              <div className="floating-widget-header">
                <div className="widget-icon-bg">
                  <Icon name="document" />
                </div>
                <div className="widget-info">
                  <strong>Resume Upload</strong>
                  <span className="status-text">Analyzing...</span>
                </div>
                <div className="widget-action-icon">
                  <Icon name="upload" />
                </div>
              </div>
              <div className="widget-progress-track">
                <div className="widget-progress-fill" style={{ width: '75%' }} />
              </div>
              <span className="widget-percentage">75%</span>
            </div>
          </div>
        </div>
      </section>

      {/* Stats Bar */}
      <section className="marketing-stats">
        {[
          ['50k+', 'Careers Built'],
          ['94%', 'Placement Rate'],
          ['120+', 'Global Partners'],
          ['4.9/5', 'User Rating'],
        ].map(([value, label]) => (
          <article key={label} className="stat-card">
            <strong>{value}</strong>
            <span>{label}</span>
          </article>
        ))}
      </section>

      {/* Features Grid */}
      <section className="marketing-section">
        <div className="section-head">
          <h2>
            Everything you need to <span className="text-highlight">land your dream role</span>
          </h2>
          <p>Powerful AI tools integrated into a single seamless experience designed for modern career growth.</p>
        </div>

        <div className="landing-feature-grid">
          <article className="landing-feature-card">
            <div className="feature-icon-square icon-blue">
              <Icon name="document" />
            </div>
            <h3>AI Resume Analysis</h3>
            <p>Real-time feedback on your resume structure, keywords, and impact score with ATS optimization.</p>
            <div className="card-inner-preview">
              <Icon name="checkCircle" />
              <span>Quantify your achievements</span>
            </div>
          </article>

          <article className="landing-feature-card landing-feature-card--with-avatar">
            <div className="feature-card-content">
              <div className="feature-icon-square icon-blue">
                <Icon name="mic" />
              </div>
              <h3>Mock Interview</h3>
              <p>Practice with life-like AI avatars that give verbal and sentiment feedback.</p>
            </div>
            <div className="feature-avatar-preview">
              <img src="/images/avatar_ai.png" alt="AI Interviewer Avatar" />
              <div className="avatar-pulse-ring" />
            </div>
          </article>

          <article className="landing-feature-card">
            <div className="feature-icon-square icon-blue">
              <Icon name="roadmap" />
            </div>
            <h3>Roadmap</h3>
            <p>Step-by-step career pathing based on your goals.</p>
          </article>

          <article className="landing-feature-card">
            <div className="feature-icon-square icon-blue">
              <Icon name="code" />
            </div>
            <h3>Coding Assessment</h3>
            <p>Interactive practice for technical roles.</p>
          </article>

          <article className="landing-feature-card landing-feature-card--solid-blue">
            <div className="feature-icon-square icon-white-translucent">
              <Icon name="chat" />
            </div>
            <h3 className="text-white">24/7 AI Chatbot</h3>
            <p className="text-blue-100">
              Instant career advice, salary negotiation tips, and networking guidance at any time.
            </p>
            <div className="ai-coach-prompt-box">
              <span className="ai-coach-badge">AI COACH</span>
              <p>"Try highlighting your Python projects for this Fintech role."</p>
            </div>
          </article>

          <article className="landing-feature-card landing-feature-card--wide">
            <div className="wide-card-left">
              <div className="feature-icon-square icon-dark">
                <Icon name="analytics" />
              </div>
              <div>
                <h3>Aptitude &amp; JD Analysis</h3>
                <p>Match your skills perfectly with job descriptions.</p>
              </div>
            </div>
            <RouteLink path="/jd-analyzer" className="dark-cta-button">
              Explore Analytics
            </RouteLink>
          </article>
        </div>
      </section>

      {/* Testimonials Section */}
      <section className="marketing-section testimonials-section">
        <div className="section-head">
          <h2>Loved by professionals at top companies</h2>
        </div>

        <div className="testimonials-grid">
          <article className="testimonial-card">
            <div className="testimonial-user">
              <img src="/images/avatar_alex.png" alt="Alex Chen" className="user-avatar" />
              <div className="user-details">
                <strong>Alex Chen</strong>
                <span>Software Engineer @ Stripe</span>
              </div>
              <div className="verified-badge-icon">
                <Icon name="linkedin" />
              </div>
            </div>
            <p className="testimonial-quote">
              "The AI interview practice felt incredibly real. It helped me overcome my anxiety and land a role at my dream company."
            </p>
            <div className="testimonial-footer-tag">
              <Icon name="linkedin" />
              <span>Linkedin Verified</span>
            </div>
          </article>

          <article className="testimonial-card">
            <div className="testimonial-user">
              <img src="/images/avatar_sarah.png" alt="Sarah Miller" className="user-avatar" />
              <div className="user-details">
                <strong>Sarah Miller</strong>
                <span>Product Manager @ Google</span>
              </div>
              <div className="verified-badge-icon">
                <Icon name="linkedin" />
              </div>
            </div>
            <p className="testimonial-quote">
              "The roadmap feature saved me weeks of planning. It identified exactly what skills I was missing for a senior PM role."
            </p>
            <div className="testimonial-footer-tag">
              <Icon name="linkedin" />
              <span>Linkedin Verified</span>
            </div>
          </article>

          <article className="testimonial-card">
            <div className="testimonial-user">
              <img src="/images/avatar_james.png" alt="James Wilson" className="user-avatar" />
              <div className="user-details">
                <strong>James Wilson</strong>
                <span>Marketing Lead @ Figma</span>
              </div>
              <div className="verified-badge-icon">
                <Icon name="linkedin" />
              </div>
            </div>
            <p className="testimonial-quote">
              "The JD analyzer is magic. It helped me tailor my resume in minutes, resulting in a 3x higher callback rate."
            </p>
            <div className="testimonial-footer-tag">
              <Icon name="linkedin" />
              <span>Linkedin Verified</span>
            </div>
          </article>
        </div>
      </section>

      {/* Pricing Section */}
      <section className="marketing-section marketing-section--pricing">
        <div className="section-head">
          <h2>
            Simple, transparent <span className="text-highlight">pricing</span>
          </h2>
          <p>Invest in your future with the right plan for your career goals.</p>
        </div>
        <div className="pricing-grid">
          <PricingCard
            title="FREE"
            price="$0"
            cta="Get Started"
            items={['1 Resume Analysis / mo', 'Basic Mock Interview', 'Community Access']}
          />
          <PricingCard
            title="PRO"
            price="$19"
            featured
            cta="Start 7-Day Free Trial"
            items={['Unlimited Resume Analysis', 'Priority AI Mock Interviews', 'Custom Career Roadmap', 'Salary Negotiation AI']}
          />
          <PricingCard
            title="TEAM"
            price="Custom"
            cta="Contact Sales"
            items={['Enterprise Dashboard', 'Team Analytics', 'Dedicated Success Manager']}
          />
        </div>
      </section>

      <MarketingFooter />
    </div>
  );
}
