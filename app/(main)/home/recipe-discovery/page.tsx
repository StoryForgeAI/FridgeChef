'use client';
import { useState, useEffect } from 'react';
import { createBrowserClient } from '@/lib/supabase';
import RecipeConfig from '@/components/recipe/RecipeConfig';
import type { Recipe } from '@/lib/types';

export default function RecipeDiscoveryPage() {
  const [ingredients, setIngredients] = useState('');
  const [recipes, setRecipes] = useState<Recipe[]>([]);
  const [loading, setLoading] = useState(false);
  const supabase = createBrowserClient();

  useEffect(() => {
    // Component mounted
  }, []);

  const handleGenerate = async (config: { servings: number; maxCalories: number | null; allergies: string[] }) => {
    const items = ingredients.split(',').map((i) => i.trim()).filter(Boolean);
    if (items.length === 0) return;

    setLoading(true);
    const { data: { session } } = await supabase.auth.getSession();
    try {
      const res = await fetch('/api/recipes/generate', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
          'Authorization': `Bearer ${session?.access_token}`
        },
        body: JSON.stringify({ ingredients: items, ...config })
      });
      const data = await res.json();
      setRecipes(data);
    } catch {
      alert('Failed to generate recipes');
    }
    setLoading(false);
  };

  return (
    <div className="p-4">
      <h1 className="text-2xl font-bold mb-4">Generate Recipes</h1>
      <div className="bg-white rounded-lg p-4 shadow mb-4">
        <label className="block text-sm font-medium mb-2">Ingredients (comma-separated)</label>
        <textarea
          value={ingredients}
          onChange={(e) => setIngredients(e.target.value)}
          placeholder="e.g. eggs, flour, milk, sugar"
          className="w-full border border-gray-300 rounded-lg p-2 text-sm h-20"
        />
      </div>
      <RecipeConfig onGenerate={handleGenerate} loading={loading} />
      {recipes.length > 0 && (
        <div className="mt-6 space-y-4">
          <h2 className="font-semibold">Top 5 Recipes</h2>
          {recipes.map((recipe, idx) => (
            <div key={idx} className="bg-white rounded-lg p-4 shadow">
              <h3 className="font-bold text-lg">{recipe.title}</h3>
              <p className="text-sm text-gray-600 mb-2">{recipe.description}</p>
              <div className="flex justify-between text-xs text-gray-500 mb-3">
                <span>{recipe.kcal_per_serving} kcal/serving</span>
                <span>{recipe.ingredients.length} ingredients</span>
              </div>
              <a
                href={`/recipe/${idx}`}
                className="block w-full bg-blue-600 text-white text-center py-2 rounded-lg text-sm"
              >
                Start Cooking
              </a>
            </div>
          ))}
        </div>
      )}
    </div>
  );
}
