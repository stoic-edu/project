# MealPal - Cafeteria Management System

> **📱 Mobile-Only Application** - Designed exclusively for Android phones (max-width: 480px)

A mobile-only cafeteria management system built with React, TypeScript, Tailwind CSS, and Supabase, optimized for Android devices.

## Features

- **Student Dashboard**: Menu browsing, budget tracking, transaction history, and analytics
- **Cafeteria Admin Dashboard**: Menu management and nutrition database
- **System Admin Dashboard**: User management and comprehensive reporting
- **Smart Features**: 
  - Budget-aware meal recommendations
  - Healthy meal suggestions based on nutritional value
  - Real-time budget tracking
  - Mobile-only design (optimized for phones up to 480px width)

## Tech Stack

- **Frontend**: React 18, TypeScript, Tailwind CSS v4
- **Backend**: Supabase (Auth, Database, Edge Functions)
- **UI Components**: Radix UI, shadcn/ui
- **Charts**: Recharts
- **Build Tool**: Vite

## Prerequisites

Before you begin, ensure you have the following installed:
- **Node.js** (v18 or higher) - [Download here](https://nodejs.org/)
- **npm** or **yarn** package manager (comes with Node.js)
- **Visual Studio Code** - [Download here](https://code.visualstudio.com/)
- **Git** (optional) - [Download here](https://git-scm.com/)

## Local Setup Instructions

### 1. Open Project in VS Code

1. Download or clone this project to your computer
2. Open Visual Studio Code
3. Click **File** → **Open Folder**
4. Select the MealPal project folder

### 2. Install Dependencies

Open the integrated terminal in VS Code (**Terminal** → **New Terminal** or press `` Ctrl + ` ``) and run:

```bash
npm install
```

This will install all required packages. It may take a few minutes.

### 3. Configure Environment Variables (Optional)

The project already has Supabase credentials configured in `/utils/supabase/info.tsx`. 

If you want to use your own Supabase project:

1. Copy `.env.example` to `.env`:
   ```bash
   cp .env.example .env
   ```

2. Update the `.env` file with your Supabase credentials:
   ```
   VITE_SUPABASE_PROJECT_ID=your-project-id
   VITE_SUPABASE_ANON_KEY=your-anon-key
   ```

3. Update `/utils/supabase/info.tsx` to read from environment variables

### 4. Start Development Server

Run the development server:

```bash
npm run dev
```

The application will automatically open in your default browser at `http://localhost:5174`

You'll also see the Android Emulator URL in the terminal:
```
📱 Android Emulator URL:
➜  Emulator: http://10.0.2.2:5174
   (Use this URL in your Android Studio emulator)
```

### 5. Access the Application

The app will open automatically. If not, navigate to:

**On your computer:**
```
http://localhost:5174
```

**In Android emulator:**
```
http://10.0.2.2:5174
```

## Default Test Accounts

You can create new accounts using the Sign Up page with these roles:
- **Student** - Access to menu, budget tracking, and analytics
- **Cafeteria Admin** - Manage menus and nutrition database
- **System Admin** - User management and system reports

## Project Structure

```
mealpal/
├── components/           # React components
│   ├── admin/           # System admin components
│   ├── cafeteria/       # Cafeteria admin components
│   ├── student/         # Student dashboard components
│   └── ui/              # Reusable UI components (shadcn/ui)
├── styles/              # Global CSS styles
├── utils/               # Utility functions
│   └── supabase/        # Supabase client configuration
├── App.tsx              # Main application component
├── main.tsx             # Application entry point
└── index.html           # HTML template
```

## Available Scripts

### Development
```bash
npm run dev              # Start development server
npm run dev:emulator     # Same as dev (optimized for Android emulator)
```

### Build
```bash
npm run build            # Build for production
npm run preview          # Preview production build
```

### Lint
```bash
npm run lint             # Run ESLint
```

## 📱 Mobile Testing

MealPal is a **mobile-only application** designed for Android devices (max-width: 480px).

### **Android Studio Emulator (Recommended)**
The best way to test MealPal on a realistic mobile device!

**📱 Quick Start:**
1. Install Android Studio
2. Create Pixel 6 virtual device
3. Run `npm run dev`
4. Open `http://10.0.2.2:5174` in emulator

**📖 Complete Guides:**
- **[START_HERE.md](./START_HERE.md)** - Begin here!
- **[ANDROID_EMULATOR_SETUP.md](./ANDROID_EMULATOR_SETUP.md)** - Full setup instructions
- **[EMULATOR_QUICK_START.md](./EMULATOR_QUICK_START.md)** - Quick reference
- **[EMULATOR_CHECKLIST.md](./EMULATOR_CHECKLIST.md)** - Testing checklist
- **[EMULATOR_TROUBLESHOOTING.md](./EMULATOR_TROUBLESHOOTING.md)** - Fix common issues
- **[DOCUMENTATION_INDEX.md](./DOCUMENTATION_INDEX.md)** - All documentation

### **Alternative: Browser DevTools**
For quick testing without emulator:
1. Open the app: `http://localhost:5174`
2. Press `F12` to open DevTools
3. Press `Ctrl+Shift+M` to toggle device mode
4. Select a mobile device (e.g., Pixel 5)

## Features Overview

### For Students
- 📱 Browse daily cafeteria menus
- 💰 Track spending against daily budget
- 🥗 Get healthy meal recommendations
- 📊 View spending analytics and nutrition insights
- ⚠️ Budget warnings and notifications

### For Cafeteria Admins
- 🍽️ Create and manage daily menus
- 📝 Add nutritional information for meals
- 💵 Set pricing for menu items
- 📅 Schedule menus by date

### For System Admins
- 👥 Manage user accounts and roles
- 📈 View comprehensive reports
- 📊 Monitor system-wide analytics
- 🔐 User authentication management

## Troubleshooting

### Port Already in Use
If port 5174 is already in use, you can specify a different port:
```bash
npm run dev -- --port 8080

# Then use in emulator:
http://10.0.2.2:8080
```

### Dependencies Installation Issues
If you encounter issues installing dependencies:
1. Delete `node_modules` folder and `package-lock.json`
2. Run `npm cache clean --force`
3. Run `npm install` again

### Build Errors
If you get TypeScript errors:
```bash
npm run build -- --mode development
```

### Supabase Connection Issues
- Check your internet connection
- Verify Supabase credentials in `/utils/supabase/info.tsx`
- Check Supabase project status at https://supabase.com

## Browser Compatibility

**Mobile Testing:**
- Android Chrome (recommended for emulator)
- Chrome DevTools Device Mode (for development)

**Note:** MealPal is a mobile-only application optimized for phone screens (max 480px width).

## Development Tips

1. **Hot Reload**: The dev server supports hot module replacement - changes appear instantly
2. **Mobile Testing**: Use Android Studio emulator or Chrome DevTools (F12) → Toggle Device Toolbar (Ctrl+Shift+M)
3. **Console**: Keep the browser console open (F12) to see any errors or warnings
4. **Max Width**: App is constrained to 480px width for optimal mobile experience

## VS Code Recommended Extensions

For the best development experience, install these VS Code extensions:

1. **ES7+ React/Redux/React-Native snippets** - Shorthand code snippets
2. **Tailwind CSS IntelliSense** - Autocomplete for Tailwind classes
3. **ESLint** - JavaScript/TypeScript linting
4. **Prettier** - Code formatting
5. **TypeScript Vue Plugin (Volar)** - Better TypeScript support

To install:
1. Click the Extensions icon in VS Code (or press `Ctrl+Shift+X`)
2. Search for each extension name
3. Click **Install**

## Need Help?

- Check the [Supabase Documentation](https://supabase.com/docs)
- Check the [Vite Documentation](https://vitejs.dev/)
- Check the [React Documentation](https://react.dev/)

## License

This project is for educational purposes.

---

**Happy Coding! 🎉**
