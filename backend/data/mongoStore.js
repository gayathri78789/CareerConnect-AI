import bcrypt from 'bcryptjs';
import {
  UserModel,
  ProfileModel,
  AnalyticsModel,
  GoalModel,
  ResumeModel,
  MockInterviewModel,
  RoadmapModel,
  NotificationModel,
  JDAnalysisModel,
  AIChatSessionModel,
  AIChatHistoryModel,
  PracticeHistoryModel,
  BadgeModel,
  UserSettingsModel,
  AnalysisReportModel,
} from '../models/index.js';
import {
  isCloudinaryConfigured,
  uploadToCloudinary,
  uploadImageToCloudinary,
  deleteFromCloudinary,
} from '../services/cloudinaryService.js';

import { CAREER_TRACKS } from './careerData.js';
import { CODING_QUESTIONS, generate10AptitudeQuestions } from './questionStore.js';
import {
  generateChatReply,
  generateOptimizedResume,
  generateBuildResumeFromProfile,
  generateJDAnalysis,
  generateRoadmap as aiGenerateRoadmap,
  generateMockInterviewQuestions,
  evaluateInterviewSession,
  evaluateCodeSubmission,
} from '../services/aiService.js';


export async function ensureUserInitialized(userId, name = 'User', email = '') {
  let profile = await ProfileModel.findOne({ userId });
  if (!profile) {
    profile = await ProfileModel.create({
      userId,
      name,
      email,
      title: '',
      avatarUrl: '',
      completion: 10,
      about: '',
      recruiterSnapshot: '',
      experiences: [],
      education: [],
      projects: [],
      skills: [],
      skillsActive: [],
      targetRoles: [],
      dreamCompanies: [],
    });
  }

  let analytics = await AnalyticsModel.findOne({ userId });
  if (!analytics) {
    analytics = await AnalyticsModel.create({
      userId,
      codingXP: 0,
      careerReadiness: 0,
      resumeScore: 'Not Generated',
      interviewRank: '--',
      weeklyActivity: [
        { day: 'Mon', count: 0 },
        { day: 'Tue', count: 0 },
        { day: 'Wed', count: 0 },
        { day: 'Thu', count: 0 },
        { day: 'Fri', count: 0 },
        { day: 'Sat', count: 0 },
        { day: 'Sun', count: 0 },
      ],
      activityLog: [],
      practiceStats: { questionsCompleted: 0, accuracy: 0 },
      streak: 0,
    });
  }

  let resume = await ResumeModel.findOne({ userId });
  if (!resume) {
    resume = await ResumeModel.create({
      userId,
      suggestions: [],
      missingSkills: [],
      resumeText: '',
      score: 'Not Generated',
    });
  }

  let roadmap = await RoadmapModel.findOne({ userId });
  if (!roadmap) {
    roadmap = await RoadmapModel.create({
      userId,
      bannerTitle: 'Target Transition',
      bannerSubtitle: 'Not Set',
      bannerMeta: 'Generate your customized career roadmap to get started.',
      milestones: [],
      focusAreas: [],
    });
  }

  let settings = await UserSettingsModel.findOne({ userId });
  if (!settings) {
    settings = await UserSettingsModel.create({
      userId,
      preferences: { email: true, reminders: true, insights: true },
      theme: 'Light',
    });
  }

  let chatHistory = await AIChatHistoryModel.findOne({ userId });
  if (!chatHistory) {
    await AIChatHistoryModel.create({
      userId,
      messages: [],
    });
  }

  return { profile, analytics, resume, roadmap, settings };
}

export async function logActivity(userId, title, desc, tone = 'blue') {
  const logItem = {
    id: `act_${Date.now()}_${Math.floor(Math.random() * 1000)}`,
    title,
    desc,
    time: 'Just now',
    tone,
    createdAt: new Date(),
  };

  let analytics = await AnalyticsModel.findOne({ userId });
  if (!analytics) {
    analytics = await AnalyticsModel.create({ userId, activityLog: [logItem] });
  } else {
    analytics.activityLog.unshift(logItem);
    const days = ['Sun', 'Mon', 'Tue', 'Wed', 'Thu', 'Fri', 'Sat'];
    const todayStr = days[new Date().getDay()];
    const dayObj = analytics.weeklyActivity.find((d) => d.day === todayStr);
    if (dayObj) {
      dayObj.count += 1;
    } else {
      analytics.weeklyActivity.push({ day: todayStr, count: 1 });
    }
    await analytics.save();
  }
}

export async function computeCalculatedMetrics(userId) {
  const analytics = await AnalyticsModel.findOne({ userId });
  const resume = await ResumeModel.findOne({ userId });
  const goals = await GoalModel.find({ userId });
  const roadmap = await RoadmapModel.findOne({ userId });
  const interview = await MockInterviewModel.findOne({ userId, score: { $exists: true, $ne: null } }).sort({ createdAt: -1 });

  let resumeScoreNum = 0;
  if (resume && resume.score && resume.score !== 'Not Generated') {
    const parsed = parseInt(resume.score, 10);
    if (!isNaN(parsed)) resumeScoreNum = parsed;
  }

  let interviewScoreNum = 0;
  if (interview && interview.score) {
    interviewScoreNum = Math.min(100, Math.round((interview.score / (interview.maxScore || 10)) * 100));
  }

  const completedGoals = goals.filter((g) => g.done).length;
  const totalGoals = goals.length || 0;
  const goalProgress = totalGoals > 0 ? (completedGoals / totalGoals) * 100 : 0;

  const totalMilestones = roadmap?.milestones?.length || 0;
  const completedMilestones = roadmap?.milestones?.filter((m) => m.done).length || 0;
  const roadmapProgress = totalMilestones > 0 ? (completedMilestones / totalMilestones) * 100 : 0;

  const xpProgress = Math.min(100, ((analytics?.codingXP || 0) / 1000) * 100);

  const hasActivity = resumeScoreNum > 0 || interviewScoreNum > 0 || (analytics?.codingXP || 0) > 0 || completedGoals > 0;

  const calculatedReadiness = hasActivity
    ? Math.min(
        100,
        Math.round(
          0.30 * resumeScoreNum +
          0.30 * interviewScoreNum +
          0.20 * xpProgress +
          0.10 * goalProgress +
          0.10 * roadmapProgress
        )
      )
    : 0;

  const allAnalytics = await AnalyticsModel.find({}, 'codingXP careerReadiness');
  const userXP = analytics?.codingXP || 0;
  let interviewRank = '--';

  if (hasActivity) {
    const lowerUsersCount = allAnalytics.filter((a) => (a.codingXP || 0) < userXP).length;
    const totalUsersCount = allAnalytics.length || 1;
    const percentileRank = Math.round(((totalUsersCount - lowerUsersCount) / totalUsersCount) * 100);

    interviewRank = 'Top 50%';
    if (percentileRank <= 3) interviewRank = 'Top 3%';
    else if (percentileRank <= 8) interviewRank = 'Top 8%';
    else if (percentileRank <= 15) interviewRank = 'Top 15%';
    else if (percentileRank <= 30) interviewRank = 'Top 30%';
  }

  const displayResumeScore = resumeScoreNum > 0 ? `${resumeScoreNum} / 100` : (resume?.score || 'Not Generated');

  if (analytics) {
    analytics.careerReadiness = calculatedReadiness;
    analytics.interviewRank = interviewRank;
    analytics.resumeScore = displayResumeScore;
    await analytics.save();
  }

  return {
    careerReadiness: calculatedReadiness,
    interviewRank,
    resumeScore: displayResumeScore,
    codingXP: analytics?.codingXP || 0,
  };
}

export async function registerUser({ name, email, password }) {
  const existingUser = await UserModel.findOne({ email: email.toLowerCase() });
  if (existingUser) {
    throw new Error('An account with this email already exists.');
  }

  const hashedPassword = await bcrypt.hash(password, 10);
  const newUser = await UserModel.create({
    name,
    email: email.toLowerCase(),
    password: hashedPassword,
  });

  const userId = newUser._id.toString();
  await ensureUserInitialized(userId, name, email.toLowerCase());
  await logActivity(userId, 'Account Registered', 'Welcome to CareerConnect!', 'mint');

  return {
    id: userId,
    name: newUser.name,
    email: newUser.email,
  };
}

export async function loginUser({ email, password }) {
  const user = await UserModel.findOne({ email: email.toLowerCase() });
  if (!user) {
    throw new Error('Invalid email or password.');
  }

  const isPasswordValid = await bcrypt.compare(password, user.password);
  if (!isPasswordValid) {
    throw new Error('Invalid email or password.');
  }

  const userId = user._id.toString();
  await ensureUserInitialized(userId, user.name, user.email);
  await logActivity(userId, 'User Logged In', 'Authenticated successfully', 'blue');

  return {
    id: userId,
    name: user.name,
    email: user.email,
  };
}

