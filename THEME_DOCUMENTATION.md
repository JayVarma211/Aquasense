# 🌊 AquaSense Theme System Documentation

## Overview

**AquaSense** is a production-ready, premium web application theme built with **Aqua Glass Nature** aesthetics. It combines glassmorphism, smooth animations, and responsive design with comprehensive light/dark mode support.

---

## 📁 File Structure

```
src/
├── theme.css           # 🎨 Global theme variables & utilities
├── Login.css          # 🔐 Authentication pages styling
└── Dashboard.css      # 📊 Dashboard & sensor cards styling
```

### Main Files

1. **theme.css** - Core theme system (import this first in your main.css)
2. **Login.css** - Login & Register page styling (imports theme.css)
3. **Dashboard.css** - Dashboard page styling (imports theme.css)

---

## 🎨 Color Palette

### Dark Mode (Default)

| Variable | Color | Usage |
|----------|-------|-------|
| `--accent-aqua` | `#00d9ff` | Primary accent |
| `--accent-cyan` | `#2eeaff` | Secondary accent |
| `--accent-teal` | `#00bfa6` | Tertiary accent |
| `--accent-green` | `#1dd1a1` | Success state |
| `--text-primary` | `#e6f7ff` | Main text |
| `--text-secondary` | `#b3d9ff` | Secondary text |
| `--bg-primary` | `#0a1628` | Main background |

### Light Mode

| Variable | Color | Usage |
|----------|-------|-------|
| `--accent-aqua` | `#0099cc` | Primary accent |
| `--text-primary` | `#00476d` | Main text |
| `--bg-primary` | `#f0f8fc` | Main background |

---

## 🌙 Using Light/Dark Mode

The theme automatically supports both modes via CSS variables defined in `theme.css`.

### Toggle Theme via JavaScript

```javascript
// Toggle theme
document.documentElement.classList.toggle('theme-light');

// Set to light mode
document.documentElement.classList.add('theme-light');

// Set to dark mode
document.documentElement.classList.remove('theme-light');
```

### In React Component

```jsx
const [isDark, setIsDark] = useState(true);

const toggleTheme = () => {
  setIsDark(!isDark);
  document.documentElement.classList.toggle('theme-light');
};

return (
  <button onClick={toggleTheme}>
    {isDark ? '☀️ Light' : '🌙 Dark'}
  </button>
);
```

---

## ✨ Animation Library

### Built-in Animations

| Animation | Duration | Usage |
|-----------|----------|-------|
| `fadeInDown` | 0.6s | Header & cards entry |
| `fadeInUp` | 0.8s | Content entry |
| `floatSmooth` | 4s | Card floating effect |
| `glowPulse` | 2s | Accent glow pulsing |
| `ripple` | 0.6s | Button click effect |
| `leafFloat` | 15s | Floating particles |
| `shimmer` | 4s | Background shimmer |

### Using Animations

```css
/* Apply animation to element */
.element {
  animation: floatSmooth 4s ease-in-out infinite;
}

/* Or with animation name only */
.element {
  animation-name: fadeInUp;
  animation-duration: 0.8s;
}
```

---

## 🔘 Button Styles

### Primary Button

```jsx
<button className="btn-primary">Login</button>
```

**CSS:**
```css
.btn-primary {
  background: linear-gradient(135deg, var(--accent-teal), var(--accent-aqua));
  color: white;
  box-shadow: var(--glow-aqua);
}
```

### Secondary Button

```jsx
<button className="btn-secondary">Sign Up</button>
```

### Icon Button

```jsx
<button className="btn-icon">🔔</button>
```

---

## 📝 Input Fields

All inputs inherit theme variables automatically:

```jsx
<input 
  type="email" 
  placeholder="Enter email"
  className="auth-input"
/>
```

**Features:**
- Auto theme-aware colors
- Aqua glow on focus
- Smooth transitions
- Touch-friendly (16px font on mobile to prevent zoom)

---

## 💾 CSS Variables Reference

### Spacing & Transitions

```css
--transition-smooth: 0.4s cubic-bezier(0.34, 1.56, 0.64, 1);
--transition-fast: 0.3s ease;
--transition-slow: 0.6s ease-in-out;
```

### Shadows

```css
--shadow-soft: 0 8px 24px rgba(0, 0, 0, 0.2);
--shadow-medium: 0 12px 40px rgba(0, 0, 0, 0.3);
--shadow-strong: 0 20px 60px rgba(0, 0, 0, 0.4);
```

### Glows

```css
--glow-aqua: 0 0 20px rgba(0, 217, 255, 0.5);
--glow-cyan: 0 0 25px rgba(46, 234, 255, 0.6);
--glow-teal: 0 0 20px rgba(0, 191, 166, 0.4);
```

### Glass Effect

```css
--glass-light: rgba(255, 255, 255, 0.08);
--glass-medium: rgba(255, 255, 255, 0.12);
--glass-strong: rgba(255, 255, 255, 0.15);
```

---

## 🎯 Login Page Features

### Key Components

1. **Animated Background**
   - Floating leaf particles
   - Shimmer effect
   - Theme-aware gradients

2. **Glass Card**
   - Floating animation
   - Hover effects
   - Responsive sizing

