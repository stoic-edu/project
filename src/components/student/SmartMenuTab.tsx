import { useState, useEffect } from 'react';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '../ui/card';
import { Button } from '../ui/button';
import { Badge } from '../ui/badge';
import { Calendar } from '../ui/calendar';
import { Popover, PopoverContent, PopoverTrigger } from '../ui/popover';
import { Dialog, DialogContent, DialogDescription, DialogHeader, DialogTitle } from '../ui/dialog';
import { Alert, AlertDescription } from '../ui/alert';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '../ui/tabs';
import { CalendarIcon, ShoppingCart, Sparkles, Coffee, UtensilsCrossed, Moon, Flame, Beef, Wheat, Info } from 'lucide-react';
import { format } from 'date-fns';
import { projectId, publicAnonKey } from '../../utils/supabase/info';
import { toast } from 'sonner';

interface SmartMenuTabProps {
  accessToken: string;
  onPurchase: () => void;
  profile: any;
}

export function SmartMenuTab({ accessToken, onPurchase, profile }: SmartMenuTabProps) {
  const [selectedDate, setSelectedDate] = useState<Date>(new Date());
  const [menu, setMenu] = useState<any>(null);
  const [loading, setLoading] = useState(false);
  const [selectedItem, setSelectedItem] = useState<any>(null);
  const [showItemDialog, setShowItemDialog] = useState(false);
  const [recommendations, setRecommendations] = useState<any>({
    breakfast: [],
    lunch: [],
    supper: []
  });
  const [loadingRecommendations, setLoadingRecommendations] = useState(false);
  const [activeTab, setActiveTab] = useState('breakfast');

  useEffect(() => {
    fetchMenu(selectedDate);
  }, [selectedDate]);

  useEffect(() => {
    if (menu?.items) {
      fetchRecommendations();
    }
  }, [menu, profile?.dietPreference]);

  const fetchMenu = async (date: Date) => {
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
      }
    } catch (error) {
      console.error('Error fetching menu:', error);
      toast.error('Failed to load menu');
    } finally {
      setLoading(false);
    }
  };

  const fetchRecommendations = async () => {
    setLoadingRecommendations(true);
    try {
      const dateString = format(selectedDate, 'yyyy-MM-dd');
      const mealTypes = ['breakfast', 'lunch', 'supper'];
      
      const recommendationPromises = mealTypes.map(async (mealType) => {
        const response = await fetch(
          `https://${projectId}.supabase.co/functions/v1/make-server-493cc528/recommendations`,
          {
            method: 'POST',
            headers: {
              'Content-Type': 'application/json',
              'Authorization': `Bearer ${accessToken}`,
            },
            body: JSON.stringify({
              date: dateString,
              mealType: mealType,
            }),
          }
        );

        if (response.ok) {
          const data = await response.json();
          return { mealType, data };
        }
        return { mealType, data: { recommendations: [] } };
      });

      const results = await Promise.all(recommendationPromises);
      const newRecommendations: any = {};
      
      results.forEach(({ mealType, data }) => {
        newRecommendations[mealType] = data.recommendations || [];
      });

      setRecommendations(newRecommendations);
    } catch (error) {
      console.error('Error fetching recommendations:', error);
    } finally {
      setLoadingRecommendations(false);
    }
  };

  const handlePurchase = async (item: any) => {
    try {
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
        toast.success(`Purchased ${item.name} for KES ${item.price}!`);
        setShowItemDialog(false);
        onPurchase();
      } else {
        const error = await response.json();
        toast.error(`Purchase failed: ${error.error}`);
      }
    } catch (error) {
      console.error('Error making purchase:', error);
      toast.error('An error occurred during purchase');
    }
  };

  const getMealIcon = (mealType: string) => {
    switch (mealType) {
      case 'breakfast':
        return Coffee;
      case 'lunch':
        return UtensilsCrossed;
      case 'supper':
        return Moon;
      default:
        return UtensilsCrossed;
    }
  };

  const getMealColor = (mealType: string) => {
    switch (mealType) {
      case 'breakfast':
        return 'text-yellow-600';
      case 'lunch':
        return 'text-orange-600';
      case 'supper':
        return 'text-purple-600';
      default:
        return 'text-gray-600';
    }
  };

  const renderRecommendations = (mealType: string) => {
    const recs = recommendations[mealType] || [];
    const MealIcon = getMealIcon(mealType);
    const mealColor = getMealColor(mealType);

    if (loadingRecommendations) {
      return (
        <div className="flex justify-center py-8">
          <div className="w-8 h-8 border-4 border-orange-500 border-t-transparent rounded-full animate-spin"></div>
        </div>
      );
    }

    if (recs.length === 0) {
      return (
        <Alert>
          <Info className="w-4 h-4" />
          <AlertDescription>
            No recommendations available for {mealType}. This might be because there are no menu items that match your diet preference and budget, or no items are available for this meal type.
          </AlertDescription>
        </Alert>
      );
    }

    return (
      <div className="space-y-3">
        <div className="flex items-center gap-2 mb-4">
          <Sparkles className="w-5 h-5 text-orange-500" />
          <h3 className="font-medium">Recommended for You</h3>
        </div>
        {recs.map((item: any) => (
          <Card 
            key={item.id}
            className="hover:shadow-md transition-shadow cursor-pointer border-2 border-orange-200 bg-gradient-to-br from-orange-50 to-white"
            onClick={() => {
              setSelectedItem(item);
              setShowItemDialog(true);
            }}
          >
            <CardContent className="p-4">
              <div className="flex items-start justify-between gap-3">
                <div className="flex-1 min-w-0">
                  <div className="flex items-center gap-2 mb-1">
                    <MealIcon className={`w-4 h-4 ${mealColor} flex-shrink-0`} />
                    <h4 className="truncate">{item.name}</h4>
                    <Sparkles className="w-4 h-4 text-orange-500 flex-shrink-0" />
                  </div>
                  {item.description && (
                    <p className="text-sm text-gray-600 line-clamp-2">{item.description}</p>
                  )}
                  {item.nutrition && (
                    <div className="flex flex-wrap gap-2 mt-2">
                      <span className="text-xs px-2 py-1 bg-red-100 text-red-700 rounded flex items-center gap-1">
                        <Flame className="w-3 h-3" />
                        {item.nutrition.calories} cal
                      </span>
                      <span className="text-xs px-2 py-1 bg-orange-100 text-orange-700 rounded flex items-center gap-1">
                        <Beef className="w-3 h-3" />
                        {item.nutrition.protein}g protein
                      </span>
                      <span className="text-xs px-2 py-1 bg-yellow-100 text-yellow-700 rounded flex items-center gap-1">
                        <Wheat className="w-3 h-3" />
                        {item.nutrition.carbs}g carbs
                      </span>
                    </div>
                  )}
                </div>
                <div className="text-right flex-shrink-0">
                  <div className="text-orange-600 font-medium">KES {item.price}</div>
                  <Badge className="mt-1 bg-green-100 text-green-800 text-xs">
                    Within Budget
                  </Badge>
                </div>
              </div>
            </CardContent>
          </Card>
        ))}
      </div>
    );
  };

  const renderAllMenuItems = () => {
    if (!menu?.items || menu.items.length === 0) {
      return (
        <Alert>
          <Info className="w-4 h-4" />
          <AlertDescription>
            No menu items available for this date.
          </AlertDescription>
        </Alert>
      );
    }

    return (
      <div className="space-y-3">
        {menu.items.map((item: any) => (
          <Card
            key={item.id}
            className={`hover:shadow-md transition-shadow cursor-pointer ${
              item.available === false ? 'opacity-50' : ''
            }`}
            onClick={() => {
              if (item.available !== false) {
                setSelectedItem(item);
                setShowItemDialog(true);
              }
            }}
          >
            <CardContent className="p-4">
              <div className="flex items-start justify-between gap-3">
                <div className="flex-1 min-w-0">
                  <h4 className="truncate mb-1">{item.name}</h4>
                  {item.description && (
                    <p className="text-sm text-gray-600 line-clamp-2">{item.description}</p>
                  )}
                  <div className="flex flex-wrap gap-2 mt-2">
                    <Badge variant="secondary" className="text-xs">
                      {item.category}
                    </Badge>
                    {item.available === false && (
                      <Badge className="bg-red-100 text-red-800 text-xs">
                        Unavailable
                      </Badge>
                    )}
                  </div>
                </div>
                <div className="text-right flex-shrink-0">
                  <div className="text-orange-600 font-medium">KES {item.price}</div>
                </div>
              </div>
            </CardContent>
          </Card>
        ))}
      </div>
    );
  };

  return (
    <div className="space-y-4 sm:space-y-6">
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3">
        <div>
          <h2 className="mb-1 text-lg sm:text-xl">Today's Menu</h2>
          <p className="text-gray-600 text-sm">Personalized recommendations based on your preferences</p>
        </div>
        <Popover>
          <PopoverTrigger asChild>
            <Button variant="outline" className="gap-2 w-full sm:w-auto">
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

      {profile?.dietPreference && (
        <Alert className="border-blue-200 bg-blue-50">
          <Info className="w-4 h-4 text-blue-600" />
          <AlertDescription className="text-blue-800">
            Showing recommendations for your <strong>{profile.dietPreference}</strong> diet preference.
          </AlertDescription>
        </Alert>
      )}

      {loading ? (
        <div className="flex justify-center py-12">
          <div className="w-12 h-12 border-4 border-orange-500 border-t-transparent rounded-full animate-spin"></div>
        </div>
      ) : (
        <Tabs value={activeTab} onValueChange={setActiveTab}>
          <TabsList className="grid w-full grid-cols-4">
            <TabsTrigger value="breakfast" className="gap-2">
              <Coffee className="w-4 h-4" />
              <span className="hidden sm:inline">Breakfast</span>
            </TabsTrigger>
            <TabsTrigger value="lunch" className="gap-2">
              <UtensilsCrossed className="w-4 h-4" />
              <span className="hidden sm:inline">Lunch</span>
            </TabsTrigger>
            <TabsTrigger value="supper" className="gap-2">
              <Moon className="w-4 h-4" />
              <span className="hidden sm:inline">Supper</span>
            </TabsTrigger>
            <TabsTrigger value="all" className="gap-2">
              <span className="hidden sm:inline">All Items</span>
              <span className="sm:hidden">All</span>
            </TabsTrigger>
          </TabsList>

          <TabsContent value="breakfast" className="mt-4">
            {renderRecommendations('breakfast')}
          </TabsContent>

          <TabsContent value="lunch" className="mt-4">
            {renderRecommendations('lunch')}
          </TabsContent>

          <TabsContent value="supper" className="mt-4">
            {renderRecommendations('supper')}
          </TabsContent>

          <TabsContent value="all" className="mt-4">
            {renderAllMenuItems()}
          </TabsContent>
        </Tabs>
      )}

      {/* Item Details Dialog */}
      <Dialog open={showItemDialog} onOpenChange={setShowItemDialog}>
        <DialogContent>
          <DialogHeader>
            <DialogTitle>{selectedItem?.name}</DialogTitle>
            <DialogDescription>
              {selectedItem?.description || 'Cafeteria menu item'}
            </DialogDescription>
          </DialogHeader>
          {selectedItem && (
            <div className="space-y-4">
              <div className="flex items-center justify-between p-4 bg-gray-50 rounded-lg">
                <span className="text-gray-600">Price</span>
                <span className="text-orange-600 font-medium">KES {selectedItem.price}</span>
              </div>

              <div className="space-y-2">
                <span className="text-sm text-gray-600">Category</span>
                <div>
                  <Badge>{selectedItem.category}</Badge>
                </div>
              </div>

              {selectedItem.nutrition && (
                <div className="space-y-3">
                  <h4 className="font-medium">Nutritional Information</h4>
                  <div className="grid grid-cols-2 gap-3">
                    <div className="p-3 bg-red-50 rounded-lg">
                      <div className="flex items-center gap-2 mb-1">
                        <Flame className="w-4 h-4 text-red-500" />
                        <span className="text-sm text-gray-600">Calories</span>
                      </div>
                      <p className="font-medium">{selectedItem.nutrition.calories}</p>
                    </div>
                    <div className="p-3 bg-orange-50 rounded-lg">
                      <div className="flex items-center gap-2 mb-1">
                        <Beef className="w-4 h-4 text-orange-500" />
                        <span className="text-sm text-gray-600">Protein</span>
                      </div>
                      <p className="font-medium">{selectedItem.nutrition.protein}g</p>
                    </div>
                    <div className="p-3 bg-yellow-50 rounded-lg">
                      <div className="flex items-center gap-2 mb-1">
                        <Wheat className="w-4 h-4 text-yellow-600" />
                        <span className="text-sm text-gray-600">Carbs</span>
                      </div>
                      <p className="font-medium">{selectedItem.nutrition.carbs}g</p>
                    </div>
                    <div className="p-3 bg-blue-50 rounded-lg">
                      <span className="text-sm text-gray-600">Fats</span>
                      <p className="font-medium">{selectedItem.nutrition.fats}g</p>
                    </div>
                  </div>
                </div>
              )}

              <Button
                onClick={() => handlePurchase(selectedItem)}
                disabled={selectedItem.available === false}
                className="w-full bg-orange-500 hover:bg-orange-600 gap-2"
              >
                <ShoppingCart className="w-4 h-4" />
                {selectedItem.available === false ? 'Unavailable' : `Purchase for KES ${selectedItem.price}`}
              </Button>
            </div>
          )}
        </DialogContent>
      </Dialog>
    </div>
  );
}

