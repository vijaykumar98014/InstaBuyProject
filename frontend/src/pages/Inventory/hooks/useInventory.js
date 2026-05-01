import { useCallback, useState } from "react";
import { inventoryAPI, orderAPI } from "../../../services/api";
import { toast } from "react-toastify";
import { animateFlyToCart } from "../utils/cartAnimation";

/**
 * Custom hook for managing inventory operations
 * Handles form state, cart management, and API calls
 */
export function useInventory(refreshProducts, resolvedUid) {
  // Form State
  const [name, setName] = useState("");
  const [price, setPrice] = useState("");
  const [quantity, setQuantity] = useState("");
  const [editId, setEditId] = useState(null);
  const [image, setImage] = useState(null);
  const [submitting, setSubmitting] = useState(false);
  const [formOpen, setFormOpen] = useState(false);

  // Cart State
  const [cart, setCart] = useState({});

  // Helper to get product key
  const getProductKey = useCallback((p) => String(p.id ?? p._id ?? p.productId ?? ""), []);

  /**
   * Fetch cart quantities for the current user
   */
  const fetchCartQuantities = useCallback(async () => {
    if (!resolvedUid) {
      setCart({});
      return;
    }

    try {
      const res = await orderAPI.get(`/api/orders/cart/${resolvedUid}`);
      const nextCart = {};

      (res.data || []).forEach((item) => {
        const key = String(item.productId ?? item.id ?? item._id ?? "");
        if (key && key !== "") {
          nextCart[key] = Number(item.quantity || 0);
        }
      });

      setCart(nextCart);
    } catch {
      setCart({});
    }
  }, [resolvedUid]);

  /**
   * Add a new product to inventory (admin)
   */
  const addProduct = useCallback(async () => {
    if (!name || price <= 0 || quantity <= 0) {
      toast.error("Enter Valid inputs");
      return;
    }

    setSubmitting(true);
    try {
      const formData = new FormData();
      formData.append("name", name);
      formData.append("price", price);
      formData.append("quantity", quantity);
      formData.append("image", image);

      await inventoryAPI.post("/api/inventory/admin/add", formData, {
        headers: {
          "Content-Type": "multipart/form-data",
        },
      });
      toast.success(`"${name}" added to inventory`);
      setEditId(null);
      setName("");
      setPrice("");
      setQuantity("");
      setImage(null);
      refreshProducts();
      setFormOpen(false);
    } catch {
      toast.error("Product size greater than 10MB");
    } finally {
      setSubmitting(false);
    }
  }, [image, name, price, quantity, refreshProducts]);

  /**
   * Delete a product from inventory (admin)
   */
  const deleteProduct = useCallback(
    async (id) => {
      try {
        await inventoryAPI.delete(`/api/inventory/admin/delete?productId=${id}`);
        toast.info("Product removed from inventory");
        refreshProducts();
      } catch {
        toast.error("Failed to delete product");
      }
    },
    [refreshProducts]
  );

  /**
   * Increase stock for a product (admin)
   */
  const increaseStock = useCallback(
    async (id, pName) => {
      try {
        await inventoryAPI.post(
          `/api/inventory/admin/increase?productId=${id}&quantity=1`
        );
        toast.info(`Stock increased for "${pName}"`);
        refreshProducts();
      } catch {
        toast.error("Failed to increase stock");
      }
    },
    [refreshProducts]
  );

  /**
   * Reduce stock for a product (admin)
   */
  const reduceStock = useCallback(
    async (id, pName) => {
      try {
        await inventoryAPI.post(`/api/inventory/reduce?productId=${id}&quantity=1`);
        toast.info(`Stock reduced for "${pName}"`);
        refreshProducts();
      } catch {
        toast.error("Failed to reduce stock");
      }
    },
    [refreshProducts]
  );

  /**
   * Update an existing product (admin)
   */
  const updateProduct = useCallback(async () => {
    if (!name || !price || !quantity) {
      toast.error("All fields are required");
      return;
    }
    setSubmitting(true);
    try {
      await inventoryAPI.post(`/api/inventory/admin/update?id=${editId}`, {
        name,
        price,
        quantity,
      });
      toast.success(`"${name}" updated successfully`);
      setEditId(null);
      setName("");
      setPrice("");
      setQuantity("");
      setImage(null);
      refreshProducts();
      setFormOpen(false);
    } catch {
      toast.error("Failed to update product");
    } finally {
      setSubmitting(false);
    }
  }, [editId, name, price, quantity, refreshProducts]);

  /**
   * Sync cart quantity with backend
   */
  const syncCartQuantity = useCallback(
    async (p, nextQty, currentQty = 0) => {
      const productId = getProductKey(p);

      if (!resolvedUid) {
        toast.error("User not loaded yet");
        return;
      }

      if (!productId) {
        toast.error("Invalid product data");
        return;
      }

      try {
        if (nextQty <= 0) {
          if (currentQty > 0) {
            await orderAPI.get(
              `/api/orders/cart/remove/${resolvedUid}/${productId}`
            );
          }
          setCart((prev) => {
            const next = { ...prev };
            delete next[productId];
            return next;
          });
          toast.info(`"${p.name}" removed from cart`);
          return;
        }

        if (currentQty > 0) {
          await orderAPI.get(
            `/api/orders/cart/remove/${resolvedUid}/${productId}`
          );
        }
        await orderAPI.post(`/api/orders/cart/add/${resolvedUid}`, {
          productId,
          quantity: nextQty,
          price: p.price,
          imageUrl: p.imageUrl,
          productName: p.name,
        });

        setCart((prev) => ({
          ...prev,
          [productId]: nextQty,
        }));

        toast.success(
          nextQty === 1
            ? `"${p.name}" added to cart 🛒`
            : `"${p.name}" quantity updated`
        );
      } catch (err) {
        console.error(err);
        toast.error("Failed to update cart");
        fetchCartQuantities();
      }
    },
    [fetchCartQuantities, getProductKey, resolvedUid]
  );

  /**
   * Add product to cart with animation
   */
  const addToCart = useCallback(
    (p, sourceEl) => {
      animateFlyToCart(sourceEl);
      const productId = getProductKey(p);
      const currentQty = cart[productId] || 0;
      syncCartQuantity(p, 1, currentQty);
    },
    [cart, getProductKey, syncCartQuantity]
  );

  /**
   * Increase cart quantity by 1
   */
  const increaseCartQty = useCallback(
    (p) => {
      const productId = getProductKey(p);
      const currentQty = cart[productId] || 0;
      syncCartQuantity(p, currentQty + 1, currentQty);
    },
    [cart, getProductKey, syncCartQuantity]
  );

  /**
   * Decrease cart quantity by 1
   */
  const decreaseCartQty = useCallback(
    (p) => {
      const productId = getProductKey(p);
      const currentQty = cart[productId] || 0;
      syncCartQuantity(p, currentQty - 1, currentQty);
    },
    [cart, getProductKey, syncCartQuantity]
  );

  /**
   * Clear form fields
   */
  const clearForm = useCallback(() => {
    setEditId(null);
    setName("");
    setPrice("");
    setQuantity("");
    setImage(null);
  }, []);

  /**
   * Cancel form editing
   */
  const cancelEdit = useCallback(() => {
    clearForm();
    setFormOpen(false);
  }, [clearForm]);

  /**
   * Start editing a product
   */
  const startEdit = useCallback((p) => {
    setEditId(p.id ?? p._id ?? p.productId);
    setName(p.name);
    setPrice(p.price);
    setQuantity(p.quantity);
    setFormOpen(true);
    window.scrollTo({ top: document.body.scrollHeight, behavior: "smooth" });
  }, []);

  /**
   * Handle image file selection
   */
  const onImageChange = useCallback((e) => {
    const file = e.target.files[0];

    if (!file) return;

    const maxSize = 10 * 1024 * 1024;
    if (file.size > maxSize) {
      toast.error("File size must be less than 10MB");
      return;
    }
    if (!file.type.startsWith("image/")) {
      toast.error("Only image files are allowed");
      return;
    }

    setImage(file);
  }, []);

  return {
    // Form State
    name,
    setName,
    price,
    setPrice,
    quantity,
    setQuantity,
    editId,
    setEditId,
    image,
    setImage,
    submitting,
    formOpen,
    setFormOpen,

    // Cart State
    cart,
    setCart,

    // Methods
    addProduct,
    deleteProduct,
    increaseStock,
    reduceStock,
    updateProduct,
    fetchCartQuantities,
    syncCartQuantity,
    addToCart,
    increaseCartQty,
    decreaseCartQty,
    clearForm,
    cancelEdit,
    startEdit,
    onImageChange,
    getProductKey,
  };
}
