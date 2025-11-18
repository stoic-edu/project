import { useState } from 'react';
import { Dialog, DialogContent, DialogDescription, DialogHeader, DialogTitle } from '../ui/dialog';
import { Button } from '../ui/button';
import { Label } from '../ui/label';
import { Salad, Beef, Wheat, Leaf, Flame, Apple } from 'lucide-react';
import { projectId } from '../../utils/supabase/info';
import { toast } from 'sonner';

interface DietPreferenceDialogProps {
  open: boolean;
  onComplete: (dietPreference: string) => void;
  accessToken: string;
}

const dietOptions = [
  {
    value: 'normal',
    label: 'Normal Diet',
    description: 'Balanced meals with all food groups',
    icon: Apple,
    color: 'text-green-600'
  },
  {
    value: 'vegetarian',
    label: 'Vegetarian',
    description: 'Plant-based with dairy and eggs',
    icon: Salad,
    color: 'text-green-500'
  },
  {
    value: 'vegan',
    label: 'Vegan',
    description: 'Strictly plant-based foods',
    icon: Leaf,
    color: 'text-emerald-600'
  },
  {
    value: 'keto',
    label: 'Keto',
    description: 'Very low carb, high fat',
    icon: Flame,
    color: 'text-red-600'
  },
  {
    value: 'low-carb',
    label: 'Low Carb',
    description: 'Reduced carbohydrate intake',
    icon: Wheat,
    color: 'text-yellow-600'
  },
  {
    value: 'high-protein',
    label: 'High Protein',
    description: 'Protein-rich meals for fitness',
    icon: Beef,
    color: 'text-orange-600'
  }
];

export function DietPreferenceDialog({ open, onComplete, accessToken }: DietPreferenceDialogProps) {
  const [selectedDiet, setSelectedDiet] = useState('normal');
  const [saving, setSaving] = useState(false);

  const handleSave = async () => {
    setSaving(true);
    try {
      const response = await fetch(
        `https://${projectId}.supabase.co/functions/v1/make-server-493cc528/profile`,
        {
          method: 'PUT',
          headers: {
            'Content-Type': 'application/json',
            'Authorization': `Bearer ${accessToken}`,
          },
          body: JSON.stringify({ dietPreference: selectedDiet }),
        }
      );

      if (response.ok) {
        toast.success('Diet preference saved!');
        onComplete(selectedDiet);
      } else {
        const error = await response.json();
        toast.error(`Failed to save: ${error.error}`);
      }
    } catch (error) {
      console.error('Error saving diet preference:', error);
      toast.error('An error occurred while saving');
    } finally {
      setSaving(false);
    }
  };

  return (
    <Dialog open={open} onOpenChange={() => {}}>
      <DialogContent className="max-w-2xl max-h-[90vh] overflow-y-auto" onInteractOutside={(e) => e.preventDefault()}>
        <DialogHeader>
          <DialogTitle>Welcome to MealPal! 🍽️</DialogTitle>
          <DialogDescription>
            Let's personalize your experience. Choose your preferred diet to get tailored meal recommendations.
          </DialogDescription>
        </DialogHeader>

        <div className="space-y-4 mt-4">
          <Label>Select Your Diet Preference</Label>
          <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
            {dietOptions.map((option) => {
              const Icon = option.icon;
              return (
                <button
                  key={option.value}
                  onClick={() => setSelectedDiet(option.value)}
                  className={`p-4 border-2 rounded-lg text-left transition-all ${
                    selectedDiet === option.value
                      ? 'border-orange-500 bg-orange-50'
                      : 'border-gray-200 hover:border-gray-300'
                  }`}
                >
                  <div className="flex items-start gap-3">
                    <Icon className={`w-6 h-6 ${option.color} flex-shrink-0 mt-1`} />
                    <div className="flex-1 min-w-0">
                      <h3 className="font-medium mb-1">{option.label}</h3>
                      <p className="text-sm text-gray-600">{option.description}</p>
                    </div>
                    {selectedDiet === option.value && (
                      <div className="w-5 h-5 rounded-full bg-orange-500 flex items-center justify-center flex-shrink-0">
                        <svg className="w-3 h-3 text-white" fill="currentColor" viewBox="0 0 20 20">
                          <path fillRule="evenodd" d="M16.707 5.293a1 1 0 010 1.414l-8 8a1 1 0 01-1.414 0l-4-4a1 1 0 011.414-1.414L8 12.586l7.293-7.293a1 1 0 011.414 0z" clipRule="evenodd" />
                        </svg>
                      </div>
                    )}
                  </div>
                </button>
              );
            })}
          </div>

          <div className="bg-blue-50 border border-blue-200 rounded-lg p-4">
            <p className="text-sm text-blue-800">
              <strong>💡 Tip:</strong> Your diet preference will help us recommend meals that match your nutritional goals and restrictions. You can always change this later in your profile settings.
            </p>
          </div>

          <Button
            onClick={handleSave}
            disabled={saving}
            className="w-full bg-orange-500 hover:bg-orange-600"
          >
            {saving ? 'Saving...' : 'Continue to Dashboard'}
          </Button>
        </div>
      </DialogContent>
    </Dialog>
  );
}

