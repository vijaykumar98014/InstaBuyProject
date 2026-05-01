import { useCallback, useEffect, useMemo, useState } from "react";

const WISHLIST_STORAGE_KEY = "instabuy:wishlist";

function getProductKey(product) {
  return String(product?.id ?? product?._id ?? product?.productId ?? "");
}

function parseStoredWishlist() {
  try {
    const raw = localStorage.getItem(WISHLIST_STORAGE_KEY);
    if (!raw) return {};

    const parsed = JSON.parse(raw);
    if (!parsed || typeof parsed !== "object" || Array.isArray(parsed)) {
      return {};
    }

    return parsed;
  } catch {
    return {};
  }
}

export function useWishlist() {
  const [wishlistMap, setWishlistMap] = useState(() => parseStoredWishlist());

  useEffect(() => {
    localStorage.setItem(WISHLIST_STORAGE_KEY, JSON.stringify(wishlistMap));
  }, [wishlistMap]);

  const toggleWishlist = useCallback((product) => {
    const key = getProductKey(product);
    if (!key) return;

    setWishlistMap((prev) => {
      if (prev[key]) {
        const next = { ...prev };
        delete next[key];
        return next;
      }

      return {
        ...prev,
        [key]: {
          ...product,
          wishlistSavedAt: Date.now(),
        },
      };
    });
  }, []);

  const removeFromWishlist = useCallback((productId) => {
    const key = String(productId ?? "");
    if (!key) return;

    setWishlistMap((prev) => {
      if (!prev[key]) return prev;
      const next = { ...prev };
      delete next[key];
      return next;
    });
  }, []);

  const isWishlisted = useCallback(
    (product) => {
      const key = getProductKey(product);
      return Boolean(key && wishlistMap[key]);
    },
    [wishlistMap]
  );

  const wishlistItems = useMemo(
    () => Object.values(wishlistMap).sort((a, b) => (b.wishlistSavedAt || 0) - (a.wishlistSavedAt || 0)),
    [wishlistMap]
  );

  return {
    wishlistMap,
    wishlistItems,
    isWishlisted,
    toggleWishlist,
    removeFromWishlist,
    wishlistCount: wishlistItems.length,
  };
}

export { WISHLIST_STORAGE_KEY, getProductKey };
