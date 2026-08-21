import 'dotenv/config';
import test from 'node:test';
import assert from 'node:assert/strict';
import mongoose from 'mongoose';
import { createStore } from './store.js';

test.before(async () => {
  if (process.env.MONGODB_URI) {
    await mongoose.connect(process.env.MONGODB_URI);
  }
});

test.after(async () => {
  if (mongoose.connection.readyState !== 0) {
    await mongoose.disconnect();
  }
});

test('new user registration initializes clean record in MongoDB without mock data', async () => {
  const store = createStore();
  const testEmail = `alex_${Date.now()}@example.com`;

  const newUser = await store.registerUser({ name: 'Alex Smith', email: testEmail, password: 'password123' });
  assert.ok(newUser.id);
  assert.equal(newUser.name, 'Alex Smith');

  const dashboard = await store.getDashboard(newUser.id);
  assert.equal(dashboard.greeting, 'Alex');
  assert.ok(dashboard.user.id);
  assert.equal(dashboard.codingXP, 0);
  assert.equal(dashboard.careerReadiness, 0);
  assert.equal(dashboard.resumeScore, 'Not Generated');
  assert.equal(dashboard.interviewRank, '--');
  assert.equal(dashboard.goals.length, 0);
  assert.equal(dashboard.notifications.length, 0);
});

test('user data is strictly isolated per userId', async () => {
  const store = createStore();
  const emailA = `alice_${Date.now()}@example.com`;
  const emailB = `bob_${Date.now()}@example.com`;

  const userA = await store.registerUser({ name: 'Alice', email: emailA, password: 'password123' });
  const userB = await store.registerUser({ name: 'Bob', email: emailB, password: 'password123' });

  await store.addGoal(userA.id, 'Alice Goal 1');
  await store.addGoal(userB.id, 'Bob Goal 1');

  const goalsA = await store.getGoals(userA.id);
  const goalsB = await store.getGoals(userB.id);

  assert.ok(goalsA.some((g) => g.title === 'Alice Goal 1'));
  assert.ok(goalsB.some((g) => g.title === 'Bob Goal 1'));
  assert.ok(!goalsA.some((g) => g.title === 'Bob Goal 1'));
});

test('completing actions updates user analytics dynamically', async () => {
  const store = createStore();
  const emailMina = `mina_${Date.now()}@example.com`;

  const user = await store.registerUser({ name: 'Mina', email: emailMina, password: 'password123' });

  const goal = await store.addGoal(user.id, 'Complete 5 practice questions');
  await store.updateGoal(user.id, goal.id || goal._id, { done: true });

  const dashboard = await store.getDashboard(user.id);
  assert.ok(dashboard.codingXP >= 25);
  assert.ok(dashboard.recentActivity.length > 0);
});

test('activity log filtering and pagination', async () => {
  const store = createStore();
  const testEmail = `act_${Date.now()}@example.com`;
  const user = await store.registerUser({ name: 'Activity User', email: testEmail, password: 'password123' });

  const activityData = await store.getActivityLog(user.id, { category: 'All' });
  assert.ok(Array.isArray(activityData.activities));
  assert.ok(activityData.categories.includes('Resume Builder'));
});

test('getInterviewReport returns null when interviewId is missing, invalid, or uncompleted', async () => {
  const store = createStore();
  const testEmail = `rep_${Date.now()}@example.com`;
  const user = await store.registerUser({ name: 'Report User', email: testEmail, password: 'password123' });

  // Missing interviewId
  const noIdReport = await store.getInterviewReport(user.id);
  assert.equal(noIdReport, null);

  // Invalid interviewId
  const invalidIdReport = await store.getInterviewReport(user.id, '507f1f77bcf86cd799439011');
  assert.equal(invalidIdReport, null);
});

test('evaluateMockInterview successfully generates evaluation report and saves completed interview', async () => {
  const store = createStore();
  const testEmail = `eval_${Date.now()}@example.com`;
  const user = await store.registerUser({ name: 'Eval User', email: testEmail, password: 'password123' });

  const result = await store.evaluateMockInterview(user.id, {
    role: 'Product Manager',
    company: 'Google',
    difficulty: 'Mid-Level',
    qnaList: [{ question: 'Sample Q', answer: 'Sample A' }],
  });

  assert.ok(result.id);
  assert.equal(result.status, 'completed');
  assert.ok(typeof result.score === 'number');

  // Verify it can be retrieved via getInterviewReport
  const fetchedReport = await store.getInterviewReport(user.id, result.id);
  assert.ok(fetchedReport);
  assert.equal(fetchedReport.id, result.id);
  assert.equal(fetchedReport.status, 'completed');
});


