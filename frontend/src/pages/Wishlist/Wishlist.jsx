import { memo, useCallback, useState } from "react";
import { useNavigate } from "react-router-dom";
import Navbar from "../../components/Navbar/Navbar";
import InventoryProductCard from "../Inventory/components/InventoryProductCard";
import { useWishlist } from "../../hooks";
import "./Wishlist.css";

function Wishlist() {
  const [previewProduct, setPreviewProduct] = useState(null);
  const navigate = useNavigate();

  const { wishlistItems, toggleWishlist, wishlistCount, isWishlisted } = useWishlist();

  const openPreview = useCallback((product) => {
    if (!product?.imageUrl) return;
    setPreviewProduct(product);
  }, []);

  const closePreview = useCallback(() => {
    setPreviewProduct(null);
  }, []);

  const goInventory = useCallback(() => {
    navigate("/inventory");
  }, [navigate]);

  return (
    <div className="wishlist-page">
      <Navbar
        showBackButton={true}
        backText="← Inventory"
        backPath="/inventory"
        showCount={true}
        countText={`${wishlistCount} saved`}
        showWishlistButton={false}
      />

      <div className="wishlist-content">
        <div className="wishlist-header">
          <h1 className="wishlist-title">My Wishlist</h1>
          <p className="wishlist-subtitle">All wishlist products are here.</p>
        </div>

        {wishlistItems.length === 0 ? (
          <div className="wishlist-empty">
            <div className="wishlist-empty__icon">💝</div>
            <h3 className="wishlist-empty__title">Your wishlist is empty</h3>
            <p className="wishlist-empty__text">Tap the heart icon on any product card to save it here.</p>
            <button className="wishlist-empty__btn" onClick={goInventory}>Browse Products</button>
          </div>
        ) : (
          <div className="wishlist-grid">
            {wishlistItems.map((product) => {
              const key = String(product.id ?? product._id ?? product.productId);

              return (
                <InventoryProductCard
                  key={key}
                  product={product}
                  onImageClick={openPreview}
                  onToggleWishlist={toggleWishlist}
                  isWishlisted={isWishlisted(product)}
                  showCartActions={false}
                />
              );
            })}
          </div>
        )}
      </div>

      {previewProduct?.imageUrl && (
        <div className="wishlist-image-modal" onClick={closePreview} role="presentation">
          <div
            className="wishlist-image-modal__dialog"
            onClick={(e) => e.stopPropagation()}
            role="dialog"
            aria-modal="true"
            aria-label={`${previewProduct.name} image preview`}
          >
            <button
              type="button"
              className="wishlist-image-modal__close"
              onClick={closePreview}
              aria-label="Close image preview"
            >
              ✕
            </button>
            <img
              src={previewProduct.imageUrl}
              alt={previewProduct.name}
              className="wishlist-image-modal__img"
            />
          </div>
        </div>
      )}
    </div>
  );
}

export default memo(Wishlist);
