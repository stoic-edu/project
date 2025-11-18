import { useState, useEffect } from 'react';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '../ui/card';
import { Button } from '../ui/button';
import { Input } from '../ui/input';
import { Label } from '../ui/label';
import { Progress } from '../ui/progress';
import { projectId } from '../../utils/supabase/info';
import { createClient } from '../../utils/supabase/client';
import { Wallet, TrendingUp, Calendar, Loader2, AlertCircle } from 'lucide-react';
import { toast } from 'sonner';

interface BudgetTrackerProps {
  userId: string;
}

export function BudgetTracker({ userId }: BudgetTrackerProps) {
  const [budget, setBudget] = useState({ dailyLimit: 500, monthlyLimit: 15000 });
  const [dailySpent, setDailySpent] = useState(0);
  const [monthlySpent, setMonthlySpent] = useState(0);
  const [loading, setLoading] = useState(true);
  const [saving, setSaving] = useState(false);
  const [editMode, setEditMode] = useState(false);
  const [newDailyLimit, setNewDailyLimit] = useState(500);
  const [newMonthlyLimit, setNewMonthlyLimit] = useState(15000);

  useEffect(() => {
    loadBudget();
    loadTransactions();
  }, []);

  const loadBudget = async () => {
    try {
      const supabase = createClient();
      const { data: { session } } = await supabase.auth.getSession();

      if (!session) return;

      const response = await fetch(
        `https://${projectId}.supabase.co/functions/v1/make-server-493cc528/budget`,
        {
          headers: { Authorization: `Bearer ${session.access_token}` },
        }
      );
      const data = await response.json();
      if (data.budget) {
        setBudget(data.budget);
        setNewDailyLimit(data.budget.dailyLimit);
        setNewMonthlyLimit(data.budget.monthlyLimit);
      }
    } catch (error) {
      console.error('Error loading budget:', error);
    }
  };

  const loadTransactions = async () => {
    setLoading(true);
    try {
      const supabase = createClient();
      const { data: { session } } = await supabase.auth.getSession();

      if (!session) return;

      const today = new Date().toISOString().split('T')[0];
      const firstDayOfMonth = new Date(new Date().getFullYear(), new Date().getMonth(), 1)
        .toISOString()
        .split('T')[0];

      const response = await fetch(
        `https://${projectId}.supabase.co/functions/v1/make-server-493cc528/transactions?startDate=${firstDayOfMonth}&endDate=${today}`,
        {
          headers: { Authorization: `Bearer ${session.access_token}` },
        }
      );
      const data = await response.json();
      
      const transactions = data.transactions || [];
      const todayTransactions = transactions.filter((t: any) => t.date === today);
      
      setDailySpent(todayTransactions.reduce((sum: number, t: any) => sum + t.amount, 0));
      setMonthlySpent(transactions.reduce((sum: number, t: any) => sum + t.amount, 0));
    } catch (error) {
      console.error('Error loading transactions:', error);
    }
    setLoading(false);
  };

  const saveBudget = async () => {
    setSaving(true);
    try {
      const supabase = createClient();
      const { data: { session } } = await supabase.auth.getSession();

      if (!session) {
        toast.error('Please sign in to update budget');
        return;
      }

      const response = await fetch(
        `https://${projectId}.supabase.co/functions/v1/make-server-493cc528/budget`,
        {
          method: 'PUT',
          headers: {
            'Content-Type': 'application/json',
            Authorization: `Bearer ${session.access_token}`,
          },
          body: JSON.stringify({
            dailyLimit: newDailyLimit,
            monthlyLimit: newMonthlyLimit,
          }),
        }
      );

      if (response.ok) {
        const data = await response.json();
        setBudget(data.budget);
        setEditMode(false);
        toast.success('Budget updated successfully!');
      } else {
        toast.error('Failed to update budget');
      }
    } catch (error) {
      console.error('Error saving budget:', error);
      toast.error('An error occurred');
    }
    setSaving(false);
  };

  const dailyPercentage = budget.dailyLimit > 0 ? (dailySpent / budget.dailyLimit) * 100 : 0;
  const monthlyPercentage = budget.monthlyLimit > 0 ? (monthlySpent / budget.monthlyLimit) * 100 : 0;

  const dailyRemaining = Math.max(0, budget.dailyLimit - dailySpent);
  const monthlyRemaining = Math.max(0, budget.monthlyLimit - monthlySpent);

  return (
    <div className="space-y-6">
      <Card>
        <CardHeader>
          <CardTitle className="flex items-center gap-2">
            <Wallet className="h-5 w-5 text-green-600" />
            Budget Overview
          </CardTitle>
          <CardDescription>
            Monitor your spending and stay within your budget limits
          </CardDescription>
        </CardHeader>
      </Card>

      {loading ? (
        <div className="flex items-center justify-center py-12">
          <Loader2 className="h-8 w-8 animate-spin text-green-600" />
        </div>
      ) : (
        <>
          <div className="grid gap-6 md:grid-cols-2">
            <Card>
              <CardHeader>
                <div className="flex items-center justify-between">
                  <CardTitle>Daily Budget</CardTitle>
                  <Calendar className="h-5 w-5 text-gray-400" />
                </div>
              </CardHeader>
              <CardContent className="space-y-4">
                <div className="space-y-2">
                  <div className="flex items-center justify-between text-sm">
                    <span className="text-gray-600">Spent</span>
                    <span className="text-gray-900">KES {dailySpent.toFixed(2)}</span>
                  </div>
                  <Progress value={Math.min(dailyPercentage, 100)} className="h-2" />
                  <div className="flex items-center justify-between text-sm">
                    <span className="text-gray-600">Budget</span>
                    <span className="text-gray-900">KES {budget.dailyLimit}</span>
                  </div>
                </div>

                <div className="bg-green-50 border border-green-200 rounded p-4">
                  <p className="text-sm text-gray-600">Remaining Today</p>
                  <p className="text-green-600">KES {dailyRemaining.toFixed(2)}</p>
                </div>

                {dailyPercentage > 100 && (
                  <div className="bg-red-50 border border-red-200 rounded p-3 flex items-start gap-2">
                    <AlertCircle className="h-4 w-4 text-red-600 mt-0.5" />
                    <div className="text-sm text-red-700">
                      You've exceeded your daily budget by KES {(dailySpent - budget.dailyLimit).toFixed(2)}
                    </div>
                  </div>
                )}
              </CardContent>
            </Card>

            <Card>
              <CardHeader>
                <div className="flex items-center justify-between">
                  <CardTitle>Monthly Budget</CardTitle>
                  <TrendingUp className="h-5 w-5 text-gray-400" />
                </div>
              </CardHeader>
              <CardContent className="space-y-4">
                <div className="space-y-2">
                  <div className="flex items-center justify-between text-sm">
                    <span className="text-gray-600">Spent</span>
                    <span className="text-gray-900">KES {monthlySpent.toFixed(2)}</span>
                  </div>
                  <Progress value={Math.min(monthlyPercentage, 100)} className="h-2" />
                  <div className="flex items-center justify-between text-sm">
                    <span className="text-gray-600">Budget</span>
                    <span className="text-gray-900">KES {budget.monthlyLimit}</span>
                  </div>
                </div>

                <div className="bg-blue-50 border border-blue-200 rounded p-4">
                  <p className="text-sm text-gray-600">Remaining This Month</p>
                  <p className="text-blue-600">KES {monthlyRemaining.toFixed(2)}</p>
                </div>

                {monthlyPercentage > 100 && (
                  <div className="bg-red-50 border border-red-200 rounded p-3 flex items-start gap-2">
                    <AlertCircle className="h-4 w-4 text-red-600 mt-0.5" />
                    <div className="text-sm text-red-700">
                      You've exceeded your monthly budget by KES {(monthlySpent - budget.monthlyLimit).toFixed(2)}
                    </div>
                  </div>
                )}
              </CardContent>
            </Card>
          </div>

          <Card>
            <CardHeader>
              <div className="flex items-center justify-between">
                <div>
                  <CardTitle>Budget Settings</CardTitle>
                  <CardDescription>
                    Adjust your daily and monthly spending limits
                  </CardDescription>
                </div>
                {!editMode && (
                  <Button onClick={() => setEditMode(true)}>Edit Budget</Button>
                )}
              </div>
            </CardHeader>
            <CardContent>
              {editMode ? (
                <div className="space-y-4">
                  <div className="grid gap-4 md:grid-cols-2">
                    <div className="space-y-2">
                      <Label htmlFor="dailyLimit">Daily Limit (KES)</Label>
                      <Input
                        id="dailyLimit"
                        type="number"
                        value={newDailyLimit}
                        onChange={(e) => setNewDailyLimit(Number(e.target.value))}
                        min={0}
                      />
                    </div>
                    <div className="space-y-2">
                      <Label htmlFor="monthlyLimit">Monthly Limit (KES)</Label>
                      <Input
                        id="monthlyLimit"
                        type="number"
                        value={newMonthlyLimit}
                        onChange={(e) => setNewMonthlyLimit(Number(e.target.value))}
                        min={0}
                      />
                    </div>
                  </div>
                  <div className="flex gap-2">
                    <Button onClick={saveBudget} disabled={saving}>
                      {saving ? (
                        <>
                          <Loader2 className="mr-2 h-4 w-4 animate-spin" />
                          Saving...
                        </>
                      ) : (
                        'Save Changes'
                      )}
                    </Button>
                    <Button variant="outline" onClick={() => setEditMode(false)}>
                      Cancel
                    </Button>
                  </div>
                </div>
              ) : (
                <div className="grid gap-4 md:grid-cols-2">
                  <div className="bg-gray-50 p-4 rounded">
                    <p className="text-sm text-gray-600">Daily Limit</p>
                    <p className="text-gray-900">KES {budget.dailyLimit}</p>
                  </div>
                  <div className="bg-gray-50 p-4 rounded">
                    <p className="text-sm text-gray-600">Monthly Limit</p>
                    <p className="text-gray-900">KES {budget.monthlyLimit}</p>
                  </div>
                </div>
              )}
            </CardContent>
          </Card>
        </>
      )}
    </div>
  );
}
