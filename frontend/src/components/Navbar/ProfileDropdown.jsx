import React, { useCallback, useEffect, useRef, useState } from 'react';
import { useDispatch, useSelector } from 'react-redux';
import { useLocation, useNavigate } from 'react-router-dom';
import { toast } from 'react-toastify';
import { clearUser } from '../../redux/userSlice';
import { clearProducts } from '../../redux/productSlice';

function ProfileDropdown() {
  const dispatch = useDispatch();
  const navigate = useNavigate();
  const { pathname } = useLocation();
  const { userId, userName, wallet, wishlistCount } = useSelector((s) => s.user || {});
  const [open, setOpen] = useState(false);
  const ref = useRef(null);

  const isLoggedIn = Boolean(userId || (localStorage.getItem('token')));

  const handleLogout = useCallback(() => {
    dispatch(clearUser());
    dispatch(clearProducts());
    toast.success('Logged out successfully');
    navigate('/login');
    setOpen(false);
  }, [dispatch, navigate]);

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

  const avatarText = userName ? userName.charAt(0).toUpperCase(): '👤';
  const safeWishlistCount = Number(wishlistCount || 0);

  return (
    <div className="navbar__profile" ref={ref}>
      <button className="navbar__profile-btn" onClick={() => setOpen((p) => !p)} aria-label="Profile">
        {avatarText}
      </button>

      <div className={`navbar__profile-dropdown ${open ? 'navbar__profile-dropdown--open' : ''}`} aria-hidden={!open}>
          {isLoggedIn ? (
            <div className="navbar__profile-list">
              <button onClick={() => { navigate('/profile'); setOpen(false); }}>My Profile</button>
              <div className="navbar__profile-item">Wallet: ₹{Number(wallet || 0)}</div>
              <button onClick={() => { navigate('/wishlist'); setOpen(false); }}>
                Wishlist {safeWishlistCount > 0 ? `(${safeWishlistCount})` : ''}
              </button>
              <button onClick={() => { navigate('/profile'); setOpen(false); }}>Settings</button>
              <button className="navbar__logout-link" onClick={handleLogout}>Logout</button>
            </div>
          ) : (
            <div className="navbar__profile-list">
              <button onClick={() => { navigate('/login'); setOpen(false); }}>Login</button>
              <button onClick={() => { navigate('/signup'); setOpen(false); }}>Register</button>
            </div>
          )}
      </div>
    </div>
  );
}

export default React.memo(ProfileDropdown);
