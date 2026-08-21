import{c as e,f as t,i as n,l as r,o as i,r as a,s as o,t as s}from"./index-C-_nL1QE.js";import{t as c}from"./Icon-CIzJkiJ5.js";import{n as l,t as u}from"./MobileNav-CDFhqVhI.js";import{n as d}from"./AppShell-3SYAkxkH.js";import{t as f}from"./AppFooter-BDl6LzcZ.js";var p=t(r(),1);async function m(e){if(!e)return null;let t=await fetch(`${i}/interview-report?interviewId=${encodeURIComponent(e)}`,{headers:o()});return t.ok?t.json():null}async function h(e){return(await fetch(`${i}/interview/start`,{method:`POST`,headers:o(),body:JSON.stringify(e)})).json()}async function g(e){let t=await fetch(`${i}/interview/evaluate`,{method:`POST`,headers:o(),body:JSON.stringify(e)}),n=await t.json();if(!t.ok)throw Error(n.error||`Evaluation failed`);return n}function _(){let[t,n]=(0,p.useState)(null),[r,i]=(0,p.useState)(!0),a=window.location.pathname;new URLSearchParams(window.location.search).get(`interviewId`);let[o,s]=(0,p.useState)(()=>a===`/mock-interviews`?`config`:`report`),[c,l]=(0,p.useState)(`Google`),[u,d]=(0,p.useState)(`Product Manager`),[f,_]=(0,p.useState)(`Mid-Level`),[v,y]=(0,p.useState)(``),[b,x]=(0,p.useState)([]),[S,C]=(0,p.useState)(0),[w,T]=(0,p.useState)(``),[E,D]=(0,p.useState)([]),[O,k]=(0,p.useState)(!1),[A,j]=(0,p.useState)(0),[M,N]=(0,p.useState)({}),P=()=>{M[S]||(N(e=>({...e,[S]:!0})),j(e=>e+1),B(`💡 Hint unlocked! (0.5 point deduction applied to evaluation)`))},[F,I]=(0,p.useState)(!1),[L,R]=(0,p.useState)(!1),z=(0,p.useRef)(null);(0,p.useEffect)(()=>{let t=window.location.pathname,r=new URLSearchParams(window.location.search).get(`interviewId`),a=localStorage.getItem(`careerprep_active_interview_id`),c=r||a;t===`/mock-interviews`||t===`/interview-report`?(i(!0),m(c).then(r=>{r&&(r.status===`completed`||r.id||r.score)?(n(r),r.id&&localStorage.setItem(`careerprep_active_interview_id`,r.id),t===`/interview-report`&&s(`report`)):(n(null),t===`/interview-report`?e(`/mock-interviews`):o!==`session`&&s(`config`))}).catch(()=>{n(null),t===`/interview-report`?e(`/mock-interviews`):o!==`session`&&s(`config`)}).finally(()=>i(!1))):i(!1)},[window.location.pathname,window.location.search]);let B=e=>{y(e),setTimeout(()=>y(``),3e3)},V=()=>{localStorage.removeItem(`careerprep_active_interview_id`),n(null),s(`config`),e(`/mock-interviews`),B(`Exited interview report.`)},H=e=>{if(e){if(`speechSynthesis`in window){window.speechSynthesis.cancel();let t=new SpeechSynthesisUtterance(e);t.rate=.95,t.pitch=1,t.onstart=()=>I(!0),t.onend=()=>I(!1),t.onerror=()=>I(!1),window.speechSynthesis.speak(t)}else B(`Text-to-speech is not supported in this browser.`)}},U=()=>{`speechSynthesis`in window&&(window.speechSynthesis.cancel(),I(!1))},W=()=>{let e=window.SpeechRecognition||window.webkitSpeechRecognition;if(!e){B(`Voice input is not supported in this browser. Please type your response.`);return}if(L)z.current&&z.current.stop(),R(!1);else try{let t=new e;t.continuous=!0,t.interimResults=!0,t.lang=`en-US`,t.onresult=e=>{let t=``;for(let n=e.resultIndex;n<e.results.length;n++)t+=e.results[n][0].transcript;t&&T(e=>e?`${e} ${t}`:t)},t.onend=()=>R(!1),t.onerror=()=>R(!1),t.start(),z.current=t,R(!0)}catch{B(`Unable to start microphone.`),R(!1)}},G=async e=>{e.preventDefault(),B(`Initializing AI Mock Interview for ${u} @ ${c}...`),i(!0);try{let e=(await h({role:u,company:c,difficulty:f}))?.questions||[];if(e.length===0)throw Error(`No interview questions generated.`);x(e),C(0),D([]),T(``),j(0),N({}),s(`session`),B(`Interview session started! AI interviewer is ready.`),H(e[0].question)}catch(e){B(e.message||`Failed to initialize interview session.`)}finally{i(!1)}},K=()=>{U(),L&&z.current&&(z.current.stop(),R(!1));let e=b[S],t={questionId:e?.id||`q_${S}`,question:e?.question||``,answer:w.trim()||`No answer provided.`,category:e?.category||`General`},n=[...E,t];if(D(n),T(``),S<b.length-1){let e=S+1;C(e),H(b[e].question)}else q(n)},q=async(t=E)=>{U(),L&&z.current&&(z.current.stop(),R(!1)),k(!0),B(`Submitting responses... AI Bar Raiser is evaluating your interview session.`);let r=[...t],i=b[S];i&&w.trim()&&!r.some(e=>e.questionId===i.id||e.question===i.question)&&r.push({questionId:i.id||`q_${S}`,question:i.question||``,answer:w.trim(),category:i.category||`General`});try{let t=await g({role:u,company:c,difficulty:f,qnaList:r,hintsUsedCount:A}),i=t?.id||t?._id;if(t&&i)localStorage.setItem(`careerprep_active_interview_id`,i),B(`Evaluation complete! Opening detailed interview report...`),e(`/interview-report?interviewId=${i}`);else if(t&&(t.score||t.skillsRadar||t.headline))n(t),s(`report`);else throw Error(t?.error||`Failed to parse evaluation report.`)}catch(e){B(e.message||`Evaluation failed. Please try again.`)}finally{k(!1)}};return{loading:r,reportData:t,view:o,setView:s,targetCompany:c,setTargetCompany:l,targetRole:u,setTargetRole:d,difficulty:f,setDifficulty:_,toastMsg:v,questions:b,currentQuestionIndex:S,userAnswer:w,setUserAnswer:T,qnaList:E,isEvaluating:O,isSpeaking:F,isListening:L,hintsUsedCount:A,revealedHints:M,handleUseHint:P,speakQuestion:H,stopSpeaking:U,toggleListening:W,handleStartSession:G,handleNextQuestion:K,handleFinishSession:q,handleExitReport:V,handleDownloadPDF:()=>{if(!t){B(`No interview report available to export.`);return}B(`Generating Post-Interview Analysis Report PDF...`);let e=t.role||u||`Candidate`,n=t.targetCompany||c||`Company`,r=new Date().toLocaleDateString(`en-US`,{year:`numeric`,month:`long`,day:`numeric`}),i=`${e}_${n}_Interview_Report.pdf`.replace(/\s+/g,`_`),a=document.title;document.title=i;let o=window.open(``,`_blank`);if(!o){window.print(),setTimeout(()=>{document.title=a},1e3);return}let s=`
      <!DOCTYPE html>
      <html>
        <head>
          <title>${i}</title>
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
                <div class="subtitle">Candidate Analysis for ${e} @ ${n}</div>
              </div>
              <div style="text-align: right;">
                <span class="target-badge">${t.difficulty||`Mid-Level`}</span>
                <div style="font-size: 11px; color: #94a3b8; margin-top: 6px;">Date: ${r}</div>
              </div>
            </div>

            <!-- OVERALL SCORE CARD -->
            <div class="score-card-section">
              <div class="score-circle">
                ${t.score||8.5}
                <span>/ 10</span>
              </div>
              <div class="score-info">
                <h2>${t.headline||`Strong Performance`}</h2>
                <p>${t.percentileText||`Top candidate benchmark for target role.`}</p>
                ${t.hintsUsedCount?`<div class="hint-notice">💡 ${t.hintsUsedCount} Hint(s) Used (-${t.scoreDeduction||t.hintsUsedCount*.5} pts deduction)</div>`:``}
              </div>
            </div>

            <!-- COMPETENCY SKILL DISTRIBUTION -->
            <div class="competency-card">
              <h3 class="section-header">Skill Competency Breakdown</h3>
              <div class="comp-grid">
                <div class="comp-row">
                  <div class="comp-name">Technical Knowledge</div>
                  <div class="comp-track"><div class="comp-fill" style="width: ${t.skillsRadar?.Technical||85}%;"></div></div>
                  <div class="comp-val">${t.skillsRadar?.Technical||85}%</div>
                </div>
                <div class="comp-row">
                  <div class="comp-name">Communication Clarity</div>
                  <div class="comp-track"><div class="comp-fill" style="width: ${t.skillsRadar?.Communication||85}%;"></div></div>
                  <div class="comp-val">${t.skillsRadar?.Communication||85}%</div>
                </div>
                <div class="comp-row">
                  <div class="comp-name">Grammar & Coherence</div>
                  <div class="comp-track"><div class="comp-fill" style="width: ${t.skillsRadar?.Grammar||88}%;"></div></div>
                  <div class="comp-val">${t.skillsRadar?.Grammar||88}%</div>
                </div>
                <div class="comp-row">
                  <div class="comp-name">Behavioral (STAR)</div>
                  <div class="comp-track"><div class="comp-fill" style="width: ${t.skillsRadar?.Behavioral||82}%;"></div></div>
                  <div class="comp-val">${t.skillsRadar?.Behavioral||82}%</div>
                </div>
                <div class="comp-row">
                  <div class="comp-name">Confidence & Persistence</div>
                  <div class="comp-track"><div class="comp-fill" style="width: ${t.skillsRadar?.Confidence||86}%;"></div></div>
                  <div class="comp-val">${t.skillsRadar?.Confidence||86}%</div>
                </div>
              </div>
            </div>

            <!-- STRENGTHS & AREAS FOR IMPROVEMENT -->
            <div class="report-grid">
              <div class="report-col strengths-col">
                <h3 class="section-header" style="color: #15803d;">Key Strengths</h3>
                ${(t.strengths||[]).map(e=>`
                  <div class="feedback-item">
                    <strong>✔ ${e.title}</strong>
                    <p>${e.desc}</p>
                  </div>
                `).join(``)}
              </div>

              <div class="report-col improvements-col">
                <h3 class="section-header" style="color: #b45309;">Areas for Improvement</h3>
                ${(t.improvements||[]).map(e=>`
                  <div class="feedback-item">
                    <strong>⚠️ ${e.title}</strong>
                    <p>${e.desc}</p>
                  </div>
                `).join(``)}
              </div>
            </div>

            <!-- RECOMMENDED NEXT STEPS -->
            <div class="next-steps-card">
              <h3>Recommended Next Steps & Action Items</h3>
              ${(t.nextSteps||[]).map(e=>`
                <div class="feedback-item">
                  <strong>🎯 ${e.title}</strong>
                  <p>${e.text||e.desc||``}</p>
                </div>
              `).join(``)}
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
          <\/script>
        </body>
      </html>
    `;o.document.open(),o.document.write(s),o.document.close(),setTimeout(()=>{document.title=a},1e3)}}}var v=n();function y(){let{user:e}=a(),{loading:t,reportData:n,view:r,setView:i,targetCompany:o,setTargetCompany:p,targetRole:m,setTargetRole:h,difficulty:g,setDifficulty:y,toastMsg:b,questions:x,currentQuestionIndex:S,userAnswer:C,setUserAnswer:w,qnaList:T,isEvaluating:E,isSpeaking:D,isListening:O,hintsUsedCount:k,revealedHints:A,handleUseHint:j,speakQuestion:M,stopSpeaking:N,toggleListening:P,handleStartSession:F,handleNextQuestion:I,handleFinishSession:L,handleExitReport:R,handleDownloadPDF:z}=_();if(r===`config`)return(0,v.jsxs)(`div`,{className:`app-shell`,children:[(0,v.jsx)(l,{}),(0,v.jsxs)(`main`,{className:`main-content`,style:{padding:`1.5rem 1rem 5.5rem`,display:`flex`,flexDirection:`column`,gap:`24px`},children:[(0,v.jsxs)(`header`,{className:`interview-config-header`,children:[(0,v.jsxs)(`div`,{children:[(0,v.jsx)(`h1`,{style:{fontSize:`1.4rem`,fontWeight:800,color:`var(--heading)`,margin:0},children:`AI Mock Interview Setup`}),(0,v.jsx)(`p`,{style:{fontSize:`0.85rem`,color:`var(--muted)`,margin:`4px 0 0 0`},children:`Configure your targeted role and company to launch an interactive simulation.`})]}),(0,v.jsx)(`div`,{style:{display:`flex`,alignItems:`center`,gap:`12px`},children:(0,v.jsxs)(`div`,{className:`privacy-badge-chip`,children:[(0,v.jsx)(c,{name:`shieldCheck`}),(0,v.jsx)(`span`,{children:`AI Ready`})]})})]}),b?(0,v.jsxs)(`div`,{className:`profile-toast`,children:[(0,v.jsx)(c,{name:`checkCircle`}),(0,v.jsx)(`span`,{children:b})]}):null,(0,v.jsx)(`div`,{className:`config-centered-main`,children:(0,v.jsxs)(`div`,{className:`interview-config-card`,children:[(0,v.jsx)(`h2`,{children:`Interview Configuration`}),(0,v.jsx)(`p`,{className:`config-subtitle`,children:`Set your preferences to start an AI-powered simulation.`}),(0,v.jsxs)(`form`,{onSubmit:F,className:`config-form`,children:[(0,v.jsxs)(`div`,{className:`config-form-grid`,children:[(0,v.jsxs)(`label`,{className:`config-field`,children:[(0,v.jsxs)(`div`,{className:`field-label-row`,children:[(0,v.jsx)(c,{name:`building`}),(0,v.jsx)(`span`,{children:`Target Company`})]}),(0,v.jsxs)(`select`,{value:o,onChange:e=>p(e.target.value),className:`config-select-input`,children:[(0,v.jsx)(`option`,{value:`Google`,children:`Google`}),(0,v.jsx)(`option`,{value:`Meta`,children:`Meta`}),(0,v.jsx)(`option`,{value:`Apple`,children:`Apple`}),(0,v.jsx)(`option`,{value:`Stripe`,children:`Stripe`}),(0,v.jsx)(`option`,{value:`Amazon`,children:`Amazon`}),(0,v.jsx)(`option`,{value:`Microsoft`,children:`Microsoft`})]})]}),(0,v.jsxs)(`label`,{className:`config-field`,children:[(0,v.jsxs)(`div`,{className:`field-label-row`,children:[(0,v.jsx)(c,{name:`user`}),(0,v.jsx)(`span`,{children:`Role`})]}),(0,v.jsxs)(`select`,{value:m,onChange:e=>h(e.target.value),className:`config-select-input`,children:[(0,v.jsx)(`option`,{value:`Product Manager`,children:`Product Manager`}),(0,v.jsx)(`option`,{value:`Software Engineer`,children:`Software Engineer`}),(0,v.jsx)(`option`,{value:`Full Stack Developer`,children:`Full Stack Developer`}),(0,v.jsx)(`option`,{value:`Data Scientist`,children:`Data Scientist`}),(0,v.jsx)(`option`,{value:`DevOps Engineer`,children:`DevOps Engineer`}),(0,v.jsx)(`option`,{value:`Cyber Security Analyst`,children:`Cyber Security Analyst`})]})]})]}),(0,v.jsxs)(`div`,{className:`difficulty-selection-box`,children:[(0,v.jsx)(`label`,{className:`field-label-row`,children:`Difficulty Level`}),(0,v.jsx)(`div`,{className:`difficulty-btn-group`,children:[`Entry`,`Mid-Level`,`Senior/Staff`].map(e=>(0,v.jsx)(`button`,{type:`button`,className:`difficulty-level-btn ${g===e?`difficulty-level-btn--active`:``}`,onClick:()=>y(e),children:e},e))})]}),(0,v.jsxs)(`button`,{type:`submit`,className:`start-session-btn`,disabled:t,children:[(0,v.jsx)(`span`,{children:t?`Initializing Session...`:`Start Interview Session`}),(0,v.jsx)(c,{name:`arrowRight`})]})]})]})}),(0,v.jsx)(f,{})]}),(0,v.jsx)(u,{})]});if(r===`session`){let e=x[S]||{},t=x.length;return(0,v.jsxs)(`div`,{className:`app-shell`,children:[(0,v.jsx)(l,{}),(0,v.jsxs)(`main`,{className:`main-content`,style:{padding:`1.5rem 1rem 5.5rem`,display:`flex`,flexDirection:`column`,gap:`24px`},children:[(0,v.jsxs)(`div`,{className:`session-header-bar`,children:[(0,v.jsxs)(`div`,{className:`session-header-info`,children:[(0,v.jsx)(`div`,{className:`session-subtitle-badge`,children:`INTERACTIVE AI MOCK INTERVIEW`}),(0,v.jsxs)(`h2`,{className:`session-header-title`,children:[(0,v.jsxs)(`span`,{children:[m,` @ `,o]}),(0,v.jsx)(`span`,{className:`session-difficulty-pill`,children:g})]})]}),(0,v.jsxs)(`div`,{className:`session-header-meta`,children:[(0,v.jsxs)(`div`,{className:`session-counter-badge`,children:[`Question `,S+1,` of `,t]}),(0,v.jsx)(`button`,{type:`button`,className:`session-exit-btn`,onClick:()=>i(`config`),children:`Exit Session`})]})]}),b?(0,v.jsxs)(`div`,{className:`profile-toast`,children:[(0,v.jsx)(c,{name:`checkCircle`}),(0,v.jsx)(`span`,{children:b})]}):null,(0,v.jsxs)(`div`,{className:`session-workspace-grid`,children:[(0,v.jsxs)(`div`,{style:{display:`flex`,flexDirection:`column`,gap:`20px`},children:[(0,v.jsxs)(`div`,{className:`session-question-card`,children:[(0,v.jsxs)(`div`,{className:`session-question-top`,children:[(0,v.jsx)(`span`,{className:`question-category-tag`,children:e.category||`General Interview Question`}),(0,v.jsxs)(`div`,{style:{display:`flex`,alignItems:`center`,gap:`8px`,flexWrap:`wrap`},children:[(0,v.jsxs)(`button`,{type:`button`,onClick:()=>M(e.question),style:{display:`inline-flex`,alignItems:`center`,gap:`6px`,padding:`6px 14px`,borderRadius:`8px`,border:D?`2px solid var(--primary)`:`1px solid var(--stroke)`,background:D?`var(--blue-soft)`:`var(--panel)`,color:D?`var(--primary)`:`var(--text)`,fontWeight:700,fontSize:`0.83rem`,cursor:`pointer`},children:[(0,v.jsx)(c,{name:`mic`}),(0,v.jsx)(`span`,{children:D?`🔊 Speaking Question...`:`🔊 Speak Question`})]}),D?(0,v.jsx)(`button`,{type:`button`,onClick:N,style:{padding:`6px 12px`,borderRadius:`8px`,border:`1px solid #fca5a5`,background:`#fef2f2`,color:`#ef4444`,fontWeight:700,fontSize:`0.83rem`,cursor:`pointer`},children:`Stop ⏹`}):null]})]}),(0,v.jsxs)(`h3`,{className:`session-question-text`,children:[`"`,e.question,`"`]}),e.hint?(0,v.jsx)(`div`,{style:{marginTop:`10px`},children:A[S]?(0,v.jsxs)(`div`,{style:{padding:`12px 16px`,borderRadius:`10px`,background:`#fffbeb`,border:`1px solid #fde68a`,color:`#92400e`,fontSize:`0.88rem`,lineHeight:1.5},children:[(0,v.jsx)(`strong`,{children:`💡 Interviewer Hint:`}),` `,e.hint,(0,v.jsx)(`span`,{style:{display:`block`,fontSize:`0.78rem`,color:`#b45309`,marginTop:`4px`,fontWeight:600},children:`⚠️ 0.5 point deduction applied to final evaluation score.`})]}):(0,v.jsxs)(`button`,{type:`button`,onClick:j,style:{display:`inline-flex`,alignItems:`center`,gap:`8px`,padding:`8px 16px`,borderRadius:`8px`,border:`1px solid #fcd34d`,background:`#fffbeb`,color:`#b45309`,fontSize:`0.85rem`,fontWeight:700,cursor:`pointer`,transition:`all 0.2s ease`},children:[(0,v.jsx)(c,{name:`spark`}),(0,v.jsx)(`span`,{children:`Show Interviewer Hint (-0.5 pts)`})]})}):null]}),(0,v.jsxs)(`div`,{className:`session-response-card`,children:[(0,v.jsxs)(`div`,{className:`session-response-header`,children:[(0,v.jsx)(`label`,{style:{fontSize:`0.95rem`,fontWeight:800,color:`var(--heading)`},children:`Your Response`}),(0,v.jsxs)(`button`,{type:`button`,onClick:P,style:{display:`inline-flex`,alignItems:`center`,gap:`8px`,padding:`8px 16px`,borderRadius:`20px`,border:O?`2px solid #ef4444`:`1px solid var(--stroke)`,background:O?`#fef2f2`:`var(--panel)`,color:O?`#ef4444`:`var(--text)`,fontWeight:700,fontSize:`0.85rem`,cursor:`pointer`},children:[(0,v.jsx)(c,{name:`mic`}),(0,v.jsx)(`span`,{children:O?`🔴 Listening... Click to Stop`:`🎤 Voice Input`})]})]}),(0,v.jsx)(`textarea`,{value:C,onChange:e=>w(e.target.value),placeholder:`Type your response here or click '🎤 Voice Input' to speak your answer...`,rows:6,className:`session-textarea`}),(0,v.jsxs)(`div`,{className:`session-response-footer`,children:[(0,v.jsx)(`span`,{style:{fontSize:`0.82rem`,color:`var(--muted)`,fontWeight:600},children:C.trim()?`${C.trim().split(/\s+/).length} words`:`0 words`}),(0,v.jsx)(`button`,{type:`button`,onClick:I,disabled:E,style:{padding:`12px 24px`,borderRadius:`10px`,border:`none`,background:`var(--primary)`,color:`#ffffff`,fontWeight:700,fontSize:`0.92rem`,cursor:`pointer`,display:`inline-flex`,alignItems:`center`,justifyContent:`center`,gap:`8px`,opacity:E?.7:1,boxShadow:`var(--shadow-button)`},children:E?(0,v.jsx)(`span`,{children:`Evaluating Session...`}):S<t-1?(0,v.jsxs)(v.Fragment,{children:[(0,v.jsx)(`span`,{children:`Submit Answer & Next Question`}),(0,v.jsx)(c,{name:`arrowRight`})]}):(0,v.jsxs)(v.Fragment,{children:[(0,v.jsx)(`span`,{children:`Finish & Evaluate Interview`}),(0,v.jsx)(c,{name:`spark`})]})})]})]})]}),(0,v.jsxs)(`div`,{className:`session-transcript-card`,children:[(0,v.jsxs)(`div`,{className:`session-transcript-header`,children:[(0,v.jsx)(`h4`,{children:`Session Transcript`}),(0,v.jsxs)(`span`,{style:{fontSize:`0.78rem`,background:`var(--bg-secondary)`,color:`var(--muted)`,padding:`2px 8px`,borderRadius:`10px`,fontWeight:700},children:[T.length,` / `,t]})]}),(0,v.jsxs)(`div`,{className:`session-transcript-list`,children:[T.map((e,t)=>(0,v.jsxs)(`div`,{className:`session-transcript-item`,children:[(0,v.jsxs)(`div`,{style:{fontSize:`0.78rem`,fontWeight:700,color:`var(--primary)`,marginBottom:`4px`},children:[`Q`,t+1,`: `,e.category]}),(0,v.jsx)(`div`,{style:{fontSize:`0.83rem`,fontWeight:700,color:`var(--heading)`,marginBottom:`4px`},children:e.question}),(0,v.jsxs)(`div`,{style:{fontSize:`0.8rem`,color:`var(--muted)`,fontStyle:`italic`,display:`-webkit-box`,WebkitLineClamp:2,WebkitBoxOrient:`vertical`,overflow:`hidden`},children:[`"`,e.answer,`"`]})]},t)),T.length===0?(0,v.jsx)(`p`,{style:{fontSize:`0.85rem`,color:`var(--muted)`,fontStyle:`italic`,textAlign:`center`,margin:`24px 0`},children:`Your answered questions will log here as you progress.`}):null]})]})]}),(0,v.jsx)(f,{})]}),(0,v.jsx)(u,{})]})}if(t)return(0,v.jsxs)(`div`,{className:`app-shell`,children:[(0,v.jsx)(l,{}),(0,v.jsx)(`main`,{className:`main-content`,style:{padding:`40px 20px 5.5rem`,textAlign:`center`,color:`var(--muted)`},children:`Loading your interview report...`}),(0,v.jsx)(u,{})]});if(!n)return(0,v.jsxs)(`div`,{className:`app-shell`,children:[(0,v.jsx)(l,{}),(0,v.jsxs)(`main`,{className:`main-content main-content--interview-report`,style:{padding:`40px 24px 5.5rem`,display:`flex`,flexDirection:`column`,alignItems:`center`,justifyContent:`center`,minHeight:`80vh`,textAlign:`center`},children:[(0,v.jsx)(`div`,{style:{background:`var(--blue-soft)`,color:`var(--primary)`,width:`64px`,height:`64px`,borderRadius:`50%`,display:`grid`,placeItems:`center`,marginBottom:`20px`},children:(0,v.jsx)(c,{name:`chat`})}),(0,v.jsx)(`h2`,{style:{fontSize:`1.5rem`,fontWeight:800,color:`var(--heading)`,margin:`0 0 8px 0`},children:`No Interview Report Available`}),(0,v.jsx)(`p`,{style:{fontSize:`0.95rem`,color:`var(--muted)`,maxWidth:`420px`,margin:`0 0 24px 0`,lineHeight:1.5},children:`Complete a mock interview to generate your personalized report.`}),(0,v.jsxs)(`button`,{type:`button`,className:`primary-button`,onClick:()=>i(`config`),style:{padding:`12px 24px`,borderRadius:`8px`,border:`none`,background:`var(--primary)`,color:`#ffffff`,fontWeight:700,fontSize:`0.95rem`,cursor:`pointer`,display:`inline-flex`,alignItems:`center`,gap:`8px`},children:[(0,v.jsx)(c,{name:`spark`}),(0,v.jsx)(`span`,{children:`Start Mock Interview`})]})]}),(0,v.jsx)(u,{})]});let B=n.score??0,V=n.skillsRadar||{Technical:0,Communication:0,Grammar:0,Behavioral:0,Confidence:0},H=n.strengths||[],U=n.improvements||[],W=n.nextSteps||[];return(0,v.jsxs)(`div`,{className:`app-shell`,children:[(0,v.jsx)(d,{}),(0,v.jsx)(l,{}),(0,v.jsxs)(`main`,{className:`main-content main-content--interview-report`,children:[(0,v.jsxs)(`div`,{className:`report-header-section`,children:[(0,v.jsxs)(`div`,{children:[(0,v.jsxs)(`div`,{className:`report-breadcrumb`,children:[(0,v.jsx)(`span`,{style:{cursor:`pointer`,color:`var(--primary)`,fontWeight:600},onClick:R,children:`← Mock Interviews Setup`}),(0,v.jsx)(c,{name:`chevronRight`}),(0,v.jsx)(`span`,{className:`breadcrumb-active`,children:`Interview Report`})]}),(0,v.jsx)(`h1`,{className:`report-page-title`,children:`Post-Interview Analysis`})]}),(0,v.jsxs)(`div`,{className:`report-header-actions`,children:[(0,v.jsxs)(`button`,{type:`button`,className:`ghost-button`,onClick:z,children:[(0,v.jsx)(c,{name:`download`}),(0,v.jsx)(`span`,{children:`Download PDF`})]}),(0,v.jsxs)(`button`,{type:`button`,className:`primary-button`,onClick:R,children:[(0,v.jsx)(c,{name:`refresh`}),(0,v.jsx)(`span`,{children:`Retake Interview`})]})]})]}),b?(0,v.jsxs)(`div`,{className:`profile-toast`,children:[(0,v.jsx)(c,{name:`checkCircle`}),(0,v.jsx)(`span`,{children:b})]}):null,(0,v.jsxs)(`div`,{className:`report-top-grid`,children:[(0,v.jsxs)(`div`,{className:`report-score-card`,children:[(0,v.jsxs)(`div`,{className:`score-circle-outer`,children:[(0,v.jsxs)(`svg`,{viewBox:`0 0 36 36`,className:`score-gauge-svg`,children:[(0,v.jsx)(`path`,{className:`score-gauge-bg`,d:`M18 2.0845 a 15.9155 15.9155 0 0 1 0 31.831 a 15.9155 15.9155 0 0 1 0 -31.831`}),(0,v.jsx)(`path`,{className:`score-gauge-fill`,strokeDasharray:`${Math.round(B*10)}, 100`,d:`M18 2.0845 a 15.9155 15.9155 0 0 1 0 31.831 a 15.9155 15.9155 0 0 1 0 -31.831`})]}),(0,v.jsxs)(`div`,{className:`score-center-text`,children:[(0,v.jsx)(`strong`,{className:`score-value`,children:B}),(0,v.jsx)(`span`,{className:`score-max`,children:`OUT OF 10`})]}),(0,v.jsx)(`div`,{className:`gold-medal-badge`,title:`Top Performer`,children:(0,v.jsx)(c,{name:`trophy`})})]}),(0,v.jsx)(`h3`,{className:`score-headline`,children:n.headline||`Excellent Performance!`}),(0,v.jsx)(`p`,{className:`score-percentile-desc`,children:n.percentileText||`Top performance candidate for ${m} roles.`}),n.hintsUsedCount>0?(0,v.jsxs)(`div`,{style:{marginTop:`12px`,display:`inline-flex`,alignItems:`center`,gap:`6px`,background:`var(--amber-soft)`,border:`1px solid var(--amber)`,color:`var(--amber)`,padding:`6px 14px`,borderRadius:`20px`,fontSize:`0.8rem`,fontWeight:700},children:[(0,v.jsx)(c,{name:`spark`}),(0,v.jsxs)(`span`,{children:[n.hintsUsedCount,` Hint(s) Used (-`,n.scoreDeduction||n.hintsUsedCount*.5,` pts deduction)`]})]}):null]}),(0,v.jsxs)(`div`,{className:`report-radar-card`,children:[(0,v.jsxs)(`div`,{className:`radar-header`,children:[(0,v.jsxs)(`div`,{children:[(0,v.jsx)(`h3`,{children:`Skill Distribution`}),(0,v.jsx)(`p`,{children:`Detailed breakdown of your interview core competencies.`})]}),(0,v.jsxs)(`div`,{className:`radar-legend`,children:[(0,v.jsxs)(`span`,{className:`legend-item`,children:[(0,v.jsx)(`span`,{className:`legend-dot legend-dot--actual`}),` Actual`]}),(0,v.jsxs)(`span`,{className:`legend-item`,children:[(0,v.jsx)(`span`,{className:`legend-dot legend-dot--target`}),` Target`]})]})]}),(0,v.jsx)(`div`,{className:`radar-chart-container`,children:(0,v.jsxs)(`svg`,{viewBox:`0 0 500 240`,className:`radar-svg`,children:[(0,v.jsx)(`polygon`,{points:`250,50 326,105 297,195 203,195 174,105`,fill:`none`,stroke:`var(--stroke)`,strokeWidth:`1`}),(0,v.jsx)(`polygon`,{points:`250,75 302,113 282,175 218,175 198,113`,fill:`none`,stroke:`var(--bg-secondary)`,strokeWidth:`1`}),(0,v.jsx)(`polygon`,{points:`250,100 279,121 268,154 232,154 221,121`,fill:`none`,stroke:`var(--panel)`,strokeWidth:`1`}),(0,v.jsx)(`line`,{x1:`250`,y1:`130`,x2:`250`,y2:`50`,stroke:`var(--stroke)`,strokeWidth:`1`}),(0,v.jsx)(`line`,{x1:`250`,y1:`130`,x2:`326`,y2:`105`,stroke:`var(--stroke)`,strokeWidth:`1`}),(0,v.jsx)(`line`,{x1:`250`,y1:`130`,x2:`297`,y2:`195`,stroke:`var(--stroke)`,strokeWidth:`1`}),(0,v.jsx)(`line`,{x1:`250`,y1:`130`,x2:`203`,y2:`195`,stroke:`var(--stroke)`,strokeWidth:`1`}),(0,v.jsx)(`line`,{x1:`250`,y1:`130`,x2:`174`,y2:`105`,stroke:`var(--stroke)`,strokeWidth:`1`}),(0,v.jsx)(`polygon`,{points:`250,60 317,108 291,187 209,187 183,108`,fill:`rgba(203, 213, 225, 0.2)`,stroke:`var(--stroke)`,strokeWidth:`2`,strokeDasharray:`3 3`}),(0,v.jsx)(`polygon`,{points:`250,${130-(V.Technical||80)*.8} ${250+(V.Communication||80)*.76},${130-(V.Communication||80)*.25} ${250+(V.Grammar||80)*.47},${130+(V.Grammar||80)*.65} ${250-(V.Behavioral||80)*.47},${130+(V.Behavioral||80)*.65} ${250-(V.Confidence||80)*.76},${130-(V.Confidence||80)*.25}`,fill:`rgba(37, 99, 235, 0.15)`,stroke:`var(--primary)`,strokeWidth:`3`}),(0,v.jsxs)(`text`,{x:`250`,y:`32`,textAnchor:`middle`,className:`radar-label`,children:[`Technical (`,V.Technical||85,`%)`]}),(0,v.jsxs)(`text`,{x:`338`,y:`108`,textAnchor:`start`,className:`radar-label`,children:[`Communication (`,V.Communication||90,`%)`]}),(0,v.jsxs)(`text`,{x:`302`,y:`215`,textAnchor:`middle`,className:`radar-label`,children:[`Grammar (`,V.Grammar||88,`%)`]}),(0,v.jsxs)(`text`,{x:`198`,y:`215`,textAnchor:`middle`,className:`radar-label`,children:[`Behavioral (`,V.Behavioral||82,`%)`]}),(0,v.jsxs)(`text`,{x:`162`,y:`108`,textAnchor:`end`,className:`radar-label`,children:[`Confidence (`,V.Confidence||92,`%)`]})]})})]})]}),(0,v.jsxs)(`div`,{className:`report-middle-grid`,children:[(0,v.jsxs)(`div`,{className:`feedback-card feedback-card--strengths`,children:[(0,v.jsxs)(`div`,{className:`feedback-card-header`,children:[(0,v.jsx)(`div`,{className:`feedback-icon-badge feedback-icon-badge--green`,children:(0,v.jsx)(c,{name:`checkCircle`})}),(0,v.jsx)(`h3`,{children:`Key Strengths`})]}),(0,v.jsx)(`div`,{className:`feedback-list`,children:H.map((e,t)=>(0,v.jsxs)(`div`,{className:`feedback-bullet`,children:[(0,v.jsx)(`div`,{className:`bullet-check-icon`,children:(0,v.jsx)(c,{name:`check`})}),(0,v.jsxs)(`div`,{children:[(0,v.jsx)(`strong`,{children:e.title}),(0,v.jsx)(`p`,{children:e.desc})]})]},t))})]}),(0,v.jsxs)(`div`,{className:`feedback-card feedback-card--improvements`,children:[(0,v.jsxs)(`div`,{className:`feedback-card-header`,children:[(0,v.jsx)(`div`,{className:`feedback-icon-badge feedback-icon-badge--amber`,children:(0,v.jsx)(c,{name:`alertCircle`})}),(0,v.jsx)(`h3`,{children:`Areas for Improvement`})]}),(0,v.jsx)(`div`,{className:`improvement-boxes-list`,children:U.map((e,t)=>(0,v.jsxs)(`div`,{className:`improvement-box`,children:[(0,v.jsx)(`strong`,{children:e.title}),(0,v.jsx)(`p`,{children:e.desc})]},t))})]})]}),(0,v.jsxs)(`div`,{className:`report-next-steps-section`,children:[(0,v.jsxs)(`div`,{className:`next-steps-header`,children:[(0,v.jsx)(`h3`,{children:`Next Steps for Mastery`}),(0,v.jsx)(s,{path:`/roadmap?role=${encodeURIComponent(n.role||m||``)}&company=${encodeURIComponent(n.targetCompany||o||``)}`,className:`view-roadmap-link`,children:(0,v.jsx)(`span`,{children:`View Practice Roadmap`})})]}),(0,v.jsx)(`div`,{className:`next-steps-grid`,children:W.map((e,t)=>(0,v.jsxs)(`div`,{className:`practice-q-card`,children:[(0,v.jsx)(`div`,{className:`q-card-icon-badge`,children:(0,v.jsx)(c,{name:`chat`})}),(0,v.jsx)(`h5`,{children:e.title}),(0,v.jsxs)(`p`,{children:[`"`,e.text,`"`]})]},t))})]}),(0,v.jsx)(f,{})]}),(0,v.jsx)(u,{})]})}export{y as default};