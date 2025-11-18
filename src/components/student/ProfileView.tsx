import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '../ui/card';
import { Button } from '../ui/button';
import { User, Mail, Shield, LogOut } from 'lucide-react';

interface ProfileViewProps {
  user: any;
  onLogout: () => void;
}

export function ProfileView({ user, onLogout }: ProfileViewProps) {
  return (
    <div className="space-y-6">
      <Card>
        <CardHeader>
          <CardTitle className="flex items-center gap-2">
            <User className="h-5 w-5 text-green-600" />
            Profile Information
          </CardTitle>
          <CardDescription>
            View your account details and preferences
          </CardDescription>
        </CardHeader>
        <CardContent className="space-y-4">
          <div className="space-y-4">
            <div className="grid gap-4 md:grid-cols-2">
              <div className="bg-gray-50 p-4 rounded">
                <div className="flex items-center gap-2 text-sm text-gray-600 mb-1">
                  <User className="h-4 w-4" />
                  Full Name
                </div>
                <p className="text-gray-900">{user.name}</p>
              </div>

              <div className="bg-gray-50 p-4 rounded">
                <div className="flex items-center gap-2 text-sm text-gray-600 mb-1">
                  <Mail className="h-4 w-4" />
                  Email Address
                </div>
                <p className="text-gray-900">{user.email}</p>
              </div>

              <div className="bg-gray-50 p-4 rounded">
                <div className="flex items-center gap-2 text-sm text-gray-600 mb-1">
                  <Shield className="h-4 w-4" />
                  Account Type
                </div>
                <p className="text-gray-900">{user.role}</p>
              </div>

              <div className="bg-gray-50 p-4 rounded">
                <div className="flex items-center gap-2 text-sm text-gray-600 mb-1">
                  <User className="h-4 w-4" />
                  Member Since
                </div>
                <p className="text-gray-900">
                  {new Date(user.createdAt).toLocaleDateString('en-US', {
                    year: 'numeric',
                    month: 'long',
                    day: 'numeric',
                  })}
                </p>
              </div>
            </div>
          </div>
        </CardContent>
      </Card>

      <Card>
        <CardHeader>
          <CardTitle>Account Actions</CardTitle>
          <CardDescription>
            Manage your MealPal account
          </CardDescription>
        </CardHeader>
        <CardContent>
          <Button variant="destructive" onClick={onLogout} className="w-full md:w-auto">
            <LogOut className="mr-2 h-4 w-4" />
            Sign Out
          </Button>
        </CardContent>
      </Card>
    </div>
  );
}