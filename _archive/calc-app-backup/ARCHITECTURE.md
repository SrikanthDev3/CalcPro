# CalcPro Architecture & Development Guide

## System Architecture

```
┌─────────────────────────────────────────────────┐
│           Angular Application (SPA)              │
├─────────────────────────────────────────────────┤
│  Root Component (App)                           │
│  └─ CalculatorComponent (Standalone)            │
│      ├─ State Management (Signals)              │
│      ├─ View Template (HTML)                    │
│      └─ Styles (CSS)                            │
├─────────────────────────────────────────────────┤
│  Global Styles & Utilities                      │
├─────────────────────────────────────────────────┤
│  Browser APIs                                   │
│  ├─ DOM Manipulation                            │
│  └─ Web APIs (Future: Speech, Storage)          │
└─────────────────────────────────────────────────┘
```

## Component Hierarchy

### Root Component (`App`)
```typescript
App
└── CalculatorComponent (Standalone)
    ├── Display Section
    │   └── Read-only Display
    ├── Buttons Grid (4 columns)
    │   ├── Clear Row
    │   ├── Number Rows
    │   ├── Decimal & Equals
    │   └── Operators
    └── Voice Section (Future)
```

## State Management Pattern

### Signals API Implementation

CalcPro uses Angular's modern **Signals** API for reactive state:

```typescript
// State signal (private, single source of truth)
private state = signal<CalcState>({
  display: '0',
  previousValue: null,
  currentValue: '',
  operator: null,
  isError: false
});

// Public computed signals
display = signal('0');        // Display value
isError = signal(false);      // Error state
```

**Why Signals?**
- ✅ Lightweight and performant
- ✅ Fine-grained reactivity
- ✅ Zero external dependencies
- ✅ Built into Angular 14+
- ✅ No complex RxJS learning curve

### State Transitions

```
Initial: {display: '0', previousValue: null, currentValue: '', operator: null}
         ↓
Number Input: {currentValue: '5', display: '5'}
         ↓
Operator: {previousValue: 5, operator: '+', currentValue: ''}
         ↓
Number Input: {currentValue: '3', display: '3'}
         ↓
Equals: {display: '8', previousValue: null, operator: null} → Result = 8
```

## Calculation Engine

### Algorithm Flow

```
┌─────────────────────────────────────────────────┐
│ Input Number (e.g., "5")                        │
└────────────────┬────────────────────────────────┘
                 ↓
        ┌────────────────────┐
        │ Validate & Format  │
        └────────┬───────────┘
                 ↓
        ┌────────────────────┐
        │ Update Display     │
        └────────┬───────────┘
                 ↓
        ┌────────────────────┐
        │ Store in State     │
        └────────────────────┘

┌─────────────────────────────────────────────────┐
│ Operator Input (e.g., "+")                      │
└────────────────┬────────────────────────────────┘
                 ↓
        ┌────────────────────────────────┐
        │ Pending Operation?             │
        └────┬──────────────────────┬────┘
            YES                    NO
             ↓                      ↓
      ┌────────────────┐   ┌──────────────────┐
      │Calculate First │   │Store Number &    │
      │   Result       │   │Store Operator    │
      └────────────────┘   └──────────────────┘

┌─────────────────────────────────────────────────┐
│ Equals Input                                    │
└────────────────┬────────────────────────────────┘
                 ↓
        ┌────────────────────┐
        │ Validate Inputs    │
        └────────┬───────────┘
                 ↓
        ┌────────────────────┐
        │ Perform Operation  │
        │ (safe math)        │
        └────────┬───────────┘
                 ↓
        ┌────────────────────┐
        │ Format Result      │
        │ (precision)        │
        └────────┬───────────┘
                 ↓
        ┌────────────────────┐
        │ Display Result     │
        │ Clear State        │
        └────────────────────┘
```

## Calculation Methods

### Safe Arithmetic Operations

```typescript
performCalculation(prev: number, current: number, operator: string): number {
  switch(operator) {
    case '+': return prev + current;
    case '-': return prev - current;
    case '*': return prev * current;
    case '/': 
      if (current === 0) throw new Error('Division by zero');
      return prev / current;
  }
}
```

