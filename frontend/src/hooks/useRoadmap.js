import { useState, useEffect, useCallback } from 'react';
import { getRoadmap, generateRoadmap, toggleMilestone } from '../services/roadmapService.js';

export function useRoadmap(user) {
  const [isGenerating, setIsGenerating] = useState(false);
  const [isLoading, setIsLoading] = useState(true);
  const [targetRole, setTargetRole] = useState(user?.title || 'Software Engineer');
  const [targetCompany, setTargetCompany] = useState('Top Tech Companies');
  const [roadmapData, setRoadmapData] = useState(null);
  const [error, setError] = useState('');
  const [successMessage, setSuccessMessage] = useState('');

  const clearMessages = () => {
    setTimeout(() => { setError(''); setSuccessMessage(''); }, 5000);
  };

  const loadRoadmap = useCallback(async () => {
    setIsLoading(true);
    try {
      const data = await getRoadmap();
      if (data && (data.milestones?.length || data.focusAreas?.length)) {
        setRoadmapData(data);
        if (data.targetRole) setTargetRole(data.targetRole);
        if (data.targetCompany) setTargetCompany(data.targetCompany);
      }
    } catch (err) {
      console.error('[useRoadmap] Failed to load roadmap:', err.message);
    } finally {
      setIsLoading(false);
    }
  }, []);

  useEffect(() => {
    const params = new URLSearchParams(window.location.search);
    const paramRole = params.get('role');
    const paramCompany = params.get('company');

    if (paramRole && paramCompany) {
      setTargetRole(paramRole);
      setTargetCompany(paramCompany);
      setIsLoading(true);
      generateRoadmap(paramRole.trim(), paramCompany.trim())
        .then((data) => {
          setRoadmapData(data);
          setSuccessMessage(`Tailored practice roadmap loaded for ${paramRole} @ ${paramCompany}!`);
          clearMessages();
        })
        .catch(() => loadRoadmap())
        .finally(() => setIsLoading(false));
    } else {
      if (user?.title) setTargetRole(user.title);
      loadRoadmap();
    }
  }, [user, loadRoadmap]);

  const handleAiGenerate = async () => {
    // Input validation
    if (!targetRole.trim()) {
      setError('Please enter a target role (e.g., Software Engineer).');
      clearMessages();
      return;
    }
    if (!targetCompany.trim()) {
      setError('Please enter a target company (e.g., Google).');
      clearMessages();
      return;
    }

    setIsGenerating(true);
    setError('');
    setSuccessMessage('');

    try {
      const data = await generateRoadmap(targetRole.trim(), targetCompany.trim());
      setRoadmapData(data);
      setSuccessMessage(`Roadmap generated successfully! ${data.milestones?.length || 0} milestones created for ${targetRole} @ ${targetCompany}.`);
      clearMessages();
    } catch (err) {
      const msg = err?.message || 'Failed to generate roadmap. Please try again.';
      setError(msg);
      clearMessages();
      console.error('[useRoadmap] Generation error:', msg);
    } finally {
      setIsGenerating(false);
    }
  };

  const handleToggleMilestone = async (id, currentDone) => {
    // Optimistic update
    setRoadmapData((prev) => {
      if (!prev) return prev;
      const milestones = prev.milestones.map((m) =>
        (m.id === id ? { ...m, done: !currentDone, time: !currentDone ? 'Done' : 'In progress', tone: !currentDone ? 'mint' : 'blue' } : m)
      );
      return { ...prev, milestones };
    });

    try {
      await toggleMilestone(id, !currentDone);
    } catch (err) {
      // Revert optimistic update on failure
      setRoadmapData((prev) => {
        if (!prev) return prev;
        const milestones = prev.milestones.map((m) =>
          (m.id === id ? { ...m, done: currentDone, time: currentDone ? 'Done' : 'In progress', tone: currentDone ? 'mint' : 'blue' } : m)
        );
        return { ...prev, milestones };
      });
      setError('Failed to update milestone. Please try again.');
      clearMessages();
      console.error('[useRoadmap] Toggle milestone error:', err.message);
    }
  };

  const milestones = roadmapData?.milestones || [];
  const completedCount = milestones.filter((m) => m.done).length;
  const progressPercent = milestones.length
    ? Math.round((completedCount / milestones.length) * 100)
    : 0;

  return {
    isGenerating,
    isLoading,
    targetRole,
    setTargetRole,
    targetCompany,
    setTargetCompany,
    roadmapData,
    milestones,
    completedCount,
    progressPercent,
    error,
    successMessage,
    handleAiGenerate,
    handleToggleMilestone,
  };
}
