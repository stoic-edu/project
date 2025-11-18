# MealPal Setup Checklist

Use this checklist to ensure everything is set up correctly.

## ✅ Pre-Setup Checklist

- [ ] Node.js installed (v18+)
  - Run: `node --version`
  - Should show: v18.x.x or higher
  
- [ ] npm installed
  - Run: `npm --version`
  - Should show: 9.x.x or higher

- [ ] Visual Studio Code installed
  - Open VS Code successfully

## ✅ Project Setup Checklist

- [ ] Project folder opened in VS Code
  - File → Open Folder → Select MealPal folder

- [ ] Terminal opened
  - Terminal → New Terminal (or Ctrl + `)

- [ ] Dependencies installed
  - Run: `npm install`
  - Wait for completion (no errors)
  - `node_modules` folder created

- [ ] Development server started
  - Run: `npm run dev`
  - No error messages in terminal
  - Browser opens automatically

- [ ] Application loads
  - Browser shows MealPal login page
  - No error messages in browser console (F12)

## ✅ Functionality Test

- [ ] Create an account
  - Sign Up → Fill form → Create Account
  - Should show success message

- [ ] Sign in
  - Sign In → Enter credentials → Sign In
  - Should load dashboard

- [ ] Test navigation
  - Click different tabs/menu items
  - All pages load without errors

## 🎉 Setup Complete!

If all checkboxes are marked, your setup is successful!

---

## 🔧 Troubleshooting Commands

If something goes wrong, try these in order:

### 1. Clean Install
```bash
# Stop the server (Ctrl+C)
rm -rf node_modules package-lock.json
npm install
npm run dev
```

### 2. Clear Cache
```bash
npm cache clean --force
npm install
```

### 3. Check for Port Conflicts
```bash
# Use a different port
npm run dev -- --port 3001
```

### 4. Verify Node Installation
```bash
node --version
npm --version
```

---

## 📝 Quick Reference Commands

| Command | Purpose |
|---------|---------|
| `npm install` | Install dependencies |
| `npm run dev` | Start development server |
| `npm run build` | Build for production |
| `npm run preview` | Preview production build |
| `Ctrl + C` | Stop the server |
| `F12` | Open browser dev tools |

---

## 🎯 Next Steps After Setup

1. **Explore the Code**
   - Check out `/components` folder
   - Look at `App.tsx` (main app file)
   - Explore UI components in `/components/ui`

2. **Read Documentation**
   - `README.md` - Full documentation
   - `QUICKSTART.md` - Beginner guide
   - `guidelines/Guidelines.md` - Development guidelines

3. **Try Making Changes**
   - Change text in `AuthPage.tsx`
   - Modify colors in `styles/globals.css`
   - Add new features!

4. **Learn the Tech Stack**
   - React: https://react.dev/
   - TypeScript: https://www.typescriptlang.org/
   - Tailwind CSS: https://tailwindcss.com/
   - Supabase: https://supabase.com/docs

---

**Happy Developing! 🚀**
