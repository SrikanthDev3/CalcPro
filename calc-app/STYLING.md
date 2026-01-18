# CalcPro - Styling & Design System

## Color Palette

### Primary Colors
```
Primary Gradient (Operators):
  - Start: #667eea (Periwinkle Blue)
  - End:   #764ba2 (Deep Purple)
  - Used for: +, -, *, ÷ buttons

Accent Gradient (Equals):
  - Start: #00d4ff (Cyan)
  - End:   #0099ff (Sky Blue)
  - Used for: = button

Warning Accent (Clear):
  - Color:  #ffc107 (Amber)
  - Used for: C button, highlights
```

### Background
```
Dark Gradient:
  - Direction: 135deg
  - Stop 1: #0f0c29 (Very Dark Navy)
  - Stop 2: #302b63 (Dark Purple)
  - Stop 3: #24243e (Dark Blue)
  - Effect: Subtle gradient for premium feel
```

### Text
```
Primary Text: #ffffff (White)
  - Used for: Buttons, display text
  
Secondary Text: rgba(255, 255, 255, 0.3-0.7)
  - Used for: Labels, hints, disabled states

Error Text: #ff6b6b (Red)
  - Used for: Error display
```

### Borders & Shadows
```
Border:
  - Color:  rgba(255, 255, 255, 0.08-0.2)
  - Effect: Subtle separation

Shadows:
  - Soft: 0 4px 15px rgba(0, 0, 0, 0.2)
  - Deep: 0 8px 32px rgba(31, 38, 135, 0.37)
  - Effect: Depth and elevation
```

---

## Typography

### Font Stack
```
-apple-system, BlinkMacSystemFont, 'Segoe UI', Roboto, 
'Helvetica Neue', Arial, sans-serif
```

Why this stack?
- ✅ Uses system fonts (fastest loading)
- ✅ Works across all platforms
- ✅ Optimized readability
- ✅ Professional appearance

### Font Sizes

| Element | Size | Weight | Usage |
|---------|------|--------|-------|
| Display Value | 3rem (48px) | 300 | Main number display |
| Button Labels | 1.25rem (20px) | 500 | Operator/number buttons |
| Voice Label | 0.75rem (12px) | 600 | Small text labels |
| Display (Mobile) | 2rem-2.5rem | 300 | Responsive scaling |
| Button (Mobile) | 1rem (16px) | 500 | Touch-friendly size |

### Font Weights
```
300 (Light):    Display numbers, minimal weight
400 (Normal):   Body text, standard weight
500 (Medium):   Button labels, interactive elements
600 (SemiBold): Labels, emphasis
```

---

## Layout System

### Grid Layout

```
Buttons Grid: 4 Columns
┌───┬───┬───┬───┐
│ C │ ± │ % │ ÷ │  Clear Row
├───┼───┼───┼───┤
│ 7 │ 8 │ 9 │ × │  Numbers
├───┼───┼───┼───┤
│ 4 │ 5 │ 6 │ − │  Numbers
├───┼───┼───┼───┤
│ 1 │ 2 │ 3 │ + │  Numbers
├─────────┼───┼───┤
│    0    │ . │ = │  Special (0 spans 2 cols)
└─────────┴───┴───┘
```

### Spacing System

```
Base Unit: 4px (rem = 16px)

Spacing Scale:
  gap-xs:  2px   (0.125rem)
  gap-sm:  4px   (0.25rem)
  gap-md:  8px   (0.5rem)
  gap-lg: 12px   (0.75rem)
  gap-xl: 16px   (1rem)
  gap-2xl: 24px  (1.5rem)

Current Usage:
  - Button gap: 12px (gap-lg)
  - Card padding: 24px (gap-2xl)
  - Display padding: 20px (custom)
  - Section padding: 20px (custom)
```

### Container Sizing

```
Calculator Card Max-Widths:
  - Desktop (1200px+):  420px
  - Tablet (600px+):    380px
  - Mobile (<400px):    100% - 40px padding
```

---

## Component-Level Design

### Calculator Card

```css
.calculator-card {
  /* Layout */
  width: 100%;
  max-width: 380px;
  padding: 24px;
  border-radius: 28px;
  
  /* Appearance */
  background: linear-gradient(
    180deg,
    rgba(255, 255, 255, 0.08) 0%,
    rgba(255, 255, 255, 0.04) 100%
  );
  border: 1px solid rgba(255, 255, 255, 0.1);
  
  /* Effects */
  box-shadow:
    0 8px 32px 0 rgba(31, 38, 135, 0.37),
    0 0 0 1px rgba(255, 255, 255, 0.06);
  backdrop-filter: blur(4px);
  -webkit-backdrop-filter: blur(4px);
}
```

**Glassmorphism Effect Breakdown:**
1. Semi-transparent background
2. Subtle gradient for depth
3. Thin border for definition
4. Box shadow for elevation
5. Backdrop blur for frosted glass effect
6. WebKit prefix for Safari support