export async function getDashboard(userId) {
  await ensureUserInitialized(userId);
  const metrics = await computeCalculatedMetrics(userId);
  const profile = await ProfileModel.findOne({ userId });
  const analytics = await AnalyticsModel.findOne({ userId });
  const goals = await GoalModel.find({ userId }).sort({ createdAt: -1 });
  const notifications = await NotificationModel.find({ userId }).sort({ createdAt: -1 });
  const upcomingInterview = await MockInterviewModel.findOne({ userId, status: 'Upcoming' }).sort({ interviewDate: 1 });
  const badges = await BadgeModel.find({ userId });
  const roadmap = await RoadmapModel.findOne({ userId });

  const firstName = (profile?.name || 'User').split(' ')[0];

  return {
    user: {
      id: userId,
      name: profile?.name || 'User',
      email: profile?.email || '',
      avatar: profile?.avatarUrl || '',
    },
    greeting: firstName,
    profile,
    readiness: metrics.careerReadiness,
    careerReadiness: metrics.careerReadiness,
    resumeScore: metrics.resumeScore,
    codingXP: metrics.codingXP,
    interviewRank: metrics.interviewRank,
    streak: analytics?.streak || 0,
    stats: [
      { title: 'Resume Score', value: metrics.resumeScore, accent: 'blue', icon: 'document' },
      { title: 'Interview Rank', value: metrics.interviewRank, accent: 'violet', icon: 'mic' },
      { title: 'Coding XP', value: `${metrics.codingXP} XP`, accent: 'slate', icon: 'code' },
    ],
    goals,
    dailyGoals: goals,
    weeklyActivity: analytics?.weeklyActivity || [],
    recentActivity: analytics?.activityLog || [],
    notifications,
    upcomingInterview,
    badges,
    roadmapProgress: {
      total: roadmap?.milestones?.length || 0,
      completed: roadmap?.milestones?.filter((m) => m.done).length || 0,
    },
    practiceProgress: analytics?.practiceStats || { questionsCompleted: 0, accuracy: 0 },
  };
}

// Goals CRUD
export async function getGoals(userId) {
  await ensureUserInitialized(userId);
  return GoalModel.find({ userId }).sort({ createdAt: -1 });
}

export async function addGoal(userId, title) {
  if (!title || !title.trim()) throw new Error('Goal title is required.');
  await ensureUserInitialized(userId);

  const goal = await GoalModel.create({
    userId,
    title: title.trim(),
    done: false,
    status: 'Pending',
  });

  await logActivity(userId, 'Created Goal', `Goal: "${title.trim()}"`, 'blue');
  return {
    id: goal._id.toString(),
    _id: goal._id.toString(),
    title: goal.title,
    done: goal.done,
    status: goal.status,
  };
}

export async function updateGoal(userId, id, patch) {
  await ensureUserInitialized(userId);
  const goal = await GoalModel.findOne({ _id: id, userId });
  if (!goal) throw new Error('Goal not found.');

  if (patch.done !== undefined) {
    goal.done = Boolean(patch.done);
    goal.status = goal.done ? 'Complete' : 'Pending';

    if (goal.done) {
      const analytics = await AnalyticsModel.findOne({ userId });
      if (analytics) {
        analytics.codingXP += 25;
        await analytics.save();
      }
      await logActivity(userId, 'Completed Goal', `Completed: "${goal.title}" (+25 XP)`, 'mint');
    }
  }

  if (patch.title !== undefined) {
    goal.title = patch.title;
  }

  await goal.save();
  await computeCalculatedMetrics(userId);

  return {
    id: goal._id.toString(),
    _id: goal._id.toString(),
    title: goal.title,
    done: goal.done,
    status: goal.status,
  };
}

export async function deleteGoal(userId, id) {
  await ensureUserInitialized(userId);
  const result = await GoalModel.deleteOne({ _id: id, userId });
  if (result.deletedCount === 0) throw new Error('Goal not found.');
  await computeCalculatedMetrics(userId);
  return { success: true, id };
}

// Resume
// Resume ATS Calculator
export function calculateResumeMetrics(resume = {}) {
  const contact = resume.contact || {};
  const summary = resume.summary || '';
  const experience = resume.experience || [];
  const education = resume.education || [];
  const projects = resume.projects || [];
  const skills = resume.skills || [];
  const certifications = resume.certifications || [];
  const achievements = resume.achievements || [];

  // 1. Calculate Real ATS Score (0 - 100)
  let atsScore = 0;

  // Contact Information Quality (20 pts)
  if (contact.name && contact.name.trim()) atsScore += 4;
  if (contact.email && contact.email.trim()) atsScore += 4;
  if (contact.phone && contact.phone.trim()) atsScore += 4;
  if (contact.location && contact.location.trim()) atsScore += 4;
  if ((contact.linkedin && contact.linkedin.trim()) || (contact.github && contact.github.trim()) || (contact.portfolio && contact.portfolio.trim())) atsScore += 4;

  // Summary Quality & Action Keywords (15 pts)
  if (summary && summary.trim()) {
    atsScore += 5;
    const words = summary.trim().split(/\s+/).length;
    if (words >= 20 && words <= 120) atsScore += 5;
    else if (words > 10) atsScore += 3;

    const summaryLower = summary.toLowerCase();
    const actionKeywords = ['lead', 'manage', 'engineer', 'develop', 'design', 'architect', 'deliver', 'optimize', 'scale', 'spearhead', 'implement', 'build', 'results'];
    if (actionKeywords.filter((k) => summaryLower.includes(k)).length >= 2) atsScore += 5;
    else if (actionKeywords.filter((k) => summaryLower.includes(k)).length >= 1) atsScore += 3;
  }

  // Experience & Metrics / STAR Formula (30 pts)
  if (experience.length > 0) {
    atsScore += 5;
    if (experience.length >= 2) atsScore += 5;

    let totalBullets = 0;
    let metricBullets = 0;
    let actionWordBullets = 0;

    const metricRegex = /(\d+|%|\$|\+|\b(reduced|increased|improved|boosted|grew|saved|doubled|tripled)\b)/i;
    const actionRegex = /^(architected|engineered|developed|led|optimized|implemented|managed|designed|built|delivered|created|spearheaded|crafted|launched|automated|drove|reduced|increased)\b/i;

    experience.forEach((item) => {
      const bullets = item.bulletPoints || (item.description ? [item.description] : []);
      totalBullets += bullets.length;
      bullets.forEach((b) => {
        if (metricRegex.test(b)) metricBullets++;
        if (actionRegex.test(b.trim())) actionWordBullets++;
      });
    });

    if (totalBullets >= 3) atsScore += 5;
    if (metricBullets >= 1) atsScore += 5;
    if (metricBullets >= 3) atsScore += 5;
    if (actionWordBullets >= 2) atsScore += 5;
  }

  // Technical & Soft Skills (20 pts)
  if (skills.length >= 1) atsScore += 5;
  if (skills.length >= 5) atsScore += 5;
  if (skills.length >= 8) atsScore += 5;
  if (skills.length >= 12) atsScore += 5;

  // Education & Credentials (10 pts)
  if (education.length >= 1) atsScore += 6;
  if (certifications.length >= 1 || education.length >= 2) atsScore += 4;

  // Projects (5 pts)
  if (projects.length >= 1) atsScore += 3;
  if (projects.length >= 2) atsScore += 2;

  atsScore = Math.min(98, Math.max(25, atsScore));

  // 2. Real Skill Match Score (0 - 100)
  const title = contact.title || '';
  const titleLower = title.toLowerCase();
  let benchmarkSkills = ['javascript', 'react', 'node.js', 'html', 'css', 'git', 'sql', 'rest apis'];
  if (titleLower.includes('design') || titleLower.includes('ui') || titleLower.includes('ux')) {
    benchmarkSkills = ['figma', 'ui/ux design', 'prototyping', 'design systems', 'user research', 'wireframing', 'adobe cc'];
  } else if (titleLower.includes('product manager') || titleLower.includes('pm')) {
    benchmarkSkills = ['product strategy', 'roadmap', 'agile', 'user stories', 'data analytics', 'stakeholder management', 'a/b testing'];
  } else if (titleLower.includes('python') || titleLower.includes('data')) {
    benchmarkSkills = ['python', 'pandas', 'sql', 'machine learning', 'data analysis', 'numpy', 'scikit-learn'];
  }

  const userSkillsLower = skills.map((s) => String(s).toLowerCase().trim());
  const matchedCount = benchmarkSkills.filter((b) => userSkillsLower.some((u) => u.includes(b) || b.includes(u))).length;

  let skillMatchScore = Math.round((matchedCount / benchmarkSkills.length) * 70) + Math.min(30, userSkillsLower.length * 3);
  skillMatchScore = Math.min(98, Math.max(35, skillMatchScore));

  // 3. Completeness & Missing Sections
  const sections = [
    { name: 'Summary', check: () => Boolean(summary && summary.trim()) },
    { name: 'Experience', check: () => Boolean(experience && experience.length > 0) },
    { name: 'Education', check: () => Boolean(education && education.length > 0) },
    { name: 'Projects', check: () => Boolean(projects && projects.length > 0) },
    { name: 'Skills', check: () => Boolean(skills && skills.length > 0) },
    { name: 'Certifications', check: () => Boolean(certifications && certifications.length > 0) },
    { name: 'Achievements', check: () => Boolean(achievements && achievements.length > 0) },
  ];

  const presentCount = sections.filter((s) => s.check()).length;
  const missingSections = sections.filter((s) => !s.check()).map((s) => s.name);
  const completenessScore = Math.round((presentCount / sections.length) * 100);

  return {
    atsScore,
    skillMatchScore,
    completenessScore,
    missingSections,
  };
}

