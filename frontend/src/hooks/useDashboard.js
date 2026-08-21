import { useState, useEffect, useCallback } from 'react';
import { getDashboard, addGoal, updateGoal, deleteGoal } from '../services/dashboardService.js';

export function useDashboard() {
  const [dashboardData, setDashboardData] = useState(null);
  const [loading, setLoading] = useState(true);
  const [newGoalTitle, setNewGoalTitle] = useState('');
  const [addingGoal, setAddingGoal] = useState(false);

  const loadDashboard = useCallback(async () => {
    try {
      const data = await getDashboard();
      setDashboardData(data);
    } catch {
      // silent — dashboard loads with null state
    } finally {
      setLoading(false);
    }
  }, []);

  useEffect(() => {
    loadDashboard();
  }, [loadDashboard]);

  const handleToggleGoal = async (goalId, currentDone) => {
    try {
      await updateGoal(goalId, !currentDone);
      loadDashboard();
    } catch {
      // silent
    }
  };

  const handleAddGoalSubmit = async (e) => {
    e.preventDefault();
    if (!newGoalTitle || !newGoalTitle.trim()) return;
    setAddingGoal(true);
    try {
      await addGoal(newGoalTitle.trim());
      setNewGoalTitle('');
      loadDashboard();
    } catch {
      // silent
    } finally {
      setAddingGoal(false);
    }
  };

  const handleDeleteGoal = async (goalId, e) => {
    e.stopPropagation();
    try {
      await deleteGoal(goalId);
      loadDashboard();
    } catch {
      // silent
    }
  };

  return {
    dashboardData,
    loading,
    newGoalTitle,
    setNewGoalTitle,
    addingGoal,
    handleToggleGoal,
    handleAddGoalSubmit,
    handleDeleteGoal,
  };
}
