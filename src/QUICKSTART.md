# Quick Start Guide - MealPal

## For Complete Beginners

This guide will help you run MealPal on your computer in just 5 simple steps!

---

## Step 1: Install Node.js

1. Go to https://nodejs.org/
2. Download the **LTS** version (the green button)
3. Run the installer
4. Click "Next" through all the steps
5. Restart your computer

**To verify installation:**
- Open Command Prompt (Windows) or Terminal (Mac)
- Type: `node --version`
- You should see something like `v18.x.x`

---

## Step 2: Install Visual Studio Code

1. Go to https://code.visualstudio.com/
2. Download VS Code for your operating system
3. Run the installer
4. Open VS Code after installation

---

## Step 3: Open the Project

1. Download the MealPal project folder to your computer
2. In VS Code, click **File** → **Open Folder**
3. Navigate to and select the MealPal folder
4. Click **Select Folder**

---

## Step 4: Install Project Dependencies

1. In VS Code, open the Terminal:
   - Click **Terminal** → **New Terminal** (at the top menu)
   - Or press `` Ctrl + ` `` (backtick key, usually below Esc)

2. Type this command and press Enter:
   ```bash
   npm install
   ```

3. Wait for it to finish (this may take 2-5 minutes)
   - You'll see lots of text scrolling by - this is normal!
   - When it's done, you'll see a new `node_modules` folder

---

## Step 5: Start the Application

**Choose one option:**

### **Option A: Standard Mode**
1. In the same Terminal, type:
   ```bash
   npm run dev
   ```

### **Option B: Dual View Mode (See Mobile + Desktop)**
1. In the same Terminal, type:
   ```bash
   npm run dev:dual
   ```

2. Wait a few seconds

3. Your browser will automatically open to `http://localhost:3000`

4. You should see the MealPal login page! 🎉

**Dual View Mode:** Shows mobile and desktop side-by-side so you can see how the app looks on both!

---

## Using the Application

### Create Your First Account

1. Click **Sign Up** tab
2. Fill in:
   - **Full Name**: Your name
   - **Email**: Any email (e.g., student@test.com)
   - **Password**: Any password you'll remember
   - **Role**: Choose Student, Cafeteria Admin, or System Admin
3. Click **Create Account**
4. Now click **Sign In** tab and log in with your credentials

### What You Can Do

**As a Student:**
- Browse cafeteria menus
- Set a daily budget
- Track your spending
- Get healthy meal recommendations

**As a Cafeteria Admin:**
- Create daily menus
- Add menu items with prices
- Manage nutrition information

**As a System Admin:**
- Manage user accounts
- View system reports
- Monitor all activity

---

## Common Issues & Solutions

### ❌ "npm is not recognized"
**Solution:** Node.js wasn't installed correctly
1. Reinstall Node.js from https://nodejs.org/
2. Restart your computer
3. Try again

### ❌ "Port 3000 is already in use"
**Solution:** Another program is using port 3000
1. Stop the terminal (press `Ctrl + C`)
2. Run: `npm run dev -- --port 3001`
3. Open browser to `http://localhost:3001`

### ❌ Browser doesn't open automatically
**Solution:** Manually open your browser
- Go to: `http://localhost:3000`

### ❌ "Cannot find module" errors
**Solution:** Dependencies didn't install correctly
1. Delete the `node_modules` folder
2. Run `npm install` again

---

## Stopping the Application

To stop the development server:
1. Go to the Terminal in VS Code
2. Press `Ctrl + C`
3. Type `y` and press Enter if asked

---

## Restarting the Application

To run it again later:
1. Open VS Code
2. Open the MealPal folder
3. Open Terminal
4. Type: `npm run dev`
5. Browser will open automatically

---

## Tips for Beginners

### 💡 The Terminal is Your Friend
- It shows helpful error messages
- Keep it open while the app is running
- Don't close it or your app will stop

### 💡 Saving Changes
- Any changes you make to code files will automatically update
- Just save the file (`Ctrl + S`) and refresh your browser
- No need to restart the server!

### 💡 Browser Developer Tools
- Press `F12` in your browser to see the console
- This shows any errors or messages
- Very helpful for debugging!

### 💡 Mobile View Testing (3 Easy Ways!)

**Way 1: Dual View Mode (Easiest!)**
- Run: `npm run dev:dual`
- See mobile and desktop side-by-side automatically!

**Way 2: Browser DevTools**
1. Press `F12` in Chrome/Edge
2. Click the phone icon (or press `Ctrl + Shift + M`)
3. Select a mobile device from dropdown

**Way 3: Your Real Phone**
1. Run: `npm run dev:mobile`
2. Find your computer's IP address
3. On your phone, open browser and go to: `http://YOUR_IP:3000`

For detailed mobile testing (including Android Studio), see `MOBILE_SETUP.md`

---

## Next Steps

Once you're comfortable:
1. Read the full `README.md` for detailed information
2. Explore the code in the `components` folder
3. Try modifying some text or colors
4. Check out the Supabase dashboard for backend data

---

## Getting Help

**Check these first:**
- Make sure Node.js is installed: `node --version`
- Make sure you ran `npm install`
- Make sure you're in the right folder
- Check for error messages in the Terminal

**Still stuck?**
- Read the error message carefully
- Google the error message
- Check the troubleshooting section in README.md

---

**You're ready to go! Happy coding! 🚀**
