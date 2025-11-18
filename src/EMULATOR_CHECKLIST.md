# ✅ Android Emulator Setup Checklist

Use this checklist to ensure everything is set up correctly.

---

## 📋 One-Time Setup

### **Android Studio Installation**
- [ ] Downloaded Android Studio from https://developer.android.com/studio
- [ ] Installed with default settings
- [ ] Included "Android Virtual Device" during install

### **Create Virtual Device**
- [ ] Opened Android Studio
- [ ] Went to **Tools** → **Device Manager**
- [ ] Clicked **"Create Device"**
- [ ] Selected **Pixel 6** (or similar)
- [ ] Downloaded Android 13 (Tiramisu) system image
- [ ] Completed device creation

### **MealPal Dependencies**
- [ ] Ran `rm -rf node_modules package-lock.json`
- [ ] Ran `npm install`
- [ ] No errors during installation

---

## 🚀 Daily Testing Workflow

### **Every Time You Test**
- [ ] **Step 1:** Start Android emulator in Android Studio
  - Device Manager → Click ▶️ Play
  - Wait for Android to fully boot (~30-60 seconds)

- [ ] **Step 2:** Start dev server in VS Code terminal
  ```bash
  npm run dev
  ```
  - Wait for "ready in X ms" message
  - See the emulator URL displayed

- [ ] **Step 3:** Open Chrome in emulator
  - Type: `http://10.0.2.2:5174`
  - Press Enter

- [ ] **Step 4:** Verify MealPal loads
  - See orange/amber gradient
  - See styled login page
  - No plain white page

---

## 🧪 Testing Checklist

### **Authentication Flow**
- [ ] Can see Sign Up and Sign In tabs
- [ ] Can create new account (all three roles)
- [ ] Can sign in with created account
- [ ] See appropriate dashboard after login

### **Student Dashboard**
- [ ] Bottom navigation visible
- [ ] Can switch between tabs (Menu, Budget, Analytics, Profile)
- [ ] Menu items display correctly
- [ ] Can select meal items
- [ ] Budget tracker shows data
- [ ] Charts render properly

### **Cafeteria Admin Dashboard**
- [ ] Bottom navigation visible
- [ ] Can switch between Menu Management and Nutrition tabs
- [ ] Can add/edit menu items
- [ ] Can manage nutrition database
- [ ] Forms work correctly

### **System Admin Dashboard**
- [ ] Bottom navigation visible
- [ ] User management table displays
- [ ] Can view reports
- [ ] Charts and analytics visible

### **Mobile Experience**
- [ ] Touch targets are large enough (not tiny)
- [ ] Buttons have tap feedback
- [ ] Scrolling is smooth
- [ ] No horizontal overflow
- [ ] Text is readable
- [ ] Modals/dialogs work on mobile

### **Performance**
- [ ] Page loads within 3 seconds
- [ ] No lag when tapping buttons
- [ ] Smooth animations
- [ ] No console errors (check Chrome DevTools)

---

## 🔍 Verification Points

### **URL Check**
```
✅ Correct: http://10.0.2.2:5174
❌ Wrong:   http://localhost:5174
❌ Wrong:   http://127.0.0.1:5174
```

### **Port Check**
```bash
# In terminal, you should see:
➜  Local:   http://localhost:5174/
➜  Network: http://192.168.x.x:5174/
➜  Emulator: http://10.0.2.2:5174
```

### **Styling Check**
```
✅ Orange/amber gradient background
✅ White rounded cards
✅ Colored buttons with shadows
✅ Proper spacing and layout

❌ Plain white page
❌ Unstyled HTML
❌ No colors
```

---

## 🐛 Common Issues

| Issue | Solution |
|-------|----------|
| **Can't connect** | Check firewall allows Node.js |
| **Plain styling** | Reinstall: `rm -rf node_modules package-lock.json && npm install` |
| **Slow emulator** | Enable HAXM in SDK Manager |
| **Server won't start** | Try different port: `npm run dev -- --port 8080` |
| **Wrong URL** | Use `10.0.2.2` not `localhost` |

---

## 📊 Test Device Configurations

Recommended test on these emulator configs:

- [ ] **Pixel 6** - 1080x2400 (Standard)
- [ ] **Portrait mode** - Most common
- [ ] **Landscape mode** - Check responsiveness
- [ ] **Different Android versions** - Test Android 12, 13, 14

---

## 💾 Save These URLs

**For quick access:**

- **Dev server:** http://localhost:5174
- **Emulator:** http://10.0.2.2:5174
- **Android Studio:** `%LocalAppData%\Android\Sdk` (Windows SDK location)

---

## 📝 Notes

**Important reminders:**

1. Keep emulator running - don't close it between tests
2. Keep terminal with `npm run dev` running
3. Changes auto-refresh in emulator
4. Use Chrome browser in emulator (not default browser)
5. `10.0.2.2` is Android's special IP for host machine's localhost

---

## ✨ Success Criteria

You're ready to develop when:

- ✅ Emulator boots in under 60 seconds
- ✅ Dev server starts without errors
- ✅ MealPal loads with full styling
- ✅ Can sign up and sign in
- ✅ Dashboard functions properly
- ✅ No console errors

---

**Happy testing! 📱✨**
