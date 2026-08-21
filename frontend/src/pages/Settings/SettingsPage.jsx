import { useState } from 'react';
import { useSettings } from '../../hooks/useSettings.js';
import { AppShell } from '../../components/Layout/AppShell.jsx';
import { Icon } from '../../components/Icon.jsx';

function ToggleRow({ title, desc, enabled, onToggle }) {
  return (
    <div className="toggle-row">
      <div>
        <strong>{title}</strong>
        <p>{desc}</p>
      </div>
      <button
        type="button"
        className={`toggle ${enabled ? 'toggle--on' : ''}`}
        onClick={onToggle}
        aria-label={`Toggle ${title}`}
        aria-pressed={enabled}
      >
        <span />
      </button>
    </div>
  );
}

function NotificationsTab({ preferences, setPreferences }) {
  return (
    <div className="toggle-list">
      <ToggleRow
        title="Email Notifications"
        desc="Receive updates about your progress, weekly reports, and critical alerts."
        enabled={preferences.email}
        onToggle={() => setPreferences((current) => ({ ...current, email: !current.email }))}
      />
      <ToggleRow
        title="Interview Reminders"
        desc="Get notified 15 minutes before scheduled AI mock interview sessions."
        enabled={preferences.reminders}
        onToggle={() => setPreferences((current) => ({ ...current, reminders: !current.reminders }))}
      />
      <ToggleRow
        title="Weekly Career Insights"
        desc="A personalized summary of your skill growth, readiness score, and practice streak."
        enabled={preferences.insights}
        onToggle={() => setPreferences((current) => ({ ...current, insights: !current.insights }))}
      />
      <ToggleRow
        title="Job Target Alerts"
        desc="Instant notifications when your target company roles or requirements update."
        enabled={preferences.jobAlerts ?? true}
        onToggle={() => setPreferences((current) => ({ ...current, jobAlerts: !(current.jobAlerts ?? true) }))}
      />
      <ToggleRow
        title="AI Coach Recommendations"
        desc="Receive daily practice prompts tailored to your identified weak areas."
        enabled={preferences.aiPrompts ?? true}
        onToggle={() => setPreferences((current) => ({ ...current, aiPrompts: !(current.aiPrompts ?? true) }))}
      />
    </div>
  );
}

