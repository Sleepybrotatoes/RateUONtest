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

    // Get the JWT token from the Authorization header
    const authHeader = req.headers.get('Authorization');
    if (authHeader) {
      supabase.auth.setAuth(authHeader.replace('Bearer ', ''));
    }

    if (req.method === 'GET') {
      const url = new URL(req.url);
      const itemId = url.searchParams.get('itemId');
      const type = url.searchParams.get('type');
      
      if (!itemId || !type) {
        return new Response(
          JSON.stringify({ error: 'Missing itemId or type parameter' }),
          { status: 400, headers: { ...corsHeaders, 'Content-Type': 'application/json' } }
        );
      }

      const { data: reviews, error } = await supabase
        .from('reviews')
        .select(`
          *,
          profiles!inner(username, display_name, avatar_url)
        `)
        .eq('reviewable_type', type)
        .eq('reviewable_id', itemId)
        .order('created_at', { ascending: false });

      if (error) throw error;

      return new Response(JSON.stringify(reviews), {
        headers: { ...corsHeaders, 'Content-Type': 'application/json' },
      });
    }

    if (req.method === 'POST') {
      const { reviewable_type, reviewable_id, overall_rating, specific_ratings, title, content, tags, is_anonymous, semester, year } = await req.json();
      
      const { data: { user } } = await supabase.auth.getUser();
      
      if (!user) {
        return new Response(
          JSON.stringify({ error: 'Authentication required' }),
          { status: 401, headers: { ...corsHeaders, 'Content-Type': 'application/json' } }
        );
      }

      const { data: review, error } = await supabase
        .from('reviews')
        .insert({
          user_id: user.id,
          reviewable_type,
          reviewable_id,
          overall_rating,
          specific_ratings,
          title,
          content,
          tags,
          is_anonymous,
          semester,
          year
        })
        .select()
        .single();

      if (error) throw error;

      // Update the rating for the reviewed item
      await updateItemRating(supabase, reviewable_type, reviewable_id);

      return new Response(JSON.stringify(review), {
        headers: { ...corsHeaders, 'Content-Type': 'application/json' },
      });
    }

    return new Response(
      JSON.stringify({ error: 'Method not allowed' }),
      { status: 405, headers: { ...corsHeaders, 'Content-Type': 'application/json' } }
    );
  } catch (error) {
    console.error('Reviews error:', error);
    return new Response(
      JSON.stringify({ error: 'Internal server error' }),
      {
        status: 500,
        headers: { ...corsHeaders, 'Content-Type': 'application/json' },
      }
    );
  }
});

async function updateItemRating(supabase: any, type: string, id: string) {
  const { data: reviews } = await supabase
    .from('reviews')
    .select('overall_rating, specific_ratings')
    .eq('reviewable_type', type)
    .eq('reviewable_id', id);

  if (!reviews || reviews.length === 0) return;

  const totalReviews = reviews.length;
  const avgOverallRating = reviews.reduce((sum: number, review: any) => sum + review.overall_rating, 0) / totalReviews;

  let updateData: any = {
    overall_rating: parseFloat(avgOverallRating.toFixed(2)),
    total_reviews: totalReviews
  };

  // Calculate specific ratings based on type
  if (type === 'course') {
    const avgDifficulty = reviews.reduce((sum: number, review: any) => sum + (review.specific_ratings?.difficulty || 0), 0) / totalReviews;
    const avgUsefulness = reviews.reduce((sum: number, review: any) => sum + (review.specific_ratings?.usefulness || 0), 0) / totalReviews;
    const avgWorkload = reviews.reduce((sum: number, review: any) => sum + (review.specific_ratings?.workload || 0), 0) / totalReviews;
    
    updateData = {
      ...updateData,
      difficulty_rating: parseFloat(avgDifficulty.toFixed(2)),
      usefulness_rating: parseFloat(avgUsefulness.toFixed(2)),
      workload_rating: parseFloat(avgWorkload.toFixed(2))
    };
  } else if (type === 'building') {
    const avgWifi = reviews.reduce((sum: number, review: any) => sum + (review.specific_ratings?.wifi || 0), 0) / totalReviews;
    const avgStudySpaces = reviews.reduce((sum: number, review: any) => sum + (review.specific_ratings?.study_spaces || 0), 0) / totalReviews;
    const avgAccessibility = reviews.reduce((sum: number, review: any) => sum + (review.specific_ratings?.accessibility || 0), 0) / totalReviews;
    const avgCleanliness = reviews.reduce((sum: number, review: any) => sum + (review.specific_ratings?.cleanliness || 0), 0) / totalReviews;
    
    updateData = {
      ...updateData,
      wifi_rating: parseFloat(avgWifi.toFixed(2)),
      study_spaces_rating: parseFloat(avgStudySpaces.toFixed(2)),
      accessibility_rating: parseFloat(avgAccessibility.toFixed(2)),
      cleanliness_rating: parseFloat(avgCleanliness.toFixed(2))
    };
  }

  await supabase
    .from(type === 'professor' ? 'professors' : type === 'course' ? 'courses' : type === 'building' ? 'buildings' : 'cafes')
    .update(updateData)
    .eq('id', id);
}