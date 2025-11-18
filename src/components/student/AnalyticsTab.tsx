import { useState, useEffect } from 'react';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '../ui/card';
import { Button } from '../ui/button';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '../ui/select';
import { Calendar } from '../ui/calendar';
import { Popover, PopoverContent, PopoverTrigger } from '../ui/popover';
import { DollarSign, ShoppingCart, TrendingUp, CalendarIcon, Download, RefreshCw, Coffee, UtensilsCrossed, Moon, Flame, Beef, Wheat, Droplet } from 'lucide-react';
import { format, subDays, startOfMonth, startOfWeek } from 'date-fns';
import { projectId } from '../../utils/supabase/info';
import { toast } from 'sonner;


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
        headers: {
          'Authorization': `Bearer ${accessToken}`,
        },
      });

      if (response.ok) {
        const data = await response.json();
        setAnalytics(data);
      } else {
        const error = await response.json();
        toast.error(`Failed to fetch analytics: ${error.error}`);
      }
    } catch (error) {
      console.error('Error fetching analytics:', error);
      toast.error('An error occurred while fetching analytics');
    } finally {
      setLoading(false);
    }
  };

  const handleExportReport = () => {
    if (!analytics) {
      toast.error('No data to export');
      return;
    }

    const csvContent = [
      ['MealPal Student Analytics Report'],
      ['Generated:', new Date().toLocaleString()],
      ['Date Range:', dateRange === 'all' ? 'All Time' : dateRange === 'custom' ? `${format(customStartDate!, 'PP')} - ${format(customEndDate!, 'PP')}` : dateRange],
      [],
      ['Category', 'Value'],
      ['Total Transactions', analytics.totalTransactions],
      ['Total Spending (KES)', analytics.totalSpending.toFixed(2)],
      ['Average Transaction (KES)', analytics.averageTransactionValue.toFixed(2)],
      ['Breakfast Spending (KES)', analytics.breakfastSpending.toFixed(2)],
      ['Lunch Spending (KES)', analytics.lunchSpending.toFixed(2)],
      ['Supper Spending (KES)', analytics.supperSpending.toFixed(2)],
      ['Beverage Spending (KES)', analytics.beverageSpending.toFixed(2)],
      ['Dessert Spending (KES)', analytics.dessertSpending.toFixed(2)],
      [],
      ['Nutritional Totals'],
      ['Total Calories', analytics.nutritionTotals.calories],
      ['Total Protein (g)', analytics.nutritionTotals.protein.toFixed(1)],
      ['Total Carbs (g)', analytics.nutritionTotals.carbs.toFixed(1)],
      ['Total Fats (g)', analytics.nutritionTotals.fats.toFixed(1)],
    ].map(row => row.join(',')).join('\n');

    const blob = new Blob([csvContent], { type: 'text/csv;charset=utf-8;' });
    const link = document.createElement('a');
    const url = URL.createObjectURL(blob);
    link.setAttribute('href', url);
    link.setAttribute('download', `student-analytics-${format(new Date(), 'yyyy-MM-dd')}.csv`);
    link.style.visibility = 'hidden';
    document.body.appendChild(link);
    link.click();
    document.body.removeChild(link);
    
    toast.success('Report exported successfully!');
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
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3">
        <div>
          <h2 className="mb-1 text-lg sm:text-xl">My Analytics</h2>
          <p className="text-gray-600 text-sm">Track your spending and nutrition</p>
        </div>
        <div className="flex flex-col sm:flex-row gap-2">
          <Button
            onClick={fetchAnalytics}
            variant="outline"
            className="gap-2"
            size="sm"
          >
            <RefreshCw className="w-4 h-4" />
            Refresh
          </Button>
          <Button
            onClick={handleExportReport}
            className="bg-orange-500 hover:bg-orange-600 gap-2"
            size="sm"
          >
            <Download className="w-4 h-4" />
            Export Report
          </Button>
        </div>
      </div>

      {/* Date Range Filter */}
      <Card>
        <CardHeader>
          <CardTitle className="text-base">Date Range</CardTitle>
        </CardHeader>
        <CardContent>
          <div className="flex flex-col sm:flex-row gap-3">
            <Select value={dateRange} onValueChange={setDateRange}>
              <SelectTrigger className="w-full sm:w-[200px]">
                <SelectValue />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="all">All Time</SelectItem>
                <SelectItem value="today">Today</SelectItem>
                <SelectItem value="7days">Last 7 Days</SelectItem>
                <SelectItem value="30days">Last 30 Days</SelectItem>
                <SelectItem value="week">This Week</SelectItem>
                <SelectItem value="month">This Month</SelectItem>
                <SelectItem value="custom">Custom Range</SelectItem>
              </SelectContent>
            </Select>

            {dateRange === 'custom' && (
              <div className="flex flex-col sm:flex-row gap-2">
                <Popover open={showStartCalendar} onOpenChange={setShowStartCalendar}>
                  <PopoverTrigger asChild>
                    <Button variant="outline" className="gap-2 justify-start text-sm">
                      <CalendarIcon className="w-4 h-4" />
                      {customStartDate ? format(customStartDate, 'PP') : 'Start Date'}
                    </Button>
                  </PopoverTrigger>
                  <PopoverContent className="w-auto p-0">
                    <Calendar
                      mode="single"
                      selected={customStartDate}
                      onSelect={(date) => {
                        setCustomStartDate(date);
                        setShowStartCalendar(false);
                      }}
                      disabled={(date) => date > new Date()}
                    />
                  </PopoverContent>
                </Popover>

                <Popover open={showEndCalendar} onOpenChange={setShowEndCalendar}>
                  <PopoverTrigger asChild>
                    <Button variant="outline" className="gap-2 justify-start text-sm">
                      <CalendarIcon className="w-4 h-4" />
                      {customEndDate ? format(customEndDate, 'PP') : 'End Date'}
                    </Button>
                  </PopoverTrigger>
                  <PopoverContent className="w-auto p-0">
                    <Calendar
                      mode="single"
                      selected={customEndDate}
                      onSelect={(date) => {
                        setCustomEndDate(date);
                        setShowEndCalendar(false);
                      }}
                      disabled={(date) => date > new Date() || (customStartDate && date < customStartDate)}
                    />
                  </PopoverContent>
                </Popover>
              </div>
            )}
          </div>
        </CardContent>
      </Card>

      {/* Summary Cards */}
      <div className="grid gap-3 sm:gap-4 grid-cols-2 lg:grid-cols-4">
        <Card>
          <CardHeader className="flex flex-row items-center justify-between pb-2">
            <CardTitle className="text-sm">Total Spending</CardTitle>
            <DollarSign className="w-4 h-4 text-gray-500" />
          </CardHeader>
          <CardContent>
            <div className="text-orange-600">KES {analytics.totalSpending.toFixed(2)}</div>
            <p className="text-xs text-gray-500 mt-1">All purchases</p>
          </CardContent>
        </Card>

        <Card>
          <CardHeader className="flex flex-row items-center justify-between pb-2">
            <CardTitle className="text-sm">Transactions</CardTitle>
            <ShoppingCart className="w-4 h-4 text-gray-500" />
          </CardHeader>
          <CardContent>
            <div className="text-orange-600">{analytics.totalTransactions}</div>
            <p className="text-xs text-gray-500 mt-1">Total purchases</p>
          </CardContent>
        </Card>

        <Card>
          <CardHeader className="flex flex-row items-center justify-between pb-2">
            <CardTitle className="text-sm">Average Spent</CardTitle>
            <TrendingUp className="w-4 h-4 text-gray-500" />
          </CardHeader>
          <CardContent>
            <div className="text-orange-600">KES {analytics.averageTransactionValue.toFixed(2)}</div>
            <p className="text-xs text-gray-500 mt-1">Per meal</p>
          </CardContent>
        </Card>

        <Card>
          <CardHeader className="flex flex-row items-center justify-between pb-2">
            <CardTitle className="text-sm">Total Calories</CardTitle>
            <Flame className="w-4 h-4 text-gray-500" />
          </CardHeader>
          <CardContent>
            <div className="text-orange-600">{analytics.nutritionTotals.calories}</div>
            <p className="text-xs text-gray-500 mt-1">Consumed</p>
          </CardContent>
        </Card>
      </div>

      {/* Spending by Meal Type */}
      <div className="grid gap-4 sm:gap-6 grid-cols-1 md:grid-cols-2">
        <Card>
          <CardHeader>
            <CardTitle>Spending by Meal</CardTitle>
            <CardDescription>Breakdown of your meal expenses</CardDescription>
          </CardHeader>
          <CardContent className="space-y-4">
            <div className="flex items-center justify-between p-3 bg-yellow-50 rounded-lg">
              <div className="flex items-center gap-3">
                <Coffee className="w-5 h-5 text-yellow-600" />
                <span>Breakfast</span>
              </div>
              <span className="text-yellow-700">KES {analytics.breakfastSpending.toFixed(2)}</span>
            </div>

            <div className="flex items-center justify-between p-3 bg-orange-50 rounded-lg">
              <div className="flex items-center gap-3">
                <UtensilsCrossed className="w-5 h-5 text-orange-600" />
                <span>Lunch</span>
              </div>
              <span className="text-orange-700">KES {analytics.lunchSpending.toFixed(2)}</span>
            </div>

            <div className="flex items-center justify-between p-3 bg-purple-50 rounded-lg">
              <div className="flex items-center gap-3">
                <Moon className="w-5 h-5 text-purple-600" />
                <span>Supper</span>
              </div>
              <span className="text-purple-700">KES {analytics.supperSpending.toFixed(2)}</span>
            </div>

            <div className="pt-3 border-t space-y-2">
              <div className="flex justify-between text-sm">
                <span className="text-gray-600">Beverages</span>
                <span>KES {analytics.beverageSpending.toFixed(2)}</span>
              </div>
              <div className="flex justify-between text-sm">
                <span className="text-gray-600">Desserts</span>
                <span>KES {analytics.dessertSpending.toFixed(2)}</span>
              </div>
            </div>
          </CardContent>
        </Card>

        <Card>
          <CardHeader>
            <CardTitle>Nutrition Summary</CardTitle>
            <CardDescription>Total nutritional intake</CardDescription>
          </CardHeader>
          <CardContent className="space-y-4">
            <div className="space-y-3">
              <div className="flex items-center justify-between p-3 bg-red-50 rounded-lg">
                <div className="flex items-center gap-3">
                  <Flame className="w-5 h-5 text-red-500" />
                  <span>Calories</span>
                </div>
                <span className="text-red-600">{analytics.nutritionTotals.calories}</span>
              </div>

              <div className="flex items-center justify-between p-3 bg-orange-50 rounded-lg">
                <div className="flex items-center gap-3">
                  <Beef className="w-5 h-5 text-orange-600" />
                  <span>Protein</span>
                </div>
                <span className="text-orange-700">{analytics.nutritionTotals.protein.toFixed(1)}g</span>
              </div>

              <div className="flex items-center justify-between p-3 bg-yellow-50 rounded-lg">
                <div className="flex items-center gap-3">
                  <Wheat className="w-5 h-5 text-yellow-600" />
                  <span>Carbs</span>
                </div>
                <span className="text-yellow-700">{analytics.nutritionTotals.carbs.toFixed(1)}g</span>
              </div>

              <div className="flex items-center justify-between p-3 bg-blue-50 rounded-lg">
                <div className="flex items-center gap-3">
                  <Droplet className="w-5 h-5 text-blue-500" />
                  <span>Fats</span>
                </div>
                <span className="text-blue-600">{analytics.nutritionTotals.fats.toFixed(1)}g</span>
              </div>
            </div>
          </CardContent>
        </Card>
      </div>

      {/* Recent Transactions */}
      {analytics.recentTransactions && analytics.recentTransactions.length > 0 && (
        <Card>
          <CardHeader>
            <CardTitle>Recent Transactions</CardTitle>
            <CardDescription>Your latest purchases</CardDescription>
          </CardHeader>
          <CardContent>
            <div className="space-y-3">
              {analytics.recentTransactions.map((transaction: any) => (
                <div 
                  key={transaction.id}
                  className="flex flex-col sm:flex-row sm:items-center justify-between p-3 bg-gray-50 rounded-lg gap-2"
                >
                  <div className="flex-1">
                    <h4>{transaction.itemName}</h4>
                    <p className="text-sm text-gray-500">
                      {format(new Date(transaction.date), 'PPp')}
                    </p>
                  </div>
                  <div className="flex items-center gap-3">
                    <span className="text-xs px-2 py-1 bg-orange-100 text-orange-800 rounded">
                      {transaction.category}
                    </span>
                    <span className="text-orange-600">KES {transaction.amount.toFixed(2)}</span>
                  </div>
                </div>
              ))}
            </div>
          </CardContent>
        </Card>
      )}
    </div>
  );
}
