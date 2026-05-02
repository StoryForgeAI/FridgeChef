import { NextRequest, NextResponse } from 'next/server';
import { createClient } from '@supabase/ssr';
import { NEXT_PUBLIC_SUPABASE_URL, NEXT_PUBLIC_SUPABASE_ANON_KEY } from '@/lib/config';
import OpenAI from 'openai';
import { STRIPE_TIERS } from '@/lib/types';

const openai = new OpenAI({ apiKey: process.env.OPENAI_API_KEY! });

export async function POST(req: NextRequest) {
  const supabase = createClient(NEXT_PUBLIC_SUPABASE_URL, NEXT_PUBLIC_SUPABASE_ANON_KEY, {
    cookies: { get: (name) => req.cookies.get(name)?.value }
  });

  const { data: { user } } = await supabase.auth.getUser();
  if (!user) return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });

  const { ingredients, max_calories, allergies, servings = 1 } = await req.json();
  if (!ingredients?.length) return NextResponse.json({ error: 'Ingredients required' }, { status: 400 });

  const { data: profile } = await supabase.from('profiles').select('credits, tier').eq('id', user.id).single();
  if (!profile || profile.credits < 1) return NextResponse.json({ error: 'Insufficient credits' }, { status: 403 });

  const allergyStr = allergies?.length ? `Avoid: ${allergies.join(', ')}.` : '';
  const calorieStr = max_calories ? `Max ${max_calories} kcal per serving.` : '';
  const prompt = `Return valid JSON {recipes: [array of 5 objects]} with each recipe having: title, description, ingredients (array), steps (array), kcal_per_serving (number). Ingredients: ${ingredients.join(', ')}. ${servings} servings. ${calorieStr} ${allergyStr}`;

  try {
    const aiRes = await openai.chat.completions.create({
      model: 'gpt-4o',
      messages: [{ role: 'user', content: prompt }],
      response_format: { type: 'json_object' }
    });

    const { recipes } = JSON.parse(aiRes.choices[0].message.content!);

    await supabase.from('profiles').update({ credits: profile.credits - 1 }).eq('id', user.id);
    await supabase.from('recipes_history').insert({
      user_id: user.id,
      ingredients,
      recipe: recipes,
      max_calories,
      allergies,
      servings
    });

    return NextResponse.json(recipes);
  } catch {
    return NextResponse.json({ error: 'Failed to generate recipes' }, { status: 500 });
  }
}
