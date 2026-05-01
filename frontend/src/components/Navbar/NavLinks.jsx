import React from 'react';
import { useLocation, useNavigate } from 'react-router-dom';
import { useSelector } from 'react-redux';
import { getNavItems } from './navbarConfig';

function NavLinks({ role = 'USER', onNavigate, mobile = false }) {
  const navigate = useNavigate();
  const { pathname } = useLocation();
  const cartCount = useSelector((s) => s.user?.cartCount || 0);

  const items = getNavItems(role);

  const isActive = (path) => {
    if (path === '/') return pathname === '/';
    return pathname === path || pathname.startsWith(path + '/') || pathname.startsWith(path + '?') || pathname === path;
  };

  return (
    <div className={`navbar__links ${mobile ? 'navbar__links--mobile' : ''}`}>
      {items.map((it) => (
        <button
          key={it.key}
          className={`navbar__link ${isActive(it.path) ? 'navbar__link--active' : ''}`}
          onClick={() => {
            navigate(it.path);
            if (typeof onNavigate === 'function') onNavigate();
          }}
        >
          <span>{it.label}</span>
          {it.key === 'cart' && cartCount > 0 && (
            <span className="navbar__badge">{cartCount > 99 ? '99+' : cartCount}</span>
          )}
        </button>
      ))}
    </div>
  );
}

export default React.memo(NavLinks);