### Number Formatting

```typescript
formatDisplay(value: number): string {
  // Handle very large/small numbers
  if (Math.abs(value) > 1e10) {
    return value.toExponential(6);
  }
  
  // Avoid floating point errors
  const rounded = Math.round(value * 1e10) / 1e10;
  
  // Limit decimal places
  if (parts[1]?.length > 8) {
    return rounded.toFixed(8);
  }
  
  return str;
}
```

## UI/UX Implementation Details

### Component Template Structure

```html
<div class="calculator-container">
  <!-- Outer container with centering -->
  
  <div class="calculator-card">
    <!-- Glassmorphism card with backdrop blur -->
    
    <div class="display-section">
      <!-- Read-only display with animations -->
      <div class="display" [class.error]="isError()">
        {{ display() }}
      </div>
    </div>
    
    <div class="buttons-grid">
      <!-- Responsive 4-column grid -->
      <button *ngFor="let button of buttons" 
              (click)="button.action()">
        {{ button.label }}
      </button>
    </div>
    
    <div class="voice-section">
      <!-- Future voice input placeholder -->
    </div>
  </div>
</div>
```

### CSS Architecture

```css
/* 1. Container & Layout */
.calculator-container { display: flex; centering; }
.calculator-card { gradient; backdrop-filter; rounded; }

/* 2. Display Styling */
.display { large font; responsive; transitions; }
.display.error { error color; shake animation; }

/* 3. Grid Layout */
.buttons-grid { CSS Grid; 4 columns; gap; }
.calc-button { responsive aspect ratio; }

/* 4. Button Variants */
.calc-button.number { default styling; }
.calc-button.operator { purple gradient; }
.calc-button.clear { amber accent; }
.calc-button.equals { cyan gradient; }

/* 5. Responsive Design */
@media (max-width: 600px) { scaled typography; }
@media (max-width: 400px) { optimized for mobile; }

/* 6. Accessibility */
@media (prefers-reduced-motion) { no animations; }
```

## Animation & Interaction Details

### Display Transitions

```css
.display {
  transition: all 0.3s cubic-bezier(0.4, 0, 0.2, 1);
}

/* Display updates smoothly when value changes */
display() = '5'      → smooth opacity/transform transition
display() = 'Error'  → shake animation + red color
```

### Button Interactions

```
Hover State:
  - Background lightens
  - Shadow increases
  - Transform: translateY(-2px)

Active State (Click):
  - Transform: translateY(0)
  - Shadow decreases
  - Immediate visual feedback

Focus State:
  - Outline: 2px solid #667eea
  - For keyboard accessibility
```

### Ripple Effect (Future Enhancement)

```typescript
// Already structured for ripple implementation:
.calc-button::after {
  content: '';
  position: absolute;
  /* Ready for ripple animation */
}
```

## Error Handling Strategy

### Error Types & Recovery

```typescript
// Division by Zero
if (current === 0 && operator === '/') {
  displayError('Error');  // User sees: Error
  // On next input, auto-reset to fresh state
}

// Invalid Expression
if (!operator || !currentValue) {
  return;  // Silent fail, no state change
}

// Floating Point Precision
Math.round(value * 1e10) / 1e10;  // Safe rounding
```

## Input Validation

### Number Input Validation

```typescript
// Prevent leading zeros (except decimals)
if (newValue.length > 1 && newValue[0] === '0' && newValue[1] !== '.') {
  newValue = newValue.substring(1);  // Remove leading 0
}

// Limit input length to 12 digits
if (newValue.length > 12) return;

// Prevent multiple decimals
if (!newValue.includes('.')) {
  newValue += '.';
}
```

## Future Extensibility

### Adding Scientific Mode

