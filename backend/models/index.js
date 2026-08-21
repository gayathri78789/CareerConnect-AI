import mongoose from 'mongoose';

const userSchema = new mongoose.Schema(
  {
    name: { type: String, required: true },
    email: { type: String, required: true, unique: true, index: true },
    password: { type: String, required: true },
  },
  { timestamps: true }
);

const profileSchema = new mongoose.Schema(
  {
    userId: { type: String, required: true, unique: true, index: true },
    name: { type: String, default: 'User' },
    email: { type: String, default: '' },
    phone: { type: String, default: '' },
    address: { type: String, default: '' },
    linkedin: { type: String, default: '' },
    github: { type: String, default: '' },
    portfolio: { type: String, default: '' },
    title: { type: String, default: '' },
    avatarUrl: { type: String, default: '' },
    profileImageKey: { type: String, default: '' },
    profileImageUrl: { type: String, default: '' },
    resumeKey: { type: String, default: '' },
    resumeUrl: { type: String, default: '' },
    completion: { type: Number, default: 0 },
    about: { type: String, default: '' },
    careerObjective: { type: String, default: '' },
    recruiterSnapshot: { type: String, default: '' },
    experiences: [
      {
        id: String,
        role: String,
        company: String,
        period: String,
        location: String,
        description: String,
        current: Boolean,
      },
    ],
    internships: [
      {
        id: String,
        role: String,
        company: String,
        period: String,
        description: String,
      },
    ],
    education: [
      {
        id: String,
        degree: String,
        institution: String,
        period: String,
        description: String,
        gpa: String,
      },
    ],
    projects: [
      {
        id: String,
        title: String,
        description: String,
        image: String,
        link: String,
        techStack: [String],
      },
    ],
    skills: [{ type: String }],
    skillsActive: [{ type: String }],
    certifications: [
      {
        id: String,
        name: String,
        issuer: String,
        year: String,
      },
    ],
    achievements: [
      {
        id: String,
        title: String,
        description: String,
      },
    ],
    languages: [{ type: String }],
    awards: [
      {
        id: String,
        title: String,
        issuer: String,
        year: String,
      },
    ],
    interests: [{ type: String }],
    targetRoles: [{ type: String }],
    dreamCompanies: [{ name: String, color: String }],
    aiSuggestion: {
      targetCompany: String,
      title: String,
      description: String,
      buttonLabel: String,
    },
    metrics: [{ label: String, value: String, accent: String }],
    focusAreas: [{ label: String, value: String }],
  },
  { timestamps: true }
);

const analyticsSchema = new mongoose.Schema(
  {
    userId: { type: String, required: true, unique: true, index: true },
    codingXP: { type: Number, default: 0 },
    careerReadiness: { type: Number, default: 0 },
    resumeScore: { type: String, default: 'Not Generated' },
    interviewRank: { type: String, default: '--' },
    weeklyActivity: [
      { day: String, count: Number }
    ],
    activityLog: [
      { id: String, title: String, desc: String, time: String, tone: String, createdAt: { type: Date, default: Date.now } }
    ],
    practiceStats: {
      questionsCompleted: { type: Number, default: 0 },
      accuracy: { type: Number, default: 0 },
    },
    streak: { type: Number, default: 0 },
  },
  { timestamps: true }
);

const goalSchema = new mongoose.Schema(
  {
    userId: { type: String, required: true, index: true },
    title: { type: String, required: true },
    done: { type: Boolean, default: false },
    status: { type: String, default: 'Pending' },
  },
  { timestamps: true }
);

