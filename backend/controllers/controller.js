import * as mongoStore from '../data/mongoStore.js';
import { generateChatReplyStream, generateFollowUpSuggestions } from '../services/aiService.js';
import { generateToken } from '../middleware/authMiddleware.js';

export async function getDashboardData(userId) {
  return mongoStore.getDashboard(userId);
}

export async function addGoalData(userId, title) {
  return mongoStore.addGoal(userId, title);
}

export async function updateGoalData(userId, id, patch) {
  return mongoStore.updateGoal(userId, id, patch);
}

export async function deleteGoalData(userId, id) {
  return mongoStore.deleteGoal(userId, id);
}

export async function getResumeData(userId) {
  return mongoStore.getResume(userId);
}

export async function buildResumeData(userId) {
  return mongoStore.buildResumeWithAI(userId);
}

export async function updateResumeData(userId, payload = {}) {
  return mongoStore.updateResume(userId, payload);
}

export async function restoreResumeVersionData(userId, payload = {}) {
  const { versionId } = payload;
  return mongoStore.restoreResumeVersion(userId, versionId);
}

export async function optimizeResumeData(userId, payload = {}) {
  const { resumeText, targetRole } = payload;
  return mongoStore.optimizeResume(userId, resumeText, targetRole);
}

export async function analyzeJobDescriptionData(userId, payload = {}) {
  const { jobDescription } = payload;
  if (!jobDescription || !jobDescription.trim()) {
    throw new Error('Job description text is required for analysis');
  }
  return mongoStore.analyzeJD(userId, jobDescription);
}

export async function getLatestJDAnalysisData(userId) {
  return mongoStore.getLatestJDAnalysis(userId);
}

export async function getCoachData(userId, sessionId = null) {
  return mongoStore.getCoachData(userId, sessionId);
}

export async function getChatSessionsData(userId) {
  return mongoStore.getChatSessions(userId);
}

export async function createChatSessionData(userId, payload = {}) {
  const { title } = payload;
  return mongoStore.createChatSession(userId, title);
}

export async function updateChatSessionData(userId, sessionId, payload = {}) {
  return mongoStore.updateChatSession(userId, sessionId, payload);
}

export async function deleteChatSessionData(userId, sessionId) {
  return mongoStore.deleteChatSession(userId, sessionId);
}

export async function handleChatRequest(userId, payload = {}) {
  return mongoStore.handleChat(userId, payload);
}

export async function clearCoachHistoryData(userId) {
  return mongoStore.clearChatHistory ? mongoStore.clearChatHistory(userId) : { success: true };
}

export async function handleChatStreamRequest(userId, payload, res) {
  const { message, attachments = [], sessionId: requestedSessionId } = payload;
  const userMessage = (message || '').trim();

  if (!userMessage && attachments.length === 0) {
    throw new Error('Message or attachment is required');
  }

  // Retrieve user session & context
  const coachData = await mongoStore.getCoachData(userId, requestedSessionId);
  const activeSessionId = coachData.activeSessionId;
  const history = (coachData.history || []).map((m) => ({
    role: m.role,
    content: m.content,
    attachments: m.attachments || [],
  }));

  const userContext = {
    userName: coachData.userName,
    targetRole: coachData.targetRole,
    targetCompany: coachData.targetCompany,
  };

  // Set SSE headers
  res.writeHead(200, {
    'Content-Type': 'text/event-stream',
    'Cache-Control': 'no-cache',
    Connection: 'keep-alive',
    'X-Accel-Buffering': 'no',
  });

  let fullReply = '';

  try {
    const stream = await generateChatReplyStream(history, userMessage, attachments, userContext);

    for await (const chunk of stream) {
      const text = typeof chunk.text === 'function' ? chunk.text() : chunk.text || '';
      if (text) {
        fullReply += text;
        res.write(`data: ${JSON.stringify({ type: 'chunk', content: text, sessionId: activeSessionId })}\n\n`);
      }
    }

    // Save conversation step to MongoDB session
    await mongoStore.handleChat(userId, {
      sessionId: activeSessionId,
      message: userMessage,
      attachments,
      streamedReply: fullReply,
    });

    // Generate follow-up suggestions
    try {
      const suggestions = await generateFollowUpSuggestions(history, fullReply);
      res.write(`data: ${JSON.stringify({ type: 'suggestions', suggestions })}\n\n`);
    } catch {
      // Non-critical
    }

    res.write(`data: ${JSON.stringify({ type: 'done', sessionId: activeSessionId })}\n\n`);
    res.end();
  } catch (err) {
    console.error('[CHAT STREAM CONTROLLER ERROR]:', err.message);
    res.write(`data: ${JSON.stringify({ type: 'error', message: err.message || 'Unable to connect to AI Coach.' })}\n\n`);
    res.end();
  }
}

export async function getNotificationsData(userId) {
  const notifications = await mongoStore.getNotifications(userId);
  return { groups: notifications };
}

export async function markNotificationReadData(userId, id) {
  return mongoStore.markNotificationRead(userId, id);
}

export async function markAllNotificationsReadData(userId) {
  return mongoStore.markAllNotificationsRead(userId);
}

export async function deleteNotificationData(userId, id) {
  return mongoStore.deleteNotification(userId, id);
}

export async function clearAllNotificationsData(userId) {
  return mongoStore.clearAllNotifications(userId);
}

export async function getActivityData(userId, params) {
  return mongoStore.getActivityLog(userId, params);
}

export async function getProfileData(userId) {
  return mongoStore.getProfile(userId);
}

export async function updateProfileData(userId, profilePatch) {
  return mongoStore.updateProfile(userId, profilePatch);
}

