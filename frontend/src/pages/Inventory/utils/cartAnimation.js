/**
 * Animate product image to cart button
 * Creates a visual "fly to cart" animation effect
 */
export function animateFlyToCart(sourceEl) {
  if (!sourceEl) return;

  const cartBtn = document.querySelector(".navbar__cart-btn");
  if (!cartBtn) return;

  const sourceRect = sourceEl.getBoundingClientRect();
  const targetRect = cartBtn.getBoundingClientRect();

  if (!sourceRect.width || !sourceRect.height) return;

  const flyer = document.createElement("div");
  flyer.className = "inv-fly-cart";

  if (sourceEl.tagName === "IMG") {
    flyer.innerHTML = `<img src="${sourceEl.src}" alt="" />`;
  } else {
    flyer.innerHTML = `<div class="inv-fly-cart__fallback">📦</div>`;
  }

  flyer.style.left = `${sourceRect.left}px`;
  flyer.style.top = `${sourceRect.top}px`;
  flyer.style.width = `${sourceRect.width}px`;
  flyer.style.height = `${sourceRect.height}px`;

  const deltaX = targetRect.left + targetRect.width / 2 - (sourceRect.left + sourceRect.width / 2);
  const deltaY = targetRect.top + targetRect.height / 2 - (sourceRect.top + sourceRect.height / 2);

  document.body.appendChild(flyer);

  requestAnimationFrame(() => {
    flyer.style.transform = `translate(${deltaX}px, ${deltaY}px) scale(0.2)`;
    flyer.style.opacity = "0.25";
  });

  const cleanup = () => flyer.remove();
  flyer.addEventListener("transitionend", cleanup, { once: true });
  setTimeout(cleanup, 750);
}