function BillingTab() {
  const [billingCycle, setBillingCycle] = useState('monthly'); // 'monthly' | 'yearly'
  const [activePlanId, setActivePlanId] = useState('free'); // 'free' | 'pro_monthly' | 'pro_yearly'
  const [paymentMethod, setPaymentMethod] = useState(null); // null by default
  const [invoices, setInvoices] = useState([]); // empty by default
  const [selectedPlanForUpgrade, setSelectedPlanForUpgrade] = useState(null);
  const [showCheckoutModal, setShowCheckoutModal] = useState(false);
  const [isAddCardOnly, setIsAddCardOnly] = useState(false);

  // Form states for Modal — initialized completely empty (no preloaded values)
  const [cardForm, setCardForm] = useState({ name: '', number: '', exp: '', cvc: '' });
  const [isProcessing, setIsProcessing] = useState(false);

  const plans = [
    {
      id: 'free',
      name: 'Free Plan',
      desc: 'Essential practice tools to start your AI career preparation journey.',
      monthlyPrice: '$0',
      yearlyPrice: '$0',
      cyclePeriod: 'forever',
      features: [
        '3 AI Mock Interviews / month',
        'Basic Resume Review & Feedback',
        'Standard Job Description Match',
        'Access to Public Practice Questions',
      ],
      popular: false,
    },
    {
      id: 'pro_monthly',
      name: 'Pro Monthly',
      desc: 'Comprehensive AI OS for job seekers aiming for top tier tech offers.',
      monthlyPrice: '$19',
      yearlyPrice: '$19',
      cyclePeriod: 'month',
      features: [
        'Unlimited AI Mock Interviews & Voice Coaching',
        'Unlimited JD Analysis & Key Skill Gap Analysis',
        'Custom Interactive Skill Growth Roadmaps',
        'High-Priority AI Response Speed',
        'Export Detailed Performance PDF Reports',
      ],
      popular: false,
    },
    {
      id: 'pro_yearly',
      name: 'Pro Yearly',
      desc: 'Best value for continuous preparation until you land your dream job.',
      monthlyPrice: '$149',
      yearlyPrice: '$149',
      cyclePeriod: 'year',
      savingsBadge: 'Save ~35% • 2 Months Free',
      features: [
        'All Pro Monthly Features Included',
        'Save $79 per year (2 Months Free)',
        '1-on-1 AI Resume Tailoring Assistant',
        'Unlimited Mock Interview Audio/Transcript Exports',
        'VIP 24/7 Priority Support',
      ],
      popular: true,
    },
  ];

  const handleOpenUpgrade = (plan) => {
    if (plan.id === activePlanId) return;
    if (plan.id === 'free') {
      setActivePlanId('free');
      return;
    }
    setSelectedPlanForUpgrade(plan);
    setIsAddCardOnly(false);
    setCardForm({ name: '', number: '', exp: '', cvc: '' });
    setShowCheckoutModal(true);
  };

  const handleOpenAddCardModal = () => {
    setSelectedPlanForUpgrade(null);
    setIsAddCardOnly(true);
    setCardForm({ name: '', number: '', exp: '', cvc: '' });
    setShowCheckoutModal(true);
  };

  const handleConfirmModal = (e) => {
    e.preventDefault();
    setIsProcessing(true);

    setTimeout(() => {
      const cleanDigits = cardForm.number.replace(/\D/g, '');
      const last4 = cleanDigits.slice(-4) || '4242';
      
      setPaymentMethod({
        brand: 'VISA',
        last4: last4,
        exp: cardForm.exp || '12/28',
      });

      if (!isAddCardOnly && selectedPlanForUpgrade) {
        setActivePlanId(selectedPlanForUpgrade.id);
        const newInvoice = {
          id: `INV-2026-${String(invoices.length + 1).padStart(3, '0')}`,
          date: new Date().toLocaleDateString('en-US', { month: 'short', day: '2-digit', year: 'numeric' }),
          amount: selectedPlanForUpgrade.cyclePeriod === 'year' ? '$149.00' : '$19.00',
          status: 'Paid',
          plan: selectedPlanForUpgrade.name,
        };
        setInvoices((prev) => [newInvoice, ...prev]);
      }

      setIsProcessing(false);
      setShowCheckoutModal(false);
      setSelectedPlanForUpgrade(null);
      setIsAddCardOnly(false);
      setCardForm({ name: '', number: '', exp: '', cvc: '' });
    }, 600);
  };

  const handleCancelSubscription = () => {
    setActivePlanId('free');
  };

  const getActivePlanDetails = () => {
    if (activePlanId === 'pro_yearly') return { name: 'Pro Yearly Plan', price: '$149 / year', cycle: 'Renews annually' };
    if (activePlanId === 'pro_monthly') return { name: 'Pro Monthly Plan', price: '$19 / month', cycle: 'Renews monthly' };
    return { name: 'Free Plan', price: '$0', cycle: 'No recurring charges' };
  };

  const activePlanInfo = getActivePlanDetails();

  return (
    <div className="billing-tab-content">
      {/* Current Plan & Payment Summary Card */}
      <div className="settings-billing-grid">
        <div className="billing-plan-card">
          <div className="plan-card-header">
            <span className="plan-card-label" style={{ fontSize: '0.78rem', fontWeight: 800, color: 'var(--muted)', textTransform: 'uppercase' }}>Current Plan</span>
            <span
              className="plan-status-badge"
              style={{
                background: activePlanId === 'free' ? 'var(--bg-secondary)' : 'var(--green-soft)',
                color: activePlanId === 'free' ? 'var(--muted)' : '#16a34a',
                border: activePlanId === 'free' ? '1px solid var(--stroke)' : 'none',
              }}
            >
              <span style={{ width: 6, height: 6, borderRadius: '50%', background: activePlanId === 'free' ? '#94a3b8' : '#16a34a', display: 'inline-block' }} />
              {activePlanId === 'free' ? 'Free Tier' : 'Active Subscription'}
            </span>
          </div>
          <div>
            <h3 style={{ fontSize: '1.25rem', fontWeight: 800, color: 'var(--heading)', margin: '0 0 4px 0' }}>{activePlanInfo.name}</h3>
            <p className="plan-price-num">{activePlanInfo.price}</p>
            <p style={{ fontSize: '0.82rem', color: 'var(--muted)', margin: 0 }}>{activePlanInfo.cycle}</p>
          </div>
          <div style={{ marginTop: '1rem', display: 'flex', gap: '8px', alignItems: 'center' }}>
            {activePlanId !== 'free' ? (
              <button type="button" onClick={handleCancelSubscription} className="ghost-button" style={{ fontSize: '0.85rem' }}>
                Cancel Subscription
              </button>
            ) : (
              <span style={{ fontSize: '0.82rem', color: 'var(--primary)', fontWeight: 700 }}>Choose a plan below to upgrade</span>
            )}
          </div>
        </div>

        <div className="billing-payment-card">
          <div className="plan-card-header">
            <span className="plan-card-label" style={{ fontSize: '0.78rem', fontWeight: 800, color: 'var(--muted)', textTransform: 'uppercase' }}>Payment Method</span>
            {paymentMethod && <span style={{ fontSize: '0.78rem', fontWeight: 700, color: 'var(--primary)' }}>Default</span>}
          </div>
          <div>
            {paymentMethod ? (
              <div style={{ display: 'flex', alignItems: 'center', gap: '12px', marginBottom: '8px' }}>
                <div style={{ padding: '6px 10px', background: 'var(--panel)', border: '1px solid var(--stroke)', borderRadius: '8px', fontWeight: 800, fontSize: '0.88rem', color: 'var(--primary)' }}>
                  {paymentMethod.brand}
                </div>
                <div>
                  <strong style={{ display: 'block', fontSize: '0.92rem', color: 'var(--heading)' }}>•••• •••• •••• {paymentMethod.last4}</strong>
                  <span style={{ fontSize: '0.78rem', color: 'var(--muted)' }}>Expires {paymentMethod.exp}</span>
                </div>
              </div>
            ) : (
              <div style={{ padding: '4px 0' }}>
                <p style={{ fontSize: '0.88rem', color: 'var(--heading)', fontWeight: 700, margin: '0 0 4px 0' }}>No Card Attached</p>
                <span style={{ fontSize: '0.8rem', color: 'var(--muted)', display: 'block', marginBottom: '0.85rem' }}>
                  Add a payment card to manage your subscription.
                </span>
                <button
                  type="button"
                  onClick={handleOpenAddCardModal}
                  className="primary-button"
                  style={{ fontSize: '0.85rem' }}
                >
                  + Add Card Details
                </button>
              </div>
            )}
          </div>
          {paymentMethod && (
            <div style={{ marginTop: '1rem', display: 'flex', gap: '8px' }}>
              <button type="button" onClick={handleOpenAddCardModal} className="ghost-button" style={{ fontSize: '0.82rem', flex: 1 }}>
                Update Card
              </button>
              <button type="button" onClick={() => setPaymentMethod(null)} className="ghost-button" style={{ fontSize: '0.82rem', flex: 1 }}>
                Remove Card
              </button>
            </div>
          )}
        </div>
      </div>

      {/* Multi-Plan Subscription Options */}
      <div style={{ marginTop: '2.5rem' }}>
        <div style={{ textAlign: 'center', marginBottom: '1.5rem' }}>
          <h3 style={{ fontSize: '1.4rem', fontWeight: 800, color: 'var(--heading)', margin: '0 0 6px 0' }}>Subscription Plans</h3>
          <p style={{ fontSize: '0.88rem', color: 'var(--muted)', margin: 0 }}>Select the plan that best matches your interview and career goals.</p>
        </div>

        {/* Billing Cycle Selector */}
        <div style={{ display: 'flex', justifyContent: 'center', width: '100%' }}>
          <div className="billing-cycle-bar">
            <button
              type="button"
              className={`cycle-btn ${billingCycle === 'monthly' ? 'cycle-btn--active' : ''}`}
              onClick={() => setBillingCycle('monthly')}
            >
              Monthly Billing
            </button>
            <button
              type="button"
              className={`cycle-btn ${billingCycle === 'yearly' ? 'cycle-btn--active' : ''}`}
              onClick={() => setBillingCycle('yearly')}
            >
              Yearly Billing
            </button>
            <span className="discount-tag">2 Months Free</span>
          </div>
        </div>

        {/* Dynamic 2-Tier Pricing Grid controlled by Billing Cycle */}
        <div className="pricing-grid" style={{ gridTemplateColumns: 'repeat(auto-fit, minmax(280px, 1fr))' }}>
          {/* Free Tier Card */}
          <div className={`pricing-card ${activePlanId === 'free' ? 'pricing-card--active' : ''}`}>
            <div>
              <h4 className="pricing-card__title">Free Plan</h4>
              <p className="pricing-card__desc">Essential practice tools to start your AI career preparation journey.</p>
              <div className="pricing-card__price">
                $0 <span>/ forever</span>
              </div>

              <ul className="pricing-features">
                <li><Icon name="checkCircle" /><span>3 AI Mock Interviews / month</span></li>
                <li><Icon name="checkCircle" /><span>Basic Resume Review & Feedback</span></li>
                <li><Icon name="checkCircle" /><span>Standard Job Description Match</span></li>
                <li><Icon name="checkCircle" /><span>Access to Public Practice Questions</span></li>
              </ul>
            </div>

            <div style={{ marginTop: 'auto' }}>
              <button
                type="button"
                onClick={() => handleOpenUpgrade({ id: 'free', name: 'Free Plan' })}
                disabled={activePlanId === 'free'}
                className={activePlanId === 'free' ? 'ghost-button' : 'secondary-button'}
                style={{ width: '100%', padding: '10px 16px', fontSize: '0.88rem', fontWeight: 700, borderRadius: '10px' }}
              >
                {activePlanId === 'free' ? 'Current Plan' : 'Downgrade to Free'}
              </button>
            </div>
          </div>

          {/* Dynamic Pro Plan Card (Switches based on Monthly/Yearly toggle) */}
          {(() => {
            const isYearly = billingCycle === 'yearly';
            const proPlanId = isYearly ? 'pro_yearly' : 'pro_monthly';
            const isActive = activePlanId === proPlanId;

            const proPlanObj = {
              id: proPlanId,
              name: isYearly ? 'Pro Yearly Plan' : 'Pro Monthly Plan',
              price: isYearly ? '$149' : '$19',
              cyclePeriod: isYearly ? 'year' : 'month',
            };

            return (
              <div className={`pricing-card pricing-card--popular ${isActive ? 'pricing-card--active' : ''}`}>
                <span className="popular-badge">
                  {isYearly ? '⭐ Best Value • 2 Months Free' : 'Most Popular'}
                </span>
                <div>
                  <h4 className="pricing-card__title">{isYearly ? 'Pro Yearly' : 'Pro Monthly'}</h4>
                  <p className="pricing-card__desc">
                    {isYearly
                      ? 'Best value for continuous preparation until you land your dream job offer.'
                      : 'Comprehensive AI OS for job seekers aiming for top tier tech offers.'}
                  </p>
                  
                  <div className="pricing-card__price">
                    {isYearly ? '$149' : '$19'}{' '}
                    <span>{isYearly ? '/ year' : '/ month'}</span>
                  </div>

                  <p style={{ fontSize: '0.78rem', color: isYearly ? '#16a34a' : 'var(--muted)', fontWeight: 700, margin: '-8px 0 1.25rem 0' }}>
                    {isYearly
                      ? 'Equivalent to $12.42 / month (Save $79 / 2 Months Free!)'
                      : 'Billed monthly. Flexible cancellation anytime.'}
                  </p>

                  <ul className="pricing-features">
                    <li><Icon name="checkCircle" /><span>Unlimited AI Mock Interviews & Voice Coaching</span></li>
                    <li><Icon name="checkCircle" /><span>Unlimited JD Analysis & Key Skill Gap Analysis</span></li>
                    <li><Icon name="checkCircle" /><span>Custom Interactive Skill Growth Roadmaps</span></li>
                    <li><Icon name="checkCircle" /><span>High-Priority AI Response Speed</span></li>
                    <li><Icon name="checkCircle" /><span>Export Detailed Performance PDF Reports</span></li>
                    {isYearly && <li><Icon name="checkCircle" /><span>1-on-1 AI Resume Tailoring Assistant</span></li>}
                    {isYearly && <li><Icon name="checkCircle" /><span>VIP 24/7 Priority Support</span></li>}
                  </ul>
                </div>

                <div style={{ marginTop: 'auto' }}>
                  <button
                    type="button"
                    onClick={() => handleOpenUpgrade(proPlanObj)}
                    disabled={isActive}
                    className={isActive ? 'ghost-button' : 'primary-button'}
                    style={{ width: '100%', padding: '10px 16px', fontSize: '0.88rem', fontWeight: 700, borderRadius: '10px' }}
                  >
                    {isActive ? 'Current Active Plan' : isYearly ? 'Upgrade to Pro Yearly ($149/yr)' : 'Upgrade to Pro Monthly ($19/mo)'}
                  </button>
                </div>
              </div>
            );
          })()}
        </div>
      </div>

      {/* Receipts & Invoices Table */}
      <div style={{ marginTop: '2rem' }}>
        <h4 style={{ fontSize: '1.05rem', fontWeight: 800, color: 'var(--heading)', margin: '0 0 1rem 0' }}>Billing History & Receipts</h4>
        {invoices.length > 0 ? (
          <div style={{ overflowX: 'auto' }}>
            <table className="invoice-table">
              <thead>
                <tr>
                  <th>Invoice</th>
                  <th>Date</th>
                  <th>Amount</th>
                  <th>Status</th>
                  <th style={{ textAlign: 'right' }}>Receipt</th>
                </tr>
              </thead>
              <tbody>
                {invoices.map((inv) => (
                  <tr key={inv.id}>
                    <td>
                      <strong>{inv.id}</strong>
                      <span style={{ display: 'block', fontSize: '0.75rem', color: 'var(--muted)' }}>{inv.plan}</span>
                    </td>
                    <td>{inv.date}</td>
                    <td>{inv.amount}</td>
                    <td>
                      <span className="plan-status-badge">{inv.status}</span>
                    </td>
                    <td style={{ textAlign: 'right' }}>
                      <button type="button" className="text-button" style={{ fontSize: '0.82rem' }}>Download PDF</button>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        ) : (
          <div style={{ background: 'var(--bg-secondary)', border: '1px solid var(--stroke)', borderRadius: '14px', padding: '1.5rem', textAlign: 'center' }}>
            <p style={{ fontSize: '0.88rem', color: 'var(--muted)', margin: 0 }}>No payment receipts found. Upgrading to a Pro plan will display your invoice history here.</p>
          </div>
        )}
      </div>

      {/* Checkout / Add Card Modal */}
      {showCheckoutModal && (
        <div className="modal-backdrop" onClick={() => setShowCheckoutModal(false)}>
          <div
            className="modal-card"
            onClick={(e) => e.stopPropagation()}
            style={{
              background: 'var(--panel)',
              border: '1px solid var(--stroke)',
              borderRadius: '20px',
              padding: '2rem',
              maxWidth: '480px',
              width: '90%',
              boxShadow: '0 20px 40px rgba(0,0,0,0.3)',
            }}
          >
            <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', marginBottom: '1.25rem' }}>
              <h3 style={{ fontSize: '1.2rem', fontWeight: 800, color: 'var(--heading)', margin: 0 }}>
                {isAddCardOnly ? 'Add Payment Card' : `Upgrade to ${selectedPlanForUpgrade?.name}`}
              </h3>
              <button type="button" onClick={() => setShowCheckoutModal(false)} className="ghost-button" style={{ padding: '4px 8px' }}>✕</button>
            </div>

            {!isAddCardOnly && selectedPlanForUpgrade && (
              <div style={{ background: 'var(--bg-secondary)', border: '1px solid var(--stroke)', borderRadius: '12px', padding: '1rem', marginBottom: '1.25rem' }}>
                <div style={{ display: 'flex', justifyContent: 'space-between', marginBottom: '6px' }}>
                  <span style={{ fontWeight: 700, color: 'var(--heading)' }}>{selectedPlanForUpgrade.name}</span>
                  <strong style={{ color: 'var(--primary)' }}>
                    {selectedPlanForUpgrade.cyclePeriod === 'year' ? '$149.00 / yr' : '$19.00 / mo'}
                  </strong>
                </div>
                <p style={{ fontSize: '0.78rem', color: 'var(--muted)', margin: 0 }}>Includes unlimited AI Mock Interviews, JD Analysis & Priority Coach.</p>
              </div>
            )}

            <form onSubmit={handleConfirmModal} style={{ display: 'flex', flexDirection: 'column', gap: '1rem' }}>
              <div>
                <label style={{ display: 'block', fontSize: '0.82rem', fontWeight: 700, color: 'var(--muted)', marginBottom: '4px' }}>Cardholder Name</label>
                <input
                  type="text"
                  required
                  placeholder="e.g. Sanju Sharma"
                  value={cardForm.name}
                  onChange={(e) => setCardForm({ ...cardForm, name: e.target.value })}
                  style={{ width: '100%', padding: '10px 12px', borderRadius: '8px', border: '1px solid var(--stroke)', background: 'var(--bg-secondary)', color: 'var(--text)', outline: 'none' }}
                />
              </div>

              <div>
                <label style={{ display: 'block', fontSize: '0.82rem', fontWeight: 700, color: 'var(--muted)', marginBottom: '4px' }}>Card Number</label>
                <input
                  type="text"
                  required
                  placeholder="4532 •••• •••• ••••"
                  value={cardForm.number}
                  onChange={(e) => setCardForm({ ...cardForm, number: e.target.value })}
                  style={{ width: '100%', padding: '10px 12px', borderRadius: '8px', border: '1px solid var(--stroke)', background: 'var(--bg-secondary)', color: 'var(--text)', outline: 'none' }}
                />
              </div>

              <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '1rem' }}>
                <div>
                  <label style={{ display: 'block', fontSize: '0.82rem', fontWeight: 700, color: 'var(--muted)', marginBottom: '4px' }}>Expires</label>
                  <input
                    type="text"
                    required
                    placeholder="MM/YY"
                    value={cardForm.exp}
                    onChange={(e) => setCardForm({ ...cardForm, exp: e.target.value })}
                    style={{ width: '100%', padding: '10px 12px', borderRadius: '8px', border: '1px solid var(--stroke)', background: 'var(--bg-secondary)', color: 'var(--text)', outline: 'none' }}
                  />
                </div>
                <div>
                  <label style={{ display: 'block', fontSize: '0.82rem', fontWeight: 700, color: 'var(--muted)', marginBottom: '4px' }}>CVC</label>
                  <input
                    type="text"
                    required
                    placeholder="123"
                    value={cardForm.cvc}
                    onChange={(e) => setCardForm({ ...cardForm, cvc: e.target.value })}
                    style={{ width: '100%', padding: '10px 12px', borderRadius: '8px', border: '1px solid var(--stroke)', background: 'var(--bg-secondary)', color: 'var(--text)', outline: 'none' }}
                  />
                </div>
              </div>

              <div style={{ display: 'flex', gap: '10px', marginTop: '1rem' }}>
                <button type="button" onClick={() => setShowCheckoutModal(false)} className="ghost-button" style={{ flex: 1 }}>
                  Cancel
                </button>
                <button type="submit" disabled={isProcessing} className="primary-button" style={{ flex: 2 }}>
                  {isProcessing ? 'Saving...' : isAddCardOnly ? 'Save Card Details' : 'Confirm & Upgrade'}
                </button>
              </div>
            </form>
          </div>
        </div>
      )}
    </div>
  );
}

function SecurityTab() {
  const [passwords, setPasswords] = useState({ current: '', newPass: '', confirm: '' });
  const [twoFA, setTwoFA] = useState(false);

  return (
    <div className="security-tab-content" style={{ display: 'flex', flexDirection: 'column', gap: '1.75rem' }}>
      <div style={{ background: 'var(--bg-secondary)', border: '1px solid var(--stroke)', borderRadius: '16px', padding: '1.5rem' }}>
        <h4 style={{ fontSize: '1.05rem', fontWeight: 800, color: 'var(--heading)', margin: '0 0 1rem 0' }}>Change Password</h4>
        <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(220px, 1fr))', gap: '1rem', marginBottom: '1.25rem' }}>
          <div>
            <label style={{ display: 'block', fontSize: '0.82rem', fontWeight: 700, color: 'var(--muted)', marginBottom: '6px' }}>Current Password</label>
            <input
              type="password"
              placeholder="••••••••"
              value={passwords.current}
              onChange={(e) => setPasswords({ ...passwords, current: e.target.value })}
              style={{ width: '100%', padding: '8px 12px', borderRadius: '8px', border: '1px solid var(--stroke)', background: 'var(--panel)', color: 'var(--text)', outline: 'none', minHeight: '44px' }}
            />
          </div>
          <div>
            <label style={{ display: 'block', fontSize: '0.82rem', fontWeight: 700, color: 'var(--muted)', marginBottom: '6px' }}>New Password</label>
            <input
              type="password"
              placeholder="••••••••"
              value={passwords.newPass}
              onChange={(e) => setPasswords({ ...passwords, newPass: e.target.value })}
              style={{ width: '100%', padding: '8px 12px', borderRadius: '8px', border: '1px solid var(--stroke)', background: 'var(--panel)', color: 'var(--text)', outline: 'none', minHeight: '44px' }}
            />
          </div>
          <div>
            <label style={{ display: 'block', fontSize: '0.82rem', fontWeight: 700, color: 'var(--muted)', marginBottom: '6px' }}>Confirm New Password</label>
            <input
              type="password"
              placeholder="••••••••"
              value={passwords.confirm}
              onChange={(e) => setPasswords({ ...passwords, confirm: e.target.value })}
              style={{ width: '100%', padding: '8px 12px', borderRadius: '8px', border: '1px solid var(--stroke)', background: 'var(--panel)', color: 'var(--text)', outline: 'none', minHeight: '44px' }}
            />
          </div>
        </div>
        <button type="button" className="primary-button" style={{ fontSize: '0.85rem' }}>Update Password</button>
      </div>

      <div style={{ background: 'var(--bg-secondary)', border: '1px solid var(--stroke)', borderRadius: '16px', padding: '1.5rem' }}>
        <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between' }}>
          <div>
            <strong style={{ fontSize: '0.98rem', color: 'var(--heading)' }}>Two-Factor Authentication (2FA)</strong>
            <p style={{ fontSize: '0.84rem', color: 'var(--muted)', margin: '4px 0 0 0' }}>Add an extra layer of security using an authenticator app (e.g. Google Authenticator).</p>
          </div>
          <button
            type="button"
            className={`toggle ${twoFA ? 'toggle--on' : ''}`}
            onClick={() => setTwoFA(!twoFA)}
            aria-label="Toggle 2FA"
          >
            <span />
          </button>
        </div>
      </div>

      <div style={{ background: 'var(--bg-secondary)', border: '1px solid var(--stroke)', borderRadius: '16px', padding: '1.5rem' }}>
        <h4 style={{ fontSize: '1.05rem', fontWeight: 800, color: 'var(--heading)', margin: '0 0 0.85rem 0' }}>Active Sessions</h4>
        <div style={{ display: 'flex', flexDirection: 'column', gap: '10px' }}>
          <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', padding: '10px 14px', background: 'var(--panel)', border: '1px solid var(--stroke)', borderRadius: '10px' }}>
            <div>
              <strong style={{ fontSize: '0.88rem', color: 'var(--heading)', display: 'block' }}>Chrome on Windows 11</strong>
              <span style={{ fontSize: '0.78rem', color: 'var(--muted)' }}>Current Session • Mumbai, India</span>
            </div>
            <span className="plan-status-badge">Active</span>
          </div>
        </div>
      </div>
    </div>
  );
}