3. **Form Elements**
   - Password toggle button
   - Animated labels
   - Error/success messages
   - Google login button

4. **Links & CTAs**
   - Animated underlines
   - Hover glow effects
   - Smooth state transitions

### Mobile Responsive

- Cards stack vertically
- Touch-friendly input (16px font)
- Optimized spacing for small screens
- Hidden decorative elements on mobile

---

## 📊 Dashboard Features

### Sensor Cards

Each card displays:
- **Icon** with animation
- **Label** (uppercase)
- **Value** with glow
- **Progress bar** with gradient
- **Status indicator**

### Dynamic Effects

```javascript
// Temperature-based background
if (temperature > 35) {
  container.classList.add('humidity-high'); // Red/Orange glow
}

// Humidity-based effect
if (humidity > 80) {
  container.classList.add('card-wet'); // Cyan pulsing
}
```

### Responsive Grid

| Screen | Layout |
|--------|--------|
| Desktop (>1200px) | 4 columns |
| Tablet (900-1200px) | 2-3 columns |
| Mobile (<900px) | 1 column |
| Small Mobile (<600px) | Full width |

---

## 🚀 Implementation Guide

### Step 1: Import Theme

```html
<!-- In your main HTML or React index -->
<link rel="stylesheet" href="./theme.css">
<link rel="stylesheet" href="./Login.css">
<link rel="stylesheet" href="./Dashboard.css">
```

### Step 2: Add Theme Toggle (Optional)

```jsx
import { useState } from 'react';

function ThemeToggle() {
  const [isDark, setIsDark] = useState(true);

  const toggle = () => {
    setIsDark(!isDark);
    document.documentElement.classList.toggle('theme-light');
    localStorage.setItem('theme', isDark ? 'light' : 'dark');
  };

  return (
    <div className="theme-switch-wrapper">
      <button 
        className={`theme-switch ${!isDark ? 'light' : ''}`}
        onClick={toggle}
      />
    </div>
  );
}
```

### Step 3: Persist Theme Preference

```jsx
// On app load
useEffect(() => {
  const savedTheme = localStorage.getItem('theme');
  if (savedTheme === 'light') {
    document.documentElement.classList.add('theme-light');
  }
}, []);
```

---

## 🔧 Customization

### Change Primary Color

Edit `theme.css`:

```css
:root {
  --accent-aqua: #00d9ff;    /* Change this */
  --accent-cyan: #2eeaff;
  --accent-teal: #00bfa6;
}
```

### Adjust Animation Speed

```css
:root {
  --transition-smooth: 0.4s cubic-bezier(...);  /* Modify duration */
}
```

### Customize Glow Intensity

```css
--glow-aqua: 0 0 20px rgba(0, 217, 255, 0.8);  /* Increase 0.5 to 0.8 */
```

---

## 📱 Mobile Optimization

### Breakpoints

- **Desktop:** 1200px and above
- **Tablet:** 900px - 1199px
- **Mobile:** 600px - 899px
- **Small Mobile:** Below 600px

### Mobile-First Approach

All CSS uses `max-width` media queries for progressive enhancement.

### Touch Optimization

- Input font size: 16px (prevents iOS zoom)
- Button padding: 12-14px (finger-friendly)
- Hover effects converted to active states on mobile

---

## 🎬 Advanced Usage

### Create Custom Card Variant

```css
.sensor-card.card-custom {
  border-color: rgba(255, 100, 150, 0.7);
  background: rgba(255, 100, 150, 0.08);
  box-shadow: var(--shadow-medium), 0 0 30px rgba(255, 100, 150, 0.4);
  animation: customPulse 2s ease-in-out infinite;
}

@keyframes customPulse {
  0%, 100% { transform: scale(1); }
  50% { transform: scale(1.05); }
}
```

### Combine Multiple Animations

```css
.element {
  animation: 
    fadeInUp 0.8s ease,
    floatSmooth 4s ease-in-out 0.8s infinite;
}
```

---

## ✅ Browser Support

| Browser | Support | Notes |
|---------|---------|-------|
| Chrome | ✅ Full | All features supported |
| Firefox | ✅ Full | All features supported |
| Safari | ✅ Full | All features supported |
| Edge | ✅ Full | All features supported |
| IE 11 | ⚠️ Partial | CSS variables may not work |

---

## 📚 Resources

- [CSS Variables (Custom Properties)](https://developer.mozilla.org/en-US/docs/Web/CSS/--*)
- [Glassmorphism](https://glassmorphism.com/)
- [CSS Animations](https://developer.mozilla.org/en-US/docs/Web/CSS/CSS_Animations)
- [Backdrop Filter](https://developer.mozilla.org/en-US/docs/Web/CSS/backdrop-filter)

---

## 🎨 Color Reference

### Aqua Palette

```
Primary:    #00d9ff (Cyan/Aqua)
Secondary:  #2eeaff (Bright Cyan)
Tertiary:   #00bfa6 (Teal)
Accent:     #1dd1a1 (Green)
```

### Neutral Palette (Dark Mode)

```
Text Primary:   #e6f7ff
Text Secondary: #b3d9ff
Text Tertiary:  #7aa3d1
Background:     #0a1628
```

---

## 📞 Support

For issues or customization needs, refer to the inline comments in each CSS file.

**Happy theming! 🌊✨**
