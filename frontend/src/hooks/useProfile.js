import { useState, useEffect } from 'react';
import { getProfile, updateProfile, uploadProfilePhoto } from '../services/profileService.js';

const defaultProjects = [
  {
    id: 'proj_1',
    title: 'Nexus Wallet',
    description: 'Crypto asset management redesigned for clarity with intuitive interaction patterns.',
    image: '/images/nexus_wallet.png',
    isExample: true,
  },
  {
    id: 'proj_2',
    title: 'DataStream Dashboard',
    description: 'Real-time analytics for enterprise-level logistics with live monitoring metrics.',
    image: '/images/datastream_dashboard.png',
    isExample: true,
  },
];

const defaultCompanies = [
  { name: 'Stripe', color: '#6366f1' },
  { name: 'Linear', color: '#2563eb' },
  { name: 'Airbnb', color: '#ff385c' },
];

export function useProfile(updateUserCtx) {
  const [profile, setProfile] = useState(null);
  const [saving, setSaving] = useState(false);
  const [toast, setToast] = useState('');

  // Editable fields
  const [name, setName] = useState('');
  const [title, setTitle] = useState('');
  const [avatarUrl, setAvatarUrl] = useState('/images/alex_thompson.png');
  const [experiences, setExperiences] = useState([]);
  const [education, setEducation] = useState([]);
  const [projects, setProjects] = useState([]);
  const [skills, setSkills] = useState([]);
  const [skillsActive, setSkillsActive] = useState([]);
  const [targetRoles, setTargetRoles] = useState([]);
  const [dreamCompanies, setDreamCompanies] = useState([]);
  const [aiSuggestion, setAiSuggestion] = useState(null);

  // Modal states
  const [showExpModal, setShowExpModal] = useState(false);
  const [newExp, setNewExp] = useState({ role: '', company: '', period: '', description: '' });
  const [showEduModal, setShowEduModal] = useState(false);
  const [newEdu, setNewEdu] = useState({ degree: '', institution: '', period: '', description: '' });
  const [showSkillModal, setShowSkillModal] = useState(false);
  const [newSkill, setNewSkill] = useState('');
  const [showRoleModal, setShowRoleModal] = useState(false);
  const [newRole, setNewRole] = useState('');
  const [showCompanyModal, setShowCompanyModal] = useState(false);
  const [newCompany, setNewCompany] = useState({ name: '', color: '#2563eb' });
  const [showProjectModal, setShowProjectModal] = useState(false);
  const [newProject, setNewProject] = useState({ title: '', description: '', image: '', link: '' });
  const [showAvatarModal, setShowAvatarModal] = useState(false);
  const [refiningText, setRefiningText] = useState(false);

  const showNotification = (msg) => {
    setToast(msg);
    setTimeout(() => setToast(''), 3500);
  };

  const loadProfile = () => {
    getProfile()
      .then((data) => {
        setProfile(data);
        setName(data.name || 'Alex Thompson');
        setTitle(data.title || 'Senior Product Designer @ Fintech Innovations');
        setAvatarUrl(data.avatarUrl || '/images/alex_thompson.png');
        setExperiences(data.experiences || []);
        setEducation(data.education || []);
        const loadedProjects = (data.projects && data.projects.length > 0) ? data.projects : defaultProjects;
        const flaggedProjects = loadedProjects.map((p) => {
          if (p.id === 'proj_1' || p.id === 'proj_2' || p.isExample) {
            return { ...p, isExample: true };
          }
          return p;
        });
        setProjects(flaggedProjects);
        setSkills(data.skills || []);
        setSkillsActive(data.skillsActive || []);
        setTargetRoles(data.targetRoles || []);
        setDreamCompanies((data.dreamCompanies && data.dreamCompanies.length > 0) ? data.dreamCompanies : defaultCompanies);
        setAiSuggestion(data.aiSuggestion || null);
      })
      .catch(() => setProfile(null));
  };

  useEffect(() => { loadProfile(); }, []);

  const buildPayload = (patch = {}) => ({
    name, title, avatarUrl, experiences, education, projects,
    skills, skillsActive, targetRoles, dreamCompanies, aiSuggestion,
    completion: 85,
    ...patch,
  });

  const persistProfilePatch = async (patch = {}) => {
    try {
      const data = await updateProfile(buildPayload(patch));
      setProfile(data);
      if (patch.name || patch.avatarUrl) {
        updateUserCtx({ name: data.name, avatar: data.avatarUrl, avatarUrl: data.avatarUrl });
      }
    } catch {
      // silent
    }
  };

  const handleSaveProfile = async () => {
    setSaving(true);
    try {
      const data = await updateProfile(buildPayload());
      setProfile(data);
      updateUserCtx({ name: data.name, avatar: data.avatarUrl, avatarUrl: data.avatarUrl });
      showNotification('Profile changes saved successfully!');
    } catch (err) {
      showNotification(err.message || 'Error saving profile');
    } finally {
      setSaving(false);
    }
  };

  const handleToggleSkillActive = (skillName) => {
    const updated = skillsActive.includes(skillName)
      ? skillsActive.filter((s) => s !== skillName)
      : [...skillsActive, skillName];
    setSkillsActive(updated);
    persistProfilePatch({ skillsActive: updated });
  };

  const handleAddExperience = (e) => {
    e.preventDefault();
    if (!newExp.role || !newExp.company) return;
    const item = {
      id: `exp_${Date.now()}`,
      role: newExp.role,
      company: newExp.company,
      period: newExp.period || '2023 — Present',
      description: newExp.description || '',
      current: newExp.period?.toLowerCase().includes('present'),
    };
    const updated = [item, ...experiences];
    setExperiences(updated);
    setNewExp({ role: '', company: '', period: '', description: '' });
    setShowExpModal(false);
    showNotification('Experience added!');
    persistProfilePatch({ experiences: updated });
  };

  const handleAddEducation = (e) => {
    e.preventDefault();
    if (!newEdu.degree || !newEdu.institution) return;
    const item = {
      id: `edu_${Date.now()}`,
      degree: newEdu.degree,
      institution: newEdu.institution,
      period: newEdu.period || '2019 — 2023',
      description: newEdu.description || '',
    };
    const updated = [item, ...education];
    setEducation(updated);
    setNewEdu({ degree: '', institution: '', period: '', description: '' });
    setShowEduModal(false);
    showNotification('Education added!');
    persistProfilePatch({ education: updated });
  };

  const handleAddSkill = (e) => {
    e.preventDefault();
    if (!newSkill.trim()) return;
    const s = newSkill.trim();
    let updatedSkills = skills;
    let updatedActive = skillsActive;
    if (!skills.includes(s)) {
      updatedSkills = [...skills, s];
      updatedActive = [...skillsActive, s];
      setSkills(updatedSkills);
      setSkillsActive(updatedActive);
    }
    setNewSkill('');
    setShowSkillModal(false);
    showNotification(`Skill "${s}" added!`);
    persistProfilePatch({ skills: updatedSkills, skillsActive: updatedActive });
  };

  const handleAddTargetRole = (e) => {
    e.preventDefault();
    if (!newRole.trim()) return;
    const r = newRole.trim();
    let updatedRoles = targetRoles;
    if (!targetRoles.includes(r)) {
      updatedRoles = [...targetRoles, r];
      setTargetRoles(updatedRoles);
    }
    setNewRole('');
    setShowRoleModal(false);
    showNotification(`Target role "${r}" added!`);
    persistProfilePatch({ targetRoles: updatedRoles });
  };

  const handleRemoveTargetRole = (roleName) => {
    const updated = targetRoles.filter((r) => r !== roleName);
    setTargetRoles(updated);
    persistProfilePatch({ targetRoles: updated });
  };

  const handleAddCompany = (e) => {
    e.preventDefault();
    if (!newCompany.name.trim()) return;
    const cName = newCompany.name.trim();
    if (!dreamCompanies.some((c) => c.name.toLowerCase() === cName.toLowerCase())) {
      const updated = [...dreamCompanies, { name: cName, color: newCompany.color || '#2563eb' }];
      setDreamCompanies(updated);
      persistProfilePatch({ dreamCompanies: updated });
      showNotification(`Dream company "${cName}" added!`);
    }
    setNewCompany({ name: '', color: '#2563eb' });
    setShowCompanyModal(false);
  };

  const handleRemoveCompany = (companyName) => {
    const updated = dreamCompanies.filter((c) => c.name !== companyName);
    setDreamCompanies(updated);
    persistProfilePatch({ dreamCompanies: updated });
    showNotification(`Removed ${companyName}`);
  };

  const handleAddProject = (e) => {
    e.preventDefault();
    if (!newProject.title.trim()) return;
    const item = {
      id: `proj_${Date.now()}`,
      title: newProject.title.trim(),
      description: newProject.description.trim() || 'Featured portfolio project.',
      image: newProject.image.trim() || '/images/nexus_wallet.png',
      link: newProject.link.trim() || '',
    };
    const updated = [item, ...projects];
    setProjects(updated);
    setNewProject({ title: '', description: '', image: '', link: '' });
    setShowProjectModal(false);
    showNotification('New project added to portfolio!');
    persistProfilePatch({ projects: updated });
  };

  const handleRemoveProject = (projectId) => {
    const updated = projects.filter((p) => p.id !== projectId);
    setProjects(updated);
    persistProfilePatch({ projects: updated });
    showNotification('Project removed');
  };

  const handlePhotoUpload = async (file) => {
    if (!file) return;
    if (!file.type.startsWith('image/')) {
      showNotification('Please select a valid image file (JPG, PNG, WebP)');
      return;
    }
    showNotification('Uploading profile photo...');
    try {
      const res = await uploadProfilePhoto(file);
      const newUrl = res.avatarUrl || res.profileImageUrl || '';
      if (newUrl) {
        setAvatarUrl(newUrl);
        updateUserCtx({ avatar: newUrl, avatarUrl: newUrl });
      }
      showNotification('Profile photo uploaded successfully!');
      setShowAvatarModal(false);
    } catch (err) {
      showNotification(err.message || 'Failed to upload profile photo');
    }
  };

  const handleRefineProjectText = () => {
    setRefiningText(true);
    setTimeout(() => {
      const updatedProjects = (projects.length > 0 ? projects : defaultProjects).map((p, index) => {
        if (index === 0) {
          return {
            ...p,
            description: 'Crypto asset management redesigned for clarity with scalable system design architectures.',
          };
        }
        if (index === 1) {
          return {
            ...p,
            description:
              'Real-time analytics for enterprise-level logistics incorporating end-to-end component systems.',
          };
        }
        return p;
      });
      setProjects(updatedProjects);
      setRefiningText(false);
      showNotification('AI refined project descriptions with Systems Thinking!');
      persistProfilePatch({ projects: updatedProjects });
    }, 1200);
  };

  return {
    profile,
    saving,
    toast,
    name,
    setName,
    title,
    setTitle,
    avatarUrl,
    setAvatarUrl,
    experiences,
    setExperiences,
    education,
    setEducation,
    projects,
    setProjects,
    skills,
    skillsActive,
    targetRoles,
    dreamCompanies,
    aiSuggestion,
    showExpModal,
    setShowExpModal,
    newExp,
    setNewExp,
    showEduModal,
    setShowEduModal,
    newEdu,
    setNewEdu,
    showSkillModal,
    setShowSkillModal,
    newSkill,
    setNewSkill,
    showRoleModal,
    setShowRoleModal,
    newRole,
    setNewRole,
    showCompanyModal,
    setShowCompanyModal,
    newCompany,
    setNewCompany,
    showProjectModal,
    setShowProjectModal,
    newProject,
    setNewProject,
    showAvatarModal,
    setShowAvatarModal,
    refiningText,
    handleSaveProfile,
    handleToggleSkillActive,
    handleAddExperience,
    handleAddEducation,
    handleAddSkill,
    handleAddTargetRole,
    handleRemoveTargetRole,
    handleAddCompany,
    handleRemoveCompany,
    handleAddProject,
    handleRemoveProject,
    handlePhotoUpload,
    handleRefineProjectText,
  };
}