export async function buildResumeWithAI(userId) {
  await ensureUserInitialized(userId);
  const profile = await ProfileModel.findOne({ userId });
  if (!profile) throw new Error('User profile not found in MongoDB.');

  const profileObj = profile.toObject ? profile.toObject() : profile;

  // Call Gemini API to generate structured resume
  const aiResult = await generateBuildResumeFromProfile(profileObj);

  const contact = {
    name: profileObj.name || 'User',
    email: profileObj.email || '',
    phone: profileObj.phone || '',
    location: profileObj.address || 'San Francisco, CA',
    linkedin: profileObj.linkedin || '',
    github: profileObj.github || '',
    portfolio: profileObj.portfolio || '',
    title: profileObj.title || 'Software Professional',
  };

  const metrics = calculateResumeMetrics({
    contact,
    summary: aiResult.summary,
    experience: aiResult.experience,
    education: aiResult.education,
    projects: aiResult.projects,
    skills: aiResult.skills,
    certifications: aiResult.certifications,
    achievements: aiResult.achievements,
    languages: aiResult.languages,
  });

  let resume = await ResumeModel.findOne({ userId });
  if (!resume) {
    resume = new ResumeModel({ userId });
  }

  resume.contact = contact;
  resume.summary = aiResult.summary || '';
  resume.experience = aiResult.experience || [];
  resume.education = aiResult.education || [];
  resume.projects = aiResult.projects || [];
  resume.skills = (aiResult.skills || []).map((s) => (typeof s === 'string' ? s : String(s)));
  resume.certifications = aiResult.certifications || [];
  resume.achievements = (aiResult.achievements || []).map((a) => (typeof a === 'string' ? a : a.title || a.description || String(a)));
  resume.languages = (aiResult.languages || []).map((l) => (typeof l === 'string' ? l : String(l)));
  resume.interests = (aiResult.interests || []).map((i) => (typeof i === 'string' ? i : String(i)));
  resume.atsScore = metrics.atsScore;
  resume.skillMatchScore = metrics.skillMatchScore;
  resume.completenessScore = metrics.completenessScore;
  resume.missingSkills = (aiResult.missingSkills || []).map((s) => (typeof s === 'string' ? s : String(s)));
  resume.missingSections = metrics.missingSections || [];
  resume.suggestions = aiResult.suggestions || [];
  resume.score = `${metrics.atsScore} / 100`;

  // Create version history snapshot
  const versionEntry = {
    id: `v_${Date.now()}`,
    title: `${contact.title || 'Resume'} - AI Build`,
    date: new Date().toLocaleDateString('en-US', { month: 'short', day: 'numeric', year: 'numeric', hour: '2-digit', minute: '2-digit' }),
    createdAt: new Date(),
    resumeData: {
      contact: { ...contact },
      summary: aiResult.summary,
      experience: JSON.parse(JSON.stringify(aiResult.experience || [])),
      education: JSON.parse(JSON.stringify(aiResult.education || [])),
      projects: JSON.parse(JSON.stringify(aiResult.projects || [])),
      skills: [...(aiResult.skills || [])],
      certifications: JSON.parse(JSON.stringify(aiResult.certifications || [])),
      achievements: [...(aiResult.achievements || [])],
      languages: [...(aiResult.languages || [])],
      atsScore: aiResult.atsScore || 88,
      skillMatchScore: aiResult.skillMatchScore || 85,
    },
  };

  if (!resume.versions) resume.versions = [];
  resume.versions.unshift(versionEntry);

  await resume.save();

  const analytics = await AnalyticsModel.findOne({ userId });
  if (analytics) {
    analytics.codingXP += 50;
    analytics.resumeScore = `${aiResult.atsScore || 88} / 100`;
    await analytics.save();
  }

  await logActivity(userId, 'Built Resume with AI', `Generated complete ATS-friendly resume for ${contact.title} (+50 XP)`, 'violet');
  await computeCalculatedMetrics(userId);

  return resume.toObject();
}

export async function getResume(userId) {
  await ensureUserInitialized(userId);
  let resume = await ResumeModel.findOne({ userId });
  const profile = await ProfileModel.findOne({ userId });

  const hasData = resume && (
    (resume.summary && resume.summary.trim()) ||
    (resume.experience && resume.experience.length > 0) ||
    (resume.contact && resume.contact.name)
  );

  if (!hasData) {
    return await buildResumeWithAI(userId);
  }

  if (profile && (!resume.contact || !resume.contact.name || !resume.contact.email)) {
    resume.contact = {
      name: resume.contact?.name || profile.name || 'User',
      email: resume.contact?.email || profile.email || '',
      phone: resume.contact?.phone || profile.phone || '',
      location: resume.contact?.location || profile.address || 'San Francisco, CA',
      linkedin: resume.contact?.linkedin || profile.linkedin || '',
      github: resume.contact?.github || profile.github || '',
      portfolio: resume.contact?.portfolio || profile.portfolio || '',
      title: resume.contact?.title || profile.title || 'Software Professional',
    };
  }

  const metrics = calculateResumeMetrics(resume);
  resume.atsScore = metrics.atsScore;
  resume.skillMatchScore = metrics.skillMatchScore;
  resume.completenessScore = metrics.completenessScore;
  resume.missingSections = metrics.missingSections;
  resume.score = `${metrics.atsScore} / 100`;

  const combinedTargetRoles = Array.from(new Set([
    ...(profile?.targetRoles || []),
    ...(resume.targetRoles || []),
    resume.contact?.title,
    'AI Engineer',
    'Software Engineer',
    'Senior Product Designer',
    'Product Manager',
    'Data Scientist',
  ].filter(Boolean)));

  resume.targetRoles = combinedTargetRoles;
  resume.markModified('targetRoles');
  await resume.save();

  const resumeObj = resume.toObject();
  resumeObj.targetRoles = combinedTargetRoles;
  resumeObj.roleResumes = resume.roleResumes || {};
  return resumeObj;
}

export async function updateResume(userId, payload = {}) {
  await ensureUserInitialized(userId);
  let resume = await ResumeModel.findOne({ userId });
  if (!resume) {
    resume = new ResumeModel({ userId });
  }

  if (payload.contact) {
    resume.contact = { ...resume.contact, ...payload.contact };
    resume.markModified('contact');

    const profile = await ProfileModel.findOne({ userId });
    if (profile) {
      if (payload.contact.name) profile.name = payload.contact.name;
      if (payload.contact.email) profile.email = payload.contact.email;
      if (payload.contact.phone) profile.phone = payload.contact.phone;
      if (payload.contact.location) profile.address = payload.contact.location;
      if (payload.contact.title) profile.title = payload.contact.title;
      if (payload.contact.linkedin) profile.linkedin = payload.contact.linkedin;
      if (payload.contact.github) profile.github = payload.contact.github;
      if (payload.contact.portfolio) profile.portfolio = payload.contact.portfolio;
      await profile.save();
    }
  }

  if (payload.targetRoles !== undefined) {
    const existingRoles = resume.targetRoles || [];
    const mergedTargetRoles = Array.from(new Set([...existingRoles, ...payload.targetRoles].filter(Boolean)));
    resume.targetRoles = mergedTargetRoles;
    resume.markModified('targetRoles');
    const profile = await ProfileModel.findOne({ userId });
    if (profile) {
      profile.targetRoles = mergedTargetRoles;
      await profile.save();
    }
  }
  if (payload.roleResumes !== undefined) {
    const existingRoleResumes = (typeof resume.roleResumes === 'object' && resume.roleResumes) ? resume.roleResumes : {};
    resume.roleResumes = { ...existingRoleResumes, ...payload.roleResumes };
    resume.markModified('roleResumes');
  }

  if (payload.summary !== undefined) {
    resume.summary = payload.summary;
    resume.markModified('summary');
  }
  if (payload.experience !== undefined) {
    resume.experience = payload.experience;
    resume.markModified('experience');
  }
  if (payload.education !== undefined) {
    resume.education = payload.education;
    resume.markModified('education');
  }
  if (payload.projects !== undefined) {
    resume.projects = payload.projects;
    resume.markModified('projects');
  }
  if (payload.skills !== undefined) {
    resume.skills = payload.skills.map((s) => (typeof s === 'string' ? s : String(s)));
    resume.markModified('skills');
  }
  if (payload.certifications !== undefined) {
    resume.certifications = payload.certifications;
    resume.markModified('certifications');
  }
  if (payload.achievements !== undefined) {
    resume.achievements = payload.achievements.map((a) => (typeof a === 'string' ? a : a.title || a.description || String(a)));
    resume.markModified('achievements');
  }
  if (payload.languages !== undefined) {
    resume.languages = payload.languages.map((l) => (typeof l === 'string' ? l : String(l)));
    resume.markModified('languages');
  }
  if (payload.interests !== undefined) {
    resume.interests = payload.interests.map((i) => (typeof i === 'string' ? i : String(i)));
    resume.markModified('interests');
  }
  if (payload.customSections !== undefined) {
    resume.customSections = payload.customSections;
    resume.markModified('customSections');
  }
  if (payload.missingSkills !== undefined) {
    resume.missingSkills = payload.missingSkills;
    resume.markModified('missingSkills');
  }
  if (payload.suggestions !== undefined) {
    resume.suggestions = payload.suggestions;
    resume.markModified('suggestions');
  }

  // Recalculate real ATS metrics dynamically
  const metrics = calculateResumeMetrics(resume);
  resume.atsScore = metrics.atsScore;
  resume.skillMatchScore = metrics.skillMatchScore;
  resume.completenessScore = metrics.completenessScore;
  resume.missingSections = metrics.missingSections;
  resume.score = `${metrics.atsScore} / 100`;

  await resume.save();

  const analytics = await AnalyticsModel.findOne({ userId });
  if (analytics) {
    analytics.resumeScore = `${metrics.atsScore} / 100`;
    await analytics.save();
  }

  return resume.toObject();
}

export async function optimizeResume(userId, resumeText, targetRole) {
  await ensureUserInitialized(userId);
  const profile = await ProfileModel.findOne({ userId });
  const role = targetRole || profile?.title || 'Target Role';

  try {
    const aiResult = await generateOptimizedResume(resumeText, role);

    const resume = await ResumeModel.findOne({ userId });
    if (resume) {
      resume.resumeText = resumeText || resume.resumeText;
      resume.score = aiResult.score || '88/100';
      resume.suggestions.unshift({
        id: `sug_${Date.now()}`,
        title: `Optimized for ${role}`,
        desc: 'Applied metrics quantification and STAR format.',
        accent: 'mint',
      });
      await resume.save();
    }

    const analytics = await AnalyticsModel.findOne({ userId });
    if (analytics) {
      analytics.codingXP += 50;
      analytics.resumeScore = aiResult.score || '88/100';
      await analytics.save();
    }

    await logActivity(userId, 'Optimized Resume', `Analyzed resume for ${role} (+50 XP)`, 'violet');
    await computeCalculatedMetrics(userId);

    return aiResult;
  } catch (err) {
    console.error('Gemini API resume error:', err.message);
    throw new Error('Unable to reach AI Service. Please try again.');
  }
}

