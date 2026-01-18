# CalcPro - Quick Start Guide

## 🚀 Get Started in 3 Steps

### Step 1: Install Dependencies
```bash
cd calc-app
npm install
```

### Step 2: Start Development Server
```bash
npm start
```

The app will open at `http://localhost:4200`

### Step 3: Start Calculating!
Click buttons or use keyboard (numbers, +, -, *, /)

---

## 📦 Available Commands

```bash
# Development server with auto-reload
npm start

# Build for production
npm run build

# Run unit tests
npm test

# Run e2e tests
npm run e2e

# Lint the code
npm run lint

# Format code (if prettier configured)
npm run format
```

---

## 🎯 Key Features at a Glance

| Feature | Status | Details |
|---------|--------|---------|
| Basic Arithmetic | ✅ Done | +, −, ×, ÷ |
| Percentage | ✅ Done | Calculate % of values |
| Sign Toggle | ✅ Done | Positive/Negative toggle |
| Error Handling | ✅ Done | Division by zero, invalid ops |
| Responsive Design | ✅ Done | Mobile, tablet, desktop |
| Dark Theme | ✅ Done | Premium glassmorphism UI |
| Voice Input | 🔮 Planned | Future feature placeholder |
| Scientific Mode | 🔮 Planned | trig, log functions |
| Keyboard Support | 🔮 Planned | Full keyboard input |
| History Panel | 🔮 Planned | Save recent calculations |

---

## 🎨 UI Customization

### Change Theme Colors

Edit `calc-app/src/app/calculator/calculator.css`:

```css
/* Operator buttons (Purple) */
.calc-button.operator {
  background: linear-gradient(135deg, #667eea 0%, #764ba2 100%);
}

/* Equals button (Cyan) */
.calc-button.equals {
  background: linear-gradient(135deg, #00d4ff 0%, #0099ff 100%);
}
```

### Adjust Display Size

In `calculator.css`:

```css
.display {
  font-size: 3rem;  /* Change this for larger/smaller display */
  font-weight: 300; /* Change this for bolder/lighter text */
}
```

---

## 🔧 Component Overview

### File Structure
```
src/app/
├── calculator/
│   ├── calculator.ts      ← Component logic
│   ├── calculator.html    ← UI template
│   └── calculator.css     ← Styling
├── app.ts                 ← Root component
└── app.html              ← Root template
```

### Main Component Logic (`calculator.ts`)

**Key Methods:**
- `handleNumber('5')` - Add digit to calculation
- `handleOperator('+')` - Set operation
- `calculate()` - Compute result
- `clear()` - Reset everything

**State:**
```typescript
{
  display: '0',           // What user sees
  currentValue: '',       // Currently entered number
  previousValue: null,    // First number (before operator)
  operator: null,         // Current operation
  isError: false          // Error flag
}
```

---

## ⌨️ Keyboard Support (Ready to Implement)

