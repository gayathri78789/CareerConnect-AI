import express from 'express';
import { authMiddleware } from '../middleware/authMiddleware.js';
import { uploadMiddleware } from '../middleware/uploadMiddleware.js';
import { isCloudinaryConfigured } from '../services/cloudinaryService.js';

import {
  addGoalData,
  analyzeJobDescriptionData,
  buildResumeData,
  clearAllNotificationsData,
  clearCoachHistoryData,
  deleteGoalData,
  deleteNotificationData,
  evaluateInterviewSessionData,
  generateRoadmapData,
  getActivityData,
  getAdminData,
  getCoachData,
  getChatSessionsData,
  createChatSessionData,
  updateChatSessionData,
  deleteChatSessionData,
  getCurrentUser,
  getDashboardData,
  getInterviewReportData,
  getLatestJDAnalysisData,
  getNotificationsData,
  getPracticeData,
  submitPracticeData,
  updateCareerTrackData,
  getCodingQuestionsData,
  getCodingTopicsData,
  getCodingHistoryData,
  getAptitudeQuestionsData,
  getUserPracticeStatsData,
  getRandomCodingQuestionData,
  getRandomAptitudeQuestionData,
  getProfileData,
  getResumeData,
  getRoadmapData,
  getSettingsData,
  handleChatRequest,
  handleChatStreamRequest,
  markAllNotificationsReadData,
  markNotificationReadData,
  optimizeResumeData,
  restoreResumeVersionData,
  startInterviewSession,
  submitAuthRequest,
  updateGoalData,
  updateMilestoneData,
  updateProfileData,
  updateResumeData,
  updateSettingsData,
  uploadProfilePhotoData,
  getProfilePhotoData,
  deleteProfilePhotoData,
  uploadProfileResumeData,
  getProfileResumeData,
  deleteProfileResumeData,
  createAnalysisReportData,
  getAnalysisReportsData,
  deleteAnalysisReportData,
  uploadDocumentData,
} from '../controllers/controller.js';

const router = express.Router();

router.get('/health', (req, res) => {
  res.json({
    ok: true,
    message: 'CareerPrep API is running with authenticated user session management',
    config: {
      mongodbConfigured: Boolean(process.env.MONGODB_URI),
      aiConfigured: Boolean(process.env.OPENAI_API_KEY || process.env.GEMINI_API_KEY),
      cloudinaryConfigured: isCloudinaryConfigured(),
    },
  });
});



// AI status check — never exposes the key value
router.get('/ai-status', (req, res) => {
  const key = process.env.GEMINI_API_KEY || '';
  const isValid = key.startsWith('AIza');
  const isOAuth = key.startsWith('AQ.') || key.startsWith('ya29.');
  res.json({
    configured: isValid,
    issue: !key
      ? 'missing'
      : isOAuth
      ? 'oauth_token'
      : !isValid
      ? 'invalid_format'
      : null,
  });
});


// Auth Routes (Public)
router.post('/auth/login', async (req, res) => {
  try {
    const result = await submitAuthRequest(req.body, 'login');
    res.json(result);
  } catch (error) {
    res.status(400).json({ error: error.message });
  }
});

router.post('/auth/register', async (req, res) => {
  try {
    const result = await submitAuthRequest(req.body, 'register');
    res.json(result);
  } catch (error) {
    res.status(400).json({ error: error.message });
  }
});

// Protect all following routes with authMiddleware
router.use(authMiddleware);

router.get('/auth/me', async (req, res) => {
  try {
    res.json(await getCurrentUser(req.user.id));
  } catch (error) {
    res.status(401).json({ error: error.message });
  }
});

