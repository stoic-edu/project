import { useState, useEffect } from 'react';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '../ui/card';
import { Button } from '../ui/button';
import { Input } from '../ui/input';
import { Label } from '../ui/label';
import { Progress } from '../ui/progress';
import { AlertCircle, TrendingDown, TrendingUp, Wallet } from 'lucide-react';
import { Alert, AlertDescription } from '../ui/alert';
import { projectId } from '../../utils/supabase/info';
import { toast } from 'sonner';

interface BudgetTabProps {
  budget: any;
  accessToken: string;
  onUpdate: () => void;
}

export function BudgetTab({ budget, accessToken, onUpdate }: BudgetTabProps) {
  const [dailyBudget, setDailyBudget] = useState('');
  const [weeklyBudget, setWeeklyBudget] = useState('');
  const [isEditing, setIsEditing] = useState(false);

  useEffect(() => {
    if (budget) {
      setDailyBudget(budget.dailyBudget?.toString() || '500');
      setWeeklyBudget(budget.weeklyBudget?.toString() || '3500');
    }
  }, [budget]);

  const handleUpdateBudget = async () => {
    try {
      const response = await fetch(
        `https://${projectId}.supabase.co/functions/v1/make-server-493cc528/budget`,
        {
          method: 'PUT',
          headers: {
            'Content-Type': 'application/json',
            'Authorization': `Bearer ${accessToken}`,
          },
          body: JSON.stringify({
            dailyBudget: parseFloat(dailyBudget),
            weeklyBudget: parseFloat(weeklyBudget),
          }),
        }
      );

      if (response.ok) {
        toast.success('Budget updated successfully!');
        setIsEditing(false);
        onUpdate();
      } else {
        const error = await response.json();
        toast.error(`Update failed: ${error.error}`);
      }
    } catch (error) {
      console.error('Error updating budget:', error);
      toast.error('An error occurred while updating budget');
    }
  };

  if (!budget) {
    return (
      <div className="flex justify-center py-12">
        <div className="w-12 h-12 border-4 border-orange-500 border-t-transparent rounded-full animate-spin"></div>
      </div>
    );
  }

  const dailySpending = budget.currentSpending || 0;
  const dailyPercentage = budget.dailyBudget ? (dailySpending / budget.dailyBudget) * 100 : 0;
  const weeklyPercentage = budget.weeklyBudget ? (dailySpending / budget.weeklyBudget) * 100 : 0;
  const remainingDaily = budget.dailyBudget - dailySpending;
  const remainingWeekly = budget.weeklyBudget - dailySpending;

  return (
    <div className="space-y-4 sm:space-y-6">
      <div className="grid gap-4 sm:gap-6 grid-cols-1 md:grid-cols-2">
        <Card>
          <CardHeader className="pb-3">
            <CardTitle className="flex items-center gap-2 text-lg">
              <Wallet className="w-5 h-5 text-orange-500" />
              Daily Budget
            </CardTitle>
            <CardDescription className="text-sm">Your spending limit for today</CardDescription>
          </CardHeader>
          <CardContent className="space-y-4">
            <div className="space-y-2">
              <div className="flex justify-between text-sm">
                <span className="text-gray-600">Spent</span>
                <span>KES {dailySpending.toFixed(2)}</span>
              </div>
              <Progress value={Math.min(dailyPercentage, 100)} className="h-2" />
              <div className="flex justify-between text-sm">
                <span className="text-gray-600">Budget</span>
                <span>KES {budget.dailyBudget}</span>
              </div>
            </div>
            
            <div className="pt-4 border-t">
              <div className="flex items-center justify-between">
                <span className="text-sm text-gray-600">Remaining</span>
                <div className="flex items-center gap-2">
                  {remainingDaily >= 0 ? (
                    <TrendingUp className="w-4 h-4 text-green-500" />
                  ) : (
                    <TrendingDown className="w-4 h-4 text-red-500" />
                  )}
                  <span className={remainingDaily >= 0 ? 'text-green-600' : 'text-red-600'}>
                    KES {Math.abs(remainingDaily).toFixed(2)}
                  </span>
                </div>
              </div>
            </div>
          </CardContent>
        </Card>

        <Card>
          <CardHeader className="pb-3">
            <CardTitle className="flex items-center gap-2 text-lg">
              <Wallet className="w-5 h-5 text-orange-500" />
              Weekly Budget
            </CardTitle>
            <CardDescription className="text-sm">Your spending limit for this week</CardDescription>
          </CardHeader>
          <CardContent className="space-y-4">
            <div className="space-y-2">
              <div className="flex justify-between text-sm">
                <span className="text-gray-600">Spent</span>
                <span>KES {dailySpending.toFixed(2)}</span>
              </div>
              <Progress value={Math.min(weeklyPercentage, 100)} className="h-2" />
              <div className="flex justify-between text-sm">
                <span className="text-gray-600">Budget</span>
                <span>KES {budget.weeklyBudget}</span>
              </div>
            </div>
            
            <div className="pt-4 border-t">
              <div className="flex items-center justify-between">
                <span className="text-sm text-gray-600">Remaining</span>
                <div className="flex items-center gap-2">
                  {remainingWeekly >= 0 ? (
                    <TrendingUp className="w-4 h-4 text-green-500" />
                  ) : (
                    <TrendingDown className="w-4 h-4 text-red-500" />
                  )}
                  <span className={remainingWeekly >= 0 ? 'text-green-600' : 'text-red-600'}>
                    KES {Math.abs(remainingWeekly).toFixed(2)}
                  </span>
                </div>
              </div>
            </div>
          </CardContent>
        </Card>
      </div>

      {(dailyPercentage > 80 || weeklyPercentage > 80) && (
        <Alert>
          <AlertCircle className="h-4 w-4" />
          <AlertDescription>
            {dailyPercentage > 100 || weeklyPercentage > 100
              ? "You've exceeded your budget! Consider reducing your spending."
              : "You're approaching your budget limit. Spend wisely!"}
          </AlertDescription>
        </Alert>
      )}

      <Card>
        <CardHeader>
          <CardTitle>Manage Budget</CardTitle>
          <CardDescription>Set your daily and weekly spending limits</CardDescription>
        </CardHeader>
        <CardContent className="space-y-4">
          <div className="grid gap-4 md:grid-cols-2">
            <div className="space-y-2">
              <Label htmlFor="daily-budget">Daily Budget (KES)</Label>
              <Input
                id="daily-budget"
                type="number"
                value={dailyBudget}
                onChange={(e) => setDailyBudget(e.target.value)}
                disabled={!isEditing}
                placeholder="500"
              />
            </div>
            <div className="space-y-2">
              <Label htmlFor="weekly-budget">Weekly Budget (KES)</Label>
              <Input
                id="weekly-budget"
                type="number"
                value={weeklyBudget}
                onChange={(e) => setWeeklyBudget(e.target.value)}
                disabled={!isEditing}
                placeholder="3500"
              />
            </div>
          </div>
          
          <div className="flex gap-2">
            {isEditing ? (
              <>
                <Button 
                  onClick={handleUpdateBudget}
                  className="bg-orange-500 hover:bg-orange-600"
                >
                  Save Changes
                </Button>
                <Button 
                  variant="outline" 
                  onClick={() => {
                    setIsEditing(false);
                    setDailyBudget(budget.dailyBudget?.toString() || '500');
                    setWeeklyBudget(budget.weeklyBudget?.toString() || '3500');
                  }}
                >
                  Cancel
                </Button>
              </>
            ) : (
              <Button 
                variant="outline" 
                onClick={() => setIsEditing(true)}
              >
                Edit Budget
              </Button>
            )}
          </div>
        </CardContent>
      </Card>
    </div>
  );
}
