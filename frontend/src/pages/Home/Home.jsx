import React, { memo, useCallback, useMemo } from "react";
import { useNavigate } from "react-router-dom";
import Navbar from "../../components/Navbar/Navbar";
import "./Home.css";
import { useSelector } from "react-redux";
import { useRecentlyViewed } from "../../hooks";


function Home() {
  const navigate = useNavigate();
  const goInventory = useCallback(() => navigate("/inventory"), [navigate]);
  const goCart = useCallback(() => navigate("/cart"), [navigate]);
  const goOrders = useCallback(() => navigate("/orders"), [navigate]);

  const { role } = useSelector((state) => state.user);
  const { recentlyViewedItems } = useRecentlyViewed();

  const cards = useMemo(() => [
    {
      icon: "📦",
      title: "Product Inventory",
      desc: "Browse all available products and check current stock instantly.",
      action: "Open Inventory",
      color: "var(--accent)",
      iconBg: "color-mix(in srgb, var(--accent) 16%, transparent)",
      onClick: goInventory,
    },
    {
      icon: "🛒",
      title: "My Cart",
      desc: "Review selected items, update quantity and place your order quickly.",
      action: "Go to Cart",
      color: "var(--warning)",
      iconBg: "color-mix(in srgb, var(--warning) 16%, transparent)",
      onClick: goCart,
    },
    {
      icon: "📋",
      title: role === "ADMIN" ? "All Orders" : "My Orders",
      desc: role === "ADMIN"
        ? "Track and manage all customer orders from one place."
        : "View your order history and latest delivery status.",
      action: role === "ADMIN" ? "Manage Orders" : "View Orders",
      color: "var(--success)",
      iconBg: "color-mix(in srgb, var(--success) 16%, transparent)",
      onClick: goOrders,
    },
    {
      icon: "🛡",
      title: role === "ADMIN" ? "Admin Controls" : "Browse Store",
      desc: role === "ADMIN"
        ? "Manage products, pricing and stock operations with full control."
        : "Explore products and discover what you want to buy next.",
      action: role === "ADMIN" ? "Open Controls" : "Start Browsing",
      color: "var(--danger)",
      iconBg: "color-mix(in srgb, var(--danger) 16%, transparent)",
      onClick: goInventory,
    },
  ], [goInventory, goCart, goOrders, role]);

  return (
    <div className="home-page">
      <div className="home-glow" />

      {/* Navbar */}
      <Navbar showInventoryButton={true} />

      {/* Hero */}
      <section className="home-hero">
        <div className="home-hero-eyebrow">✦ Your Smart Shopping Platform</div>
        <h1 className="home-hero-title">
          Shop Fast.<br />
          <span className="home-hero-grad">Shop Smart.</span>
        </h1>
        <p className="home-hero-sub">
          Browse products, track stock and manage your store — all in one place.
        </p>
        <div className="home-hero-btns">
          <button
            className="home-primary-btn"
            onClick={goInventory}
          >
            📦 View Products
          </button>
          {role === "ADMIN" && (
            <button
              className="home-primary-btn"
              onClick={goInventory}
            >
              🛡 Admin Panel
            </button>
          )}
        </div>
      </section>

      {/* Stats */}
      <div className="home-stats-row">
        {[
          ["Real-time", "Inventory Updates"],
          ["Role-based", "Access Control"],
          ["REST API", "Spring Boot Backend"],
          ["Secure", "Authentication"],
        ].map(([num, label]) => (
          <div key={label} className="home-stat-item">
            <div className="home-stat-num">{num}</div>
            <div className="home-stat-label">{label}</div>
          </div>
        ))}
      </div>

      {/* Cards */}
      <div className="home-section">
        <h2 className="home-section-title">Quick Actions</h2>
        <div className="home-cards-grid">
          {cards.map((card) => (
            <div key={card.title} className="home-card">
              <div
                className="home-card-icon"
                style={{ background: card.iconBg }}
              >
                {card.icon}
              </div>
              <div className="home-card-title">{card.title}</div>
              <p className="home-card-desc">{card.desc}</p>
              <button
                className="home-card-action"
                style={{ color: card.color }}
                onClick={card.onClick}
              >
                {card.action} →
              </button>
            </div>
          ))}
        </div>
      </div>

      {recentlyViewedItems.length > 0 && (
        <div className="home-section">
          <h2 className="home-section-title">Recently Viewed</h2>
          <div className="home-recent-grid">
            {recentlyViewedItems.slice(0, 5).map((product, index) => {
              const productKey = String(product.id ?? product._id ?? product.productId ?? `recent-${index}`);

              return (
                <article key={productKey} className="home-recent-card">
                  <div className="home-recent-card__media">
                    {product.imageUrl ? (
                      <img
                        src={product.imageUrl}
                        alt={product.name}
                        className="home-recent-card__image"
                      />
                    ) : (
                      <div className="home-recent-card__placeholder">📦</div>
                    )}
                  </div>

                  <div className="home-recent-card__body">
                    <h3 className="home-recent-card__title">{product.name}</h3>
                    <p className="home-recent-card__desc">
                      {product.description || "Recently viewed from your inventory browsing."}
                    </p>
                    <p className="home-recent-card__price">₹{Number(product.price || 0).toLocaleString()}</p>
                    <button className="home-recent-card__btn" onClick={goInventory}>View Product</button>
                  </div>
                </article>
              );
            })}
          </div>
        </div>
      )}

      {/* Footer */}
      <footer className="home-footer">
        <span>© 2026 InstaBuy — Powered by Spring Boot</span>
        <span>Built with ♥ for modern commerce</span>
      </footer>
    </div>
  );
}

export default memo(Home);
