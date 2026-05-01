import { useCallback, useEffect, useMemo, useState } from "react";

const RECENTLY_VIEWED_STORAGE_KEY = "instabuy:recently-viewed";
const RECENTLY_VIEWED_LIMIT = 5;

function getProductKey(product) {
  return String(product?.id ?? product?._id ?? product?.productId ?? "");
}

function parseStoredRecentlyViewed() {
  try {
    const raw = localStorage.getItem(RECENTLY_VIEWED_STORAGE_KEY);
    if (!raw) return [];

    const parsed = JSON.parse(raw);
    if (!Array.isArray(parsed)) return [];

    return parsed.filter((item) => item && typeof item === "object");
  } catch {
    return [];
  }
}

export function useRecentlyViewed() {
  const [recentlyViewed, setRecentlyViewed] = useState(() => parseStoredRecentlyViewed());

  useEffect(() => {
    localStorage.setItem(RECENTLY_VIEWED_STORAGE_KEY, JSON.stringify(recentlyViewed));
  }, [recentlyViewed]);

  const trackRecentlyViewed = useCallback((product) => {
    const key = getProductKey(product);
    if (!key) return;

    setRecentlyViewed((prev) => {
      const filtered = prev.filter((item) => getProductKey(item) !== key);

      return [
        {
          ...product,
          viewedAt: Date.now(),
        },
        ...filtered,
      ].slice(0, RECENTLY_VIEWED_LIMIT);
    });
  }, []);

  const clearRecentlyViewed = useCallback(() => {
    setRecentlyViewed([]);
  }, []);

  const recentlyViewedItems = useMemo(
    () => [...recentlyViewed].sort((a, b) => (b.viewedAt || 0) - (a.viewedAt || 0)).slice(0, RECENTLY_VIEWED_LIMIT),
    [recentlyViewed]
  );

  return {
    recentlyViewedItems,
    trackRecentlyViewed,
    clearRecentlyViewed,
    recentlyViewedCount: recentlyViewedItems.length,
  };
}

export { RECENTLY_VIEWED_STORAGE_KEY, RECENTLY_VIEWED_LIMIT };