```typescript
// Extension Point 1: Buttons Configuration
buttons = [
  ...existingButtons,
  { label: 'sin', type: 'scientific', action: () => this.handleScientific('sin') }
];

// Extension Point 2: Handler Method
handleScientific(fn: string): void {
  const value = parseFloat(this.state().currentValue);
  const result = this.calculateScientific(fn, value);
  this.display.set(this.formatDisplay(result));
}

// Extension Point 3: Helper Method
private calculateScientific(fn: string, value: number): number {
  switch(fn) {
    case 'sin': return Math.sin(value);
    case 'cos': return Math.cos(value);
    // etc
  }
}
```

### Adding Keyboard Support

```typescript
// Listen for keyboard input
onKeyDown(event: KeyboardEvent): void {
  if (event.key >= '0' && event.key <= '9') {
    this.handleNumber(event.key);
  }
  
  if (['+', '-', '*', '/'].includes(event.key)) {
    this.handleOperator(event.key === '*' ? '*' : event.key);
  }
  
  if (event.key === 'Enter') {
    this.calculate();
  }
  
  if (event.key === 'Escape') {
    this.clear();
  }
  
  if (event.key === 'Backspace') {
    this.backspace();  // New method
  }
}
```

### Adding History Panel

```typescript
// Add to state
private history = signal<Array<{calculation: string, result: number}>>([]);

// Add method
private addToHistory(): void {
  const calculation = `${prev} ${operator} ${current}`;
  this.history.update(h => [{calculation, result}, ...h].slice(0, 20));
  // Save to localStorage for persistence
}
```

## Performance Optimization

### Current Optimizations
- ✅ Signals for minimal re-renders
- ✅ Inline event handlers (no change detection overhead)
- ✅ CSS Grid for efficient layout
- ✅ No external dependencies
- ✅ Optimized animations (GPU-accelerated transforms)

### Future Optimizations
- [ ] OnPush change detection strategy
- [ ] Lazy load scientific mode
- [ ] Cache calculation results
- [ ] Debounce rapid inputs
- [ ] Virtual scrolling for history panel

## Testing Strategy

### Unit Test Examples

```typescript
describe('Calculator', () => {
  let component: Calculator;

  beforeEach(() => {
    component = new Calculator();
  });

  describe('performCalculation', () => {
    it('should add two numbers', () => {
      expect(component['performCalculation'](5, 3, '+')).toBe(8);
    });

    it('should throw on division by zero', () => {
      expect(() => component['performCalculation'](5, 0, '/')).toThrow();
    });
  });

  describe('formatDisplay', () => {
    it('should handle floating point precision', () => {
      expect(component['formatDisplay'](0.1 + 0.2)).toBe('0.3');
    });

    it('should format large numbers as exponential', () => {
      const result = component['formatDisplay'](1e11);
      expect(result).toContain('e');
    });
  });
});
```

## Deployment

### Build Optimization

```bash
# Production build with optimizations
ng build --configuration production

# Results in:
# - Minified JavaScript
# - CSS inlining
# - Ahead-of-Time (AOT) compilation
# - Tree-shaking of unused code
```

### Deployment Options

1. **Static Hosting** (Recommended)
   - Netlify: `netlify deploy --prod --dir=dist/calc-app`
   - Vercel: `vercel --prod`
   - GitHub Pages: Push dist/ folder

2. **Server-Side**
   - Express: Serve from /dist
   - Apache: Configure SPA routing

3. **Docker**
   ```dockerfile
   FROM node:18-alpine as builder
   WORKDIR /app
   COPY package*.json ./
   RUN npm ci
   COPY . .
   RUN npm run build
   
   FROM nginx:latest
   COPY --from=builder /app/dist/calc-app /usr/share/nginx/html
   ```

## Monitoring & Analytics

### Performance Tracking

```typescript
// Add performance monitoring
performance.mark('calculation-start');
const result = this.calculate();
performance.mark('calculation-end');
performance.measure('calculation', 'calculation-start', 'calculation-end');
```

### Error Logging (Future)

```typescript
// Add error tracking service
private logError(error: Error): void {
  console.error('Calculator Error:', error);
  // Send to error tracking service (Sentry, etc)
}
```

---

**Last Updated:** January 2026
**Maintained By:** CalcPro Team
**Version:** 1.0.0
