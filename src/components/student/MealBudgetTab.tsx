import { useState, useEffect } from 'react';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '../ui/card';
import { Button } from '../ui/button';
import { Input } from '../ui/input';
import { Label } from '../ui/label';
import { Coffee, UtensilsCrossed, Moon, Save, Info } from 'lucide-react';
import { projectId } from '../../utils/supabase/info';
import { toast } from 'sonner';

interface MealBudgetTabProps {
  accessToken: string;
}

export function MealBudgetTab({ accessToken }: MealBudgetTabProps) {
  const [loading, setLoading] = useState(false);
  const [saving, setSaving] = useState(false);
  const [breakfastBudget, setBreakfastBudget] = useState('150');
  const [lunchBudget, setLunchBudget] = useState('200');
  const [supperBudget, setSupperBudget] = useState('150');

  useEffect(() => {
    fetchMealBudgets();
  }, []);

  const fetchMealBudgets = async () => {
    setLoading(true);
    try {
      const response = await fetch(
        `https://${projectId}.supabase.co/functions/v1/make-server-493cc528/meal-budgets`,
        {
          headers: {
            'Authorization': `Bearer ${accessToken}`,
          },
        }
      );

      if (response.ok) {
        const data = await response.json();
        setBreakfastBudget(data.breakfast.toString());
        setLunchBudget(data.lunch.toString());
        setSupperBudget(data.supper.toString());
      } else {
        const error = await response.json();
        toast.error(`Failed to fetch budgets: ${error.error}`);
      }
    } catch (error) {
      console.error('Error fetching meal budgets:', error);
      toast.error('An error occurred while fetching budgets');
    } finally {
      setLoading(false);
    }
  };

  const handleSave = async () => {
    // Validation
    const breakfast = parseFloat(breakfastBudget);
    const lunch = parseFloat(lunchBudget);
    const supper = parseFloat(supperBudget);

    if (isNaN(breakfast) || breakfast <= 0) {
      toast.error('Please enter a valid breakfast budget');
      return;
    }
    if (isNaN(lunch) || lunch <= 0) {
      toast.error('Please enter a valid lunch budget');
      return;
    }
    if (isNaN(supper) || supper <= 0) {
      toast.error('Please enter a valid supper budget');
      return;
    }

    setSaving(true);
    try {
      const response = await fetch(
        `https://${projectId}.supabase.co/functions/v1/make-server-493cc528/meal-budgets`,
        {
          method: 'PUT',
          headers: {
            'Content-Type': 'application/json',
            'Authorization': `Bearer ${accessToken}`,
          },
          body: JSON.stringify({
            breakfast,
            lunch,
            supper,
          }),
        }
      );

      if (response.ok) {
        toast.success('Meal budgets updated successfully!');
      } else {
        const error = await response.json();
        toast.error(`Update failed: ${error.error}`);
      }
    } catch (error) {
      console.error('Error updating meal budgets:', error);
      toast.error('An error occurred while updating budgets');
    } finally {
      setSaving(false);
    }
  };

  const totalBudget = (parseFloat(breakfastBudget) || 0) + (parseFloat(lunchBudget) || 0) + (parseFloat(supperBudget) || 0);
  const dailyBudget = totalBudget;
  const weeklyBudget = totalBudget * 7;
  const monthlyBudget = totalBudget * 30;

  if (loading) {
    return (
      <div className="flex justify-center py-12">
        <div className="w-12 h-12 border-4 border-orange-500 border-t-transparent rounded-full animate-spin"></div>
      </div>
    );
  }

  return (
    <div className="space-y-4 sm:space-y-6">
      <div>
        <h2 className="mb-1 text-lg sm:text-xl">Meal Budget Management</h2>
        <p className="text-gray-600 text-sm">Set your budget for each meal type</p>
      </div>

      {/* Budget Summary */}
      <div className="grid gap-3 sm:gap-4 grid-cols-1 sm:grid-cols-3">
        <Card>
          <CardHeader className="pb-2">
            <CardTitle className="text-sm">Daily Budget</CardTitle>
          </CardHeader>
          <CardContent>
            <div className="text-orange-600">KES {dailyBudget.toFixed(2)}</div>
            <p className="text-xs text-gray-500 mt-1">Per day</p>
          </CardContent>
        </Card>

        <Card>
          <CardHeader className="pb-2">
            <CardTitle className="text-sm">Weekly Budget</CardTitle>
          </CardHeader>
          <CardContent>
            <div className="text-orange-600">KES {weeklyBudget.toFixed(2)}</div>
            <p className="text-xs text-gray-500 mt-1">Per week</p>
          </CardContent>
        </Card>

        <Card>
          <CardHeader className="pb-2">
            <CardTitle className="text-sm">Monthly Budget</CardTitle>
          </CardHeader>
          <CardContent>
            <div className="text-orange-600">KES {monthlyBudget.toFixed(2)}</div>
            <p className="text-xs text-gray-500 mt-1">Per month (approx)</p>
          </CardContent>
        </Card>
      </div>

      {/* Budget Configuration */}
      <Card>
        <CardHeader>
          <CardTitle>Set Meal Budgets</CardTitle>
          <CardDescription>Configure your budget for breakfast, lunch, and supper</CardDescription>
        </CardHeader>
        <CardContent className="space-y-6">
          <div className="bg-blue-50 border border-blue-200 rounded-lg p-4 flex gap-3">
            <Info className="w-5 h-5 text-blue-600 flex-shrink-0 mt-0.5" />
            <p className="text-sm text-blue-800">
              Your meal budgets help the recommendation system suggest affordable options. These budgets are used to filter menu items within your price range.
            </p>
          </div>

          <div className="space-y-6">
            {/* Breakfast Budget */}
            <div className="space-y-3">
              <div className="flex items-center gap-3">
                <div className="w-10 h-10 rounded-full bg-yellow-100 flex items-center justify-center">
                  <Coffee className="w-5 h-5 text-yellow-600" />
                </div>
                <div className="flex-1">
                  <Label htmlFor="breakfast-budget">Breakfast Budget</Label>
                  <p className="text-sm text-gray-500">Typical: KES 100-200</p>
                </div>
              </div>
              <div className="relative">
                <span className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-500">KES</span>
                <Input
                  id="breakfast-budget"
                  type="number"
                  value={breakfastBudget}
                  onChange={(e) => setBreakfastBudget(e.target.value)}
                  className="pl-14"
                  placeholder="150"
                  min="0"
                  step="10"
                />
              </div>
            </div>

            {/* Lunch Budget */}
            <div className="space-y-3">
              <div className="flex items-center gap-3">
                <div className="w-10 h-10 rounded-full bg-orange-100 flex items-center justify-center">
                  <UtensilsCrossed className="w-5 h-5 text-orange-600" />
                </div>
                <div className="flex-1">
                  <Label htmlFor="lunch-budget">Lunch Budget</Label>
                  <p className="text-sm text-gray-500">Typical: KES 150-300</p>
                </div>
              </div>
              <div className="relative">
                <span className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-500">KES</span>
                <Input
                  id="lunch-budget"
                  type="number"
                  value={lunchBudget}
                  onChange={(e) => setLunchBudget(e.target.value)}
                  className="pl-14"
                  placeholder="200"
                  min="0"
                  step="10"
                />
              </div>
            </div>

            {/* Supper Budget */}
            <div className="space-y-3">
              <div className="flex items-center gap-3">
                <div className="w-10 h-10 rounded-full bg-purple-100 flex items-center justify-center">
                  <Moon className="w-5 h-5 text-purple-600" />
                </div>
                <div className="flex-1">
                  <Label htmlFor="supper-budget">Supper Budget</Label>
                  <p className="text-sm text-gray-500">Typical: KES 100-200</p>
                </div>
              </div>
              <div className="relative">
                <span className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-500">KES</span>
                <Input
                  id="supper-budget"
                  type="number"
                  value={supperBudget}
                  onChange={(e) => setSupperBudget(e.target.value)}
                  className="pl-14"
                  placeholder="150"
                  min="0"
                  step="10"
                />
              </div>
            </div>
          </div>

          <div className="pt-4 border-t">
            <div className="flex justify-between items-center mb-4">
              <span className="text-sm text-gray-600">Total Daily Budget:</span>
              <span className="text-orange-600">KES {dailyBudget.toFixed(2)}</span>
            </div>

            <Button
              onClick={handleSave}
              disabled={saving}
              className="w-full bg-orange-500 hover:bg-orange-600 gap-2"
            >
              <Save className="w-4 h-4" />
              {saving ? 'Saving...' : 'Save Budgets'}
            </Button>
          </div>
        </CardContent>
      </Card>

      {/* Budget Tips */}
      <Card>
        <CardHeader>
          <CardTitle>Budget Tips</CardTitle>
        </CardHeader>
        <CardContent>
          <div className="space-y-3 text-sm">
            <div className="flex items-start gap-2">
              <div className="w-2 h-2 rounded-full bg-orange-500 mt-1.5 flex-shrink-0"></div>
              <p className="text-gray-700">Set realistic budgets based on your typical meal costs</p>
            </div>
            <div className="flex items-start gap-2">
              <div className="w-2 h-2 rounded-full bg-orange-500 mt-1.5 flex-shrink-0"></div>
              <p className="text-gray-700">Lunch usually costs more than breakfast or supper</p>
            </div>
            <div className="flex items-start gap-2">
              <div className="w-2 h-2 rounded-full bg-orange-500 mt-1.5 flex-shrink-0"></div>
              <p className="text-gray-700">Review your analytics regularly to adjust budgets</p>
            </div>
            <div className="flex items-start gap-2">
              <div className="w-2 h-2 rounded-full bg-orange-500 mt-1.5 flex-shrink-0"></div>
              <p className="text-gray-700">The recommendation system will only suggest items within your budget</p>
            </div>
          </div>
        </CardContent>
      </Card>
    </div>
  );
}

