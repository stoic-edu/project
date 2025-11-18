# 🔧 Android Emulator Troubleshooting Guide

Comprehensive solutions for common Android emulator issues with MealPal.

---

## 🚫 Problem: "This site can't be reached"

### **Symptoms:**
- Chrome shows "This site can't be reached"
- "ERR_CONNECTION_REFUSED"
- Page doesn't load at all

### **Solutions:**

#### **Solution 1: Verify URL**
```
✅ USE THIS: http://10.0.2.2:5174
❌ NOT THIS: http://localhost:5174
❌ NOT THIS: http://127.0.0.1:5174
```

#### **Solution 2: Check Dev Server**
In VS Code terminal:
```bash
# You should see:
VITE v5.x.x  ready in xxx ms
➜  Local:   http://localhost:5174/

# If not running, start it:
npm run dev
```

#### **Solution 3: Firewall Settings**
1. Open **Windows Defender Firewall**
2. Click **"Allow an app or feature through Windows Defender Firewall"**
3. Click **"Change settings"** (may need admin)
4. Find **"Node.js"** in the list
5. Check BOTH **Private** and **Public** boxes
6. If Node.js not in list:
   - Click **"Allow another app..."**
   - Browse to: `C:\Program Files\nodejs\node.exe`
   - Add it and check both boxes
7. Click **OK**
8. Restart dev server

#### **Solution 4: Try Alternative Port**
```bash
# Use port 8080 instead
npm run dev -- --port 8080

# Then in emulator use:
http://10.0.2.2:8080
```

---

## 🎨 Problem: Plain White Page (No Styling)

### **Symptoms:**
- Page loads but looks unstyled
- No gradient background
- Plain HTML with no colors
- Buttons look like plain text

### **Solution: Reinstall Dependencies**

```bash
# Stop the dev server first (Ctrl+C)

# Delete old dependencies
rm -rf node_modules package-lock.json

# On Windows Git Bash, if above doesn't work:
rmdir /s /q node_modules
del package-lock.json

# Reinstall everything
npm install

# Start dev server
npm run dev
```

**Then refresh emulator browser (pull down from top to reload)**

---

## 🐌 Problem: Emulator is Very Slow

### **Symptoms:**
- Emulator takes minutes to start
- Android UI is laggy
- App is unresponsive

### **Solutions:**

#### **Solution 1: Enable Hardware Acceleration (HAXM)**

1. Open **Android Studio**
2. Go to **Tools** → **SDK Manager**
3. Click **"SDK Tools"** tab
4. Check **"Intel x86 Emulator Accelerator (HAXM installer)"**
5. Click **"Apply"**
6. Follow installation prompts
7. Restart computer
8. Delete and recreate your AVD

#### **Solution 2: Reduce Emulator Resources**

1. In Device Manager, click **⋮** next to your device
2. Click **"Edit"**
3. Click **"Show Advanced Settings"**
4. Reduce:
   - **RAM:** 2048 MB → 1024 MB
   - **VM heap:** 256 MB → 128 MB
5. Click **"Finish"**

#### **Solution 3: Use Lighter Device**

Create new AVD with:
- **Device:** Pixel 5 (instead of Pixel 6/7)
- **Resolution:** 1080x2340 (lower)
- **Android Version:** 11 or 12 (instead of 13/14)

#### **Solution 4: Disable Animations**

In emulator:
1. Open **Settings**
2. Go to **About phone**
3. Tap **"Build number"** 7 times (enables Developer options)
4. Go back to **Settings** → **System** → **Developer options**
5. Set these to **off**:
   - Window animation scale
   - Transition animation scale
   - Animator duration scale

---

## ⌨️ Problem: Can't Type in Input Fields

### **Symptoms:**
- Clicking input fields doesn't show keyboard
- Can't enter text

### **Solutions:**

#### **Solution 1: Enable Virtual Keyboard**
In emulator toolbar (right side):
- Click **⋮ More** (three dots)
- Click **"Settings"**
- Check **"Show virtual keyboard"**

#### **Solution 2: Use Physical Keyboard**
- Click any input field
- Just start typing on your computer keyboard
- Text should appear

---

## 📱 Problem: Emulator Won't Start

### **Symptoms:**
- Clicking play button does nothing
- Emulator crashes on startup
- "Unable to start AVD" error

### **Solutions:**

#### **Solution 1: Cold Boot**
1. In Device Manager, click **▼** next to play button
2. Select **"Cold Boot Now"**
3. Wait for full restart

#### **Solution 2: Delete and Recreate AVD**
1. Click **⋮** next to device
2. Click **"Delete"**
3. Create new device from scratch

#### **Solution 3: Check Disk Space**
- Emulator needs 10GB+ free space
- Check your C: drive has enough space

#### **Solution 4: Update Android Studio**
- **Help** → **Check for Updates**
- Install any available updates

---

## 🔄 Problem: Changes Don't Appear

### **Symptoms:**
- Made code changes but emulator still shows old version
- Edits not reflected

### **Solutions:**

