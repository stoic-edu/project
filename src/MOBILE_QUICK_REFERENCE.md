# MealPal Mobile Development - Quick Reference Card

Keep this handy while developing! 📱

---

## 🚀 Commands

```bash
# Development
npm run dev              # Normal mode
npm run dev:dual         # Dual view (mobile + desktop)
npm run dev:mobile       # Network access for phone testing

# Build
npm run build           # Production build
npm run preview:mobile  # Preview with network access
```

---

## 📱 View Modes

### **1. Dual View Mode (Best for Development)**
- **Start:** `npm run dev:dual`
- **URL:** `http://localhost:3000/?dualview=true`
- **Shows:** Mobile (375px) + Desktop (1440px) side-by-side
- **Toggle:** Click "Enable Dual View" button in top-right

### **2. Browser DevTools**
- **Shortcut:** `F12` → `Ctrl+Shift+M`
- **Test:** Multiple device sizes
- **Network:** Throttle to test slow connections

### **3. Real Device**
- **Setup:** `npm run dev:mobile`
- **Access:** `http://YOUR_IP:3000` (same WiFi)
- **Find IP:** 
  - Windows: `ipconfig`
  - Mac/Linux: `ifconfig | grep inet`

### **4. Android Emulator**
- **Access:** `http://10.0.2.2:3000`
- **Special:** 10.0.2.2 = localhost on emulator
- **See:** `MOBILE_SETUP.md` for full setup

---

## 📐 Screen Sizes

| Device | Width | Usage |
|--------|-------|-------|
| Mobile | 375px | Default mobile |
| Phone L | 430px | Large phones |
| Tablet | 768px | iPad |
| Desktop | 1440px | Standard desktop |

---

## ✅ Quick Test (2 minutes)

1. `npm run dev:dual` ← Start dual view
2. Click all buttons on mobile view
3. Fill a form on mobile
4. Check all pages on both views
5. Resize browser to check breakpoints

---

## 🎯 Mobile Breakpoints

```css
/* Tailwind Breakpoints */
/* default = mobile (< 640px) */
sm:  /* 640px+ */
md:  /* 768px+ */
lg:  /* 1024px+ */
xl:  /* 1280px+ */
2xl: /* 1536px+ */
```

---

## 🐛 Quick Fixes

### **Horizontal scroll appearing:**
```css
/* Add to component */
className="w-full overflow-x-hidden"
```

### **Text too small on mobile:**
```css
/* Don't use text-xs on mobile */
className="text-sm sm:text-xs"
```

### **Button too small to tap:**
```css
/* Minimum 44x44px */
className="min-h-[44px] min-w-[44px]"
```

### **Modal doesn't fit screen:**
```css
className="max-w-[calc(100vw-2rem)] max-h-[90vh]"
```

---

## 🎨 Mobile-First Classes

```jsx
// Mobile-first approach (default = mobile)
<div className="
  text-base      /* Mobile */
  md:text-lg     /* Tablet+ */
  xl:text-xl     /* Desktop+ */
  
  p-4            /* Mobile */
  md:p-6         /* Tablet+ */
  xl:p-8         /* Desktop+ */
  
  flex-col       /* Mobile stacked */
  md:flex-row    /* Tablet+ side-by-side */
">
```

---

## 📱 Touch-Friendly Patterns

```jsx
// Good - Touch-friendly button
<Button className="min-h-[44px] px-4 py-2">
  Click Me
</Button>

// Good - Proper spacing
<div className="space-y-4"> {/* 16px between items */}
  <Button>Button 1</Button>
  <Button>Button 2</Button>
</div>

// Good - Mobile-optimized card
<Card className="p-4 active:scale-98 cursor-pointer">
  {/* Tap feedback with active:scale */}
</Card>
```

---

## 🔍 Debugging Mobile Issues

### **Visual Issues:**
1. Open dual view: `npm run dev:dual`
2. Compare mobile vs desktop
3. Identify what's different

### **Touch Issues:**
1. Open browser DevTools (F12)
2. Enable device mode (Ctrl+Shift+M)
3. Use "Touch" simulation
4. Check element sizes in Inspector

### **Layout Issues:**
1. Open DevTools → Elements
2. Inspect the problem element
3. Check its width/height values
4. Look for `overflow: hidden` or fixed widths

---

## 📊 Performance Tips

```bash
# Check bundle size
npm run build
# Look at dist/ folder sizes

# Test on slow network
# DevTools → Network → Slow 3G
```

---

## 🎯 Must-Test Features

Before committing, test these on mobile:

- [ ] Login/Signup forms
- [ ] Main navigation (hamburger menu)
- [ ] Menu item selection
- [ ] Budget tracking cards
- [ ] Charts/graphs
- [ ] Modal dialogs
- [ ] Date pickers
- [ ] Form submissions

---

## 📞 Get Help

| Issue | Check |
|-------|-------|
| Can't see mobile view | `npm run dev:dual` |
| Real phone can't access | Same WiFi? Firewall? |
| Emulator slow | Enable VT-x in BIOS |
| Layout broken | Check responsive classes |
| Button too small | Min 44x44px touch target |

---

## 🎓 Learn More

- **Full Guide:** `MOBILE_SETUP.md`
- **Testing:** `MOBILE_TESTING_CHECKLIST.md`
- **Quick Start:** `QUICKSTART.md`
- **Complete Docs:** `README.md`

---

## 💡 Pro Tips

1. **Always start with dual view** during development
2. **Test on real device** before calling it done
3. **Mobile-first CSS** - start with mobile, add desktop later
4. **Touch targets** - make everything ≥ 44px
5. **Visual feedback** - use `active:` states for tap feedback

---

**Bookmark this page for quick reference! 🔖**

---

## 🎯 The Golden Rule

> If it works on mobile, it works everywhere.
> If it only works on desktop, it's broken for 70% of users.

**Test mobile FIRST, desktop SECOND!**