export default function SettingsPage() {
  const {
    activeTab, setActiveTab,
    preferences, setPreferences,
    settingsData,
    saving,
    handleSave,
  } = useSettings();

  if (!settingsData) {
    return (
      <AppShell title="Settings" subtitle="Loading your preferences..." actions={null}>
        <p className="text-muted">Loading settings…</p>
      </AppShell>
    );
  }

  return (
    <AppShell
      title="Settings"
      subtitle="Customize your account, notifications, and preferences."
      actions={null}
    >
      <section className="settings-layout">
        <nav className="settings-tabs">
          {settingsData.tabs.map((tab) => {
            const iconName = tab === 'Notifications' ? 'bell' : tab === 'Security' ? 'shield' : tab === 'Billing' ? 'creditCard' : 'settings';
            return (
              <button
                key={tab}
                type="button"
                className={`settings-tab ${activeTab === tab ? 'settings-tab--active' : ''}`}
                onClick={() => setActiveTab(tab)}
              >
                <Icon name={iconName} />
                <span>{tab}</span>
              </button>
            );
          })}
        </nav>

        <article className="card panel">
          <div className="section-head section-head--left">
            <h2>{activeTab}</h2>
            <p>
              {activeTab === 'Notifications' && 'Manage your notifications options and preferences.'}
              {activeTab === 'Billing' && 'Manage your subscription plan, payment methods, and invoice receipts.'}
              {activeTab === 'Security' && 'Manage your password, two-factor authentication, and active sessions.'}
            </p>
          </div>

          {activeTab === 'Notifications' && (
            <NotificationsTab preferences={preferences} setPreferences={setPreferences} />
          )}

          {activeTab === 'Billing' && <BillingTab />}

          {activeTab === 'Security' && <SecurityTab />}

          <div className="panel__actions panel__actions--end">
            <button type="button" className="ghost-button">Cancel</button>
            <button type="button" className="primary-button" onClick={handleSave} disabled={saving}>
              {saving ? 'Saving...' : 'Save Changes'}
            </button>
          </div>
        </article>
      </section>
    </AppShell>
  );
}