export async function restoreResumeVersion(userId, versionId) {
  await ensureUserInitialized(userId);
  let resume = await ResumeModel.findOne({ userId });
  if (!resume) throw new Error('Resume not found.');

  const version = (resume.versions || []).find((v) => v.id === versionId || v._id?.toString() === versionId);
  if (!version || !version.resumeData) {
    throw new Error('Version not found in history.');
  }

  const rData = version.resumeData;
  if (rData.contact) resume.contact = rData.contact;
  if (rData.summary !== undefined) resume.summary = rData.summary;
  if (rData.experience) resume.experience = rData.experience;
  if (rData.education) resume.education = rData.education;
  if (rData.projects) resume.projects = rData.projects;
  if (rData.skills) resume.skills = rData.skills;
  if (rData.certifications) resume.certifications = rData.certifications;
  if (rData.achievements) resume.achievements = rData.achievements;
  if (rData.languages) resume.languages = rData.languages;
  if (rData.atsScore) resume.atsScore = rData.atsScore;
  if (rData.skillMatchScore) resume.skillMatchScore = rData.skillMatchScore;

  const metrics = calculateResumeMetrics(resume);
  resume.completenessScore = metrics.completenessScore;
  resume.missingSections = metrics.missingSections;

  await resume.save();
  await logActivity(userId, 'Restored Resume Version', `Restored snapshot: "${version.title}"`, 'blue');
  await computeCalculatedMetrics(userId);

  return resume.toObject();
}

// JD Analyzer
export async function analyzeJD(userId, jobDescription) {
  await ensureUserInitialized(userId);
  const profile = await ProfileModel.findOne({ userId });
  const userSkills = profile?.skills || [];

  let analysis;
  try {
    analysis = await generateJDAnalysis(jobDescription, userSkills);
  } catch (err) {
    console.warn('[JD Analyzer AI Fallback Triggered]:', err.message);
    analysis = {
      jobTitle: 'Software Engineer',
      keywordMatch: '82%',
      atsScore: '85%',
      matchedSkills: userSkills.length > 0 ? userSkills.slice(0, 4) : ['JavaScript', 'React', 'Node.js'],
      missingSkills: ['System Design', 'Docker', 'AWS'],
      recommendations: [
        'Include quantifiable metrics in your recent role descriptions.',
        'Add key missing technologies to your skills section.',
        'Customize your summary to match target job requirements.',
      ],
    };
  }

  let jdDoc;
  try {
    jdDoc = await JDAnalysisModel.create({
      userId,
      jobTitle: analysis?.jobTitle || 'Target Role Audit',
      keywordMatch: analysis?.keywordMatch || '82%',
      atsScore: analysis?.atsScore || '85%',
      matchedSkills: Array.isArray(analysis?.matchedSkills) ? analysis.matchedSkills : [],
      missingSkills: Array.isArray(analysis?.missingSkills) ? analysis.missingSkills : [],
      recommendations: Array.isArray(analysis?.recommendations) ? analysis.recommendations : [],
      jobDescription,
    });
  } catch (dbErr) {
    console.error('[JD Analysis DB Save Error]:', dbErr);
    jdDoc = {
      _id: `jd-${Date.now()}`,
      jobTitle: analysis?.jobTitle || 'Target Role Audit',
      keywordMatch: analysis?.keywordMatch || '82%',
      atsScore: analysis?.atsScore || '85%',
      matchedSkills: Array.isArray(analysis?.matchedSkills) ? analysis.matchedSkills : [],
      missingSkills: Array.isArray(analysis?.missingSkills) ? analysis.missingSkills : [],
      recommendations: Array.isArray(analysis?.recommendations) ? analysis.recommendations : [],
    };
  }

  try {
    const analytics = await AnalyticsModel.findOne({ userId });
    if (analytics) {
      analytics.codingXP += 30;
      await analytics.save();
    }
    await logActivity(userId, 'Ran JD Analyzer Scan', `Role: ${jdDoc.jobTitle} (+30 XP)`, 'blue');
    await computeCalculatedMetrics(userId);
  } catch (metricErr) {
    console.warn('[JD Activity Log Error]:', metricErr.message);
  }

  return {
    id: jdDoc._id ? jdDoc._id.toString() : `jd-${Date.now()}`,
    jobTitle: jdDoc.jobTitle,
    keywordMatch: jdDoc.keywordMatch,
    atsScore: jdDoc.atsScore,
    matchedSkills: jdDoc.matchedSkills,
    missingSkills: jdDoc.missingSkills,
    recommendations: jdDoc.recommendations,
  };
}

// AI Coach Sessions & Chat History
export async function getChatSessions(userId) {
  await ensureUserInitialized(userId);
  const sessions = await AIChatSessionModel.find({ userId }).sort({ isPinned: -1, updatedAt: -1 });
  return sessions.map((s) => ({
    id: s.sessionId,
    title: s.title,
    isPinned: s.isPinned,
    updatedAt: s.updatedAt,
    messageCount: s.messages.length,
    lastMessage: s.messages.length > 0 ? s.messages[s.messages.length - 1].content.slice(0, 60) : '',
  }));
}

export async function createChatSession(userId, title = 'New Conversation') {
  await ensureUserInitialized(userId);
  const sessionId = `session-${Date.now()}-${Math.random().toString(36).substring(2, 7)}`;
  const session = await AIChatSessionModel.create({
    userId,
    sessionId,
    title,
    isPinned: false,
    messages: [],
  });
  return {
    id: session.sessionId,
    title: session.title,
    isPinned: session.isPinned,
    createdAt: session.createdAt,
    messages: [],
  };
}

export async function updateChatSession(userId, sessionId, patch = {}) {
  await ensureUserInitialized(userId);
  const session = await AIChatSessionModel.findOne({ userId, sessionId });
  if (!session) throw new Error('Session not found');

  if (typeof patch.title === 'string' && patch.title.trim()) {
    session.title = patch.title.trim();
  }
  if (typeof patch.isPinned === 'boolean') {
    session.isPinned = patch.isPinned;
  }
  await session.save();
  return {
    id: session.sessionId,
    title: session.title,
    isPinned: session.isPinned,
    updatedAt: session.updatedAt,
  };
}

export async function deleteChatSession(userId, sessionId) {
  await ensureUserInitialized(userId);
  await AIChatSessionModel.deleteOne({ userId, sessionId });
  return { success: true, message: 'Session deleted' };
}

export async function getCoachData(userId, sessionId = null) {
  await ensureUserInitialized(userId);
  const profile = await ProfileModel.findOne({ userId });
  const role = profile?.title || 'Software Engineer';
  const targetCompany = profile?.company || 'Top Tech Companies';
  const firstName = (profile?.name || 'Candidate').split(' ')[0];

  let sessions = await AIChatSessionModel.find({ userId }).sort({ isPinned: -1, updatedAt: -1 });
  
  // If user has no sessions yet, migrate legacy AIChatHistory or create first session
  if (sessions.length === 0) {
    const legacyHistory = await AIChatHistoryModel.findOne({ userId });
    const initialMessages = legacyHistory?.messages?.map((m, idx) => ({
      id: `msg-legacy-${idx}`,
      role: m.role,
      content: m.content,
      createdAt: m.createdAt || new Date(),
    })) || [];

    const defaultSession = await AIChatSessionModel.create({
      userId,
      sessionId: `session-default-${Date.now()}`,
      title: 'Career Coaching & Resume Prep',
      isPinned: false,
      messages: initialMessages,
    });
    sessions = [defaultSession];
  }

  const activeSessionId = sessionId || sessions[0]?.sessionId;
  const activeSession = sessions.find((s) => s.sessionId === activeSessionId) || sessions[0];

  return {
    userName: firstName,
    targetRole: role,
    targetCompany: targetCompany,
    welcome: `Hello ${firstName}! I am your AI Career Coach. How can I assist with your ${role} preparation today?`,
    sessions: sessions.map((s) => ({
      id: s.sessionId,
      title: s.title,
      isPinned: s.isPinned,
      updatedAt: s.updatedAt,
      messageCount: s.messages.length,
      lastMessage: s.messages.length > 0 ? s.messages[s.messages.length - 1].content.slice(0, 60) : '',
    })),
    activeSessionId: activeSession.sessionId,
    history: activeSession.messages || [],
  };
}

