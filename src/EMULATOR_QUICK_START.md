# 🚀 Android Emulator - Quick Start

## ⚡ 3-Step Quick Start

### **1️⃣ Start Emulator**
- Open **Android Studio**
- **Tools** → **Device Manager**
- Click **▶️ Play** on your device

### **2️⃣ Start Dev Server**
```bash
npm run dev
```

### **3️⃣ Open in Emulator**
In emulator Chrome browser, go to:
```
http://10.0.2.2:5174
```

---

## 📝 Quick Reference

| What | How |
|------|-----|
| **Emulator URL** | `http://10.0.2.2:5174` |
| **Start server** | `npm run dev` |
| **Stop server** | `Ctrl + C` |
| **Rotate device** | Click rotate buttons |
| **Go back** | ◀️ back button |
| **Screenshot** | 📷 camera icon |

---

## 🔧 Quick Fixes

**Can't connect?**
```
✅ Use: http://10.0.2.2:5174
❌ NOT: http://localhost:5174
```

**No styling?**
```bash
rm -rf node_modules package-lock.json
npm install
npm run dev
```

**Firewall blocking?**
- Windows Firewall → Allow Node.js

---

## 📖 Full Guide

See **ANDROID_EMULATOR_SETUP.md** for detailed instructions.
