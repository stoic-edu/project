import { useState, useEffect, Suspense, lazy } from 'react';
import { createClient } from './utils/supabase/client';
import { projectId, publicAnonKey } from './utils/supabase/info';
import { AuthPage } from './components/AuthPage';
import { ErrorBoundary } from './components/ErrorBoundary';
import { Toaster } from './components/ui/sonner';
import { toast } from 'sonner';

// Lazy load dashboard components to improve initial load time
const StudentDashboard = lazy(() => import('./components/student/StudentDashboard').then(module => ({ default: module.StudentDashboard })));
const CafeteriaAdminDashboard = lazy(() => import('./components/cafeteria/CafeteriaAdminDashboard').then(module => ({ default: module.CafeteriaAdminDashboard })));
const SystemAdminDashboard = lazy(() => import('./components/system/SystemAdminDashboard').then(module => ({ default: module.SystemAdminDashboard })));

const supabase = createClient();

export default function App() {
  const [user, setUser] = useState<any>(null);
  const [profile, setProfile] = useState<any>(null);
  const [loading, setLoading] = useState(true);
  const [accessToken, setAccessToken] = useState<string | null>(null);

  useEffect(() => {
    checkSession();
    seedNutritionDatabase();
  }, []);

  const checkSession = async () => {
    try {
      const { data: { session }, error } = await supabase.auth.getSession();
      if (session) {
        setUser(session.user);
        setAccessToken(session.access_token);
        await fetchUserProfile(session.access_token);
      }
    } catch (error) {
      console.error('Session check error:', error);
    } finally {
      setLoading(false);
    }
  };

  const fetchUserProfile = async (token: string) => {
    try {
      const controller = new AbortController();
      const timeoutId = setTimeout(() => controller.abort(), 10000); // 10 second timeout

      const response = await fetch(
        `https://${projectId}.supabase.co/functions/v1/make-server-493cc528/auth/me`,
        {
          headers: {
            'Authorization': `Bearer ${token}`,
          },
          signal: controller.signal,
        }
      );

      clearTimeout(timeoutId);

      if (response.ok) {
        const data = await response.json();
        setProfile(data);
      } else {
        console.error('Failed to fetch user profile');
        toast.error('Failed to load profile');
      }
    } catch (error: any) {
      if (error.name === 'AbortError') {
        console.error('Profile fetch timeout');
        toast.error('Loading profile is taking too long. Please refresh.');
      } else {
        console.error('Error fetching user profile:', error);
      }
    }
  };

  const seedNutritionDatabase = async () => {
    try {
      const response = await fetch(
        `https://${projectId}.supabase.co/functions/v1/make-server-493cc528/nutrition/seed`,
        {
          method: 'POST',
          headers: {
            'Authorization': `Bearer ${publicAnonKey}`,
          },
        }
      );

      if (response.ok) {
        const data = await response.json();
        console.log('Nutrition database seeding:', data.message);
      }
    } catch (error) {
      console.error('Error seeding nutrition database:', error);
    }
  };

  const handleSignIn = async (email: string, password: string) => {
    try {
      const { data, error } = await supabase.auth.signInWithPassword({
        email,
        password,
      });

      if (error) {
        toast.error(`Sign in failed: ${error.message}`);
        return;
      }

      if (data.session) {
        setUser(data.user);
        setAccessToken(data.session.access_token);
        await fetchUserProfile(data.session.access_token);
        toast.success('Welcome back to MealPal!');
      }
    } catch (error) {
      console.error('Sign in error:', error);
      toast.error('An error occurred during sign in');
    }
  };

  const handleSignUp = async (email: string, password: string, name: string, role: string) => {
    try {
      const response = await fetch(
        `https://${projectId}.supabase.co/functions/v1/make-server-493cc528/auth/signup`,
        {
          method: 'POST',
          headers: {
            'Content-Type': 'application/json',
            'Authorization': `Bearer ${publicAnonKey}`,
          },
          body: JSON.stringify({ email, password, name, role }),
        }
      );

      const data = await response.json();

      if (!response.ok) {
        toast.error(`Sign up failed: ${data.error}`);
        return;
      }

      toast.success('Account created! Please sign in.');
    } catch (error) {
      console.error('Sign up error:', error);
      toast.error('An error occurred during sign up');
    }
  };

  const handleSignOut = async () => {
    try {
      await supabase.auth.signOut();
      setUser(null);
      setProfile(null);
      setAccessToken(null);
      toast.success('Signed out successfully');
    } catch (error) {
      console.error('Sign out error:', error);
      toast.error('Error signing out');
    }
  };

  if (loading) {
    return (
      <div className="min-h-screen flex items-center justify-center bg-gradient-to-br from-orange-50 to-amber-50">
        <div className="text-center px-4">
          <div className="w-16 h-16 border-4 border-orange-500 border-t-transparent rounded-full animate-spin mx-auto mb-4"></div>
          <p className="text-gray-600">Loading MealPal...</p>
        </div>
      </div>
    );
  }

  const LoadingFallback = () => (
    <div className="min-h-screen flex items-center justify-center bg-gradient-to-br from-orange-50 to-amber-50">
      <div className="text-center px-4">
        <div className="w-16 h-16 border-4 border-orange-500 border-t-transparent rounded-full animate-spin mx-auto mb-4"></div>
        <p className="text-gray-600">Loading dashboard...</p>
      </div>
    </div>
  );

  if (!user || !profile) {
    return (
      <ErrorBoundary>
        <AuthPage onSignIn={handleSignIn} onSignUp={handleSignUp} />
        <Toaster />
      </ErrorBoundary>
    );
  }

  return (
    <ErrorBoundary>
      <div className="min-h-screen bg-gradient-to-br from-orange-50 to-amber-50 pb-20">
        <Suspense fallback={<LoadingFallback />}>
          {profile.role === 'STUDENT' && (
            <StudentDashboard 
              user={user} 
              profile={profile} 
              accessToken={accessToken!}
              onSignOut={handleSignOut} 
            />
          )}
          {profile.role === 'CAFETERIA_ADMIN' && (
            <CafeteriaAdminDashboard 
              user={user} 
              profile={profile} 
              accessToken={accessToken!}
              onSignOut={handleSignOut} 
            />
          )}
          {profile.role === 'SYSTEM_ADMIN' && (
            <SystemAdminDashboard 
              user={user} 
              profile={profile} 
              accessToken={accessToken!}
              onSignOut={handleSignOut} 
            />
          )}
        </Suspense>
      </div>
      <Toaster />
    </ErrorBoundary>
  );
}
