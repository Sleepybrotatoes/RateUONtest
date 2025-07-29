-- Create user profiles table
CREATE TABLE public.profiles (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  user_id UUID NOT NULL UNIQUE REFERENCES auth.users(id) ON DELETE CASCADE,
  username TEXT UNIQUE,
  display_name TEXT,
  avatar_url TEXT,
  bio TEXT,
  karma_points INTEGER DEFAULT 0,
  role TEXT DEFAULT 'user' CHECK (role IN ('user', 'moderator', 'admin')),
  is_banned BOOLEAN DEFAULT false,
  created_at TIMESTAMP WITH TIME ZONE DEFAULT now(),
  updated_at TIMESTAMP WITH TIME ZONE DEFAULT now()
);

-- Create app_role enum for better type safety
CREATE TYPE public.app_role AS ENUM ('user', 'moderator', 'admin');

-- Create user_roles table for role management
CREATE TABLE public.user_roles (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  user_id UUID NOT NULL REFERENCES auth.users(id) ON DELETE CASCADE,
  role app_role NOT NULL DEFAULT 'user',
  assigned_by UUID REFERENCES auth.users(id),
  assigned_at TIMESTAMP WITH TIME ZONE DEFAULT now(),
  UNIQUE(user_id, role)
);

-- Create professors table
CREATE TABLE public.professors (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  name TEXT NOT NULL,
  department TEXT,
  title TEXT,
  email TEXT,
  office_location TEXT,
  bio TEXT,
  avatar_url TEXT,
  overall_rating DECIMAL(3,2) DEFAULT 0,
  total_reviews INTEGER DEFAULT 0,
  created_at TIMESTAMP WITH TIME ZONE DEFAULT now(),
  updated_at TIMESTAMP WITH TIME ZONE DEFAULT now()
);

-- Create courses table
CREATE TABLE public.courses (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  code TEXT NOT NULL UNIQUE,
  name TEXT NOT NULL,
  description TEXT,
  credits INTEGER,
  department TEXT,
  level TEXT,
  prerequisites TEXT[],
  overall_rating DECIMAL(3,2) DEFAULT 0,
  difficulty_rating DECIMAL(3,2) DEFAULT 0,
  usefulness_rating DECIMAL(3,2) DEFAULT 0,
  workload_rating DECIMAL(3,2) DEFAULT 0,
  total_reviews INTEGER DEFAULT 0,
  created_at TIMESTAMP WITH TIME ZONE DEFAULT now(),
  updated_at TIMESTAMP WITH TIME ZONE DEFAULT now()
);

-- Create course_professors junction table
CREATE TABLE public.course_professors (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  course_id UUID NOT NULL REFERENCES public.courses(id) ON DELETE CASCADE,
  professor_id UUID NOT NULL REFERENCES public.professors(id) ON DELETE CASCADE,
  semester TEXT,
  year INTEGER,
  created_at TIMESTAMP WITH TIME ZONE DEFAULT now(),
  UNIQUE(course_id, professor_id, semester, year)
);

-- Create buildings table
CREATE TABLE public.buildings (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  name TEXT NOT NULL,
  code TEXT UNIQUE,
  location TEXT,
  description TEXT,
  building_type TEXT,
  facilities TEXT[],
  operating_hours JSONB,
  contact_info JSONB,
  overall_rating DECIMAL(3,2) DEFAULT 0,
  wifi_rating DECIMAL(3,2) DEFAULT 0,
  study_spaces_rating DECIMAL(3,2) DEFAULT 0,
  accessibility_rating DECIMAL(3,2) DEFAULT 0,
  cleanliness_rating DECIMAL(3,2) DEFAULT 0,
  total_reviews INTEGER DEFAULT 0,
  latitude DECIMAL(10,8),
  longitude DECIMAL(11,8),
  created_at TIMESTAMP WITH TIME ZONE DEFAULT now(),
  updated_at TIMESTAMP WITH TIME ZONE DEFAULT now()
);

