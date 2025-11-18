import { useState } from 'react';
import { Users, FileChartColumn, User, LogOut, Menu as MenuIcon } from 'lucide-react';
import { Button } from '../ui/button';
import { Sheet, SheetContent, SheetTrigger } from '../ui/sheet';
import { UserManagementTab } from './UserManagementTab';
import { ReportsTab } from './ReportsTab';
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
    { id: 'reports', label: 'Reports', icon: FileChartColumn },
    { id: 'profile', label: 'Profile', icon: User },
  ];

  return (
    <div className="min-h-screen flex flex-col">
      
      {/* Mobile Header */}
      <header className="bg-white shadow-sm border-b sticky top-0 z-10">
        <div className="px-4 py-3">
          <div className="flex items-center justify-between">
            <div className="flex items-center gap-3">
              <div className="bg-orange-600 p-2 rounded-lg">
                <Users className="w-5 h-5 text-white" />
              </div>
              <div>
                <h1 className="text-lg text-orange-600">MealPal</h1>
                <p className="text-xs text-gray-500">System Admin</p>
              </div>
            </div>

            <Sheet>
              <SheetTrigger asChild>
                <Button variant="ghost" className="md:hidden">
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
              onClick={onSignOut}
              variant="ghost"
              className="hidden md:flex gap-2"
            >
              <LogOut className="w-4 h-4" />
              Sign Out
            </Button>
          </div>
        </div>
      </header>

      {/* Main Content */}
      <main className="flex-1 overflow-auto px-4 py-6">
        {activeTab === 'users' && <UserManagementTab accessToken={accessToken} />}
        {activeTab === 'reports' && <ReportsTab accessToken={accessToken} />}
        {activeTab === 'profile' && <ProfileTab profile={profile} accessToken={accessToken} />}
      </main>

      {/* Mobile Bottom Nav */}
      <nav className="fixed bottom-0 left-0 right-0 bg-white border-t shadow-lg md:hidden">
        <div className="grid grid-cols-3">
          {navItems.map((item) => {
            const Icon = item.icon;
            const isActive = activeTab === item.id;
            return (
              <button
                key={item.id}
                onClick={() => setActiveTab(item.id)}
                className={`flex flex-col items-center gap-1 py-3 ${
                  isActive ? 'text-orange-600 bg-orange-50' : 'text-gray-600'
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
