import { useState, useEffect } from 'react';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '../ui/card';
import { Button } from '../ui/button';
import { Input } from '../ui/input';
import { Label } from '../ui/label';
import { Textarea } from '../ui/textarea';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '../ui/select';
import { Dialog, DialogContent, DialogDescription, DialogHeader, DialogTitle } from '../ui/dialog';
import { Calendar } from '../ui/calendar';
import { Popover, PopoverContent, PopoverTrigger } from '../ui/popover';
import { Switch } from '../ui/switch';
import { Plus, Pencil, Trash2, CalendarIcon } from 'lucide-react';
import { format } from 'date-fns';
import { projectId, publicAnonKey } from '../../utils/supabase/info';
import { toast } from 'sonner';


interface MenuManagementTabProps {
  accessToken: string;
}

export function MenuManagementTab({ accessToken }: MenuManagementTabProps) {
  const [selectedDate, setSelectedDate] = useState<Date>(new Date());
  const [menu, setMenu] = useState<any>(null);
  const [nutritionData, setNutritionData] = useState<any[]>([]);
  const [loading, setLoading] = useState(false);
  const [showAddDialog, setShowAddDialog] = useState(false);
  const [editingItem, setEditingItem] = useState<any>(null);

  // Form state
  const [itemName, setItemName] = useState('');
  const [itemDescription, setItemDescription] = useState('');
  const [itemPrice, setItemPrice] = useState('');
  const [itemCategory, setItemCategory] = useState('Main Course');
  const [itemAvailable, setItemAvailable] = useState(true);
  const [selectedNutrition, setSelectedNutrition] = useState('none');

  useEffect(() => {
    fetchMenu(selectedDate);
    fetchNutritionData();
  }, [selectedDate]);

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
    } finally {
      setLoading(false);
    }
  };

  const fetchNutritionData = async () => {
    try {
      const response = await fetch(
        `https://${projectId}.supabase.co/functions/v1/make-server-493cc528/nutrition`,
        {
          headers: {
            'Authorization': `Bearer ${publicAnonKey}`,
          },
        }
      );

      if (response.ok) {
        const data = await response.json();
        setNutritionData(data);
      }
    } catch (error) {
      console.error('Error fetching nutrition data:', error);
    }
  };

  const handleSaveMenu = async () => {
    // Validation
    if (!itemName.trim()) {
      toast.error('Please enter an item name');
      return;
    }
    
    if (!itemPrice || parseFloat(itemPrice) <= 0) {
      toast.error('Please enter a valid price');
      return;
    }

    const newItem = {
      id: editingItem?.id || crypto.randomUUID(),
      name: itemName.trim(),
      description: itemDescription.trim(),
      price: parseFloat(itemPrice),
      category: itemCategory,
      available: itemAvailable,
      nutrition: selectedNutrition && selectedNutrition !== 'none' ? nutritionData.find(n => n.id === selectedNutrition) : null,
    };

    const currentItems = menu?.items || [];
    let updatedItems;

    if (editingItem) {
      updatedItems = currentItems.map((item: any) => 
        item.id === editingItem.id ? newItem : item
      );
    } else {
      updatedItems = [...currentItems, newItem];
    }

    try {
      const response = await fetch(
        `https://${projectId}.supabase.co/functions/v1/make-server-493cc528/menu`,
        {
          method: 'POST',
          headers: {
            'Content-Type': 'application/json',
            'Authorization': `Bearer ${accessToken}`,
          },
          body: JSON.stringify({
            date: format(selectedDate, 'yyyy-MM-dd'),
            items: updatedItems,
          }),
        }
      );

      if (response.ok) {
        toast.success(editingItem ? 'Menu item updated!' : 'Menu item added!');
        fetchMenu(selectedDate);
        resetForm();
        setShowAddDialog(false);
      } else {
        const error = await response.json();
        toast.error(`Save failed: ${error.error}`);
      }
    } catch (error) {
      console.error('Error saving menu:', error);
      toast.error('An error occurred while saving');
    }
  };

  const handleDeleteItem = async (itemId: string) => {
    if (!confirm('Are you sure you want to delete this menu item?')) return;

    try {
      const response = await fetch(
        `https://${projectId}.supabase.co/functions/v1/make-server-493cc528/menu/${format(selectedDate, 'yyyy-MM-dd')}/${itemId}`,
        {
          method: 'DELETE',
          headers: {
            'Authorization': `Bearer ${accessToken}`,
          },
        }
      );

      if (response.ok) {
        toast.success('Menu item deleted!');
        fetchMenu(selectedDate);
      } else {
        const error = await response.json();
        toast.error(`Delete failed: ${error.error}`);
      }
    } catch (error) {
      console.error('Error deleting menu item:', error);
      toast.error('An error occurred while deleting');
    }
  };

  const resetForm = () => {
    setItemName('');
    setItemDescription('');
    setItemPrice('');
    setItemCategory('Main Course');
    setItemAvailable(true);
    setSelectedNutrition('none');
    setEditingItem(null);
  };

  const openEditDialog = (item: any) => {
    setEditingItem(item);
    setItemName(item.name);
    setItemDescription(item.description || '');
    setItemPrice(item.price.toString());
    setItemCategory(item.category);
    setItemAvailable(item.available !== false);
    setSelectedNutrition(item.nutrition?.id || 'none');
    setShowAddDialog(true);
  };

  return (
    <div className="space-y-4 sm:space-y-6">
      <Card>
        <CardHeader className="pb-3">
          <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3">
            <div>
              <CardTitle className="text-lg sm:text-xl">Menu Management</CardTitle>
              <CardDescription className="text-sm">Create and manage daily menus</CardDescription>
            </div>
            <Button 
              onClick={() => {
                resetForm();
                setShowAddDialog(true);
              }}
              className="bg-orange-500 hover:bg-orange-600 gap-2 w-full sm:w-auto"
              size="sm"
            >
              <Plus className="w-4 h-4" />
              Add Item
            </Button>
          </div>
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
              <p className="text-gray-500 mb-4">No menu items for this date</p>
              <Button 
                onClick={() => {
                  resetForm();
                  setShowAddDialog(true);
                }}
                variant="outline"
                className="gap-2"
              >
                <Plus className="w-4 h-4" />
                Add First Item
              </Button>
            </div>
          ) : (
            <div className="space-y-3">
              {menu.items.map((item: any) => (
                <div 
                  key={item.id}
                  className="flex items-center justify-between p-4 bg-gray-50 rounded-lg"
                >
                  <div className="flex-1">
                    <div className="flex items-center gap-2">
                      <h3>{item.name}</h3>
                      <span className="text-xs px-2 py-1 bg-orange-100 text-orange-800 rounded">
                        {item.category}
                      </span>
                      {item.available === false && (
                        <span className="text-xs px-2 py-1 bg-red-100 text-red-800 rounded">
                          Unavailable
                        </span>
                      )}
                    </div>
                    {item.description && (
                      <p className="text-sm text-gray-600 mt-1">{item.description}</p>
                    )}
                    {item.nutrition && (
                      <p className="text-xs text-gray-500 mt-1">
                        {item.nutrition.calories} cal | {item.nutrition.protein}g protein
                      </p>
                    )}
                  </div>
                  <div className="flex items-center gap-3">
                    <span className="text-orange-600">KES {item.price}</span>
                    <Button
                      variant="ghost"
                      size="sm"
                      onClick={() => openEditDialog(item)}
                    >
                      <Pencil className="w-4 h-4" />
                    </Button>
                    <Button
                      variant="ghost"
                      size="sm"
                      onClick={() => handleDeleteItem(item.id)}
                      className="text-red-600 hover:text-red-700"
                    >
                      <Trash2 className="w-4 h-4" />
                    </Button>
                  </div>
                </div>
              ))}
            </div>
          )}
        </CardContent>
      </Card>

      <Dialog open={showAddDialog} onOpenChange={(open) => {
        setShowAddDialog(open);
        if (!open) resetForm();
      }}>
        <DialogContent className="max-w-2xl max-h-[90vh] overflow-y-auto">
          <DialogHeader>
            <DialogTitle>{editingItem ? 'Edit Menu Item' : 'Add Menu Item'}</DialogTitle>
            <DialogDescription>
              {editingItem ? 'Update the menu item details' : 'Add a new item to the cafeteria menu'}
            </DialogDescription>
          </DialogHeader>
          <div className="space-y-4">
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
              <div className="space-y-2">
                <Label htmlFor="item-name">Item Name *</Label>
                <Input
                  id="item-name"
                  value={itemName}
                  onChange={(e) => setItemName(e.target.value)}
                  placeholder="e.g., Chicken Biryani"
                />
              </div>
              <div className="space-y-2">
                <Label htmlFor="item-price">Price (KES) *</Label>
                <Input
                  id="item-price"
                  type="number"
                  value={itemPrice}
                  onChange={(e) => setItemPrice(e.target.value)}
                  placeholder="150"
                />
              </div>
            </div>

            <div className="space-y-2">
              <Label htmlFor="item-description">Description</Label>
              <Textarea
                id="item-description"
                value={itemDescription}
                onChange={(e) => setItemDescription(e.target.value)}
                placeholder="Brief description of the dish"
              />
            </div>

            <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
              <div className="space-y-2">
                <Label htmlFor="item-category">Category *</Label>
                <Select value={itemCategory} onValueChange={setItemCategory}>
                  <SelectTrigger id="item-category">
                    <SelectValue />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="Breakfast">Breakfast</SelectItem>
                    <SelectItem value="Lunch">Lunch</SelectItem>
                    <SelectItem value="Supper">Supper</SelectItem>
                  </SelectContent>
                </Select>
              </div>

              <div className="space-y-2">
                <Label htmlFor="item-nutrition">Nutrition Info</Label>
                <Select value={selectedNutrition} onValueChange={setSelectedNutrition}>
                  <SelectTrigger id="item-nutrition">
                    <SelectValue placeholder="Select nutrition data (optional)" />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="none">None</SelectItem>
                    {nutritionData.map((nutrition) => (
                      <SelectItem key={nutrition.id} value={nutrition.id}>
                        {nutrition.name} ({nutrition.calories} cal)
                      </SelectItem>
                    ))}
                  </SelectContent>
                </Select>
              </div>
            </div>

            <div className="flex items-center space-x-2">
              <Switch
                id="item-available"
                checked={itemAvailable}
                onCheckedChange={setItemAvailable}
              />
              <Label htmlFor="item-available">Available for purchase</Label>
            </div>

            <div className="flex gap-2 pt-4">
              <Button
                onClick={handleSaveMenu}
                className="flex-1 bg-orange-500 hover:bg-orange-600"
                disabled={!itemName || !itemPrice}
              >
                {editingItem ? 'Update Item' : 'Add Item'}
              </Button>
              <Button
                variant="outline"
                onClick={() => {
                  setShowAddDialog(false);
                  resetForm();
                }}
              >
                Cancel
              </Button>
            </div>
          </div>
        </DialogContent>
      </Dialog>
    </div>
  );
}