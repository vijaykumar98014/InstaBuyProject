import React, { useEffect, useRef, useState, useCallback } from 'react';
import { useSelector } from 'react-redux';
import { useLocation } from 'react-router-dom';
import { useNotifications } from '../../hooks';

function NotificationBell() {
  const { pathname } = useLocation();
  const { role, userId } = useSelector((s) => s.user || {});
  const notificationUserId = role === 'ADMIN' ? 'ADMIN' : (userId || localStorage.getItem('userId') || '');
  const { notifications, unreadCount, markAllAsRead, clearNotifications } = useNotifications(notificationUserId);
  const [open, setOpen] = useState(false);
  const ref = useRef(null);

  const toggle = useCallback(() => {
    setOpen((prev) => {
      const next = !prev;
      if (!prev) markAllAsRead();
      return next;
    });
  }, [markAllAsRead]);

  useEffect(() => {
    const onClick = (e) => {
      if (!ref.current?.contains(e.target)) setOpen(false);
    };
    const onKeyDown = (e) => {
      if (e.key === 'Escape') setOpen(false);
    };
    window.addEventListener('mousedown', onClick);
    window.addEventListener('keydown', onKeyDown);
    return () => {
      window.removeEventListener('mousedown', onClick);
      window.removeEventListener('keydown', onKeyDown);
    };
  }, []);

  useEffect(() => {
    setOpen(false);
  }, [pathname]);

  return (
    <div className="navbar__notif" ref={ref}>
      <button className="navbar__notif-btn" onClick={toggle} aria-label="Notifications">
        🔔
        {unreadCount > 0 && <span className="navbar__notif-count">{unreadCount > 9 ? '9+' : unreadCount}</span>}
      </button>

      <div className={`navbar__notif-dropdown ${open ? 'navbar__notif-dropdown--open' : ''}`} aria-hidden={!open}>
          <div className="navbar__notif-head">
            <span>Notifications</span>
            <button className="navbar__notif-clear" onClick={clearNotifications}>Clear</button>
          </div>

          {notifications.length === 0 ? (
            <div className="navbar__notif-empty">No notifications yet</div>
          ) : (
            <div className="navbar__notif-list">
              {notifications.slice(0, 10).map((item) => (
                <div key={item.id} className={`navbar__notif-item ${item.read ? '' : 'navbar__notif-item--unread'}`}>
                  <div className="navbar__notif-text">{item.message}</div>
                </div>
              ))}
            </div>
          )}
      </div>
    </div>
  );
}

export default React.memo(NotificationBell);
