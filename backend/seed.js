import 'dotenv/config';
import mongoose from 'mongoose';
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
  BadgeModel,
  UserSettingsModel,
  AIChatHistoryModel,
} from './models/index.js';

async function seed() {
  const uri = process.env.MONGODB_URI;
  if (!uri) {
    console.error('MONGODB_URI is not set in .env');
    process.exit(1);
  }

  console.log('Connecting to MongoDB...');
  await mongoose.connect(uri);
  console.log('MongoDB connected successfully.');

  const userCount = await UserModel.countDocuments();
  if (userCount === 0) {
    console.log('Seeding initial MongoDB dataset...');

    const hashedPassword = await bcrypt.hash('password123', 10);
    const demoUser = await UserModel.create({
      name: 'Alex Thompson',
      email: 'alex.thompson@example.com',
      password: hashedPassword,
    });

    const userId = demoUser._id.toString();

    await ProfileModel.create({
      userId,
      name: 'Alex Thompson',
      email: 'alex.thompson@example.com',
      title: 'Senior Product Designer @ Fintech Innovations',
      avatarUrl: '/images/alex_thompson.png',
      completion: 90,
      about: 'Lead Product Designer focused on design systems and scalable fintech user interfaces.',
      recruiterSnapshot: 'Experienced designer with 5+ years of experience leading design systems.',
      experiences: [
        {
          id: 'exp_1',
          role: 'Senior Product Designer',
          company: 'Fintech Innovations',
          period: 'Jan 2022 — Present',
          description: 'Leading the design system team for a series-B mobile banking app. Reduced design-to-code latency by 40%.',
          current: true,
        },
        {
          id: 'exp_2',
          role: 'UX Designer',
          company: 'Creativ Studio',
          period: 'Jun 2019 — Dec 2021',
          description: 'Designed end-to-end user journeys for high-traffic e-commerce platforms.',
          current: false,
        },
      ],
      education: [
        {
          id: 'edu_1',
          degree: 'B.S. Interaction Design',
          institution: 'Stanford University',
          period: '2015 — 2019',
          description: 'Focus on Human-Computer Interaction and Cognitive Psychology.',
        },
      ],
      projects: [
        {
          id: 'proj_1',
          title: 'Nexus Wallet',
          description: 'Crypto asset management redesigned for clarity.',
          image: '/images/nexus_wallet.png',
        },
        {
          id: 'proj_2',
          title: 'DataStream Dashboard',
          description: 'Real-time analytics for enterprise-level logistics.',
          image: '/images/datastream_dashboard.png',
        },
      ],
      skills: ['Figma', 'UI/UX Design', 'React.js', 'Design Systems', 'Prototyping', 'User Testing', 'Adobe CC'],
      skillsActive: ['Figma', 'UI/UX Design', 'React.js'],
      targetRoles: ['Principal Product Designer', 'Design Manager'],
      dreamCompanies: [
        { name: 'Stripe', color: '#000000' },
        { name: 'Linear', color: '#2563eb' },
        { name: 'Airbnb', color: '#ff385c' },
      ],
      aiSuggestion: {
        targetCompany: 'Stripe',
        title: 'Optimize for Stripe',
        description: "Based on your target companies, highlight 'Systems Thinking' in your project descriptions.",
        buttonLabel: 'Refine Project Text',
      },
    });

    await AnalyticsModel.create({
      userId,
      codingXP: 2400,
      careerReadiness: 92,
      resumeScore: '85 / 100',
      interviewRank: 'Top 5%',
      weeklyActivity: [
        { day: 'Mon', count: 3 },
        { day: 'Tue', count: 5 },
        { day: 'Wed', count: 2 },
        { day: 'Thu', count: 6 },
        { day: 'Fri', count: 4 },
        { day: 'Sat', count: 1 },
        { day: 'Sun', count: 3 },
      ],
      activityLog: [
        { id: 'act_1', title: 'Optimized Resume with AI', desc: 'Analyzed resume for Stripe Principal Role', time: '2 hours ago', tone: 'violet' },
        { id: 'act_2', title: 'Completed Practice Drill', desc: 'Passed Linked List Cycle II algorithm challenge', time: '5 hours ago', tone: 'blue' },
        { id: 'act_3', title: 'Achieved Goal', desc: 'Reviewed ATS resume suggestions', time: 'Yesterday', tone: 'mint' },
      ],
      practiceStats: { questionsCompleted: 14, accuracy: 92 },
      streak: 5,
    });

    await GoalModel.create([
      { userId, title: '3 Coding Problems', done: true, status: 'Complete' },
      { userId, title: 'Review Resume Feedback', done: true, status: 'Complete' },
      { userId, title: '1 Mock Interview Session', done: false, status: 'Pending' },
    ]);

    await ResumeModel.create({
      userId,
      suggestions: [
        { id: 'sug_1', title: 'Quantify achievements in Stripe role', desc: 'Adding metrics increases ATS score by 22%.', accent: 'blue' },
        { id: 'sug_2', title: 'Rewrite summary for leadership focus', desc: 'Shift from task-based language to strategic outcomes.', accent: 'violet' },
      ],
      missingSkills: ['Python', 'AWS', 'Kubernetes'],
      resumeText: 'Senior Product Designer with 5+ years of experience leading design systems.',
      score: '85 / 100',
    });

    await MockInterviewModel.create({
      userId,
      title: 'Senior Product Manager Mock Interview',
      role: 'Product Manager',
      targetCompany: 'Google',
      difficulty: 'Mid-Level',
      score: 8.5,
      maxScore: 10,
      headline: 'Excellent Performance!',
      percentileText: 'You are in the top 5% of candidates for Senior Product Designer roles.',
      skillsRadar: { Technical: 88, Communication: 82, Grammar: 75, Behavioral: 85, Confidence: 90 },
      strengths: [
        { id: 'str_1', title: 'Strong Domain Expertise', desc: 'Technical explanation of React hooks and system design was precise.' },
      ],
      improvements: [
        { id: 'imp_1', title: 'Elaborate on Trade-offs', desc: 'Mention 1-2 alternative database choices next time.' },
      ],
      nextSteps: [
        { id: 'q1', title: 'Practice Question 01', text: '"How do you handle scope creep?"', icon: 'chat' },
      ],
      status: 'completed',
      interviewDate: new Date(Date.now() + 86400000),
    });

    await RoadmapModel.create({
      userId,
      bannerTitle: 'Target Transition',
      bannerSubtitle: 'Principal Product Designer @ Stripe',
      bannerMeta: 'Projected 8-week readiness roadmap.',
      milestones: [
        { id: 'm_1', title: 'Design System Architecture', desc: 'Master tokenized design components in Figma and React.', time: 'Done', tone: 'mint', done: true },
        { id: 'm_2', title: 'STAR Behavioral Scenarios', desc: 'Prepare 5 structured leadership anecdotes.', time: 'In progress', tone: 'blue', done: false },
        { id: 'm_3', title: 'Live System Design Mock', desc: 'Schedule 1-on-1 peer review session.', time: 'Scheduled', tone: 'slate', done: false },
      ],
      focusAreas: [
        { id: 'f_1', title: 'Systems Thinking', text: 'Focus on multi-platform design sync.' },
        { id: 'f_2', title: 'Cross-functional Communication', text: 'Demonstrate design decisions with data.' },
      ],
    });

    await NotificationModel.create([
      { userId, title: 'Interview reminder', detail: 'Google PM mock interview starts soon.', time: 'Today, 4:45 PM', accent: 'blue', read: false },
      { userId, title: 'Resume suggestion', detail: 'AI found 3 impact metrics to strengthen your case study.', time: 'Today, 1:12 PM', accent: 'violet', read: false },
      { userId, title: 'Roadmap milestone', detail: 'You completed the Product Strategy module ahead of schedule.', time: 'Yesterday', accent: 'mint', read: true },
    ]);

    await BadgeModel.create([
      { userId, name: 'System Architect', title: 'System Architect', category: 'Coding', earnedAt: 'July 2026', icon: 'code', description: 'Solved 10+ system architecture challenges.' },
      { userId, name: 'Interview Master', title: 'Interview Master', category: 'Interviews', earnedAt: 'July 2026', icon: 'mic', description: 'Scored top 5% in AI Mock Interview.' },
    ]);

    await UserSettingsModel.create({
      userId,
      preferences: { email: true, reminders: true, insights: true },
      theme: 'Light',
    });

    await AIChatHistoryModel.create({
      userId,
      messages: [],
    });

    console.log('MongoDB Seeded successfully! Demo Account: alex.thompson@example.com / password123');
  } else {
    console.log(`MongoDB already has ${userCount} users. Seeding skipped.`);
  }

  await mongoose.disconnect();
}

seed().catch((err) => {
  console.error('Seed error:', err);
  process.exit(1);
});