-- Create cafes table
CREATE TABLE public.cafes (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  name TEXT NOT NULL,
  location TEXT,
  building_id UUID REFERENCES public.buildings(id),
  description TEXT,
  cuisine_type TEXT[],
  price_range TEXT CHECK (price_range IN ('$', '$$', '$$$', '$$$$')),
  operating_hours JSONB,
  contact_info JSONB,
  menu_url TEXT,
  overall_rating DECIMAL(3,2) DEFAULT 0,
  food_quality_rating DECIMAL(3,2) DEFAULT 0,
  value_rating DECIMAL(3,2) DEFAULT 0,
  service_rating DECIMAL(3,2) DEFAULT 0,
  atmosphere_rating DECIMAL(3,2) DEFAULT 0,
  total_reviews INTEGER DEFAULT 0,
  latitude DECIMAL(10,8),
  longitude DECIMAL(11,8),
  created_at TIMESTAMP WITH TIME ZONE DEFAULT now(),
  updated_at TIMESTAMP WITH TIME ZONE DEFAULT now()
);

-- Create reviews table
CREATE TABLE public.reviews (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  user_id UUID NOT NULL REFERENCES auth.users(id) ON DELETE CASCADE,
  reviewable_type TEXT NOT NULL CHECK (reviewable_type IN ('professor', 'course', 'building', 'cafe')),
  reviewable_id UUID NOT NULL,
  overall_rating INTEGER NOT NULL CHECK (overall_rating >= 1 AND overall_rating <= 5),
  specific_ratings JSONB, -- Store type-specific ratings
  title TEXT,
  content TEXT NOT NULL,
  tags TEXT[],
  is_anonymous BOOLEAN DEFAULT false,
  is_verified BOOLEAN DEFAULT false,
  upvotes INTEGER DEFAULT 0,
  downvotes INTEGER DEFAULT 0,
  is_flagged BOOLEAN DEFAULT false,
  flag_reason TEXT,
  is_moderated BOOLEAN DEFAULT false,
  semester TEXT,
  year INTEGER,
  created_at TIMESTAMP WITH TIME ZONE DEFAULT now(),
  updated_at TIMESTAMP WITH TIME ZONE DEFAULT now()
);

-- Create photos table
CREATE TABLE public.photos (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  user_id UUID NOT NULL REFERENCES auth.users(id) ON DELETE CASCADE,
  url TEXT NOT NULL,
  caption TEXT,
  related_type TEXT NOT NULL CHECK (related_type IN ('professor', 'course', 'building', 'cafe', 'review')),
  related_id UUID NOT NULL,
  is_flagged BOOLEAN DEFAULT false,
  is_moderated BOOLEAN DEFAULT false,
  created_at TIMESTAMP WITH TIME ZONE DEFAULT now()
);

-- Create forum_categories table
CREATE TABLE public.forum_categories (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  name TEXT NOT NULL UNIQUE,
  description TEXT,
  color TEXT,
  is_active BOOLEAN DEFAULT true,
  created_at TIMESTAMP WITH TIME ZONE DEFAULT now()
);

-- Create forum_threads table
CREATE TABLE public.forum_threads (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  user_id UUID NOT NULL REFERENCES auth.users(id) ON DELETE CASCADE,
  category_id UUID REFERENCES public.forum_categories(id),
  title TEXT NOT NULL,
  content TEXT NOT NULL,
  is_pinned BOOLEAN DEFAULT false,
  is_locked BOOLEAN DEFAULT false,
  is_anonymous BOOLEAN DEFAULT false,
  upvotes INTEGER DEFAULT 0,
  downvotes INTEGER DEFAULT 0,
  view_count INTEGER DEFAULT 0,
  reply_count INTEGER DEFAULT 0,
  last_reply_at TIMESTAMP WITH TIME ZONE DEFAULT now(),
  last_reply_user_id UUID REFERENCES auth.users(id),
  is_flagged BOOLEAN DEFAULT false,
  flag_reason TEXT,
  is_moderated BOOLEAN DEFAULT false,
  created_at TIMESTAMP WITH TIME ZONE DEFAULT now(),
  updated_at TIMESTAMP WITH TIME ZONE DEFAULT now()
);

-- Create forum_posts table
CREATE TABLE public.forum_posts (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  user_id UUID NOT NULL REFERENCES auth.users(id) ON DELETE CASCADE,
  thread_id UUID NOT NULL REFERENCES public.forum_threads(id) ON DELETE CASCADE,
  content TEXT NOT NULL,
  is_anonymous BOOLEAN DEFAULT false,
  upvotes INTEGER DEFAULT 0,
  downvotes INTEGER DEFAULT 0,
  is_flagged BOOLEAN DEFAULT false,
  flag_reason TEXT,
  is_moderated BOOLEAN DEFAULT false,
  created_at TIMESTAMP WITH TIME ZONE DEFAULT now(),
  updated_at TIMESTAMP WITH TIME ZONE DEFAULT now()
);

