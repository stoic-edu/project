import { useState, useEffect } from 'react';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '../ui/card';
import { Button } from '../ui/button';
import { Input } from '../ui/input';
import { Label } from '../ui/label';
import { Dialog, DialogContent, DialogDescription, DialogHeader, DialogTitle } from '../ui/dialog';
import { Plus, Pencil, Trash2, Flame, Beef, Wheat, Droplet } from 'lucide-react';
import { projectId, publicAnonKey } from '../../utils/supabase/info';
import { toast } from 'sonner';


interface NutritionDatabaseTabProps {
  accessToken: string;
}

export function NutritionDatabaseTab({ accessToken }: NutritionDatabaseTabProps) {
  const [nutritionData, setNutritionData] = useState<any[]>([]);
  const [loading, setLoading] = useState(false);
  const [showAddDialog, setShowAddDialog] = useState(false);
  const [editingItem, setEditingItem] = useState<any>(null);

  // Form state
  const [name, setName] = useState('');
  const [calories, setCalories] = useState('');
  const [protein, setProtein] = useState('');
  const [carbs, setCarbs] = useState('');
  const [fats, setFats] = useState('');
  const [fiber, setFiber] = useState('');
  const [sodium, setSodium] = useState('');

  useEffect(() => {
    fetchNutritionData();
  }, []);

  const fetchNutritionData = async () => {
    setLoading(true);
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
    } finally {
      setLoading(false);
    }
  };

  const handleSave = async () => {
    const nutritionInfo = {
      name,
      calories: parseInt(calories),
      protein: parseFloat(protein),
      carbs: parseFloat(carbs),
      fats: parseFloat(fats),
      fiber: parseFloat(fiber) || 0,
      sodium: parseFloat(sodium) || 0,
    };

    try {
      const url = editingItem
        ? `https://${projectId}.supabase.co/functions/v1/make-server-493cc528/nutrition/${editingItem.id}`
        : `https://${projectId}.supabase.co/functions/v1/make-server-493cc528/nutrition`;

      const response = await fetch(url, {
        method: editingItem ? 'PUT' : 'POST',
        headers: {
          'Content-Type': 'application/json',
          'Authorization': `Bearer ${accessToken}`,
        },
        body: JSON.stringify(nutritionInfo),
      });

      if (response.ok) {
        toast.success(editingItem ? 'Nutrition data updated!' : 'Nutrition data added!');
        fetchNutritionData();
        resetForm();
        setShowAddDialog(false);
      } else {
        const error = await response.json();
        toast.error(`Save failed: ${error.error}`);
      }
    } catch (error) {
      console.error('Error saving nutrition data:', error);
      toast.error('An error occurred while saving');
    }
  };

  const handleDelete = async (id: string) => {
    if (!confirm('Are you sure you want to delete this nutrition entry?')) return;

    try {
      const response = await fetch(
        `https://${projectId}.supabase.co/functions/v1/make-server-493cc528/nutrition/${id}`,
        {
          method: 'DELETE',
          headers: {
            'Authorization': `Bearer ${accessToken}`,
          },
        }
      );

      if (response.ok) {
        toast.success('Nutrition data deleted!');
        fetchNutritionData();
      } else {
        const error = await response.json();
        toast.error(`Delete failed: ${error.error}`);
      }
    } catch (error) {
      console.error('Error deleting nutrition data:', error);
      toast.error('An error occurred while deleting');
    }
  };

  const resetForm = () => {
    setName('');
    setCalories('');
    setProtein('');
    setCarbs('');
    setFats('');
    setFiber('');
    setSodium('');
    setEditingItem(null);
  };

  const openEditDialog = (item: any) => {
    setEditingItem(item);
    setName(item.name);
    setCalories(item.calories?.toString() || '');
    setProtein(item.protein?.toString() || '');
    setCarbs(item.carbs?.toString() || '');
    setFats(item.fats?.toString() || '');
    setFiber(item.fiber?.toString() || '');
    setSodium(item.sodium?.toString() || '');
    setShowAddDialog(true);
  };

  return (
    <div className="space-y-4 sm:space-y-6">
      <Card>
        <CardHeader className="pb-3">
          <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3">
            <div>
              <CardTitle className="text-lg sm:text-xl">Nutrition Database</CardTitle>
              <CardDescription className="text-sm">Manage nutritional information</CardDescription>
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
              Add Entry
            </Button>
          </div>
        </CardHeader>
        <CardContent>
          {loading ? (
            <div className="flex justify-center py-12">
              <div className="w-12 h-12 border-4 border-orange-500 border-t-transparent rounded-full animate-spin"></div>
            </div>
          ) : nutritionData.length === 0 ? (
            <div className="text-center py-12 border-2 border-dashed rounded-lg">
              <p className="text-gray-500 mb-4">No nutrition entries yet</p>
              <Button 
                onClick={() => {
                  resetForm();
                  setShowAddDialog(true);
                }}
                variant="outline"
                className="gap-2"
              >
                <Plus className="w-4 h-4" />
                Add First Entry
              </Button>
            </div>
          ) : (
            <div className="grid gap-3 sm:gap-4 grid-cols-1 md:grid-cols-2">
              {nutritionData.map((item: any) => (
                <Card key={item.id} className="hover:shadow-md transition-shadow">
                  <CardHeader>
                    <div className="flex items-start justify-between">
                      <CardTitle className="text-lg">{item.name}</CardTitle>
                      <div className="flex gap-1">
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
                          onClick={() => handleDelete(item.id)}
                          className="text-red-600 hover:text-red-700"
                        >
                          <Trash2 className="w-4 h-4" />
                        </Button>
                      </div>
                    </div>
                  </CardHeader>
                  <CardContent>
                    <div className="grid grid-cols-2 gap-3 text-sm">
                      <div className="flex items-center gap-2">
                        <Flame className="w-4 h-4 text-orange-500" />
                        <span className="text-gray-600">Calories:</span>
                        <span>{item.calories}</span>
                      </div>
                      <div className="flex items-center gap-2">
                        <Beef className="w-4 h-4 text-red-500" />
                        <span className="text-gray-600">Protein:</span>
                        <span>{item.protein}g</span>
                      </div>
                      <div className="flex items-center gap-2">
                        <Wheat className="w-4 h-4 text-yellow-600" />
                        <span className="text-gray-600">Carbs:</span>
                        <span>{item.carbs}g</span>
                      </div>
                      <div className="flex items-center gap-2">
                        <Droplet className="w-4 h-4 text-blue-500" />
                        <span className="text-gray-600">Fats:</span>
                        <span>{item.fats}g</span>
                      </div>
                      {item.fiber > 0 && (
                        <div className="col-span-2 text-xs text-gray-500">
                          Fiber: {item.fiber}g | Sodium: {item.sodium}mg
                        </div>
                      )}
                    </div>
                  </CardContent>
                </Card>
              ))}
            </div>
          )}
        </CardContent>
      </Card>

      <Dialog open={showAddDialog} onOpenChange={setShowAddDialog}>
        <DialogContent>
          <DialogHeader>
            <DialogTitle>{editingItem ? 'Edit Nutrition Entry' : 'Add Nutrition Entry'}</DialogTitle>
            <DialogDescription>
              {editingItem ? 'Update the nutritional information' : 'Add nutritional information for a meal'}
            </DialogDescription>
          </DialogHeader>
          <div className="space-y-4">
            <div className="space-y-2">
              <Label htmlFor="nutrition-name">Item Name *</Label>
              <Input
                id="nutrition-name"
                value={name}
                onChange={(e) => setName(e.target.value)}
                placeholder="e.g., Grilled Chicken Breast"
              />
            </div>

            <div className="grid grid-cols-2 gap-4">
              <div className="space-y-2">
                <Label htmlFor="calories">Calories *</Label>
                <Input
                  id="calories"
                  type="number"
                  value={calories}
                  onChange={(e) => setCalories(e.target.value)}
                  placeholder="250"
                />
              </div>
              <div className="space-y-2">
                <Label htmlFor="protein">Protein (g) *</Label>
                <Input
                  id="protein"
                  type="number"
                  step="0.1"
                  value={protein}
                  onChange={(e) => setProtein(e.target.value)}
                  placeholder="30"
                />
              </div>
            </div>

            <div className="grid grid-cols-2 gap-4">
              <div className="space-y-2">
                <Label htmlFor="carbs">Carbs (g) *</Label>
                <Input
                  id="carbs"
                  type="number"
                  step="0.1"
                  value={carbs}
                  onChange={(e) => setCarbs(e.target.value)}
                  placeholder="15"
                />
              </div>
              <div className="space-y-2">
                <Label htmlFor="fats">Fats (g) *</Label>
                <Input
                  id="fats"
                  type="number"
                  step="0.1"
                  value={fats}
                  onChange={(e) => setFats(e.target.value)}
                  placeholder="10"
                />
              </div>
            </div>

            <div className="grid grid-cols-2 gap-4">
              <div className="space-y-2">
                <Label htmlFor="fiber">Fiber (g)</Label>
                <Input
                  id="fiber"
                  type="number"
                  step="0.1"
                  value={fiber}
                  onChange={(e) => setFiber(e.target.value)}
                  placeholder="5"
                />
              </div>
              <div className="space-y-2">
                <Label htmlFor="sodium">Sodium (mg)</Label>
                <Input
                  id="sodium"
                  type="number"
                  step="0.1"
                  value={sodium}
                  onChange={(e) => setSodium(e.target.value)}
                  placeholder="500"
                />
              </div>
            </div>

            <div className="flex gap-2 pt-4">
              <Button
                onClick={handleSave}
                className="flex-1 bg-orange-500 hover:bg-orange-600"
                disabled={!name || !calories || !protein || !carbs || !fats}
              >
                {editingItem ? 'Update Entry' : 'Add Entry'}
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