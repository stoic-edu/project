# 📱 MealPal - Mobile-Only Application

## Overview

MealPal is designed as a **mobile-only application** optimized specifically for Android mobile devices.

---

## 🎯 Design Philosophy

### **Mobile-First → Mobile-Only**

MealPal has been purposefully designed as a mobile-only application:

- ✅ **Maximum width:** 480px
- ✅ **Target device:** Android phones (Pixel 6, etc.)
- ✅ **Touch-optimized:** 44px minimum tap targets
- ✅ **Portrait orientation:** Primary design focus
- ✅ **Bottom navigation:** Thumb-friendly UI

---

## 📐 Technical Specifications

### **Viewport Constraints**

```css
/* Applied to body in globals.css */
body {
  max-width: 480px;
  margin: 0 auto;
}
```

### **Recommended Test Devices**

| Device | Screen Size | Status |
|--------|-------------|--------|
| **Pixel 6** | 1080x2400 (411x915 dp) | ⭐ Recommended |
| **Pixel 5** | 1080x2340 (393x851 dp) | ✅ Supported |
| **Pixel 7** | 1080x2400 (412x915 dp) | ✅ Supported |
| Generic Phone | Up to 480px width | ✅ Supported |

### **What This Means**

1. **No desktop layout** - App centers with max-width on larger screens
2. **No responsive breakpoints** - Single mobile layout only
3. **No tablet optimization** - Designed for phones
4. **Touch-first** - All interactions optimized for touch

---

## 🧪 Testing the Mobile-Only App

### **Option 1: Android Studio Emulator (Recommended)**

```bash
# Start dev server
npm run dev

# Open in emulator
http://10.0.2.2:5174
```

**See:** [ANDROID_EMULATOR_SETUP.md](./ANDROID_EMULATOR_SETUP.md)

### **Option 2: Browser DevTools**

```bash
# Start dev server
npm run dev

# Then in Chrome:
1. Press F12
2. Press Ctrl+Shift+M (device mode)
3. Select mobile device (Pixel 5, iPhone 12, etc.)
4. Resize to ~375-414px width
```

### **What You'll See**

On devices wider than 480px:
```
┌─────────────────────────────────────┐
│                                     │
│     ┌──────────────┐                │
│     │   MealPal    │  ← Centered   │
│     │  (480px max) │                │
│     │              │                │
│     └──────────────┘                │
│                                     │
└─────────────────────────────────────┘
```

On mobile devices (≤480px):
```
┌──────────────┐
│   MealPal    │  ← Full width
│              │
│              │
└──────────────┘
```

---

## 🎨 UI Characteristics

### **Mobile-Optimized Features**

✅ **Touch Targets:** All buttons/links minimum 44x44px
✅ **Bottom Navigation:** Easy thumb access
✅ **Card-based UI:** Scrollable content sections
✅ **Large text:** Readable on small screens
✅ **Tap feedback:** Visual scale on press
✅ **Smooth scrolling:** `-webkit-overflow-scrolling: touch`

### **Removed Desktop Features**

❌ Dual view mode
❌ Desktop navigation
❌ Sidebar layouts
❌ Hover states (touch-only)
❌ Responsive breakpoints (md:, lg:, xl:)

---

## 🔧 Development Workflow

### **Standard Workflow**

1. **Start emulator** (Android Studio)
2. **Start dev server** (`npm run dev`)
3. **Open in emulator** (`http://10.0.2.2:5174`)
4. **Edit code** (changes auto-refresh)
5. **Test interactions** (tap, scroll, navigate)

### **Quick Testing Workflow**

1. **Start dev server** (`npm run dev`)
2. **Open in Chrome** (`http://localhost:5174`)
3. **Enable device mode** (F12 → Ctrl+Shift+M)
4. **Set width to 375-414px**
5. **Test functionality**

---

## 📏 Layout Guidelines

### **CSS Considerations**

When developing MealPal components:

```css
/* ✅ DO: Use mobile-first utilities */
.my-component {
  padding: 1rem;
  width: 100%;
}

/* ❌ DON'T: Use responsive breakpoints */
.my-component {
  @media (md) { ... }  /* Not needed - mobile-only! */
}
```

### **React Components**

```tsx
// ✅ DO: Design for mobile
<div className="w-full px-4 py-6">
  <button className="w-full h-12">Tap Me</button>
</div>

// ❌ DON'T: Add desktop layouts
<div className="md:flex md:justify-between">  {/* Not needed */}
  ...
</div>
```

---

## 🚫 What Was Removed

### **Components**
- ✅ **DevicePreview.tsx** - Deleted (dual view component)

### **Scripts**
- ❌ `npm run dev:dual` - Removed
- ❌ `npm run dev:mobile` - Removed
- ❌ `npm run preview:mobile` - Removed

### **Code**
- ❌ Dual view URL parameter checking
- ❌ DevicePreview wrapper in App.tsx
- ❌ `md:pb-0` responsive utilities in main container

---

## ✅ Benefits of Mobile-Only

### **For Development**
1. **Simpler codebase** - No responsive complexity
2. **Faster testing** - Single layout to verify
3. **Clearer intent** - Purpose-built for mobile
4. **Better focus** - Optimize for one experience

### **For Users**
1. **Optimized experience** - Built for their device
2. **Consistent UI** - Same on all phones
3. **Better performance** - No unnecessary code
4. **Touch-friendly** - Designed for fingers, not mouse

---

## 📱 Supported Scenarios

| Scenario | Supported | Notes |
|----------|-----------|-------|
| Android phone | ✅ Yes | Primary target |
| iPhone | ✅ Yes | Works but Android-optimized |
| Tablet | ⚠️ Works | But centered with max-width |
| Desktop | ⚠️ Works | But centered with max-width |
| Landscape mode | ✅ Yes | Rotates, still mobile UI |

---

## 🎯 Target User

**Primary:** Students using Android phones in cafeteria
**Context:** Quick meal browsing, budget checking, on-the-go
**Environment:** Standing in line, checking phone quickly

This informs all design decisions!

---

## 📝 Summary

**MealPal is intentionally mobile-only:**
- Max-width: 480px
- Touch-optimized
- Single layout
- Android emulator for testing
- No desktop features
- No dual view
- Purpose-built for phones

**Test it:** Use Android Studio emulator or Chrome DevTools device mode!

---

**For setup instructions:** See [START_HERE.md](./START_HERE.md)