-- Create votes table
CREATE TABLE public.votes (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  user_id UUID NOT NULL REFERENCES auth.users(id) ON DELETE CASCADE,
  votable_type TEXT NOT NULL CHECK (votable_type IN ('review', 'thread', 'post')),
  votable_id UUID NOT NULL,
  vote_type TEXT NOT NULL CHECK (vote_type IN ('upvote', 'downvote')),
  created_at TIMESTAMP WITH TIME ZONE DEFAULT now(),
  UNIQUE(user_id, votable_type, votable_id)
);

-- Create flags table
CREATE TABLE public.flags (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  user_id UUID NOT NULL REFERENCES auth.users(id) ON DELETE CASCADE,
  flaggable_type TEXT NOT NULL CHECK (flaggable_type IN ('review', 'thread', 'post', 'photo')),
  flaggable_id UUID NOT NULL,
  reason TEXT NOT NULL,
  description TEXT,
  status TEXT DEFAULT 'pending' CHECK (status IN ('pending', 'reviewed', 'resolved', 'dismissed')),
  reviewed_by UUID REFERENCES auth.users(id),
  reviewed_at TIMESTAMP WITH TIME ZONE,
  created_at TIMESTAMP WITH TIME ZONE DEFAULT now(),
  UNIQUE(user_id, flaggable_type, flaggable_id)
);

-- Create bookmarks table
CREATE TABLE public.bookmarks (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  user_id UUID NOT NULL REFERENCES auth.users(id) ON DELETE CASCADE,
  bookmarkable_type TEXT NOT NULL CHECK (bookmarkable_type IN ('professor', 'course', 'building', 'cafe', 'thread')),
  bookmarkable_id UUID NOT NULL,
  created_at TIMESTAMP WITH TIME ZONE DEFAULT now(),
  UNIQUE(user_id, bookmarkable_type, bookmarkable_id)
);

-- Create badges table
CREATE TABLE public.badges (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  name TEXT NOT NULL UNIQUE,
  description TEXT,
  icon TEXT,
  color TEXT,
  requirements JSONB,
  is_active BOOLEAN DEFAULT true,
  created_at TIMESTAMP WITH TIME ZONE DEFAULT now()
);

-- Create user_badges table
CREATE TABLE public.user_badges (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  user_id UUID NOT NULL REFERENCES auth.users(id) ON DELETE CASCADE,
  badge_id UUID NOT NULL REFERENCES public.badges(id) ON DELETE CASCADE,
  earned_at TIMESTAMP WITH TIME ZONE DEFAULT now(),
  UNIQUE(user_id, badge_id)
);

-- Create notifications table
CREATE TABLE public.notifications (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  user_id UUID NOT NULL REFERENCES auth.users(id) ON DELETE CASCADE,
  type TEXT NOT NULL,
  title TEXT NOT NULL,
  message TEXT NOT NULL,
  data JSONB,
  is_read BOOLEAN DEFAULT false,
  created_at TIMESTAMP WITH TIME ZONE DEFAULT now()
);

-- Create storage buckets
INSERT INTO storage.buckets (id, name, public) 
VALUES 
  ('avatars', 'avatars', true),
  ('photos', 'photos', true),
  ('menus', 'menus', true)
ON CONFLICT (id) DO NOTHING;

-- Enable RLS on all tables
ALTER TABLE public.profiles ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.user_roles ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.professors ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.courses ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.course_professors ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.buildings ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.cafes ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.reviews ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.photos ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.forum_categories ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.forum_threads ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.forum_posts ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.votes ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.flags ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.bookmarks ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.badges ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.user_badges ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.notifications ENABLE ROW LEVEL SECURITY;

-- Create function to check user roles
CREATE OR REPLACE FUNCTION public.has_role(_user_id UUID, _role app_role)
RETURNS BOOLEAN
LANGUAGE sql
STABLE
SECURITY DEFINER
AS $$
  SELECT EXISTS (
    SELECT 1
    FROM public.user_roles
    WHERE user_id = _user_id AND role = _role
  )
$$;

-- Create function to handle new user registration
CREATE OR REPLACE FUNCTION public.handle_new_user()
RETURNS TRIGGER
LANGUAGE plpgsql
SECURITY DEFINER
SET search_path = ''
AS $$
BEGIN
  INSERT INTO public.profiles (user_id, username, display_name)
  VALUES (
    NEW.id,
    NEW.raw_user_meta_data ->> 'username',
    NEW.raw_user_meta_data ->> 'display_name'
  );
  
  INSERT INTO public.user_roles (user_id, role)
  VALUES (NEW.id, 'user');
  
  RETURN NEW;
