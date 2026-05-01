# Quick Responsive Design Reference Guide

## 🎯 Quick Breakpoints

```
Small Mobile:  320px - 479px
Mobile:        480px - 767px
Tablet:        768px - 1023px
Desktop:       1024px - 1199px
Large Desktop: 1200px+
```

## 📝 Common Media Query Patterns

### Basic Mobile-First Pattern
```css
/* Base: Mobile styles */
.element {
  width: 100%;
  font-size: 14px;
  padding: 12px;
}

/* Tablet and up */
@media (min-width: 768px) {
  .element {
    width: 50%;
    font-size: 16px;
    padding: 16px;
  }
}

/* Desktop and up */
@media (min-width: 1024px) {
  .element {
    width: 33.33%;
    font-size: 18px;
  }
}
```

### Grid Layout Pattern
```css
/* Mobile: 1 column */
.grid {
  display: grid;
  grid-template-columns: 1fr;
  gap: 12px;
}

/* Tablet: 2 columns */
@media (min-width: 768px) {
  .grid {
    grid-template-columns: repeat(2, 1fr);
    gap: 16px;
  }
}

/* Desktop: 3 columns */
@media (min-width: 1024px) {
  .grid {
    grid-template-columns: repeat(3, 1fr);
  }
}
```

### Flexible Typography
```css
/* Responsive heading that scales with viewport */
h1 {
  font-size: clamp(1.5rem, 4vw, 3rem);
}

/* Readable body text at all sizes */
p {
  font-size: clamp(0.875rem, 1.5vw, 1rem);
  line-height: 1.6;
}
```

### Stacked Layout Pattern
```css
/* Desktop: side by side */
.sidebar-layout {
  display: grid;
  grid-template-columns: 300px 1fr;
  gap: 20px;
}

/* Mobile: stacked */
@media (max-width: 768px) {
  .sidebar-layout {
    grid-template-columns: 1fr;
  }
}
```

## 🛠️ Utility Classes

### Display Control
```html
<!-- Hide on mobile, show on desktop -->
<div class="hide-on-mobile show-on-desktop">
  Desktop content
</div>

<!-- Show on mobile, hide on desktop -->
<div class="show-on-mobile hide-on-desktop">
  Mobile content
</div>
```

### Responsive Spacing
```html
<!-- Padding adapts to screen size -->
<div class="p-responsive-lg">Large responsive padding</div>
<div class="p-responsive-md">Medium responsive padding</div>
<div class="p-responsive-sm">Small responsive padding</div>
```

### Flexible Layouts
```html
<!-- Stack on mobile, flex on desktop -->
<div class="flex-col-mobile">
  <div>Item 1</div>
  <div>Item 2</div>
</div>
```

## 📱 Mobile-Friendly Tips

### 1. Touch Targets
```css
/* Ensure buttons are at least 44x44px for easy tapping */
button {
  min-height: 44px;
  min-width: 44px;
  padding: 0.75rem 1rem;
}
```

### 2. Input Fields
```css
/* Prevent iOS zoom on input focus */
input, textarea, select {
  font-size: 16px; /* Must be 16px or larger */
}
```

### 3. Scrollable Tables
```css
/* Enable smooth scrolling on touch devices */
.table-wrapper {
  overflow-x: auto;
  -webkit-overflow-scrolling: touch;
}
```

### 4. Responsive Images
```css
/* Images scale with container */
img {
  max-width: 100%;
  height: auto;
  display: block;
}
```

## 🎨 Common Responsive Patterns

### Pattern 1: Hero Section
```css
.hero {
  padding: clamp(2rem, 8vw, 4rem) clamp(1rem, 4vw, 2rem);
  text-align: center;
}

.hero h1 {
  font-size: clamp(1.5rem, 5vw, 3rem);
}
```

### Pattern 2: Card Grid
```css
.card-grid {
  display: grid;
  grid-template-columns: repeat(auto-fit, minmax(250px, 1fr));
  gap: clamp(1rem, 2vw, 1.5rem);
}
```

### Pattern 3: Sidebar
```css
.layout {
  display: grid;
  grid-template-columns: 1fr;
  gap: 1.5rem;
}

@media (min-width: 768px) {
  .layout {
    grid-template-columns: 250px 1fr;
  }
}
```

### Pattern 4: Bottom Sheet (Mobile)
```css
.modal {
  position: fixed;
  bottom: 0;
  left: 0;
  right: 0;
  max-height: 80vh;
  border-radius: 20px 20px 0 0;
}

@media (min-width: 768px) {
  .modal {
    top: 50%;
    bottom: auto;
    max-height: none;
    border-radius: 20px;
  }
}
```

## ✅ Testing Responsive Design

### Using Browser DevTools
1. Open Chrome DevTools (F12)
2. Click "Toggle device toolbar" (Ctrl+Shift+M)
3. Select different devices or set custom dimensions

### Quick Device Sizes to Test
- **iPhone SE**: 375x667
- **iPhone 12**: 390x844
- **Pixel 5**: 393x851
- **iPad**: 768x1024
- **iPad Pro**: 1024x1366
- **Desktop**: 1920x1080

## 🐛 Common Issues & Fixes

| Issue | Cause | Fix |
|-------|-------|-----|
| Text too small on mobile | Fixed font size | Use `clamp()` or media queries |
| Buttons hard to tap | Too small | Min 44px height/width |
| Image breaks layout | No max-width | Add `max-width: 100%` |
| Content overflows | Padding/margin issues | Use `box-sizing: border-box` |
| Navigation breaks | Not stacking | Use `flex-col-mobile` or grid |
| Input zooms screen | Font too small | Set to 16px+ |

## 📚 CSS Function Reference

### `clamp(MIN, PREFERRED, MAX)`
```css
font-size: clamp(0.875rem, 2vw, 1.5rem);
/* 
  - Min: 0.875rem (14px)
  - Preferred: 2vw (2% of viewport width)
  - Max: 1.5rem (24px)
*/
```

### `min()` and `max()`
```css
width: min(100%, 1200px); /* 100% but never wider than 1200px */
padding: max(1rem, 2vw);  /* 2vw but never less than 1rem */
```

### `env()`
```css
padding: env(safe-area-inset-bottom); /* For notch devices */
```

## 🚀 Performance Tips

1. **Min CSS**: Use mobile-first to keep base CSS lean
2. **Media Query Order**: Put smaller breakpoints first
3. **CSS Variables**: Use for theme switching
4. **Avoid Duplication**: Group related breakpoints
5. **Test Performance**: Use Chrome Lighthouse

## 📖 Full Documentation

See [RESPONSIVE_DESIGN.md](./RESPONSIVE_DESIGN.md) for comprehensive documentation.
