import { useState, useEffect, useMemo, useCallback } from 'react';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '../ui/card';
import { Button } from '../ui/button';
import { Badge } from '../ui/badge';
import { Calendar } from '../ui/calendar';
import { Popover, PopoverContent, PopoverTrigger } from '../ui/popover';
import { Dialog, DialogContent, DialogDescription, DialogHeader, DialogTitle } from '../ui/dialog';
import { Alert, AlertDescription } from '../ui/alert';
import { CalendarIcon, ShoppingCart, Leaf, Flame, AlertCircle, Sparkles, TrendingDown } from 'lucide-react';
import { format } from 'date-fns';
import { projectId, publicAnonKey } from '../../utils/supabase/info';
import { toast } from 'sonner';

interface MenuTabProps {
  accessToken: string;
  onPurchase: () => void;
  budget: any;
}

export function MenuTab({ accessToken, onPurchase, budget }: MenuTabProps) {
  const [selectedDate, setSelectedDate] = useState<Date>(new Date());
  const [menu, setMenu] = useState<any>(null);
  const [loading, setLoading] = useState(false);
  const [selectedItem, setSelectedItem] = useState<any>(null);
  const [showItemDialog, setShowItemDialog] = useState(false);
  const [todaySpending, setTodaySpending] = useState(0);

  // Define getTodayTransactions first (no dependencies on other local functions)
  const getTodayTransactions = useCallback(async () => {
    try {
      const response = await fetch(
        `https://${projectId}.supabase.co/functions/v1/make-server-493cc528/transactions`,
        {
          headers: {
            'Authorization': `Bearer ${accessToken}`,
          },
        }
      );

      if (response.ok) {
        const data = await response.json();
        const today = format(new Date(), 'yyyy-MM-dd');
        return data.filter((t: any) => format(new Date(t.date), 'yyyy-MM-dd') === today);
      }
      return [];
    } catch (error) {
      console.error('Error fetching transactions:', error);
      return [];
    }
  }, [accessToken]);

  // Define updateTodaySpending second (depends on getTodayTransactions)
  const updateTodaySpending = useCallback(async () => {
    const todayTransactions = await getTodayTransactions();
    const spending = todayTransactions.reduce((sum: number, t: any) => sum + t.amount, 0);
    setTodaySpending(spending);
  }, [getTodayTransactions]);

  // Define fetchMenu third (depends on updateTodaySpending)
  const fetchMenu = useCallback(async (date: Date) => {
    setLoading(true);
    try {
      const dateString = format(date, 'yyyy-MM-dd');
      const response = await fetch(
        `https://${projectId}.supabase.co/functions/v1/make-server-493cc528/menu/${dateString}`,
        {
          headers: {
            'Authorization': `Bearer ${publicAnonKey}`,
          },
        }
      );

      if (response.ok) {
        const data = await response.json();
        setMenu(data);
        // Fetch today's spending when menu is loaded
        await updateTodaySpending();
      }
    } catch (error) {
      console.error('Error fetching menu:', error);
      toast.error('Failed to load menu');
    } finally {
      setLoading(false);
    }
  }, [updateTodaySpending]);

  useEffect(() => {
    fetchMenu(selectedDate);
  }, [selectedDate, fetchMenu]);

  // Memoize recommendations calculation to avoid recalculating on every render
  const recommendations = useMemo(() => {
    if (!menu?.items || !budget || !budget.dailyBudget) return [];

    const remainingBudget = budget.dailyBudget - todaySpending;
    const availableItems = menu.items.filter((item: any) => 
      item.available !== false && item.price <= remainingBudget
    );

    // Score items based on health metrics
    const scoredItems = availableItems.map((item: any) => {
      let score = 0;
      
      if (item.nutrition) {
        // Higher protein is better
        if (item.nutrition.protein > 20) score += 3;
        else if (item.nutrition.protein > 10) score += 2;
        else if (item.nutrition.protein > 5) score += 1;

        // Lower calories is better (relative to price)
        const caloriesPerKES = item.nutrition.calories / item.price;
        if (caloriesPerKES < 5) score += 2;
        else if (caloriesPerKES < 8) score += 1;

        // Lower fats is better
        if (item.nutrition.fats < 10) score += 2;
        else if (item.nutrition.fats < 20) score += 1;

        // Higher fiber is better
        if (item.nutrition.fiber && item.nutrition.fiber > 5) score += 2;
        else if (item.nutrition.fiber && item.nutrition.fiber > 3) score += 1;

        // Lower sodium is better
        if (item.nutrition.sodium && item.nutrition.sodium < 500) score += 1;
      }

      // Affordable items get bonus points
      if (item.price < remainingBudget * 0.5) score += 1;

      return { ...item, healthScore: score };
    });

    // Sort by health score and get top 3
    return scoredItems
      .sort((a, b) => b.healthScore - a.healthScore)
      .slice(0, 3);
  }, [menu, budget, todaySpending]);

  const handlePurchase = useCallback(async (item: any) => {
    try {
      // Check if purchase would exceed daily budget
      if (budget && budget.dailyBudget) {
        const remainingBudget = budget.dailyBudget - todaySpending;
        
        if (item.price > remainingBudget) {
          toast.error(
            `Budget Alert! This purchase (KES ${item.price}) exceeds your remaining daily budget of KES ${remainingBudget.toFixed(2)}`,
            { duration: 5000 }
          );
          return;
        }

        // Warning if this will use more than 80% of remaining budget
        if (item.price > remainingBudget * 0.8) {
          toast.warning(
            `This will use ${((item.price / remainingBudget) * 100).toFixed(0)}% of your remaining daily budget!`,
            { duration: 4000 }
          );
        }
      }

      const response = await fetch(
        `https://${projectId}.supabase.co/functions/v1/make-server-493cc528/transactions`,
        {
          method: 'POST',
          headers: {
            'Content-Type': 'application/json',
            'Authorization': `Bearer ${accessToken}`,
          },
          body: JSON.stringify({
            itemName: item.name,
            amount: item.price,
            category: item.category,
            nutritionInfo: item.nutrition,
          }),
        }
      );

      if (response.ok) {
        toast.success(`Purchased ${item.name} for KES ${item.price}`);
        await updateTodaySpending();
        onPurchase();
        setShowItemDialog(false);
      } else {
        const error = await response.json();
        toast.error(`Purchase failed: ${error.error}`);
      }
    } catch (error) {
      console.error('Error making purchase:', error);
      toast.error('An error occurred during purchase');
    }
  }, [accessToken, budget, todaySpending, onPurchase, updateTodaySpending]);

  const getCategoryColor = (category: string) => {
    const colors: Record<string, string> = {
      'Main Course': 'bg-orange-100 text-orange-800',
      'Side Dish': 'bg-yellow-100 text-yellow-800',
      'Beverage': 'bg-blue-100 text-blue-800',
      'Dessert': 'bg-pink-100 text-pink-800',
      'Breakfast': 'bg-green-100 text-green-800',
    };
    return colors[category] || 'bg-gray-100 text-gray-800';
  };

  const isAffordable = useCallback((price: number) => {
    if (!budget || !budget.dailyBudget) return true;
    return price <= (budget.dailyBudget - todaySpending);
  }, [budget, todaySpending]);

  return (
    <div className="space-y-4">
      {/* Budget Status */}
      {budget && (
        <Card className="bg-gradient-to-r from-orange-50 to-amber-50 border-orange-200">
          <CardContent className="p-4">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm text-gray-600">Remaining Today</p>
                <p className="text-2xl text-orange-600">
                  KES {(budget.dailyBudget - todaySpending).toFixed(2)}
                </p>
              </div>
              <div className="text-right">
                <p className="text-sm text-gray-600">Daily Budget</p>
                <p className="text-lg text-gray-800">KES {budget.dailyBudget}</p>
              </div>
            </div>
            {todaySpending > budget.dailyBudget * 0.8 && (
              <Alert className="mt-3 bg-amber-50 border-amber-200">
                <AlertCircle className="w-4 h-4 text-amber-600" />
                <AlertDescription className="text-sm text-amber-800">
                  You've used {((todaySpending / budget.dailyBudget) * 100).toFixed(0)}% of your daily budget
                </AlertDescription>
              </Alert>
            )}
          </CardContent>
        </Card>
      )}

      {/* Healthy Recommendations */}
      {recommendations.length > 0 && (
        <Card className="border-green-200 bg-green-50">
          <CardHeader className="pb-3">
            <CardTitle className="text-lg flex items-center gap-2 text-green-700">
              <Sparkles className="w-5 h-5" />
              Recommended Healthy Meals
            </CardTitle>
            <CardDescription className="text-sm text-green-600">
              Within your budget and nutritionally balanced
            </CardDescription>
          </CardHeader>
          <CardContent>
            <div className="grid gap-3">
              {recommendations.map((item: any) => (
                <div 
                  key={item.id}
                  className="flex items-center justify-between p-3 bg-white rounded-lg border border-green-200 cursor-pointer hover:shadow-md transition-shadow active:scale-98"
                  onClick={() => {
                    setSelectedItem(item);
                    setShowItemDialog(true);
                  }}
                >
                  <div className="flex-1">
                    <div className="flex items-center gap-2">
                      <h4 className="text-sm">{item.name}</h4>
                      <Badge className="bg-green-100 text-green-800 text-xs">
                        Healthy
                      </Badge>
                    </div>
                    {item.nutrition && (
                      <div className="flex gap-3 text-xs text-gray-600 mt-1">
                        <span className="flex items-center gap-1">
                          <Flame className="w-3 h-3" />
                          {item.nutrition.calories} cal
                        </span>
                        <span className="flex items-center gap-1">
                          <Leaf className="w-3 h-3" />
                          {item.nutrition.protein}g protein
                        </span>
                      </div>
                    )}
                  </div>
                  <div className="flex items-center gap-2">
                    <span className="text-green-600">KES {item.price}</span>
                    <TrendingDown className="w-4 h-4 text-green-600" />
                  </div>
                </div>
              ))}
            </div>
          </CardContent>
        </Card>
      )}

      {/* Menu Items */}
      <Card>
        <CardHeader className="pb-3">
          <CardTitle className="text-lg">Daily Menu</CardTitle>
          <CardDescription className="text-sm">View and purchase meals</CardDescription>
        </CardHeader>
        <CardContent>
          <div className="mb-4">
            <Popover>
              <PopoverTrigger asChild>
                <Button variant="outline" className="gap-2 w-full sm:w-auto text-sm">
                  <CalendarIcon className="w-4 h-4" />
                  {format(selectedDate, 'PPP')}
                </Button>
              </PopoverTrigger>
              <PopoverContent className="w-auto p-0">
                <Calendar
                  mode="single"
                  selected={selectedDate}
                  onSelect={(date) => date && setSelectedDate(date)}
                />
              </PopoverContent>
            </Popover>
          </div>

          {loading ? (
            <div className="flex justify-center py-12">
              <div className="w-12 h-12 border-4 border-orange-500 border-t-transparent rounded-full animate-spin"></div>
            </div>
          ) : !menu || !menu.items || menu.items.length === 0 ? (
            <div className="text-center py-12 border-2 border-dashed rounded-lg">
              <Utensils className="w-16 h-16 text-gray-300 mx-auto mb-4" />
              <p className="text-gray-500">No menu available for this date</p>
              <p className="text-sm text-gray-400 mt-2">Check back later or try a different date</p>
            </div>
          ) : (
            <div className="grid gap-3 sm:gap-4 grid-cols-1 sm:grid-cols-2 lg:grid-cols-3">
              {menu.items
                .filter((item: any) => item.available !== false)
                .map((item: any) => {
                  const affordable = isAffordable(item.price);
                  return (
                    <Card 
                      key={item.id} 
                      className={`hover:shadow-md transition-shadow cursor-pointer active:scale-98 ${!affordable ? 'opacity-60' : ''}`}
                      onClick={() => {
                        setSelectedItem(item);
                        setShowItemDialog(true);
                      }}
                    >
                      <CardContent className="p-3 sm:p-4">
                        <div className="flex justify-between items-start mb-2 gap-2">
                          <h3 className="text-base leading-tight">{item.name}</h3>
                          <Badge className={`${getCategoryColor(item.category)} shrink-0 text-xs`}>
                            {item.category}
                          </Badge>
                        </div>
                        {item.description && (
                          <p className="text-sm text-gray-600 mb-3 line-clamp-2">{item.description}</p>
                        )}
                        <div className="flex items-center justify-between">
                          <span className={`${affordable ? 'text-orange-600' : 'text-red-600'}`}>
                            KES {item.price}
                          </span>
                          {item.nutrition && (
                            <div className="flex gap-2 text-xs text-gray-500">
                              <span className="flex items-center gap-1">
                                <Flame className="w-3 h-3" />
                                {item.nutrition.calories}
                              </span>
                              <span className="flex items-center gap-1">
                                <Leaf className="w-3 h-3" />
                                {item.nutrition.protein}g
                              </span>
                            </div>
                          )}
                        </div>
                        {!affordable && (
                          <div className="mt-2 flex items-center gap-1 text-sm text-red-600">
                            <AlertCircle className="w-4 h-4" />
                            Over budget
                          </div>
                        )}
                      </CardContent>
                    </Card>
                  );
                })}
            </div>
          )}
        </CardContent>
      </Card>

      {/* Item Details Dialog */}
      {selectedItem && (
        <Dialog open={showItemDialog} onOpenChange={setShowItemDialog}>
          <DialogContent>
            <DialogHeader>
              <DialogTitle>{selectedItem.name}</DialogTitle>
              <DialogDescription>
                {selectedItem.description || 'Delicious meal from our cafeteria'}
              </DialogDescription>
            </DialogHeader>
            <div className="space-y-4">
              <div className="flex items-center justify-between">
                <span>Price</span>
                <span className={`${isAffordable(selectedItem.price) ? 'text-orange-600' : 'text-red-600'}`}>
                  KES {selectedItem.price}
                </span>
              </div>

              {budget && (
                <div className="bg-gray-50 p-3 rounded-lg text-sm">
                  <div className="flex justify-between mb-1">
                    <span className="text-gray-600">Remaining budget:</span>
                    <span>KES {(budget.dailyBudget - todaySpending).toFixed(2)}</span>
                  </div>
                  <div className="flex justify-between">
                    <span className="text-gray-600">After purchase:</span>
                    <span className={`${isAffordable(selectedItem.price) ? 'text-green-600' : 'text-red-600'}`}>
                      KES {(budget.dailyBudget - todaySpending - selectedItem.price).toFixed(2)}
                    </span>
                  </div>
                </div>
              )}
              
              {selectedItem.nutrition && (
                <div className="border-t pt-4">
                  <h4 className="mb-3">Nutritional Information</h4>
                  <div className="grid grid-cols-2 gap-3 text-sm">
                    <div className="bg-orange-50 p-2 rounded">
                      <span className="text-gray-600 block text-xs">Calories</span>
                      <span className="text-orange-600">{selectedItem.nutrition.calories}</span>
                    </div>
                    <div className="bg-green-50 p-2 rounded">
                      <span className="text-gray-600 block text-xs">Protein</span>
                      <span className="text-green-600">{selectedItem.nutrition.protein}g</span>
                    </div>
                    <div className="bg-yellow-50 p-2 rounded">
                      <span className="text-gray-600 block text-xs">Carbs</span>
                      <span className="text-yellow-600">{selectedItem.nutrition.carbs}g</span>
                    </div>
                    <div className="bg-red-50 p-2 rounded">
                      <span className="text-gray-600 block text-xs">Fats</span>
                      <span className="text-red-600">{selectedItem.nutrition.fats}g</span>
                    </div>
                    {selectedItem.nutrition.fiber > 0 && (
                      <div className="bg-green-50 p-2 rounded">
                        <span className="text-gray-600 block text-xs">Fiber</span>
                        <span className="text-green-600">{selectedItem.nutrition.fiber}g</span>
                      </div>
                    )}
                    {selectedItem.nutrition.sodium > 0 && (
                      <div className="bg-blue-50 p-2 rounded">
                        <span className="text-gray-600 block text-xs">Sodium</span>
                        <span className="text-blue-600">{selectedItem.nutrition.sodium}mg</span>
                      </div>
                    )}
                  </div>
                </div>
              )}

              {!isAffordable(selectedItem.price) && (
                <Alert className="bg-red-50 border-red-200">
                  <AlertCircle className="w-4 h-4 text-red-600" />
                  <AlertDescription className="text-sm text-red-800">
                    This item exceeds your remaining daily budget. Consider a more affordable option.
                  </AlertDescription>
                </Alert>
              )}

              <Button 
                className="w-full bg-orange-500 hover:bg-orange-600 gap-2"
                onClick={() => handlePurchase(selectedItem)}
                disabled={!isAffordable(selectedItem.price)}
              >
                <ShoppingCart className="w-4 h-4" />
                {isAffordable(selectedItem.price) 
                  ? `Purchase for KES ${selectedItem.price}`
                  : 'Over Budget'}
              </Button>
            </div>
          </DialogContent>
        </Dialog>
      )}
    </div>
  );
}

function Utensils(props: React.SVGProps<SVGSVGElement>) {
  return (
    <svg {...props} xmlns="http://www.w3.org/2000/svg" width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
      <path d="M3 2v7c0 1.1.9 2 2 2h4a2 2 0 0 0 2-2V2" />
      <path d="M7 2v20" />
      <path d="M21 15V2v0a5 5 0 0 0-5 5v6c0 1.1.9 2 2 2h3Zm0 0v7" />
    </svg>
  );
}