const resumeSchema = new mongoose.Schema(
  {
    userId: { type: String, required: true, unique: true, index: true },
    contact: {
      name: { type: String, default: '' },
      email: { type: String, default: '' },
      phone: { type: String, default: '' },
      location: { type: String, default: '' },
      linkedin: { type: String, default: '' },
      github: { type: String, default: '' },
      portfolio: { type: String, default: '' },
      title: { type: String, default: '' },
    },
    summary: { type: String, default: '' },
    experience: [
      {
        id: String,
        role: String,
        company: String,
        period: String,
        location: String,
        description: String,
        bulletPoints: [String],
      },
    ],
    education: [
      {
        id: String,
        degree: String,
        institution: String,
        period: String,
        description: String,
        gpa: String,
      },
    ],
    projects: [
      {
        id: String,
        title: String,
        description: String,
        link: String,
        techStack: [String],
      },
    ],
    skills: [{ type: String }],
    certifications: [
      {
        id: String,
        name: String,
        issuer: String,
        year: String,
      },
    ],
    achievements: [{ type: String }],
    languages: [{ type: String }],
    interests: [{ type: String }],
    customSections: [
      {
        id: String,
        title: String,
        content: String,
      },
    ],
    atsScore: { type: Number, default: 85 },
    skillMatchScore: { type: Number, default: 80 },
    completenessScore: { type: Number, default: 85 },
    missingSkills: [{ type: String }],
    missingSections: [{ type: String }],
    suggestions: [
      {
        id: String,
        title: String,
        desc: String,
        accent: String,
        type: { type: String, default: 'blue' },
        icon: String,
      },
    ],
    resumeText: { type: String, default: '' },
    resumeKey: { type: String, default: '' },
    resumeUrl: { type: String, default: '' },
    score: { type: String, default: 'Not Generated' },
    targetRoles: [{ type: String }],
    roleResumes: { type: mongoose.Schema.Types.Mixed, default: {} },
    versions: [
      {
        id: String,
        title: String,
        date: String,
        createdAt: { type: Date, default: Date.now },
        resumeData: { type: Object, default: {} },
      },
    ],
  },
  { timestamps: true }
);

const mockInterviewSchema = new mongoose.Schema(
  {
    userId: { type: String, required: true, index: true },
    title: { type: String, default: '' },
    role: { type: String, default: '' },
    targetCompany: { type: String, default: '' },
    difficulty: { type: String, default: 'Mid-Level' },
    score: { type: Number, default: null },
    maxScore: { type: Number, default: 10 },
    headline: { type: String, default: '' },
    percentileText: { type: String, default: '' },
    skillsRadar: {
      Technical: { type: Number, default: 0 },
      Communication: { type: Number, default: 0 },
      Grammar: { type: Number, default: 0 },
      Behavioral: { type: Number, default: 0 },
      Confidence: { type: Number, default: 0 },
    },
    strengths: [
      { id: String, title: String, desc: String }
    ],
    improvements: [
      { id: String, title: String, desc: String }
    ],
    nextSteps: [
      { id: String, title: String, text: String, icon: String }
    ],
    interviewDate: { type: Date, default: Date.now },
    hintsUsedCount: { type: Number, default: 0 },
    scoreDeduction: { type: Number, default: 0 },
    status: { type: String, default: 'Upcoming' },
  },
  { timestamps: true }
);

const roadmapSchema = new mongoose.Schema(
  {
    userId: { type: String, required: true, unique: true, index: true },
    targetRole: { type: String, default: '' },
    targetCompany: { type: String, default: '' },
    bannerTitle: { type: String, default: 'Target Transition' },
    bannerSubtitle: { type: String, default: 'Not Set' },
    bannerMeta: { type: String, default: 'No roadmap generated yet. Generate a roadmap to map your transition.' },
    estimatedDuration: { type: String, default: '' },
    generatedAt: { type: Date, default: null },
    milestones: [
      { id: String, title: String, desc: String, time: String, tone: String, done: Boolean }
    ],
    focusAreas: [
      { id: String, title: String, text: String }
    ],
    timeline: [
      { id: String, phase: String, title: String, description: String, weeks: String }
    ],
    resources: [
      { id: String, category: String, title: String, url: String, resourceType: String }
    ],
    skillPriority: [{ type: String }],
    interviewStrategy: [
      { id: String, title: String, description: String }
    ],
  },
  { timestamps: true }
);

const notificationSchema = new mongoose.Schema(
  {
    userId: { type: String, required: true, index: true },
    title: { type: String, required: true },
    detail: { type: String, default: '' },
    time: { type: String, default: 'Just now' },
    accent: { type: String, default: 'blue' },
    read: { type: Boolean, default: false },
  },
  { timestamps: true }
);

const jdAnalysisSchema = new mongoose.Schema(
  {
    userId: { type: String, required: true, index: true },
    jobTitle: { type: String, default: 'Target Role Audit' },
    keywordMatch: { type: String, default: '0%' },
    atsScore: { type: String, default: '0%' },
    matchedSkills: [{ type: String }],
    missingSkills: [{ type: String }],
    recommendations: [{ type: String }],
    jobDescription: { type: String, default: '' },
  },
  { timestamps: true }
);