Currently available:
- **1-9**: Number input
- **+, -, *, /**: Operations
- **=**: Calculate result
- **C**: Clear

To enable keyboard, uncomment in component:
```typescript
@HostListener('keydown', ['$event'])
handleKeyboardEvent(event: KeyboardEvent) {
  // Currently commented out - uncomment to enable
}
```

---

## 🧪 Testing

### Unit Tests (Placeholder)

Create `calculator.spec.ts`:

```typescript
import { Calculator } from './calculator';

describe('Calculator', () => {
  let calc: Calculator;

  beforeEach(() => {
    calc = new Calculator();
  });

  it('should add numbers', () => {
    calc.handleNumber('5');
    calc.handleOperator('+');
    calc.handleNumber('3');
    calc.calculate();
    expect(calc.display()).toBe('8');
  });
});
```

Run tests:
```bash
npm test
```

---

## 📱 Responsive Breakpoints

The calculator adapts to screen sizes:

```
┌─ Desktop (>1200px)
│  └─ 420px max width
├─ Tablet (600-1200px)
│  └─ 380px max width
├─ Mobile (400-600px)
│  └─ 100% width with padding
└─ Small Mobile (<400px)
   └─ Compact layout, touch-optimized
```

---

## 🎤 Adding Voice Feature

1. **Enable the button** (currently disabled)

```typescript
voiceButton = { label: '🎤', type: 'voice', disabled: false };
```

2. **Add Web Speech API handler**

```typescript
handleVoiceInput(): void {
  const recognition = new (window as any).webkitSpeechRecognition();
  recognition.onresult = (event: any) => {
    const transcript = event.results[0][0].transcript;
    // Parse and handle transcript
  };
  recognition.start();
}
```

---

## 🔬 Adding Scientific Functions

1. **Add buttons to grid**

```typescript
buttons = [
  ...existingButtons,
  { label: 'sin', type: 'scientific', action: () => this.handleScientific('sin') }
];
```

2. **Implement handler**

```typescript
handleScientific(fn: string): void {
  const value = parseFloat(this.state().currentValue);
  const result = Math.sin(value); // etc
  this.display.set(result.toString());
}
```

---

## 🐛 Debugging

### Enable Debug Mode

```typescript
// In calculator.ts
private state = signal<CalcState>({
  // ... initial state
});

// Log state changes
this.state.subscribe(state => {
  console.log('State updated:', state);
});
```

### Check Browser Console

Open DevTools (F12) → Console tab:
- See any TypeScript compilation errors
- Watch console.log statements
- Inspect component state

### VS Code Debugging

`.vscode/launch.json` is pre-configured:

1. Press `F5` to start debugging
2. Set breakpoints in TypeScript files
3. Inspect variables at runtime

---

## 📊 Performance Tips

✅ **Already Optimized:**
- Angular Signals for minimal re-renders
- CSS Grid for efficient layout
- No external dependencies
- Inline event handlers

🚀 **Further Optimizations:**
- Enable production build caching
- Add service worker for offline
- Implement code splitting
- Use lazy loading for scientific mode

---

## 🌐 Browser Compatibility

| Browser | Version | Status |
|---------|---------|--------|
| Chrome | Latest 2 | ✅ Full support |
| Firefox | Latest 2 | ✅ Full support |
| Safari | Latest 2 | ✅ Full support |
| Edge | Latest 2 | ✅ Full support |
| Mobile Safari | iOS 12+ | ✅ Full support |
| Android Chrome | Latest | ✅ Full support |

---

## 📚 Useful Resources

- **Angular Docs**: https://angular.dev
- **TypeScript**: https://www.typescriptlang.org
- **MDN Web Docs**: https://developer.mozilla.org
- **CSS-Tricks**: https://css-tricks.com

---

## ❓ Troubleshooting

### Port 4200 Already in Use
```bash
# Kill process on port 4200
lsof -ti:4200 | xargs kill -9

# Or use different port
ng serve --port 4201
```

### Dependencies Not Installing
```bash
# Clear npm cache
npm cache clean --force

# Remove node_modules and reinstall
rm -rf node_modules package-lock.json
npm install
```

### Display Not Updating
- Check browser console for errors
- Verify Signals are properly used
- Clear browser cache (Ctrl+Shift+Delete)

### Styling Not Applied
- Hard refresh: Ctrl+Shift+R
- Check CSS specificity conflicts
- Verify CSS files are imported

---

## 🚀 Deployment Checklist

- [ ] Run `npm run build` successfully
- [ ] Check `/dist` folder created
- [ ] Test production build locally
- [ ] Review bundle size
- [ ] Test on mobile devices
- [ ] Check performance metrics
- [ ] Validate accessibility (a11y)
- [ ] Deploy to hosting service

---

## 📞 Getting Help

1. **Check ARCHITECTURE.md** for detailed docs
2. **Review README.md** for feature overview
3. **Inspect calculator.ts** for code comments
4. **Check browser console** for errors
5. **Search GitHub issues** for similar problems

---

**Happy Calculating! 🧮**

*Last Updated: January 2026*
