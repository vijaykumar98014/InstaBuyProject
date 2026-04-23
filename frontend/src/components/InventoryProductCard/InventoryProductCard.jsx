import { memo, useCallback, useMemo } from "react";
import "./InventoryProductCard.css";

function InventoryProductCard({
  product,
  onAddToCart,
  onIncreaseQty,
  onDecreaseQty,
  onImageClick,
  cartQty = 0,
}) {
  console.log("Product:", product.name, "cartQty:", cartQty);
  const isOutOfStock = useMemo(() => product.quantity <= 0, [product.quantity]);
  const category = useMemo(() => product.category || "Product", [product.category]);
  const description = useMemo(
    () =>
      product.description ||
      (isOutOfStock
        ? "Currently unavailable in inventory"
        : `Available now with ${product.quantity} item${product.quantity === 1 ? "" : "s"} in stock`),
    [product.description, product.quantity, isOutOfStock]
  );

  const handleAddToCart = useCallback(() => {
    onAddToCart(product);
  }, [onAddToCart, product]);

  const handleIncrease = useCallback(() => {
    onIncreaseQty?.(product);
  }, [onIncreaseQty, product]);

  const handleDecrease = useCallback(() => {
    onDecreaseQty?.(product);
  }, [onDecreaseQty, product]);

  const handleImageClick = useCallback(() => {
    onImageClick?.(product);
  }, [onImageClick, product]);

  return (
    <article className="inventory-product-card">
      <div className="inventory-product-card__media">
        <span className="inventory-product-card__badge">{category}</span>
        <button
          type="button"
          className="inventory-product-card__favorite"
          title="Save product"
          aria-label={`Save ${product.name}`}
        >
          ♡
        </button>

        {product.imageUrl ? (
          <button
            type="button"
            className="inventory-product-card__image-button"
            onClick={handleImageClick}
            aria-label={`Open image for ${product.name}`}
          >
            <img
              className="inventory-product-card__image"
              src={product.imageUrl}
              alt={product.name}
            />
          </button>
        ) : (
          <div className="inventory-product-card__placeholder" aria-hidden="true">
            <span className="inventory-product-card__placeholder-icon">▧</span>
          </div>
        )}
      </div>

      <div className="inventory-product-card__body">
        <h3 className="inventory-product-card__title">{product.name}</h3>
        <p className="inventory-product-card__description">{description}</p>

        <div className="inventory-product-card__footer">
          <span className="inventory-product-card__price">
            ₹{Number(product.price).toLocaleString()}
          </span>
          {cartQty > 0 ? (
            <div className="inventory-product-card__qty-controls">
              <button
                type="button"
                className="inventory-product-card__qty-btn"
                onClick={handleDecrease}
                aria-label={`Decrease quantity of ${product.name}`}
              >
                −
              </button>
              <span className="inventory-product-card__qty-count">{cartQty}</span>
              <button
                type="button"
                className="inventory-product-card__qty-btn"
                onClick={handleIncrease}
                aria-label={`Increase quantity of ${product.name}`}
              >
                +
              </button>
            </div>
          ) : (
            <button
              type="button"
              className="inventory-product-card__cart"
              onClick={handleAddToCart}
              disabled={isOutOfStock}
            >
              {isOutOfStock ? "Out of Stock" : "Add to Cart"}
            </button>
          )}
        </div>
      </div>
    </article>
  );
}

export default memo(InventoryProductCard);