### Display Section

```css
.display-section {
  padding: 20px;
  background: linear-gradient(
    180deg,
    rgba(0, 0, 0, 0.3) 0%,
    rgba(0, 0, 0, 0.1) 100%
  );
  border-radius: 20px;
  border: 1px solid rgba(255, 255, 255, 0.08);
  margin-bottom: 24px;
}

.display {
  font-size: 3rem;
  font-weight: 300;
  letter-spacing: -0.02em;
  text-align: right;
  min-height: 60px;
  display: flex;
  align-items: flex-end;
  justify-content: flex-end;
  transition: all 0.3s cubic-bezier(0.4, 0, 0.2, 1);
}
```

**Key Features:**
- Right-aligned for natural number display
- Dark background for contrast
- Smooth transitions for value changes
- Flex layout for alignment
- Tabular number styling for monospace appearance

### Button Styling

```css
.calc-button {
  /* Size */
  aspect-ratio: 1;  /* Square buttons */
  border-radius: 16px;
  
  /* Typography */
  font-size: 1.25rem;
  font-weight: 500;
  letter-spacing: 0.5px;
  
  /* Appearance */
  background: linear-gradient(
    180deg,
    rgba(255, 255, 255, 0.1) 0%,
    rgba(255, 255, 255, 0.05) 100%
  );
  box-shadow:
    0 4px 15px rgba(0, 0, 0, 0.2),
    inset 0 1px 0 rgba(255, 255, 255, 0.2);
  border: 1px solid rgba(255, 255, 255, 0.1);
  
  /* Interaction */
  transition: all 0.2s cubic-bezier(0.4, 0, 0.2, 1);
  cursor: pointer;
  overflow: hidden;
  position: relative;
}
```

**Button Variants:**

| Type | Gradient | Icon | Purpose |
|------|----------|------|---------|
| Number | Neutral | None | Digits 0-9 |
| Operator | Purple→Blue | Math | +, −, ×, ÷ |
| Decimal | Neutral | None | . |
| Clear | Amber tint | C | Reset calc |
| Equals | Cyan→Blue | = | Calculate |
| Voice | Disabled | 🎤 | Future |

### Button Interactions

```css
/* Hover State */
.calc-button:hover:not(:disabled) {
  background: linear-gradient(
    180deg,
    rgba(255, 255, 255, 0.15) 0%,
    rgba(255, 255, 255, 0.08) 100%
  );
  box-shadow: 0 6px 20px rgba(0, 0, 0, 0.25);
  transform: translateY(-2px);  /* Lift effect */
}

/* Active/Click State */
.calc-button:active:not(:disabled) {
  transform: translateY(0);     /* Return to base */
  box-shadow: 0 2px 8px rgba(0, 0, 0, 0.15);
}

/* Disabled State */
.calc-button:disabled {
  opacity: 0.4;
  cursor: not-allowed;
}
```

---

## Animation & Transitions

### Global Easing Functions

```css
/* Cubic Bezier Values (Material Design) */
ease-in-out: cubic-bezier(0.4, 0, 0.2, 1)    /* Standard easing */
ease-in:     cubic-bezier(0.4, 0, 1, 1)      /* Accelerate */
ease-out:    cubic-bezier(0, 0, 0.2, 1)      /* Decelerate */
custom:      cubic-bezier(0.23, 1, 0.320, 1) /* Snappy */
```

### Component Entry Animation

```css
@keyframes slideIn {
  from {
    opacity: 0;
    transform: translateY(30px);
  }
  to {
    opacity: 1;
    transform: translateY(0);
  }
}

.calculator-card {
  animation: slideIn 0.6s cubic-bezier(0.23, 1, 0.320, 1);
}
```

### Display Transitions

```css
.display {
  transition: all 0.3s cubic-bezier(0.4, 0, 0.2, 1);
  /* Smoothly animates: */
  /* - opacity changes */
  /* - color changes (when error) */
  /* - transform changes (if added) */
}
```

### Error Animation

```css
@keyframes errorShake {
  0%, 100% { transform: translateX(0); }
  10%, 30%, 50%, 70%, 90% { transform: translateX(-4px); }
  20%, 40%, 60%, 80% { transform: translateX(4px); }
}

.display.error {
  color: #ff6b6b;
  font-size: 1.5rem;
  animation: errorShake 0.4s ease-in-out;
}
```

---

## Responsive Design

### Breakpoints

