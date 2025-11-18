# MealPal - Mobile Development Setup

This guide will help you run MealPal on both desktop and mobile views.

---

## 🎯 Quick Start - Dual View Mode

The easiest way to see both mobile and desktop views side-by-side:

### **Option 1: Automatic Dual View**
```bash
npm run dev:dual
```
This automatically opens the app with both mobile and desktop previews!

### **Option 2: Toggle Dual View**
1. Start the app normally: `npm run dev`
2. Click the **"Enable Dual View"** button in the top-right corner
3. Or add `?dualview=true` to the URL: `http://localhost:3000/?dualview=true`

### **Controls in Dual View:**
- **Exit Dual View** - Return to normal view
- **📱 Mobile** - Show mobile (375px) and desktop views
- **📱 Tablet** - Show mobile, tablet (768px), and desktop views  
- **🖥️ Desktop** - Show mobile and desktop (1440px) views

---

## 📱 Testing on Real Mobile Devices

### **Method 1: Same Network Access**

1. **Start the dev server with network access:**
   ```bash
   npm run dev:mobile
   ```

2. **Find your computer's IP address:**
   
   **Windows:**
   - Open Command Prompt
   - Type: `ipconfig`
   - Look for "IPv4 Address" (e.g., 192.168.1.100)
   
   **Mac/Linux:**
   - Open Terminal
   - Type: `ifconfig | grep inet`
   - Look for your local IP (e.g., 192.168.1.100)

3. **Connect from your mobile device:**
   - Make sure your phone is on the same WiFi network
   - Open browser on your phone
   - Go to: `http://YOUR_IP:3000`
   - Example: `http://192.168.1.100:3000`

---

## 🤖 Android Studio Emulator Setup

### **Prerequisites:**
- Android Studio installed
- At least 8GB RAM recommended
- 10GB free disk space

### **Step 1: Install Android Studio**

1. Download from: https://developer.android.com/studio
2. Install with default settings
3. Open Android Studio

### **Step 2: Create Virtual Device**

1. In Android Studio, click **More Actions** → **Virtual Device Manager**
2. Click **Create Device**
3. Select a phone (recommended: **Pixel 6**)
4. Click **Next**
5. Download a system image (recommended: **Android 13 - API 33**)
6. Click **Next** → **Finish**

### **Step 3: Start the Emulator**

1. In Virtual Device Manager, click ▶️ **Play** button next to your device
2. Wait for the emulator to fully boot (2-3 minutes first time)

### **Step 4: Access MealPal on Emulator**

**Method A: Using localhost (Recommended)**
1. Start your MealPal dev server: `npm run dev:mobile`
2. In the Android emulator, open Chrome browser
3. Go to: `http://10.0.2.2:3000`
   - `10.0.2.2` is a special address that maps to your computer's localhost

**Method B: Using IP Address**
1. Find your computer's IP address (see above)
2. Start dev server: `npm run dev:mobile`
3. In emulator browser, go to: `http://YOUR_IP:3000`

### **Step 5: Enable Developer Mode in Emulator (Optional)**

For better debugging:
1. In emulator, go to **Settings** → **About Phone**
2. Tap **Build Number** 7 times
3. Go back to **Settings** → **System** → **Developer Options**
4. Enable **USB Debugging**

---

## 🍎 iOS Simulator Setup (Mac Only)

### **Prerequisites:**
- macOS
- Xcode installed

### **Step 1: Install Xcode**

1. Download from Mac App Store
2. Install (requires ~15GB space)

### **Step 2: Open Simulator**

1. Open **Xcode**
2. Go to **Xcode** → **Open Developer Tool** → **Simulator**
3. Or run in terminal: `open -a Simulator`

### **Step 3: Select Device**

1. In Simulator menu: **File** → **Open Simulator** → Select device (e.g., iPhone 14)

### **Step 4: Access MealPal**

1. Start dev server: `npm run dev:mobile`
2. In Simulator, open Safari
3. Go to: `http://localhost:3000`

---

## 🖥️ Browser DevTools Mobile Testing

The simplest method - no additional software needed!

### **Chrome/Edge:**

