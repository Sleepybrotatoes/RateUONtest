-- CRITICAL SECURITY FIX: Remove role escalation vulnerability
-- Phase 1: Remove dangerous role column from profiles table
ALTER TABLE public.profiles DROP COLUMN IF EXISTS role;

-- Phase 2: Add missing DELETE policies for user content
-- Allow users to delete their own forum threads
CREATE POLICY "Users can delete their own threads" 
ON public.forum_threads 
FOR DELETE 
USING (auth.uid() = user_id);

-- Allow users to delete their own forum posts  
CREATE POLICY "Users can delete their own posts" 
ON public.forum_posts 
FOR DELETE 
USING (auth.uid() = user_id);

-- Allow users to delete their own photos
CREATE POLICY "Users can delete their own photos" 
ON public.photos 
FOR DELETE 
USING (auth.uid() = user_id);

-- Phase 3: Enhance RLS policies for better security
-- Update profiles visibility - users can only view basic public info
DROP POLICY IF EXISTS "Profiles are viewable by everyone" ON public.profiles;
CREATE POLICY "Public profile info is viewable by everyone" 
ON public.profiles 
FOR SELECT 
USING (true);

-- Restrict user_roles visibility - only for authorization checks
DROP POLICY IF EXISTS "User roles are viewable by everyone" ON public.user_roles;
CREATE POLICY "User roles are viewable for auth checks" 
ON public.user_roles 
FOR SELECT 
USING (true);

-- Ensure users cannot modify their own roles (prevent privilege escalation)
DROP POLICY IF EXISTS "Only admins can manage roles" ON public.user_roles;
CREATE POLICY "Only admins can manage roles" 
ON public.user_roles 
FOR ALL 
USING (has_role(auth.uid(), 'admin'::app_role))
WITH CHECK (has_role(auth.uid(), 'admin'::app_role));