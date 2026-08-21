import { useState } from 'react';
import { useAuth } from '../../context/AuthContext.jsx';
import { useResume } from '../../hooks/useResume.js';
import { Icon } from '../../components/Icon.jsx';
import { SidebarShell } from '../../components/Layout/Sidebar.jsx';
import { MobileTopBar } from '../../components/Layout/AppShell.jsx';
import { MobileNav } from '../../components/Layout/MobileNav.jsx';

export default function ResumePage() {
  const { user } = useAuth();
  const {
    loading,
    isBuilding,
    isSaving,
    isEditMode,
    setIsEditMode,
    selectedRole,
    setSelectedRole,
    availableRoles,
    showNewRoleModal,
    setShowNewRoleModal,
    newRoleInput,
    setNewRoleInput,
    handleSelectRole,
    handleCreateNewRole,
    toast,
    lastSaved,
    contact,
    setContact,
    summary,
    setSummary,
    experience,
    setExperience,
    education,
    setEducation,
    projects,
    setProjects,
    skills,
    setSkills,
    certifications,
    setCertifications,
    achievements,
    setAchievements,
    languages,
    setLanguages,
    interests,
    setInterests,
    customSections,
    setCustomSections,
    atsScore,
    skillMatchScore,
    completenessScore,
    missingSkills,
    missingSections,
    suggestions,
    versionHistory,
    saveResumeToDb,
    handleSaveAll,
    handleBuildResumeWithAI,
    handleAddRecommendedSkill,
    handleAddMissingSection,
    handleDismissSuggestion,
    handleApplySuggestion,
    handleRestoreVersion,
    handleDownloadPdf,
  } = useResume(user);

  // Local temporary states for modal/edit forms
  const [newSkillInput, setNewSkillInput] = useState('');
  const [newExp, setNewExp] = useState({ role: '', company: '', period: '', location: '', description: '', bulletPoints: '' });
  const [newEdu, setNewEdu] = useState({ degree: '', institution: '', period: '', description: '' });
  const [newProj, setNewProj] = useState({ title: '', description: '', link: '', techStack: '' });
  const [newCert, setNewCert] = useState({ name: '', issuer: '', year: '' });
  const [newAch, setNewAch] = useState('');
  const [newLang, setNewLang] = useState('');

  // Handlers for inline item edits
  const handleUpdateExperienceItem = (id, field, value) => {
    const updated = experience.map((exp) => {
      if (exp.id === id || exp.company === id) {
        if (field === 'bulletPoints') {
          const bullets = typeof value === 'string' ? value.split('\n') : value;
          return { ...exp, bulletPoints: bullets };
        }
        return { ...exp, [field]: value };
      }
      return exp;
    });
    setExperience(updated);
  };

  const handleUpdateEducationItem = (id, field, value) => {
    const updated = education.map((edu) => {
      if (edu.id === id || edu.degree === id) {
        return { ...edu, [field]: value };
      }
      return edu;
    });
    setEducation(updated);
  };

  const handleUpdateProjectItem = (id, field, value) => {
    const updated = projects.map((proj) => {
      if (proj.id === id || proj.title === id) {
        if (field === 'techStack') {
          const stack = typeof value === 'string' ? value.split(',').map((s) => s.trim()) : value;
          return { ...proj, techStack: stack };
        }
        return { ...proj, [field]: value };
      }
      return proj;
    });
    setProjects(updated);
  };

  // Handlers for inline edits
  const handleContactChange = (field, value) => {
    const updated = { ...contact, [field]: value };
    setContact(updated);
    saveResumeToDb({ contact: updated });
  };

  const handleAddExperienceItem = (e) => {
    e.preventDefault();
    if (!newExp.role || !newExp.company) return;
    const bullets = newExp.bulletPoints
      ? newExp.bulletPoints.split('\n').filter((b) => b.trim())
      : [newExp.description].filter(Boolean);

    const item = {
      id: `exp_${Date.now()}`,
      role: newExp.role,
      company: newExp.company,
      period: newExp.period || 'Present',
      location: newExp.location || '',
      description: newExp.description,
      bulletPoints: bullets,
    };
    const updated = [...experience, item];
    setExperience(updated);
    setNewExp({ role: '', company: '', period: '', location: '', description: '', bulletPoints: '' });
    saveResumeToDb({ experience: updated });
  };

  const handleRemoveExperienceItem = (id) => {
    const updated = experience.filter((e) => e.id !== id);
    setExperience(updated);
    saveResumeToDb({ experience: updated });
  };

  const handleAddEducationItem = (e) => {
    e.preventDefault();
    if (!newEdu.degree || !newEdu.institution) return;
    const item = {
      id: `edu_${Date.now()}`,
      degree: newEdu.degree,
      institution: newEdu.institution,
      period: newEdu.period || '',
      description: newEdu.description || '',
    };
    const updated = [...education, item];
    setEducation(updated);
    setNewEdu({ degree: '', institution: '', period: '', description: '' });
    saveResumeToDb({ education: updated });
  };

  const handleRemoveEducationItem = (id) => {
    const updated = education.filter((e) => e.id !== id);
    setEducation(updated);
    saveResumeToDb({ education: updated });
  };

  const handleAddProjectItem = (e) => {
    e.preventDefault();
    if (!newProj.title) return;
    const item = {
      id: `proj_${Date.now()}`,
      title: newProj.title,
      description: newProj.description,
      link: newProj.link,
      techStack: newProj.techStack ? newProj.techStack.split(',').map((s) => s.trim()) : [],
    };
    const updated = [...projects, item];
    setProjects(updated);
    setNewProj({ title: '', description: '', link: '', techStack: '' });
    saveResumeToDb({ projects: updated });
  };

  const handleRemoveProjectItem = (id) => {
    const updated = projects.filter((p) => p.id !== id);
    setProjects(updated);
    saveResumeToDb({ projects: updated });
  };

  const handleAddCustomSkill = (e) => {
    e.preventDefault();
    if (!newSkillInput.trim()) return;
    const val = newSkillInput.trim();
    if (!skills.includes(val)) {
      const updated = [...skills, val];
      setSkills(updated);
      saveResumeToDb({ skills: updated });
    }
    setNewSkillInput('');
  };

  const handleRemoveSkill = (skillToRemove) => {
    const updated = skills.filter((s) => s !== skillToRemove);
    setSkills(updated);
    saveResumeToDb({ skills: updated });
  };

  const handleAddCertificationItem = (e) => {
    e.preventDefault();
    if (!newCert.name) return;
    const item = { id: `cert_${Date.now()}`, name: newCert.name, issuer: newCert.issuer, year: newCert.year };
    const updated = [...certifications, item];
    setCertifications(updated);
    setNewCert({ name: '', issuer: '', year: '' });
    saveResumeToDb({ certifications: updated });
  };

  const handleRemoveCertificationItem = (id) => {
    const updated = certifications.filter((c) => c.id !== id);
    setCertifications(updated);
    saveResumeToDb({ certifications: updated });
  };

  const handleAddAchievementItem = (e) => {
    e.preventDefault();
    if (!newAch.trim()) return;
    const updated = [...achievements, newAch.trim()];
    setAchievements(updated);
    setNewAch('');
    saveResumeToDb({ achievements: updated });
  };

  const handleRemoveAchievementItem = (index) => {
    const updated = achievements.filter((_, i) => i !== index);
    setAchievements(updated);
    saveResumeToDb({ achievements: updated });
  };

  const handleAddLanguageItem = (e) => {
    e.preventDefault();
    if (!newLang.trim()) return;
    const updated = [...languages, newLang.trim()];
    setLanguages(updated);
    setNewLang('');
    saveResumeToDb({ languages: updated });
  };

  const handleRemoveLanguageItem = (index) => {
    const updated = languages.filter((_, i) => i !== index);
    setLanguages(updated);
    saveResumeToDb({ languages: updated });
  };

  return (
    <div className="app-shell">
      <MobileTopBar />
      <SidebarShell />

      <main className="main-content--resume">
        {/* TOP RESUME BAR */}
        <div className="resume-top-nav">
          <div className="resume-top-header-block">
            <h1 className="resume-title-heading">AI Resume Builder</h1>
            <div className="sync-badge-wrap">
              {isSaving ? (
                <span className="sync-badge sync-badge--saving">Saving changes...</span>
              ) : lastSaved ? (
                <span className="sync-badge sync-badge--synced">Synced • Last saved at {lastSaved}</span>
              ) : (
                <span className="sync-badge">Auto-Save Active</span>
              )}
            </div>
          </div>

          <div className="resume-role-selector-wrap">
            <span className="resume-role-label">Target Role</span>
            <select
              value={selectedRole}
              onChange={(e) => handleSelectRole(e.target.value)}
              className="resume-version-dropdown-btn"
              aria-label="Select Target Role Resume"
            >
              <optgroup label="Saved Target Role Resumes">
                {availableRoles.map((r) => (
                  <option key={r} value={r}>
                    {r} {contact.title === r ? '(Active)' : ''}
                  </option>
                ))}
              </optgroup>
              <option value="CREATE_NEW_ROLE">+ Create Resume for New Role...</option>
            </select>
          </div>

          <div className="resume-top-actions">
            <button
              type="button"
              className="btn-outline-secondary"
              onClick={() => {
                if (isEditMode) {
                  handleSaveAll();
                }
                setIsEditMode(!isEditMode);
              }}
              disabled={isSaving}
            >
              <Icon name={isEditMode ? "check" : "edit"} />
              <span>{isSaving ? 'Saving...' : isEditMode ? 'Finish & Save' : 'Edit Resume'}</span>
            </button>

            <button type="button" className="btn-outline-secondary" onClick={handleDownloadPdf}>
              <Icon name="download" />
              <span>Download PDF</span>
            </button>

            <button
              type="button"
              className="btn-primary-spark"
              onClick={handleBuildResumeWithAI}
              disabled={isBuilding}
              title="Generate full ATS-friendly resume from your profile with Gemini AI"
            >
              <Icon name="spark" />
              <span>{isBuilding ? 'Building...' : 'Build Resume with AI'}</span>
            </button>
          </div>
        </div>

        {/* TOAST NOTIFICATION */}
        {toast && (
          <div
            style={{
              background: toast.type === 'error' ? '#fef2f2' : toast.type === 'info' ? '#eff6ff' : '#f0fdf4',
              borderLeft: `4px solid ${toast.type === 'error' ? '#ef4444' : toast.type === 'info' ? '#3b82f6' : '#22c55e'}`,
              color: toast.type === 'error' ? '#991b1b' : toast.type === 'info' ? '#1e40af' : '#166534',
              padding: '12px 16px',
              borderRadius: '8px',
              marginBottom: '1.25rem',
              fontWeight: 600,
              fontSize: '0.9rem',
              display: 'flex',
              alignItems: 'center',
              justifyContent: 'space-between',
              boxShadow: '0 2px 8px rgba(0,0,0,0.05)',
            }}
          >
            <span>{toast.message}</span>
            {isBuilding && <span className="spinner-border spinner-border-sm" role="status" aria-hidden="true" />}
          </div>
        )}

        {/* RESUME WORKSPACE GRID */}
        <div className="resume-grid-container">
          {/* CENTER DOCUMENT STAGE */}
          <div className="resume-paper-wrapper" id="resume-document-stage">
            {loading ? (
              <div style={{ padding: '3rem', textAlign: 'center', color: '#64748b' }}>
                <p>Loading resume data...</p>
              </div>
            ) : (
              <>
                {/* CANDIDATE HEADER */}
                {isEditMode ? (
                  <div style={{ background: '#f8fafc', padding: '1.25rem', borderRadius: '10px', border: '1px solid #cbd5e1', marginBottom: '1.5rem' }}>
                    <h3 style={{ margin: '0 0 1rem 0', fontSize: '1rem', color: '#1e293b' }}>Edit Contact Details</h3>
                    <div className="resume-contact-edit-grid">
                      <input
                        type="text"
                        value={contact.name}
                        onChange={(e) => handleContactChange('name', e.target.value)}
                        placeholder="Full Name"
                        style={{ padding: '8px 12px', borderRadius: '6px', border: '1px solid #cbd5e1', fontSize: '0.95rem' }}
                      />
                      <input
                        type="text"
                        value={contact.title}
                        onChange={(e) => handleContactChange('title', e.target.value)}
                        placeholder="Professional Title"
                        style={{ padding: '8px 12px', borderRadius: '6px', border: '1px solid #cbd5e1', fontSize: '0.95rem' }}
                      />
                      <input
                        type="text"
                        value={contact.email}
                        onChange={(e) => handleContactChange('email', e.target.value)}
                        placeholder="Email Address"
                        style={{ padding: '8px 12px', borderRadius: '6px', border: '1px solid #cbd5e1', fontSize: '0.95rem' }}
                      />
                      <input
                        type="text"
                        value={contact.phone}
                        onChange={(e) => handleContactChange('phone', e.target.value)}
                        placeholder="Phone Number"
                        style={{ padding: '8px 12px', borderRadius: '6px', border: '1px solid #cbd5e1', fontSize: '0.95rem' }}
                      />
                      <input
                        type="text"
                        value={contact.location}
                        onChange={(e) => handleContactChange('location', e.target.value)}
                        placeholder="City, State / Location"
                        style={{ padding: '8px 12px', borderRadius: '6px', border: '1px solid #cbd5e1', fontSize: '0.95rem' }}
                      />
                      <input
                        type="text"
                        value={contact.linkedin}
                        onChange={(e) => handleContactChange('linkedin', e.target.value)}
                        placeholder="LinkedIn Profile URL"
                        style={{ padding: '8px 12px', borderRadius: '6px', border: '1px solid #cbd5e1', fontSize: '0.95rem' }}
                      />
                      <input
                        type="text"
                        value={contact.github}
                        onChange={(e) => handleContactChange('github', e.target.value)}
                        placeholder="GitHub Profile URL"
                        style={{ padding: '8px 12px', borderRadius: '6px', border: '1px solid #cbd5e1', fontSize: '0.95rem' }}
                      />
                      <input
                        type="text"
                        value={contact.portfolio}
                        onChange={(e) => handleContactChange('portfolio', e.target.value)}
                        placeholder="Portfolio Website"
                        style={{ padding: '8px 12px', borderRadius: '6px', border: '1px solid #cbd5e1', fontSize: '0.95rem' }}
                      />
                    </div>
                  </div>
                ) : (
                  <>
                    <h2 className="resume-candidate-name">{contact.name || user?.name || 'Candidate Name'}</h2>
                    <p className="resume-candidate-role">{contact.title || user?.title || 'Professional Title'}</p>

                    <div className="resume-contact-row">
                      {contact.email && (
                        <span className="resume-contact-item">
                          <Icon name="mail" />
                          <span>{contact.email}</span>
                        </span>
                      )}
                      {contact.phone && (
                        <span className="resume-contact-item">
                          <Icon name="phone" />
                          <span>{contact.phone}</span>
                        </span>
                      )}
                      {contact.location && (
                        <span className="resume-contact-item">
                          <Icon name="mapPin" />
                          <span>{contact.location}</span>
                        </span>
                      )}
                      {contact.linkedin && (
                        <span className="resume-contact-item">
                          <Icon name="globe" />
                          <span>{contact.linkedin}</span>
                        </span>
                      )}
                      {contact.github && (
                        <span className="resume-contact-item">
                          <Icon name="code" />
                          <span>{contact.github}</span>
                        </span>
                      )}
                    </div>
                  </>
                )}

                <hr className="resume-header-line" />

                {/* PROFESSIONAL SUMMARY */}
                <div className="resume-section-heading">PROFESSIONAL SUMMARY</div>
                {isEditMode ? (
                  <textarea
                    value={summary}
                    onChange={(e) => setSummary(e.target.value)}
                    onBlur={() => saveResumeToDb({ summary })}
                    placeholder="Write a concise professional summary highlighting key expertise and achievements..."
                    rows="3"
                    style={{
                      width: '100%',
                      padding: '10px 12px',
                      borderRadius: '8px',
                      border: '1px solid #cbd5e1',
                      fontSize: '0.92rem',
                      fontFamily: 'inherit',
                      marginBottom: '1.25rem',
                    }}
                  />
                ) : (
                  <p style={{ fontSize: '0.92rem', lineHeight: 1.6, color: '#334155', marginBottom: '1.5rem' }}>
                    {summary || 'Click "Build Resume with AI" or "Edit Resume" to add a professional summary.'}
                  </p>
                )}

                {/* EXPERIENCE SECTION */}
                <div className="resume-section-heading">PROFESSIONAL EXPERIENCE</div>
                {experience.length === 0 ? (
                  <p style={{ fontSize: '0.88rem', color: '#94a3b8', fontStyle: 'italic', marginBottom: '1.5rem' }}>
                    No experience records added yet.
                  </p>
                ) : (
                  experience.map((item) => (
                    <div key={item.id || item.company} className="resume-job-item">
                      {isEditMode ? (
                        <div style={{ background: '#f8fafc', padding: '1rem', borderRadius: '8px', border: '1px solid #cbd5e1', marginBottom: '1rem' }}>
                          <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '8px', marginBottom: '8px' }}>
                            <input
                              type="text"
                              value={item.role}
                              onChange={(e) => handleUpdateExperienceItem(item.id, 'role', e.target.value)}
                              placeholder="Role Title"
                              style={{ padding: '6px', fontSize: '0.88rem', fontWeight: 600 }}
                            />
                            <input
                              type="text"
                              value={item.company}
                              onChange={(e) => handleUpdateExperienceItem(item.id, 'company', e.target.value)}
                              placeholder="Company Name"
                              style={{ padding: '6px', fontSize: '0.88rem', fontWeight: 600 }}
                            />
                            <input
                              type="text"
                              value={item.period}
                              onChange={(e) => handleUpdateExperienceItem(item.id, 'period', e.target.value)}
                              placeholder="Period (e.g. 2022 — Present)"
                              style={{ padding: '6px', fontSize: '0.85rem' }}
                            />
                            <input
                              type="text"
                              value={item.location}
                              onChange={(e) => handleUpdateExperienceItem(item.id, 'location', e.target.value)}
                              placeholder="Location"
                              style={{ padding: '6px', fontSize: '0.85rem' }}
                            />
                          </div>
                          <textarea
                            value={Array.isArray(item.bulletPoints) ? item.bulletPoints.join('\n') : (item.description || '')}
                            onChange={(e) => handleUpdateExperienceItem(item.id, 'bulletPoints', e.target.value)}
                            placeholder="Bullet points (one per line)"
                            rows="3"
                            style={{ width: '100%', padding: '6px', fontSize: '0.85rem', marginBottom: '6px' }}
                          />
                          <button
                            type="button"
                            onClick={() => handleRemoveExperienceItem(item.id)}
                            style={{ background: 'none', border: 'none', color: '#ef4444', fontSize: '0.8rem', cursor: 'pointer' }}
                          >
                            ✕ Remove Experience
                          </button>
                        </div>
                      ) : (
                        <>
                          <div className="resume-job-row">
                            <span className="resume-company-name">
                              {item.role} • {item.company}
                            </span>
                            <span className="resume-job-date">
                              {item.period} {item.location ? `| ${item.location}` : ''}
                            </span>
                          </div>

                          {item.bulletPoints && item.bulletPoints.length > 0 ? (
                            <ul className="resume-bullet-points">
                              {item.bulletPoints.map((bp, i) => (
                                <li key={i}>{bp}</li>
                              ))}
                            </ul>
                          ) : (
                            <p style={{ fontSize: '0.9rem', color: '#475569', margin: '0.3rem 0' }}>{item.description}</p>
                          )}
                        </>
                      )}
                    </div>
                  ))
                )}

                {isEditMode && (
                  <form onSubmit={handleAddExperienceItem} style={{ background: '#f1f5f9', padding: '1rem', borderRadius: '8px', marginBottom: '1.5rem' }}>
                    <h4 style={{ margin: '0 0 0.5rem 0', fontSize: '0.88rem', color: '#334155' }}>+ Add Experience Entry</h4>
                    <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '8px', marginBottom: '8px' }}>
                      <input type="text" placeholder="Role Title *" value={newExp.role} onChange={(e) => setNewExp({ ...newExp, role: e.target.value })} style={{ padding: '6px', fontSize: '0.85rem' }} />
                      <input type="text" placeholder="Company Name *" value={newExp.company} onChange={(e) => setNewExp({ ...newExp, company: e.target.value })} style={{ padding: '6px', fontSize: '0.85rem' }} />
                      <input type="text" placeholder="Period (e.g. 2022 — Present)" value={newExp.period} onChange={(e) => setNewExp({ ...newExp, period: e.target.value })} style={{ padding: '6px', fontSize: '0.85rem' }} />
                      <input type="text" placeholder="Location (e.g. San Francisco, CA)" value={newExp.location} onChange={(e) => setNewExp({ ...newExp, location: e.target.value })} style={{ padding: '6px', fontSize: '0.85rem' }} />
                    </div>
                    <textarea placeholder="Bullet points (one per line using action verbs and metrics)" rows="3" value={newExp.bulletPoints} onChange={(e) => setNewExp({ ...newExp, bulletPoints: e.target.value })} style={{ width: '100%', padding: '6px', fontSize: '0.85rem', marginBottom: '8px' }} />
                    <button type="submit" className="btn-outline-secondary" style={{ fontSize: '0.8rem', padding: '4px 12px' }}>Add Experience</button>
                  </form>
                )}

                {/* EDUCATION SECTION */}
                <div className="resume-section-heading">EDUCATION</div>
                {education.length === 0 ? (
                  <p style={{ fontSize: '0.88rem', color: '#94a3b8', fontStyle: 'italic', marginBottom: '1.5rem' }}>
                    No education records added yet.
                  </p>
                ) : (
                  education.map((edu) => (
                    <div key={edu.id || edu.degree} className="resume-job-item">
                      <div className="resume-job-row">
                        <span className="resume-edu-school">{edu.degree}</span>
                        <span className="resume-job-date">{edu.period}</span>
                      </div>
                      <p style={{ fontSize: '0.88rem', color: '#475569', margin: '0.2rem 0' }}>{edu.institution}</p>
                      {edu.description && <p style={{ fontSize: '0.85rem', color: '#64748b', margin: 0 }}>{edu.description}</p>}

                      {isEditMode && (
                        <button
                          type="button"
                          onClick={() => handleRemoveEducationItem(edu.id)}
                          style={{ background: 'none', border: 'none', color: '#ef4444', fontSize: '0.8rem', cursor: 'pointer', marginTop: '0.3rem' }}
                        >
                          ✕ Remove Education
                        </button>
                      )}
                    </div>
                  ))
                )}

                {isEditMode && (
                  <form onSubmit={handleAddEducationItem} style={{ background: '#f1f5f9', padding: '1rem', borderRadius: '8px', marginBottom: '1.5rem' }}>
                    <h4 style={{ margin: '0 0 0.5rem 0', fontSize: '0.88rem', color: '#334155' }}>+ Add Education Entry</h4>
                    <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '8px', marginBottom: '8px' }}>
                      <input type="text" placeholder="Degree *" value={newEdu.degree} onChange={(e) => setNewEdu({ ...newEdu, degree: e.target.value })} style={{ padding: '6px', fontSize: '0.85rem' }} />
                      <input type="text" placeholder="Institution *" value={newEdu.institution} onChange={(e) => setNewEdu({ ...newEdu, institution: e.target.value })} style={{ padding: '6px', fontSize: '0.85rem' }} />
                      <input type="text" placeholder="Period (e.g. 2018 — 2022)" value={newEdu.period} onChange={(e) => setNewEdu({ ...newEdu, period: e.target.value })} style={{ padding: '6px', fontSize: '0.85rem' }} />
                      <input type="text" placeholder="Description / Coursework" value={newEdu.description} onChange={(e) => setNewEdu({ ...newEdu, description: e.target.value })} style={{ padding: '6px', fontSize: '0.85rem' }} />
                    </div>
                    <button type="submit" className="btn-outline-secondary" style={{ fontSize: '0.8rem', padding: '4px 12px' }}>Add Education</button>
                  </form>
                )}

                {/* KEY PROJECTS SECTION */}
                {(projects.length > 0 || isEditMode) && (
                  <>
                    <div className="resume-section-heading">KEY PROJECTS</div>
                    {projects.map((proj) => (
                      <div key={proj.id || proj.title} className="resume-job-item">
                        <div className="resume-job-row">
                          <span className="resume-company-name">{proj.title}</span>
                          {proj.link && (
                            <a href={proj.link} target="_blank" rel="noopener noreferrer" style={{ fontSize: '0.82rem', color: '#256cf0' }}>
                              {proj.link}
                            </a>
                          )}
                        </div>
                        <p style={{ fontSize: '0.88rem', color: '#475569', margin: '0.2rem 0 0.4rem 0' }}>{proj.description}</p>
                        {proj.techStack && proj.techStack.length > 0 && (
                          <div style={{ display: 'flex', gap: '6px', flexWrap: 'wrap' }}>
                            {proj.techStack.map((tech) => (
                              <span key={tech} style={{ background: '#f1f5f9', color: '#475569', fontSize: '0.75rem', padding: '2px 8px', borderRadius: '4px', fontWeight: 600 }}>
                                {tech}
                              </span>
                            ))}
                          </div>
                        )}

                        {isEditMode && (
                          <button
                            type="button"
                            onClick={() => handleRemoveProjectItem(proj.id)}
                            style={{ background: 'none', border: 'none', color: '#ef4444', fontSize: '0.8rem', cursor: 'pointer', marginTop: '0.4rem' }}
                          >
                            ✕ Remove Project
                          </button>
                        )}
                      </div>
                    ))}

                    {isEditMode && (
                      <form onSubmit={handleAddProjectItem} style={{ background: '#f1f5f9', padding: '1rem', borderRadius: '8px', marginBottom: '1.5rem' }}>
                        <h4 style={{ margin: '0 0 0.5rem 0', fontSize: '0.88rem', color: '#334155' }}>+ Add Project Entry</h4>
                        <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '8px', marginBottom: '8px' }}>
                          <input type="text" placeholder="Project Title *" value={newProj.title} onChange={(e) => setNewProj({ ...newProj, title: e.target.value })} style={{ padding: '6px', fontSize: '0.85rem' }} />
                          <input type="text" placeholder="Project Link (optional)" value={newProj.link} onChange={(e) => setNewProj({ ...newProj, link: e.target.value })} style={{ padding: '6px', fontSize: '0.85rem' }} />
                        </div>
                        <input type="text" placeholder="Tech Stack (comma separated, e.g. React, Node.js, MongoDB)" value={newProj.techStack} onChange={(e) => setNewProj({ ...newProj, techStack: e.target.value })} style={{ width: '100%', padding: '6px', fontSize: '0.85rem', marginBottom: '8px' }} />
                        <textarea placeholder="Project Description" rows="2" value={newProj.description} onChange={(e) => setNewProj({ ...newProj, description: e.target.value })} style={{ width: '100%', padding: '6px', fontSize: '0.85rem', marginBottom: '8px' }} />
                        <button type="submit" className="btn-outline-secondary" style={{ fontSize: '0.8rem', padding: '4px 12px' }}>Add Project</button>
                      </form>
                    )}
                  </>
                )}

                {/* SKILLS SECTION */}
                <div className="resume-section-heading">SKILLS &amp; TECHNOLOGIES</div>
                <div style={{ display: 'flex', flexWrap: 'wrap', gap: '8px', marginBottom: '1.5rem' }}>
                  {skills.length === 0 ? (
                    <span style={{ fontSize: '0.88rem', color: '#94a3b8', fontStyle: 'italic' }}>No skills listed.</span>
                  ) : (
                    skills.map((skill) => (
                      <span
                        key={skill}
                        style={{
                          background: '#eff6ff',
                          border: '1px solid #bfdbfe',
                          color: '#1d4ed8',
                          fontSize: '0.85rem',
                          fontWeight: 600,
                          padding: '4px 10px',
                          borderRadius: '16px',
                          display: 'inline-flex',
                          alignItems: 'center',
                          gap: '6px',
                        }}
                      >
                        <span>{skill}</span>
                        {isEditMode && (
                          <button
                            type="button"
                            onClick={() => handleRemoveSkill(skill)}
                            style={{ background: 'none', border: 'none', color: '#ef4444', cursor: 'pointer', padding: 0, fontSize: '0.85rem' }}
                          >
                            ×
                          </button>
                        )}
                      </span>
                    ))
                  )}
                </div>

                {isEditMode && (
                  <form onSubmit={handleAddCustomSkill} style={{ display: 'flex', gap: '8px', marginBottom: '1.5rem' }}>
                    <input
                      type="text"
                      placeholder="Add technical or soft skill..."
                      value={newSkillInput}
                      onChange={(e) => setNewSkillInput(e.target.value)}
                      style={{ flex: 1, padding: '6px 10px', borderRadius: '6px', border: '1px solid #cbd5e1', fontSize: '0.85rem' }}
                    />
                    <button type="submit" className="btn-outline-secondary" style={{ fontSize: '0.8rem', padding: '6px 12px' }}>
                      + Add Skill
                    </button>
                  </form>
                )}

                {/* CERTIFICATIONS & ACHIEVEMENTS */}
                {(certifications.length > 0 || achievements.length > 0 || isEditMode) && (
                  <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '1.5rem', marginBottom: '1.5rem' }}>
                    <div>
                      <div className="resume-section-heading">CERTIFICATIONS</div>
                      {certifications.map((c) => (
                        <div key={c.id || c.name} style={{ marginBottom: '0.5rem', fontSize: '0.88rem' }}>
                          <strong style={{ color: '#0f172a' }}>{c.name}</strong>
                          <div style={{ fontSize: '0.8rem', color: '#64748b' }}>{c.issuer} {c.year ? `• ${c.year}` : ''}</div>
                          {isEditMode && (
                            <button type="button" onClick={() => handleRemoveCertificationItem(c.id)} style={{ background: 'none', border: 'none', color: '#ef4444', fontSize: '0.75rem', cursor: 'pointer' }}>Remove</button>
                          )}
                        </div>
                      ))}
                      {isEditMode && (
                        <form onSubmit={handleAddCertificationItem} style={{ marginTop: '0.5rem' }}>
                          <input type="text" placeholder="Certification Name" value={newCert.name} onChange={(e) => setNewCert({ ...newCert, name: e.target.value })} style={{ width: '100%', padding: '4px 8px', fontSize: '0.8rem', marginBottom: '4px' }} />
                          <input type="text" placeholder="Issuer (e.g. AWS, Coursera)" value={newCert.issuer} onChange={(e) => setNewCert({ ...newCert, issuer: e.target.value })} style={{ width: '100%', padding: '4px 8px', fontSize: '0.8rem', marginBottom: '4px' }} />
                          <button type="submit" className="btn-outline-secondary" style={{ fontSize: '0.75rem', padding: '3px 8px' }}>+ Add Cert</button>
                        </form>
                      )}
                    </div>

                    <div>
                      <div className="resume-section-heading">ACHIEVEMENTS &amp; AWARDS</div>
                      {achievements.map((ach, idx) => (
                        <div key={idx} style={{ marginBottom: '0.4rem', fontSize: '0.88rem', color: '#334155' }}>
                          • {ach}
                          {isEditMode && (
                            <button type="button" onClick={() => handleRemoveAchievementItem(idx)} style={{ background: 'none', border: 'none', color: '#ef4444', fontSize: '0.75rem', cursor: 'pointer', marginLeft: '6px' }}>Remove</button>
                          )}
                        </div>
                      ))}
                      {isEditMode && (
                        <form onSubmit={handleAddAchievementItem} style={{ marginTop: '0.5rem' }}>
                          <input type="text" placeholder="Achievement or honor..." value={newAch} onChange={(e) => setNewAch(e.target.value)} style={{ width: '100%', padding: '4px 8px', fontSize: '0.8rem', marginBottom: '4px' }} />
                          <button type="submit" className="btn-outline-secondary" style={{ fontSize: '0.75rem', padding: '3px 8px' }}>+ Add Achievement</button>
                        </form>
                      )}
                    </div>
                  </div>
                )}
              </>
            )}
          </div>

          {/* RIGHT SIDEBAR INSIGHTS PANEL */}
          <div className="resume-sidebar-panel">
            {/* LIVE RESUME SCORES */}
            <div className="resume-widget-card">
              <h3 className="widget-title">Live Resume Scores</h3>
              <div className="score-gauges-row">
                {/* ATS SCORE */}
                <div className="score-gauge-card">
                  <div className="circle-gauge">
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
                        strokeDasharray={`${atsScore}, 100`}
                        strokeLinecap="round"
                      />
                    </svg>
                    <span className="circle-gauge-val">{atsScore}%</span>
                  </div>
                  <span className="score-gauge-label">ATS Score</span>
                </div>

                {/* SKILL MATCH */}
                <div className="score-gauge-card">
                  <div className="circle-gauge">
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
                        strokeDasharray={`${skillMatchScore}, 100`}
                        strokeLinecap="round"
                      />
                    </svg>
                    <span className="circle-gauge-val">{skillMatchScore}%</span>
                  </div>
                  <span className="score-gauge-label">Skill Match</span>
                </div>
              </div>

              {/* COMPLETENESS SCORE */}
              <div style={{ marginTop: '1rem', paddingTop: '0.85rem', borderTop: '1px solid #f1f5f9' }}>
                <div style={{ display: 'flex', justifyContent: 'space-between', fontSize: '0.82rem', fontWeight: 700, color: '#475569', marginBottom: '6px' }}>
                  <span>Resume Completeness</span>
                  <span>{completenessScore}%</span>
                </div>
                <div style={{ height: '6px', background: '#e2e8f0', borderRadius: '3px', overflow: 'hidden' }}>
                  <div style={{ width: `${completenessScore}%`, height: '100%', background: 'linear-gradient(90deg, #256cf0, #10b981)', transition: 'width 0.4s ease' }} />
                </div>
              </div>
            </div>

            {/* RECOMMENDED SKILLS */}
            <div className="resume-widget-card">
              <div className="widget-label-sm">RECOMMENDED SKILLS</div>
              {missingSkills.length === 0 ? (
                <p style={{ fontSize: '0.85rem', color: '#16a34a', margin: 0, fontWeight: 600 }}>
                  ✓ All target role skills added!
                </p>
              ) : (
                <div className="skill-pills-wrap">
                  {missingSkills.map((skill) => (
                    <button
                      key={skill}
                      type="button"
                      className="skill-pill-btn"
                      onClick={() => handleAddRecommendedSkill(skill)}
                      title={`Click to add "${skill}" to your resume`}
                    >
                      <span>+</span>
                      <span>{skill}</span>
                    </button>
                  ))}
                </div>
              )}
            </div>

            {/* MISSING SECTIONS */}
            <div className="resume-widget-card">
              <div className="widget-label-sm">MISSING SECTIONS</div>
              {missingSections.length === 0 ? (
                <p style={{ fontSize: '0.85rem', color: '#16a34a', margin: 0, fontWeight: 600 }}>
                  ✓ All core resume sections present!
                </p>
              ) : (
                <div style={{ display: 'flex', flexDirection: 'column', gap: '8px' }}>
                  {missingSections.map((sectionName) => (
                    <div
                      key={sectionName}
                      className="missing-section-card"
                      onClick={() => handleAddMissingSection(sectionName)}
                      title={`Click to add ${sectionName} section`}
                    >
                      <div className="missing-section-left">
                        <Icon name="folder" />
                        <span>{sectionName} Section</span>
                      </div>
                      <Icon name="plus" />
                    </div>
                  ))}
                </div>
              )}
            </div>

            {/* AI SUGGESTIONS */}
            <div className="resume-widget-card">
              <div className="ai-header-row">
                <div className="widget-label-sm" style={{ margin: 0 }}>
                  AI SUGGESTIONS
                </div>
                {suggestions.length > 0 && (
                  <span className="badge-new-chip">{suggestions.length} ACTIONABLE</span>
                )}
              </div>

              {suggestions.length === 0 ? (
                <p style={{ fontSize: '0.85rem', color: '#64748b', margin: 0 }}>
                  No pending suggestions. Your resume aligns with recruiter guidelines!
                </p>
              ) : (
                suggestions.map((item) => (
                  <div key={item.id} className="ai-suggestion-card">
                    <div className="ai-suggestion-body">
                      <div className={`ai-icon-square ai-icon-square--${item.type || 'blue'}`}>
                        <Icon name={item.icon || 'spark'} />
                      </div>
                      <div className="ai-suggestion-content">
                        <h4>{item.title}</h4>
                        <p>{item.desc}</p>
                      </div>
                    </div>
                    <div className="ai-suggestion-actions">
                      <button
                        type="button"
                        className="btn-apply-action"
                        onClick={() => handleApplySuggestion(item.id)}
                      >
                        Apply Suggestion
                      </button>
                      <button
                        type="button"
                        className="btn-dismiss-x"
                        onClick={() => handleDismissSuggestion(item.id)}
                        aria-label="Dismiss suggestion"
                      >
                        <Icon name="close" />
                      </button>
                    </div>
                  </div>
                ))
              )}
            </div>
          </div>
        </div>
      </main>

      <MobileNav />

      {/* CREATE RESUME FOR NEW ROLE MODAL */}
      {showNewRoleModal && (
        <div className="resume-modal-overlay" onClick={() => setShowNewRoleModal(false)}>
          <div className="resume-modal-card" onClick={(e) => e.stopPropagation()}>
            <div className="resume-modal-header">
              <h3>Create Resume for Target Role</h3>
              <button
                type="button"
                className="btn-dismiss-x"
                onClick={() => setShowNewRoleModal(false)}
              >
                ✕
              </button>
            </div>

            <form onSubmit={handleCreateNewRole}>
              <p style={{ fontSize: '0.88rem', color: '#64748b', marginBottom: '1.2rem' }}>
                Create a tailored resume version optimized for a specific job title (e.g. Senior Product Designer, Full Stack Engineer, Product Manager).
              </p>

              <label style={{ display: 'block', marginBottom: '1.25rem' }}>
                <span style={{ fontSize: '0.85rem', fontWeight: 600, color: '#334155', display: 'block', marginBottom: '6px' }}>Target Role Title *</span>
                <input
                  type="text"
                  placeholder="e.g. Full Stack Developer"
                  value={newRoleInput}
                  onChange={(e) => setNewRoleInput(e.target.value)}
                  style={{ width: '100%', padding: '0.75rem 1rem', borderRadius: '10px', border: '1px solid #cbd5e1', fontSize: '0.95rem' }}
                  required
                  autoFocus
                />
              </label>

              <div style={{ display: 'flex', gap: '10px', justifyContent: 'flex-end' }}>
                <button
                  type="button"
                  className="btn-outline-secondary"
                  onClick={() => setShowNewRoleModal(false)}
                >
                  Cancel
                </button>
                <button
                  type="submit"
                  className="btn-primary-spark"
                  style={{ padding: '0.65rem 1.25rem' }}
                >
                  Create Role Resume
                </button>
              </div>
            </form>
          </div>
        </div>
      )}
    </div>
  );
}
