export type SubscriptionTier = 'free' | 'standard' | 'pro' | 'chef';

export interface Profile {
  id: string;
  tier: SubscriptionTier;
  credits: number;
  tss_credits: number;
  created_at: string;
  updated_at: string;
}

export interface PantryItem {
  id: string;
  user_id: string;
  barcode: string;
  name: string;
  kcal: number | null;
  created_at: string;
}

export interface Recipe {
  title: string;
  description: string;
  ingredients: string[];
  steps: string[];
  kcal_per_serving: number;
}

export interface RecipeHistory {
  id: string;
  user_id: string;
  ingredients: string[];
  recipe: Recipe[];
  max_calories: number | null;
  allergies: string[] | null;
  servings: number;
  created_at: string;
}

export interface Stats {
  id: string;
  user_id: string;
  total_recipes_generated: number;
  total_pantry_items: number;
  total_credits_used: number;
  extra_stats: Record<string, any>;
  created_at: string;
  updated_at: string;
}

export const STRIPE_TIERS = {
  standard: { price: 2.99, credits: 250, tss_credits: 10, discount: 0.10, max_items: 10 },
  pro: { price: 9.99, credits: 3000, tss_credits: 80, discount: 0.25, max_items: 50 },
  chef: { price: 18.99, credits: 6500, tss_credits: 160, discount: 0.30, max_items: 100 }
} as const;
