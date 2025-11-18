import { useState, useEffect } from 'react';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '../ui/card';
import { Button } from '../ui/button';
import { Badge } from '../ui/badge';
import { projectId, publicAnonKey } from '../../utils/supabase/info';
import { createClient } from '../../utils/supabase/client';
import { Calendar, Utensils, DollarSign, Loader2, Plus, Info } from 'lucide-react';
import { Dialog, DialogContent, DialogDescription, DialogHeader, DialogTitle } from '../ui/dialog';
import { toast } from 'sonner';

interface MenuViewProps {
  userId: string;
}

interface MenuItem {
  id: string;
  name: string;
  description: string;
  price: number;
  category: string;
  available: boolean;
  nutritionId?: string;
  date: string;
  mealType: string;
}

interface NutritionData {
  id: string;
  calories: number;
  protein: number;
  carbs: number;
  fats: number;
  vitamins?: string;
}

export function MenuView({ userId }: MenuViewProps) {
  const [menus, setMenus] = useState<MenuItem[]>([]);
  const [nutrition, setNutrition] = useState<Record<string, NutritionData>>({});
  const [loading, setLoading] = useState(true);
  const [selectedDate, setSelectedDate] = useState(new Date().toISOString().split('T')[0]);
  const [selectedItem, setSelectedItem] = useState<MenuItem | null>(null);
  const [purchasing, setPurchasing] = useState(false);

  useEffect(() => {
    loadMenus();
    loadNutrition();
  }, [selectedDate]);

  const loadMenus = async () => {
    setLoading(true);
    try {
      const response = await fetch(
        `https://${projectId}.supabase.co/functions/v1/make-server-493cc528/menus?date=${selectedDate}`,
        {
          headers: { Authorization: `Bearer ${publicAnonKey}` },
        }
      );
      const data = await response.json();
      setMenus(data.menus || []);
    } catch (error) {
      console.error('Error loading menus:', error);
    }
    setLoading(false);
  };

  const loadNutrition = async () => {
    try {
      const response = await fetch(
        `https://${projectId}.supabase.co/functions/v1/make-server-493cc528/nutrition`,
        {
          headers: { Authorization: `Bearer ${publicAnonKey}` },
        }
      );
      const data = await response.json();
      const nutritionMap: Record<string, NutritionData> = {};
      data.nutrition?.forEach((n: NutritionData) => {
        nutritionMap[n.id] = n;
      });
      setNutrition(nutritionMap);
    } catch (error) {
      console.error('Error loading nutrition:', error);
    }
  };

  const purchaseMeal = async (menuItem: MenuItem) => {
    setPurchasing(true);
    try {
      const supabase = createClient();
      const { data: { session } } = await supabase.auth.getSession();

      if (!session) {
        toast.error('Please sign in to purchase meals');
        return;
      }

      const response = await fetch(
        `https://${projectId}.supabase.co/functions/v1/make-server-493cc528/transactions`,
        {
          method: 'POST',
          headers: {
            'Content-Type': 'application/json',
            Authorization: `Bearer ${session.access_token}`,
          },
          body: JSON.stringify({
            menuItemId: menuItem.id,
            amount: menuItem.price,
            mealType: menuItem.mealType,
          }),
        }
      );

      if (response.ok) {
        toast.success(`${menuItem.name} added to your meal history!`);
        setSelectedItem(null);
      } else {
        const error = await response.json();
        toast.error(error.error || 'Failed to record purchase');
      }
    } catch (error) {
      console.error('Error purchasing meal:', error);
      toast.error('An error occurred');
    }
    setPurchasing(false);
  };

  const groupedMenus = menus.reduce((acc, item) => {
    if (!acc[item.mealType]) acc[item.mealType] = [];
    acc[item.mealType].push(item);
    return acc;
  }, {} as Record<string, MenuItem[]>);

  const categoryColors: Record<string, string> = {
    main: 'bg-blue-100 text-blue-800',
    side: 'bg-green-100 text-green-800',
    beverage: 'bg-purple-100 text-purple-800',
    dessert: 'bg-pink-100 text-pink-800',
  };

  return (
    <div className="space-y-6">
      <Card>
        <CardHeader>
          <div className="flex items-center justify-between">
            <div>
              <CardTitle className="flex items-center gap-2">
                <Utensils className="h-5 w-5 text-green-600" />
                Today's Menu
              </CardTitle>
              <CardDescription>
                Browse available meals and track your nutrition
              </CardDescription>
            </div>
            <div className="flex items-center gap-2">
              <Calendar className="h-4 w-4 text-gray-400" />
              <input
                type="date"
                value={selectedDate}
                onChange={(e) => setSelectedDate(e.target.value)}
                className="border border-gray-300 rounded px-3 py-2"
              />
            </div>
          </div>
        </CardHeader>
      </Card>

      {loading ? (
        <div className="flex items-center justify-center py-12">
          <Loader2 className="h-8 w-8 animate-spin text-green-600" />
        </div>
      ) : menus.length === 0 ? (
        <Card>
          <CardContent className="py-12">
            <div className="text-center text-gray-500">
              <Utensils className="h-12 w-12 mx-auto mb-4 opacity-50" />
              <p>No menu items available for this date</p>
            </div>
          </CardContent>
        </Card>
      ) : (
        <div className="space-y-6">
          {Object.entries(groupedMenus).map(([mealType, items]) => (
            <Card key={mealType}>
              <CardHeader>
                <CardTitle className="capitalize">{mealType}</CardTitle>
              </CardHeader>
              <CardContent>
                <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-3">
                  {items.map((item) => (
                    <Card key={item.id} className="hover:shadow-md transition-shadow">
                      <CardContent className="p-4">
                        <div className="space-y-3">
                          <div className="flex items-start justify-between">
                            <h3 className="text-gray-900">{item.name}</h3>
                            <Badge className={categoryColors[item.category] || 'bg-gray-100 text-gray-800'}>
                              {item.category}
                            </Badge>
                          </div>
                          
                          <p className="text-sm text-gray-600">{item.description}</p>
                          
                          <div className="flex items-center justify-between pt-2">
                            <div className="flex items-center gap-1 text-green-600">
                              <DollarSign className="h-4 w-4" />
                              <span>KES {item.price}</span>
                            </div>
                            
                            <div className="flex gap-2">
                              {item.nutritionId && nutrition[item.nutritionId] && (
                                <Button
                                  variant="outline"
                                  size="sm"
                                  onClick={() => setSelectedItem(item)}
                                >
                                  <Info className="h-4 w-4" />
                                </Button>
                              )}
                              <Button
                                size="sm"
                                onClick={() => purchaseMeal(item)}
                                disabled={purchasing}
                              >
                                <Plus className="h-4 w-4" />
                              </Button>
                            </div>
                          </div>
                        </div>
                      </CardContent>
                    </Card>
                  ))}
                </div>
              </CardContent>
            </Card>
          ))}
        </div>
      )}

      {selectedItem && selectedItem.nutritionId && nutrition[selectedItem.nutritionId] && (
        <Dialog open={!!selectedItem} onOpenChange={() => setSelectedItem(null)}>
          <DialogContent>
            <DialogHeader>
              <DialogTitle>{selectedItem.name}</DialogTitle>
              <DialogDescription>Nutritional Information</DialogDescription>
            </DialogHeader>
            <div className="space-y-4">
              <div className="grid grid-cols-2 gap-4">
                <div className="bg-gray-50 p-3 rounded">
                  <p className="text-sm text-gray-600">Calories</p>
                  <p className="text-gray-900">{nutrition[selectedItem.nutritionId].calories} kcal</p>
                </div>
                <div className="bg-gray-50 p-3 rounded">
                  <p className="text-sm text-gray-600">Protein</p>
                  <p className="text-gray-900">{nutrition[selectedItem.nutritionId].protein}g</p>
                </div>
                <div className="bg-gray-50 p-3 rounded">
                  <p className="text-sm text-gray-600">Carbohydrates</p>
                  <p className="text-gray-900">{nutrition[selectedItem.nutritionId].carbs}g</p>
                </div>
                <div className="bg-gray-50 p-3 rounded">
                  <p className="text-sm text-gray-600">Fats</p>
                  <p className="text-gray-900">{nutrition[selectedItem.nutritionId].fats}g</p>
                </div>
              </div>
              {nutrition[selectedItem.nutritionId].vitamins && (
                <div className="bg-blue-50 p-3 rounded">
                  <p className="text-sm text-gray-600">Vitamins & Minerals</p>
                  <p className="text-gray-900">{nutrition[selectedItem.nutritionId].vitamins}</p>
                </div>
              )}
              <Button className="w-full" onClick={() => purchaseMeal(selectedItem)}>
                Add to Meal History - KES {selectedItem.price}
              </Button>
            </div>
          </DialogContent>
        </Dialog>
      )}
    </div>
  );
}