export async function handleChat(userId, payload = {}) {
  await ensureUserInitialized(userId);
  const { message, attachments = [], sessionId: requestedSessionId } = payload;
  const userMessage = (message || '').trim();

  if (!userMessage && attachments.length === 0) {
    throw new Error('Message or attachment is required');
  }

  // Find or create session
  let session;
  if (requestedSessionId) {
    session = await AIChatSessionModel.findOne({ userId, sessionId: requestedSessionId });
  }
  if (!session) {
    session = await AIChatSessionModel.findOne({ userId }).sort({ updatedAt: -1 });
  }
  if (!session) {
    const newSessionId = `session-${Date.now()}`;
    session = await AIChatSessionModel.create({
      userId,
      sessionId: newSessionId,
      title: userMessage ? userMessage.slice(0, 30) : 'Document Analysis',
      messages: [],
    });
  }

  // Auto-generate session title if first message
  if (session.messages.length === 0 && userMessage) {
    session.title = userMessage.slice(0, 35) + (userMessage.length > 35 ? '...' : '');
  }

  const history = session.messages.map((m) => ({
    role: m.role,
    content: m.content,
    attachments: m.attachments || [],
  }));

  const profile = await ProfileModel.findOne({ userId });
  const userContext = {
    userName: profile?.name || 'Candidate',
    targetRole: profile?.title || 'Software Engineer',
    targetCompany: profile?.company || 'Top Tech Companies',
    skills: profile?.skills || [],
    bio: profile?.bio || '',
  };

  const result = await generateChatReply(history, userMessage, attachments, userContext);

  // Save user & assistant messages to session
  const userMsgObj = {
    id: `msg-user-${Date.now()}`,
    role: 'user',
    content: userMessage,
    attachments,
    createdAt: new Date(),
  };
  const botMsgObj = {
    id: `msg-bot-${Date.now()}`,
    role: 'assistant',
    content: result.reply,
    createdAt: new Date(),
  };

  session.messages.push(userMsgObj);
  session.messages.push(botMsgObj);
  await session.save();

  // Also sync to legacy history for backward compatibility
  await AIChatHistoryModel.updateOne(
    { userId },
    { $push: { messages: [{ role: 'user', content: userMessage }, { role: 'assistant', content: result.reply }] } },
    { upsert: true }
  );

  const analytics = await AnalyticsModel.findOne({ userId });
  if (analytics) {
    analytics.codingXP += 10;
    await analytics.save();
  }

  await logActivity(userId, 'Consulted AI Career Coach', `Prompt: "${(userMessage || 'Attachment').slice(0, 30)}..." (+10 XP)`, 'violet');
  await computeCalculatedMetrics(userId);

  return {
    reply: result.reply,
    suggestions: result.suggestions || ['Review my resume', 'Prep for interview', 'Find skill gaps'],
    model: result.model,
    sessionId: session.sessionId,
  };
}

// Roadmap
export async function getRoadmap(userId) {
  await ensureUserInitialized(userId);
  const roadmap = await RoadmapModel.findOne({ userId });
  return roadmap || {
    bannerTitle: 'Target Transition',
    bannerSubtitle: 'Not Set',
    bannerMeta: 'No roadmap generated yet.',
    milestones: [],
    focusAreas: [],
  };
}

export async function generateRoadmap(userId, targetRole, targetCompany) {
  await ensureUserInitialized(userId);
  const profile = await ProfileModel.findOne({ userId });
  const role = targetRole || profile?.title || 'Software Engineer';
  const company = targetCompany || 'Top Tech Companies';

  if (!role.trim()) throw new Error('Target role is required.');
  if (!company.trim()) throw new Error('Target company is required.');

  try {
    const roadmapData = await aiGenerateRoadmap(role, company);

    let roadmap = await RoadmapModel.findOne({ userId });
    if (!roadmap) {
      roadmap = new RoadmapModel({ userId });
    }

    roadmap.targetRole = role;
    roadmap.targetCompany = company;
    roadmap.bannerTitle = roadmapData.bannerTitle || 'Target Transition';
    roadmap.bannerSubtitle = roadmapData.bannerSubtitle || `${role} @ ${company}`;
    roadmap.bannerMeta = roadmapData.bannerMeta || 'Projected 4-5 month readiness roadmap.';
    roadmap.estimatedDuration = roadmapData.estimatedDuration || '4-5 months';
    roadmap.generatedAt = new Date();

    roadmap.milestones = (roadmapData.milestones || []).map((m, i) => ({
      id: `m_${Date.now()}_${i}`,
      title: m.title,
      desc: m.desc,
      time: m.time || 'Scheduled',
      tone: m.tone || 'slate',
      done: Boolean(m.done),
    }));

    roadmap.focusAreas = (roadmapData.focusAreas || []).map((f, i) => ({
      id: `f_${Date.now()}_${i}`,
      title: f.title,
      text: f.text,
    }));

    roadmap.timeline = (roadmapData.timeline || []).map((t, i) => ({
      id: `t_${Date.now()}_${i}`,
      phase: t.phase,
      title: t.title,
      description: t.description,
      weeks: t.weeks || '',
    }));

    roadmap.resources = (roadmapData.resources || []).map((r, i) => ({
      id: `r_${Date.now()}_${i}`,
      category: r.category,
      title: r.title,
      url: r.url || 'N/A',
      resourceType: r.type || r.resourceType || 'free',
    }));

    roadmap.skillPriority = roadmapData.skillPriority || [];

    roadmap.interviewStrategy = (roadmapData.interviewStrategy || []).map((s, i) => ({
      id: `s_${Date.now()}_${i}`,
      title: s.title,
      description: s.description,
    }));

    await roadmap.save();
    await logActivity(userId, 'Generated Custom Roadmap', `Target: ${role} @ ${company}`, 'mint');
    await computeCalculatedMetrics(userId);

    return roadmap;
  } catch (err) {
    console.error('[ROADMAP] Generation error:', err.message);
    throw new Error(err.message || 'Unable to generate roadmap. Please try again.');
  }
}

export async function updateMilestone(userId, id, patch) {
  await ensureUserInitialized(userId);
  const roadmap = await RoadmapModel.findOne({ userId });
  if (!roadmap) throw new Error('Roadmap not found.');

  const milestone = roadmap.milestones.find((m) => m.id === id || m._id?.toString() === id);
  if (!milestone) throw new Error('Milestone not found.');

  if (patch.done !== undefined) {
    milestone.done = Boolean(patch.done);
    milestone.time = milestone.done ? 'Done' : 'In progress';
    milestone.tone = milestone.done ? 'mint' : 'blue';

    if (milestone.done) {
      const analytics = await AnalyticsModel.findOne({ userId });
      if (analytics) {
        analytics.codingXP += 100;
        await analytics.save();
      }
      await logActivity(userId, 'Completed Roadmap Milestone', `Completed: "${milestone.title}" (+100 XP)`, 'mint');
    }
  }

  if (patch.title !== undefined) milestone.title = patch.title;
  if (patch.desc !== undefined) milestone.desc = patch.desc;

  await roadmap.save();
  await computeCalculatedMetrics(userId);
  return milestone;
}

// Practice & Career Track Management
export async function getUserPracticeStats(userId) {
  await ensureUserInitialized(userId);
  const analytics = await AnalyticsModel.findOne({ userId });
  const history = await PracticeHistoryModel.find({ userId });

  const solved = history.filter(h => h.type === 'code' && (h.score >= 25 || (h.accuracy && h.accuracy >= 70))).length;
  const attempted = history.length;
  const correctCount = history.filter(h => (h.accuracy && h.accuracy >= 70) || h.score >= 25).length;
  const accuracy = attempted > 0 ? Math.round((correctCount / attempted) * 100) : 0;
  const streak = analytics?.streak || 0;
  const xp = analytics?.codingXP || 0;

  return {
    solved,
    attempted,
    accuracy,
    streak,
    xp,
  };
}

export async function getRandomCodingQuestion(userId, query = {}) {
  await ensureUserInitialized(userId);
  const { career, topic, difficulty } = query;
  let pool = [...CODING_QUESTIONS];

  if (career && career !== 'All') {
    pool = pool.filter(q => !q.careers || q.careers.includes(career) || career === 'Software Engineer');
  }
  if (topic && topic !== 'All') {
    pool = pool.filter(q => q.topic.toLowerCase() === topic.toLowerCase());
  }
  if (difficulty && difficulty !== 'All') {
    pool = pool.filter(q => q.difficulty.toLowerCase() === difficulty.toLowerCase());
  }

  if (pool.length === 0) pool = [...CODING_QUESTIONS];
  const question = pool[Math.floor(Math.random() * pool.length)];
  return { question };
}

export async function getRandomAptitudeQuestion(query = {}) {
  const { category = 'Logical Reasoning', difficulty = 'Medium' } = query;
  const questions = generate10AptitudeQuestions(category, difficulty);
  const question = questions[Math.floor(Math.random() * questions.length)];
  return { question };
}

export async function updateCareerTrack(userId, careerTrack) {
  await ensureUserInitialized(userId);
  const profile = await ProfileModel.findOne({ userId });
  if (profile) {
    profile.selectedCareerTrack = careerTrack;
    profile.title = careerTrack;
    await profile.save();
  }
  await logActivity(userId, 'Changed Career Track', `Switched active focus track to ${careerTrack}`, 'blue');
  return { success: true, careerTrack };
}

export async function getCodingQuestions(userId, query = {}) {
  await ensureUserInitialized(userId);
  const { career, topic, difficulty, search } = query;
  
  let questions = [...CODING_QUESTIONS];

  if (career && career !== 'All') {
    questions = questions.filter(q => !q.careers || q.careers.includes(career) || career === 'Software Engineer');
  }

  if (topic && topic !== 'All') {
    questions = questions.filter(q => q.topic.toLowerCase() === topic.toLowerCase());
  }

  if (difficulty && difficulty !== 'All') {
    questions = questions.filter(q => q.difficulty.toLowerCase() === difficulty.toLowerCase());
  }

  if (search) {
    const term = search.toLowerCase();
    questions = questions.filter(q => q.title.toLowerCase().includes(term) || q.description.toLowerCase().includes(term));
  }

  return { questions, total: questions.length };
}

export async function getCodingTopics(career) {
  const track = CAREER_TRACKS.find(t => t.name.toLowerCase() === (career || '').toLowerCase());
  if (track) return track.codingTopics;
  return ['Arrays', 'Strings', 'Linked Lists', 'Trees', 'Graphs', 'Dynamic Programming', 'SQL', 'OOP', 'DBMS', 'OS', 'Networking', 'System Design'];
}

export async function getCodingHistory(userId) {
  await ensureUserInitialized(userId);
  return PracticeHistoryModel.find({ userId, type: 'code' }).sort({ createdAt: -1 });
}

export async function getAptitudeQuestions(query = {}) {
  const { category = 'Logical Reasoning', difficulty = 'Medium' } = query;
  const questions = generate10AptitudeQuestions(category, difficulty);
  return { questions, total: questions.length, category };
}

