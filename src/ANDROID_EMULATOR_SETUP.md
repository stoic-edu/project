# 📱 Android Studio Emulator Setup for MealPal

This guide will help you test MealPal using the Android Studio emulator.

---

## 📋 Prerequisites

### **Step 1: Install Android Studio**

1. **Download Android Studio:**
   - Go to: https://developer.android.com/studio
   - Download for Windows
   - Install with default settings

2. **During Installation:**
   - ✅ Check "Android Virtual Device"
   - ✅ Check "Android SDK"
   - Click through the setup wizard

---

## 🚀 Quick Start (For First Time)

### **Step 1: Open Android Studio**

1. Launch Android Studio
2. Click **"More Actions"** → **"Virtual Device Manager"**
   - Or go to: **Tools** → **Device Manager**

### **Step 2: Create a Virtual Device**

1. Click **"Create Device"** button
2. **Choose a device:**
   - Recommended: **Pixel 6** (modern Android phone)
   - Or: **Pixel 7 Pro** (larger screen)
   - Click **Next**

3. **Select a system image:**
   - Choose **"Tiramisu"** (Android 13) - Recommended
   - Or **"UpsideDownCake"** (Android 14)
   - Click **Download** next to it (wait for download)
   - Click **Next**

4. **Verify Configuration:**
   - Name: Keep default or name it "MealPal Test"
   - Click **Finish**

### **Step 3: Start the Emulator**

1. In Device Manager, find your device
2. Click the **▶️ Play button** next to it
3. Wait 30-60 seconds for Android to boot
4. You'll see an Android phone screen!

---

## 🌐 Running MealPal on the Emulator

### **Step 1: Start Your Dev Server**

In your VS Code terminal (in the MealPal project folder):

```bash
npm run dev
```

You should see:
```
VITE v5.x.x  ready in xxx ms

➜  Local:   http://localhost:5174/
➜  Network: http://192.168.x.x:5174/
```

**Keep this terminal running!**

### **Step 2: Open MealPal in the Emulator**

In the Android emulator:

1. **Open Chrome browser** (tap the Chrome icon)

2. **Enter this URL in the address bar:**
   ```
   http://10.0.2.2:5174
   ```

   ⚠️ **Important:** Use `10.0.2.2` NOT `localhost`
   - `10.0.2.2` is how Android emulator accesses your computer's localhost

3. **Press Enter**

4. **You should see MealPal!** 🎉

---

## ✅ What You Should See

- **Beautiful orange/amber gradient background**
- **MealPal login/signup page**
- **Fully styled UI** with rounded cards and buttons
- **Mobile-optimized layout** (375px width)

---

## 🧪 Testing MealPal

### **Test the Full Flow:**

1. **Sign Up:**
   - Tap "Sign Up" tab
   - Fill in: Name, Email, Password
   - Choose role (Student, Cafeteria Admin, or System Admin)
   - Tap "Create Account"

2. **Sign In:**
   - Enter your credentials
   - Tap "Sign In"
   - See the dashboard!

3. **Test Features:**
   - **Students:** Browse menu, track budget, view analytics
   - **Cafeteria Admins:** Manage menu, nutrition database
   - **System Admins:** User management, reports

### **Test Mobile Interactions:**

- ✅ Tap buttons (should have nice touch feedback)
- ✅ Scroll through menus
- ✅ Open modals/dialogs
- ✅ Test bottom navigation (on student/admin views)
- ✅ Try landscape mode (rotate emulator)

---

## 🎮 Emulator Controls

| Action | How To |
|--------|--------|
| **Rotate device** | Click rotate buttons on right panel |
| **Go back** | Click ◀️ back button |
| **Go home** | Click ⚪ home button |
| **Recent apps** | Click ▢ recent apps button |
| **Take screenshot** | Click 📷 camera icon on right |
| **Zoom in/out** | Ctrl + Mouse wheel |
| **Type on keyboard** | Click text field, use your keyboard |

---

## 🔧 Troubleshooting

### **"Site can't be reached" or "Connection refused"**

**Fix 1: Check if dev server is running**
```bash
# In VS Code terminal, you should see:
VITE v5.x.x  ready in xxx ms
➜  Local:   http://localhost:5174/

# If not, run:
npm run dev
```

**Fix 2: Verify you're using the correct URL**
- ✅ Use: `http://10.0.2.2:5174`
- ❌ NOT: `http://localhost:5174`

**Fix 3: Check Windows Firewall**
1. Open Windows Defender Firewall
2. Click "Allow an app through firewall"
3. Find "Node.js" and make sure both Private and Public are checked
4. If not there, click "Allow another app" and add Node.js

### **Emulator is very slow**

**Enable Hardware Acceleration:**
1. In Android Studio: **Tools** → **SDK Manager**
2. Go to **SDK Tools** tab
3. Check **"Intel x86 Emulator Accelerator (HAXM)"**
4. Click **Apply** and install

**Or use a lighter device:**
- Create new AVD with **Pixel 5** instead of Pixel 6
- Choose lower resolution

### **Can't type on the emulator**

Click **Tools** → **Show Keyboard** in the emulator controls

### **App looks plain (no styling)**

Make sure you did the CSS fix:
```bash
# Stop server (Ctrl+C)
rm -rf node_modules package-lock.json
npm install
npm run dev
```

---

## 🎯 Quick Commands Reference

```bash
# Start dev server
npm run dev

# Stop server
Ctrl + C

# Reinstall dependencies (if styling broken)
rm -rf node_modules package-lock.json
npm install
```

**Emulator URL:**
```
http://10.0.2.2:5174
```

---

## 💡 Pro Tips

### **1. Keep Emulator Running**
Once the emulator boots, keep it running! Closing and reopening takes time.

### **2. Use Chrome DevTools on Emulator**
- In emulator Chrome, tap **⋮ menu** → **Settings**
- Search for "Desktop site" to toggle desktop mode
- Or press F12 in VS Code to see console logs

### **3. Test Different Screen Sizes**
Create multiple AVDs:
- **Small phone:** Pixel 5 (1080x2340)
- **Medium phone:** Pixel 6 (1080x2400)
- **Large phone:** Pixel 7 Pro (1440x3120)

### **4. Keyboard Shortcuts**
- **Ctrl + M** - Toggle menu
- **Ctrl + K** - Toggle keyboard
- **Ctrl + H** - Home
- **Ctrl + Left/Right** - Rotate

### **5. Auto-Refresh**
Changes you make to code will auto-refresh in the emulator browser!

---

## 📊 Recommended Test Devices

| Device | Screen Size | Use Case |
|--------|-------------|----------|
| **Pixel 6** | 6.4" (1080x2400) | Standard testing ⭐ |
| **Pixel 7 Pro** | 6.7" (1440x3120) | Large screen testing |
| **Pixel 5** | 6.0" (1080x2340) | Small screen testing |

---

## 🎉 You're All Set!

**Standard Workflow:**

1. **Start emulator** (in Android Studio)
2. **Start dev server** (`npm run dev` in VS Code)
3. **Open** `http://10.0.2.2:5174` in emulator Chrome
4. **Test and develop!**

---

**Need help? Common issues:**
- ❓ Can't connect → Check firewall
- ❓ Slow emulator → Enable HAXM
- ❓ Plain styling → Reinstall dependencies
- ❓ Can't type → Enable on-screen keyboard

**Happy testing! 🚀**
