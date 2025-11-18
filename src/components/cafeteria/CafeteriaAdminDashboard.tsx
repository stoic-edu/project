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
      {/* Mobile Header */}
      <header className="bg-white shadow-sm border-b sticky top-0 z-10">
        <div className="px-4 py-3">
          <div className="flex items-center justify-between">
            <div className="flex items-center gap-3">
              <div className="bg-orange-500 p-2 rounded-lg">
                <UtensilsCrossed className="w-5 h-5 text-white" />
              </div>
              <div>
                <h1 className="text-lg text-orange-600">MealPal</h1>
                <p className="text-xs text-gray-500">Cafeteria Admin</p>
              </div>
            </div>
            <Sheet>
              <SheetTrigger asChild>
                <Button variant="ghost" size="sm" className="md:hidden">
                  <MenuIcon className="w-5 h-5" />
                </Button>
              </SheetTrigger>
              <SheetContent>
                <div className="mt-8 space-y-4">
                  <div className="p-4 bg-gray-50 rounded-lg">
                    <p className="text-sm text-gray-600">Signed in as</p>
                    <p className="font-medium">{profile.name}</p>
                    <p className="text-sm text-gray-500">{profile.email}</p>
                  </div>
                  <Button 
                    onClick={onSignOut}
                    variant="outline"
                    className="w-full gap-2"
                  >
                    <LogOut className="w-4 h-4" />
                    Sign Out
                  </Button>
                </div>
              </SheetContent>
            </Sheet>
            <Button 
              variant="ghost" 
              size="sm"
              onClick={onSignOut}
              className="hidden md:flex gap-2"
            >
              <LogOut className="w-4 h-4" />
              Sign Out
            </Button>
          </div>
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

      {/* Mobile Bottom Navigation */}
      <nav className="fixed bottom-0 left-0 right-0 bg-white border-t shadow-lg md:hidden z-20">
        <div className="grid grid-cols-4">
          {navItems.map((item) => {
            const Icon = item.icon;
            const isActive = activeTab === item.id;
            return (
              <button
                key={item.id}
                onClick={() => setActiveTab(item.id)}
                className={`flex flex-col items-center gap-1 py-3 px-2 transition-colors ${
                  isActive 
                    ? 'text-orange-600 bg-orange-50' 
                    : 'text-gray-600 hover:text-orange-500'
                }`}
              >
                <Icon className="w-5 h-5" />
                <span className="text-xs">{item.label}</span>
              </button>
            );
          })}
        </div>
      </nav>
    </div>
  );
}