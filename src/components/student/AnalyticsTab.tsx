// analyticsTab.tsx
import { useState, useEffect } from 'react';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '../ui/card';
import { Button } from '../ui/button';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '../ui/select';
import { Calendar } from '../ui/calendar';
import { Popover, PopoverContent, PopoverTrigger } from '../ui/popover';
import {
  DollarSign, ShoppingCart, TrendingUp, CalendarIcon, Download, RefreshCw,
  Coffee, UtensilsCrossed, Moon, Flame, Beef, Wheat, Droplet
} from 'lucide-react';
import { format, subDays, startOfMonth, startOfWeek } from 'date-fns';
import { projectId } from '../../utils/supabase/info';
import { toast } from 'sonner';

interface AnalyticsTabProps {
  accessToken: string;
}

export function AnalyticsTab({ accessToken }: AnalyticsTabProps) {
  const [analytics, setAnalytics] = useState<any>(null);
  const [loading, setLoading] = useState(false);
  const [dateRange, setDateRange] = useState('30days');
  const [customStartDate, setCustomStartDate] = useState<Date | undefined>(undefined);
  const [customEndDate, setCustomEndDate] = useState<Date | undefined>(undefined);
  const [showStartCalendar, setShowStartCalendar] = useState(false);
  const [showEndCalendar, setShowEndCalendar] = useState(false);

  useEffect(() => {
    fetchAnalytics();
  }, [dateRange, customStartDate, customEndDate]);

  const fetchAnalytics = async () => {
    setLoading(true);
    try {
      let url = `https://${projectId}.supabase.co/functions/v1/make-server-493cc528/student/analytics`;

      if (dateRange === 'custom' && customStartDate && customEndDate) {
        url += `?startDate=${format(customStartDate, 'yyyy-MM-dd')}&endDate=${format(customEndDate, 'yyyy-MM-dd')}`;
      } else if (dateRange !== 'all') {
        const today = new Date();
        let startDate: Date;

        switch (dateRange) {
          case 'today':
            startDate = today;
            break;
          case 'week':
            startDate = startOfWeek(today);
            break;
          case 'month':
            startDate = startOfMonth(today);
            break;
          case '7days':
            startDate = subDays(today, 7);
            break;
          case '30days':
            startDate = subDays(today, 30);
            break;
          default:
            startDate = today;
        }

        url += `?startDate=${format(startDate, 'yyyy-MM-dd')}&endDate=${format(today, 'yyyy-MM-dd')}`;
      }

      const response = await fetch(url, {
        headers: { 'Authorization': `Bearer ${accessToken}` },
      });

      if (!response.ok) {
        const error = await response.json();
        toast.error(`Failed: ${error.error}`);
        return;
      }

      setAnalytics(await response.json());
    } catch (e) {
      toast.error("Could not fetch analytics");
    } finally {
      setLoading(false);
    }
  };

  const handleExportReport = () => {
    if (!analytics) return toast.error("No data to export");

    const csvContent = [
      ['MealPal Student Analytics Report'],
      ['Generated', new Date().toLocaleString()],
      [],
      ['Category', 'Value'],
      ['Total Transactions', analytics.totalTransactions],
      ['Total Spending (KES)', analytics.totalSpending.toFixed(2)],
      ['Average Transaction (KES)', analytics.averageTransactionValue.toFixed(2)],
      ['Breakfast Spending', analytics.breakfastSpending.toFixed(2)],
      ['Lunch Spending', analytics.lunchSpending.toFixed(2)],
      ['Supper Spending', analytics.supperSpending.toFixed(2)],
      ['Beverages', analytics.beverageSpending.toFixed(2)],
      ['Desserts', analytics.dessertSpending.toFixed(2)],
      [],
      ['Nutritional Totals'],
      ['Calories', analytics.nutritionTotals.calories],
      ['Protein (g)', analytics.nutritionTotals.protein.toFixed(1)],
      ['Carbs (g)', analytics.nutritionTotals.carbs.toFixed(1)],
      ['Fats (g)', analytics.nutritionTotals.fats.toFixed(1)],
    ].map(r => r.join(",")).join("\n");

    const blob = new Blob([csvContent], { type: "text/csv;charset=utf-8;" });
    const link = document.createElement("a");
    link.href = URL.createObjectURL(blob);
    link.download = `student-analytics-${format(new Date(), "yyyy-MM-dd")}.csv`;
    link.click();
    toast.success("Report exported");
  };

  if (loading) {
    return (
      <div className="flex justify-center py-12">
        <div className="w-12 h-12 border-4 border-orange-500 border-t-transparent rounded-full animate-spin"></div>
      </div>
    );
  }

  if (!analytics) {
    return (
      <Card>
        <CardContent className="py-12">
          <p className="text-center text-gray-500">No analytics data available</p>
        </CardContent>
      </Card>
    );
  }

  return (
    <div className="space-y-4 sm:space-y-6">
      {/* HEADER */}
      <div className="flex flex-col sm:flex-row justify-between gap-3">
        <div>
          <h2 className="text-xl">My Analytics</h2>
          <p className="text-gray-600 text-sm">Track your spending & nutrition</p>
        </div>
        <div className="flex gap-2">
          <Button onClick={fetchAnalytics} variant="outline" className="gap-2">
            <RefreshCw className="w-4 h-4" /> Refresh
          </Button>
          <Button onClick={handleExportReport} className="bg-orange-500 gap-2">
            <Download className="w-4 h-4" /> Export
          </Button>
        </div>
      </div>

      {/* DATE RANGE */}
      <Card>
        <CardHeader>
          <CardTitle className="text-base">Date Range</CardTitle>
        </CardHeader>
        <CardContent>
          <div className="flex flex-col sm:flex-row gap-3">
            <Select value={dateRange} onValueChange={setDateRange}>
              <SelectTrigger className="w-[200px]"><SelectValue /></SelectTrigger>
              <SelectContent>
                <SelectItem value="all">All Time</SelectItem>
                <SelectItem value="today">Today</SelectItem>
                <SelectItem value="7days">Last 7 Days</SelectItem>
                <SelectItem value="30days">Last 30 Days</SelectItem>
                <SelectItem value="week">This Week</SelectItem>
                <SelectItem value="month">This Month</SelectItem>
                <SelectItem value="custom">Custom</SelectItem>
              </SelectContent>
            </Select>

            {dateRange === 'custom' && (
              <div className="flex gap-2">
                {/* Start Date */}
                <Popover open={showStartCalendar} onOpenChange={setShowStartCalendar}>
                  <PopoverTrigger asChild>
                    <Button variant="outline" className="gap-2">
                      <CalendarIcon className="w-4 h-4" />
                      {customStartDate ? format(customStartDate, "PP") : "Start Date"}
                    </Button>
                  </PopoverTrigger>
                  <PopoverContent className="p-0">
                    <Calendar
                      mode="single"
                      selected={customStartDate}
                      onSelect={(d) => { setCustomStartDate(d); setShowStartCalendar(false); }}
                      disabled={[{ after: new Date() }]}
                    />
                  </PopoverContent>
                </Popover>

                {/* End Date */}
                <Popover open={showEndCalendar} onOpenChange={setShowEndCalendar}>
                  <PopoverTrigger asChild>
                    <Button variant="outline" className="gap-2">
                      <CalendarIcon className="w-4 h-4" />
                      {customEndDate ? format(customEndDate, "PP") : "End Date"}
                    </Button>
                  </PopoverTrigger>
                  <PopoverContent className="p-0">
                    <Calendar
                         mode="single"
                         selected={customEndDate}
                         onSelect={(d) => { 
                         setCustomEndDate(d); 
                         setShowEndCalendar(false); 
                 }}
                   disabled={
                     [
                      { after: new Date() },
                         ...(customStartDate ? [{ before: customStartDate }] : [])
             ]
                            }
                    />

                  </PopoverContent>
                </Popover>
              </div>
            )}
          </div>
        </CardContent>
      </Card>

      {/* SUMMARY CARDS */}
      <div className="grid grid-cols-2 lg:grid-cols-4 gap-4">
        <Card><CardHeader className="flex justify-between">
          <CardTitle className="text-sm">Total Spending</CardTitle>
          <DollarSign className="w-4 h-4 text-gray-500" />
        </CardHeader>
        <CardContent>
          <div className="text-orange-600">KES {analytics.totalSpending.toFixed(2)}</div>
        </CardContent></Card>

        <Card><CardHeader className="flex justify-between">
          <CardTitle className="text-sm">Transactions</CardTitle>
          <ShoppingCart className="w-4 h-4 text-gray-500" />
        </CardHeader>
        <CardContent>
          <div className="text-orange-600">{analytics.totalTransactions}</div>
        </CardContent></Card>

        <Card><CardHeader className="flex justify-between">
          <CardTitle className="text-sm">Avg Spent</CardTitle>
          <TrendingUp className="w-4 h-4 text-gray-500" />
        </CardHeader>
        <CardContent>
          <div className="text-orange-600">KES {analytics.averageTransactionValue.toFixed(2)}</div>
        </CardContent></Card>

        <Card><CardHeader className="flex justify-between">
          <CardTitle className="text-sm">Calories</CardTitle>
          <Flame className="w-4 h-4 text-gray-500" />
        </CardHeader>
        <CardContent>
          <div className="text-orange-600">{analytics.nutritionTotals.calories}</div>
        </CardContent></Card>
      </div>

      {/* TWO BIG SECTIONS */}
      <div className="grid grid-cols-1 md:grid-cols-2 gap-6">

        {/* Spending by Meal */}
        <Card>
          <CardHeader>
            <CardTitle>Spending by Meal</CardTitle>
            <CardDescription>Breakdown of your expenses</CardDescription>
          </CardHeader>
          <CardContent className="space-y-4">

            <div className="flex justify-between p-3 bg-yellow-50 rounded-lg">
              <div className="flex gap-3 items-center">
                <Coffee className="w-5 h-5 text-yellow-600" /> Breakfast
              </div>
              <span>KES {analytics.breakfastSpending.toFixed(2)}</span>
            </div>

            <div className="flex justify-between p-3 bg-orange-50 rounded-lg">
              <div className="flex gap-3 items-center">
                <UtensilsCrossed className="w-5 h-5 text-orange-600" /> Lunch
              </div>
              <span>KES {analytics.lunchSpending.toFixed(2)}</span>
            </div>

            <div className="flex justify-between p-3 bg-purple-50 rounded-lg">
              <div className="flex gap-3 items-center">
                <Moon className="w-5 h-5 text-purple-600" /> Supper
              </div>
              <span>KES {analytics.supperSpending.toFixed(2)}</span>
            </div>

            <div className="border-t pt-3 space-y-2">
              <div className="flex justify-between"><span>Beverages</span> <span>KES {analytics.beverageSpending.toFixed(2)}</span></div>
              <div className="flex justify-between"><span>Desserts</span> <span>KES {analytics.dessertSpending.toFixed(2)}</span></div>
            </div>

          </CardContent>
        </Card>

        {/* Nutrition */}
        <Card>
          <CardHeader>
            <CardTitle>Nutrition Summary</CardTitle>
            <CardDescription>Your nutritional totals</CardDescription>
          </CardHeader>
          <CardContent className="space-y-4">

            <div className="flex justify-between p-3 bg-red-50 rounded-lg">
              <div className="flex gap-3 items-center">
                <Flame className="w-5 h-5 text-red-600" /> Calories
              </div>
              <span>{analytics.nutritionTotals.calories}</span>
            </div>

            <div className="flex justify-between p-3 bg-orange-50 rounded-lg">
              <div className="flex gap-3 items-center">
                <Beef className="w-5 h-5 text-orange-600" /> Protein
              </div>
              <span>{analytics.nutritionTotals.protein.toFixed(1)}g</span>
            </div>

            <div className="flex justify-between p-3 bg-yellow-50 rounded-lg">
              <div className="flex gap-3 items-center">
                <Wheat className="w-5 h-5 text-yellow-600" /> Carbs
              </div>
              <span>{analytics.nutritionTotals.carbs.toFixed(1)}g</span>
            </div>

            <div className="flex justify-between p-3 bg-blue-50 rounded-lg">
              <div className="flex gap-3 items-center">
                <Droplet className="w-5 h-5 text-blue-600" /> Fats
              </div>
              <span>{analytics.nutritionTotals.fats.toFixed(1)}g</span>
            </div>

          </CardContent>
        </Card>

      </div>
    </div>
  );
}