END;
$$;

-- Create trigger for new users
CREATE TRIGGER on_auth_user_created
  AFTER INSERT ON auth.users
  FOR EACH ROW EXECUTE FUNCTION public.handle_new_user();

-- Create RLS policies for profiles
CREATE POLICY "Profiles are viewable by everyone" ON public.profiles FOR SELECT USING (true);
CREATE POLICY "Users can update their own profile" ON public.profiles FOR UPDATE USING (auth.uid() = user_id);

-- Create RLS policies for user_roles
CREATE POLICY "User roles are viewable by everyone" ON public.user_roles FOR SELECT USING (true);
CREATE POLICY "Only admins can manage roles" ON public.user_roles FOR ALL USING (public.has_role(auth.uid(), 'admin'));

-- Create RLS policies for public data (professors, courses, buildings, cafes)
CREATE POLICY "Public data is viewable by everyone" ON public.professors FOR SELECT USING (true);
CREATE POLICY "Public data is viewable by everyone" ON public.courses FOR SELECT USING (true);
CREATE POLICY "Public data is viewable by everyone" ON public.course_professors FOR SELECT USING (true);
CREATE POLICY "Public data is viewable by everyone" ON public.buildings FOR SELECT USING (true);
CREATE POLICY "Public data is viewable by everyone" ON public.cafes FOR SELECT USING (true);

-- Create RLS policies for reviews
CREATE POLICY "Reviews are viewable by everyone" ON public.reviews FOR SELECT USING (true);
CREATE POLICY "Users can create reviews" ON public.reviews FOR INSERT WITH CHECK (auth.uid() = user_id);
CREATE POLICY "Users can update their own reviews" ON public.reviews FOR UPDATE USING (auth.uid() = user_id);
CREATE POLICY "Users can delete their own reviews" ON public.reviews FOR DELETE USING (auth.uid() = user_id);

-- Create RLS policies for photos
CREATE POLICY "Photos are viewable by everyone" ON public.photos FOR SELECT USING (true);
CREATE POLICY "Users can upload photos" ON public.photos FOR INSERT WITH CHECK (auth.uid() = user_id);
CREATE POLICY "Users can update their own photos" ON public.photos FOR UPDATE USING (auth.uid() = user_id);

-- Create RLS policies for forum
CREATE POLICY "Forum categories are viewable by everyone" ON public.forum_categories FOR SELECT USING (true);
CREATE POLICY "Forum threads are viewable by everyone" ON public.forum_threads FOR SELECT USING (true);
CREATE POLICY "Users can create threads" ON public.forum_threads FOR INSERT WITH CHECK (auth.uid() = user_id);
CREATE POLICY "Users can update their own threads" ON public.forum_threads FOR UPDATE USING (auth.uid() = user_id);

CREATE POLICY "Forum posts are viewable by everyone" ON public.forum_posts FOR SELECT USING (true);
CREATE POLICY "Users can create posts" ON public.forum_posts FOR INSERT WITH CHECK (auth.uid() = user_id);
CREATE POLICY "Users can update their own posts" ON public.forum_posts FOR UPDATE USING (auth.uid() = user_id);

-- Create RLS policies for votes
CREATE POLICY "Users can view votes" ON public.votes FOR SELECT USING (true);
CREATE POLICY "Users can manage their own votes" ON public.votes FOR ALL USING (auth.uid() = user_id);

-- Create RLS policies for flags
CREATE POLICY "Users can create flags" ON public.flags FOR INSERT WITH CHECK (auth.uid() = user_id);
CREATE POLICY "Users can view their own flags" ON public.flags FOR SELECT USING (auth.uid() = user_id);
CREATE POLICY "Moderators can view all flags" ON public.flags FOR SELECT USING (public.has_role(auth.uid(), 'moderator') OR public.has_role(auth.uid(), 'admin'));

-- Create RLS policies for bookmarks
CREATE POLICY "Users can manage their own bookmarks" ON public.bookmarks FOR ALL USING (auth.uid() = user_id);

-- Create RLS policies for badges
CREATE POLICY "Badges are viewable by everyone" ON public.badges FOR SELECT USING (true);
CREATE POLICY "User badges are viewable by everyone" ON public.user_badges FOR SELECT USING (true);