#### **Solution 1: Hard Refresh**
In emulator Chrome:
1. Tap **⋮** menu
2. Tap **Settings**
3. Tap **Privacy and security**
4. Tap **Clear browsing data**
5. Select **"Cached images and files"**
6. Tap **"Clear data"**
7. Go back and reload page

#### **Solution 2: Restart Dev Server**
```bash
# In terminal, press:
Ctrl + C

# Then restart:
npm run dev
```

#### **Solution 3: Clear Vite Cache**
```bash
rm -rf node_modules/.vite
npm run dev
```

---

## 🖼️ Problem: Black Screen in Emulator

### **Symptoms:**
- Emulator shows but screen is black
- No Android UI visible

### **Solutions:**

#### **Solution 1: Change Graphics Mode**
1. Device Manager → **⋮** → **Edit**
2. **Show Advanced Settings**
3. Under **Emulated Performance**:
   - Try **"Hardware - GLES 2.0"**
   - Or try **"Software - GLES 2.0"**
4. Save and restart emulator

#### **Solution 2: Increase Graphics Memory**
1. Same settings as above
2. Increase **Graphics** to **"Automatic"** or higher

---

## 🌐 Problem: Network/API Calls Failing

### **Symptoms:**
- Can't sign up/sign in
- "Network error" messages
- API timeouts

### **Solutions:**

#### **Solution 1: Check Supabase Connection**
1. Open browser DevTools in emulator:
   - Tap **⋮** → **More tools** → **Developer tools**
2. Check **Console** tab for errors
3. Look for Supabase/auth errors

#### **Solution 2: Verify Supabase Credentials**
Check `/utils/supabase/info.tsx` has correct:
- Project ID
- Anon Key
- Project URL

#### **Solution 3: Test in Regular Browser First**
1. Open `http://localhost:5174` in your PC browser
2. Try sign up/sign in there
3. If it works on PC but not emulator, it's a network config issue

---

## 🔌 Problem: Port Already in Use

### **Symptoms:**
```
Error: listen EACCES: permission denied ::1:5174
```

### **Solutions:**

#### **Solution 1: Kill Process on Port**
```bash
# Find what's using port 5174
netstat -ano | findstr :5174

# Note the PID number, then:
taskkill /PID <PID> /F

# Example:
taskkill /PID 12345 /F
```

#### **Solution 2: Use Different Port**
```bash
npm run dev -- --port 8080

# Then use in emulator:
http://10.0.2.2:8080
```

---

## 🎯 Problem: Touch Targets Too Small

### **Symptoms:**
- Buttons are tiny and hard to tap
- Have to tap multiple times

### **Solution:**
This shouldn't happen with MealPal - it's mobile-optimized. But if it does:

1. Check if you're viewing desktop version:
   - In Chrome: **⋮** → Uncheck **"Desktop site"**

2. Zoom in temporarily:
   - Pinch to zoom on screen
   - Double-tap elements

---

## 📊 Problem: AVD List is Empty

### **Symptoms:**
- Device Manager shows no devices
- "No devices" message

### **Solution:**
Create your first device:
1. Click **"Create Device"**
2. Select **Pixel 6**
3. Download system image
4. Complete creation

---

## 🔍 Diagnostic Checklist

Run through this if nothing else works:

```bash
# 1. Check Node.js version
node --version
# Should be v16 or higher

# 2. Check npm version  
npm --version
# Should be 8 or higher

# 3. Check for errors in package.json
npm install
# Should complete without errors

# 4. Test on different port
npm run dev -- --port 3000

# 5. Check Windows hosts file isn't blocking
# File: C:\Windows\System32\drivers\etc\hosts
# Should not have entries blocking localhost
```

---

## 🆘 Last Resort Solutions

If NOTHING works:

### **1. Complete Reset**
```bash
# Delete everything and start fresh
rm -rf node_modules package-lock.json
npm cache clean --force
npm install
npm run dev
```

### **2. Reinstall Android Studio**
1. Uninstall Android Studio
2. Delete: `C:\Users\<YourName>\AppData\Local\Android`
3. Delete: `C:\Users\<YourName>\.android`
4. Reinstall from scratch

### **3. Use Browser DevTools Device Mode**
As temporary alternative:
1. Open `http://localhost:5174` in Chrome
2. Press `F12`
3. Press `Ctrl + Shift + M`
4. Select mobile device from dropdown
5. Not same as real emulator but works for testing

---

## 📞 Get Help

**Still stuck? Check:**

1. **Console logs** - Both in VS Code terminal AND emulator Chrome DevTools
2. **Network tab** - In emulator DevTools to see failed requests
3. **ANDROID_EMULATOR_SETUP.md** - Full setup guide
4. **EMULATOR_CHECKLIST.md** - Verification checklist

---

## ✅ Verification

You've fixed it when:

- ✅ Emulator loads in under 60 seconds
- ✅ `http://10.0.2.2:5174` loads MealPal
- ✅ Full styling appears (orange gradient)
- ✅ Can interact with buttons
- ✅ Can sign up/sign in
- ✅ Dashboard loads properly

---

**Most issues are solved by: using `10.0.2.2`, checking firewall, or reinstalling dependencies! 🚀**
