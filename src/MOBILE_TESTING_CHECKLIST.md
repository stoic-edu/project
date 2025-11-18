# Mobile Testing Checklist for MealPal

Use this checklist before considering a feature "done".

---

## 🎯 Quick Test Commands

| Command | Purpose |
|---------|---------|
| `npm run dev:dual` | See mobile + desktop side-by-side |
| `npm run dev:mobile` | Test on real phone (same WiFi) |
| `F12` then `Ctrl+Shift+M` | Browser mobile mode |

---

## ✅ Visual Layout Testing

### **Mobile (375px - iPhone SE)**
- [ ] All content fits without horizontal scroll
- [ ] Text is readable without zooming
- [ ] Images scale properly
- [ ] Buttons are not overlapping
- [ ] Cards/containers have proper spacing
- [ ] Navigation menu works

### **Tablet (768px - iPad)**
- [ ] Layout adapts properly
- [ ] Content uses available space well
- [ ] Navigation transitions correctly
- [ ] Multi-column layouts work

### **Desktop (1440px)**
- [ ] Full layout is visible
- [ ] Content is centered/aligned well
- [ ] Desktop navigation works
- [ ] No wasted white space

---

## 🖱️ Touch & Interaction Testing

### **All Clickable Elements:**
- [ ] Minimum 44×44px touch target
- [ ] Enough spacing between buttons
- [ ] Visual feedback on tap
- [ ] No hover-only interactions

### **Forms:**
- [ ] Input fields are large enough
- [ ] Mobile keyboard doesn't hide inputs
- [ ] Dropdowns/selects work on touch
- [ ] Date pickers are touch-friendly
- [ ] Validation messages are visible

### **Navigation:**
- [ ] Hamburger menu opens smoothly
- [ ] Sheet/drawer slides properly
- [ ] Back navigation works
- [ ] Tabs switch correctly
- [ ] Links are tappable

### **Scrolling:**
- [ ] Smooth scroll (no lag)
- [ ] Pull-to-refresh disabled (if not needed)
- [ ] Scroll momentum feels natural
- [ ] Fixed elements stay fixed
- [ ] No content cut off

---

## 📱 Screen Orientation Testing

### **Portrait Mode:**
- [ ] Default view works
- [ ] All features accessible
- [ ] Layout is optimized

### **Landscape Mode:**
- [ ] Layout adapts properly
- [ ] Content is still accessible
- [ ] Navigation still works
- [ ] No overflow issues

---

## ⚡ Performance Testing

### **Load Time:**
- [ ] Initial load < 3 seconds on WiFi
- [ ] Initial load < 5 seconds on 4G
- [ ] Shows loading state
- [ ] No blank screen flash

### **Runtime Performance:**
- [ ] No lag when scrolling
- [ ] Animations are smooth (60fps)
- [ ] Transitions don't stutter
- [ ] No memory leaks on long use

### **Asset Optimization:**
- [ ] Images are compressed
- [ ] Images use correct size
- [ ] No unnecessarily large files
- [ ] Lazy loading where appropriate

---

## 🎨 Responsive Design Testing

Test these breakpoints:

| Size | Width | Device Example |
|------|-------|----------------|
| **xs** | < 640px | Phone portrait |
| **sm** | 640px+ | Phone landscape |
| **md** | 768px+ | Tablet portrait |
| **lg** | 1024px+ | Tablet landscape |
| **xl** | 1280px+ | Desktop |
| **2xl** | 1536px+ | Large desktop |

For each breakpoint:
- [ ] Layout looks intentional (not broken)
- [ ] Text is readable
- [ ] Spacing is consistent
- [ ] Navigation works

---

## 🔍 Feature-Specific Testing

### **Student Dashboard:**
- [ ] Menu items display properly on mobile
- [ ] Budget cards are readable
- [ ] Charts render correctly
- [ ] Transaction list scrolls smoothly
- [ ] Profile editing works on mobile

### **Cafeteria Admin:**
- [ ] Menu management form works on mobile
- [ ] Date picker is touch-friendly
- [ ] Item cards display properly
- [ ] Nutrition database is usable
- [ ] Edit/delete actions work

### **System Admin:**
- [ ] User table is scrollable
- [ ] Reports display correctly
- [ ] Charts are readable
- [ ] Actions are accessible

---

## 🌐 Browser Testing

### **Mobile Browsers:**
- [ ] iOS Safari (latest)
- [ ] Chrome Mobile (latest)
- [ ] Firefox Mobile (optional)

### **Desktop Browsers:**
- [ ] Chrome (latest)
- [ ] Firefox (latest)
- [ ] Safari (latest)
- [ ] Edge (latest)

---

## 🐛 Common Mobile Issues to Check

### **Text Issues:**
- [ ] No text too small to read
- [ ] No text overflow/cut off
- [ ] Font weights load correctly
- [ ] No blurry text

### **Layout Issues:**
- [ ] No elements overlapping
- [ ] No content hidden off-screen
- [ ] Modals/dialogs fit on screen
- [ ] z-index conflicts resolved

### **Input Issues:**
- [ ] Keyboard doesn't hide inputs
- [ ] Auto-focus works properly
- [ ] Copy/paste works
- [ ] Date inputs use native pickers

### **Media Issues:**
- [ ] Images don't overflow
- [ ] SVGs scale properly
- [ ] Icons render clearly
- [ ] No broken images

---

## 📊 Accessibility Testing

### **Touch Targets:**
- [ ] All buttons ≥ 44×44px
- [ ] Sufficient spacing (≥ 8px)
- [ ] Clear visual feedback

### **Readability:**
- [ ] Font size ≥ 16px base
- [ ] Sufficient contrast ratio
- [ ] Line height comfortable
- [ ] Line length not too long

### **Navigation:**
- [ ] Keyboard navigation works
- [ ] Focus states visible
- [ ] Logical tab order
- [ ] Skip links available

---

## 🎯 Testing Workflow

### **During Development:**
1. Use `npm run dev:dual` constantly
2. Check mobile view after each change
3. Test interactive features immediately

### **Before Committing:**
1. Test on all breakpoints
2. Check in browser DevTools mobile mode
3. Verify touch interactions work
4. Run performance check

### **Before Deploying:**
1. Test on real mobile device
2. Test on Android emulator
3. Test on iOS simulator (if Mac)
4. Cross-browser check
5. Performance audit

---

## 🚀 Quick Test Script

Run through this in < 5 minutes:

1. **Start dual view:** `npm run dev:dual`
2. **Visual check:** Look at mobile and desktop views
3. **Click test:** Click every button on both views
4. **Form test:** Fill and submit all forms
5. **Navigation test:** Navigate through all pages
6. **Scroll test:** Scroll all scrollable areas
7. **Responsive test:** Resize browser window
8. **Touch test:** Use browser device mode

If all pass → ✅ Ready to commit!

---

## 📝 Notes

- Keep this checklist open while developing
- Check items as you test
- Document any issues found
- Retest after fixes

---

**Testing mobile is crucial - 70% of users are on mobile devices! 📱**
