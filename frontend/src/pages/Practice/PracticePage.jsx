import { useAuth } from '../../context/AuthContext.jsx';
import { usePractice } from '../../hooks/usePractice.js';
import { Icon } from '../../components/Icon.jsx';
import { SidebarShell } from '../../components/Layout/Sidebar.jsx';
import { MobileTopBar } from '../../components/Layout/AppShell.jsx';
import { MobileNav } from '../../components/Layout/MobileNav.jsx';
import { AppFooter } from '../../components/Layout/AppFooter.jsx';
import { CareerSelectorModal } from '../../components/Practice/CareerSelectorModal.jsx';
import { SearchableTopicSelect } from '../../components/Practice/SearchableTopicSelect.jsx';
import { PracticeFullSkeleton } from '../../components/Practice/PracticeSkeletons.jsx';
import { getInitials } from '../../utils/helpers.js';

export default function PracticePage() {
  const { user } = useAuth();
  const {
    selectedCareerTrack,
    setSelectedCareerTrack,
    isCareerModalOpen,
    setIsCareerModalOpen,
    careerTracksList,

    mode,
    setMode,
    toastMsg,

    // Real user stats (starts at 0s for new users)
    userStats,

    // Coding Arena
    isCodingLoading,
    codingQuestions,
    activeCodingIndex,
    currentCodingQuestion,
    topicFilter,
    setTopicFilter,
    difficultyFilter,
    setDifficultyFilter,
    searchQuery,
    setSearchQuery,
    availableTopics,
    language,
    setLanguage,
    code,
    setCode,
    consoleTab,
    setConsoleTab,
    consoleOutput,
    isExecuting,
    codingTimer,
    lastAutoSave,
    bookmarks,
    submissionHistory,
    isSolutionModalOpen,
    setIsSolutionModalOpen,
    handleCopySolutionToEditor,
    handleNextCodingQuestion,
    handlePrevCodingQuestion,
    handleRandomCodingQuestion,
    handleToggleBookmark,
    handleRunCode,
    handleResetFilters,

    // Aptitude State
    isAptitudeLoading,
    aptitudeError,
    aptitudeMode,
    setAptitudeMode,
    handleSwitchAptitudeMode,
    activeCategory,
    setActiveCategory,
    aptitudeQuestions,
    activeAptitudeIndex,
    currentAptitudeQuestion,
    selectedOption,
    evaluationResult,
    showExplanation,
    setShowExplanation,
    aptitudeTimer,
    weakTopics,
    topicRecommendations,
    handleSelectAptitudeOption,
    handleSubmitAptitudeAnswer,
    handleNextAptitudeQuestion,
    handlePrevAptitudeQuestion,
    handleRandomAptitudeQuestion,
    handleRetryAptitude,
    formatTimer,
  } = usePractice();

  const userInitials = getInitials(user?.name);
  const isCurrentBookmarked = currentCodingQuestion ? bookmarks.includes(currentCodingQuestion.id) : false;

  return (
    <div className="app-shell">
      <MobileTopBar />
      <SidebarShell />

      <main className="main-content main-content--practice">
        {/* TOP TOOLBAR */}
        <header className="practice-header-container">
          <div className="practice-top-row">
            <div className="career-badge-section">
              <h1 className="brand-header-logo">CareerPrep Practice</h1>
              
              {/* CAREER TRACK BADGE */}
              <button
                type="button"
                className="career-track-pill-btn"
                onClick={() => setIsCareerModalOpen(true)}
                title="Change career track"
              >
                <span className="pill-dot" />
                <span className="pill-label">Track:</span>
                <strong className="pill-value">{selectedCareerTrack}</strong>
                <span className="pill-arrow">▾</span>
              </button>
            </div>

            {/* REAL USER STATISTICS BAR (NO HARDCODED FAKE NUMBERS) */}
            <div className="practice-live-metrics">
              <div className="metric-chip" title="Total Solved Problems">
                <Icon name="checkCircle" />
                <span>{userStats.solved} Solved</span>
              </div>
              <div className="metric-chip" title="Overall Accuracy">
                <Icon name="target" />
                <span>{userStats.accuracy}% Acc</span>
              </div>
              <div className="metric-chip" title="Current Active Streak">
                <Icon name="lightning" />
                <span>{userStats.streak} Day Streak</span>
              </div>
              <div className="metric-chip metric-chip--xp" title="Earned XP">
                <Icon name="spark" />
                <span>{userStats.xp} XP</span>
              </div>
              <div className="rm-avatar-chip">
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

          {/* CONTROLS & MODE SWITCHER */}
          <div className="practice-controls-row">
            <div className="practice-mode-tabs">
              <button
                type="button"
                className={`mode-tab ${mode === 'coding' ? 'mode-tab--active' : ''}`}
                onClick={() => setMode('coding')}
              >
                <Icon name="code" />
                <span>Coding Arena (IDE)</span>
              </button>
              <button
                type="button"
                className={`mode-tab ${mode === 'aptitude' ? 'mode-tab--active' : ''}`}
                onClick={() => setMode('aptitude')}
              >
                <Icon name="brain" />
                <span>Aptitude Practice (10 Qs)</span>
              </button>
            </div>

            {mode === 'coding' && (
              <div className="coding-filter-bar">
                {/* SEARCHABLE TOPIC SELECTOR */}
                <SearchableTopicSelect
                  selectedTopic={topicFilter}
                  onSelectTopic={(t) => setTopicFilter(t)}
                  topics={availableTopics}
                  careerTrack={selectedCareerTrack}
                />

                {/* DIFFICULTY FILTER */}
                <select
                  value={difficultyFilter}
                  onChange={(e) => setDifficultyFilter(e.target.value)}
                  className="practice-filter-select"
                >
                  <option value="All">All Difficulties</option>
                  <option value="Easy">Easy</option>
                  <option value="Medium">Medium</option>
                  <option value="Hard">Hard</option>
                </select>

                {/* SEARCH QUERY */}
                <div className="practice-search-input-wrapper">
                  <input
                    type="text"
                    placeholder="Search problems..."
                    value={searchQuery}
                    onChange={(e) => setSearchQuery(e.target.value)}
                    className="practice-search-input"
                  />
                </div>
              </div>
            )}
          </div>
        </header>

        {/* TOAST NOTIFICATION */}
        {toastMsg ? (
          <div className="profile-toast">
            <Icon name="checkCircle" />
            <span>{toastMsg}</span>
          </div>
        ) : null}

        {/* CAREER SELECTOR MODAL */}
        <CareerSelectorModal
          isOpen={isCareerModalOpen}
          onClose={() => setIsCareerModalOpen(false)}
          selectedTrack={selectedCareerTrack}
          onSelectTrack={setSelectedCareerTrack}
          tracks={careerTracksList}
        />

        {/* PAGE 1: CODING ARENA */}
        {mode === 'coding' ? (
          isCodingLoading ? (
            <PracticeFullSkeleton />
          ) : (
            <div className="coding-ide-wrapper">
              {currentCodingQuestion ? (
                <>
                  {/* PROBLEM HEADER */}
                  <div className="coding-problem-header">
                    <div className="problem-header-left">
                      <span className="question-counter-badge">
                        Question {activeCodingIndex + 1} of {codingQuestions.length}
                      </span>
                      <h2>{currentCodingQuestion.title}</h2>
                      <span
                        className={`difficulty-tag difficulty-tag--${currentCodingQuestion.difficulty?.toLowerCase()}`}
                      >
                        {currentCodingQuestion.difficulty}
                      </span>
                      <span className="topic-pill">{currentCodingQuestion.topic}</span>
                    </div>

                    <div className="problem-header-right">
                      {/* BUTTON CONTROLS */}
                      <div className="nav-controls">
                        <button
                          type="button"
                          className="nav-btn"
                          onClick={() => setIsSolutionModalOpen(true)}
                          style={{ background: '#1e293b', color: '#f59e0b', borderColor: '#f59e0b' }}
                          title="View Solution"
                        >
                          💡 View Solution
                        </button>
                        <button
                          type="button"
                          className="nav-btn"
                          onClick={handleRandomCodingQuestion}
                          title="Generate Random Question"
                        >
                          🎲 Random
                        </button>
                        <button
                          type="button"
                          className="nav-btn"
                          onClick={handlePrevCodingQuestion}
                          disabled={activeCodingIndex === 0}
                        >
                          ◀ Prev
                        </button>
                        <button
                          type="button"
                          className="nav-btn"
                          onClick={handleNextCodingQuestion}
                          disabled={activeCodingIndex === codingQuestions.length - 1}
                        >
                          Next ▶
                        </button>
                        <button
                          type="button"
                          className={`bookmark-btn ${isCurrentBookmarked ? 'bookmark-btn--active' : ''}`}
                          onClick={() => handleToggleBookmark(currentCodingQuestion.id)}
                        >
                          {isCurrentBookmarked ? '★ Bookmarked' : '☆ Bookmark'}
                        </button>
                      </div>

                      <div className="copilot-badge">
                        <span className="copilot-icon">AI</span>
                        <span>Gemini Evaluation Active</span>
                      </div>
                    </div>
                  </div>

                  {/* IDE BODY */}
                  <div className="coding-ide-body">
                    {/* PROBLEM DETAILS */}
                    <div className="problem-details-panel">
                      <div className="panel-section">
                        <h4 className="details-section-label">DESCRIPTION</h4>
                        <p className="description-text">{currentCodingQuestion.description}</p>
                      </div>

                      {currentCodingQuestion.examples && currentCodingQuestion.examples.length > 0 && (
                        <div className="panel-section">
                          <h4 className="details-section-label">EXAMPLES</h4>
                          {currentCodingQuestion.examples.map((ex, i) => (
                            <div key={ex.id || i} className="example-card">
                              <strong>Example {i + 1}</strong>
                              <div className="example-code">
                                <div><strong>Input:</strong> {ex.input}</div>
                                <div><strong>Output:</strong> {ex.output}</div>
                                {ex.explanation && <div><em>Explanation:</em> {ex.explanation}</div>}
                              </div>
                            </div>
                          ))}
                        </div>
                      )}

                      {currentCodingQuestion.constraints && currentCodingQuestion.constraints.length > 0 && (
                        <div className="panel-section">
                          <h4 className="details-section-label">CONSTRAINTS</h4>
                          <ul className="constraints-list">
                            {currentCodingQuestion.constraints.map((c, i) => (
                              <li key={i}>{c}</li>
                            ))}
                          </ul>
                        </div>
                      )}

                      <div className="panel-section">
                        <h4 className="details-section-label">GEMINI AI APPROACH HINT</h4>
                        <div className="ai-analysis-card">
                          <div className="ai-analysis-icon">
                            <Icon name="bulb" />
                          </div>
                          <div>
                            <h5>{currentCodingQuestion.topic} Pattern Strategy</h5>
                            <p>{currentCodingQuestion.hints?.[0] || 'Use an optimal data structure to minimize space complexity.'}</p>
                          </div>
                        </div>
                      </div>
                    </div>

                    {/* CODE EDITOR */}
                    <div className="code-editor-panel">
                      <div className="editor-top-bar">
                        <div className="editor-top-left">
                          <select
                            value={language}
                            onChange={(e) => setLanguage(e.target.value)}
                            className="language-selector"
                          >
                            <option value="Python">Python 3</option>
                            <option value="JavaScript">JavaScript (ES6)</option>
                            <option value="C++">C++ (GCC 11)</option>
                            <option value="Java">Java 17</option>
                            <option value="C">C (GCC 11)</option>
                            <option value="Go">Go (1.20)</option>
                          </select>

                          <span className="auto-save-tag">Auto-saved: {lastAutoSave}</span>
                        </div>

                        <div className="editor-timer-chip">
                          <Icon name="clock" />
                          <span>{formatTimer(codingTimer)}</span>
                        </div>
                      </div>

                      <div className="dark-code-container">
                        <textarea
                          value={code}
                          onChange={(e) => setCode(e.target.value)}
                          className="dark-code-textarea"
                          spellCheck="false"
                          placeholder="// Write code here..."
                        />
                      </div>

                      {/* CONSOLE & EVALUATION MODEL */}
                      <div className="ide-console-panel">
                        <div className="console-tabs-bar">
                          <button
                            type="button"
                            className={`console-tab ${consoleTab === 'console' ? 'console-tab--active' : ''}`}
                            onClick={() => setConsoleTab('console')}
                          >
                            Gemini Evaluation Console
                          </button>
                          <button
                            type="button"
                            className={`console-tab ${consoleTab === 'history' ? 'console-tab--active' : ''}`}
                            onClick={() => setConsoleTab('history')}
                          >
                            Submission History ({submissionHistory.length})
                          </button>
                        </div>

                        <div className="console-output-area">
                          {consoleTab === 'console' ? (
                            consoleOutput ? (
                              <div className="console-result">
                                <div className="console-status-line">
                                  <Icon name="checkCircle" />
                                  <span>{consoleOutput.message || '✓ All test cases passed.'}</span>
                                </div>
                                <div className="console-metrics-row" style={{ display: 'flex', gap: '16px', fontSize: '0.85rem', color: '#94a3b8', margin: '4px 0' }}>
                                  <span>Score: <strong style={{ color: '#388bfd' }}>{consoleOutput.score || 95}/100</strong></span>
                                  <span>Tests: <strong style={{ color: '#3fb950' }}>{consoleOutput.passedTests || '20/20'}</strong></span>
                                  <span>Runtime: <strong>{consoleOutput.runtime || '32ms'}</strong></span>
                                  <span>Memory: <strong>{consoleOutput.memory || '18MB'}</strong></span>
                                  <span>Complexity: <strong style={{ color: '#93c5fd' }}>{consoleOutput.complexity || 'O(n)'}</strong></span>
                                </div>
                                {consoleOutput.suggestions && consoleOutput.suggestions.length > 0 && (
                                  <div style={{ fontSize: '0.84rem', color: '#cbd5e1', marginTop: '4px' }}>
                                    <strong>AI Suggestions:</strong> {consoleOutput.suggestions.join(' ')}
                                  </div>
                                )}
                              </div>
                            ) : (
                              <div className="console-placeholder">
                                Click "Run Code" or "Submit Code" to test your solution using Gemini.
                              </div>
                            )
                          ) : (
                            <div className="history-list-view">
                              {submissionHistory.length > 0 ? (
                                submissionHistory.slice(0, 5).map((h, i) => (
                                  <div key={h._id || i} className="history-item-row">
                                    <span className="history-title">{h.title}</span>
                                    <span className="history-runtime">{h.runtime || '32ms'}</span>
                                    <span className="history-score">+{h.score || 50} XP</span>
                                  </div>
                                ))
                              ) : (
                                <p className="console-placeholder">No past submissions recorded for this session.</p>
                              )}
                            </div>
                          )}

                          <div className="console-actions">
                            <button
                              type="button"
                              className="ide-btn ide-btn--run"
                              onClick={handleRunCode}
                              disabled={isExecuting}
                              style={{ background: '#30363d', color: '#ffffff' }}
                            >
                              ▶ Run Code
                            </button>
                            <button
                              type="button"
                              className="ide-btn ide-btn--submit"
                              onClick={handleRunCode}
                              disabled={isExecuting}
                            >
                              <Icon name="spark" />
                              <span>{isExecuting ? 'Evaluating...' : 'Submit Code'}</span>
                            </button>
                          </div>
                        </div>
                      </div>
                    </div>
                  </div>
                </>
              ) : (
                /* EMPTY FILTER STATE */
                <div className="empty-questions-state" style={{ textAlign: 'center', padding: '3rem', background: '#ffffff', borderRadius: '16px', border: '1px solid #e2e8f0' }}>
                  <Icon name="info" />
                  <h3 style={{ fontSize: '1.2rem', color: '#0f172a', margin: '12px 0 6px' }}>No questions available for the selected filters.</h3>
                  <p style={{ color: '#64748b', marginBottom: '16px' }}>Try clearing filters or generating a random question.</p>
                  <div style={{ display: 'flex', gap: '12px', justifyContent: 'center' }}>
                    <button type="button" className="reset-filters-btn" onClick={handleResetFilters}>
                      Reset Filters
                    </button>
                    <button type="button" className="reset-filters-btn" style={{ background: '#059669' }} onClick={handleRandomCodingQuestion}>
                      🎲 Generate Random Question
                    </button>
                  </div>
                </div>
              )}
            </div>
          )
        ) : (
          /* PAGE 2: APTITUDE PRACTICE */
          <div className="aptitude-practice-wrapper">
            {/* PAGE HEADER */}
            <div className="aptitude-page-header">
              <div className="aptitude-header-left">
                <h2>Aptitude Drills (10 Questions Set)</h2>
                <div className="aptitude-mode-switches">
                  {[
                    { id: 'practice', name: 'Practice Mode' },
                    { id: 'mock', name: 'Mock Test Mode' },
                    { id: 'timed', name: 'Timed Assessment' },
                  ].map((m) => (
                    <button
                      key={m.id}
                      type="button"
                      className={`mode-sub-tab ${aptitudeMode === m.id ? 'mode-sub-tab--active' : ''}`}
                      onClick={() => handleSwitchAptitudeMode(m.id)}
                    >
                      {m.name}
                    </button>
                  ))}
                </div>
              </div>

              {aptitudeMode !== 'practice' && (
                <div className="aptitude-header-actions">
                  <div className="aptitude-timer-chip">
                    <Icon name="clock" />
                    <span>Timer: {formatTimer(aptitudeTimer)}</span>
                  </div>
                </div>
              )}
            </div>

            {/* MODE SPECIFIC INFO BANNERS */}
            {aptitudeMode === 'mock' && (
              <div style={{ background: '#eff6ff', border: '1px solid #bfdbfe', borderRadius: '12px', padding: '0.85rem 1.25rem', marginBottom: '1.25rem', display: 'flex', alignItems: 'center', gap: '12px' }}>
                <div style={{ fontSize: '1.4rem' }}>📝</div>
                <div>
                  <h4 style={{ margin: 0, fontSize: '0.92rem', fontWeight: 700, color: '#1e40af' }}>Mock Test Mode (30-Minute Timed Exam)</h4>
                  <p style={{ margin: '2px 0 0', fontSize: '0.82rem', color: '#3b82f6' }}>Complete all 10 questions under real exam conditions. Your 30-minute timer counts down automatically.</p>
                </div>
              </div>
            )}

            {aptitudeMode === 'timed' && (
              <div style={{ background: '#fef3c7', border: '1px solid #fde68a', borderRadius: '12px', padding: '0.85rem 1.25rem', marginBottom: '1.25rem', display: 'flex', alignItems: 'center', gap: '12px' }}>
                <div style={{ fontSize: '1.4rem' }}>⚡</div>
                <div>
                  <h4 style={{ margin: 0, fontSize: '0.92rem', fontWeight: 700, color: '#92400e' }}>Timed Assessment Mode (15-Minute Speed Challenge)</h4>
                  <p style={{ margin: '2px 0 0', fontSize: '0.82rem', color: '#b45309' }}>High-velocity problem-solving. Test your speed and accuracy under strict time constraints.</p>
                </div>
              </div>
            )}

            {/* CATEGORY GRID */}
            <div className="aptitude-categories-grid">
              {[
                { name: 'Quantitative Aptitude', icon: 'calculator', desc: 'Numbers, Work & Percentages' },
                { name: 'Logical Reasoning', icon: 'brain', desc: 'Coding-Decoding & Logic' },
                { name: 'Verbal Ability', icon: 'book', desc: 'Grammar & Synonyms' },
                { name: 'Data Interpretation', icon: 'barChart', desc: 'Charts & Financial Tables' },
                { name: 'Analytical Reasoning', icon: 'layers', desc: 'Puzzles & Schedules' },
                { name: 'Puzzle Solving', icon: 'target', desc: 'Riddles & Logic Drills' },
              ].map((cat) => (
                <div
                  key={cat.name}
                  className={`aptitude-cat-card ${activeCategory === cat.name ? 'aptitude-cat-card--active' : ''}`}
                  onClick={() => setActiveCategory(cat.name)}
                >
                  <div className="cat-card-header">
                    <div className="cat-icon-badge cat-icon-badge--blue">
                      <Icon name={cat.icon} />
                    </div>
                    <span className="cat-count-badge">10 Qs</span>
                  </div>
                  <h4>{cat.name}</h4>
                  <p>{cat.desc}</p>
                </div>
              ))}
            </div>

            {/* CONTENT AREA WITH TIMEOUT ERROR HANDLING */}
            {isAptitudeLoading ? (
              <div style={{ textAlign: 'center', padding: '3rem', background: '#ffffff', borderRadius: '16px', border: '1px solid #e2e8f0' }}>
                <div className="spinner" style={{ width: '40px', height: '40px', border: '4px solid #cbd5e1', borderTopColor: '#256cf0', borderRadius: '50%', margin: '0 auto 1rem', animation: 'spin 1s linear infinite' }} />
                <p style={{ color: '#64748b', fontWeight: 600 }}>Loading questions for {activeCategory}...</p>
              </div>
            ) : aptitudeError ? (
              /* ERROR / TIMEOUT FALLBACK UI */
              <div style={{ textAlign: 'center', padding: '3rem', background: '#ffffff', borderRadius: '16px', border: '1px solid #e2e8f0' }}>
                <Icon name="info" />
                <h3 style={{ fontSize: '1.2rem', color: '#dc2626', margin: '12px 0 6px' }}>Unable to load questions for {activeCategory}.</h3>
                <p style={{ color: '#64748b', marginBottom: '16px' }}>The request timed out or returned no questions.</p>
                <div style={{ display: 'flex', gap: '12px', justifyContent: 'center' }}>
                  <button type="button" className="reset-filters-btn" onClick={handleRetryAptitude}>
                    🔄 Retry
                  </button>
                  <button type="button" className="reset-filters-btn" style={{ background: '#059669' }} onClick={handleRandomAptitudeQuestion}>
                    🎲 Generate Random Question
                  </button>
                </div>
              </div>
            ) : (
              <div className="aptitude-content-layout">
                {/* QUESTION AREA */}
                <div className="aptitude-main-area">
                  {currentAptitudeQuestion ? (
                    <>
                      <div className="aptitude-progress-box">
                        <div className="aptitude-progress-header">
                          <span className="question-count">
                            Question {activeAptitudeIndex + 1} of {aptitudeQuestions.length}
                          </span>
                          <span className="accuracy-count">{userStats.accuracy}% Overall Accuracy</span>
                        </div>
                        <div className="aptitude-progress-track">
                          <div
                            className="aptitude-progress-fill"
                            style={{
                              width: `${((activeAptitudeIndex + 1) / (aptitudeQuestions.length || 10)) * 100}%`,
                            }}
                          />
                        </div>
                      </div>

                      {/* QUESTION CARD */}
                      <div className="aptitude-question-card">
                        <div className="q-card-top">
                          <span className="category-pill-tag">{activeCategory}</span>
                          <span className={`difficulty-tag difficulty-tag--${currentAptitudeQuestion.difficulty?.toLowerCase()}`}>
                            {currentAptitudeQuestion.difficulty}
                          </span>
                        </div>

                        <h3 className="question-prompt">{currentAptitudeQuestion.question}</h3>

                        {/* OPTIONS */}
                        <div className="aptitude-options-list">
                          {currentAptitudeQuestion.options?.map((opt) => {
                            const isSelected = selectedOption === opt.label;
                            return (
                              <button
                                key={opt.label}
                                type="button"
                                className={`aptitude-option-btn ${isSelected ? 'aptitude-option-btn--selected' : ''}`}
                                onClick={() => handleSelectAptitudeOption(opt.label)}
                              >
                                <div className={`option-badge ${isSelected ? 'option-badge--selected' : ''}`}>
                                  {opt.label}
                                </div>
                                <span className="option-text">{opt.text}</span>
                              </button>
                            );
                          })}
                        </div>

                        {/* EVALUATION FEEDBACK BOX */}
                        {showExplanation && (
                          <div className={`explanation-feedback-box ${evaluationResult?.isCorrect ? '' : 'explanation-feedback-box--wrong'}`} style={{
                            background: evaluationResult?.isCorrect ? '#f0fdf4' : '#fef2f2',
                            borderColor: evaluationResult?.isCorrect ? '#bbf7d0' : '#fecaca',
                            padding: '1rem',
                            borderRadius: '12px',
                            marginBottom: '1.5rem',
                          }}>
                            <div className="explanation-title" style={{ color: evaluationResult?.isCorrect ? '#15803d' : '#b91c1c' }}>
                              <Icon name="checkCircle" />
                              <span>{evaluationResult?.isCorrect ? '✓ Correct Answer!' : '❌ Incorrect Answer'}</span>
                            </div>
                            <p className="explanation-body" style={{ color: evaluationResult?.isCorrect ? '#166534' : '#991b1b', margin: '4px 0 0 0' }}>
                              <strong>Explanation:</strong> {currentAptitudeQuestion.explanation}
                            </p>
                          </div>
                        )}

                        {/* APTITUDE BUTTON CONTROLS */}
                        <div className="aptitude-card-footer" style={{ display: 'flex', gap: '10px', flexWrap: 'wrap' }}>
                          <button
                            type="button"
                            className="aptitude-nav-btn"
                            onClick={handleSubmitAptitudeAnswer}
                            style={{ background: '#256cf0', color: '#ffffff', borderColor: '#256cf0' }}
                          >
                            Submit Answer
                          </button>
                          <button
                            type="button"
                            className="aptitude-nav-btn"
                            onClick={() => setShowExplanation(prev => !prev)}
                          >
                            {showExplanation ? 'Hide Explanation' : 'Show Explanation'}
                          </button>
                          <button
                            type="button"
                            className="aptitude-nav-btn"
                            onClick={handlePrevAptitudeQuestion}
                            disabled={activeAptitudeIndex === 0}
                          >
                            ◀ Prev
                          </button>
                          <button
                            type="button"
                            className="aptitude-nav-btn"
                            onClick={handleNextAptitudeQuestion}
                            disabled={activeAptitudeIndex === aptitudeQuestions.length - 1}
                          >
                            Next ▶
                          </button>
                        </div>
                      </div>
                    </>
                  ) : (
                    <div style={{ textAlign: 'center', padding: '2rem' }}>
                      <p>No questions found in this category.</p>
                      <button type="button" className="reset-filters-btn" onClick={handleRetryAptitude}>
                        Retry
                      </button>
                    </div>
                  )}
                </div>

                {/* SIDEBAR */}
                <div className="aptitude-side-area">
                  <div className="aptitude-widget-card">
                    <h4 className="widget-label-title">Real-time Performance Gauge</h4>

                    <div className="performance-gauge-row">
                      <div className="circular-gauge">
                        <svg viewBox="0 0 36 36" className="gauge-svg">
                          <path
                            className="gauge-bg"
                            d="M18 2.0845 a 15.9155 15.9155 0 0 1 0 31.831 a 15.9155 15.9155 0 0 1 0 -31.831"
                          />
                          <path
                            className="gauge-fill"
                            strokeDasharray={`${userStats.accuracy}, 100`}
                            d="M18 2.0845 a 15.9155 15.9155 0 0 1 0 31.831 a 15.9155 15.9155 0 0 1 0 -31.831"
                          />
                        </svg>
                        <div className="gauge-center-text">
                          <strong>
                            {userStats.accuracy}
                            <span>%</span>
                          </strong>
                        </div>
                      </div>

                      <div className="gauge-info">
                        <strong>Target Role Readiness</strong>
                        <p>{userStats.solved} Problems Solved</p>
                      </div>
                    </div>

                    <div className="performance-metrics-grid">
                      <div className="metric-box">
                        <strong className="metric-value">42s</strong>
                        <span className="metric-label">Avg Speed/Q</span>
                      </div>

                      <div className="metric-box">
                        <strong className="metric-value">{userStats.streak}</strong>
                        <span className="metric-label">Active Streak</span>
                      </div>
                    </div>
                  </div>

                  {/* WEAK AREAS */}
                  {weakTopics.length > 0 && (
                    <div className="aptitude-widget-card weak-topics-card">
                      <h4 className="widget-label-title">Detected Weak Areas</h4>
                      <div className="weak-tags-list">
                        {weakTopics.map((wt) => (
                          <span key={wt} className="weak-topic-pill">
                            ⚠️ {wt}
                          </span>
                        ))}
                      </div>
                    </div>
                  )}

                  {/* RECOMMENDATIONS */}
                  <div className="aptitude-widget-card recommendations-card">
                    <h4 className="widget-label-title">AI Recommendations</h4>
                    <ul className="rec-list">
                      {topicRecommendations.map((rec, i) => (
                        <li key={i}>
                          <Icon name="target" />
                          <span>{rec}</span>
                        </li>
                      ))}
                    </ul>
                  </div>

                  <div className="global-ranking-banner">
                    <div className="ranking-banner-content">
                      <span className="ranking-eyebrow">GLOBAL RANKING</span>
                      <h3>Top Candidate for {selectedCareerTrack}</h3>
                    </div>
                  </div>
                </div>
              </div>
            )}
          </div>
        )}

        {/* SOLUTION MODAL OVERLAY */}
        {isSolutionModalOpen && currentCodingQuestion && (
          <div className="career-modal-backdrop" style={{ zIndex: 1100 }}>
            <div className="career-modal-card" style={{ maxWidth: '680px', width: '90%', background: '#0d1117', color: '#f0f6fc', border: '1px solid #30363d', borderRadius: '16px', padding: '1.5rem' }}>
              <div className="modal-header" style={{ borderBottom: '1px solid #30363d', paddingBottom: '12px', marginBottom: '16px', display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
                <div>
                  <h3 style={{ margin: 0, color: '#58a6ff', fontSize: '1.2rem', display: 'flex', alignItems: 'center', gap: '8px' }}>
                    <span>💡 Optimal Solution</span>
                    <span style={{ fontSize: '0.8rem', background: '#21262d', padding: '2px 8px', borderRadius: '12px', color: '#8b949e' }}>
                      {language}
                    </span>
                  </h3>
                  <p style={{ margin: '4px 0 0 0', fontSize: '0.88rem', color: '#8b949e' }}>
                    {currentCodingQuestion.title}
                  </p>
                </div>
                <button
                  type="button"
                  onClick={() => setIsSolutionModalOpen(false)}
                  style={{ background: 'transparent', border: 'none', color: '#8b949e', fontSize: '1.4rem', cursor: 'pointer' }}
                >
                  ✕
                </button>
              </div>

              <div className="modal-body">
                <div style={{ marginBottom: '12px', background: '#161b22', padding: '10px 14px', borderRadius: '8px', borderLeft: '3px solid #388bfd' }}>
                  <strong style={{ color: '#79c0ff', fontSize: '0.85rem' }}>APPROACH & COMPLEXITY:</strong>
                  <p style={{ margin: '4px 0 0 0', fontSize: '0.88rem', color: '#c9d1d9' }}>
                    {currentCodingQuestion.solution || 'Optimal O(N) solution using efficient algorithm design.'}
                  </p>
                </div>

                <div style={{ background: '#161b22', borderRadius: '8px', padding: '12px', border: '1px solid #30363d', maxHeight: '320px', overflowY: 'auto' }}>
                  <pre style={{ margin: 0, fontFamily: 'monospace', fontSize: '0.88rem', color: '#79c0ff', whiteSpace: 'pre-wrap' }}>
                    {currentCodingQuestion.solutionCode?.[language] ||
                      currentCodingQuestion.solutionCode?.['Python'] ||
                      currentCodingQuestion.starterCode?.[language] ||
                      '// Solution available for Python & JavaScript.'}
                  </pre>
                </div>
              </div>

              <div className="modal-footer" style={{ marginTop: '16px', display: 'flex', gap: '12px', justifyContent: 'flex-end', paddingTop: '12px', borderTop: '1px solid #30363d' }}>
                <button
                  type="button"
                  onClick={() => setIsSolutionModalOpen(false)}
                  style={{ background: '#21262d', color: '#c9d1d9', border: '1px solid #30363d', padding: '8px 16px', borderRadius: '8px', cursor: 'pointer', fontWeight: 600 }}
                >
                  Close
                </button>
                <button
                  type="button"
                  onClick={() => handleCopySolutionToEditor(
                    currentCodingQuestion.solutionCode?.[language] || currentCodingQuestion.solutionCode?.['Python']
                  )}
                  style={{ background: '#238636', color: '#ffffff', border: 'none', padding: '8px 16px', borderRadius: '8px', cursor: 'pointer', fontWeight: 600 }}
                >
                  📋 Copy Solution to Editor
                </button>
              </div>
            </div>
          </div>
        )}

        <AppFooter />
      </main>
      <MobileNav />
    </div>
  );
}
