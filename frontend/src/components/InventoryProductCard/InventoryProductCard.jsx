import "./InventoryProductCard.css";

function InventoryProductCard({ product, onAddToCart }) {
  const isOutOfStock = product.quantity <= 0;
  const category = product.category || "Product";
  const description =
    product.description ||
    (isOutOfStock
      ? "Currently unavailable in inventory"
      : `Available now with ${product.quantity} item${product.quantity === 1 ? "" : "s"} in stock`);

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
          <img
            className="inventory-product-card__image"
            src={product.imageUrl}
            alt={product.name}
          />
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
          <button
            type="button"
            className="inventory-product-card__cart"
            onClick={() => onAddToCart(product)}
            disabled={isOutOfStock}
          >
            {isOutOfStock ? "Out of Stock" : "Add to Cart"}
          </button>
        </div>
      </div>
    </article>
  );
}

export default InventoryProductCard;