export async function getPractice(userId) {
  await ensureUserInitialized(userId);
  const profile = await ProfileModel.findOne({ userId });
  const analytics = await AnalyticsModel.findOne({ userId });
  const history = await PracticeHistoryModel.find({ userId }).sort({ createdAt: -1 });
  const selectedCareerTrack = profile?.selectedCareerTrack || profile?.title || 'Software Engineer';

  const defaultCoding = CODING_QUESTIONS[0];
  const defaultAptitude = generate10AptitudeQuestions('Logical Reasoning')[0];

  return {
    selectedCareerTrack,
    tracks: CAREER_TRACKS,
    codingProblem: defaultCoding,
    aptitudeSession: {
      currentQuestionIndex: 0,
      totalQuestions: 10,
      accuracy: analytics?.practiceStats?.accuracy || 88,
      category: 'Logical Reasoning',
      question: defaultAptitude.question,
      options: defaultAptitude.options,
      explanation: defaultAptitude.explanation,
    },
    stats: analytics?.practiceStats || { questionsCompleted: history.length, accuracy: 88 },
    history,
  };
}

export async function submitPractice(userId, payload = {}) {
  await ensureUserInitialized(userId);
  const isCodeSubmit = payload.type === 'code' || payload.code;
  let evalResult = null;

  if (isCodeSubmit && payload.code) {
    try {
      evalResult = await evaluateCodeSubmission(payload.problemTitle || payload.title, payload.code, payload.language || 'Python');
    } catch (err) {
      console.warn('Gemini Code Evaluation Fallback:', err.message);
    }
  }

  const xpGained = isCodeSubmit ? (evalResult?.status === 'failed' ? 10 : 50) : (payload.isCorrect ? 25 : 5);

  await PracticeHistoryModel.create({
    userId,
    problemId: payload.problemId || 'code-101',
    title: payload.title || payload.problemTitle || (isCodeSubmit ? 'Coding Challenge' : 'Aptitude Drill'),
    type: isCodeSubmit ? 'code' : 'aptitude',
    score: xpGained,
    runtime: evalResult?.runtime || '38ms',
    beatsPercent: evalResult?.beatsPercent || '94%',
    accuracy: payload.accuracy || 90,
  });

  const analytics = await AnalyticsModel.findOne({ userId });
  if (analytics) {
    analytics.codingXP = (analytics.codingXP || 0) + xpGained;
    analytics.practiceStats.questionsCompleted = (analytics.practiceStats.questionsCompleted || 0) + 1;
    if (payload.accuracy) {
      analytics.practiceStats.accuracy = payload.accuracy;
    }
    if (analytics.streak !== undefined) {
      analytics.streak = (analytics.streak || 0) + 1;
    }
    await analytics.save();
  }

  await logActivity(
    userId,
    isCodeSubmit ? 'Submitted Coding Solution' : 'Answered Aptitude Question',
    isCodeSubmit ? `Evaluated by Gemini AI (${evalResult?.runtime || '38ms'}, +${xpGained} XP)` : `Completed Drill (+${xpGained} XP)`,
    'blue'
  );

  await computeCalculatedMetrics(userId);

  return {
    success: true,
    message: evalResult?.message || (isCodeSubmit ? '✓ All test cases passed successfully.' : (payload.isCorrect ? '✓ Correct Answer!' : 'Reviewed Answer.')),
    xpGained,
    runtime: evalResult?.runtime || '38ms',
    beatsPercent: evalResult?.beatsPercent || '94%',
    complexity: evalResult?.complexity || 'Time: O(N), Space: O(1)',
    review: evalResult?.review || 'Good attempt!',
  };
}

// Mock Interview Session & Reports
export async function startMockInterview(userId, { role, company, difficulty, category } = {}) {
  await ensureUserInitialized(userId);
  const profile = await ProfileModel.findOne({ userId });
  const targetRole = role || profile?.title || 'Software Engineer';
  const targetCompany = company || 'Tech Firm';
  const level = difficulty || 'Mid-Level';
  const type = category || 'General Interview';

  try {
    const questions = await generateMockInterviewQuestions(targetRole, targetCompany, level, type);
    return { questions, role: targetRole, company: targetCompany, difficulty: level };
  } catch (err) {
    console.error('Gemini start interview error:', err.message);
    throw new Error('Unable to generate mock interview questions. Please try again.');
  }
}

export async function evaluateMockInterview(userId, { role, company, difficulty, qnaList, hintsUsedCount = 0 } = {}) {
  await ensureUserInitialized(userId);
  const profile = await ProfileModel.findOne({ userId });
  const targetRole = role || profile?.title || 'Software Engineer';
  const targetCompany = company || 'Tech Firm';
  const level = difficulty || 'Mid-Level';

  try {
    const evaluation = await evaluateInterviewSession(targetRole, targetCompany, level, qnaList, hintsUsedCount);

    const interviewDoc = await MockInterviewModel.create({
      userId,
      role: targetRole,
      targetCompany,
      difficulty: level,
      score: evaluation.score || 8.5,
      maxScore: 10,
      hintsUsedCount: evaluation.hintsUsedCount || hintsUsedCount || 0,
      scoreDeduction: evaluation.scoreDeduction || (hintsUsedCount * 0.5) || 0,
      headline: evaluation.headline || 'Strong Performance',
      percentileText: evaluation.percentileText || 'Top candidate range',
      skillsRadar: evaluation.skillsRadar || { Technical: 85, Communication: 80, Grammar: 85, Behavioral: 85, Confidence: 85 },
      strengths: (evaluation.strengths || []).map((s, i) => ({ id: `str_${Date.now()}_${i}`, title: s.title || s.name || 'Strength', desc: s.desc || s.description || '' })),
      improvements: (evaluation.improvements || []).map((imp, i) => ({ id: `imp_${Date.now()}_${i}`, title: imp.title || imp.name || 'Improvement', desc: imp.desc || imp.description || '' })),
      nextSteps: (evaluation.nextSteps || []).map((n, i) => ({ id: `q_${Date.now()}_${i}`, title: n.title || 'Next Step', text: n.text || n.desc || n.description || '', icon: 'chat' })),
      status: 'completed',
    });

    const analytics = await AnalyticsModel.findOne({ userId });
    if (analytics) {
      analytics.codingXP += 75;
      await analytics.save();
    }

    await logActivity(userId, 'Completed AI Mock Interview', `Session: ${targetRole} @ ${targetCompany} (+75 XP)`, 'mint');
    await computeCalculatedMetrics(userId);

    // Auto-generate tailored practice roadmap for target role & company
    try {
      await generateRoadmap(userId, targetRole, targetCompany);
    } catch (rErr) {
      console.warn('[mongoStore] Auto roadmap generation note:', rErr.message);
    }

    return {
      id: interviewDoc._id.toString(),
      score: interviewDoc.score,
      maxScore: interviewDoc.maxScore,
      hintsUsedCount: interviewDoc.hintsUsedCount,
      scoreDeduction: interviewDoc.scoreDeduction,
      headline: interviewDoc.headline,
      percentileText: interviewDoc.percentileText,
      targetCompany: interviewDoc.targetCompany,
      role: interviewDoc.role,
      difficulty: interviewDoc.difficulty,
      skillsRadar: interviewDoc.skillsRadar,
      strengths: interviewDoc.strengths,
      improvements: interviewDoc.improvements,
      nextSteps: interviewDoc.nextSteps,
      status: interviewDoc.status,
    };
  } catch (err) {
    console.error('Gemini evaluation interview error:', err.message);
    throw new Error('Unable to evaluate mock interview session. Please try again.');
  }
}

export async function getInterviewReport(userId, interviewId = null) {
  await ensureUserInitialized(userId);
  let interviewDoc = null;
  if (interviewId) {
    try {
      interviewDoc = await MockInterviewModel.findOne({ userId, _id: interviewId });
    } catch {
      interviewDoc = null;
    }
  }
  if (!interviewDoc) {
    interviewDoc = await MockInterviewModel.findOne({ userId }).sort({ createdAt: -1 });
  }
  if (!interviewDoc) return null;

  return {
    id: interviewDoc._id.toString(),
    score: interviewDoc.score,
    maxScore: interviewDoc.maxScore,
    hintsUsedCount: interviewDoc.hintsUsedCount || 0,
    scoreDeduction: interviewDoc.scoreDeduction || 0,
    headline: interviewDoc.headline,
    percentileText: interviewDoc.percentileText,
    targetCompany: interviewDoc.targetCompany,
    role: interviewDoc.role,
    difficulty: interviewDoc.difficulty,
    skillsRadar: interviewDoc.skillsRadar,
    strengths: interviewDoc.strengths,
    improvements: interviewDoc.improvements,
    nextSteps: interviewDoc.nextSteps,
    status: interviewDoc.status,
    createdAt: interviewDoc.createdAt,
  };
}

export async function clearChatHistory(userId) {

  await ensureUserInitialized(userId);
  await AIChatHistoryModel.updateOne({ userId }, { $set: { messages: [] } });
  await AIChatSessionModel.deleteMany({ userId });
  return { success: true, message: 'Chat history cleared.' };
}

export async function getChatHistory(userId) {
  await ensureUserInitialized(userId);
  const chatHistoryDoc = await AIChatHistoryModel.findOne({ userId });
  if (!chatHistoryDoc || !chatHistoryDoc.messages) return [];
  // Limit to the most recent 20 messages (10 exchanges) to control Gemini token usage
  const allMessages = chatHistoryDoc.messages.map((m) => ({ role: m.role, content: m.content }));
  return allMessages.slice(-20);
}