// Dashboard & Goals
router.get('/dashboard', async (req, res) => {
  try {
    res.json(await getDashboardData(req.user.id));
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
});

router.post('/goals', async (req, res) => {
  try {
    const result = await addGoalData(req.user.id, req.body.title);
    res.status(201).json(result);
  } catch (error) {
    res.status(400).json({ error: error.message });
  }
});

router.put('/goals/:id', async (req, res) => {
  try {
    const result = await updateGoalData(req.user.id, req.params.id, req.body);
    res.json(result);
  } catch (error) {
    res.status(400).json({ error: error.message });
  }
});

router.delete('/goals/:id', async (req, res) => {
  try {
    const result = await deleteGoalData(req.user.id, req.params.id);
    res.json(result);
  } catch (error) {
    res.status(400).json({ error: error.message });
  }
});

// Resume & AI Builder
router.get('/resume', async (req, res) => {
  try {
    res.json(await getResumeData(req.user.id));
  } catch (error) {
    console.error('[GET /resume error]:', error);
    res.status(500).json({ error: error.message });
  }
});

router.post('/resume/build', async (req, res) => {
  try {
    const result = await buildResumeData(req.user.id);
    res.json(result);
  } catch (error) {
    console.error('[POST /resume/build error]:', error);
    res.status(400).json({ error: error.message });
  }
});

router.put('/resume', async (req, res) => {
  try {
    const result = await updateResumeData(req.user.id, req.body);
    res.json(result);
  } catch (error) {
    console.error('[PUT /resume error]:', error);
    res.status(400).json({ error: error.message });
  }
});

router.post('/resume/restore-version', async (req, res) => {
  try {
    const result = await restoreResumeVersionData(req.user.id, req.body);
    res.json(result);
  } catch (error) {
    console.error('[POST /resume/restore-version error]:', error);
    res.status(400).json({ error: error.message });
  }
});

router.post('/resume/optimize', async (req, res) => {
  try {
    const result = await optimizeResumeData(req.user.id, req.body);
    res.json(result);
  } catch (error) {
    res.status(400).json({ error: error.message });
  }
});

// JD Analyzer
router.get('/jd-analyzer', async (req, res) => {
  try {
    const result = await getLatestJDAnalysisData(req.user.id);
    res.json(result);
  } catch (error) {
    res.status(400).json({ error: error.message });
  }
});

router.post('/jd-analyzer', async (req, res) => {
  try {
    const result = await analyzeJobDescriptionData(req.user.id, req.body);
    res.json(result);
  } catch (error) {
    res.status(400).json({ error: error.message });
  }
});

// AI Coach & Chat
router.get('/coach', async (req, res) => {
  try {
    const { sessionId } = req.query;
    res.json(await getCoachData(req.user.id, sessionId));
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
});

router.get('/chat/sessions', async (req, res) => {
  try {
    res.json(await getChatSessionsData(req.user.id));
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
});

router.post('/chat/sessions', async (req, res) => {
  try {
    res.json(await createChatSessionData(req.user.id, req.body));
  } catch (error) {
    res.status(400).json({ error: error.message });
  }
});

router.patch('/chat/sessions/:id', async (req, res) => {
  try {
    res.json(await updateChatSessionData(req.user.id, req.params.id, req.body));
  } catch (error) {
    res.status(400).json({ error: error.message });
  }
});

router.delete('/chat/sessions/:id', async (req, res) => {
  try {
    res.json(await deleteChatSessionData(req.user.id, req.params.id));
  } catch (error) {
    res.status(400).json({ error: error.message });
  }
});

router.post('/chat', async (req, res) => {
  try {
    const result = await handleChatRequest(req.user.id, req.body);
    res.json(result);
  } catch (error) {
    res.status(400).json({ error: error.message });
  }
});

router.post('/chat/stream', async (req, res) => {
  try {
    await handleChatStreamRequest(req.user.id, req.body, res);
  } catch (error) {
    if (!res.headersSent) {
      res.status(400).json({ error: error.message });
    } else {
      res.write(`data: ${JSON.stringify({ type: 'error', message: error.message })}\n\n`);
      res.end();
    }
  }
});

router.delete('/chat/clear', async (req, res) => {
  try {
    const result = await clearCoachHistoryData(req.user.id);
    res.json(result);
  } catch (error) {
    res.status(400).json({ error: error.message });
  }
});

// File Upload & Specialized Analysis
router.post('/upload', uploadMiddleware.single('file'), async (req, res) => {
  try {
    let fileBuffer;
    let name;
    let type;
    let size;
    let base64;
    let extractedText = req.body?.extractedText || '';

    if (req.file) {
      fileBuffer = req.file.buffer;
      name = req.file.originalname;
      type = req.file.mimetype;
      size = req.file.size;
    } else {
      name = req.body?.name;
      type = req.body?.type || req.body?.mimeType || 'application/octet-stream';
      size = req.body?.size || 0;
      base64 = req.body?.base64;
      if (base64) {
        const base64Data = base64.includes(';base64,') ? base64.split(';base64,')[1] : base64;
        fileBuffer = Buffer.from(base64Data, 'base64');
      }
    }

    if (!name || !type) throw new Error('File name and type are required.');

    let uploadedFile = null;
    if (fileBuffer) {
      uploadedFile = await uploadDocumentData(req.user.id, {
        fileBuffer,
        mimeType: type,
        fileName: name,
      });
    }

    const fileObj = {
      id: uploadedFile?.id || `file-${Date.now()}-${Math.random().toString(36).substring(2, 6)}`,
      name,
      type,
      mimeType: type,
      size: size || fileBuffer?.length || 0,
      key: uploadedFile?.key || null,
      url: uploadedFile?.url || null,
      base64: base64 || null,
      extractedText,
      uploadedAt: new Date(),
    };

    res.json({ success: true, file: fileObj });
  } catch (error) {
    res.status(400).json({ error: error.message });
  }
});

router.post('/resume-review', async (req, res) => {
  try {
    const { resumeText, targetRole } = req.body;
    const prompt = `Review this resume for the role "${targetRole || 'Software Engineer'}". Critique bullet points using the Google X-Y-Z formula and identify missing technical skills.`;
    const result = await handleChatRequest(req.user.id, { message: prompt, attachments: resumeText ? [{ name: 'Resume.txt', extractedText: resumeText }] : [] });
    res.json(result);
  } catch (error) {
    res.status(400).json({ error: error.message });
  }
});

router.post('/document-analysis', async (req, res) => {
  try {
    const { documentName, documentContent } = req.body;
    const prompt = `Analyze this document "${documentName || 'Document'}": summarize key takeaways, extract core technical concepts, and provide actionable next steps.`;
    const result = await handleChatRequest(req.user.id, { message: prompt, attachments: [{ name: documentName || 'Doc', extractedText: documentContent }] });
    res.json(result);
  } catch (error) {
    res.status(400).json({ error: error.message });
  }
});

router.post('/certificate-analysis', async (req, res) => {
  try {
    const { certificateName, issuer, base64, mimeType } = req.body;
    const prompt = `Analyze this certification "${certificateName || 'Certificate'}" issued by ${issuer || 'issuing body'}. Verify its industry relevance, skills validated, and how to showcase it on LinkedIn/Resume.`;
    const attachments = base64 ? [{ name: certificateName || 'Cert', base64, mimeType: mimeType || 'image/png' }] : [];
    const result = await handleChatRequest(req.user.id, { message: prompt, attachments });
    res.json(result);
  } catch (error) {
    res.status(400).json({ error: error.message });
  }
});

router.post('/image-analysis', async (req, res) => {
  try {
    const { imageName, base64, mimeType, userQuery } = req.body;
    const prompt = userQuery || `Analyze this image "${imageName || 'Screenshot'}". Perform OCR, explain diagrams or code snippets shown, and provide actionable insights.`;
    const attachments = base64 ? [{ name: imageName || 'Image', base64, mimeType: mimeType || 'image/png' }] : [];
    const result = await handleChatRequest(req.user.id, { message: prompt, attachments });
    res.json(result);
  } catch (error) {
    res.status(400).json({ error: error.message });
  }
});

// Roadmap
router.get('/roadmap', async (req, res) => {
  try {
    res.json(await getRoadmapData(req.user.id));
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
});

router.post('/roadmap/generate', async (req, res) => {
  try {
    const result = await generateRoadmapData(req.user.id, req.body);
    res.json(result);
  } catch (error) {
    res.status(400).json({ error: error.message });
  }
});

router.put('/roadmap/milestones/:id', async (req, res) => {
  try {
    const result = await updateMilestoneData(req.user.id, req.params.id, req.body);
    res.json(result);
  } catch (error) {
    res.status(400).json({ error: error.message });
  }
});

// Practice & User Stats
router.get('/user/practice-stats', async (req, res) => {
  try {
    const stats = await getUserPracticeStatsData(req.user.id);
    res.json(stats);
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
});

router.get('/practice', async (req, res) => {
  try {
    res.json(await getPracticeData(req.user.id));
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
});

router.put('/practice/career', async (req, res) => {
  try {
    const { careerTrack } = req.body;
    const result = await updateCareerTrackData(req.user.id, careerTrack);
    res.json(result);
  } catch (error) {
    res.status(400).json({ error: error.message });
  }
});

router.get('/practice/coding', async (req, res) => {
  try {
    const { career, topic, difficulty, search } = req.query;
    const result = await getCodingQuestionsData(req.user.id, { career, topic, difficulty, search });
    res.json(result);
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
});

router.get('/practice/coding/random', async (req, res) => {
  try {
    const { career, topic, difficulty } = req.query;
    const result = await getRandomCodingQuestionData(req.user.id, { career, topic, difficulty });
    res.json(result);
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
});

router.get('/practice/coding/topics', async (req, res) => {
  try {
    const { career } = req.query;
    const topics = await getCodingTopicsData(career);
    res.json({ topics });
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
});

router.get('/practice/coding/history', async (req, res) => {
  try {
    const history = await getCodingHistoryData(req.user.id);
    res.json({ history });
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
});

router.get('/practice/aptitude', async (req, res) => {
  try {
    const { category, difficulty } = req.query;
    const result = await getAptitudeQuestionsData({ category, difficulty });
    res.json(result);
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
});

router.get('/practice/aptitude/random', async (req, res) => {
  try {
    const { category, difficulty } = req.query;
    const result = await getRandomAptitudeQuestionData({ category, difficulty });
    res.json(result);
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
});

router.post('/practice/submit', async (req, res) => {
  try {
    const result = await submitPracticeData(req.user.id, req.body);
    res.json(result);
  } catch (error) {
    res.status(400).json({ error: error.message });
  }
});

// Mock Interview Session & Report
router.get('/interview-report', async (req, res) => {
  try {
    const { interviewId } = req.query;
    res.json(await getInterviewReportData(req.user.id, interviewId));
  } catch (error) {
    res.status(400).json({ error: error.message });
  }
});

router.post('/interview/start', async (req, res) => {
  try {
    const result = await startInterviewSession(req.user.id, req.body);
    res.json(result);
  } catch (error) {
    res.status(400).json({ error: error.message });
  }
});

router.post('/interview/evaluate', async (req, res) => {
  try {
    const result = await evaluateInterviewSessionData(req.user.id, req.body);
    res.json(result);
  } catch (error) {
    res.status(400).json({ error: error.message });
  }
});


// Activity Log
router.get('/activity', async (req, res) => {
  try {
    const { search, category, page, limit } = req.query;
    const result = await getActivityData(req.user.id, { search, category, page, limit });
    res.json(result);
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
});

// Notifications
router.get('/notifications', async (req, res) => {
  try {
    res.json(await getNotificationsData(req.user.id));
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
});

router.patch('/notifications/read-all', async (req, res) => {
  try {
    const result = await markAllNotificationsReadData(req.user.id);
    res.json(result);
  } catch (error) {
    res.status(400).json({ error: error.message });
  }
});

router.patch('/notifications/:id/read', async (req, res) => {
  try {
    const result = await markNotificationReadData(req.user.id, req.params.id);
    res.json(result);
  } catch (error) {
    res.status(400).json({ error: error.message });
  }
});

router.delete('/notifications', async (req, res) => {
  try {
    const result = await clearAllNotificationsData(req.user.id);
    res.json(result);
  } catch (error) {
    res.status(400).json({ error: error.message });
  }
});

router.delete('/notifications/:id', async (req, res) => {
  try {
    const result = await deleteNotificationData(req.user.id, req.params.id);
    res.json(result);
  } catch (error) {
    res.status(400).json({ error: error.message });
  }
});

// Profile & Settings
router.get('/profile', async (req, res) => {
  try {
    res.json(await getProfileData(req.user.id));
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
});

router.put('/profile', async (req, res) => {
  try {
    const result = await updateProfileData(req.user.id, req.body);
    res.json(result);
  } catch (error) {
    res.status(400).json({ error: error.message });
  }
});

// Photo Upload & Management
router.post('/profile/photo', uploadMiddleware.single('file'), async (req, res) => {
  try {
    let fileBuffer;
    let mimeType;
    let fileName;

    if (req.file) {
      fileBuffer = req.file.buffer;
      mimeType = req.file.mimetype;
      fileName = req.file.originalname;
    } else if (req.body && req.body.base64) {
      const { base64, name, type } = req.body;
      const base64Data = base64.includes(';base64,') ? base64.split(';base64,')[1] : base64;
      fileBuffer = Buffer.from(base64Data, 'base64');
      mimeType = type || 'image/png';
      fileName = name || 'avatar.png';
    } else {
      throw new Error('No image file or base64 data provided.');
    }

    if (!mimeType.startsWith('image/')) {
      throw new Error('File must be a valid image (JPG, PNG, WEBP, GIF).');
    }

    const result = await uploadProfilePhotoData(req.user.id, fileBuffer, mimeType, fileName);
    res.json(result);
  } catch (error) {
    res.status(400).json({ error: error.message });
  }
});

router.get('/profile/photo', async (req, res) => {
  try {
    const result = await getProfilePhotoData(req.user.id);
    res.json(result);
  } catch (error) {
    res.status(400).json({ error: error.message });
  }
});

router.delete('/profile/photo', async (req, res) => {
  try {
    const result = await deleteProfilePhotoData(req.user.id);
    res.json(result);
  } catch (error) {
    res.status(400).json({ error: error.message });
  }
});

// Resume Upload & Management
router.post('/profile/resume', uploadMiddleware.single('file'), async (req, res) => {
  try {
    let fileBuffer;
    let mimeType;
    let fileName;

    if (req.file) {
      fileBuffer = req.file.buffer;
      mimeType = req.file.mimetype;
      fileName = req.file.originalname;
    } else if (req.body && req.body.base64) {
      const { base64, name, type } = req.body;
      const base64Data = base64.includes(';base64,') ? base64.split(';base64,')[1] : base64;
      fileBuffer = Buffer.from(base64Data, 'base64');
      mimeType = type || 'application/pdf';
      fileName = name || 'resume.pdf';
    } else {
      throw new Error('No resume file or base64 data provided.');
    }

    const result = await uploadProfileResumeData(req.user.id, fileBuffer, mimeType, fileName);
    res.json(result);
  } catch (error) {
    res.status(400).json({ error: error.message });
  }
});

router.get('/profile/resume', async (req, res) => {
  try {
    const result = await getProfileResumeData(req.user.id);
    res.json(result);
  } catch (error) {
    res.status(400).json({ error: error.message });
  }
});

router.delete('/profile/resume', async (req, res) => {
  try {
    const result = await deleteProfileResumeData(req.user.id);
    res.json(result);
  } catch (error) {
    res.status(400).json({ error: error.message });
  }
});

// Analysis Reports Storage & Management
router.post('/reports/generate', uploadMiddleware.single('file'), async (req, res) => {
  try {
    let fileBuffer;
    let mimeType = req.body?.mimeType || 'application/pdf';
    let fileName = req.body?.fileName || 'report.pdf';
    const reportTitle = req.body?.reportTitle || req.body?.title || 'Analysis Report';

    if (req.file) {
      fileBuffer = req.file.buffer;
      mimeType = req.file.mimetype;
      fileName = req.file.originalname;
    } else if (req.body && (req.body.base64 || req.body.fileContent)) {
      const content = req.body.base64 || req.body.fileContent;
      const base64Data = content.includes(';base64,') ? content.split(';base64,')[1] : content;
      fileBuffer = Buffer.from(base64Data, 'base64');
    } else {
      const textContent = req.body?.content || JSON.stringify(req.body || {}, null, 2);
      fileBuffer = Buffer.from(textContent, 'utf-8');
      mimeType = 'text/plain';
      fileName = 'report.txt';
    }

    const result = await createAnalysisReportData(req.user.id, {
      reportTitle,
      fileBuffer,
      mimeType,
      fileName,
      metadata: req.body?.metadata || {},
    });
    res.status(201).json(result);
  } catch (error) {
    res.status(400).json({ error: error.message });
  }
});

router.get('/reports', async (req, res) => {
  try {
    const result = await getAnalysisReportsData(req.user.id);
    res.json(result);
  } catch (error) {
    res.status(400).json({ error: error.message });
  }
});

router.delete('/reports/:id', async (req, res) => {
  try {
    const result = await deleteAnalysisReportData(req.user.id, req.params.id);
    res.json(result);
  } catch (error) {
    res.status(400).json({ error: error.message });
  }
});

router.get('/settings', async (req, res) => {
  try {
    res.json(await getSettingsData(req.user.id));
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
});

router.put('/settings', async (req, res) => {
  try {
    const result = await updateSettingsData(req.user.id, req.body);
    res.json(result);
  } catch (error) {
    res.status(400).json({ error: error.message });
  }
});

// Admin
router.get('/admin', async (req, res) => {
  try {
    res.json(await getAdminData());
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
});

export default router;
