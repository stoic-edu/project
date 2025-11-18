# 📱 MealPal + Android Emulator - Quick Reference Card

**Print this or keep it handy!**

---

## ⚡ Quick Start (3 Steps)

```
1. Start Emulator → Android Studio → Device Manager → ▶️ Play
2. Start Server   → npm run dev
3. Open Browser   → http://10.0.2.2:5174
```

---

## 🔗 Important URLs

| Location | URL |
|----------|-----|
| **Your computer** | `http://localhost:5174` |
| **Android emulator** | `http://10.0.2.2:5174` |
| **Different port example** | `http://10.0.2.2:8080` |

---

## 💻 Commands

```bash
# Start dev server
npm run dev

# Stop server
Ctrl + C

# Fix styling issues
rm -rf node_modules package-lock.json
npm install

# Use different port
npm run dev -- --port 8080

# Clear Vite cache
rm -rf node_modules/.vite
```

---

## 🔧 Common Fixes

| Problem | Solution |
|---------|----------|
| **Can't connect** | Use `10.0.2.2` not `localhost` |
| **Plain styling** | Reinstall dependencies |
| **Port blocked** | Check Windows Firewall |
| **Slow emulator** | Enable HAXM in SDK Manager |

---

## 📁 Quick File Locations

```
Config:          /vite.config.ts
Styles:          /styles/globals.css
Main app:        /App.tsx
Supabase info:   /utils/supabase/info.tsx
```

---

## 📖 Documentation Files

```
📱 ANDROID_EMULATOR_SETUP.md     - Full setup guide
🚀 EMULATOR_QUICK_START.md        - Quick start only
✅ EMULATOR_CHECKLIST.md          - Testing checklist
🔧 EMULATOR_TROUBLESHOOTING.md   - Fix issues
📖 README.md                      - General docs
```

---

## 🎯 Test Account Roles

When signing up, choose:
- **Student** - Menu browsing, budget tracking
- **Cafeteria Admin** - Menu management
- **System Admin** - User management, reports

---

## ⌨️ Emulator Shortcuts

```
Rotate device:    Click rotate buttons on toolbar
Go back:          ◀️ back button
Home:             ⚪ home button
Screenshot:       📷 camera icon
More options:     ⋮ three dots
```

---

## ✅ Success Checklist

- [ ] Emulator boots in <60 seconds
- [ ] Dev server shows "ready" message
- [ ] MealPal has orange gradient background
- [ ] Can sign up and sign in
- [ ] Dashboard loads properly

---

## 🆘 Emergency Reset

If everything breaks:

```bash
# Stop server
Ctrl + C

# Nuclear option
rm -rf node_modules package-lock.json
npm cache clean --force
npm install

# Restart
npm run dev
```

---

**Remember: `10.0.2.2` is the magic IP for emulator!** 🎯