-- Create RLS policies for notifications
CREATE POLICY "Users can view their own notifications" ON public.notifications FOR SELECT USING (auth.uid() = user_id);
CREATE POLICY "Users can update their own notifications" ON public.notifications FOR UPDATE USING (auth.uid() = user_id);

-- Create RLS policies for storage
CREATE POLICY "Avatar images are publicly accessible" ON storage.objects FOR SELECT USING (bucket_id = 'avatars');
CREATE POLICY "Users can upload their own avatar" ON storage.objects FOR INSERT WITH CHECK (bucket_id = 'avatars' AND auth.uid()::text = (storage.foldername(name))[1]);
CREATE POLICY "Users can update their own avatar" ON storage.objects FOR UPDATE USING (bucket_id = 'avatars' AND auth.uid()::text = (storage.foldername(name))[1]);

CREATE POLICY "Photos are publicly accessible" ON storage.objects FOR SELECT USING (bucket_id = 'photos');
CREATE POLICY "Users can upload photos" ON storage.objects FOR INSERT WITH CHECK (bucket_id = 'photos' AND auth.uid()::text = (storage.foldername(name))[1]);

CREATE POLICY "Menus are publicly accessible" ON storage.objects FOR SELECT USING (bucket_id = 'menus');
CREATE POLICY "Users can upload menus" ON storage.objects FOR INSERT WITH CHECK (bucket_id = 'menus' AND auth.uid()::text = (storage.foldername(name))[1]);

-- Insert default forum categories
INSERT INTO public.forum_categories (name, description, color) VALUES
('General Discussion', 'General campus discussions', '#3B82F6'),
('Course Help', 'Get help with courses and assignments', '#10B981'),
('Events', 'Campus events and activities', '#F59E0B'),
('Study Groups', 'Find study partners and groups', '#8B5CF6'),
('Campus Life', 'Life at UON discussions', '#EF4444'),
('Food & Dining', 'Restaurant and cafe discussions', '#F97316');

-- Insert default badges
INSERT INTO public.badges (name, description, icon, color, requirements) VALUES
('Welcome', 'Joined the community', '🎉', '#3B82F6', '{"type": "registration"}'),
('First Review', 'Posted your first review', '⭐', '#10B981', '{"type": "review_count", "count": 1}'),
('Prolific Reviewer', 'Posted 10 reviews', '📝', '#F59E0B', '{"type": "review_count", "count": 10}'),
('Campus Expert', 'Posted 50 reviews', '🏆', '#EF4444', '{"type": "review_count", "count": 50}'),
('Helpful', 'Received 25 upvotes', '👍', '#8B5CF6', '{"type": "upvotes", "count": 25}'),
('Forum Regular', 'Posted 10 forum posts', '💬', '#06B6D4', '{"type": "forum_posts", "count": 10}');

-- Create function to update updated_at timestamp
CREATE OR REPLACE FUNCTION public.update_updated_at_column()
RETURNS TRIGGER AS $$
BEGIN
  NEW.updated_at = now();
  RETURN NEW;
END;
$$ LANGUAGE plpgsql;

-- Create triggers for updated_at
CREATE TRIGGER update_profiles_updated_at BEFORE UPDATE ON public.profiles FOR EACH ROW EXECUTE FUNCTION public.update_updated_at_column();
CREATE TRIGGER update_professors_updated_at BEFORE UPDATE ON public.professors FOR EACH ROW EXECUTE FUNCTION public.update_updated_at_column();
CREATE TRIGGER update_courses_updated_at BEFORE UPDATE ON public.courses FOR EACH ROW EXECUTE FUNCTION public.update_updated_at_column();
CREATE TRIGGER update_buildings_updated_at BEFORE UPDATE ON public.buildings FOR EACH ROW EXECUTE FUNCTION public.update_updated_at_column();
CREATE TRIGGER update_cafes_updated_at BEFORE UPDATE ON public.cafes FOR EACH ROW EXECUTE FUNCTION public.update_updated_at_column();
CREATE TRIGGER update_reviews_updated_at BEFORE UPDATE ON public.reviews FOR EACH ROW EXECUTE FUNCTION public.update_updated_at_column();
CREATE TRIGGER update_forum_threads_updated_at BEFORE UPDATE ON public.forum_threads FOR EACH ROW EXECUTE FUNCTION public.update_updated_at_column();
CREATE TRIGGER update_forum_posts_updated_at BEFORE UPDATE ON public.forum_posts FOR EACH ROW EXECUTE FUNCTION public.update_updated_at_column();