const attachmentSchema = new mongoose.Schema({
  id: String,
  name: String,
  type: String,
  size: Number,
  url: String,
  extractedText: String,
  mimeType: String,
});

const chatMessageSchema = new mongoose.Schema({
  id: String,
  role: { type: String, enum: ['user', 'assistant'], required: true },
  content: { type: String, default: '' },
  attachments: [attachmentSchema],
  createdAt: { type: Date, default: Date.now }
});

const aiChatSessionSchema = new mongoose.Schema(
  {
    userId: { type: String, required: true, index: true },
    sessionId: { type: String, required: true, unique: true, index: true },
    title: { type: String, default: 'New Conversation' },
    isPinned: { type: Boolean, default: false },
    messages: [chatMessageSchema],
  },
  { timestamps: true }
);

const aiChatHistorySchema = new mongoose.Schema(
  {
    userId: { type: String, required: true, unique: true, index: true },
    messages: [
      { role: { type: String, enum: ['user', 'assistant'] }, content: String, createdAt: { type: Date, default: Date.now } }
    ],
  },
  { timestamps: true }
);

const practiceHistorySchema = new mongoose.Schema(
  {
    userId: { type: String, required: true, index: true },
    problemId: String,
    title: String,
    type: { type: String, default: 'code' },
    score: Number,
    runtime: String,
    beatsPercent: String,
    accuracy: Number,
  },
  { timestamps: true }
);

const badgeSchema = new mongoose.Schema(
  {
    userId: { type: String, required: true, index: true },
    name: String,
    title: String,
    category: String,
    earnedAt: { type: String, default: 'Recently' },
    icon: String,
    description: String,
  },
  { timestamps: true }
);

const userSettingsSchema = new mongoose.Schema(
  {
    userId: { type: String, required: true, unique: true, index: true },
    preferences: {
      email: { type: Boolean, default: true },
      reminders: { type: Boolean, default: true },
      insights: { type: Boolean, default: false },
    },
    theme: { type: String, default: 'Light' },
  },
  { timestamps: true }
);

const analysisReportSchema = new mongoose.Schema(
  {
    userId: { type: String, required: true, index: true },
    reportTitle: { type: String, required: true },
    reportKey: { type: String, default: '' },
    reportUrl: { type: String, default: '' },
    status: { type: String, default: 'completed' },
    mimeType: { type: String, default: 'application/pdf' },
    fileSize: { type: Number, default: 0 },
    metadata: { type: mongoose.Schema.Types.Mixed, default: {} },
  },
  { timestamps: true }
);

delete mongoose.models.User;
delete mongoose.models.Profile;
delete mongoose.models.Analytics;
delete mongoose.models.Goal;
delete mongoose.models.Resume;
delete mongoose.models.MockInterview;
delete mongoose.models.Roadmap;
delete mongoose.models.Notification;
delete mongoose.models.JDAnalysis;
delete mongoose.models.AIChatSession;
delete mongoose.models.AIChatHistory;
delete mongoose.models.PracticeHistory;
delete mongoose.models.Badge;
delete mongoose.models.UserSettings;
delete mongoose.models.AnalysisReport;

export const UserModel = mongoose.model('User', userSchema);
export const ProfileModel = mongoose.model('Profile', profileSchema);
export const AnalyticsModel = mongoose.model('Analytics', analyticsSchema);
export const GoalModel = mongoose.model('Goal', goalSchema);
export const ResumeModel = mongoose.model('Resume', resumeSchema);
export const MockInterviewModel = mongoose.model('MockInterview', mockInterviewSchema);
export const RoadmapModel = mongoose.model('Roadmap', roadmapSchema);
export const NotificationModel = mongoose.model('Notification', notificationSchema);
export const JDAnalysisModel = mongoose.model('JDAnalysis', jdAnalysisSchema);
export const AIChatSessionModel = mongoose.model('AIChatSession', aiChatSessionSchema);
export const AIChatHistoryModel = mongoose.model('AIChatHistory', aiChatHistorySchema);
export const PracticeHistoryModel = mongoose.model('PracticeHistory', practiceHistorySchema);
export const BadgeModel = mongoose.model('Badge', badgeSchema);
export const UserSettingsModel = mongoose.model('UserSettings', userSettingsSchema);
export const AnalysisReportModel = mongoose.model('AnalysisReport', analysisReportSchema);
