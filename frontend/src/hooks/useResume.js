import { useState, useEffect, useCallback } from 'react';
import { getResume, updateResume, buildResumeWithAI, restoreResumeVersion } from '../services/resumeService.js';

export function useResume(user) {
  const [loading, setLoading] = useState(true);
  const [isBuilding, setIsBuilding] = useState(false);
  const [isSaving, setIsSaving] = useState(false);
  const [isEditMode, setIsEditMode] = useState(false);
  const [selectedRole, setSelectedRole] = useState(user?.title || 'AI Engineer');
  const [availableRoles, setAvailableRoles] = useState([
    user?.title || 'AI Engineer',
    'Software Engineer',
    'Senior Product Designer',
    'Product Manager',
    'Data Scientist',
  ]);
  const [roleResumes, setRoleResumes] = useState(() => {
    try {
      const stored = localStorage.getItem('careerprep_role_resumes');
      return stored ? JSON.parse(stored) : {};
    } catch {
      return {};
    }
  });
  const [showNewRoleModal, setShowNewRoleModal] = useState(false);
  const [newRoleInput, setNewRoleInput] = useState('');
  const [toast, setToast] = useState(null);
  const [lastSaved, setLastSaved] = useState('');

  // Structured Resume State from MongoDB
  const [contact, setContact] = useState({
    name: user?.name || '',
    email: user?.email || '',
    phone: '',
    location: '',
    linkedin: '',
    github: '',
    portfolio: '',
    title: user?.title || '',
  });

  const [summary, setSummary] = useState('');
  const [experience, setExperience] = useState([]);
  const [education, setEducation] = useState([]);
  const [projects, setProjects] = useState([]);
  const [skills, setSkills] = useState([]);
  const [certifications, setCertifications] = useState([]);
  const [achievements, setAchievements] = useState([]);
  const [languages, setLanguages] = useState([]);
  const [interests, setInterests] = useState([]);
  const [customSections, setCustomSections] = useState([]);

  // Dynamic Scores & Recommendations
  const [atsScore, setAtsScore] = useState(85);
  const [skillMatchScore, setSkillMatchScore] = useState(80);
  const [completenessScore, setCompletenessScore] = useState(85);
  const [missingSkills, setMissingSkills] = useState([]);
  const [missingSections, setMissingSections] = useState([]);
  const [suggestions, setSuggestions] = useState([]);
  const [versionHistory, setVersionHistory] = useState([]);

  const showToast = (message, type = 'success') => {
    setToast({ message, type });
    setTimeout(() => setToast(null), 3500);
  };

  const populateFromBackend = useCallback((data) => {
    if (!data) return;
    if (data.contact) {
      setContact({
        name: data.contact.name || user?.name || '',
        email: data.contact.email || user?.email || '',
        phone: data.contact.phone || '',
        location: data.contact.location || '',
        linkedin: data.contact.linkedin || '',
        github: data.contact.github || '',
        portfolio: data.contact.portfolio || '',
        title: data.contact.title || user?.title || '',
      });
    }
    if (data.summary !== undefined) setSummary(data.summary || '');
    if (data.experience) setExperience(data.experience || []);
    if (data.education) setEducation(data.education || []);
    if (data.projects) setProjects(data.projects || []);
    if (data.skills) setSkills(data.skills || []);
    if (data.certifications) setCertifications(data.certifications || []);
    if (data.achievements) setAchievements(data.achievements || []);
    if (data.languages) setLanguages(data.languages || []);
    if (data.interests) setInterests(data.interests || []);
    if (data.customSections) setCustomSections(data.customSections || []);

    if (data.atsScore !== undefined) setAtsScore(data.atsScore);
    if (data.skillMatchScore !== undefined) setSkillMatchScore(data.skillMatchScore);
    if (data.completenessScore !== undefined) setCompletenessScore(data.completenessScore);
    if (data.missingSkills) setMissingSkills(data.missingSkills || []);
    if (data.missingSections) setMissingSections(data.missingSections || []);
    if (data.suggestions) setSuggestions(data.suggestions || []);
    const backendRoles = Array.isArray(data.targetRoles) ? data.targetRoles : [];
    const defaultRoles = [user?.title, 'AI Engineer', 'Software Engineer', 'Senior Product Designer', 'Product Manager', 'Data Scientist'];
    const mergedRoles = Array.from(new Set([...defaultRoles, ...backendRoles].filter(Boolean)));
    setAvailableRoles(mergedRoles);

    if (data.roleResumes && typeof data.roleResumes === 'object' && Object.keys(data.roleResumes).length > 0) {
      setRoleResumes((prev) => ({ ...prev, ...data.roleResumes }));
      try {
        localStorage.setItem('careerprep_role_resumes', JSON.stringify(data.roleResumes));
      } catch {}
    }
    if (data.contact?.title) {
      setSelectedRole(data.contact.title);
    }
    if (data.updatedAt) {
      setLastSaved(new Date(data.updatedAt).toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' }));
    }
  }, [user]);

  // Live ATS Score Calculator Algorithm
  const computeLiveAtsScores = useCallback((cnt, sum, exp, edu, proj, skls, certs, achs) => {
    let ats = 0;

    // Contact Info Quality (20 pts)
    if (cnt?.name?.trim()) ats += 4;
    if (cnt?.email?.trim()) ats += 4;
    if (cnt?.phone?.trim()) ats += 4;
    if (cnt?.location?.trim()) ats += 4;
    if (cnt?.linkedin?.trim() || cnt?.github?.trim() || cnt?.portfolio?.trim()) ats += 4;

    // Summary Quality & Action Keywords (15 pts)
    if (sum && sum.trim()) {
      ats += 5;
      const words = sum.trim().split(/\s+/).length;
      if (words >= 20 && words <= 120) ats += 5;
      else if (words > 10) ats += 3;

      const summaryLower = sum.toLowerCase();
      const actionKeywords = ['lead', 'manage', 'engineer', 'develop', 'design', 'architect', 'deliver', 'optimize', 'scale', 'spearhead', 'implement', 'build', 'results'];
      if (actionKeywords.filter((k) => summaryLower.includes(k)).length >= 2) ats += 5;
      else if (actionKeywords.filter((k) => summaryLower.includes(k)).length >= 1) ats += 3;
    }

    // Experience & Metrics / STAR Formula (30 pts)
    if (exp && exp.length > 0) {
      ats += 5;
      if (exp.length >= 2) ats += 5;

      let totalBullets = 0;
      let metricBullets = 0;
      let actionWordBullets = 0;

      const metricRegex = /(\d+|%|\$|\+|\b(reduced|increased|improved|boosted|grew|saved|doubled|tripled)\b)/i;
      const actionRegex = /^(architected|engineered|developed|led|optimized|implemented|managed|designed|built|delivered|created|spearheaded|crafted|launched|automated|drove|reduced|increased)\b/i;

      exp.forEach((item) => {
        const bullets = item.bulletPoints || (item.description ? [item.description] : []);
        totalBullets += bullets.length;
        bullets.forEach((b) => {
          if (metricRegex.test(b)) metricBullets++;
          if (actionRegex.test(b.trim())) actionWordBullets++;
        });
      });

      if (totalBullets >= 3) ats += 5;
      if (metricBullets >= 1) ats += 5;
      if (metricBullets >= 3) ats += 5;
      if (actionWordBullets >= 2) ats += 5;
    }

    // Technical & Soft Skills (20 pts)
    if (skls && skls.length >= 1) ats += 5;
    if (skls && skls.length >= 5) ats += 5;
    if (skls && skls.length >= 8) ats += 5;
    if (skls && skls.length >= 12) ats += 5;

    // Education & Credentials (10 pts)
    if (edu && edu.length >= 1) ats += 6;
    if ((certs && certs.length >= 1) || (edu && edu.length >= 2)) ats += 4;

    // Projects (5 pts)
    if (proj && proj.length >= 1) ats += 3;
    if (proj && proj.length >= 2) ats += 2;

    ats = Math.min(98, Math.max(25, ats));

    // Skill Match Score (0 - 100)
    const title = cnt?.title || '';
    const titleLower = title.toLowerCase();
    let benchmarkSkills = ['javascript', 'react', 'node.js', 'html', 'css', 'git', 'sql', 'rest apis'];
    if (titleLower.includes('design') || titleLower.includes('ui') || titleLower.includes('ux')) {
      benchmarkSkills = ['figma', 'ui/ux design', 'prototyping', 'design systems', 'user research', 'wireframing', 'adobe cc'];
    } else if (titleLower.includes('product manager') || titleLower.includes('pm')) {
      benchmarkSkills = ['product strategy', 'roadmap', 'agile', 'user stories', 'data analytics', 'stakeholder management', 'a/b testing'];
    } else if (titleLower.includes('python') || titleLower.includes('data')) {
      benchmarkSkills = ['python', 'pandas', 'sql', 'machine learning', 'data analysis', 'numpy', 'scikit-learn'];
    }

    const userSkillsLower = (skls || []).map((s) => String(s).toLowerCase().trim());
    const matchedCount = benchmarkSkills.filter((b) => userSkillsLower.some((u) => u.includes(b) || b.includes(u))).length;

    let skillMatch = Math.round((matchedCount / benchmarkSkills.length) * 70) + Math.min(30, userSkillsLower.length * 3);
    skillMatch = Math.min(98, Math.max(35, skillMatch));

    // Completeness & Missing Sections
    const sections = [
      { name: 'Summary', check: () => Boolean(sum && sum.trim()) },
      { name: 'Experience', check: () => Boolean(exp && exp.length > 0) },
      { name: 'Education', check: () => Boolean(edu && edu.length > 0) },
      { name: 'Projects', check: () => Boolean(proj && proj.length > 0) },
      { name: 'Skills', check: () => Boolean(skls && skls.length > 0) },
      { name: 'Certifications', check: () => Boolean(certs && certs.length > 0) },
      { name: 'Achievements', check: () => Boolean(achs && achs.length > 0) },
    ];

    const presentCount = sections.filter((s) => s.check()).length;
    const missing = sections.filter((s) => !s.check()).map((s) => s.name);
    const completeness = Math.round((presentCount / sections.length) * 100);

    return {
      atsScore: ats,
      skillMatchScore: skillMatch,
      completenessScore: completeness,
      missingSections: missing,
    };
  }, []);

  // Load real data from MongoDB on mount
  useEffect(() => {
    let isMounted = true;
    setLoading(true);

    getResume()
      .then((data) => {
        if (isMounted) {
          populateFromBackend(data);
        }
      })
      .catch((err) => {
        if (isMounted) {
          showToast('Unable to load resume: ' + err.message, 'error');
        }
      })
      .finally(() => {
        if (isMounted) setLoading(false);
      });
  }, [populateFromBackend]);

  // Recalculate Live ATS Scores whenever content changes
  useEffect(() => {
    if (!loading) {
      const live = computeLiveAtsScores(contact, summary, experience, education, projects, skills, certifications, achievements);
      setAtsScore(live.atsScore);
      setSkillMatchScore(live.skillMatchScore);
      setCompletenessScore(live.completenessScore);
      setMissingSections(live.missingSections);
    }
  }, [contact, summary, experience, education, projects, skills, certifications, achievements, loading, computeLiveAtsScores]);

  // Auto-Save function
  const saveResumeToDb = async (patch = {}) => {
    setIsSaving(true);
    try {
      const payload = {
        contact: patch.contact !== undefined ? patch.contact : contact,
        summary: patch.summary !== undefined ? patch.summary : summary,
        experience: patch.experience !== undefined ? patch.experience : experience,
        education: patch.education !== undefined ? patch.education : education,
        projects: patch.projects !== undefined ? patch.projects : projects,
        skills: patch.skills !== undefined ? patch.skills : skills,
        certifications: patch.certifications !== undefined ? patch.certifications : certifications,
        achievements: patch.achievements !== undefined ? patch.achievements : achievements,
        languages: patch.languages !== undefined ? patch.languages : languages,
        interests: patch.interests !== undefined ? patch.interests : interests,
        customSections: patch.customSections !== undefined ? patch.customSections : customSections,
        atsScore: patch.atsScore !== undefined ? patch.atsScore : atsScore,
        skillMatchScore: patch.skillMatchScore !== undefined ? patch.skillMatchScore : skillMatchScore,
        missingSkills: patch.missingSkills !== undefined ? patch.missingSkills : missingSkills,
        suggestions: patch.suggestions !== undefined ? patch.suggestions : suggestions,
        targetRoles: patch.targetRoles !== undefined ? patch.targetRoles : availableRoles,
        roleResumes: patch.roleResumes !== undefined ? patch.roleResumes : roleResumes,
      };

      const updated = await updateResume(payload);
      if (updated) {
        if (updated.targetRoles && Array.isArray(updated.targetRoles)) {
          setAvailableRoles(Array.from(new Set(['AI Engineer', 'Software Engineer', 'Senior Product Designer', 'Product Manager', 'Data Scientist', ...updated.targetRoles].filter(Boolean))));
        }
        if (updated.roleResumes && typeof updated.roleResumes === 'object' && Object.keys(updated.roleResumes).length > 0) {
          setRoleResumes((prev) => ({ ...prev, ...updated.roleResumes }));
          try {
            localStorage.setItem('careerprep_role_resumes', JSON.stringify(updated.roleResumes));
          } catch {}
        }
        if (updated.versions) setVersionHistory(updated.versions);
        setLastSaved(new Date().toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' }));
      }
    } catch (err) {
      console.error('Auto-save error:', err);
    } finally {
      setIsSaving(false);
    }
  };

  // Manual explicit Save All function
  const handleSaveAll = async () => {
    setIsSaving(true);
    try {
      const payload = {
        contact,
        summary,
        experience,
        education,
        projects,
        skills,
        certifications,
        achievements,
        languages,
        interests,
        customSections,
        atsScore,
        skillMatchScore,
        completenessScore,
        missingSkills,
        suggestions,
      };

      const updated = await updateResume(payload);
      if (updated) {
        if (updated.versions) setVersionHistory(updated.versions);
        setLastSaved(new Date().toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' }));
        showToast('Resume saved successfully!', 'success');
      }
    } catch (err) {
      showToast('Failed to save resume edits: ' + err.message, 'error');
    } finally {
      setIsSaving(false);
    }
  };

  // Build Resume with AI Action
  const handleBuildResumeWithAI = async () => {
    setIsBuilding(true);
    try {
      showToast('Building your professional resume with Gemini AI...', 'info');
      const newResume = await buildResumeWithAI();
      populateFromBackend(newResume);
      showToast('Professional ATS Resume built successfully!', 'success');
    } catch (err) {
      showToast(err.message || 'Failed to build resume with AI', 'error');
    } finally {
      setIsBuilding(false);
    }
  };

  // Add a recommended skill
  const handleAddRecommendedSkill = (skill) => {
    if (!skills.includes(skill)) {
      const updatedSkills = [...skills, skill];
      const updatedMissing = missingSkills.filter((s) => s !== skill);
      const newSkillMatch = Math.min(98, skillMatchScore + 4);

      setSkills(updatedSkills);
      setMissingSkills(updatedMissing);
      setSkillMatchScore(newSkillMatch);

      saveResumeToDb({
        skills: updatedSkills,
        missingSkills: updatedMissing,
        skillMatchScore: newSkillMatch,
      });

      showToast(`Added "${skill}" to resume skills!`, 'success');
    }
  };

  // Click on a missing section to add an entry
  const handleAddMissingSection = (sectionName) => {
    if (sectionName === 'Projects' && projects.length === 0) {
      const newProj = [{ id: `proj_${Date.now()}`, title: 'Featured Project', description: 'Full-stack application built with modern architecture.', techStack: ['React', 'Node.js'] }];
      setProjects(newProj);
      saveResumeToDb({ projects: newProj });
    } else if (sectionName === 'Summary' && !summary) {
      const newSum = `Dedicated ${contact.title || 'Professional'} focused on software engineering excellence and scalable product delivery.`;
      setSummary(newSum);
      saveResumeToDb({ summary: newSum });
    } else if (sectionName === 'Certifications' && certifications.length === 0) {
      const newCert = [{ id: `cert_${Date.now()}`, name: 'Professional Certification', issuer: 'Industry Authority', year: '2024' }];
      setCertifications(newCert);
      saveResumeToDb({ certifications: newCert });
    } else if (sectionName === 'Languages' && languages.length === 0) {
      const newLang = ['English (Native / Fluent)'];
      setLanguages(newLang);
      saveResumeToDb({ languages: newLang });
    } else if (sectionName === 'Achievements' && achievements.length === 0) {
      const newAch = ['Recognized for outstanding technical contribution and team leadership.'];
      setAchievements(newAch);
      saveResumeToDb({ achievements: newAch });
    }
    setIsEditMode(true);
  };

  // Dismiss AI Suggestion
  const handleDismissSuggestion = (id) => {
    const updated = suggestions.filter((s) => s.id !== id);
    setSuggestions(updated);
    saveResumeToDb({ suggestions: updated });
  };

  // Apply AI Suggestion
  const handleApplySuggestion = (id) => {
    const newAts = Math.min(98, atsScore + 3);
    const updatedSuggestions = suggestions.filter((s) => s.id !== id);
    setAtsScore(newAts);
    setSuggestions(updatedSuggestions);
    saveResumeToDb({ atsScore: newAts, suggestions: updatedSuggestions });
    showToast('Applied AI suggestion to resume!', 'success');
  };

  // Select or switch role resume
  const handleSelectRole = (roleName) => {
    if (roleName === 'CREATE_NEW_ROLE') {
      setShowNewRoleModal(true);
      return;
    }

    // Save current active snapshot before switching
    const currentRoleKey = contact.title || selectedRole || 'AI Engineer';
    const currentSnapshot = {
      contact,
      summary,
      experience,
      education,
      projects,
      skills,
      certifications,
      achievements,
      atsScore,
      skillMatchScore,
    };

    const updatedRoleResumes = {
      ...roleResumes,
      [currentRoleKey]: currentSnapshot,
    };

    let nextContact = contact;
    let nextSummary = summary;
    let nextExp = experience;
    let nextEdu = education;
    let nextProj = projects;
    let nextSkills = skills;
    let nextCerts = certifications;
    let nextAchs = achievements;

    if (updatedRoleResumes[roleName]) {
      // Restore saved snapshot for target role
      const saved = updatedRoleResumes[roleName];
      nextContact = saved.contact || { ...contact, title: roleName };
      if (saved.summary !== undefined) nextSummary = saved.summary;
      if (saved.experience) nextExp = saved.experience;
      if (saved.education) nextEdu = saved.education;
      if (saved.projects) nextProj = saved.projects;
      if (saved.skills) nextSkills = saved.skills;
      if (saved.certifications) nextCerts = saved.certifications;
      if (saved.achievements) nextAchs = saved.achievements;
      if (saved.atsScore !== undefined) setAtsScore(saved.atsScore);
      if (saved.skillMatchScore !== undefined) setSkillMatchScore(saved.skillMatchScore);
    } else {
      // Create new role preset
      nextContact = { ...contact, title: roleName };
      nextSummary = `Results-driven ${roleName} with hands-on experience building scalable applications, managing component libraries, and optimizing backend performance. Committed to engineering excellence and delivering measurable business impact.`;
    }

    setContact(nextContact);
    setSummary(nextSummary);
    setExperience(nextExp);
    setEducation(nextEdu);
    setProjects(nextProj);
    setSkills(nextSkills);
    setCertifications(nextCerts);
    setAchievements(nextAchs);

    setSelectedRole(roleName);
    setRoleResumes(updatedRoleResumes);
    try {
      localStorage.setItem('careerprep_role_resumes', JSON.stringify(updatedRoleResumes));
    } catch {}

    const updatedTargetRoles = Array.from(new Set([...availableRoles, roleName]));
    setAvailableRoles(updatedTargetRoles);

    showToast(`Switched resume for role: "${roleName}"`, 'success');
    saveResumeToDb({
      contact: nextContact,
      summary: nextSummary,
      experience: nextExp,
      education: nextEdu,
      projects: nextProj,
      skills: nextSkills,
      certifications: nextCerts,
      achievements: nextAchs,
      targetRoles: updatedTargetRoles,
      roleResumes: updatedRoleResumes,
    });
  };

  const handleCreateNewRole = (e) => {
    e.preventDefault();
    if (!newRoleInput.trim()) return;
    const roleName = newRoleInput.trim();

    const updatedTargetRoles = Array.from(new Set([...availableRoles, roleName]));
    setAvailableRoles(updatedTargetRoles);
    setShowNewRoleModal(false);
    setNewRoleInput('');

    // Save current active snapshot
    const currentRoleKey = contact.title || selectedRole || 'AI Engineer';
    const currentSnapshot = {
      contact,
      summary,
      experience,
      education,
      projects,
      skills,
      certifications,
      achievements,
      atsScore,
      skillMatchScore,
    };

    const newContact = { ...contact, title: roleName };
    const newSummary = `Results-driven ${roleName} with hands-on experience building scalable applications, managing component libraries, and optimizing backend performance. Committed to engineering excellence and delivering measurable business impact.`;

    const updatedRoleResumes = {
      ...roleResumes,
      [currentRoleKey]: currentSnapshot,
      [roleName]: {
        contact: newContact,
        summary: newSummary,
        experience,
        education,
        projects,
        skills,
        certifications,
        achievements,
      },
    };

    setContact(newContact);
    setSummary(newSummary);
    setRoleResumes(updatedRoleResumes);
    setSelectedRole(roleName);
    try {
      localStorage.setItem('careerprep_role_resumes', JSON.stringify(updatedRoleResumes));
    } catch {}

    showToast(`Created & saved resume for role: "${roleName}"`, 'success');
    saveResumeToDb({
      contact: newContact,
      summary: newSummary,
      targetRoles: updatedTargetRoles,
      roleResumes: updatedRoleResumes,
    });
  };

  // Restore Version Snapshot
  const handleRestoreVersion = async (versionId) => {
    try {
      const restored = await restoreResumeVersion(versionId);
      populateFromBackend(restored);
      showToast('Restored resume version successfully!', 'success');
    } catch (err) {
      showToast(err.message || 'Failed to restore version', 'error');
    }
  };

  // Export PDF Download with dynamic filename
  const handleDownloadPdf = () => {
    const originalTitle = document.title;
    const nameStr = (contact.name || user?.name || 'Candidate').replace(/\s+/g, '_');
    document.title = `${nameStr}_${(contact.title || 'Resume').replace(/\s+/g, '_')}.pdf`;

    window.print();

    setTimeout(() => {
      document.title = originalTitle;
    }, 1000);
  };

  return {
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
    setAtsScore,
    skillMatchScore,
    setSkillMatchScore,
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
  };
}

