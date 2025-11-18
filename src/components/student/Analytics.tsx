import { useState, useEffect } from 'react';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '../ui/card';
import { BarChart, Bar, LineChart, Line, PieChart, Pie, Cell, XAxis, YAxis, CartesianGrid, Tooltip, Legend, ResponsiveContainer } from 'recharts';
import { projectId } from '../../utils/supabase/info';
import { createClient } from '../../utils/supabase/client';
import { TrendingUp, Calendar, DollarSign, Loader2 } from 'lucide-react';

interface AnalyticsProps {
  userId: string;
}

export function Analytics({ userId }: AnalyticsProps) {
  const [transactions, setTransactions] = useState<any[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    loadTransactions();
  }, []);

  const loadTransactions = async () => {
    setLoading(true);
    try {
      const supabase = createClient();
      const { data: { session } } = await supabase.auth.getSession();

      if (!session) return;

      const thirtyDaysAgo = new Date();
      thirtyDaysAgo.setDate(thirtyDaysAgo.getDate() - 30);
      const startDate = thirtyDaysAgo.toISOString().split('T')[0];
      const endDate = new Date().toISOString().split('T')[0];

      const response = await fetch(
        `https://${projectId}.supabase.co/functions/v1/make-server-493cc528/transactions?startDate=${startDate}&endDate=${endDate}`,
        {
          headers: { Authorization: `Bearer ${session.access_token}` },
        }
      );
      const data = await response.json();
      setTransactions(data.transactions || []);
    } catch (error) {
      console.error('Error loading transactions:', error);
    }
    setLoading(false);
  };

  // Daily spending data
  const dailySpending = transactions.reduce((acc, t) => {
    const date = t.date;
    if (!acc[date]) acc[date] = 0;
    acc[date] += t.amount;
    return acc;
  }, {} as Record<string, number>);

  const dailyData = Object.entries(dailySpending)
    .map(([date, amount]) => ({
      date: new Date(date).toLocaleDateString('en-US', { month: 'short', day: 'numeric' }),
      amount,
    }))
    .slice(-14); // Last 14 days

  // Meal type distribution
  const mealTypeData = transactions.reduce((acc, t) => {
    const type = t.mealType || 'Other';
    if (!acc[type]) acc[type] = { name: type, count: 0, amount: 0 };
    acc[type].count += 1;
    acc[type].amount += t.amount;
    return acc;
  }, {} as Record<string, any>);

  const mealTypeArray = Object.values(mealTypeData);

  // Weekly summary
  const weeklyData = transactions.reduce((acc, t) => {
    const date = new Date(t.date);
    const week = Math.floor((date.getDate() - 1) / 7) + 1;
    const key = `Week ${week}`;
    if (!acc[key]) acc[key] = 0;
    acc[key] += t.amount;
    return acc;
  }, {} as Record<string, number>);

  const weeklyArray = Object.entries(weeklyData).map(([week, amount]) => ({
    week,
    amount,
  }));

  const COLORS = ['#10b981', '#3b82f6', '#f59e0b', '#ef4444', '#8b5cf6'];

  const totalSpent = transactions.reduce((sum, t) => sum + t.amount, 0);
  const avgDaily = dailyData.length > 0 ? totalSpent / dailyData.length : 0;
  const totalMeals = transactions.length;

  return (
    <div className="space-y-6">
      <Card>
        <CardHeader>
          <CardTitle className="flex items-center gap-2">
            <TrendingUp className="h-5 w-5 text-green-600" />
            Spending Analytics
          </CardTitle>
          <CardDescription>
            Visualize your cafeteria spending patterns over the last 30 days
          </CardDescription>
        </CardHeader>
      </Card>

      {loading ? (
        <div className="flex items-center justify-center py-12">
          <Loader2 className="h-8 w-8 animate-spin text-green-600" />
        </div>
      ) : transactions.length === 0 ? (
        <Card>
          <CardContent className="py-12">
            <div className="text-center text-gray-500">
              <TrendingUp className="h-12 w-12 mx-auto mb-4 opacity-50" />
              <p>No transaction data available yet</p>
              <p className="text-sm mt-2">Start purchasing meals to see analytics</p>
            </div>
          </CardContent>
        </Card>
      ) : (
        <>
          <div className="grid gap-6 md:grid-cols-3">
            <Card>
              <CardContent className="pt-6">
                <div className="flex items-start justify-between">
                  <div>
                    <p className="text-sm text-gray-600">Total Spent</p>
                    <p className="text-gray-900 mt-1">KES {totalSpent.toFixed(2)}</p>
                  </div>
                  <div className="bg-green-100 p-2 rounded">
                    <DollarSign className="h-5 w-5 text-green-600" />
                  </div>
                </div>
              </CardContent>
            </Card>

            <Card>
              <CardContent className="pt-6">
                <div className="flex items-start justify-between">
                  <div>
                    <p className="text-sm text-gray-600">Avg. Daily</p>
                    <p className="text-gray-900 mt-1">KES {avgDaily.toFixed(2)}</p>
                  </div>
                  <div className="bg-blue-100 p-2 rounded">
                    <Calendar className="h-5 w-5 text-blue-600" />
                  </div>
                </div>
              </CardContent>
            </Card>

            <Card>
              <CardContent className="pt-6">
                <div className="flex items-start justify-between">
                  <div>
                    <p className="text-sm text-gray-600">Total Meals</p>
                    <p className="text-gray-900 mt-1">{totalMeals}</p>
                  </div>
                  <div className="bg-purple-100 p-2 rounded">
                    <TrendingUp className="h-5 w-5 text-purple-600" />
                  </div>
                </div>
              </CardContent>
            </Card>
          </div>

          <Card>
            <CardHeader>
              <CardTitle>Daily Spending Trend</CardTitle>
              <CardDescription>Your spending over the last 14 days</CardDescription>
            </CardHeader>
            <CardContent>
              <ResponsiveContainer width="100%" height={300}>
                <LineChart data={dailyData}>
                  <CartesianGrid strokeDasharray="3 3" />
                  <XAxis dataKey="date" />
                  <YAxis />
                  <Tooltip />
                  <Legend />
                  <Line type="monotone" dataKey="amount" stroke="#10b981" strokeWidth={2} name="Amount (KES)" />
                </LineChart>
              </ResponsiveContainer>
            </CardContent>
          </Card>

          <div className="grid gap-6 md:grid-cols-2">
            <Card>
              <CardHeader>
                <CardTitle>Meal Type Distribution</CardTitle>
                <CardDescription>Breakdown by meal type</CardDescription>
              </CardHeader>
              <CardContent>
                <ResponsiveContainer width="100%" height={300}>
                  <PieChart>
                    <Pie
                      data={mealTypeArray}
                      cx="50%"
                      cy="50%"
                      labelLine={false}
                      label={({ name, percent }) => `${name}: ${(percent * 100).toFixed(0)}%`}
                      outerRadius={80}
                      fill="#8884d8"
                      dataKey="amount"
                    >
                      {mealTypeArray.map((entry, index) => (
                        <Cell key={`cell-${index}`} fill={COLORS[index % COLORS.length]} />
                      ))}
                    </Pie>
                    <Tooltip />
                  </PieChart>
                </ResponsiveContainer>
              </CardContent>
            </Card>

            <Card>
              <CardHeader>
                <CardTitle>Weekly Summary</CardTitle>
                <CardDescription>Spending by week</CardDescription>
              </CardHeader>
              <CardContent>
                <ResponsiveContainer width="100%" height={300}>
                  <BarChart data={weeklyArray}>
                    <CartesianGrid strokeDasharray="3 3" />
                    <XAxis dataKey="week" />
                    <YAxis />
                    <Tooltip />
                    <Legend />
                    <Bar dataKey="amount" fill="#3b82f6" name="Amount (KES)" />
                  </BarChart>
                </ResponsiveContainer>
              </CardContent>
            </Card>
          </div>
        </>
      )}
    </div>
  );
}