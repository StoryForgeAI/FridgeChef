'use client';
import { useState } from 'react';

const SERVING_OPTIONS = [1, 2, 3, 4, 6, 8];
const ALLERGY_OPTIONS = ['Peanuts', 'Tree Nuts', 'Milk', 'Eggs', 'Soy', 'Wheat', 'Fish', 'Shellfish'];

export default function RecipeConfig({
  onGenerate,
  loading
}: {
  onGenerate: (config: { servings: number; maxCalories: number | null; allergies: string[] }) => void;
  loading: boolean;
}) {
  const [servings, setServings] = useState(2);
  const [maxCalories, setMaxCalories] = useState('');
  const [allergies, setAllergies] = useState<string[]>([]);

  const toggleAllergy = (allergy: string) => {
    setAllergies((prev) =>
      prev.includes(allergy) ? prev.filter((a) => a !== allergy) : [...prev, allergy]
    );
  };

  const handleSubmit = () => {
    onGenerate({
      servings,
      maxCalories: maxCalories ? parseInt(maxCalories) : null,
      allergies
    });
  };

  return (
    <div className="bg-white rounded-lg p-4 shadow space-y-4">
      <div>
        <label className="block text-sm font-medium mb-2">Servings</label>
        <div className="flex flex-wrap gap-2">
          {SERVING_OPTIONS.map((num) => (
            <button
              key={num}
              onClick={() => setServings(num)}
              className={`px-4 py-2 rounded-full text-sm ${
                servings === num ? 'bg-blue-600 text-white' : 'bg-gray-100 text-gray-700'
              }`}
            >
              {num}
            </button>
          ))}
        </div>
      </div>
      <div>
        <label className="block text-sm font-medium mb-2">Max Calories (optional)</label>
        <input
          type="number"
          value={maxCalories}
          onChange={(e) => setMaxCalories(e.target.value)}
          placeholder="e.g. 500"
          className="w-full border border-gray-300 rounded-lg p-2 text-sm"
        />
      </div>
      <div>
        <label className="block text-sm font-medium mb-2">Allergies</label>
        <div className="flex flex-wrap gap-2">
          {ALLERGY_OPTIONS.map((allergy) => (
            <button
              key={allergy}
              onClick={() => toggleAllergy(allergy)}
              className={`px-3 py-1 rounded-full text-xs ${
                allergies.includes(allergy) ? 'bg-red-500 text-white' : 'bg-gray-100 text-gray-700'
              }`}
            >
              {allergy}
            </button>
          ))}
        </div>
      </div>
      <button
        onClick={handleSubmit}
        disabled={loading}
        className="w-full bg-green-600 text-white py-3 rounded-lg font-medium disabled:opacity-50"
      >
        {loading ? 'Generating...' : 'Generate Recipes'}
      </button>
    </div>
  );
}
