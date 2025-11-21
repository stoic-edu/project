import { useState, useEffect } from 'react';
import { UtensilsCrossed, Wallet, BarChart3, User, Coffee, LogOut } from 'lucide-react';
import { Button } from '../ui/button';
import { SmartMenuTab } from './SmartMenuTab';
import { MealBudgetTab } from './MealBudgetTab';
import { AnalyticsTab } from './AnalyticsTab';
import { ProfileTab } from './ProfileTab';
import { DietPreferenceDialog } from './DietPreferenceDialog';

interface StudentDashboardProps {
  user: any;
  profile: any;
  accessToken: string;
  onSignOut: () => void;
}

export function StudentDashboard({ user, profile, accessToken, onSignOut }: StudentDashboardProps) {
  const [activeTab, setActiveTab] = useState('menu');
  const [showDietDialog, setShowDietDialog] = useState(false);
  const [userProfile, setUserProfile] = useState(profile);
  const [refreshTrigger, setRefreshTrigger] = useState(0);

  // Actually USE the user prop
  useEffect(() => {
    if (user) {
      console.log('Student user loaded:', user.email || user.username);
      // You can add user-specific logic here
    }
  }, [user]);

  // Actually USE refreshTrigger
  useEffect(() => {
    if (refreshTrigger > 0) {
      console.log('Refreshing dashboard data...');
      // Add your data refresh logic here
      // For example, you might want to refetch profile data
    }
  }, [refreshTrigger]);

  useEffect(() => {
    // Check if user has set diet preference
    if (!profile.dietPreference) {
      setShowDietDialog(true);
    }
  }, [profile]);

  const handleDietPreferenceComplete = (dietPreference: string) => {
    setShowDietDialog(false);
    setUserProfile({ ...userProfile, dietPreference });
    // Trigger refresh after setting diet preference
    setRefreshTrigger(prev => prev + 1);
  };

  const handleProfileUpdate = (updatedProfile: any) => {
    setUserProfile(updatedProfile);
    // Trigger refresh after profile update
    setRefreshTrigger(prev => prev + 1);
  };

  const handlePurchase = () => {
    // Trigger a refresh when a purchase is made
    console.log('Purchase completed, refreshing data...');
    setRefreshTrigger(prev => prev + 1);
  };

  return (
    <div className="min-h-screen bg-gray-50 flex flex-col">
      {/* Header */}
      <header className="bg-gradient-to-r from-orange-500 to-orange-600 text-white shadow-lg">
          <div className="max-w-md mx-auto px-4 py-4">

          <div className="flex items-center justify-between">
            <div>
              <div className="flex items-center gap-2">
                <Coffee className="w-6 h-6" />
                <h1 className="text-xl sm:text-2xl">MealPal</h1>
              </div>
              <p className="text-sm text-orange-100 mt-1">Welcome back, {userProfile.name}!</p>
            </div>
            <Button
              variant="ghost"
              size="sm"
              onClick={onSignOut}
              className="text-white hover:bg-orange-600 gap-2"
            >
              <LogOut className="w-4 h-4" />
              <span className="hidden sm:inline">Logout</span>
            </Button>
          </div>
        </div>
      </header>

      {/* Mobile Navigation - always visible */}
      <nav className="bg-white border-b sticky top-0 z-10 shadow-sm">

        <div className="flex overflow-x-auto">
          <button
            onClick={() => setActiveTab('menu')}
            className={`flex-1 py-3 px-4 flex flex-col items-center gap-1 ${
              activeTab === 'menu'
                ? 'text-orange-600 border-b-2 border-orange-600 bg-orange-50'
                : 'text-gray-600'
            }`}
          >
            <UtensilsCrossed className="w-5 h-5" />
            <span className="text-xs">Menu</span>
          </button>
          <button
            onClick={() => setActiveTab('budget')}
            className={`flex-1 py-3 px-4 flex flex-col items-center gap-1 ${
              activeTab === 'budget'
                ? 'text-orange-600 border-b-2 border-orange-600 bg-orange-50'
                : 'text-gray-600'
            }`}
          >
            <Wallet className="w-5 h-5" />
            <span className="text-xs">Budget</span>
          </button>
          <button
            onClick={() => setActiveTab('analytics')}
            className={`flex-1 py-3 px-4 flex flex-col items-center gap-1 ${
              activeTab === 'analytics'
                ? 'text-orange-600 border-b-2 border-orange-600 bg-orange-50'
                : 'text-gray-600'
            }`}
          >
            <BarChart3 className="w-5 h-5" />
            <span className="text-xs">Analytics</span>
          </button>
          <button
            onClick={() => setActiveTab('profile')}
            className={`flex-1 py-3 px-4 flex flex-col items-center gap-1 ${
              activeTab === 'profile'
                ? 'text-orange-600 border-b-2 border-orange-600 bg-orange-50'
                : 'text-gray-600'
            }`}
          >
            <User className="w-5 h-5" />
            <span className="text-xs">Profile</span>
          </button>
        </div>
      </nav>

      {/* Desktop Sidebar - hidden for a compact mobile look */}
       <div className="flex flex-1">
         <aside className="hidden w-64 bg-white border-r">

          <nav className="p-4 space-y-2">
            <button
              onClick={() => setActiveTab('menu')}
              className={`w-full flex items-center gap-3 px-4 py-3 rounded-lg transition-colors ${
                activeTab === 'menu'
                  ? 'bg-orange-500 text-white'
                  : 'text-gray-700 hover:bg-gray-100'
              }`}
            >
              <UtensilsCrossed className="w-5 h-5" />
              <span>Menu</span>
            </button>
            <button
              onClick={() => setActiveTab('budget')}
              className={`w-full flex items-center gap-3 px-4 py-3 rounded-lg transition-colors ${
                activeTab === 'budget'
                  ? 'bg-orange-500 text-white'
                  : 'text-gray-700 hover:bg-gray-100'
              }`}
            >
              <Wallet className="w-5 h-5" />
              <span>Budget</span>
            </button>
            <button
              onClick={() => setActiveTab('analytics')}
              className={`w-full flex items-center gap-3 px-4 py-3 rounded-lg transition-colors ${
                activeTab === 'analytics'
                  ? 'bg-orange-500 text-white'
                  : 'text-gray-700 hover:bg-gray-100'
              }`}
            >
              <BarChart3 className="w-5 h-5" />
              <span>Analytics</span>
            </button>
            <button
              onClick={() => setActiveTab('profile')}
              className={`w-full flex items-center gap-3 px-4 py-3 rounded-lg transition-colors ${
                activeTab === 'profile'
                  ? 'bg-orange-500 text-white'
                  : 'text-gray-700 hover:bg-gray-100'
              }`}
            >
              <User className="w-5 h-5" />
              <span>Profile</span>
            </button>
          </nav>
        </aside>
        {/* Main Content */}
         <main className="flex-1 overflow-auto">
          <div className="max-w-md mx-auto px-4 py-4">

            {activeTab === 'menu' && (
              <SmartMenuTab
                accessToken={accessToken}
                onPurchase={handlePurchase}
                profile={userProfile}
                key={refreshTrigger} // Add key to force re-render on refresh
              />
            )}
            {activeTab === 'budget' && (
              <MealBudgetTab 
                accessToken={accessToken} 
                key={refreshTrigger} // Add key to force re-render on refresh
              />
            )}
            {activeTab === 'analytics' && (
              <AnalyticsTab 
                accessToken={accessToken} 
                key={refreshTrigger} // Add key to force re-render on refresh
              />
            )}
            {activeTab === 'profile' && (
              <ProfileTab
                profile={userProfile}
                accessToken={accessToken}
                onProfileUpdate={handleProfileUpdate}
                key={refreshTrigger} // Add key to force re-render on refresh
              />
            )}
          </div>
        </main>
      </div>

      {/* Diet Preference Dialog */}
      <DietPreferenceDialog
        open={showDietDialog}
        onComplete={handleDietPreferenceComplete}
        accessToken={accessToken}
      />
    </div>
  );
}