1. Open your app: `http://localhost:3000`
2. Press **F12** to open DevTools
3. Click the **Toggle Device Toolbar** icon (or press `Ctrl+Shift+M`)
4. Select a device from the dropdown:
   - iPhone SE
   - iPhone 12 Pro
   - Pixel 5
   - Samsung Galaxy S20
   - iPad Air
   - Or set custom dimensions

### **Firefox:**

1. Press **F12** to open DevTools
2. Click **Responsive Design Mode** icon (or press `Ctrl+Shift+M`)
3. Select device or set custom size

### **Safari:**

1. Enable Developer menu: **Safari** → **Preferences** → **Advanced** → Check "Show Develop menu"
2. **Develop** → **Enter Responsive Design Mode**

---

## 🎨 Recommended Mobile Testing Devices

### **Phone Sizes:**
- **Small**: iPhone SE (375 × 667)
- **Medium**: iPhone 12/13 (390 × 844)
- **Large**: iPhone 14 Pro Max (430 × 932)
- **Android**: Pixel 5 (393 × 851), Samsung S20 (360 × 800)

### **Tablet Sizes:**
- **Small**: iPad Mini (768 × 1024)
- **Large**: iPad Pro 12.9" (1024 × 1366)

---

## 🔧 Troubleshooting

### **Can't access from mobile device:**
- ✅ Ensure both devices are on same WiFi network
- ✅ Check firewall isn't blocking port 3000
- ✅ Try disabling VPN
- ✅ On Windows, allow Node.js through firewall when prompted

### **Android emulator is slow:**
- ✅ Enable hardware acceleration in BIOS (VT-x/AMD-V)
- ✅ Increase RAM allocation in AVD settings
- ✅ Use a lighter system image (e.g., without Google Play)

### **Port 3000 already in use:**
```bash
# Use a different port
npm run dev -- --port 3001
```

### **Changes not reflecting on mobile:**
- ✅ Hard refresh: `Ctrl+Shift+R` (Chrome) or `Cmd+Shift+R` (Safari)
- ✅ Clear browser cache
- ✅ Restart dev server

---

## 📊 Testing Checklist

Use this to ensure your app works well on mobile:

### **Visual Testing:**
- [ ] All text is readable without zooming
- [ ] Buttons are easily tappable (min 44×44px)
- [ ] No horizontal scrolling
- [ ] Images load correctly
- [ ] Layout doesn't break at different screen sizes

### **Interaction Testing:**
- [ ] Touch gestures work smoothly
- [ ] Forms are easy to fill on mobile keyboard
- [ ] Navigation menu works (hamburger menu)
- [ ] Scrolling is smooth
- [ ] Dialogs/modals fit on screen

### **Performance Testing:**
- [ ] App loads in < 3 seconds on 3G
- [ ] No lag when scrolling
- [ ] Animations are smooth
- [ ] Images are optimized

### **Cross-Device Testing:**
- [ ] iPhone (iOS Safari)
- [ ] Android (Chrome)
- [ ] Tablet (iPad)
- [ ] Desktop (Chrome, Firefox, Edge)

---

## 🚀 Development Workflow

### **Recommended Setup:**

**For quick testing:**
```bash
npm run dev:dual
```
See both mobile and desktop views instantly!

**For detailed mobile testing:**
1. Use browser DevTools (F12 → Device Mode)
2. Test on real device via same network
3. Use emulator for Android-specific features

**For production testing:**
```bash
npm run build
npm run preview:mobile
```

---

## 💡 Pro Tips

1. **Use dual view mode** for quick visual checks while coding
2. **Test on real devices** before finalizing features
3. **Chrome DevTools** has network throttling to test slow connections
4. **Take screenshots** on different devices for documentation
5. **Test touch interactions** - hover states don't exist on mobile
6. **Check landscape mode** - rotate emulator/device

---

## 📱 Mobile-Specific Features in MealPal

MealPal is already optimized for mobile:
- ✅ Responsive layout (mobile-first design)
- ✅ Touch-friendly buttons (minimum 44px)
- ✅ Swipe-friendly navigation
- ✅ Mobile-optimized forms
- ✅ Sheet/drawer components for mobile
- ✅ Optimized images and assets

---

## 🎯 Next Steps

1. **Start with dual view mode** to see your changes on both screens
2. **Use browser DevTools** for most testing
3. **Set up emulator** if you need to test Android-specific features
4. **Test on real device** before shipping to users

---

**Happy Mobile Development! 📱**
