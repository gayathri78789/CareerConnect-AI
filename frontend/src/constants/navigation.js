export const appNav = [
  { label: 'Dashboard', path: '/dashboard', icon: 'dashboard' },
  { label: 'Resume Builder', path: '/resume', icon: 'document' },
  { label: 'Mock Interviews', path: '/mock-interviews', icon: 'mic' },
  { label: 'JD Analyzer', path: '/jd-analyzer', icon: 'analytics' },
  { label: 'Roadmap', path: '/roadmap', icon: 'roadmap' },
  { label: 'Practice', path: '/practice', icon: 'code' },
  { label: 'AI Coach', path: '/coach', icon: 'chat' },
];

export const marketingLinks = [
  { label: 'Dashboard', path: '/dashboard' },
  { label: 'Resume', path: '/resume' },
  { label: 'Interviews', path: '/mock-interviews' },
  { label: 'Roadmap', path: '/roadmap' },
];

export const morePages = [
  { label: 'Notifications', path: '/notifications' },
  { label: 'Profile', path: '/profile' },
  { label: 'Settings', path: '/settings' },
  { label: 'Admin', path: '/admin' },
  { label: 'Auth', path: '/auth' },
];

export const settingsTabs = ['Profile', 'Account', 'Theme', 'Notifications', 'Security', 'Billing'];

export const systemHealth = [
  { label: 'API Latency', value: '24ms' },
  { label: 'GPU Load (AI Inference)', value: '62%' },
  { label: 'Error Rate', value: '0.002%', accent: 'mint' },
];

export const resourceGroups = [
  {
    title: 'Aptitude Pool',
    icon: 'brain',
    tone: 'blue',
    action: 'Manage All',
    buttonLabel: '+ Add Category',
    items: [
      { title: 'Quantitative Reasoning', subtitle: '420 Questions' },
      { title: 'Logical Deduction', subtitle: '315 Questions' },
    ],
  },
  {
    title: 'Coding Challenges',
    icon: 'code',
    tone: 'violet',
    action: 'Manage All',
    buttonLabel: '+ New Challenge',
    items: [
      { title: 'Data Structures', subtitle: 'Expert • 85 Problems' },
      { title: 'System Design', subtitle: 'Senior • 42 Case Studies' },
    ],
  },
];
