import { useState, useEffect, useCallback } from 'react';
import {
  getNotifications,
  markNotificationAsRead,
  markAllNotificationsAsRead,
  deleteNotification,
  clearAllNotifications,
} from '../services/notificationsService.js';

export function useNotifications() {
  const [items, setItems] = useState([]);
  const [loading, setLoading] = useState(true);

  const fetchNotifications = useCallback(async () => {
    try {
      setLoading(true);
      const data = await getNotifications();
      setItems(data.groups || data || []);
    } catch {
      setItems([]);
    } finally {
      setLoading(false);
    }
  }, []);

  useEffect(() => {
    fetchNotifications();
  }, [fetchNotifications]);

  const handleMarkRead = async (id) => {
    try {
      await markNotificationAsRead(id);
      setItems((curr) =>
        curr.map((item) => (item._id === id || item.id === id ? { ...item, read: true } : item))
      );
    } catch {
      // silent
    }
  };

  const handleMarkAllRead = async () => {
    try {
      await markAllNotificationsAsRead();
      setItems((curr) => curr.map((item) => ({ ...item, read: true })));
    } catch {
      // silent
    }
  };

  const handleDeleteNotif = async (id) => {
    try {
      await deleteNotification(id);
      setItems((curr) => curr.filter((i) => (i._id || i.id) !== id));
    } catch {
      // silent
    }
  };

  const handleClearAll = async () => {
    try {
      await clearAllNotifications();
      setItems([]);
    } catch {
      // silent
    }
  };

  const unreadCount = items.filter((i) => !i.read).length;

  return {
    items,
    loading,
    unreadCount,
    fetchNotifications,
    handleMarkRead,
    handleMarkAllRead,
    handleDeleteNotif,
    handleClearAll,
  };
}
