import { useState, useEffect } from 'react';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '../ui/card';
import { Button } from '../ui/button';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '../ui/select';
import { Calendar } from '../ui/calendar';
import { Popover, PopoverContent, PopoverTrigger } from '../ui/popover';
import { Users, DollarSign, ShoppingCart, TrendingUp, Download, CalendarIcon, RefreshCw } from 'lucide-react';
import { format, subDays, startOfMonth, endOfMonth, startOfWeek, endOfWeek } from 'date-fns';
import { projectId } from '../../utils/supabase/info';
import { toast } from 'sonner';


interface ReportsTabProps {
  accessToken: string;
}

export function ReportsTab({ accessToken }: ReportsTabProps) {
  const [analytics, setAnalytics] = useState<any>(null);
  const [loading, setLoading] = useState(false);
  const [dateRange, setDateRange] = useState('all');
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
      let url = `https://${projectId}.supabase.co/functions/v1/make-server-493cc528/admin/analytics`;
      
      // Add date range parameters
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

    // Create CSV content
    const csvContent = [
      ['MealPal Analytics Report'],
      ['Generated:', new Date().toLocaleString()],
      ['Date Range:', dateRange === 'all' ? 'All Time' : dateRange === 'custom' ? `${format(customStartDate!, 'PP')} - ${format(customEndDate!, 'PP')}` : dateRange],
      [],
      ['Metric', 'Value'],
      ['Total Users', analytics.totalUsers],
      ['Students', analytics.totalStudents],
      ['Cafeteria Admins', analytics.totalCafeteriaAdmins],
      ['System Admins', analytics.totalSystemAdmins],
      ['Total Transactions', analytics.totalTransactions],
      ['Total Revenue (KES)', analytics.totalRevenue.toFixed(2)],
      ['Average Transaction (KES)', analytics.averageTransactionValue.toFixed(2)],
      ['Revenue per User (KES)', analytics.totalUsers > 0 ? (analytics.totalRevenue / analytics.totalUsers).toFixed(2) : '0.00'],
    ].map(row => row.join(',')).join('\n');

    // Create and download file
    const blob = new Blob([csvContent], { type: 'text/csv;charset=utf-8;' });
    const link = document.createElement('a');
    const url = URL.createObjectURL(blob);
    link.setAttribute('href', url);
    link.setAttribute('download', `mealpal-analytics-${format(new Date(), 'yyyy-MM-dd')}.csv`);
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
          <h2 className="mb-1 text-lg sm:text-xl">System Analytics</h2>
          <p className="text-gray-600 text-sm">Overview of platform metrics</p>
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

      <div className="grid gap-3 sm:gap-4 grid-cols-2 lg:grid-cols-4">
        <Card>
          <CardHeader className="flex flex-row items-center justify-between pb-2">
            <CardTitle className="text-sm">Total Users</CardTitle>
            <Users className="w-4 h-4 text-gray-500" />
          </CardHeader>
          <CardContent>
            <div className="text-orange-600">{analytics.totalUsers}</div>
            <p className="text-xs text-gray-500 mt-1">Registered accounts</p>
          </CardContent>
        </Card>

        <Card>
          <CardHeader className="flex flex-row items-center justify-between pb-2">
            <CardTitle className="text-sm">Total Revenue</CardTitle>
            <DollarSign className="w-4 h-4 text-gray-500" />
          </CardHeader>
          <CardContent>
            <div className="text-orange-600">KES {analytics.totalRevenue.toFixed(2)}</div>
            <p className="text-xs text-gray-500 mt-1">All transactions</p>
          </CardContent>
        </Card>

        <Card>
          <CardHeader className="flex flex-row items-center justify-between pb-2">
            <CardTitle className="text-sm">Total Transactions</CardTitle>
            <ShoppingCart className="w-4 h-4 text-gray-500" />
          </CardHeader>
          <CardContent>
            <div className="text-orange-600">{analytics.totalTransactions}</div>
            <p className="text-xs text-gray-500 mt-1">Purchases made</p>
          </CardContent>
        </Card>

        <Card>
          <CardHeader className="flex flex-row items-center justify-between pb-2">
            <CardTitle className="text-sm">Avg Transaction</CardTitle>
            <TrendingUp className="w-4 h-4 text-gray-500" />
          </CardHeader>
          <CardContent>
            <div className="text-orange-600">KES {analytics.averageTransactionValue.toFixed(2)}</div>
            <p className="text-xs text-gray-500 mt-1">Per purchase</p>
          </CardContent>
        </Card>
      </div>

      <div className="grid gap-4 sm:gap-6 grid-cols-1 md:grid-cols-2">
        <Card>
          <CardHeader>
            <CardTitle>User Distribution</CardTitle>
            <CardDescription>Breakdown of users by role</CardDescription>
          </CardHeader>
          <CardContent className="space-y-4">
            <div className="flex items-center justify-between p-3 bg-blue-50 rounded-lg">
              <div className="flex items-center gap-3">
                <div className="w-3 h-3 rounded-full bg-blue-500"></div>
                <span>Students</span>
              </div>
              <span className="text-blue-600">{analytics.totalStudents}</span>
            </div>

            <div className="flex items-center justify-between p-3 bg-purple-50 rounded-lg">
              <div className="flex items-center gap-3">
                <div className="w-3 h-3 rounded-full bg-purple-500"></div>
                <span>Cafeteria Admins</span>
              </div>
              <span className="text-purple-600">{analytics.totalCafeteriaAdmins}</span>
            </div>

            <div className="flex items-center justify-between p-3 bg-red-50 rounded-lg">
              <div className="flex items-center gap-3">
                <div className="w-3 h-3 rounded-full bg-red-500"></div>
                <span>System Admins</span>
              </div>
              <span className="text-red-600">{analytics.totalSystemAdmins}</span>
            </div>
          </CardContent>
        </Card>

        <Card>
          <CardHeader>
            <CardTitle>Platform Health</CardTitle>
            <CardDescription>Key performance indicators</CardDescription>
          </CardHeader>
          <CardContent className="space-y-4">
            <div className="space-y-2">
              <div className="flex justify-between text-sm">
                <span className="text-gray-600">User Engagement</span>
                <span>
                  {analytics.totalUsers > 0 
                    ? ((analytics.totalTransactions / analytics.totalUsers) * 100).toFixed(1) 
                    : 0}%
                </span>
              </div>
              <div className="w-full bg-gray-200 rounded-full h-2">
                <div 
                  className="bg-orange-500 h-2 rounded-full" 
                  style={{ 
                    width: `${Math.min(analytics.totalUsers > 0 ? (analytics.totalTransactions / analytics.totalUsers) * 100 : 0, 100)}%` 
                  }}
                ></div>
              </div>
            </div>

            <div className="space-y-2">
              <div className="flex justify-between text-sm">
                <span className="text-gray-600">Student Adoption</span>
                <span>
                  {analytics.totalUsers > 0 
                    ? ((analytics.totalStudents / analytics.totalUsers) * 100).toFixed(1) 
                    : 0}%
                </span>
              </div>
              <div className="w-full bg-gray-200 rounded-full h-2">
                <div 
                  className="bg-blue-500 h-2 rounded-full" 
                  style={{ 
                    width: `${analytics.totalUsers > 0 ? (analytics.totalStudents / analytics.totalUsers) * 100 : 0}%` 
                  }}
                ></div>
              </div>
            </div>

            <div className="pt-4 border-t">
              <div className="flex justify-between items-center">
                <span className="text-sm text-gray-600">Revenue per User</span>
                <span className="text-orange-600">
                  KES {analytics.totalUsers > 0 ? (analytics.totalRevenue / analytics.totalUsers).toFixed(2) : '0.00'}
                </span>
              </div>
            </div>
          </CardContent>
        </Card>
      </div>

      <Card>
        <CardHeader>
          <CardTitle>System Summary</CardTitle>
          <CardDescription>Detailed platform statistics</CardDescription>
        </CardHeader>
        <CardContent>
          <div className="grid gap-4 md:grid-cols-3">
            <div className="space-y-1">
              <p className="text-sm text-gray-600">Active Students</p>
              <p className="text-orange-600">{analytics.totalStudents}</p>
            </div>
            <div className="space-y-1">
              <p className="text-sm text-gray-600">Cafeteria Staff</p>
              <p className="text-orange-600">{analytics.totalCafeteriaAdmins}</p>
            </div>
            <div className="space-y-1">
              <p className="text-sm text-gray-600">System Administrators</p>
              <p className="text-orange-600">{analytics.totalSystemAdmins}</p>
            </div>
            <div className="space-y-1">
              <p className="text-sm text-gray-600">Total Purchases</p>
              <p className="text-orange-600">{analytics.totalTransactions}</p>
            </div>
            <div className="space-y-1">
              <p className="text-sm text-gray-600">Platform Revenue</p>
              <p className="text-orange-600">KES {analytics.totalRevenue.toFixed(2)}</p>
            </div>
            <div className="space-y-1">
              <p className="text-sm text-gray-600">Average Spending</p>
              <p className="text-orange-600">KES {analytics.averageTransactionValue.toFixed(2)}</p>
            </div>
          </div>
        </CardContent>
      </Card>
    </div>
  );
}