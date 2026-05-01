import React, { memo, useCallback, useEffect, useMemo, useRef, useState } from "react";
import Navbar from "../../components/Navbar/Navbar";
import ConfirmModal from "../../components/ConfirmModal/ConfirmModal";
import InventoryProductCard from "./components/InventoryProductCard";
import { useSelector, useDispatch } from "react-redux";
import { fetchProducts } from "../../redux/productSlice";
import { useRecentlyViewed, useWishlist } from "../../hooks";

// New imports from refactored structure
import { useInventory } from "./hooks/useInventory";
import InventoryFilters from "./components/InventoryFilters";
import InventoryForm from "./components/InventoryForm";
import InventoryTable from "./components/InventoryTable";
import InventorySummary from "./components/InventorySummary";
import { ProductCardSkeleton } from "./utils/inventoryUtils";

import "./Inventory.css";

// Main Component
function Inventory() {
  const PAGE_SIZE = 12;

  // Filter state
  const [search, setSearch] = useState("");
  const [debouncedSearch, setDebouncedSearch] = useState("");
  const [minPrice, setMinPrice] = useState("");
  const [maxPrice, setMaxPrice] = useState("");
  const [sortBy, setSortBy] = useState("DEFAULT");
  const [inStockOnly, setInStockOnly] = useState(false);

  // UI state
  const [confirm, setConfirm] = useState(null);
  const [visibleCount, setVisibleCount] = useState(PAGE_SIZE);
  const [previewProduct, setPreviewProduct] = useState(null);
  const [quickViewProduct, setQuickViewProduct] = useState(null);
  const loadMoreRef = useRef(null);

  // Hooks
  const { isWishlisted, toggleWishlist, wishlistCount } = useWishlist();
  const { trackRecentlyViewed } = useRecentlyViewed();

  // Redux
  const dispatch = useDispatch();
  const refreshProducts = useCallback(() => {
    dispatch(fetchProducts());
  }, [dispatch]);

  const { products, loading } = useSelector((state) => state.products);
  const { role, userId: uid } = useSelector((state) => state.user);
  const resolvedUid = uid || localStorage.getItem("userId") || "";

  // Use the inventory hook for all business logic
  const inventoryHook = useInventory(refreshProducts, resolvedUid);
  const { name, setName, price, setPrice, quantity, setQuantity, editId, image, setImage, submitting, formOpen, setFormOpen, cart, addProduct, deleteProduct, increaseStock, reduceStock, updateProduct, fetchCartQuantities, addToCart, increaseCartQty, decreaseCartQty, cancelEdit, startEdit, onImageChange, getProductKey } = inventoryHook;
 
  // Preview and quick view handlers
  const openPreview = useCallback((p) => {
    if (!p?.imageUrl) return;
    trackRecentlyViewed(p);
    setPreviewProduct(p);
  }, [trackRecentlyViewed]);

  const closePreview = useCallback(() => {
    setPreviewProduct(null);
  }, []);

  const openQuickView = useCallback((product) => {
    setQuickViewProduct(product);
  }, []);

  const closeQuickView = useCallback(() => {
    setQuickViewProduct(null);
  }, []);

  const addFromQuickView = useCallback(() => {
    if (!quickViewProduct) return;
    const sourceEl = document.querySelector(".inv-quick-view__image");
    addToCart(quickViewProduct, sourceEl);
  }, [addToCart, quickViewProduct]);

  // Load products and cart data
  useEffect(() => {
    refreshProducts();
  }, [refreshProducts]);

  useEffect(() => {
    fetchCartQuantities();
  }, [fetchCartQuantities]);

  // Handle Escape key for closing preview
  useEffect(() => {
    const onKeyDown = (e) => {
      if (e.key === "Escape") {
        closePreview();
      }
    };

    window.addEventListener("keydown", onKeyDown);
    return () => window.removeEventListener("keydown", onKeyDown);
  }, [closePreview]);

  // Debounce search input
  useEffect(() => {
    const timer = setTimeout(() => {
      setDebouncedSearch(search);
    }, 500);

    return () => clearTimeout(timer);
  }, [search]);


  // Filter and sort products
  const filtered = useMemo(() => {
    if (!Array.isArray(products)) return [];
    
    const text = debouncedSearch.trim().toLowerCase();
    const min = minPrice === "" ? null : Number(minPrice);
    const max = maxPrice === "" ? null : Number(maxPrice);

    let next = [...products];

    if (text.length >= 3) {
      next = next.filter((p) => p.name.toLowerCase().includes(text));
    }

    if (min !== null && !Number.isNaN(min)) {
      next = next.filter((p) => Number(p.price) >= min);
    }

    if (max !== null && !Number.isNaN(max)) {
      next = next.filter((p) => Number(p.price) <= max);
    }

    if (inStockOnly) {
      next = next.filter((p) => Number(p.quantity) > 0);
    }

    if (sortBy === "PRICE_LOW_HIGH") {
      next.sort((a, b) => Number(a.price) - Number(b.price));
    } else if (sortBy === "PRICE_HIGH_LOW") {
      next.sort((a, b) => Number(b.price) - Number(a.price));
    }

    return next;
  }, [products, debouncedSearch, minPrice, maxPrice, inStockOnly, sortBy]);

  const visibleProducts = useMemo(
    () => filtered.slice(0, visibleCount),
    [filtered, visibleCount]
  );

  const hasMoreProducts = useMemo(
    () => visibleCount < filtered.length,
    [visibleCount, filtered.length]
  );

  // Reset visible count when filters change
  useEffect(() => {
    setVisibleCount(PAGE_SIZE);
  }, [debouncedSearch, minPrice, maxPrice, inStockOnly, sortBy, role, products.length]);

  // Infinite scroll effect
  useEffect(() => {
    const node = loadMoreRef.current;
    if (!node || loading || !hasMoreProducts) return;

    const observer = new IntersectionObserver(
      (entries) => {
        if (entries[0]?.isIntersecting) {
          setVisibleCount((prev) => Math.min(prev + PAGE_SIZE, filtered.length));
        }
      },
      {
        root: null,
        rootMargin: "140px 0px",
        threshold: 0.1,
      }
    );

    observer.observe(node);
    return () => observer.disconnect();
  }, [filtered.length, hasMoreProducts, loading]);

  // Open add form
  const openAddForm = useCallback(() => {
    inventoryHook.clearForm();
    setFormOpen(true);
  }, [inventoryHook, setFormOpen]);

  // Filter change handlers
  const onSearchChange = useCallback((e) => {
    setSearch(e.target.value);
  }, []);

  const onMinPriceChange = useCallback((e) => {
    setMinPrice(e.target.value);
  }, []);

  const onMaxPriceChange = useCallback((e) => {
    setMaxPrice(e.target.value);
  }, []);

  const onSortChange = useCallback((e) => {
    setSortBy(e.target.value);
  }, []);

  const onInStockToggle = useCallback((e) => {
    setInStockOnly(e.target.checked);
  }, []);

  //  Render 
  return (
    <div className="inv-wrapper">
      {/* Navbar */}
      <Navbar
        showBackButton={true}
        showCount={true}
        countText={`${products.length} products`}
        showWishlistButton={role !== "ADMIN"}
        wishlistCount={wishlistCount}
      />

      <div className="inv-inner">
        {/* Page Header */}
        <div className="inv-header">
          <div>
            <h1 className="inv-header__title">Inventory</h1>
            <p className="inv-header__subtitle">
              {role === "ADMIN"
                ? "Manage your products, stock and pricing."
                : "Browse available products."}
            </p>
          </div>
          {role === "ADMIN" && !formOpen && (
            <button className="add-btn" onClick={openAddForm}>
              + Add Product
            </button>
          )}
        </div>

        {/* Filters Component */}
        <InventoryFilters
          search={search}
          onSearchChange={onSearchChange}
          minPrice={minPrice}
          onMinPriceChange={onMinPriceChange}
          maxPrice={maxPrice}
          onMaxPriceChange={onMaxPriceChange}
          sortBy={sortBy}
          onSortChange={onSortChange}
          inStockOnly={inStockOnly}
          onInStockToggle={onInStockToggle}
        />

        {/* Product List - Admin Table View */}
        {role === "ADMIN" ? (
          <InventoryTable
            products={products}
            filtered={filtered}
            visibleProducts={visibleProducts}
            loading={loading}
            onIncreaseStock={increaseStock}
            onReduceStock={reduceStock}
            onEditProduct={startEdit}
            onDeleteProduct={(id, name) => setConfirm({ id, name })}
          />
        ) : (
          // User Products Grid View
          <div className="inv-user-products">
            {loading ? (
              Array(8)
                .fill(0)
                .map((_, i) => <ProductCardSkeleton key={i} />)
            ) : filtered.length === 0 ? (
              <div className="inv-user-products__empty">
                <div className="inv-empty">
                  <div className="inv-empty__icon">📭</div>
                  <div className="inv-empty__title">No products found</div>
                  <div className="inv-empty__sub">
                    {search
                      ? `No results for "${search}"`
                      : "Products will appear here soon"}
                  </div>
                </div>
              </div>
            ) : (
              visibleProducts.map((p) => {
                const productKey = getProductKey(p);
                return (
                  <InventoryProductCard
                    key={productKey}
                    product={p}
                    onAddToCart={addToCart}
                    onIncreaseQty={increaseCartQty}
                    onDecreaseQty={decreaseCartQty}
                    onImageClick={openPreview}
                    onProductClick={trackRecentlyViewed}
                    onQuickView={openQuickView}
                    onToggleWishlist={toggleWishlist}
                    isWishlisted={isWishlisted(p)}
                    cartQty={cart[productKey] || 0}
                  />
                );
              })
            )}
          </div>
        )}

        {/* Infinite Scroll Trigger */}
        {!loading && hasMoreProducts && (
          <div
            ref={loadMoreRef}
            className="inv-infinite-sentinel"
            aria-live="polite"
          >
            <span className="inv-infinite-loader" />
            <span>Loading more products...</span>
          </div>
        )}

        {/* Add / Edit Form Component */}
        {role === "ADMIN" && formOpen && (
          <InventoryForm
            editId={editId}
            name={name}
            setName={setName}
            price={price}
            setPrice={setPrice}
            quantity={quantity}
            setQuantity={setQuantity}
            image={image}
            setImage={setImage}
            submitting={submitting}
            onImageChange={onImageChange}
            onAddProduct={addProduct}
            onUpdateProduct={updateProduct}
            onCancel={cancelEdit}
          />
        )}

        {/* Summary Cards Component */}
        <InventorySummary products={products} />
      </div>

      {/* Modals */}
      {confirm && (
        <ConfirmModal
          message={`Are you sure you want to delete "${confirm.name}"? This action cannot be undone.`}
          onConfirm={() => deleteProduct(confirm.id)}
          onCancel={() => setConfirm(null)}
        />
      )}

      {/* Image Preview Modal */}
      {previewProduct?.imageUrl && (
        <div
          className="inventory-image-modal"
          onClick={closePreview}
          role="presentation"
        >
          <div
            className="inventory-image-modal__dialog"
            onClick={(e) => e.stopPropagation()}
            role="dialog"
            aria-modal="true"
            aria-label={`${previewProduct.name} image preview`}
          >
            <button
              type="button"
              className="inventory-image-modal__close"
              onClick={closePreview}
              aria-label="Close image preview"
            >
              ✕
            </button>
            <div className="inventory-image-modal__image-wrap">
              <img
                src={previewProduct.imageUrl}
                alt={previewProduct.name}
                className="inventory-image-modal__img"
              />
            </div>
            <div className="inventory-image-modal__meta">
              <h3 className="inventory-image-modal__title">
                {previewProduct.name}
              </h3>
              <p className="inventory-image-modal__sub">
                Click outside or press Esc to close.
              </p>
            </div>
          </div>
        </div>
      )}

      {/* Quick View Modal */}
      {quickViewProduct && (
        <div
          className="inv-quick-view"
          onClick={closeQuickView}
          role="presentation"
        >
          <div
            className="inv-quick-view__dialog"
            onClick={(e) => e.stopPropagation()}
            role="dialog"
            aria-modal="true"
            aria-label={`${quickViewProduct.name} quick view`}
          >
            <button
              type="button"
              className="inv-quick-view__close"
              onClick={closeQuickView}
              aria-label="Close quick view"
            >
              ✕
            </button>

            <div className="inv-quick-view__content">
              <div className="inv-quick-view__media">
                {quickViewProduct.imageUrl ? (
                  <img
                    src={quickViewProduct.imageUrl}
                    alt={quickViewProduct.name}
                    className="inv-quick-view__image"
                  />
                ) : (
                  <div className="inv-quick-view__placeholder">📦</div>
                )}
              </div>

              <div className="inv-quick-view__info">
                <h3 className="inv-quick-view__title">
                  {quickViewProduct.name}
                </h3>
                <p className="inv-quick-view__price">
                  ₹{Number(quickViewProduct.price || 0).toLocaleString()}
                </p>
                <button
                  type="button"
                  className="inv-quick-view__cart-btn"
                  onClick={addFromQuickView}
                  disabled={Number(quickViewProduct.quantity || 0) <= 0}
                >
                  {Number(quickViewProduct.quantity || 0) <= 0
                    ? "Out of Stock"
                    : "Add to Cart"}
                </button>
              </div>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}

export default memo(Inventory);
