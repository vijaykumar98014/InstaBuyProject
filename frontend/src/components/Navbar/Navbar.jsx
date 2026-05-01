import React, { memo, useCallback, useEffect, useState } from "react";
import { useLocation, useNavigate } from "react-router-dom";
import { useSelector } from "react-redux";
import ThemeToggle from "../ThemeToggle";
import NavLinks from "./NavLinks";
import NotificationBell from "./NotificationBell";
import ProfileDropdown from "./ProfileDropdown";
import MobileMenu from "./MobileMenu";
import "./Navbar.css";

function Navbar() {
  const navigate = useNavigate();
  const { pathname } = useLocation();
  const { role } = useSelector((s) => s.user || {});
  const [isMenuOpen, setIsMenuOpen] = useState(false);

  const goHome = useCallback(() => navigate("/home"), [navigate]);

  useEffect(() => {
    setIsMenuOpen(false);
  }, [pathname]);

  return (
    <nav className="navbar">
      <div className="navbar__left" onClick={goHome} role="button" tabIndex={0} onKeyDown={(e) => e.key === "Enter" && goHome()}>
        <div className="navbar__brand">
          <div className="navbar__logo-icon">🛍</div>
          <span className="navbar__logo-text">
            Insta<span className="navbar__logo-accent">Buy</span>
          </span>
        </div>
      </div>

      <div className="navbar__center">
        <NavLinks role={role || "USER"} />
      </div>

      <div className="navbar__right">
        <button
          className="navbar__menu-btn"
          aria-label="Toggle navigation menu"
          aria-expanded={isMenuOpen}
          onClick={() => setIsMenuOpen((prev) => !prev)}
        >
          ☰
        </button>
        <NotificationBell />
        <ProfileDropdown />
        <ThemeToggle />
      </div>

      <MobileMenu role={role || "USER"} isOpen={isMenuOpen} onNavigate={() => setIsMenuOpen(false)} />
    </nav>
  );
}

export default memo(Navbar);