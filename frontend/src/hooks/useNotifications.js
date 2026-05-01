import { useCallback, useEffect, useMemo, useState } from "react";

const NOTIFICATION_STORAGE_PREFIX = "instabuy:notifications:";
const MAX_NOTIFICATIONS = 10;
const NOTIFICATION_EVENT = "instabuy:notifications-updated";

function resolveNotificationUserId(userId) {
  if (userId !== undefined && userId !== null && String(userId).trim()) {
    return String(userId).trim();
  }

  const role = localStorage.getItem("role");
  if (role === "ADMIN") return "ADMIN";

  const localUserId = localStorage.getItem("userId");
  if (localUserId && localUserId.trim()) return localUserId.trim();

  return "ANONYMOUS";
}

function getNotificationStorageKey(userId) {
  return `${NOTIFICATION_STORAGE_PREFIX}${resolveNotificationUserId(userId)}`;
}

function parseStoredNotifications(userId) {
  try {
    const raw = localStorage.getItem(getNotificationStorageKey(userId));
    if (!raw) return [];

    const parsed = JSON.parse(raw);
    if (!Array.isArray(parsed)) return [];

    return parsed
      .filter((item) => item && typeof item === "object")
      .map((item, index) => ({
        id: item.id || `${Date.now()}-${index}`,
        message: typeof item.message === "string" ? item.message : "",
        read: Boolean(item.read),
        createdAt: Number(item.createdAt) || Date.now(),
      }))
      .filter((item) => item.message.trim() !== "")
      .sort((a, b) => (b.createdAt || 0) - (a.createdAt || 0))
      .slice(0, MAX_NOTIFICATIONS);
  } catch {
    return [];
  }
}

function saveNotifications(userId, list) {
  const resolvedUserId = resolveNotificationUserId(userId);
  const storageKey = getNotificationStorageKey(resolvedUserId);
  localStorage.setItem(storageKey, JSON.stringify(list));
  window.dispatchEvent(
    new CustomEvent(NOTIFICATION_EVENT, {
      detail: {
        userId: resolvedUserId,
        key: storageKey,
      },
    })
  );
}

export function useNotifications(userId) {
  const resolvedUserId = useMemo(() => resolveNotificationUserId(userId), [userId]);
  const storageKey = useMemo(() => getNotificationStorageKey(resolvedUserId), [resolvedUserId]);
  const [notifications, setNotifications] = useState(() => parseStoredNotifications(resolvedUserId));

  useEffect(() => {
    setNotifications(parseStoredNotifications(resolvedUserId));
  }, [resolvedUserId]);

  useEffect(() => {
    const syncFromStorage = () => {
      setNotifications(parseStoredNotifications(resolvedUserId));
    };

    const onStorage = (event) => {
      if (event.key && event.key !== storageKey) return;
      syncFromStorage();
    };

    const onNotificationsUpdated = (event) => {
      const updatedKey = event?.detail?.key;
      if (updatedKey && updatedKey !== storageKey) return;
      syncFromStorage();
    };

    window.addEventListener("storage", onStorage);
    window.addEventListener(NOTIFICATION_EVENT, onNotificationsUpdated);

    return () => {
      window.removeEventListener("storage", onStorage);
      window.removeEventListener(NOTIFICATION_EVENT, onNotificationsUpdated);
    };
  }, [resolvedUserId, storageKey]);

  const addNotification = useCallback((message) => {
    const normalizedMessage = typeof message === "string" ? message.trim() : "";
    if (!normalizedMessage) return;

    const next = [
      {
        id: `${Date.now()}-${Math.random().toString(36).slice(2, 8)}`,
        message: normalizedMessage,
        read: false,
        createdAt: Date.now(),
      },
      ...parseStoredNotifications(resolvedUserId),
    ].slice(0, MAX_NOTIFICATIONS);

    setNotifications(next);
    saveNotifications(resolvedUserId, next);
  }, [resolvedUserId]);

  const markAllAsRead = useCallback(() => {
    const next = parseStoredNotifications(resolvedUserId).map((item) => ({ ...item, read: true }));
    setNotifications(next);
    saveNotifications(resolvedUserId, next);
  }, [resolvedUserId]);

  const clearNotifications = useCallback(() => {
    setNotifications([]);
    saveNotifications(resolvedUserId, []);
  }, [resolvedUserId]);

  const unreadCount = useMemo(
    () => notifications.filter((item) => !item.read).length,
    [notifications]
  );

  const sortedNotifications = useMemo(
    () => [...notifications].sort((a, b) => (b.createdAt || 0) - (a.createdAt || 0)),
    [notifications]
  );

  return {
    notifications: sortedNotifications,
    unreadCount,
    addNotification,
    markAllAsRead,
    clearNotifications,
  };
}

export {
  NOTIFICATION_EVENT,
  NOTIFICATION_STORAGE_PREFIX,
  getNotificationStorageKey,
  resolveNotificationUserId,
};
