import React from "react";
import NavLinks from "./NavLinks";

function MobileMenu({ role = "USER", isOpen, onNavigate }) {
  return (
    <div className={`navbar__mobile-panel ${isOpen ? "navbar__mobile-panel--open" : ""}`}>
      <NavLinks role={role} onNavigate={onNavigate} mobile />
    </div>
  );
}

export default React.memo(MobileMenu);
