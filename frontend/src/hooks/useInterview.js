import { useState, useEffect, useRef } from 'react';
import { getInterviewReport, startInterview, evaluateInterview } from '../services/interviewService.js';
import { navigate } from './usePathname.js';

export function useInterview() {
  const [reportData, setReportData] = useState(null);
  const [loading, setLoading] = useState(true);

  const pathname = window.location.pathname;
  const searchParams = new URLSearchParams(window.location.search);
  const interviewId = searchParams.get('interviewId');

  const [view, setView] = useState(() => {
    return pathname === '/mock-interviews' ? 'config' : 'report';
  });

  const [targetCompany, setTargetCompany] = useState('Google');
  const [targetRole, setTargetRole] = useState('Product Manager');
  const [difficulty, setDifficulty] = useState('Mid-Level');
  const [toastMsg, setToastMsg] = useState('');

  // Interactive Session State
  const [questions, setQuestions] = useState([]);
  const [currentQuestionIndex, setCurrentQuestionIndex] = useState(0);
  const [userAnswer, setUserAnswer] = useState('');
  const [qnaList, setQnaList] = useState([]);
  const [isEvaluating, setIsEvaluating] = useState(false);

  // Interviewer Hint State
  const [hintsUsedCount, setHintsUsedCount] = useState(0);
  const [revealedHints, setRevealedHints] = useState({});

  const handleUseHint = () => {
    if (!revealedHints[currentQuestionIndex]) {
      setRevealedHints((prev) => ({ ...prev, [currentQuestionIndex]: true }));
      setHintsUsedCount((prev) => prev + 1);
      showToast('💡 Hint unlocked! (0.5 point deduction applied to evaluation)');
    }
  };

  // Audio / Speech State
  const [isSpeaking, setIsSpeaking] = useState(false);
  const [isListening, setIsListening] = useState(false);
  const recognitionRef = useRef(null);

  useEffect(() => {
    const currentPath = window.location.pathname;
    const currentParams = new URLSearchParams(window.location.search);
    const paramId = currentParams.get('interviewId');
    const storedId = localStorage.getItem('careerprep_active_interview_id');
    const id = paramId || storedId;

    if (currentPath === '/mock-interviews' || currentPath === '/interview-report') {
      setLoading(true);
      getInterviewReport(id)
        .then((data) => {
          if (data && (data.status === 'completed' || data.id || data.score)) {
            setReportData(data);
            if (data.id) localStorage.setItem('careerprep_active_interview_id', data.id);
            if (currentPath === '/interview-report') {
              setView('report');
            }
          } else {
            setReportData(null);
            if (currentPath === '/interview-report') {
              navigate('/mock-interviews');
            } else if (view !== 'session') {
              setView('config');
            }
          }
        })
        .catch(() => {
          setReportData(null);
          if (currentPath === '/interview-report') {
            navigate('/mock-interviews');
          } else if (view !== 'session') {
            setView('config');
          }
        })
        .finally(() => setLoading(false));
    } else {
      setLoading(false);
    }
  }, [window.location.pathname, window.location.search]);


  const showToast = (msg) => {
    setToastMsg(msg);
    setTimeout(() => setToastMsg(''), 3000);
  };

  const handleExitReport = () => {
    localStorage.removeItem('careerprep_active_interview_id');
    setReportData(null);
    setView('config');
    navigate('/mock-interviews');
    showToast('Exited interview report.');
  };

  // Text-to-Speech (Speaker option)
  const speakQuestion = (text) => {
    if (!text) return;
    if ('speechSynthesis' in window) {
      window.speechSynthesis.cancel();
      const utterance = new SpeechSynthesisUtterance(text);
      utterance.rate = 0.95;
      utterance.pitch = 1.0;
      utterance.onstart = () => setIsSpeaking(true);
      utterance.onend = () => setIsSpeaking(false);
      utterance.onerror = () => setIsSpeaking(false);
      window.speechSynthesis.speak(utterance);
    } else {
      showToast('Text-to-speech is not supported in this browser.');
    }
  };

  const stopSpeaking = () => {
    if ('speechSynthesis' in window) {
      window.speechSynthesis.cancel();
      setIsSpeaking(false);
    }
  };

  // Speech Recognition (Microphone voice input)
  const toggleListening = () => {
    const SpeechRecognition = window.SpeechRecognition || window.webkitSpeechRecognition;
    if (!SpeechRecognition) {
      showToast('Voice input is not supported in this browser. Please type your response.');
      return;
    }

    if (isListening) {
      if (recognitionRef.current) {
        recognitionRef.current.stop();
      }
      setIsListening(false);
    } else {
      try {
        const recognition = new SpeechRecognition();
        recognition.continuous = true;
        recognition.interimResults = true;
        recognition.lang = 'en-US';

        recognition.onresult = (event) => {
          let transcript = '';
          for (let i = event.resultIndex; i < event.results.length; i++) {
            transcript += event.results[i][0].transcript;
          }
          if (transcript) {
            setUserAnswer((prev) => (prev ? `${prev} ${transcript}` : transcript));
          }
        };

        recognition.onend = () => setIsListening(false);
        recognition.onerror = () => setIsListening(false);

        recognition.start();
        recognitionRef.current = recognition;
        setIsListening(true);
      } catch (err) {
        showToast('Unable to start microphone.');
        setIsListening(false);
      }
    }
  };

  const handleStartSession = async (e) => {
    e.preventDefault();
    showToast(`Initializing AI Mock Interview for ${targetRole} @ ${targetCompany}...`);
    setLoading(true);
    try {
      const data = await startInterview({ role: targetRole, company: targetCompany, difficulty });
      const fetchedQuestions = data?.questions || [];
      if (fetchedQuestions.length === 0) {
        throw new Error('No interview questions generated.');
      }
      setQuestions(fetchedQuestions);
      setCurrentQuestionIndex(0);
      setQnaList([]);
      setUserAnswer('');
      setHintsUsedCount(0);
      setRevealedHints({});
      setView('session');
      showToast('Interview session started! AI interviewer is ready.');
      speakQuestion(fetchedQuestions[0].question);
    } catch (err) {
      showToast(err.message || 'Failed to initialize interview session.');
    } finally {
      setLoading(false);
    }
  };

  const handleNextQuestion = () => {
    stopSpeaking();
    if (isListening && recognitionRef.current) {
      recognitionRef.current.stop();
      setIsListening(false);
    }

    const currentQ = questions[currentQuestionIndex];
    const newEntry = {
      questionId: currentQ?.id || `q_${currentQuestionIndex}`,
      question: currentQ?.question || '',
      answer: userAnswer.trim() || 'No answer provided.',
      category: currentQ?.category || 'General',
    };

    const updatedQna = [...qnaList, newEntry];
    setQnaList(updatedQna);
    setUserAnswer('');

    if (currentQuestionIndex < questions.length - 1) {
      const nextIdx = currentQuestionIndex + 1;
      setCurrentQuestionIndex(nextIdx);
      speakQuestion(questions[nextIdx].question);
    } else {
      handleFinishSession(updatedQna);
    }
  };

  const handleFinishSession = async (finalQnaList = qnaList) => {
    stopSpeaking();
    if (isListening && recognitionRef.current) {
      recognitionRef.current.stop();
      setIsListening(false);
    }

    setIsEvaluating(true);
    showToast('Submitting responses... AI Bar Raiser is evaluating your interview session.');

    let finalQna = [...finalQnaList];
    const currentQ = questions[currentQuestionIndex];
    if (currentQ && userAnswer.trim() && !finalQna.some((q) => q.questionId === currentQ.id || q.question === currentQ.question)) {
      finalQna.push({
        questionId: currentQ.id || `q_${currentQuestionIndex}`,
        question: currentQ.question || '',
        answer: userAnswer.trim(),
        category: currentQ.category || 'General',
      });
    }

    try {
      const data = await evaluateInterview({
        role: targetRole,
        company: targetCompany,
        difficulty,
        qnaList: finalQna,
        hintsUsedCount,
      });

      const reportId = data?.id || data?._id;
      if (data && reportId) {
        localStorage.setItem('careerprep_active_interview_id', reportId);
        showToast('Evaluation complete! Opening detailed interview report...');
        navigate(`/interview-report?interviewId=${reportId}`);
      } else if (data && (data.score || data.skillsRadar || data.headline)) {
        setReportData(data);
        setView('report');
      } else {
        throw new Error(data?.error || 'Failed to parse evaluation report.');
      }
    } catch (err) {
      showToast(err.message || 'Evaluation failed. Please try again.');
    } finally {
      setIsEvaluating(false);
    }
  };

  const handleDownloadPDF = () => {
    if (!reportData) {
      showToast('No interview report available to export.');
      return;
    }

    showToast('Generating Post-Interview Analysis Report PDF...');

    const roleStr = reportData.role || targetRole || 'Candidate';
    const companyStr = reportData.targetCompany || targetCompany || 'Company';
    const dateStr = new Date().toLocaleDateString('en-US', { year: 'numeric', month: 'long', day: 'numeric' });

    const fileName = `${roleStr}_${companyStr}_Interview_Report.pdf`.replace(/\s+/g, '_');
    const originalTitle = document.title;
    document.title = fileName;

    const printWindow = window.open('', '_blank');
    if (!printWindow) {
      window.print();
      setTimeout(() => { document.title = originalTitle; }, 1000);
      return;
    }

    const htmlContent = `
      <!DOCTYPE html>
      <html>
        <head>
          <title>${fileName}</title>
          <style>
            @import url('https://fonts.googleapis.com/css2?family=Inter:wght@400;500;600;700;800&display=swap');
            
            * { box-sizing: border-box; }
            body {
              font-family: 'Inter', -apple-system, BlinkMacSystemFont, sans-serif;
              color: #0f172a;
              margin: 0;
              padding: 24px;
              background: #ffffff;
              line-height: 1.45;
              font-size: 13px;
            }

            .report-wrapper {
              max-width: 800px;
              margin: 0 auto;
            }

            /* EXECUTIVE HEADER */
            .header-banner {
              background: linear-gradient(135deg, #0f172a 0%, #1e293b 100%);
              color: #ffffff;
              padding: 24px 28px;
              border-radius: 14px;
              margin-bottom: 24px;
              display: flex;
              justify-content: space-between;
              align-items: center;
              box-shadow: 0 4px 12px rgba(15, 23, 42, 0.08);
            }
            .header-banner .brand {
              font-size: 11px;
              font-weight: 800;
              letter-spacing: 1.2px;
              text-transform: uppercase;
              color: #38bdf8;
              margin-bottom: 4px;
            }
            .header-banner .title {
              font-size: 22px;
              font-weight: 800;
              margin: 0;
              color: #ffffff;
            }
            .header-banner .subtitle {
              font-size: 13px;
              color: #94a3b8;
              margin-top: 4px;
            }
            .header-banner .target-badge {
              background: rgba(56, 189, 248, 0.15);
              color: #38bdf8;
              border: 1px solid rgba(56, 189, 248, 0.3);
              padding: 6px 14px;
              border-radius: 20px;
              font-size: 12px;
              font-weight: 700;
              display: inline-block;
            }

            /* SCORE CARD */
            .score-card-section {
              background: #f8fafc;
              border: 1px solid #e2e8f0;
              border-radius: 14px;
              padding: 20px 24px;
              margin-bottom: 24px;
              display: flex;
              align-items: center;
              gap: 24px;
            }
            .score-circle {
              width: 80px;
              height: 80px;
              border-radius: 50%;
              background: linear-gradient(135deg, #2563eb 0%, #1d4ed8 100%);
              color: #ffffff;
              display: flex;
              flex-direction: column;
              align-items: center;
              justify-content: center;
              font-weight: 800;
              font-size: 26px;
              line-height: 1;
              flex-shrink: 0;
              box-shadow: 0 4px 12px rgba(37, 99, 235, 0.25);
            }
            .score-circle span {
              font-size: 10px;
              opacity: 0.85;
              margin-top: 3px;
              font-weight: 600;
              letter-spacing: 0.5px;
            }
            .score-info h2 {
              margin: 0 0 4px 0;
              font-size: 17px;
              font-weight: 800;
              color: #0f172a;
            }
            .score-info p {
              margin: 0;
              font-size: 13px;
              color: #64748b;
            }
            .hint-notice {
              display: inline-block;
              margin-top: 8px;
              background: #fffbeb;
              border: 1px solid #fde68a;
              color: #b45309;
              padding: 4px 10px;
              border-radius: 12px;
              font-size: 11px;
              font-weight: 700;
            }

            /* SECTION TITLES */
            .section-header {
              font-size: 15px;
              font-weight: 800;
              color: #0f172a;
              margin: 0 0 14px 0;
              display: flex;
              align-items: center;
              gap: 8px;
            }

            /* COMPETENCY BARS */
            .competency-card {
              border: 1px solid #e2e8f0;
              border-radius: 14px;
              padding: 20px 24px;
              margin-bottom: 24px;
              background: #ffffff;
            }
            .comp-grid {
              display: flex;
              flex-direction: column;
              gap: 12px;
            }
            .comp-row {
              display: flex;
              align-items: center;
              gap: 16px;
            }
            .comp-name {
              width: 170px;
              font-size: 12px;
              font-weight: 700;
              color: #334155;
            }
            .comp-track {
              flex: 1;
              height: 10px;
              background: #f1f5f9;
              border-radius: 10px;
              overflow: hidden;
            }
            .comp-fill {
              height: 100%;
              background: linear-gradient(90deg, #2563eb 0%, #3b82f6 100%);
              border-radius: 10px;
            }
            .comp-val {
              width: 45px;
              text-align: right;
              font-size: 12px;
              font-weight: 800;
              color: #0f172a;
            }

            /* 2-COLUMN GRID FOR STRENGTHS & IMPROVEMENTS */
            .report-grid {
              display: flex;
              gap: 20px;
              margin-bottom: 24px;
            }
            .report-col {
              flex: 1;
              border: 1px solid #e2e8f0;
              border-radius: 14px;
              padding: 20px;
              background: #ffffff;
            }
            .report-col.strengths-col { border-top: 4px solid #16a34a; }
            .report-col.improvements-col { border-top: 4px solid #d97706; }

            .feedback-item {
              margin-bottom: 14px;
            }
            .feedback-item:last-child { margin-bottom: 0; }
            .feedback-item strong {
              display: block;
              font-size: 13px;
              font-weight: 700;
              color: #1e293b;
              margin-bottom: 2px;
            }
            .feedback-item p {
              margin: 0;
              font-size: 12px;
              color: #475569;
              line-height: 1.4;
            }

            /* NEXT STEPS CARD */
            .next-steps-card {
              background: #faf5ff;
              border: 1px solid #e9d5ff;
              border-radius: 14px;
              padding: 20px 24px;
              margin-bottom: 24px;
            }
            .next-steps-card h3 {
              margin: 0 0 14px 0;
              font-size: 15px;
              font-weight: 800;
              color: #6b21a8;
            }

            /* FOOTER */
            .report-footer {
              text-align: center;
              font-size: 11px;
              color: #94a3b8;
              padding-top: 16px;
              border-top: 1px solid #f1f5f9;
            }

            /* PAGE BREAK PREVENTION RULES */
            @media print {
              @page {
                size: A4 portrait;
                margin: 12mm 15mm;
              }
              body {
                padding: 0 !important;
                background: #ffffff !important;
                font-size: 11px !important;
                color: #0f172a !important;
              }
              .header-banner,
              .score-card-section,
              .competency-card,
              .report-grid,
              .report-col,
              .next-steps-card {
                break-inside: avoid !important;
                page-break-inside: avoid !important;
              }
              .section-header, h1, h2, h3, h4 {
                break-after: avoid !important;
                page-break-after: avoid !important;
              }
              .report-grid {
                display: flex !important;
                flex-direction: row !important;
                gap: 16px !important;
              }
            }
          </style>
        </head>
        <body>
          <div class="report-wrapper">
            <!-- EXECUTIVE HEADER -->
            <div class="header-banner">
              <div>
                <div class="brand">CareerPrep &bull; AI Executive Assessment</div>
                <h1 class="title">Interview Evaluation Report</h1>
                <div class="subtitle">Candidate Analysis for ${roleStr} @ ${companyStr}</div>
              </div>
              <div style="text-align: right;">
                <span class="target-badge">${reportData.difficulty || 'Mid-Level'}</span>
                <div style="font-size: 11px; color: #94a3b8; margin-top: 6px;">Date: ${dateStr}</div>
              </div>
            </div>

            <!-- OVERALL SCORE CARD -->
            <div class="score-card-section">
              <div class="score-circle">
                ${reportData.score || 8.5}
                <span>/ 10</span>
              </div>
              <div class="score-info">
                <h2>${reportData.headline || 'Strong Performance'}</h2>
                <p>${reportData.percentileText || 'Top candidate benchmark for target role.'}</p>
                ${reportData.hintsUsedCount ? `<div class="hint-notice">💡 ${reportData.hintsUsedCount} Hint(s) Used (-${reportData.scoreDeduction || reportData.hintsUsedCount * 0.5} pts deduction)</div>` : ''}
              </div>
            </div>

            <!-- COMPETENCY SKILL DISTRIBUTION -->
            <div class="competency-card">
              <h3 class="section-header">Skill Competency Breakdown</h3>
              <div class="comp-grid">
                <div class="comp-row">
                  <div class="comp-name">Technical Knowledge</div>
                  <div class="comp-track"><div class="comp-fill" style="width: ${reportData.skillsRadar?.Technical || 85}%;"></div></div>
                  <div class="comp-val">${reportData.skillsRadar?.Technical || 85}%</div>
                </div>
                <div class="comp-row">
                  <div class="comp-name">Communication Clarity</div>
                  <div class="comp-track"><div class="comp-fill" style="width: ${reportData.skillsRadar?.Communication || 85}%;"></div></div>
                  <div class="comp-val">${reportData.skillsRadar?.Communication || 85}%</div>
                </div>
                <div class="comp-row">
                  <div class="comp-name">Grammar & Coherence</div>
                  <div class="comp-track"><div class="comp-fill" style="width: ${reportData.skillsRadar?.Grammar || 88}%;"></div></div>
                  <div class="comp-val">${reportData.skillsRadar?.Grammar || 88}%</div>
                </div>
                <div class="comp-row">
                  <div class="comp-name">Behavioral (STAR)</div>
                  <div class="comp-track"><div class="comp-fill" style="width: ${reportData.skillsRadar?.Behavioral || 82}%;"></div></div>
                  <div class="comp-val">${reportData.skillsRadar?.Behavioral || 82}%</div>
                </div>
                <div class="comp-row">
                  <div class="comp-name">Confidence & Persistence</div>
                  <div class="comp-track"><div class="comp-fill" style="width: ${reportData.skillsRadar?.Confidence || 86}%;"></div></div>
                  <div class="comp-val">${reportData.skillsRadar?.Confidence || 86}%</div>
                </div>
              </div>
            </div>

            <!-- STRENGTHS & AREAS FOR IMPROVEMENT -->
            <div class="report-grid">
              <div class="report-col strengths-col">
                <h3 class="section-header" style="color: #15803d;">Key Strengths</h3>
                ${(reportData.strengths || []).map(s => `
                  <div class="feedback-item">
                    <strong>✔ ${s.title}</strong>
                    <p>${s.desc}</p>
                  </div>
                `).join('')}
              </div>

              <div class="report-col improvements-col">
                <h3 class="section-header" style="color: #b45309;">Areas for Improvement</h3>
                ${(reportData.improvements || []).map(imp => `
                  <div class="feedback-item">
                    <strong>⚠️ ${imp.title}</strong>
                    <p>${imp.desc}</p>
                  </div>
                `).join('')}
              </div>
            </div>

            <!-- RECOMMENDED NEXT STEPS -->
            <div class="next-steps-card">
              <h3>Recommended Next Steps & Action Items</h3>
              ${(reportData.nextSteps || []).map(ns => `
                <div class="feedback-item">
                  <strong>🎯 ${ns.title}</strong>
                  <p>${ns.text || ns.desc || ''}</p>
                </div>
              `).join('')}
            </div>

            <!-- FOOTER -->
            <div class="report-footer">
              CareerPrep AI Executive Report &bull; Confidential Candidate Assessment Record &bull; Page 1 of 1
            </div>
          </div>

          <script>
            window.onload = function() {
              window.print();
            };
          </script>
        </body>
      </html>
    `;

    printWindow.document.open();
    printWindow.document.write(htmlContent);
    printWindow.document.close();

    setTimeout(() => {
      document.title = originalTitle;
    }, 1000);
  };

  return {
    loading,
    reportData,
    view,
    setView,
    targetCompany,
    setTargetCompany,
    targetRole,
    setTargetRole,
    difficulty,
    setDifficulty,
    toastMsg,
    questions,
    currentQuestionIndex,
    userAnswer,
    setUserAnswer,
    qnaList,
    isEvaluating,
    isSpeaking,
    isListening,
    hintsUsedCount,
    revealedHints,
    handleUseHint,
    speakQuestion,
    stopSpeaking,
    toggleListening,
    handleStartSession,
    handleNextQuestion,
    handleFinishSession,
    handleExitReport,
    handleDownloadPDF,
  };
}