export async function getSettingsData(userId) {
  return mongoStore.getSettings(userId);
}

export async function updateSettingsData(userId, settingsPatch) {
  return mongoStore.updateSettings(userId, settingsPatch);
}

export async function getRoadmapData(userId) {
  return mongoStore.getRoadmap(userId);
}

export async function generateRoadmapData(userId, payload = {}) {
  const { targetRole, targetCompany } = payload;
  return mongoStore.generateRoadmap(userId, targetRole, targetCompany);
}

export async function updateMilestoneData(userId, id, patch) {
  return mongoStore.updateMilestone(userId, id, patch);
}

export async function getPracticeData(userId) {
  return mongoStore.getPractice(userId);
}

export async function submitPracticeData(userId, payload = {}) {
  return mongoStore.submitPractice(userId, payload);
}

export async function updateCareerTrackData(userId, careerTrack) {
  return mongoStore.updateCareerTrack(userId, careerTrack);
}

export async function getCodingQuestionsData(userId, query) {
  return mongoStore.getCodingQuestions(userId, query);
}

export async function getCodingTopicsData(career) {
  return mongoStore.getCodingTopics(career);
}

export async function getCodingHistoryData(userId) {
  return mongoStore.getCodingHistory(userId);
}

export async function getUserPracticeStatsData(userId) {
  return mongoStore.getUserPracticeStats(userId);
}

export async function getRandomCodingQuestionData(userId, query) {
  return mongoStore.getRandomCodingQuestion(userId, query);
}

export async function getRandomAptitudeQuestionData(query) {
  return mongoStore.getRandomAptitudeQuestion(query);
}

export async function getAptitudeQuestionsData(query) {
  return mongoStore.getAptitudeQuestions(query);
}


export async function getInterviewReportData(userId, interviewId) {
  return mongoStore.getInterviewReport(userId, interviewId);
}

export async function startInterviewSession(userId, payload = {}) {
  return mongoStore.startMockInterview(userId, payload);
}

export async function evaluateInterviewSessionData(userId, payload = {}) {
  return mongoStore.evaluateMockInterview(userId, payload);
}

export async function getAdminData() {
  return mongoStore.getAdminData();
}

export async function getCurrentUser(userId) {
  const profile = await mongoStore.getProfile(userId);
  let avatar = profile?.avatarUrl || '/images/alex_thompson.png';
  if (!avatar || avatar.includes('mock-bucket')) {
    avatar = '/images/alex_thompson.png';
  }
  return {
    id: userId,
    email: profile?.email || 'user@example.com',
    name: profile?.name || 'User',
    title: profile?.title || '',
    avatar,
    avatarUrl: avatar,
  };
}

export async function submitAuthRequest(payload, type = 'login') {
  const { email, password, name } = payload;

  if (!email || !password || (type === 'register' && !name)) {
    throw new Error('Please complete all required fields.');
  }

  if (type === 'register') {
    const user = await mongoStore.registerUser({ name, email, password });
    const token = generateToken(user);
    return {
      success: true,
      message: 'Account created successfully in MongoDB.',
      user: { id: user.id, email: user.email, name: user.name },
      token,
    };
  }

  const loginResult = await mongoStore.loginUser({ email, password });
  const token = generateToken(loginResult);
  return {
    success: true,
    message: 'Signed in successfully via MongoDB.',
    user: loginResult,
    token,
  };
}

// Profile Photo Controllers
export async function uploadProfilePhotoData(userId, fileBuffer, mimeType, fileName) {
  return mongoStore.uploadProfilePhoto(userId, fileBuffer, mimeType, fileName);
}

export async function getProfilePhotoData(userId) {
  return mongoStore.getProfilePhoto(userId);
}

export async function deleteProfilePhotoData(userId) {
  return mongoStore.deleteProfilePhoto(userId);
}

// Profile Resume Controllers
export async function uploadProfileResumeData(userId, fileBuffer, mimeType, fileName) {
  return mongoStore.uploadProfileResume(userId, fileBuffer, mimeType, fileName);
}

export async function getProfileResumeData(userId) {
  return mongoStore.getProfileResume(userId);
}

export async function deleteProfileResumeData(userId) {
  return mongoStore.deleteProfileResume(userId);
}

// Analysis Report Controllers
export async function createAnalysisReportData(userId, payload = {}) {
  const { reportTitle, fileBuffer, base64, mimeType, fileName, metadata } = payload;
  let buffer = fileBuffer;
  if (!buffer && base64) {
    const base64Data = base64.includes(';base64,') ? base64.split(';base64,')[1] : base64;
    buffer = Buffer.from(base64Data, 'base64');
  }
  if (!buffer) throw new Error('File content payload is required for analysis report storage.');

  return mongoStore.createAnalysisReport(userId, {
    reportTitle: reportTitle || 'Analysis Report',
    fileBuffer: buffer,
    mimeType: mimeType || 'application/pdf',
    fileName: fileName || 'report.pdf',
    metadata: metadata || {},
  });
}

export async function getAnalysisReportsData(userId) {
  return mongoStore.getAnalysisReports(userId);
}

export async function deleteAnalysisReportData(userId, reportId) {
  return mongoStore.deleteAnalysisReport(userId, reportId);
}

// General File Upload Controller
export async function uploadDocumentData(userId, { fileBuffer, base64, mimeType, fileName }) {
  let buffer = fileBuffer;
  if (!buffer && base64) {
    const base64Data = base64.includes(';base64,') ? base64.split(';base64,')[1] : base64;
    buffer = Buffer.from(base64Data, 'base64');
  }
  if (!buffer) throw new Error('File content payload is required.');

  return mongoStore.uploadDocumentFile(userId, buffer, mimeType, fileName);
}

