import { useState } from 'react';
import { UtensilsCrossed, Database, User, LogOut, BarChart3, Menu as MenuIcon } from 'lucide-react';
import { Button } from '../ui/button';
import { Sheet, SheetContent, SheetTrigger } from '../ui/sheet';
import { MenuManagementTab } from './MenuManagementTab';
import { NutritionDatabaseTab } from './NutritionDatabaseTab';
import { CafeteriaAnalyticsTab } from './CafeteriaAnalyticsTab';
import { ProfileTab } from '../student/ProfileTab';

interface CafeteriaAdminDashboardProps {
  user: any;
  profile: any;
  accessToken: string;
  onSignOut: () => void;
}

export function CafeteriaAdminDashboard({ user, profile, accessToken, onSignOut }: CafeteriaAdminDashboardProps) {
  const [activeTab, setActiveTab] = useState('menu');

  const navItems = [
    { id: 'menu', label: 'Menu', icon: UtensilsCrossed },
    { id: 'nutrition', label: 'Nutrition', icon: Database },
    { id: 'analytics', label: 'Analytics', icon: BarChart3 },
    { id: 'profile', label: 'Profile', icon: User },
  ];

  return (
    <div className="min-h-screen flex flex-col">
      {/* Desktop & Mobile Tab Navigation - always visible at top */}
      <nav className="w-full bg-white border-b shadow-sm sticky top-0 z-20">
        <div className="max-w-7xl mx-auto px-4 flex gap-2 overflow-x-auto py-2">
          {navItems.map((item) => {
            const Icon = item.icon;
            const isActive = activeTab === item.id;
            return (
              <button
                key={item.id}
                onClick={() => setActiveTab(item.id)}
                className={`flex items-center gap-2 px-4 py-2 rounded-lg transition-colors text-sm font-medium focus:outline-none focus:ring-2 focus:ring-orange-300 ${
                  isActive
                    ? 'bg-orange-600 text-white shadow font-semibold'
                    : 'bg-gray-100 text-gray-700 hover:bg-orange-50 hover:text-orange-600'
                }`}
                style={{ outline: 'none' }}
              >
                <Icon className="w-5 h-5" />
                <span>{item.label}</span>
              </button>
            );
          })}
        </div>
      </nav>

      {/* Header (branding, sign out) */}
      <header className="bg-white shadow-sm border-b">
        <div className="px-4 py-3 flex items-center justify-between max-w-7xl mx-auto">
          <div className="flex items-center gap-3">
            <div className="bg-orange-500 p-2 rounded-lg">
              <UtensilsCrossed className="w-5 h-5 text-white" />
            </div>
            <div>
              <h1 className="text-lg text-orange-600">MealPal</h1>
              <p className="text-xs text-gray-500">Cafeteria Admin</p>
            </div>
          </div>
          <Button 
            variant="ghost" 
            size="sm"
            onClick={onSignOut}
            className="gap-2"
          >
            <LogOut className="w-4 h-4" />
            Sign Out
          </Button>
        </div>
      </header>

      {/* Main Content */}
      <main className="flex-1 overflow-auto">
        <div className="max-w-7xl mx-auto px-4 py-4 md:py-8">
          {activeTab === 'menu' && <MenuManagementTab accessToken={accessToken} />}
          {activeTab === 'nutrition' && <NutritionDatabaseTab accessToken={accessToken} />}
          {activeTab === 'analytics' && <CafeteriaAnalyticsTab accessToken={accessToken} />}
          {activeTab === 'profile' && <ProfileTab profile={profile} accessToken={accessToken} />}
        </div>
      </main>
    </div>
  );
}