```
┌─────────────────────────────────┐
│  Large Desktop (1200px+)        │
│  - Calculator: 420px max-width  │
│  - Display: 3.5rem              │
│  - Buttons: 1.4rem              │
└─────────────────────────────────┘
           ↓
┌─────────────────────────────────┐
│  Desktop (600px - 1200px)       │
│  - Calculator: 380px max-width  │
│  - Display: 3rem (default)      │
│  - Buttons: 1.25rem             │
└─────────────────────────────────┘
           ↓
┌─────────────────────────────────┐
│  Tablet (400px - 600px)         │
│  - Calculator: 100%             │
│  - Display: 2.5rem              │
│  - Buttons: 1.1rem              │
│  - Gap reduced: 10px            │
└─────────────────────────────────┘
           ↓
┌─────────────────────────────────┐
│  Mobile (<400px)                │
│  - Calculator: 100%             │
│  - Display: 2rem                │
│  - Buttons: 1rem                │
│  - Gap: 8px                     │
│  - Padding: 12px                │
└─────────────────────────────────┘
```

### Mobile Optimizations

```css
/* Touch-Friendly Sizing */
@media (hover: none) and (pointer: coarse) {
  .calc-button {
    min-height: 48px;  /* iOS minimum */
    min-width: 48px;   /* Android minimum */
  }
  
  .calc-button:active {
    transform: scale(0.98);  /* Visual feedback */
  }
}

/* Small Screen Typography */
@media (max-width: 400px) {
  .display {
    font-size: 2rem;       /* Readable but compact */
    min-height: 45px;
  }
}
```

---

## Accessibility Features

### High Contrast Mode

```css
@media (prefers-contrast: more) {
  .calculator-card {
    border: 2px solid rgba(255, 255, 255, 0.2);  /* Thicker border */
  }
  
  .display {
    font-weight: 400;  /* Bolder display */
  }
}
```

### Reduced Motion

```css
@media (prefers-reduced-motion: reduce) {
  * {
    animation: none !important;
    transition: none !important;
  }
}
```

### Focus Indicators

```css
:focus-visible {
  outline: 2px solid #667eea;
  outline-offset: 2px;
  border-radius: 4px;
}

.calc-button:focus {
  outline: none;  /* Remove default */
  /* Use :focus-visible instead for keyboard navigation */
}
```

---

## Print Stylesheet (Optional)

```css
@media print {
  .calculator-container {
    display: none;  /* Hide from printing */
  }
}
```

---

## Performance Considerations

### CSS Optimization

```
✅ Using GPU-accelerated properties:
   - transform: translateY()    (not top/left)
   - opacity: 0.5              (not visibility)
   - will-change: transform    (sparingly)

✅ Minimal repaints:
   - Button shadows use inset (no layout changes)
   - Grid layout (no float fallbacks needed)
   - Flexbox for alignment

✅ Efficient selectors:
   - Specific class names (not descendant selectors)
   - Single class in most cases
   - No deep nesting in compiled CSS
```

### CSS File Size

```
Current: 376 lines of CSS
Compressed: ~1.28kB
Breakdown:
  - Keyframes: 15 lines
  - Container: 25 lines
  - Display: 30 lines
  - Buttons: 80 lines
  - Responsive: 60 lines
  - Accessibility: 15 lines
```

---

## Custom Property Variables (Future Enhancement)

For easier theming:

```css
:root {
  /* Colors */
  --color-primary-start: #667eea;
  --color-primary-end: #764ba2;
  --color-accent-start: #00d4ff;
  --color-accent-end: #0099ff;
  
  /* Typography */
  --font-family: -apple-system, BlinkMacSystemFont, 'Segoe UI', Roboto;
  --font-size-display: 3rem;
  --font-size-button: 1.25rem;
  
  /* Spacing */
  --spacing-unit: 4px;
  --spacing-button-gap: 12px;
  --spacing-card-padding: 24px;
  
  /* Border Radius */
  --radius-button: 16px;
  --radius-card: 28px;
  
  /* Shadows */
  --shadow-soft: 0 4px 15px rgba(0, 0, 0, 0.2);
  --shadow-deep: 0 8px 32px rgba(31, 38, 135, 0.37);
}

/* Usage */
.calc-button {
  border-radius: var(--radius-button);
  gap: var(--spacing-button-gap);
  box-shadow: var(--shadow-soft);
}
```

---

## Design Tokens Summary

| Category | Token | Value | Purpose |
|----------|-------|-------|---------|
| **Color** | Primary Start | #667eea | Operators |
| | Primary End | #764ba2 | Operators |
| | Accent Start | #00d4ff | Equals |
| | Accent End | #0099ff | Equals |
| **Typography** | Font Family | System stack | Universal |
| | Display Size | 3rem | Display |
| | Button Size | 1.25rem | Buttons |
| **Spacing** | Gap | 12px | Between buttons |
| | Padding | 24px | Card edges |
| **Radius** | Button | 16px | Rounded |
| | Card | 28px | Very rounded |
| **Shadow** | Soft | 0 4px 15px | Subtle |
| | Deep | 0 8px 32px | Prominent |

---

**Last Updated:** January 2026
**Maintained By:** CalcPro Design Team
**Version:** 1.0.0
