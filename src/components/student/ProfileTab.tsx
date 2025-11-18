import { useState } from 'react';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '../ui/card';
import { Button } from '../ui/button';
import { Input } from '../ui/input';
import { Label } from '../ui/label';
import { Dialog, DialogContent, DialogDescription, DialogHeader, DialogTitle } from '../ui/dialog';
import { Badge } from '../ui/badge';
import { User, Mail, Shield, Calendar, Edit, Save } from 'lucide-react';
import { format, parseISO } from 'date-fns';
import { projectId } from '../../utils/supabase/info';
import { toast } from 'sonner';

interface ProfileTabProps {
  profile: any;
  accessToken?: string;
  onProfileUpdate?: (updatedProfile: any) => void;
}

export function ProfileTab({ profile, accessToken, onProfileUpdate }: ProfileTabProps) {
  const [showEditDialog, setShowEditDialog] = useState(false);
  const [editedName, setEditedName] = useState(profile.name);
  const [saving, setSaving] = useState(false);

  const handleSaveProfile = async () => {
    if (!editedName.trim()) {
      toast.error('Name cannot be empty');
      return;
    }

    if (!accessToken) {
      toast.error('Not authorized to update profile');
      return;
    }

    setSaving(true);
    try {
      const response = await fetch(
        `https://${projectId}.supabase.co/functions/v1/make-server-493cc528/profile`,
        {
          method: 'PUT',
          headers: {
            'Content-Type': 'application/json',
            'Authorization': `Bearer ${accessToken}`,
          },
          body: JSON.stringify({
            name: editedName.trim(),
          }),
        }
      );

      if (response.ok) {
        const updatedProfile = { ...profile, name: editedName.trim() };
        toast.success('Profile updated successfully!');
        setShowEditDialog(false);
        
        if (onProfileUpdate) {
          onProfileUpdate(updatedProfile);
        }
      } else {
        const error = await response.json();
        toast.error(`Update failed: ${error.error}`);
      }
    } catch (error) {
      console.error('Error updating profile:', error);
      toast.error('An error occurred while updating profile');
    } finally {
      setSaving(false);
    }
  };

  return (
    <div className="space-y-6">
      <Card>
        <CardHeader>
          <div className="flex items-center justify-between">
            <div>
              <CardTitle>Profile Information</CardTitle>
              <CardDescription>Your MealPal account details</CardDescription>
            </div>
            {accessToken && (
              <Button
                variant="outline"
                size="sm"
                onClick={() => {
                  setEditedName(profile.name);
                  setShowEditDialog(true);
                }}
                className="gap-2"
              >
                <Edit className="w-4 h-4" />
                Edit
              </Button>
            )}
          </div>
        </CardHeader>
        <CardContent className="space-y-6">
          <div className="flex items-center gap-4">
            <div className="w-20 h-20 rounded-full bg-gradient-to-br from-orange-400 to-orange-600 flex items-center justify-center">
              <User className="w-10 h-10 text-white" />
            </div>
            <div>
              <h2>{profile.name}</h2>
              <Badge variant="secondary" className="mt-1">
                {profile.role.replace('_', ' ')}
              </Badge>
            </div>
          </div>

          <div className="space-y-4 pt-4 border-t">
            <div className="flex items-center gap-3">
              <Mail className="w-5 h-5 text-gray-400" />
              <div>
                <p className="text-sm text-gray-500">Email</p>
                <p>{profile.email}</p>
              </div>
            </div>

            <div className="flex items-center gap-3">
              <Shield className="w-5 h-5 text-gray-400" />
              <div>
                <p className="text-sm text-gray-500">Role</p>
                <p>{profile.role.replace('_', ' ')}</p>
              </div>
            </div>

            {profile.createdAt && (
              <div className="flex items-center gap-3">
                <Calendar className="w-5 h-5 text-gray-400" />
                <div>
                  <p className="text-sm text-gray-500">Member Since</p>
                  <p>{format(parseISO(profile.createdAt), 'MMMM d, yyyy')}</p>
                </div>
              </div>
            )}
          </div>
        </CardContent>
      </Card>

      <Card>
        <CardHeader>
          <CardTitle>About MealPal</CardTitle>
          <CardDescription>Smart cafeteria management & budgeting</CardDescription>
        </CardHeader>
        <CardContent className="space-y-4">
          <p className="text-sm text-gray-600">
            MealPal helps you manage your cafeteria expenses, track nutrition, and stay within your budget. 
            Make informed decisions about your meals and monitor your spending habits.
          </p>
          <div className="grid gap-3 text-sm">
            <div className="flex items-start gap-2">
              <div className="w-2 h-2 rounded-full bg-orange-500 mt-1.5"></div>
              <div>
                <p>View daily and weekly cafeteria menus</p>
              </div>
            </div>
            <div className="flex items-start gap-2">
              <div className="w-2 h-2 rounded-full bg-orange-500 mt-1.5"></div>
              <div>
                <p>Set and monitor daily/weekly budgets</p>
              </div>
            </div>
            <div className="flex items-start gap-2">
              <div className="w-2 h-2 rounded-full bg-orange-500 mt-1.5"></div>
              <div>
                <p>Track your spending with detailed analytics</p>
              </div>
            </div>
            <div className="flex items-start gap-2">
              <div className="w-2 h-2 rounded-full bg-orange-500 mt-1.5"></div>
              <div>
                <p>Access nutritional information for healthier choices</p>
              </div>
            </div>
          </div>
        </CardContent>
      </Card>

      {/* Edit Profile Dialog */}
      <Dialog open={showEditDialog} onOpenChange={setShowEditDialog}>
        <DialogContent>
          <DialogHeader>
            <DialogTitle>Edit Profile</DialogTitle>
            <DialogDescription>
              Update your profile information
            </DialogDescription>
          </DialogHeader>
          <div className="space-y-4">
            <div className="p-4 bg-gray-50 rounded-lg">
              <p className="text-sm text-gray-600 mb-1">Email (cannot be changed)</p>
              <p className="text-gray-500">{profile.email}</p>
            </div>

            <div className="space-y-2">
              <Label htmlFor="edit-name">Full Name *</Label>
              <Input
                id="edit-name"
                value={editedName}
                onChange={(e) => setEditedName(e.target.value)}
                placeholder="Enter your full name"
              />
            </div>

            <div className="flex gap-2 pt-4">
              <Button
                onClick={handleSaveProfile}
                className="flex-1 bg-orange-500 hover:bg-orange-600 gap-2"
                disabled={saving || !editedName.trim() || editedName === profile.name}
              >
                <Save className="w-4 h-4" />
                {saving ? 'Saving...' : 'Save Changes'}
              </Button>
              <Button
                variant="outline"
                onClick={() => {
                  setShowEditDialog(false);
                  setEditedName(profile.name);
                }}
                disabled={saving}
              >
                Cancel
              </Button>
            </div>
          </div>
        </DialogContent>
      </Dialog>
    </div>
  );
}