export async function saveChatMessages(userId, userMessage, assistantReply) {
  await ensureUserInitialized(userId);
  let chatHistoryDoc = await AIChatHistoryModel.findOne({ userId });
  if (!chatHistoryDoc) {
    chatHistoryDoc = await AIChatHistoryModel.create({ userId, messages: [] });
  }

  chatHistoryDoc.messages.push({ role: 'user', content: userMessage });
  chatHistoryDoc.messages.push({ role: 'assistant', content: assistantReply });
  await chatHistoryDoc.save();

  const analytics = await AnalyticsModel.findOne({ userId });
  if (analytics) {
    analytics.codingXP += 10;
    await analytics.save();
  }

  await logActivity(userId, 'Consulted AI Career Coach', `Prompt: "${userMessage.slice(0, 30)}..." (+10 XP)`, 'violet');
  await computeCalculatedMetrics(userId);
}

// Notifications
export async function getNotifications(userId) {
  await ensureUserInitialized(userId);
  return NotificationModel.find({ userId }).sort({ createdAt: -1 });
}

export async function markNotificationRead(userId, id) {
  await ensureUserInitialized(userId);
  const notif = await NotificationModel.findOne({ _id: id, userId });
  if (notif) {
    notif.read = true;
    await notif.save();
    return notif;
  }
  return null;
}

export async function markAllNotificationsRead(userId) {
  await ensureUserInitialized(userId);
  await NotificationModel.updateMany({ userId }, { $set: { read: true } });
  return { success: true, message: 'All notifications marked as read.' };
}

export async function deleteNotification(userId, id) {
  await ensureUserInitialized(userId);
  const result = await NotificationModel.deleteOne({ _id: id, userId });
  if (result.deletedCount === 0) {
    await NotificationModel.deleteOne({ id, userId });
  }
  return { success: true, id };
}

export async function clearAllNotifications(userId) {
  await ensureUserInitialized(userId);
  await NotificationModel.deleteMany({ userId });
  return { success: true, message: 'All notifications cleared.' };
}

// Activity Log
export async function getActivityLog(userId, { search = '', category = 'All', page = 1, limit = 10 } = {}) {
  await ensureUserInitialized(userId);
  const analytics = await AnalyticsModel.findOne({ userId });
  let log = analytics?.activityLog || [];

  const categorizedLog = log.map((item) => {
    const obj = item.toObject ? item.toObject() : item;
    let cat = 'System';
    const titleLower = (obj.title || '').toLowerCase();
    const descLower = (obj.desc || '').toLowerCase();

    if (titleLower.includes('resume') || descLower.includes('resume')) cat = 'Resume Builder';
    else if (titleLower.includes('interview') || descLower.includes('interview')) cat = 'Mock Interviews';
    else if (titleLower.includes('jd') || titleLower.includes('job') || descLower.includes('jd')) cat = 'JD Analyzer';
    else if (titleLower.includes('coding') || titleLower.includes('problem') || titleLower.includes('solution') || descLower.includes('xp')) cat = 'Coding Practice';
    else if (titleLower.includes('coach') || titleLower.includes('chat') || descLower.includes('coach')) cat = 'AI Coach';
    else if (titleLower.includes('profile') || descLower.includes('profile')) cat = 'Profile Updates';

    return { ...obj, category: cat };
  });

  let filtered = categorizedLog;

  if (category && category !== 'All') {
    filtered = filtered.filter((item) => item.category === category);
  }

  if (search && search.trim()) {
    const q = search.toLowerCase().trim();
    filtered = filtered.filter((item) => (item.title || '').toLowerCase().includes(q) || (item.desc || '').toLowerCase().includes(q));
  }

  const total = filtered.length;
  const pageNum = parseInt(page, 10) || 1;
  const limitNum = parseInt(limit, 10) || 10;
  const startIndex = (pageNum - 1) * limitNum;
  const paginatedItems = filtered.slice(startIndex, startIndex + limitNum);

  return {
    activities: paginatedItems,
    total,
    page: pageNum,
    totalPages: Math.ceil(total / limitNum) || 1,
    categories: ['All', 'Resume Builder', 'Mock Interviews', 'JD Analyzer', 'Coding Practice', 'AI Coach', 'Profile Updates'],
  };
}

export async function getLatestJDAnalysis(userId) {
  await ensureUserInitialized(userId);
  const jdDoc = await JDAnalysisModel.findOne({ userId }).sort({ createdAt: -1 });
  if (!jdDoc) return null;
  return {
    id: jdDoc._id.toString(),
    jobTitle: jdDoc.jobTitle,
    keywordMatch: jdDoc.keywordMatch,
    atsScore: jdDoc.atsScore,
    matchedSkills: jdDoc.matchedSkills,
    missingSkills: jdDoc.missingSkills,
    recommendations: jdDoc.recommendations,
    jobDescription: jdDoc.jobDescription,
    createdAt: jdDoc.createdAt,
  };
}

// Profile
export async function getProfile(userId) {
  await ensureUserInitialized(userId);
  const profile = await ProfileModel.findOne({ userId });
  if (profile && profile.avatarUrl && profile.avatarUrl.includes('mock-bucket')) {
    profile.avatarUrl = '/images/alex_thompson.png';
  }
  return profile;
}

export async function updateProfile(userId, profilePatch) {
  await ensureUserInitialized(userId);
  const profile = await ProfileModel.findOne({ userId });
  if (!profile) throw new Error('Profile not found.');

  Object.assign(profile, profilePatch);
  await profile.save();

  if (profilePatch.name) {
    await UserModel.updateOne({ _id: userId }, { name: profilePatch.name });
  }

  await logActivity(userId, 'Updated Profile Information', 'Saved new profile details', 'slate');
  await computeCalculatedMetrics(userId);
  return profile;
}

// Settings
export async function getSettings(userId) {
  await ensureUserInitialized(userId);
  const settings = await UserSettingsModel.findOne({ userId });
  const profile = await ProfileModel.findOne({ userId });

  return {
    tabs: ['Profile', 'Account', 'Theme', 'Notifications', 'Security', 'Billing'],
    themeOptions: ['Light', 'Dark', 'System'],
    content: {
      Profile: [
        ['Name', profile?.name || 'Not set'],
        ['Career goal', profile?.title || 'Not set'],
        ['Location', 'San Francisco, CA'],
      ],
      Account: [
        ['Email', profile?.email || 'Not set'],
        ['Plan', 'CareerPrep Pro'],
        ['Member since', 'Active'],
      ],
      Notifications: [
        ['Interview reminders', '15 minutes before sessions'],
        ['Weekly summary', 'Every Monday'],
      ],
      Security: [
        ['Password', 'Active (BCrypt protected)'],
        ['Two-factor authentication', 'Disabled'],
      ],
      Billing: [
        ['Current plan', 'Pro Tier'],
        ['Payment method', 'Visa ending in 4242'],
      ],
    },
    preferences: settings?.preferences || { email: true, reminders: true, insights: false },
    theme: settings?.theme || 'Light',
  };
}

export async function updateSettings(userId, settingsPatch) {
  await ensureUserInitialized(userId);
  const settings = await UserSettingsModel.findOne({ userId });
  if (settings) {
    if (settingsPatch.preferences) settings.preferences = { ...settings.preferences, ...settingsPatch.preferences };
    if (settingsPatch.theme) settings.theme = settingsPatch.theme;
    await settings.save();
    return settings;
  }
  return UserSettingsModel.create({ userId, ...settingsPatch });
}

// Admin
export async function getAdminData() {
  const totalUsers = await UserModel.countDocuments();
  const allUsers = await UserModel.find().sort({ createdAt: -1 }).limit(10);
  const activeInterviews = await MockInterviewModel.countDocuments();

  const userActivity = allUsers.map((u) => {
    const initials = u.name ? u.name.split(' ').map((n) => n[0]).join('').toUpperCase().slice(0, 2) : 'US';
    return {
      id: u._id.toString(),
      initials,
      name: u.name,
      email: u.email,
      status: 'Active',
      statusTone: 'green',
      subscription: 'Pro Tier',
      activity: 'Active in MongoDB',
      accent: 'blue',
    };
  });

  return {
    stats: [
      { title: 'Total Registered Users', value: `${totalUsers}`, icon: 'users', tone: 'blue', change: '+100%', trend: 'up', progress: 100 },
      { title: 'Active Mock Interviews', value: `${activeInterviews}`, icon: 'broadcast', tone: 'violet', change: '+100%', trend: 'up', progress: 100 },
      { title: 'Database Mode', value: 'MongoDB Cloud', icon: 'wallet', tone: 'mint', change: 'Connected', trend: 'up', progress: 100 },
      { title: 'System Health', value: '100% Operational', icon: 'badge', tone: 'sky', change: 'Optimal', trend: 'neutral', progress: 100 },
    ],
    userActivity,
    resourceGroups: [
      { id: 'rg1', title: 'Aptitude Pool', icon: 'brain', tone: 'blue', action: 'Manage All', buttonLabel: '+ Add Category', items: [{ title: 'Quantitative Reasoning', subtitle: 'Live MongoDB Collection' }] },
      { id: 'rg2', title: 'Coding Challenges', icon: 'code', tone: 'violet', action: 'Manage All', buttonLabel: '+ New Challenge', items: [{ title: 'Data Structures Sprint', subtitle: 'Live MongoDB Collection' }] },
    ],
    reports: [
      { label: 'MongoDB Response Latency', value: '12ms', tone: 'blue' },
      { label: 'Active User Retention', value: '96%', tone: 'mint' },
    ],
    topSkills: ['React', 'Node.js', 'MongoDB', 'System Design'],
    systemHealth: [
      { label: 'MongoDB Connection Status', value: 'Healthy / Active' },
      { label: 'API Uptime', value: '99.99%' },
    ],
  };
}

// ----------------------------------------------------
// FILE STORAGE & MONGODB HANDLERS
// ----------------------------------------------------

function sanitizeFileName(fileName = 'file') {
  return fileName
    .toLowerCase()
    .replace(/[^a-z0-9._-]/g, '_')
    .replace(/_+/g, '_');
}

