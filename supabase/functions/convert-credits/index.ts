import { serve } from 'https://deno.land/std@0.177.0/http/server.ts';
import { createClient } from 'https://esm.sh/@supabase/supabase-js@2.31.0';

const supabase = createClient(
  Deno.env.get('SUPABASE_URL')!,
  Deno.env.get('SUPABASE_SERVICE_ROLE_KEY')!
);

serve(async (req) => {
  if (req.method !== 'POST') return new Response('Method not allowed', { status: 405 });

  const authHeader = req.headers.get('Authorization');
  if (!authHeader) return new Response('Unauthorized', { status: 401 });

  const { data: { user }, error: authError } = await supabase.auth.getUser(authHeader.replace('Bearer ', ''));
  if (authError || !user) return new Response('Unauthorized', { status: 401 });

  const { data: profile, error: profileError } = await supabase
    .from('profiles')
    .select('credits, tss_credits')
    .eq('id', user.id)
    .single();

  if (profileError || !profile) return new Response('Profile not found', { status: 404 });
  if (profile.credits < 20) return new Response('Need at least 20 credits to convert', { status: 400 });

  const { error: updateError } = await supabase
    .from('profiles')
    .update({
      credits: profile.credits - 20,
      tss_credits: profile.tss_credits + 1
    })
    .eq('id', user.id);

  if (updateError) return new Response(JSON.stringify({ error: updateError.message }), { status: 500 });

  return new Response(JSON.stringify({ success: true, message: 'Converted 20 credits to 1 TSS credit' }), {
    headers: { 'Content-Type': 'application/json' }
  });
});
