import { useState, useEffect } from 'react';
import { getSettings, updateSettings } from '../services/settingsService.js';

const getTabFromUrl = () => {
  if (typeof window === 'undefined') return 'Notifications';
  const params = new URLSearchParams(window.location.search);
  const tabParam = params.get('tab');
  if (tabParam) {
    const formatted = tabParam.charAt(0).toUpperCase() + tabParam.slice(1).toLowerCase();
    if (['Notifications', 'Security', 'Billing'].includes(formatted)) {
      return formatted;
    }
  }
  return 'Notifications';
};

export function useSettings() {
  const [activeTab, setActiveTab] = useState(getTabFromUrl);
  const [preferences, setPreferences] = useState({ email: true, reminders: true, insights: false });
  const [settingsData, setSettingsData] = useState(null);
  const [saving, setSaving] = useState(false);

  useEffect(() => {
    const handlePopState = () => {
      setActiveTab(getTabFromUrl());
    };
    window.addEventListener('popstate', handlePopState);
    return () => window.removeEventListener('popstate', handlePopState);
  }, []);

  useEffect(() => {
    getSettings()
      .then((data) => {
        setSettingsData({
          tabs: ['Notifications', 'Security', 'Billing'],
          preferences: data.preferences || { email: true, reminders: true, insights: false },
          content: data.content || {}
        });
        setPreferences(data.preferences || { email: true, reminders: true, insights: false });
      })
      .catch(() => {
        setSettingsData({
          tabs: ['Notifications', 'Security', 'Billing'],
          preferences: { email: true, reminders: true, insights: false },
          content: {
            Security: [['Password', '••••••••'], ['2FA', 'Disabled']],
            Billing: [['Plan', 'Free Tier'], ['Payment Method', 'None']]
          }
        });
      });
  }, []);

  const handleSave = async () => {
    setSaving(true);
    try {
      const data = await updateSettings({ preferences });
      if (data) {
        setSettingsData((current) =>
          current ? { ...current, preferences: data.preferences } : current
        );
      }
    } catch {
      // Ignore API failure if offline
    } finally {
      setSaving(false);
    }
  };

  return {
    activeTab,
    setActiveTab,
    theme: 'Light',
    setTheme: () => {},
    preferences,
    setPreferences,
    settingsData,
    saving,
    handleSave,
  };
}
