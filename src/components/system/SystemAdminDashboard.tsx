import { useState } from 'react';
import { Button } from '../ui/button';
import { LogOut, Utensils, Users, BarChart3, User, Menu } from 'lucide-react';
import { Sheet, SheetContent, SheetTrigger } from '../ui/sheet';
import { UserManagementTab } from '../admin/UserManagementTab';
import { ReportsTab } from '../admin/ReportsTab';
import { ProfileTab } from '../student/ProfileTab';

interface SystemAdminDashboardProps {
  user: any;
  profile: any;
  accessToken: string;
  onSignOut: () => void;
}

export function SystemAdminDashboard({ user, profile, accessToken, onSignOut }: SystemAdminDashboardProps) {

  const [activeTab, setActiveTab] = useState('users');

  const navItems = [
    { id: 'users', label: 'Users', icon: Users },
    { id: 'reports', label: 'Reports', icon: BarChart3 },
    { id: 'profile', label: 'Profile', icon: User },
  ];

  return (
    <div className="min-h-screen flex flex-col">
      {/* Tab Navigation (Mobile & Desktop) */}
      <nav className="flex bg-white border-b shadow-sm z-10">
        <div className="max-w-7xl mx-auto flex gap-2 px-2 w-full justify-between">
          {navItems.map((item) => {
            const Icon = item.icon;
            const isActive = activeTab === item.id;
            return (
              <button
                key={item.id}
                onClick={() => setActiveTab(item.id)}
                className={`flex flex-1 flex-col items-center md:flex-row md:items-center gap-1 md:gap-2 px-2 md:px-4 py-3 border-b-2 transition-colors text-xs md:text-sm font-medium ${
                  isActive
                    ? 'border-orange-600 text-orange-600 bg-orange-50'
                    : 'border-transparent text-gray-600 hover:text-orange-500 hover:bg-orange-50'
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
      {/* Mobile Header */}
      <header className="bg-white shadow-sm border-b sticky top-0 z-10">
        <div className="px-4 py-3">
          <div className="flex items-center justify-between">
            <div className="flex items-center gap-3">
              <div className="bg-orange-500 p-2 rounded-lg">
                <Utensils className="w-5 h-5 text-white" />
              </div>
              <div>
                <h1 className="text-lg text-orange-600">MealPal</h1>
                <p className="text-xs text-gray-500">System Admin</p>
              </div>
            </div>
            <Sheet>
              <SheetTrigger asChild>
                <Button variant="ghost" size="sm" className="md:hidden">
                  <Menu className="w-5 h-5" />
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
          {activeTab === 'users' && <UserManagementTab accessToken={accessToken} />}
          {activeTab === 'reports' && <ReportsTab accessToken={accessToken} />}
          {activeTab === 'profile' && <ProfileTab profile={profile} accessToken={accessToken} />}
        </div>
      </main>

      {/* Removed Mobile Bottom Navigation for unified experience */}
    </div>
  );
}