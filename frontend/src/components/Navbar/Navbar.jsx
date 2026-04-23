import { memo, useCallback } from "react";
import { useNavigate } from "react-router-dom";
import { useDispatch, useSelector } from "react-redux";
import ThemeToggle from "../ThemeToggle";
import { toast } from "react-toastify";
import { clearUser } from "../../redux/userSlice";
import { clearProducts } from "../../redux/productSlice";
import "./Navbar.css";

function Navbar({
  showBackButton = false,
  backText = "← Home",
  backPath = "/home",
  showCount = false,
  countText = "",
  showCartButton = true,
  showOrdersButton = true,
  showInventoryButton = false,
  customButtons = []
}) {
  const navigate = useNavigate();
  const dispatch = useDispatch();
  const { role, userName, wallet } = useSelector((state) => state.user);

  const handleLogout = useCallback(() => {
    dispatch(clearUser());
    dispatch(clearProducts());
    toast.success("Logged out successfully");
    navigate("/login");
  }, [dispatch, navigate]);

  const handleBack = useCallback(() => navigate(backPath), [navigate, backPath]);
  const handleInventory = useCallback(() => navigate("/inventory"), [navigate]);
  const handleCart = useCallback(() => navigate("/cart"), [navigate]);
  const handleOrders = useCallback(() => navigate("/orders"), [navigate]);

  return (
    <nav className="navbar">
      <div className="navbar__left">
        {showBackButton && (
          <button className="navbar__back-btn" onClick={handleBack}>
            {backText}
          </button>
        )}

        <div className="navbar__brand">
          <div className="navbar__logo-icon">🛍</div>
          <span className="navbar__logo-text">
            Insta<span className="navbar__logo-accent">Buy</span>
          </span>
        </div>
      </div>

      <div className="navbar__right">
        {showCount && (
          <span className="navbar__count">{countText}</span>
        )}


        {showInventoryButton && (
          <button
            className="navbar__inventory-btn"
            onClick={handleInventory}
          >
            📦 Inventory
          </button>
        )}

        {showCartButton && role !== "ADMIN" && (
          <button className="navbar__cart-btn" onClick={handleCart}>
            🛒 Cart
          </button>
        )}

        {showOrdersButton && (
          <button className="navbar__orders-btn" onClick={handleOrders}>
            📋 {role === "ADMIN" ? "Orders" : "My Orders"}
          </button>
        )}

        {/* Custom buttons
        {customButtons.map((btn, index) => (
          <button
            key={index}
            className={btn.className}
            onClick={btn.onClick}
          >
            {btn.text}
          </button>
        ))} */}

        
        <span className="navbar__wallet-badge">
          💰 ₹{wallet}
        </span>
        <span className={`navbar__role-badge ${role === "ADMIN" ? "navbar__role-badge--admin" : "navbar__role-badge--user"}`}>
          {role === "ADMIN" ? "🛡" : "👤"} {userName}
        </span>
        <button
          className="navbar__logout-btn"
          onClick={handleLogout}
        >
          Sign Out
        </button>
        <ThemeToggle />
      </div>
    </nav>
  );
}

export default memo(Navbar);