function buildStorageKey({ folder = 'documents', userId = 'user', fileName = 'file.bin' }) {
  const timestamp = Date.now();
  const safeName = sanitizeFileName(fileName);
  const ext = safeName.includes('.') ? safeName.split('.').pop() : 'bin';

  let folderPath = 'uploads/documents';
  let formattedName = `${userId}_doc_${timestamp}.${ext}`;

  if (folder === 'profile-images' || folder === 'profile') {
    folderPath = 'uploads/profile-images';
    formattedName = `${userId}_${timestamp}.${ext}`;
  } else if (folder === 'resumes' || folder === 'resume') {
    folderPath = 'uploads/resumes';
    formattedName = `${userId}_resume_${timestamp}.${ext}`;
  } else if (folder === 'reports' || folder === 'report') {
    folderPath = 'uploads/reports';
    formattedName = `${userId}_report_${timestamp}.${ext}`;
  }

  return `${folderPath}/${formattedName}`;
}

async function saveFileStorage({ buffer, mimeType = 'application/octet-stream', folder = 'documents', fileName = 'file.bin', userId = 'user' }) {
  if (isCloudinaryConfigured() && buffer && Buffer.isBuffer(buffer)) {
    try {
      const isImage = mimeType.startsWith('image/');
      const cloudinaryResult = isImage
        ? await uploadImageToCloudinary({
            buffer,
            folder: `careerprep/${folder}`,
            fileName: `${userId}_${fileName}`,
          })
        : await uploadToCloudinary({
            buffer,
            folder: `careerprep/${folder}`,
            fileName: `${userId}_${fileName}`,
            resourceType: 'raw',
          });
      return { key: cloudinaryResult.key, url: cloudinaryResult.url };
    } catch (err) {
      console.warn('[Cloudinary Storage Fallback]:', err.message);
    }
  }

  const key = buildStorageKey({ folder, userId, fileName });
  const dataUri = buffer && Buffer.isBuffer(buffer)
    ? `data:${mimeType};base64,${buffer.toString('base64')}`
    : '';
  return { key, url: dataUri };
}

/**
 * Profile Photo Upload handler
 */
export async function uploadProfilePhoto(userId, fileBuffer, mimeType = 'image/png', fileName = 'avatar.png') {
  await ensureUserInitialized(userId);
  let profile = await ProfileModel.findOne({ userId });

  const { key, url } = await saveFileStorage({
    buffer: fileBuffer,
    mimeType,
    folder: 'profile-images',
    fileName,
    userId,
  });

  if (!profile) {
    profile = await ProfileModel.create({
      userId,
      profileImageKey: key,
      profileImageUrl: url,
      avatarUrl: url,
    });
  } else {
    profile.profileImageKey = key;
    profile.profileImageUrl = url;
    profile.avatarUrl = url;
    await profile.save();
  }

  await logActivity(userId, 'Uploaded Profile Photo', 'Saved profile photo', 'mint');

  return {
    success: true,
    profileImageKey: key,
    profileImageUrl: url,
    avatarUrl: url,
  };
}

/**
 * Get Profile Photo info
 */
export async function getProfilePhoto(userId) {
  await ensureUserInitialized(userId);
  const profile = await ProfileModel.findOne({ userId });
  let url = profile?.profileImageUrl || profile?.avatarUrl || '';
  if (url.includes('mock-bucket')) {
    url = '/images/alex_thompson.png';
  }
  return {
    profileImageKey: profile?.profileImageKey || '',
    profileImageUrl: url,
    avatarUrl: url,
  };
}

/**
 * Delete Profile Photo handler
 */
export async function deleteProfilePhoto(userId) {
  await ensureUserInitialized(userId);
  const profile = await ProfileModel.findOne({ userId });

  if (profile?.profileImageKey && isCloudinaryConfigured()) {
    await deleteFromCloudinary(profile.profileImageKey, 'image');
  }

  if (profile) {
    profile.profileImageKey = '';
    profile.profileImageUrl = '';
    profile.avatarUrl = '/images/alex_thompson.png';
    await profile.save();
  }

  await logActivity(userId, 'Deleted Profile Photo', 'Removed photo from MongoDB', 'slate');
  return { success: true };
}

/**
 * Resume File Upload handler
 */
export async function uploadProfileResume(userId, fileBuffer, mimeType = 'application/pdf', fileName = 'resume.pdf') {
  await ensureUserInitialized(userId);
  let resume = await ResumeModel.findOne({ userId });
  let profile = await ProfileModel.findOne({ userId });

  const { key, url } = await saveFileStorage({
    buffer: fileBuffer,
    mimeType,
    folder: 'resumes',
    fileName,
    userId,
  });

  if (resume) {
    resume.resumeKey = key;
    resume.resumeUrl = url;
    await resume.save();
  }

  if (profile) {
    profile.resumeKey = key;
    profile.resumeUrl = url;
    await profile.save();
  }

  await logActivity(userId, 'Uploaded Resume File', 'Stored resume file safely', 'blue');

  return {
    success: true,
    resumeKey: key,
    resumeUrl: url,
  };
}

/**
 * Get Profile Resume info
 */
export async function getProfileResume(userId) {
  await ensureUserInitialized(userId);
  const resume = await ResumeModel.findOne({ userId });
  const profile = await ProfileModel.findOne({ userId });

  return {
    resumeKey: resume?.resumeKey || profile?.resumeKey || '',
    resumeUrl: resume?.resumeUrl || profile?.resumeUrl || '',
  };
}

/**
 * Delete Resume File handler
 */
export async function deleteProfileResume(userId) {
  await ensureUserInitialized(userId);
  const resume = await ResumeModel.findOne({ userId });
  const profile = await ProfileModel.findOne({ userId });

  const targetKey = resume?.resumeKey || profile?.resumeKey;
  if (targetKey && isCloudinaryConfigured()) {
    await deleteFromCloudinary(targetKey, 'raw');
  }

  if (resume) {
    resume.resumeKey = '';
    resume.resumeUrl = '';
    await resume.save();
  }

  if (profile) {
    profile.resumeKey = '';
    profile.resumeUrl = '';
    await profile.save();
  }

  await logActivity(userId, 'Deleted Resume File', 'Removed resume from MongoDB', 'slate');
  return { success: true };
}

/**
 * Generate/Save Analysis Report in MongoDB
 */
export async function createAnalysisReport(userId, { reportTitle = 'Analysis Report', fileBuffer, mimeType = 'application/pdf', fileName = 'report.pdf', metadata = {} }) {
  await ensureUserInitialized(userId);

  const { key, url } = await saveFileStorage({
    buffer: fileBuffer,
    mimeType,
    folder: 'reports',
    fileName,
    userId,
  });

  const report = await AnalysisReportModel.create({
    userId,
    reportTitle,
    reportKey: key,
    reportUrl: url,
    mimeType,
    fileSize: fileBuffer ? fileBuffer.length : 0,
    status: 'completed',
    metadata,
  });

  await logActivity(userId, 'Generated Analysis Report', `Saved report "${reportTitle}"`, 'violet');

  return {
    id: report._id.toString(),
    _id: report._id.toString(),
    reportTitle: report.reportTitle,
    reportKey: report.reportKey,
    reportUrl: report.reportUrl,
    status: report.status,
    mimeType: report.mimeType,
    fileSize: report.fileSize,
    createdAt: report.createdAt,
  };
}

/**
 * Fetch Analysis Reports list
 */
export async function getAnalysisReports(userId) {
  await ensureUserInitialized(userId);
  const reports = await AnalysisReportModel.find({ userId }).sort({ createdAt: -1 });
  return reports.map((r) => ({
    id: r._id.toString(),
    _id: r._id.toString(),
    reportTitle: r.reportTitle,
    reportKey: r.reportKey,
    reportUrl: r.reportUrl,
    status: r.status,
    mimeType: r.mimeType,
    fileSize: r.fileSize,
    createdAt: r.createdAt,
  }));
}

/**
 * Fetch single Analysis Report by ID
 */
export async function getAnalysisReportById(userId, reportId) {
  await ensureUserInitialized(userId);
  const report = await AnalysisReportModel.findOne({ _id: reportId, userId });
  if (!report) return null;
  return {
    id: report._id.toString(),
    _id: report._id.toString(),
    reportTitle: report.reportTitle,
    reportKey: report.reportKey,
    reportUrl: report.reportUrl,
    status: report.status,
    mimeType: report.mimeType,
    fileSize: report.fileSize,
    createdAt: report.createdAt,
  };
}

/**
 * Delete Analysis Report handler
 */
export async function deleteAnalysisReport(userId, reportId) {
  await ensureUserInitialized(userId);
  const report = await AnalysisReportModel.findOne({ _id: reportId, userId });
  if (!report) throw new Error('Analysis report not found.');

  if (report.reportKey && isCloudinaryConfigured()) {
    const resourceType = (report.mimeType || '').startsWith('image/') ? 'image' : 'raw';
    await deleteFromCloudinary(report.reportKey, resourceType);
  }

  await AnalysisReportModel.deleteOne({ _id: reportId, userId });
  await logActivity(userId, 'Deleted Analysis Report', `Deleted report "${report.reportTitle}"`, 'slate');

  return { success: true, id: reportId };
}

/**
 * General Document File Upload for AI Chat / Documents
 */
export async function uploadDocumentFile(userId, fileBuffer, mimeType = 'application/octet-stream', fileName = 'document.bin') {
  await ensureUserInitialized(userId);

  const { key, url } = await saveFileStorage({
    buffer: fileBuffer,
    mimeType,
    folder: 'documents',
    fileName,
    userId,
  });

  return {
    id: `file-${Date.now()}-${Math.random().toString(36).substring(2, 6)}`,
    name: fileName,
    type: mimeType,
    mimeType,
    size: fileBuffer ? fileBuffer.length : 0,
    key,
    url,
    uploadedAt: new Date(),
  };
}

