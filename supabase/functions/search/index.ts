import { serve } from "https://deno.land/std@0.190.0/http/server.ts";
import { createClient } from "https://esm.sh/@supabase/supabase-js@2.53.0";

const corsHeaders = {
  'Access-Control-Allow-Origin': '*',
  'Access-Control-Allow-Headers': 'authorization, x-client-info, apikey, content-type',
};

serve(async (req) => {
  if (req.method === 'OPTIONS') {
    return new Response(null, { headers: corsHeaders });
  }

  try {
    const url = new URL(req.url);
    const query = url.searchParams.get('query') || '';
    const type = url.searchParams.get('type') || 'all';
    const limit = parseInt(url.searchParams.get('limit') || '20');
    
    const supabase = createClient(
      Deno.env.get('SUPABASE_URL') ?? '',
      Deno.env.get('SUPABASE_ANON_KEY') ?? ''
    );

    let results: any = {};

    if (type === 'all' || type === 'professors') {
      const { data: professors } = await supabase
        .from('professors')
        .select('*')
        .ilike('name', `%${query}%`)
        .limit(limit);
      results.professors = professors;
    }

    if (type === 'all' || type === 'courses') {
      const { data: courses } = await supabase
        .from('courses')
        .select('*')
        .or(`name.ilike.%${query}%,code.ilike.%${query}%`)
        .limit(limit);
      results.courses = courses;
    }

    if (type === 'all' || type === 'buildings') {
      const { data: buildings } = await supabase
        .from('buildings')
        .select('*')
        .or(`name.ilike.%${query}%,code.ilike.%${query}%`)
        .limit(limit);
      results.buildings = buildings;
    }

    if (type === 'all' || type === 'cafes') {
      const { data: cafes } = await supabase
        .from('cafes')
        .select('*')
        .ilike('name', `%${query}%`)
        .limit(limit);
      results.cafes = cafes;
    }

    return new Response(JSON.stringify(results), {
      headers: { ...corsHeaders, 'Content-Type': 'application/json' },
    });
  } catch (error) {
    console.error('Search error:', error);
    return new Response(
      JSON.stringify({ error: 'Internal server error' }),
      {
        status: 500,
        headers: { ...corsHeaders, 'Content-Type': 'application/json' },
      }
    );
  }
});