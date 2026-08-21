import { useRef } from 'react';
import { useAuth } from '../../context/AuthContext.jsx';
import { useJDAnalyzer } from '../../hooks/useJDAnalyzer.js';
import { Icon } from '../../components/Icon.jsx';
import { SidebarShell } from '../../components/Layout/Sidebar.jsx';
import { MobileTopBar } from '../../components/Layout/AppShell.jsx';
import { MobileNav } from '../../components/Layout/MobileNav.jsx';
import { getInitials } from '../../utils/helpers.js';

export default function JDAnalyzerPage() {
  const fileInputRef = useRef(null);
  const { user } = useAuth();
  const {
    jobDescription,
    setJobDescription,
    isAnalyzing,
    analysisResult,
    searchQuery,
    setSearchQuery,
    errorMessage,
    wordCount,
    handleAnalyze,
  } = useJDAnalyzer();

  const userInitials = getInitials(user?.name);

  const handleFileUpload = (e) => {
    const file = e.target.files?.[0];
    if (!file) return;

    const reader = new FileReader();
    reader.onload = (event) => {
      const text = event.target?.result;
      if (typeof text === 'string') {
        setJobDescription(text);
      }
    };
    reader.readAsText(file);
  };

  return (
    <div className="app-shell">
      <MobileTopBar />
      <SidebarShell />

      <main className="main-content--jdanalyzer">
        {/* TOP HEADER BAR */}
        <div className="jd-top-bar">
          <h1 className="jd-page-title">JD Analyzer</h1>

          <div className="jd-top-right-actions">
            <div className="jd-search-box">
              <Icon name="search" />
              <input
                type="text"
                placeholder="Search insights..."
                value={searchQuery}
                onChange={(e) => setSearchQuery(e.target.value)}
                className="jd-search-input"
              />
            </div>
            <button type="button" className="jd-icon-btn" aria-label="Notifications">
              <Icon name="bell" />
            </button>
            <div className="jd-avatar-chip">
              {(user?.avatar || user?.avatarUrl) ? (
                <img
                  src={user.avatar || user.avatarUrl}
                  alt={user?.name || 'User'}
                  onError={(e) => { e.currentTarget.src = '/images/alex_thompson.png'; }}
                />
              ) : (
                userInitials
              )}
            </div>
          </div>
        </div>

        {/* TOP 2-COLUMN GRID */}
        <div className="jd-top-grid">
          {/* ANALYZE NEW ROLE INPUT CARD */}
          <div className="jd-card-container">
            <div className="jd-card-header">
              <h2>Analyze New Role with Gemini AI</h2>
              <input
                type="file"
                ref={fileInputRef}
                style={{ display: 'none' }}
                accept=".txt,.md,.json,.doc,.docx"
                onChange={handleFileUpload}
              />
              <button
                type="button"
                className="btn-browse-files"
                onClick={() => fileInputRef.current?.click()}
              >
                Upload File
              </button>
            </div>

            <div className="jd-textarea-box">
              <textarea
                className="jd-textarea-field"
                value={jobDescription}
                onChange={(e) => setJobDescription(e.target.value)}
                placeholder="Paste the Job Description (JD) text here to run ATS &amp; skill gap analysis..."
              />
              <div className="jd-textarea-bottom-row">
                <span className="jd-word-count">{wordCount} words</span>
                <button
                  type="button"
                  className="jd-btn-analyze-ai"
                  onClick={handleAnalyze}
                  disabled={!jobDescription.trim() || isAnalyzing}
                >
                  <Icon name="spark" />
                  <span>{isAnalyzing ? 'Analyzing with Gemini AI...' : 'Analyze with AI'}</span>
                </button>
              </div>
            </div>

            {errorMessage && (
              <p style={{ color: '#ef4444', fontSize: '0.85rem', marginTop: '8px' }}>{errorMessage}</p>
            )}

            <div className="jd-info-banner">
              <Icon name="help" />
              <span>
                Analysis will compare the Job Description directly against your candidate profile skills.
              </span>
            </div>
          </div>

          {/* QUICK INSIGHTS OVERVIEW CARD */}
          <div className="jd-card-container">
            <div className="jd-overview-title">ATS Scan Status</div>
            <div className="jd-overview-stats-row">
              <div className="jd-stat-mini-card jd-stat-mini-card--blue">
                <span className="jd-stat-mini-label">Scans Completed</span>
                <span className="jd-stat-mini-val">Active</span>
              </div>
              <div className="jd-stat-mini-card jd-stat-mini-card--purple">
                <span className="jd-stat-mini-label">AI Engine</span>
                <span className="jd-stat-mini-val">Gemini 2.5</span>
              </div>
            </div>

            <div className="jd-graphic-art-box">
              <svg viewBox="0 0 300 100" style={{ width: '100%', height: '100%' }}>
                <defs>
                  <linearGradient id="spiralGrad" x1="0%" y1="0%" x2="100%" y2="100%">
                    <stop offset="0%" stopColor="#3b82f6" stopOpacity="0.4" />
                    <stop offset="50%" stopColor="#8b5cf6" stopOpacity="0.6" />
                    <stop offset="100%" stopColor="#ec4899" stopOpacity="0.3" />
                  </linearGradient>
                </defs>
                <path
                  d="M20,80 Q70,10 150,50 T280,20"
                  fill="none"
                  stroke="url(#spiralGrad)"
                  strokeWidth="6"
                  strokeLinecap="round"
                />
                <circle cx="150" cy="50" r="18" fill="rgba(139,92,246,0.15)" stroke="#8b5cf6" strokeWidth="2" />
                <circle cx="70" cy="30" r="10" fill="rgba(59,130,246,0.15)" stroke="#3b82f6" strokeWidth="2" />
                <circle cx="250" cy="30" r="14" fill="rgba(236,72,153,0.15)" stroke="#ec4899" strokeWidth="2" />
              </svg>
            </div>
          </div>
        </div>

        {/* ANALYSIS RESULTS SECTION */}
        {analysisResult ? (
          <>
            <div className="jd-analysis-header">
              <h2>Analysis: {analysisResult.jobTitle || 'Target Role Audit'}</h2>
              <div className="jd-analysis-actions">
                <button
                  type="button"
                  className="jd-icon-btn"
                  onClick={() => alert('Share analysis link copied!')}
                  aria-label="Share Analysis"
                >
                  <Icon name="share" />
                </button>
                <button
                  type="button"
                  className="jd-icon-btn"
                  onClick={() => window.print()}
                  aria-label="Download Report"
                >
                  <Icon name="download" />
                </button>
              </div>
            </div>

            {/* 3 COLUMNS RESULTS GRID */}
            <div className="jd-results-3col-grid">
              {/* KEYWORD MATCH CARD */}
              <div className="jd-result-card">
                <div className="jd-result-card-title">Keyword Match</div>
                <div className="jd-ring-circle">
                  <svg viewBox="0 0 36 36">
                    <path
                      d="M18 2.0845 a 15.9155 15.9155 0 0 1 0 31.831 a 15.9155 15.9155 0 0 1 0 -31.831"
                      fill="none"
                      stroke="#e2e8f0"
                      strokeWidth="3.2"
                    />
                    <path
                      d="M18 2.0845 a 15.9155 15.9155 0 0 1 0 31.831 a 15.9155 15.9155 0 0 1 0 -31.831"
                      fill="none"
                      stroke="#256cf0"
                      strokeWidth="3.2"
                      strokeDasharray={`${parseInt(analysisResult.keywordMatch || '82', 10)}, 100`}
                      strokeLinecap="round"
                    />
                  </svg>
                  <span className="jd-ring-val">{analysisResult.keywordMatch || '82%'}</span>
                </div>
                <p className="jd-ring-desc">Keyword alignment based on core skill extraction.</p>
              </div>

              {/* ATS COMPATIBILITY CARD */}
              <div className="jd-result-card">
                <div className="jd-result-card-title">ATS Compatibility</div>
                <div className="jd-ring-circle">
                  <svg viewBox="0 0 36 36">
                    <path
                      d="M18 2.0845 a 15.9155 15.9155 0 0 1 0 31.831 a 15.9155 15.9155 0 0 1 0 -31.831"
                      fill="none"
                      stroke="#e2e8f0"
                      strokeWidth="3.2"
                    />
                    <path
                      d="M18 2.0845 a 15.9155 15.9155 0 0 1 0 31.831 a 15.9155 15.9155 0 0 1 0 -31.831"
                      fill="none"
                      stroke="#7c3aed"
                      strokeWidth="3.2"
                      strokeDasharray={`${parseInt(analysisResult.atsScore || '91', 10)}, 100`}
                      strokeLinecap="round"
                    />
                  </svg>
                  <span className="jd-ring-val">{analysisResult.atsScore || '91%'}</span>
                </div>
                <p className="jd-ring-desc">ATS readability score for enterprise recruiter software.</p>
              </div>

              {/* RESUME VS REQUIREMENTS CARD */}
              <div className="jd-compare-card-box">
                <div className="jd-compare-title">Your Profile vs. Job Requirements</div>
                <div className="jd-compare-list">
                  {(analysisResult.matchedSkills || []).map((skill) => (
                    <div key={skill} className="jd-compare-item">
                      <div className="jd-compare-left">
                        <Icon name="checkCircle" />
                        <span>{skill}</span>
                      </div>
                      <span className="badge-match-blue">Matched Skill</span>
                    </div>
                  ))}
                  {(analysisResult.missingSkills || []).map((skill) => (
                    <div key={skill} className="jd-compare-item">
                      <div className="jd-compare-left">
                        <Icon name="warning" />
                        <span>{skill}</span>
                      </div>
                      <span className="badge-match-red">Missing Skill</span>
                    </div>
                  ))}
                </div>
              </div>
            </div>

            {/* OPTIMIZATION ROADMAP SECTION */}
            <div className="jd-roadmap-container">
              <div className="jd-roadmap-title-row">
                <Icon name="mapPin" />
                <span>AI Recommended Optimization Steps</span>
              </div>

              <div className="jd-steps-3col">
                {(analysisResult.recommendations || []).map((rec, index) => (
                  <div key={index} className="jd-step-card-box">
                    <div className="jd-step-num-badge">{index + 1}</div>
                    <h3>Recommendation #{index + 1}</h3>
                    <p>{rec}</p>
                  </div>
                ))}
              </div>
            </div>
          </>
        ) : (
          <div className="card panel" style={{ marginTop: '24px', textAlign: 'center', padding: '36px' }}>
            <Icon name="spark" style={{ fontSize: '2rem', color: '#256cf0', marginBottom: '12px' }} />
            <h3 style={{ margin: '0 0 8px 0' }}>Ready for JD Scan</h3>
            <p style={{ margin: 0, color: '#64748b' }}>
              Paste a Job Description above and click "Analyze with AI" to generate live ATS metrics and skill recommendations.
            </p>
          </div>
        )}
      </main>

      <MobileNav />
    </div>
  );
}
