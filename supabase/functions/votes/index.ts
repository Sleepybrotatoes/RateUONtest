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
    const supabase = createClient(
      Deno.env.get('SUPABASE_URL') ?? '',
      Deno.env.get('SUPABASE_ANON_KEY') ?? '',
      {
        auth: {
          autoRefreshToken: false,
          persistSession: false
        }
      }
    );

    const authHeader = req.headers.get('Authorization');
    if (authHeader) {
      supabase.auth.setAuth(authHeader.replace('Bearer ', ''));
    }

    const { data: { user } } = await supabase.auth.getUser();
    
    if (!user) {
      return new Response(
        JSON.stringify({ error: 'Authentication required' }),
        { status: 401, headers: { ...corsHeaders, 'Content-Type': 'application/json' } }
      );
    }

    if (req.method === 'POST') {
      const { votable_type, votable_id, vote_type } = await req.json();

      // Check if user already voted
      const { data: existingVote } = await supabase
        .from('votes')
        .select('*')
        .eq('user_id', user.id)
        .eq('votable_type', votable_type)
        .eq('votable_id', votable_id)
        .single();

      if (existingVote) {
        if (existingVote.vote_type === vote_type) {
          // Remove vote if same type
          await supabase
            .from('votes')
            .delete()
            .eq('id', existingVote.id);
        } else {
          // Update vote type
          await supabase
            .from('votes')
            .update({ vote_type })
            .eq('id', existingVote.id);
        }
      } else {
        // Create new vote
        await supabase
          .from('votes')
          .insert({
            user_id: user.id,
            votable_type,
            votable_id,
            vote_type
          });
      }

      // Update vote counts on the target item
      const { data: votes } = await supabase
        .from('votes')
        .select('vote_type')
        .eq('votable_type', votable_type)
        .eq('votable_id', votable_id);

      const upvotes = votes?.filter(v => v.vote_type === 'upvote').length || 0;
      const downvotes = votes?.filter(v => v.vote_type === 'downvote').length || 0;

      const tableName = votable_type === 'review' ? 'reviews' : 
                       votable_type === 'thread' ? 'forum_threads' : 'forum_posts';

      await supabase
        .from(tableName)
        .update({ upvotes, downvotes })
        .eq('id', votable_id);

      return new Response(JSON.stringify({ upvotes, downvotes }), {
        headers: { ...corsHeaders, 'Content-Type': 'application/json' },
      });
    }

    return new Response(
      JSON.stringify({ error: 'Method not allowed' }),
      { status: 405, headers: { ...corsHeaders, 'Content-Type': 'application/json' } }
    );
  } catch (error) {
    console.error('Votes error:', error);
    return new Response(
      JSON.stringify({ error: 'Internal server error' }),
      {
        status: 500,
        headers: { ...corsHeaders, 'Content-Type': 'application/json' },
      }
    );
  }
});